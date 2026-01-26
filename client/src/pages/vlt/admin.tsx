import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Tab = "leads" | "affiliates";

export default function VLTAdmin() {
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAffiliate, setShowAddAffiliate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [leadsRes, affiliatesRes] = await Promise.all([
        fetch("/api/admin/vlt-intake"),
        fetch("/api/admin/vlt-affiliates")
      ]);
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (affiliatesRes.ok) setAffiliates(await affiliatesRes.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function updateLead(id: number, updates: any) {
    await fetch(`/api/admin/vlt-intake/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    fetchData();
  }

  async function addAffiliate(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    
    const res = await fetch("/api/admin/vlt-affiliates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      setShowAddAffiliate(false);
      fetchData();
    }
  }

  async function deleteAffiliate(id: number) {
    if (!confirm("Delete this affiliate?")) return;
    await fetch(`/api/admin/vlt-affiliates/${id}`, { method: "DELETE" });
    fetchData();
  }

  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-vlt-admin">VLT Admin Portal</h1>

        <div className="mt-6 flex gap-4 border-b">
          <button
            onClick={() => setTab("leads")}
            className={`pb-2 px-4 ${tab === "leads" ? "border-b-2 border-brand-red font-semibold" : ""}`}
            data-testid="tab-leads"
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setTab("affiliates")}
            className={`pb-2 px-4 ${tab === "affiliates" ? "border-b-2 border-brand-red font-semibold" : ""}`}
            data-testid="tab-affiliates"
          >
            Affiliates ({affiliates.length})
          </button>
        </div>

        {loading && <p className="mt-4">Loading...</p>}

        {!loading && tab === "leads" && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left border">ID</th>
                  <th className="p-2 text-left border">Type</th>
                  <th className="p-2 text-left border">Name</th>
                  <th className="p-2 text-left border">Email</th>
                  <th className="p-2 text-left border">Issue</th>
                  <th className="p-2 text-left border">Status</th>
                  <th className="p-2 text-left border">Referral</th>
                  <th className="p-2 text-left border">Created</th>
                  <th className="p-2 text-left border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b">
                    <td className="p-2 border">{lead.id}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        lead.leadType === "affiliate_referral" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {lead.leadType === "affiliate_referral" ? "Referral" : "Direct"}
                      </span>
                    </td>
                    <td className="p-2 border">
                      {lead.name}
                      {lead.referrerName && (
                        <div className="text-xs text-gray-500">via {lead.referrerName}</div>
                      )}
                    </td>
                    <td className="p-2 border">{lead.email}</td>
                    <td className="p-2 border">{lead.issue}</td>
                    <td className="p-2 border">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                        className="border p-1 rounded text-xs"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="p-2 border text-xs">
                      {lead.referralCode || "-"}
                      {lead.referredByL1 && <span className="text-green-600"> (Aff #{lead.referredByL1})</span>}
                    </td>
                    <td className="p-2 border text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 border">
                      <button 
                        onClick={() => {
                          const notes = prompt("Add notes:", lead.notes || "");
                          if (notes !== null) updateLead(lead.id, { notes });
                        }}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && <p className="mt-4 text-gray-500">No leads yet.</p>}
          </div>
        )}

        {!loading && tab === "affiliates" && (
          <div className="mt-6">
            <button
              onClick={() => setShowAddAffiliate(true)}
              className="mb-4 px-4 py-2 bg-brand-red text-white rounded hover:bg-brand-red/90"
              data-testid="button-add-affiliate"
            >
              + Add Affiliate
            </button>

            {showAddAffiliate && (
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h3 className="font-semibold mb-3">Add New Affiliate</h3>
                <form onSubmit={addAffiliate} className="grid md:grid-cols-2 gap-4" autoComplete="off">
                  <input name="name" placeholder="Name" required className="border p-2 rounded" autoComplete="off" />
                  <input name="email" type="email" placeholder="Email" required className="border p-2 rounded" autoComplete="off" />
                  <input name="phone" placeholder="Phone" className="border p-2 rounded" autoComplete="off" />
                  <input name="password" type="password" placeholder="Password" required className="border p-2 rounded" autoComplete="new-password" />
                  <input name="uplineCode" placeholder="Upline Referral Code (optional)" className="border p-2 rounded" autoComplete="off" />
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-brand-navy text-white rounded">Create</button>
                    <button type="button" onClick={() => setShowAddAffiliate(false)} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left border">ID</th>
                  <th className="p-2 text-left border">Name</th>
                  <th className="p-2 text-left border">Email</th>
                  <th className="p-2 text-left border">Referral Code</th>
                  <th className="p-2 text-left border">Total Leads</th>
                  <th className="p-2 text-left border">Upline L1</th>
                  <th className="p-2 text-left border">Status</th>
                  <th className="p-2 text-left border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((aff) => (
                  <tr key={aff.id} className="border-b">
                    <td className="p-2 border">{aff.id}</td>
                    <td className="p-2 border">{aff.name}</td>
                    <td className="p-2 border">{aff.email}</td>
                    <td className="p-2 border font-mono text-xs">{aff.referralCode}</td>
                    <td className="p-2 border">{aff.totalLeads || 0}</td>
                    <td className="p-2 border">{aff.level1Id || "-"}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${aff.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {aff.status}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <button onClick={() => deleteAffiliate(aff.id)} className="text-red-600 text-xs hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {affiliates.length === 0 && <p className="mt-4 text-gray-500">No affiliates yet.</p>}
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="/veteran-led-tax/partners" className="text-brand-navy hover:underline">Partner Dashboard</a></li>
            <li><a href="/veteran-led-tax/pay" className="text-brand-navy hover:underline">Collect Payment</a></li>
            <li><a href="/veteran-led-tax/articles" className="text-brand-navy hover:underline">SEO Articles</a></li>
          </ul>
        </div>
      </Container>
      <Footer />
    </>
  );
}

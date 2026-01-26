import { useState, useEffect } from "react";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VLTAffiliatePortal() {
  const [affiliate, setAffiliate] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginMode, setLoginMode] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const res = await fetch("/api/vlt-affiliate/me");
    if (res.ok) {
      const data = await res.json();
      setAffiliate(data);
      fetchLeads();
      setLoginMode(false);
    }
    setLoading(false);
  }

  async function fetchLeads() {
    const res = await fetch("/api/vlt-affiliate/leads");
    if (res.ok) {
      setLeads(await res.json());
    }
  }

  async function login(e: any) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.target);
    
    const res = await fetch("/api/vlt-affiliate/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      setAffiliate(data.affiliate);
      setLoginMode(false);
      fetchLeads();
    } else {
      setError("Invalid email or password");
    }
  }

  async function logout() {
    await fetch("/api/vlt-affiliate/logout", { method: "POST" });
    setAffiliate(null);
    setLeads([]);
    setLoginMode(true);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Container>
          <p className="mt-12">Loading...</p>
        </Container>
        <Footer />
      </>
    );
  }

  if (loginMode) {
    return (
      <>
        <Navbar />
        <Container>
          <h1 className="text-3xl font-bold mt-12 text-brand-navy">VLT Affiliate Login</h1>
          
          <form onSubmit={login} className="mt-6 max-w-md space-y-4">
            {error && <p className="text-red-600">{error}</p>}
            <input name="email" type="email" placeholder="Email" required className="border p-3 w-full rounded" />
            <input name="password" type="password" placeholder="Password" required className="border p-3 w-full rounded" />
            <button type="submit" className="w-full py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90">
              Login
            </button>
          </form>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <div className="flex justify-between items-center mt-12">
          <h1 className="text-3xl font-bold text-brand-navy" data-testid="heading-affiliate-portal">
            Welcome, {affiliate?.name}
          </h1>
          <button onClick={logout} className="text-sm text-gray-600 hover:underline">Logout</button>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Your Referral Code</p>
            <p className="text-2xl font-bold font-mono text-brand-navy">{affiliate?.referralCode}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Leads</p>
            <p className="text-2xl font-bold text-green-700">{affiliate?.totalLeads || 0}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-2xl font-bold text-purple-700 capitalize">{affiliate?.status}</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">Your Referral Link</h3>
          <p className="mt-2 font-mono text-sm break-all bg-white p-2 rounded border">
            {window.location.origin}/veteran-led-tax/intake?ref={affiliate?.referralCode}
          </p>
          <p className="mt-2 text-sm text-gray-600">Share this link to track your referrals.</p>
        </div>

        <h2 className="text-xl font-semibold mt-8 text-brand-navy">Your Leads</h2>
        
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border">Name</th>
                <th className="p-2 text-left border">Email</th>
                <th className="p-2 text-left border">Issue</th>
                <th className="p-2 text-left border">Status</th>
                <th className="p-2 text-left border">Date</th>
                <th className="p-2 text-left border">Level</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                let level = "-";
                if (lead.referredByL1 === affiliate?.id) level = "E6 (Direct)";
                else if (lead.referredByL2 === affiliate?.id) level = "E5";
                else if (lead.referredByL3 === affiliate?.id) level = "E4";
                else if (lead.referredByL4 === affiliate?.id) level = "E3";
                else if (lead.referredByL5 === affiliate?.id) level = "E2";
                else if (lead.referredByL6 === affiliate?.id) level = "E1";
                
                return (
                  <tr key={lead.id} className="border-b">
                    <td className="p-2 border">{lead.name}</td>
                    <td className="p-2 border">{lead.email}</td>
                    <td className="p-2 border">{lead.issue}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded text-xs ${
                        lead.status === "converted" ? "bg-green-100 text-green-700" :
                        lead.status === "new" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-2 border text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="p-2 border text-xs">{level}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {leads.length === 0 && <p className="mt-4 text-gray-500">No leads yet. Share your referral link to start earning!</p>}
        </div>
      </Container>
      <Footer />
    </>
  );
}

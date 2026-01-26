import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileSignature, CheckCircle, AlertTriangle } from "lucide-react";

export default function AffiliateNda() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    veteranNumber: "",
    address: "",
    customReferralCode: "",
    agreedToTerms: false,
  });

  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Not authenticated");
      return res.json();
    },
  });

  const { data: ndaStatus, isLoading: ndaLoading } = useQuery({
    queryKey: ["/api/affiliate/nda-status"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/nda-status");
      if (!res.ok) throw new Error("Failed to check NDA status");
      return res.json();
    },
    enabled: !!authData,
  });

  const signNdaMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/affiliate/sign-nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to sign NDA");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate/nda-status"] });
      queryClient.invalidateQueries({ queryKey: ["affiliate-nda-status"] });
      toast({ title: "NDA Signed Successfully!", description: "Welcome to the NavigatorUSA affiliate program." });
      setLocation("/affiliate/dashboard");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast({ title: "Please agree to the terms", variant: "destructive" });
      return;
    }
    
    const canvas = canvasRef.current;
    const signatureData = canvas?.toDataURL("image/png") || null;
    
    signNdaMutation.mutate({
      ...formData,
      signatureData,
    });
  };

  // Redirect to login if not authenticated or not an affiliate
  useEffect(() => {
    if (!authLoading && (!authData || authData.user?.role !== "affiliate")) {
      setLocation("/affiliate/login");
    }
  }, [authLoading, authData, setLocation]);

  // Redirect to dashboard if NDA is already signed
  useEffect(() => {
    if (!ndaLoading && ndaStatus?.hasSigned) {
      setLocation("/affiliate/dashboard");
    }
  }, [ndaLoading, ndaStatus, setLocation]);

  if (authLoading || ndaLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!authData || authData.user?.role !== "affiliate") {
    return null;
  }

  if (ndaStatus?.hasSigned) {
    return null;
  }

  const today = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-navy to-brand-navy/90 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-brand-navy p-6 text-center">
            <Shield className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Affiliate Confidentiality Agreement</h1>
            <p className="text-white/80">Navigator USA Corp - Veterans' Family Resources</p>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-800">Important Notice</h3>
                  <p className="text-sm text-blue-700">
                    Before accessing the affiliate portal, you must agree to this good-faith confidentiality agreement.
                    This protects our veteran community and ensures the integrity of our programs.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-8 text-gray-700 border rounded-lg p-6 bg-gray-50">
              <h2 className="text-lg font-bold text-brand-navy text-center">NON-CIRCUMVENTION, NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT</h2>
              
              <p className="text-sm text-center">
                <strong>Effective Date:</strong> {today}
              </p>
              
              <p>
                This Non-Circumvention, Non-Disclosure and Confidentiality Agreement ("Agreement") is entered into between 
                <strong> Navigator USA Corp</strong>, a 501(c)(3) non-profit organization (EIN: 88-3349582), located at 
                429 D Shoreline Village Dr, Long Beach, CA 90802 ("Organization"), and the undersigned party ("Signatory"), 
                collectively referred to as the "Parties."
              </p>

              <h3 className="text-md font-bold mt-4">1. DEFINITIONS</h3>
              <p className="text-sm">
                <strong>"Affiliates"</strong> means any entity or person controlled by, under common control with, or controlling 
                a Party, including but not limited to: subsidiaries, parent companies, stockholders, partners, co-ventures, 
                trading partners, joint ventures, divisions, and other associated organizations.
              </p>
              <p className="text-sm">
                <strong>"Representatives"</strong> means any and all directors, officers, employees, agents, consultants, 
                contractors, attorneys, accountants, advisors, assigns, designees, heirs, successors, family members, 
                or representatives of a Party or its Affiliates.
              </p>
              <p className="text-sm">
                <strong>"Confidential Information"</strong> includes but is not limited to: names, identities, addresses, 
                telephone numbers, email addresses, bank codes, account numbers, financial references, trade secrets, 
                proprietary formulas, business methods, processes, customer lists, supplier lists, pricing information, 
                commission structures, referral tracking systems, safety protocols, and any information regarding contacts, 
                sources, intermediaries, or potential acquisitions disclosed orally, in writing, electronically, visually, 
                or by demonstration.
              </p>

              <h3 className="text-md font-bold">2. PURPOSE & MISSION</h3>
              <p>
                Navigator USA Corp is a tax-exempt public charity dedicated to supporting veteran families through 
                education, healthcare assistance, and financial empowerment programs. The affiliate ecosystem exists 
                to help veterans earn income while contributing to this mission.
              </p>

              <h3 className="text-md font-bold">3. NON-DISCLOSURE & CONFIDENTIALITY</h3>
              <p>
                The Signatory agrees, both directly and indirectly, for themselves and on behalf of all Affiliates 
                and Representatives, to the following:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Maintain complete confidentiality regarding all Confidential Information</li>
                <li>Not disclose, reveal, or make use of any Confidential Information without specific written permission</li>
                <li>Cause all Affiliates and Representatives to sign confidentiality agreements at least as protective as this Agreement</li>
                <li>Ensure that all Affiliates, Representatives, employees, officers, directors, agents, consultants, and advisors who are given access to Confidential Information shall be bound by and comply with the terms of this Agreement</li>
                <li><strong>RECEIVING PARTY LIABILITY:</strong> The Signatory shall be fully liable for any breach of this Agreement by their Affiliates, Representatives, employees, agents, or any third parties to whom Confidential Information has been disclosed by such persons or entities</li>
              </ul>

              <h3 className="text-md font-bold">4. NON-CIRCUMVENTION</h3>
              <p className="font-semibold text-brand-red">
                The Signatory agrees, both DIRECTLY and INDIRECTLY, not to circumvent, avoid, bypass, or interfere 
                with the Organization, its Affiliates, or Representatives:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Scope of Prohibition:</strong> This prohibition applies whether such circumvention is conducted (a) directly by the Signatory, (b) indirectly through Affiliates, Representatives, or third parties, (c) through any corporate restructuring, subsidiary formation, or related entity, or (d) through family members, friends, associates, or any other proxies</li>
                <li><strong>Protected Relationships:</strong> The Signatory shall not contact, solicit, accept, or conduct any business with any clients, prospects, vendors, investors, banks, funding sources, suppliers, customers, or business opportunities introduced by or discovered through the Organization without express written permission</li>
                <li><strong>No Bypass Attempts:</strong> The Signatory shall not attempt to bypass, circumvent, avoid, or interfere with the Organization's referral tracking, attribution systems, or commission structures by any means whatsoever</li>
                <li><strong>No Competitive Interference:</strong> The Signatory shall not introduce clients, prospects, or contacts to competing organizations, services, or individuals that would reduce, divert, or eliminate commissions, fees, or benefits owed to any party in the affiliate network</li>
                <li><strong>Protection of Introductions:</strong> All relationships, introductions, and business opportunities developed through the Organization belong to the Organization and its affiliate network in perpetuity</li>
                <li><strong>No Solicitation:</strong> The Signatory shall not solicit, recruit, or encourage any affiliate, employee, contractor, or representative of the Organization to terminate their relationship or to join any competing organization</li>
              </ul>

              <h3 className="text-md font-bold">5. BINDING EFFECT ON ALL PARTIES</h3>
              <p className="font-semibold bg-yellow-50 p-3 rounded border border-yellow-200">
                This Agreement shall be binding upon all Parties and their heirs, successors, associates, Affiliates, 
                Representatives, assigns, employees, agents, consultants, contractors, family members, friends, 
                business partners, and any individual, firm, company, corporation, joint venture, partnership, 
                division, subsidiary, or other entity of which the Signatory is an agent, officer, heir, successor, 
                assign, designee, or beneficial owner. The Signatory represents that they have full authority to 
                bind all such persons and entities to the terms of this Agreement.
              </p>

              <h3 className="text-md font-bold">6. GOOD FAITH & FAIR DEALING</h3>
              <p>
                The Signatory agrees to operate in good faith, understanding that this ecosystem is designed to:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Help veterans generate income for themselves and their families</li>
                <li>Support Navigator USA Corp's mission of veteran education and healthcare</li>
                <li>Create sustainable opportunities for the veteran community</li>
                <li>Maintain fair commission distribution among all network participants</li>
              </ul>

              <h3 className="text-md font-bold">7. SAFETY, SECURITY AND CIRCUMVENTION PROTOCOLS</h3>
              <p>
                The Signatory acknowledges that the Organization employs comprehensive safety, security, and circumvention 
                protocols including but not limited to IP tracking, cookie-based attribution, referral link monitoring, 
                and 30-day first-touch attribution. These protocols are confidential and proprietary. The Signatory 
                agrees not to share, disclose, discuss, or attempt to circumvent these systems.
              </p>

              <h3 className="text-md font-bold">8. PENALTIES FOR BREACH</h3>
              <p className="font-semibold text-brand-red">
                In the event of circumvention or breach of this Agreement by the Signatory, directly or indirectly, 
                or by their Affiliates, Representatives, agents, or any third parties acting on their behalf:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Monetary Penalty:</strong> The breaching party shall pay a legal monetary penalty equal to THREE (3) TIMES the commission, fee, or maximum financial benefit the non-breaching party should have realized from such transaction</li>
                <li><strong>Additional Damages:</strong> PLUS all expenses incurred including legal costs, attorney fees, court costs, investigation costs, and lost profits and business opportunities</li>
                <li><strong>Injunctive Relief:</strong> The Organization shall be entitled to seek injunctive relief and equitable remedies to restrain the breaching party, their Affiliates, Representatives, and agents from continuing the breach</li>
                <li><strong>Forfeiture:</strong> Violators may be permanently removed from the affiliate network with immediate forfeiture of all pending and future commissions</li>
                <li><strong>Criminal Referral:</strong> The Organization reserves the right to refer matters involving theft of trade secrets or intentional interference to appropriate law enforcement authorities</li>
              </ul>

              <h3 className="text-md font-bold">9. ETHICS & PROFESSIONAL CONDUCT</h3>
              <p>
                The Signatory agrees, both directly and indirectly, for themselves and on behalf of all Affiliates 
                and Representatives, to maintain the highest ethical standards in all dealings:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Integrity:</strong> Act with honesty, transparency, and integrity in all business activities connected with Navigator USA Corp</li>
                <li><strong>Anti-Corruption:</strong> Not offer, solicit, accept, or pay any bribe, kickback, facilitation payment, or other improper payment directly or indirectly in connection with this Agreement or any Organization business</li>
                <li><strong>Conflicts of Interest:</strong> Disclose any real or apparent conflicts of interest that may compromise professional judgment or the interests of the Organization</li>
                <li><strong>Gifts & Benefits:</strong> Not offer, solicit, or accept any substantial gifts, extravagant entertainment, or payments that could create an appearance of impropriety</li>
                <li><strong>Compliance:</strong> Comply with all applicable federal, state, and local laws, regulations, and industry standards</li>
                <li><strong>Professional Representation:</strong> Represent the Organization professionally and accurately, never making false, misleading, or exaggerated claims about services, benefits, or compensation</li>
                <li><strong>Veteran Community:</strong> Honor the mission of serving veteran families with respect, dignity, and genuine care for their wellbeing</li>
              </ul>

              <h3 className="text-md font-bold">10. ANTI-DEFAMATION & NON-DISPARAGEMENT</h3>
              <p className="font-semibold text-brand-red">
                The Signatory agrees, both DIRECTLY and INDIRECTLY, to refrain from any disparagement, defamation, 
                libel, or slander of the Organization:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>Prohibited Conduct:</strong> The Signatory shall not make, publish, or communicate to any person, entity, or public forum any defamatory, disparaging, negative, or harmful remarks, comments, or statements concerning Navigator USA Corp, its businesses, programs, services, officers, directors, employees, affiliates, volunteers, or any associated third parties</li>
                <li><strong>Scope:</strong> This prohibition applies to all forms of communication including but not limited to: oral statements, written documents, social media posts, online reviews, blog posts, forum comments, video content, podcasts, interviews, and any electronic or digital communications</li>
                <li><strong>Third Party Communications:</strong> The Signatory shall not encourage, induce, or assist any third party (including family members, friends, associates, or Affiliates) to make disparaging statements about the Organization</li>
                <li><strong>Mutual Obligation:</strong> The Organization agrees to instruct its officers and directors to refrain from making disparaging statements about the Signatory that are harmful to their business or personal reputation</li>
                <li><strong>Legal Exemptions:</strong> This provision does not restrict either party from: (a) making truthful statements required by applicable law, regulation, or legal process; (b) communicating with government agencies; (c) exercising protected rights under whistleblower provisions; or (d) enforcing this Agreement</li>
                <li><strong>Immediate Remedies:</strong> Any breach of this anti-defamation provision shall entitle the Organization to seek immediate injunctive relief without posting bond, plus actual damages, reputational damages, and reasonable attorney fees</li>
              </ul>

              <h3 className="text-md font-bold">11. TERM & SURVIVAL</h3>
              <p>
                This Agreement shall remain in full force and effect for a period of TEN (10) YEARS from the date of 
                execution, or until terminated by mutual written consent. The non-disclosure, non-circumvention, ethics, 
                anti-defamation, and confidentiality obligations shall survive termination of this Agreement and continue 
                in PERPETUITY for trade secrets and proprietary information, and for ten (10) years for other Confidential Information.
              </p>

              <h3 className="text-md font-bold">12. PRE-EXISTING RELATIONSHIPS</h3>
              <p>
                Any third parties that already have a documented pre-existing working relationship with the Signatory, 
                established PRIOR to this Agreement and verifiable through written records dated before the execution 
                of this Agreement, are not subject to the non-circumvention restrictions. The burden of proof for 
                pre-existing relationships rests solely with the Signatory.
              </p>

              <h3 className="text-md font-bold">13. GOVERNING LAW & JURISDICTION</h3>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, 
                without regard to its conflicts of laws principles. The Parties expressly consent to the exclusive 
                jurisdiction of the courts of the State of Delaware, including the Delaware Court of Chancery, in 
                connection with any action to enforce the provisions of this Agreement or arising under or by reason 
                of this Agreement. Each Party waives any objection to venue in such courts and any claim that such 
                courts are an inconvenient forum.
              </p>
              <p className="text-sm mt-2">
                <strong>Delaware State Law References:</strong>
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li><strong>6 Del. C. § 18-305:</strong> Access to and confidentiality of information; records (Delaware Limited Liability Company Act)</li>
                <li><strong>6 Del. C. § 17-305:</strong> Access to and confidentiality of information (Delaware Revised Uniform Limited Partnership Act)</li>
                <li><strong>Delaware Uniform Trade Secrets Act (6 Del. C. § 2001 et seq.):</strong> Protection of trade secrets, confidential business information, and proprietary formulas</li>
                <li><strong>Delaware Chancery Court Rules:</strong> Expedited proceedings and equitable remedies for breach of confidentiality agreements</li>
              </ul>
              <p className="text-sm mt-2">
                The Parties acknowledge that Delaware law provides strong protection for confidential business information, 
                trade secrets, and contractual non-circumvention provisions, and that the Delaware Court of Chancery 
                possesses specialized expertise in commercial and business disputes. In the event of dispute, the 
                prevailing Party shall be entitled to recover all reasonable attorney fees and costs.
              </p>

              <h3 className="text-md font-bold">14. ELECTRONIC SIGNATURES</h3>
              <p>
                Signatures on this Agreement received by way of electronic signature shall be deemed valid, enforceable, 
                and admissible for all purposes as original signatures pursuant to the Electronic Signatures in Global 
                and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA).
              </p>

              <h3 className="text-md font-bold">15. ENTIRE AGREEMENT</h3>
              <p>
                This Agreement constitutes the entire understanding between the Parties and supersedes all prior 
                negotiations, agreements, or understandings, whether oral or written. Any waiver, amendment, or 
                modification must be in writing and signed by all Parties to be effective.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Legal Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full legal name"
                    data-testid="input-nda-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veteranNumber">Veteran ID Number (Optional)</Label>
                  <Input
                    id="veteranNumber"
                    value={formData.veteranNumber}
                    onChange={(e) => setFormData({ ...formData, veteranNumber: e.target.value })}
                    placeholder="VA File Number or DD-214 Number"
                    data-testid="input-nda-veteran-number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Mailing Address *</Label>
                <Input
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, State, ZIP"
                  data-testid="input-nda-address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customReferralCode">Custom Referral Code (Optional)</Label>
                <p className="text-sm text-gray-500">Choose a memorable code for your referral links (e.g., JOHNSMITH, VETERAN123)</p>
                <Input
                  id="customReferralCode"
                  value={formData.customReferralCode}
                  onChange={(e) => setFormData({ ...formData, customReferralCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                  placeholder="YOURCODE"
                  maxLength={20}
                  data-testid="input-nda-referral-code"
                />
              </div>

              <div className="space-y-2">
                <Label>Electronic Signature</Label>
                <p className="text-sm text-gray-500">Sign with your mouse or finger below</p>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={150}
                    className="w-full bg-white cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    data-testid="canvas-signature"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                  Clear Signature
                </Button>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: !!checked })}
                  data-testid="checkbox-agree-terms"
                />
                <Label htmlFor="agreedToTerms" className="text-sm cursor-pointer">
                  I have read and agree to the terms of this Non-Circumvention, Non-Disclosure and Confidentiality Agreement. 
                  I understand and acknowledge that this Agreement is binding upon myself, my affiliates, representatives, 
                  agents, employees, family members, and all associated parties both directly and indirectly. I understand 
                  that Navigator USA Corp is a 501(c)(3) non-profit organization and that violations may result in penalties 
                  of THREE (3) TIMES the damages plus attorney fees.
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!formData.agreedToTerms || signNdaMutation.isPending}
                className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white py-6 text-lg font-bold"
                data-testid="button-sign-nda"
              >
                <FileSignature className="w-5 h-5 mr-2" />
                {signNdaMutation.isPending ? "Signing..." : "Sign Agreement & Continue"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Navigator USA Corp | 501(c)(3) Public Charity<br />
                429 D Shoreline Village Dr, Long Beach, CA 90802<br />
                EIN: 88-3349582 | Effective Date: July 15, 2022
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

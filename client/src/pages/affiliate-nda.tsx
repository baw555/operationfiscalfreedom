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
              <h2 className="text-lg font-bold text-brand-navy">NON-DISCLOSURE & GOOD FAITH AGREEMENT</h2>
              
              <p className="text-sm">
                <strong>Date:</strong> {today}
              </p>
              
              <p>
                This Agreement ("Agreement") is entered into between <strong>Navigator USA Corp</strong>, a 501(c)(3) 
                non-profit organization (EIN: 88-3349582), located at 429 D Shoreline Village Dr, Long Beach, CA 90802 
                ("Organization"), and the undersigned Affiliate ("Affiliate").
              </p>

              <h3 className="text-md font-bold mt-4">1. PURPOSE & MISSION</h3>
              <p>
                Navigator USA Corp is a tax-exempt public charity dedicated to supporting veteran families through 
                education, healthcare assistance, and financial empowerment programs. The Affiliate ecosystem exists 
                to help veterans earn income while contributing to this mission.
              </p>

              <h3 className="text-md font-bold">2. CONFIDENTIALITY</h3>
              <p>
                The Affiliate agrees to keep confidential all proprietary information, including but not limited to:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Commission structures and compensation details</li>
                <li>Safety, security and circumvention protocols</li>
                <li>Internal business processes and procedures</li>
                <li>Veteran and client information</li>
              </ul>

              <h3 className="text-md font-bold">3. GOOD FAITH</h3>
              <p>
                The Affiliate agrees to operate in good faith, understanding that this ecosystem is designed to:
              </p>
              <ul className="list-disc pl-5 text-sm">
                <li>Help veterans generate income for themselves and their families</li>
                <li>Support Navigator USA Corp's mission of veteran education and healthcare</li>
                <li>Create sustainable opportunities for the veteran community</li>
              </ul>

              <h3 className="text-md font-bold">4. SAFETY, SECURITY AND CIRCUMVENTION PROTOCOLS</h3>
              <p>
                The Affiliate acknowledges that the Organization employs safety, security and circumvention protocols 
                to protect affiliate referrals and commissions. The Affiliate agrees not to share details of these 
                protocols with anyone outside the affiliate network.
              </p>

              <h3 className="text-md font-bold">5. TERM</h3>
              <p>
                This Agreement remains in effect for the duration of the Affiliate's participation in the program 
                and for a period of two (2) years following termination.
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
                  I have read and agree to the terms of this Non-Disclosure & Good Faith Agreement. I understand 
                  that Navigator USA Corp is a 501(c)(3) non-profit organization and that this affiliate ecosystem 
                  is designed to help veterans while supporting veteran education and healthcare programs.
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

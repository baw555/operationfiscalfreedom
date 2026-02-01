import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { FileText, CheckCircle, Shield, ArrowLeft, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ScheduleASignature {
  id: number;
  affiliateName: string;
  affiliateEmail: string;
  signedAt: string;
}

interface SignatureStatus {
  signed: boolean;
  signature: ScheduleASignature | null;
}

interface AuthData {
  user: { id: number; email: string; name: string; role: string } | null;
}

export default function ScheduleA() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [signatureName, setSignatureName] = useState("");
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: authData } = useQuery<AuthData>({
    queryKey: ["/api/auth/me"],
  });

  const { data: signatureStatus } = useQuery<SignatureStatus>({
    queryKey: ["/api/schedule-a/status"],
    enabled: !!authData?.user,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, rect.width, rect.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, rect.width, rect.height);
    setHasDrawnSignature(false);
  };

  const getSignatureDataUrl = () => {
    const canvas = canvasRef.current;
    return canvas?.toDataURL("image/png") || "";
  };

  const signMutation = useMutation({
    mutationFn: async () => {
      const signatureImage = getSignatureDataUrl();
      const response = await fetch("/api/schedule-a/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          signatureName,
          signatureDate,
          signatureImage
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sign");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Schedule A Signed", description: "Your agreement has been recorded." });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule-a/status"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const canSign = signatureName.trim().length >= 2 && hasDrawnSignature && signatureDate;

  const todayFormatted = new Date().toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600/80 via-amber-500/60 to-amber-600/80" />
        
        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-lg bg-slate-700/50 border border-slate-600 flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-semibold tracking-tight">Schedule A</h1>
                {!signatureStatus?.signed && (
                  <span className="px-3 py-1 bg-red-600/90 border border-red-500 rounded text-white text-xs font-bold uppercase tracking-wider animate-pulse">
                    Action Required
                  </span>
                )}
              </div>
              <p className="text-slate-400">Commission Distribution Agreement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 min-h-screen">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          
          <div className="bg-white rounded-lg border-2 border-slate-300 shadow-lg overflow-hidden">
            <div className={`px-6 py-4 flex items-center gap-3 ${signatureStatus?.signed ? 'bg-green-600' : 'bg-red-600'}`}>
              {signatureStatus?.signed ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  <h3 className="font-semibold text-white">Agreement Signed</h3>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                  <h3 className="font-bold text-white uppercase tracking-wide">Action Required - Sign Agreement</h3>
                </>
              )}
            </div>
            
            <div className="p-6">
              {signatureStatus?.signed ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-lg" data-testid="schedule-a-signed-status">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800" data-testid="text-schedule-a-signed">Schedule A Agreement Signed</p>
                      <p className="text-sm text-green-600">
                        Signed by {signatureStatus.signature?.affiliateName} on{" "}
                        {signatureStatus.signature?.signedAt 
                          ? new Date(signatureStatus.signature.signedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => window.open('/api/schedule-a/download', '_blank')}
                      data-testid="button-download-schedule-a"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                    <h3 className="text-center font-bold text-lg text-slate-800 mb-4">
                      SCHEDULE A - COMMISSION DISTRIBUTION AGREEMENT
                    </h3>
                    <p className="text-center text-sm text-slate-600 mb-6">
                      Navigator USA Corp<br />
                      Effective Date: {signatureStatus.signature?.signedAt 
                        ? new Date(signatureStatus.signature.signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        : todayFormatted}
                    </p>
                    
                    <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
                      <p>
                        <strong>1. PARTIES.</strong> This Schedule A Commission Distribution Agreement ("Agreement") 
                        is entered into between Navigator USA Corp ("Company") and the undersigned Affiliate ("Affiliate").
                      </p>
                      
                      <p>
                        <strong>2. COMMISSION STRUCTURE.</strong> Affiliate will receive commissions as outlined in the 
                        Company's compensation plan. Commission rates are determined by the Company and may vary by 
                        service type. Affiliate agrees to refer to the current compensation plan for specific rates.
                      </p>
                      
                      <p>
                        <strong>3. ADDITIONAL INCOME OPPORTUNITIES.</strong> Affiliate may also earn commissions from 
                        additional revenue streams including but not limited to referral programs, volume bonuses, 
                        and promotional incentives as determined by the Company.
                      </p>
                      
                      <p>
                        <strong>4. PAYMENT TERMS.</strong> Commissions are paid according to the Company's standard 
                        payment schedule. The Company reserves the right to withhold payment pending verification 
                        of sales and compliance with all applicable terms.
                      </p>
                      
                      <p>
                        <strong>5. ACKNOWLEDGMENT.</strong> By signing below, Affiliate acknowledges that they have 
                        read, understand, and agree to the commission structure outlined in this Schedule A.
                      </p>
                      
                      <p>
                        <strong>6. MODIFICATIONS.</strong> The Company reserves the right to modify this commission 
                        structure with reasonable notice. Continued participation after such notice constitutes 
                        acceptance of any modifications.
                      </p>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-300">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Affiliate Signature</p>
                          <div className="border-b-2 border-slate-400 pb-1 mb-1">
                            <span className="font-bold text-slate-800">{signatureStatus.signature?.affiliateName}</span>
                          </div>
                          <p className="text-xs text-slate-500">{signatureStatus.signature?.affiliateEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-2">Date</p>
                          <div className="border-b-2 border-slate-400 pb-1">
                            <span className="font-bold text-slate-800">
                              {signatureStatus.signature?.signedAt 
                                ? new Date(signatureStatus.signature.signedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : authData?.user ? (
                <div className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <h3 className="text-center font-bold text-lg text-slate-800 mb-4">
                      SCHEDULE A - COMMISSION DISTRIBUTION AGREEMENT
                    </h3>
                    <p className="text-center text-sm text-slate-600 mb-6">
                      Navigator USA Corp<br />
                      Effective Date: {todayFormatted}
                    </p>
                    
                    <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
                      <p>
                        <strong>1. PARTIES.</strong> This Schedule A Commission Distribution Agreement ("Agreement") 
                        is entered into between Navigator USA Corp ("Company") and the undersigned Affiliate ("Affiliate").
                      </p>
                      
                      <p>
                        <strong>2. COMMISSION STRUCTURE.</strong> Affiliate will receive commissions as outlined in the 
                        Company's compensation plan. Commission rates are determined by the Company and may vary by 
                        service type. Affiliate agrees to refer to the current compensation plan for specific rates.
                      </p>
                      
                      <p>
                        <strong>3. ADDITIONAL INCOME OPPORTUNITIES.</strong> Affiliate may also earn commissions from 
                        additional revenue streams including but not limited to referral programs, volume bonuses, 
                        and promotional incentives as determined by the Company.
                      </p>
                      
                      <p>
                        <strong>4. PAYMENT TERMS.</strong> Commissions are paid according to the Company's standard 
                        payment schedule. The Company reserves the right to withhold payment pending verification 
                        of sales and compliance with all applicable terms.
                      </p>
                      
                      <p>
                        <strong>5. ACKNOWLEDGMENT.</strong> By signing below, Affiliate acknowledges that they have 
                        read, understand, and agree to the commission structure outlined in this Schedule A.
                      </p>
                      
                      <p>
                        <strong>6. MODIFICATIONS.</strong> The Company reserves the right to modify this commission 
                        structure with reasonable notice. Continued participation after such notice constitutes 
                        acceptance of any modifications.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      Sign This Agreement
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label htmlFor="signatureName" className="text-slate-700">Full Legal Name</Label>
                        <Input
                          id="signatureName"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1"
                          data-testid="input-signature-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="signatureDate" className="text-slate-700">Date</Label>
                        <Input
                          id="signatureDate"
                          type="date"
                          value={signatureDate}
                          onChange={(e) => setSignatureDate(e.target.value)}
                          className="mt-1"
                          data-testid="input-signature-date"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Label className="text-slate-700 mb-2 block">
                        Sign Below (Draw with finger or mouse)
                      </Label>
                      <div className="relative">
                        <canvas
                          ref={canvasRef}
                          className="w-full h-32 rounded-lg border-2 border-slate-300 bg-slate-50 touch-none cursor-crosshair"
                          style={{ touchAction: 'none' }}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          data-testid="canvas-signature"
                        />
                        {!hasDrawnSignature && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-slate-400 text-sm">Sign here</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={clearSignature}
                        className="text-sm text-slate-500 hover:text-slate-700 mt-2 underline"
                        data-testid="button-clear-signature"
                      >
                        Clear Signature
                      </button>
                    </div>

                    <div className="text-xs text-slate-600 mb-4">
                      Signing as: <strong>{authData.user.name}</strong> ({authData.user.email})
                    </div>

                    <Button
                      onClick={() => signMutation.mutate()}
                      disabled={signMutation.isPending || !canSign}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
                      data-testid="button-schedule-a-sign"
                    >
                      {signMutation.isPending ? "Processing..." : "I AGREE - SIGN SCHEDULE A"}
                    </Button>
                    
                    {!canSign && (
                      <p className="text-xs text-red-600 mt-2 text-center">
                        Please enter your name and draw your signature to continue
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6" data-testid="schedule-a-login-prompt">
                  <p className="text-slate-600 mb-4">
                    Please log in to sign the Schedule A Agreement.
                  </p>
                  <Link href="/login">
                    <Button className="bg-red-600 hover:bg-red-700 text-white font-bold" data-testid="button-schedule-a-login">
                      Login to Sign
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DOMPurify from "dompurify";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle, AlertCircle, Pen, RotateCcw } from "lucide-react";

interface ContractData {
  contractSend: {
    id: number;
    recipientName: string;
    recipientEmail: string;
    recipientPhone: string | null;
  };
  template: {
    id: number;
    name: string;
    content: string;
  };
}

export default function CsuSign() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signed, setSigned] = useState(false);

  const [formData, setFormData] = useState({
    signerName: "",
    signerEmail: "",
    signerPhone: "",
    address: "",
    initials: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    agreedToTerms: false,
  });

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const { data: contractData, isLoading, error } = useQuery<ContractData>({
    queryKey: [`/api/csu/contract/${token}`],
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (contractData) {
      setFormData((prev) => ({
        ...prev,
        signerName: contractData.contractSend.recipientName,
        signerEmail: contractData.contractSend.recipientEmail,
        signerPhone: contractData.contractSend.recipientPhone || "",
      }));
    }
  }, [contractData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1A365D";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const signMutation = useMutation({
    mutationFn: async () => {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error("Signature required");

      const signatureData = canvas.toDataURL("image/png");

      const res = await fetch(`/api/csu/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signerName: formData.signerName,
          signerEmail: formData.signerEmail,
          signerPhone: formData.signerPhone,
          address: formData.address,
          initials: formData.initials,
          effectiveDate: formData.effectiveDate,
          signatureData,
          agreedToTerms: "true",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to sign contract");
      }

      return res.json();
    },
    onSuccess: () => {
      setSigned(true);
      toast({
        title: "Contract Signed",
        description: "Thank you! Your contract has been signed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.signerName || !formData.signerEmail || !formData.initials || !formData.effectiveDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, email, initials, and effective date.",
        variant: "destructive",
      });
      return;
    }

    if (!hasSignature) {
      toast({
        title: "Signature Required",
        description: "Please sign in the signature box.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreedToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms to continue.",
        variant: "destructive",
      });
      return;
    }

    signMutation.mutate();
  };

  if (!token) {
    return (
      <Layout>
        <section className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
              <p className="text-gray-600">This signing link is invalid or has expired.</p>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <section className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading contract...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !contractData) {
    return (
      <Layout>
        <section className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Contract Not Found</h2>
              <p className="text-gray-600">
                {(error as Error)?.message || "This contract link may have expired or already been signed."}
              </p>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  if (signed) {
    return (
      <Layout>
        <section className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-green-700">Contract Signed Successfully!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for signing. You will receive a confirmation email shortly.
              </p>
              <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-4xl font-display mb-2">Cost Savings University</h1>
          <p className="text-blue-200">{contractData.template.name}</p>
        </div>
      </section>

      <section className="py-8 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Contract Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-gray-50 p-6 rounded-lg border max-h-96 overflow-y-auto text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contractData.template.content) }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pen className="w-5 h-5" /> Sign Below
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signerName">Full Name *</Label>
                    <Input
                      id="signerName"
                      value={formData.signerName}
                      onChange={(e) => setFormData({ ...formData, signerName: e.target.value })}
                      className="text-brand-navy"
                      data-testid="input-signer-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signerEmail">Email *</Label>
                    <Input
                      id="signerEmail"
                      type="email"
                      value={formData.signerEmail}
                      onChange={(e) => setFormData({ ...formData, signerEmail: e.target.value })}
                      className="text-brand-navy"
                      data-testid="input-signer-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signerPhone">Phone (Optional)</Label>
                    <Input
                      id="signerPhone"
                      type="tel"
                      value={formData.signerPhone}
                      onChange={(e) => setFormData({ ...formData, signerPhone: e.target.value })}
                      className="text-brand-navy"
                      data-testid="input-signer-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="text-brand-navy"
                      data-testid="input-address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initials">Initials *</Label>
                    <Input
                      id="initials"
                      value={formData.initials}
                      onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                      className="text-brand-navy font-bold text-center text-lg"
                      placeholder="e.g. JD"
                      maxLength={4}
                      data-testid="input-initials"
                    />
                    <p className="text-xs text-gray-500">Enter your initials to acknowledge this agreement</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effectiveDate">Effective Date *</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                      className="text-brand-navy"
                      data-testid="input-effective-date"
                    />
                    <p className="text-xs text-gray-500">Date this agreement becomes effective</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Signature *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearSignature}
                      data-testid="button-clear-signature"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> Clear
                    </Button>
                  </div>
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      className="w-full touch-none cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      data-testid="signature-canvas"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Draw your signature above using mouse or touch</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreedToTerms: checked as boolean })
                    }
                    data-testid="checkbox-agree"
                  />
                  <Label htmlFor="agreedToTerms" className="text-sm">
                    I have read and agree to all terms of this agreement *
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  disabled={signMutation.isPending}
                  data-testid="button-sign-contract"
                >
                  {signMutation.isPending ? "Signing..." : "Sign Contract"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

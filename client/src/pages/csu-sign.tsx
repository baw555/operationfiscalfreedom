import { useState, useRef, useEffect, useMemo } from "react";
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
import { FileText, CheckCircle, AlertCircle, Pen, RotateCcw, Building2, User, Mail, Phone, MapPin, Calendar, Download, Shield } from "lucide-react";

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
  const contractRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signed, setSigned] = useState(false);
  const [initialsApplied, setInitialsApplied] = useState(false);

  const [formData, setFormData] = useState({
    signerName: "",
    signerEmail: "",
    signerPhone: "",
    address: "",
    initials: "",
    effectiveDate: new Date().toISOString().split("T")[0],
    agreedToTerms: false,
    agreedToEsign: false,
    clientCompany: "",
    clientAddress: "",
    primaryOwner: "",
    primaryTitle: "",
    secondaryOwner: "",
  });
  const [signedAgreementId, setSignedAgreementId] = useState<number | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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
        primaryOwner: contractData.contractSend.recipientName,
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

  // Process content ONCE when contract loads - don't depend on formData for inputs
  const processedContent = useMemo(() => {
    if (!contractData?.template?.content) return "";
    
    let content = contractData.template.content;
    
    // Replace editable-field spans with input elements (empty - will be populated by useEffect)
    const editableFields = ['currentDate', 'clientCompany', 'clientAddress', 'primaryOwner', 'primaryTitle', 'secondaryOwner', 'clientEmail'];
    
    editableFields.forEach(field => {
      const editableRegex = new RegExp(`<span class="editable-field" data-field="${field}"[^>]*>[^<]*</span>`, "g");
      const placeholder = field === "currentDate" ? "Select date..." : 
                         field === "clientCompany" ? "Enter company name..." :
                         field === "clientAddress" ? "Enter address..." :
                         field === "primaryOwner" ? "Enter name..." :
                         field === "primaryTitle" ? "Enter title..." :
                         field === "secondaryOwner" ? "Enter name (optional)..." :
                         field === "clientEmail" ? "Enter email..." : "Enter value...";
      content = content.replace(editableRegex, `<input type="${field === "currentDate" ? "date" : "text"}" class="embedded-input" data-field="${field}" placeholder="${placeholder}" style="color: #6b21a8; font-weight: 600; background: #fff; border: 2px solid #9333ea; border-radius: 6px; padding: 8px 12px; width: 100%; font-size: 14px; outline: none;" />`);
    });

    return content;
  }, [contractData]);

  // Set initial values in embedded inputs and attach event listeners
  useEffect(() => {
    if (!contractRef.current || !processedContent) return;

    const inputs = contractRef.current.querySelectorAll('.embedded-input') as NodeListOf<HTMLInputElement>;
    
    // Set initial values from formData
    const initialValues: Record<string, string> = {
      currentDate: formData.effectiveDate || "",
      clientCompany: formData.clientCompany || "",
      clientAddress: formData.clientAddress || "",
      primaryOwner: formData.primaryOwner || formData.signerName || "",
      primaryTitle: formData.primaryTitle || "",
      secondaryOwner: formData.secondaryOwner || "",
      clientEmail: formData.signerEmail || "",
    };

    inputs.forEach(input => {
      const field = input.dataset.field;
      if (field && initialValues[field] !== undefined && !input.value) {
        input.value = initialValues[field];
      }
    });

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const field = target.dataset.field;
      if (!field) return;

      const fieldMapping: Record<string, keyof typeof formData> = {
        currentDate: 'effectiveDate',
        clientCompany: 'clientCompany',
        clientAddress: 'clientAddress',
        primaryOwner: 'primaryOwner',
        primaryTitle: 'primaryTitle',
        secondaryOwner: 'secondaryOwner',
        clientEmail: 'signerEmail',
      };

      const formField = fieldMapping[field];
      if (formField) {
        setFormData(prev => ({ ...prev, [formField]: target.value }));
      }
    };

    inputs.forEach(input => {
      input.addEventListener('input', handleInput);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('input', handleInput);
      });
    };
  }, [processedContent]);

  // Update auto-fill display spans in the DOM (without re-rendering inputs)
  useEffect(() => {
    if (!contractRef.current) return;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return "[DATE]";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    const autoFillValues: Record<string, string> = {
      currentDate: formData.effectiveDate ? formatDate(formData.effectiveDate) : "[DATE]",
      clientCompany: formData.clientCompany || "[COMPANY NAME]",
      clientAddress: formData.clientAddress || "[COMPANY ADDRESS]",
      primaryOwner: formData.primaryOwner || formData.signerName || "[PRIMARY OWNER]",
      primaryTitle: formData.primaryTitle || "[TITLE]",
      secondaryOwner: formData.secondaryOwner || "N/A",
      clientEmail: formData.signerEmail || "[EMAIL]",
      initials: formData.initials || "[INITIALS]",
    };

    // Update auto-fill spans in the DOM directly
    const autoFillSpans = contractRef.current.querySelectorAll('.auto-fill');
    autoFillSpans.forEach(span => {
      const field = (span as HTMLElement).dataset.field;
      if (field && autoFillValues[field]) {
        span.textContent = autoFillValues[field];
        (span as HTMLElement).style.color = '#6b21a8';
        (span as HTMLElement).style.fontWeight = '600';
      }
    });
  }, [formData]);

  const applyInitials = () => {
    if (formData.initials.length >= 2) {
      setInitialsApplied(true);
      toast({
        title: "Initials Applied",
        description: `Your initials "${formData.initials}" have been applied to all 11 sections.`,
      });
    } else {
      toast({
        title: "Enter Initials",
        description: "Please enter at least 2 characters for your initials.",
        variant: "destructive",
      });
    }
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
          address: formData.clientAddress || formData.address,
          initials: formData.initials,
          effectiveDate: formData.effectiveDate,
          signatureData,
          agreedToEsign: formData.agreedToEsign,
          agreedToTerms: formData.agreedToTerms,
          clientCompany: formData.clientCompany,
          primaryOwner: formData.primaryOwner,
          primaryTitle: formData.primaryTitle,
          secondaryOwner: formData.secondaryOwner,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to sign contract");
      }

      return res.json();
    },
    onSuccess: (data: { agreementId: number }) => {
      setSigned(true);
      setSignedAgreementId(data.agreementId);
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

    if (!initialsApplied) {
      toast({
        title: "Initials Required",
        description: "Please apply your initials to all sections by clicking 'Apply Initials to All Sections'.",
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

    if (!formData.agreedToEsign) {
      toast({
        title: "Electronic Signature Consent Required",
        description: "Please consent to use electronic records and signatures.",
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

  const handleDownloadPdf = async () => {
    if (!signedAgreementId) return;
    
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/csu/signed-agreements/${signedAgreementId}/pdf/public`);
      if (!response.ok) throw new Error("Failed to download PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `FICA-Agreement-${formData.signerName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "PDF Downloaded",
        description: "Your signed agreement has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdf(false);
    }
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
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
        <section className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
          <Card className="max-w-lg">
            <CardContent className="pt-8 text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2 text-green-700">Contract Signed Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for signing the FICA Tips Tax Credit Agreement. A copy has been saved to your records.
              </p>
              
              {/* Signature Confirmation Box */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Signature Verified
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Signed by:</strong> {formData.signerName}</p>
                  <p><strong>Email:</strong> {formData.signerEmail}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
                  <p><strong>Agreement ID:</strong> CSU-{signedAgreementId}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf || !signedAgreementId}
                  className="w-full bg-green-600 hover:bg-green-700 h-12"
                  data-testid="button-download-signed-pdf"
                >
                  {downloadingPdf ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Signed Agreement (PDF)
                    </>
                  )}
                </Button>
                <Button onClick={() => navigate("/")} variant="outline" className="w-full">
                  Return to Home
                </Button>
              </div>

              {/* Legal Notice */}
              <p className="text-xs text-gray-500 mt-6 border-t pt-4">
                This electronic signature is legally binding under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act) and the Uniform Electronic Transactions Act (UETA).
              </p>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-4xl font-display mb-2">Payzium</h1>
          <p className="text-purple-200">{contractData.template.name}</p>
        </div>
      </section>

      <section className="py-8 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="mb-6 border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <User className="w-5 h-5" /> Client Information
              </CardTitle>
              <p className="text-sm text-purple-600">Fill in your information below. It will automatically populate throughout the agreement.</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="clientCompany" className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> Company Name *
                  </Label>
                  <Input
                    id="clientCompany"
                    value={formData.clientCompany}
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                    placeholder="ABC Restaurant LLC"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-client-company"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientAddress" className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Company Address *
                  </Label>
                  <Input
                    id="clientAddress"
                    value={formData.clientAddress}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    placeholder="123 Main St, Phoenix, AZ 85001"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-client-address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryOwner" className="flex items-center gap-1">
                    <User className="w-4 h-4" /> Primary Business Owner *
                  </Label>
                  <Input
                    id="primaryOwner"
                    value={formData.primaryOwner}
                    onChange={(e) => setFormData({ ...formData, primaryOwner: e.target.value, signerName: e.target.value })}
                    placeholder="John Smith"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-primary-owner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryTitle">Title *</Label>
                  <Input
                    id="primaryTitle"
                    value={formData.primaryTitle}
                    onChange={(e) => setFormData({ ...formData, primaryTitle: e.target.value })}
                    placeholder="Owner / CEO / President"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-primary-title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="signerEmail" className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Email *
                  </Label>
                  <Input
                    id="signerEmail"
                    type="email"
                    value={formData.signerEmail}
                    onChange={(e) => setFormData({ ...formData, signerEmail: e.target.value })}
                    placeholder="john@company.com"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-signer-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signerPhone" className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Phone (Optional)
                  </Label>
                  <Input
                    id="signerPhone"
                    type="tel"
                    value={formData.signerPhone}
                    onChange={(e) => setFormData({ ...formData, signerPhone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-signer-phone"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="secondaryOwner">Secondary Business Owner (Optional)</Label>
                  <Input
                    id="secondaryOwner"
                    value={formData.secondaryOwner}
                    onChange={(e) => setFormData({ ...formData, secondaryOwner: e.target.value })}
                    placeholder="Jane Smith (if applicable)"
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-secondary-owner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate" className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Agreement Date *
                  </Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="text-brand-navy border-purple-200 focus:border-purple-500"
                    data-testid="input-effective-date"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Contract Agreement
              </CardTitle>
              <p className="text-sm text-gray-500">Review the agreement below. Your information will auto-populate in the highlighted fields.</p>
            </CardHeader>
            <CardContent>
              <div 
                ref={contractRef}
                className="bg-white p-6 rounded-lg border-2 border-gray-200 max-h-[600px] overflow-y-auto text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processedContent, { 
                  ADD_TAGS: ["input"],
                  ADD_ATTR: ["data-field", "data-section", "placeholder", "type", "value"]
                }) }}
              />
            </CardContent>
          </Card>

          <Card className="mb-6 border-2 border-amber-200">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Pen className="w-5 h-5" /> Initials & Signature
              </CardTitle>
              <p className="text-sm text-amber-600">Enter your initials and apply them to all 11 sections, then sign below.</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <Label htmlFor="initials" className="text-lg font-semibold">Your Initials *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="initials"
                      value={formData.initials}
                      onChange={(e) => {
                        setFormData({ ...formData, initials: e.target.value.toUpperCase() });
                        setInitialsApplied(false);
                      }}
                      className="text-brand-navy font-bold text-center text-2xl h-14 w-24 border-2 border-purple-300"
                      placeholder="JD"
                      maxLength={4}
                      data-testid="input-initials"
                    />
                    <Button
                      type="button"
                      onClick={applyInitials}
                      disabled={formData.initials.length < 2}
                      className={`h-14 px-6 ${initialsApplied ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
                      data-testid="button-apply-initials"
                    >
                      {initialsApplied ? "Initials Applied" : "Apply Initials to All Sections"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    {initialsApplied 
                      ? `Your initials "${formData.initials}" have been applied to all 11 sections.` 
                      : "Enter your initials (2-4 characters) and click to apply them to all sections."}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Your Signature *</Label>
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
                <div className="border-2 border-purple-300 rounded-lg overflow-hidden bg-white">
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
                <p className="text-xs text-gray-500">Draw your signature above using mouse or finger (touch)</p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Consent & Submit Section */}
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Shield className="w-5 h-5" /> Legal Consent & Electronic Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* E-SIGN Act Consent Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <Checkbox
                    id="agreedToEsign"
                    checked={formData.agreedToEsign}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreedToEsign: checked as boolean })
                    }
                    className="h-5 w-5 mt-0.5"
                    data-testid="checkbox-esign-consent"
                  />
                  <Label htmlFor="agreedToEsign" className="text-sm leading-relaxed">
                    <strong>Electronic Signature Consent:</strong> I agree to use electronic records and signatures, and I intend to sign this document electronically. I understand that my electronic signature has the same legal effect as a handwritten signature. *
                  </Label>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <Checkbox
                    id="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreedToTerms: checked as boolean })
                    }
                    className="h-5 w-5 mt-0.5"
                    data-testid="checkbox-agree"
                  />
                  <Label htmlFor="agreedToTerms" className="text-sm leading-relaxed">
                    I have read, understood, and agree to all terms of this FICA Tips Tax Credit Services Agreement. I acknowledge that this is a legally binding contract. *
                  </Label>
                </div>

                {/* Legal Disclaimer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Legal Notice:</strong> This electronic signature is legally binding under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA), and similar international laws where applicable. By signing electronically, you agree that your electronic signature is the legal equivalent of your handwritten signature on this agreement.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14 text-lg font-bold"
                  disabled={signMutation.isPending || !initialsApplied || !hasSignature || !formData.agreedToEsign || !formData.agreedToTerms}
                  data-testid="button-sign-contract"
                >
                  {signMutation.isPending ? "Signing Contract..." : "Sign & Submit Contract"}
                </Button>

                {(!initialsApplied || !hasSignature || !formData.agreedToEsign || !formData.agreedToTerms) && (
                  <div className="text-center text-sm text-amber-600 space-y-1">
                    {!initialsApplied && <p>Please apply your initials to all sections.</p>}
                    {!hasSignature && <p>Please sign in the signature box above.</p>}
                    {!formData.agreedToEsign && <p>Please consent to electronic signatures.</p>}
                    {!formData.agreedToTerms && <p>Please agree to the terms.</p>}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}

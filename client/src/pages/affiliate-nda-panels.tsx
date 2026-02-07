import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Redirect } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileSignature, AlertTriangle } from "lucide-react";
import { useNdaForm } from "./affiliate-nda-context";
import {
  LegalAgreementText,
  CameraCaptureCard,
  IdUploadCard,
  SignaturePad,
} from "./affiliate-nda-components";

export function NdaStatusPanel() {
  const [, setLocation] = useLocation();

  const { data: ndaStatus, isLoading } = useQuery({
    queryKey: ["/api/affiliate/nda-status"],
    queryFn: async () => {
      const res = await fetch("/api/affiliate/nda-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to check NDA status");
      return res.json();
    },
    staleTime: 30000,
  });

  useEffect(() => {
    if (!isLoading && ndaStatus?.hasSigned) {
      setLocation("/affiliate/dashboard");
    }
  }, [isLoading, ndaStatus, setLocation]);

  if (ndaStatus?.hasSigned) {
    return <Redirect to="/affiliate/dashboard" />;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" data-testid="nda-status-panel">
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
  );
}

export function LegalTextPanel() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <LegalAgreementText today={today} />;
}

export function SignaturePanel() {
  const { facePhoto, setFacePhoto, setSignature, setCapability } = useNdaForm();

  return (
    <div className="space-y-6" data-testid="signature-panel">
      <CameraCaptureCard
        facePhoto={facePhoto}
        onPhotoCapture={setFacePhoto}
        onPhotoRemove={() => setFacePhoto(null)}
        onCapabilityChange={(status) => setCapability("camera", status)}
      />
      <SignaturePad onSignatureChange={setSignature} />
    </div>
  );
}

export function UploadPanel() {
  const { idPhoto, idFileName, setIdPhoto, setCapability } = useNdaForm();

  return (
    <div data-testid="upload-panel">
      <IdUploadCard
        idPhoto={idPhoto}
        idFileName={idFileName}
        onUpload={(photo, fileName) => setIdPhoto(photo, fileName)}
        onRemove={() => setIdPhoto(null)}
        onCapabilityChange={(status) => setCapability("upload", status)}
      />
    </div>
  );
}

export function FormFieldsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { formFields, updateField, getSnapshot } = useNdaForm();

  const signNdaMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/affiliate/sign-nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error("Photos are too large. Please use smaller images or reduce photo quality.");
        }
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        try {
          const error = await res.json();
          throw new Error(error.message || "Failed to sign NDA");
        } catch {
          throw new Error("Failed to sign NDA. Please try again.");
        }
      }
      return res.json();
    },
    onSuccess: async () => {
      try {
        const statusRes = await fetch("/api/affiliate/nda-status", { credentials: "include" });
        if (!statusRes.ok) throw new Error("Status check failed");
        const statusData = await statusRes.json();
        if (!statusData.hasSigned) throw new Error("NDA not persisted");

        queryClient.invalidateQueries({ queryKey: ["/api/affiliate/nda-status"] });
        queryClient.invalidateQueries({ queryKey: ["affiliate-nda-status"] });
        toast({ title: "NDA Signed Successfully!", description: "Welcome to the team! You can now access the affiliate dashboard." });
        window.location.href = "/affiliate/dashboard";
      } catch {
        toast({ title: "Verification Failed", description: "Please try signing again.", variant: "destructive" });
      }
    },
    onError: (error: Error) => {
      let description = error.message;
      if (error.message.includes("Session expired")) {
        description = "Your session has expired. Please log in again and try signing the NDA.";
      } else if (error.message.includes("too large")) {
        description = "Your photos are too large. Try taking photos with a lower resolution camera setting.";
      }
      toast({ title: "Error Signing NDA", description, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { formFields: fields, facePhoto, idPhoto, signature, capabilities } = getSnapshot();

    if (!fields.agreedToTerms) {
      toast({ title: "Please agree to the terms", variant: "destructive" });
      return;
    }

    if (!fields.fullName || fields.fullName.trim().length < 2) {
      toast({ title: "Name Required", description: "Please enter your full legal name.", variant: "destructive" });
      return;
    }

    if (!fields.address || fields.address.trim().length < 5) {
      toast({ title: "Address Required", description: "Please enter your mailing address.", variant: "destructive" });
      return;
    }

    if (!signature.hasDrawn || signature.strokeCount < 2 || !signature.hasContent) {
      toast({ title: "Signature Required", description: "Please sign your full name in the signature box. A meaningful signature with multiple strokes is required.", variant: "destructive" });
      return;
    }

    if (!signature.signatureData) {
      toast({ title: "Signature Error", description: "Could not capture signature. Please try again.", variant: "destructive" });
      return;
    }

    signNdaMutation.mutate({
      ...fields,
      signatureData: signature.signatureData,
      facePhoto: facePhoto || null,
      idPhoto: idPhoto || null,
      degradedCapabilities: {
        camera: capabilities.camera,
        upload: capabilities.upload,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-fields-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Legal Name *</Label>
          <Input
            id="fullName"
            required
            value={formFields.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Enter your full legal name"
            data-testid="input-nda-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="veteranNumber">Veteran ID Number (Optional)</Label>
          <Input
            id="veteranNumber"
            value={formFields.veteranNumber}
            onChange={(e) => updateField("veteranNumber", e.target.value)}
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
          value={formFields.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="Street, City, State, ZIP"
          data-testid="input-nda-address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customReferralCode">Custom Referral Code (Optional)</Label>
        <p className="text-sm text-gray-500">Choose a memorable code for your referral links (e.g., JOHNSMITH, VETERAN123)</p>
        <Input
          id="customReferralCode"
          value={formFields.customReferralCode}
          onChange={(e) => updateField("customReferralCode", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
          placeholder="YOURCODE"
          maxLength={20}
          data-testid="input-nda-referral-code"
        />
      </div>

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Checkbox
          id="agreedToTerms"
          checked={formFields.agreedToTerms}
          onCheckedChange={(checked) => updateField("agreedToTerms", !!checked)}
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
        disabled={!formFields.agreedToTerms || signNdaMutation.isPending}
        className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white py-6 text-lg font-bold"
        data-testid="button-sign-nda"
      >
        <FileSignature className="w-5 h-5 mr-2" />
        {signNdaMutation.isPending ? "Signing..." : "Sign Agreement & Continue"}
      </Button>
    </form>
  );
}

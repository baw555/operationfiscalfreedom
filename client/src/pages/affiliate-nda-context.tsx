import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type CapabilityStatus = "available" | "unavailable" | "degraded" | "acknowledged";

interface NdaCapabilities {
  camera: CapabilityStatus;
  upload: CapabilityStatus;
}

export interface DegradedReport {
  feature: string;
  reason: string;
  timestamp: number;
}

interface NdaFormFields {
  fullName: string;
  veteranNumber: string;
  address: string;
  customReferralCode: string;
  agreedToTerms: boolean;
}

interface SignatureState {
  signatureData: string | null;
  hasDrawn: boolean;
  strokeCount: number;
  hasContent: boolean;
}

interface NdaFormStore {
  formFields: NdaFormFields;
  setFormFields: (fields: NdaFormFields) => void;
  updateField: <K extends keyof NdaFormFields>(key: K, value: NdaFormFields[K]) => void;
  facePhoto: string | null;
  setFacePhoto: (photo: string | null) => void;
  idPhoto: string | null;
  idFileName: string;
  setIdPhoto: (photo: string | null, fileName?: string) => void;
  signature: SignatureState;
  setSignature: (sig: SignatureState) => void;
  capabilities: NdaCapabilities;
  setCapability: (key: keyof NdaCapabilities, status: CapabilityStatus) => void;
  degradedReports: DegradedReport[];
  addDegradedReport: (report: DegradedReport) => void;
  getSnapshot: () => {
    formFields: NdaFormFields;
    facePhoto: string | null;
    idPhoto: string | null;
    signature: SignatureState;
    capabilities: NdaCapabilities;
    degradedReports: DegradedReport[];
  };
}

const NdaFormContext = createContext<NdaFormStore | null>(null);

export function useNdaForm(): NdaFormStore {
  const ctx = useContext(NdaFormContext);
  if (!ctx) throw new Error("useNdaForm must be used within NdaFormProvider");
  return ctx;
}

export function NdaFormProvider({ children }: { children: ReactNode }) {
  const [formFields, setFormFields] = useState<NdaFormFields>({
    fullName: "",
    veteranNumber: "",
    address: "",
    customReferralCode: "",
    agreedToTerms: false,
  });

  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [idPhoto, setIdPhotoState] = useState<string | null>(null);
  const [idFileName, setIdFileName] = useState("");
  const [signature, setSignature] = useState<SignatureState>({
    signatureData: null,
    hasDrawn: false,
    strokeCount: 0,
    hasContent: false,
  });
  const [capabilities, setCapabilities] = useState<NdaCapabilities>({
    camera: "available",
    upload: "available",
  });
  const [degradedReports, setDegradedReports] = useState<DegradedReport[]>([]);

  const updateField = useCallback(<K extends keyof NdaFormFields>(key: K, value: NdaFormFields[K]) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setIdPhoto = useCallback((photo: string | null, fileName?: string) => {
    setIdPhotoState(photo);
    setIdFileName(fileName || "");
  }, []);

  const setCapability = useCallback((key: keyof NdaCapabilities, status: CapabilityStatus) => {
    setCapabilities((prev) => ({ ...prev, [key]: status }));
  }, []);

  const addDegradedReport = useCallback((report: DegradedReport) => {
    setDegradedReports((prev) => [...prev, report]);
  }, []);

  const getSnapshot = useCallback(() => ({
    formFields,
    facePhoto,
    idPhoto,
    signature,
    capabilities,
    degradedReports,
  }), [formFields, facePhoto, idPhoto, signature, capabilities, degradedReports]);

  return (
    <NdaFormContext.Provider
      value={{
        formFields,
        setFormFields,
        updateField,
        facePhoto,
        setFacePhoto,
        idPhoto,
        idFileName,
        setIdPhoto,
        signature,
        setSignature,
        capabilities,
        setCapability,
        degradedReports,
        addDegradedReport,
        getSnapshot,
      }}
    >
      {children}
    </NdaFormContext.Provider>
  );
}

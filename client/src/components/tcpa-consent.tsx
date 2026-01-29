import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

interface TCPAConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function TCPAConsent({ checked, onCheckedChange, className = "" }: TCPAConsentProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-gray-600 mb-2">
          <strong>California Notice at Collection:</strong> NavigatorUSA collects the information you provide to respond to your request and may share it with affiliated or mission-aligned partners. For details on categories, purposes, and your rights, see our{" "}
          <Link href="/privacy-policy" className="text-brand-red hover:underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
      
      <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <Checkbox 
          id="tcpa-consent" 
          checked={checked} 
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="mt-1 border-2"
          data-testid="checkbox-tcpa-consent"
        />
        <Label htmlFor="tcpa-consent" className="text-xs text-gray-700 leading-relaxed cursor-pointer">
          By checking this box and submitting this form, I agree that NavigatorUSA, operating through the Operation Fiscal Freedom initiative, and its affiliated or mission-aligned partners may contact me by phone, text message, email, or prerecorded/artificial voice, including through automated technology, regarding my request. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out. I have read and agree to the{" "}
          <Link href="/privacy-policy" className="text-brand-red hover:underline font-medium">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-use" className="text-brand-red hover:underline font-medium">
            Terms of Use
          </Link>.{" "}
          <Link href="/affiliated-partners" className="text-brand-red hover:underline font-medium">
            View Affiliated Partners
          </Link>.
        </Label>
      </div>
    </div>
  );
}

export function TCPAConsentCompact({ checked, onCheckedChange, className = "" }: TCPAConsentProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-[10px] text-gray-500 leading-tight">
        <strong>CA Notice:</strong> NavigatorUSA collects info to respond to your request and may share with{" "}
        <Link href="/affiliated-partners" className="text-brand-red hover:underline">partners</Link>.{" "}
        <Link href="/privacy-policy" className="text-brand-red hover:underline">Privacy Policy</Link>.
      </p>
      
      <div className="flex items-start gap-2">
        <Checkbox 
          id="tcpa-consent-compact" 
          checked={checked} 
          onCheckedChange={(value) => onCheckedChange(value === true)}
          className="mt-0.5 h-4 w-4 border-2"
          data-testid="checkbox-tcpa-consent-compact"
        />
        <Label htmlFor="tcpa-consent-compact" className="text-[10px] text-gray-600 leading-tight cursor-pointer">
          I agree NavigatorUSA and its{" "}
          <Link href="/affiliated-partners" className="text-brand-red hover:underline">partners</Link>{" "}
          may contact me by phone, text, email, or automated technology. Consent not required for purchase. STOP to opt out.{" "}
          <Link href="/terms-of-use" className="text-brand-red hover:underline">Terms</Link>.
        </Label>
      </div>
    </div>
  );
}

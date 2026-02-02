import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield } from "lucide-react";

const DISCLAIMER_ACCEPTED_KEY = "navigatorusa_disclaimer_accepted";
const DISCLAIMER_VERSION = "1.0";

export function PlatformDisclaimerModal() {
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(DISCLAIMER_ACCEPTED_KEY);
    if (accepted !== DISCLAIMER_VERSION) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (acknowledged) {
      localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, DISCLAIMER_VERSION);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <DialogTitle className="text-xl">Platform Status Notice</DialogTitle>
              <DialogDescription>Live Testing Environment</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              This platform is currently operating in a <strong>live testing and phased-deployment environment</strong>. While certain services, workflows, and deliverables are active and may be provided in real time, not all features, claims, analyses, calculations, automations, or outputs are finalized, validated, or complete at this time.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Use of this platform constitutes acknowledgment that:</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Certain tools, data outputs, recommendations, or reports may be in development, partially implemented, under review, or subject to change</li>
                <li>Some claims, analyses, or deliverables may be preliminary, incomplete, or pending further verification</li>
                <li>System behavior, calculations, integrations, or results may evolve as testing, validation, and compliance review continues</li>
                <li>No representation is made that all services or outputs are final, exhaustive, or suitable for reliance without independent professional review</li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                No Professional Advice / Reliance Disclaimer
              </h4>
              <p className="text-red-700 mb-2">
                The platform and its content are provided for testing, evaluation, and informational purposes only.
              </p>
              <p className="text-red-700 font-medium">
                Nothing on this platform constitutes, or should be relied upon as: Legal advice, Tax advice, Accounting advice, Medical advice, or Financial/Investment advice.
              </p>
              <p className="text-red-700 mt-2">
                All users are solely responsible for consulting qualified, licensed professionals of their choosing before acting on any information, analysis, or output generated through this platform.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Claims-in-Progress & Verification Disclaimer</h4>
              <p className="text-amber-700">
                Certain claims, filings, analyses, calculations, or submissions referenced on this platform may be: In progress, Under review, Awaiting documentation, Pending third-party validation, or Subject to eligibility determinations by governmental or regulatory authorities.
              </p>
              <p className="text-amber-700 mt-2 font-medium">
                No guarantee is made regarding outcomes, approvals, eligibility, accuracy, timing, or acceptance by any authority, agency, carrier, court, or regulator.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Limitation of Liability</h4>
              <p className="text-gray-600">
                To the fullest extent permitted by law, the platform operators, affiliates, partners, and contributors disclaim all liability arising from: Use of a testing or pre-final system, Reliance on preliminary or incomplete outputs, Errors, omissions, delays, or system changes during testing, and Decisions made prior to final verification or professional review.
              </p>
              <p className="text-gray-600 mt-2 font-medium">
                Use of the platform is entirely voluntary and at the user's own risk during this testing phase.
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="pt-4 border-t space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Checkbox 
              id="acknowledge" 
              checked={acknowledged} 
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="acknowledge" className="text-sm text-gray-700 cursor-pointer">
              I understand and acknowledge that this platform is in active testing and phased rollout, I accept that not all features or claims are finalized, I assume full responsibility for any actions taken based on platform outputs, and I waive reliance on the platform as a substitute for licensed professional advice.
            </label>
          </div>

          <Button 
            onClick={handleAccept} 
            disabled={!acknowledged}
            className="w-full bg-brand-navy hover:bg-brand-navy/90"
          >
            I Understand and Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

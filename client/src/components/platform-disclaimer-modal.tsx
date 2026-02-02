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
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              This platform is in <strong>live testing</strong>. Not all features or outputs are finalized.
            </p>

            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Not Professional Advice
              </h4>
              <p className="text-red-700 text-xs">
                Nothing here constitutes legal, tax, medical, or financial advice. Consult licensed professionals before acting on any platform outputs.
              </p>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-gray-600 text-xs">
                No guarantees on outcomes. Use is voluntary and at your own risk. Platform operators disclaim liability for testing-phase issues.
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
              I understand this platform is in testing and accept responsibility for my use of it.
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

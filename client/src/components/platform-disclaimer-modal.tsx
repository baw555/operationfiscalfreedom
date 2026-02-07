import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
      <DialogContent
        className="max-w-md text-center [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <h2 className="text-xl font-semibold">
          Before You Continue
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          This platform contains regulated tools, sensitive workflows,
          and compliance-critical features.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Please confirm you understand and agree before proceeding.
        </p>

        <div className="my-4 border-t" />

        <div className="flex items-start gap-2 text-sm text-left">
          <Checkbox
            id="acknowledge"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked === true)}
            className="mt-0.5"
          />
          <label htmlFor="acknowledge" className="cursor-pointer">
            I understand and accept responsibility for my use of this platform.
          </label>
        </div>

        <Button
          className="mt-4 w-full bg-brand-navy hover:bg-brand-navy/90"
          onClick={handleAccept}
          disabled={!acknowledged}
        >
          I Understand & Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}

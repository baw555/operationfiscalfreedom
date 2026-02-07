import { AlertTriangle, ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

type DegradedFeatureNoticeProps = {
  featureName: string;
  description: string;
  onProceed: () => void;
  onReport: () => void;
  retryAction?: () => void;
  retryLabel?: string;
};

export function DegradedFeatureNotice({
  featureName,
  description,
  onProceed,
  onReport,
  retryAction,
  retryLabel,
}: DegradedFeatureNoticeProps) {
  return (
    <div
      className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4 space-y-3"
      data-testid={`degraded-notice-${featureName.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900">
            {featureName} Unavailable
          </h3>
          <p className="mt-1 text-sm text-amber-800">
            {description}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            This won't stop your submission. We'll review if needed.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          onClick={onProceed}
          className="bg-amber-600 hover:bg-amber-700 text-white"
          data-testid={`button-proceed-${featureName.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <ArrowRight className="w-4 h-4 mr-1.5" />
          Proceed Anyway
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onReport}
          className="border-amber-500 text-amber-800 hover:bg-amber-100"
          data-testid={`button-report-${featureName.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <ClipboardList className="w-4 h-4 mr-1.5" />
          Proceed & File Report
        </Button>

        {retryAction && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={retryAction}
            className="text-amber-700 hover:bg-amber-100"
            data-testid={`button-retry-${featureName.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {retryLabel || "Try Again"}
          </Button>
        )}
      </div>
    </div>
  );
}

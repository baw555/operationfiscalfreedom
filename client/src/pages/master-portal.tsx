import { Shield } from "lucide-react";

export default function MasterPortal() {
  // Master Portal is completely locked
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-navy to-slate-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <div className="text-2xl text-white font-bold">Master Portal Locked</div>
        <div className="text-gray-300">
          Access to the Master Portal is restricted. This portal is not available at this time.
        </div>
        <div className="text-sm text-gray-500 mt-4">
          Contact administration for access inquiries.
        </div>
      </div>
    </div>
  );
}

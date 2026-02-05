import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

interface RepairWidgetProps {
  role?: "PUBLIC" | "AFFILIATE" | "ADMIN";
}

export function RepairChatWidget({ role = "PUBLIC" }: RepairWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [lastResult, setLastResult] = useState<{ status: string; message: string } | null>(null);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/repair/public-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: text, role })
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
    onSuccess: (data) => {
      setLastResult({ status: data.status, message: data.message });
      setText("");
    },
    onError: () => {
      setLastResult({ status: "ERROR", message: "Failed to submit. Please try again." });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PATCH_PROPOSED":
      case "AUTO_FIXED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ESCALATED":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-[#1A365D] text-white shadow-lg flex items-center justify-center hover:bg-[#2a4a7d] transition-colors z-50"
        data-testid="button-open-repair-widget"
        aria-label="Report an issue"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 rounded-xl shadow-lg bg-white border z-50" data-testid="repair-chat-widget">
      <div className="p-3 font-semibold border-b flex items-center justify-between bg-[#1A365D] text-white rounded-t-xl">
        <span>Fix Something</span>
        <button 
          onClick={() => { setIsOpen(false); setLastResult(null); }}
          className="hover:opacity-80"
          data-testid="button-close-widget"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="p-3 space-y-3">
        <p className="text-xs text-gray-600">
          Describe the problem you're experiencing and we'll work on fixing it.
        </p>
        
        <Textarea
          className="w-full text-sm resize-none"
          placeholder="Describe what's wrong..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          data-testid="input-widget-description"
        />
        
        <Button
          onClick={() => submitMutation.mutate()}
          disabled={!text.trim() || submitMutation.isPending}
          className="w-full bg-[#E21C3D] hover:bg-[#c4162f]"
          data-testid="button-widget-submit"
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Working...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit
            </>
          )}
        </Button>
        
        {lastResult && (
          <div className={`p-2 rounded text-xs flex items-start gap-2 ${
            lastResult.status === "PATCH_PROPOSED" || lastResult.status === "AUTO_FIXED" 
              ? "bg-green-50 text-green-800" 
              : lastResult.status === "ESCALATED"
                ? "bg-yellow-50 text-yellow-800"
                : "bg-gray-50 text-gray-700"
          }`} data-testid="widget-result">
            {getStatusIcon(lastResult.status)}
            <span>{lastResult.message}</span>
          </div>
        )}
      </div>
      
      <div className="p-2 text-center text-[10px] text-gray-400 border-t">
        Self-Healing Platform™
      </div>
    </div>
  );
}

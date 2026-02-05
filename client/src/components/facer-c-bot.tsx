import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import popeyeBot from "../assets/images/popeye-sailor.png";

export function FacerCBot() {
  const [showBubble, setShowBubble] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!botRef.current) return;
      const botRect = botRef.current.getBoundingClientRect();
      const botCenterX = botRect.left + botRect.width / 2;
      const botCenterY = botRect.top + botRect.height / 2;
      
      const deltaX = e.clientX - botCenterX;
      const deltaY = e.clientY - botCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxMove = 4;
      
      const moveX = (deltaX / Math.max(distance, 1)) * Math.min(distance / 50, maxMove);
      const moveY = (deltaY / Math.max(distance, 1)) * Math.min(distance / 50, maxMove);
      
      setEyePosition({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  async function submitIssue() {
    if (!issueText.trim()) return;
    setStatus("Diagnosing...");
    try {
      const res = await fetch("/api/repair/public-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: issueText, role: "PUBLIC" })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setStatus(errorData.message || "Hmm, something's not right. Let me get help!");
        return;
      }
      const data = await res.json();
      if (data.status === "FIXED" || data.status === "PATCH_PROPOSED") {
        setStatus("Fixed it! All better now!");
      } else if (data.status === "ESCALATED") {
        setStatus("I've called in the big humans to help!");
      } else if (data.status === "NO_PATCH") {
        setStatus("I'll need a human to look at this one!");
      } else {
        setStatus("Got it! I'm working on it!");
      }
      setIssueText("");
    } catch (err) {
      console.error("FACER-C error:", err);
      setStatus("Oops! Something went wrong. Try again?");
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={botRef}>
      {showBubble && (
        <div className="absolute bottom-32 right-0 w-72 animate-bounce-in" data-testid="speech-bubble">
          <div className="relative bg-[#0A1A0C] border border-[#00FF88] rounded-lg p-4 shadow-2xl" style={{ boxShadow: '0 0 20px rgba(0,255,136,0.2)' }}>
            <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-[#00FF88]"></div>
            <div className="absolute -bottom-2 right-9 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#0A1A0C]"></div>
            <div className="flex items-center gap-2 mb-2 text-[#00FF88]/60 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></div>
              INCOMING TRANSMISSION
            </div>
            <p className="font-mono text-sm leading-relaxed text-[#00FF88]">
              <span className="text-[#FFD700] font-bold">FACER-C</span> online. Friendly Army Corp of Engineers Repair unit activated. Report any system malfunctions and I will attempt immediate resolution.
            </p>
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 bg-[#1A2A1C] text-[#00FF88] border border-[#00FF88]/50 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-[#00FF88]/20 hover:border-[#00FF88]"
              data-testid="close-bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-32 right-0 w-80 bg-[#0A1A0C] border border-[#00FF88] rounded-lg shadow-2xl overflow-hidden animate-slide-up" style={{ boxShadow: '0 0 20px rgba(0,255,136,0.3)' }} data-testid="chat-panel">
          <div className="bg-gradient-to-r from-[#1A2A1C] to-[#0A1A0C] text-[#00FF88] p-3 font-bold flex items-center gap-2 border-b border-[#00FF88]/30">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></div>
            <span className="font-mono text-sm tracking-wider">FACER-C TACTICAL CONSOLE</span>
            <span className="ml-auto text-xs bg-[#00FF88]/20 text-[#00FF88] px-2 py-0.5 rounded border border-[#00FF88]/50 font-mono">ONLINE</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="text-[#00FF88]/60 text-xs font-mono mb-2">// ENTER ISSUE REPORT</div>
            <textarea
              className="w-full p-3 bg-[#0A1A0C] border border-[#00FF88]/40 rounded text-sm text-[#00FF88] placeholder-[#00FF88]/40 focus:border-[#00FF88] focus:outline-none focus:ring-1 focus:ring-[#00FF88]/50 resize-none font-mono"
              placeholder="Describe malfunction..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              rows={3}
              data-testid="issue-input"
            />
            <button
              onClick={submitIssue}
              className="w-full bg-gradient-to-r from-[#00FF88]/20 to-[#00FF88]/10 hover:from-[#00FF88]/30 hover:to-[#00FF88]/20 text-[#00FF88] font-bold py-2.5 px-4 rounded transition-all border border-[#00FF88]/50 hover:border-[#00FF88] font-mono text-sm tracking-wider hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]"
              data-testid="submit-issue"
            >
              ▶ TRANSMIT TO FACER-C
            </button>
            {status && (
              <div className="text-center text-sm font-mono text-[#00FF88] bg-[#00FF88]/10 p-2 rounded border border-[#00FF88]/30" data-testid="status-message">
                <span className="inline-block w-2 h-2 rounded-full bg-[#00FF88] mr-2 animate-pulse"></span>
                {status}
              </div>
            )}
          </div>
          <div className="px-4 pb-3 flex gap-2 text-[10px] font-mono text-[#00FF88]/40">
            <span>SYS:OK</span>
            <span>•</span>
            <span>NET:SECURE</span>
            <span>•</span>
            <span>REPAIR:READY</span>
          </div>
        </div>
      )}

      <div 
        className="cursor-pointer transition-transform hover:scale-125 animate-float"
        onClick={() => { setIsOpen(!isOpen); setShowBubble(false); }}
        data-testid="facer-c-bot"
      >
        <img 
          src={popeyeBot} 
          alt="FACER-C Repair Bot" 
          className="w-28 h-28 object-contain drop-shadow-2xl rounded-full"
          style={{ 
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
          }}
        />
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0) translateY(20px); opacity: 0; }
          50% { transform: scale(1.1) translateY(-5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slide-up {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(-4px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4)); }
          50% { filter: drop-shadow(0 12px 24px rgba(30,90,200,0.6)); }
        }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

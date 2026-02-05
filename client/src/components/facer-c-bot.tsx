import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import popeyeBot from "../assets/images/popeye-sailor.png";

export function FacerCBot() {
  const [showBubble, setShowBubble] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [issueText, setIssueText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const botRef = useRef<HTMLDivElement>(null);


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
        <div className="absolute bottom-36 right-0 w-80 animate-bounce-in" data-testid="speech-bubble">
          <div className="relative bg-white rounded-[30px] p-5 shadow-2xl border-4 border-black" style={{ 
            boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)'
          }}>
            <div className="absolute -bottom-4 right-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-black"></div>
            <div className="absolute -bottom-2 right-11 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-white"></div>
            <div className="text-center mb-2">
              <span className="text-[#1A365D] font-black text-lg tracking-wide" style={{ fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 0 #E21C3D' }}>
                SAILOR MAN
              </span>
              <div className="text-[10px] font-bold text-[#E21C3D] tracking-widest mt-0.5">
                SENIOR AID INTEL REPAIR MAN
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-800 font-bold text-center" style={{ fontFamily: 'Comic Sans MS, cursive, sans-serif' }}>
              "Well blow me down! I'm here to fix yer problems! Click me again to report any issues, and I'll muscle through 'em!"
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="absolute -top-3 -right-3 bg-[#E21C3D] text-white border-3 border-black rounded-full w-8 h-8 flex items-center justify-center text-lg font-black hover:bg-[#B91C1C] hover:scale-110 transition-transform shadow-lg"
              style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}
              data-testid="close-bubble"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-32 right-0 w-80 bg-[#0A1A0C] border border-[#00FF88] rounded-lg shadow-2xl overflow-hidden animate-slide-up" style={{ boxShadow: '0 0 20px rgba(0,255,136,0.3)' }} data-testid="chat-panel">
          <div className="bg-gradient-to-r from-[#1A365D] to-[#0D2847] text-white p-3 font-bold flex items-center gap-2 border-b-4 border-[#E21C3D]">
            <div className="w-3 h-3 rounded-full bg-[#E21C3D] animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wide" style={{ fontFamily: 'Impact, sans-serif' }}>SAILOR MAN</span>
              <span className="text-[8px] text-[#E21C3D] tracking-widest">SENIOR AID INTEL REPAIR</span>
            </div>
            <span className="ml-auto text-xs bg-[#E21C3D] text-white px-2 py-0.5 rounded font-bold">READY</span>
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
              ▶ SEND TO SAILOR MAN
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
        onClick={() => { 
          if (!isOpen && !showBubble) {
            setShowBubble(true);
          } else if (showBubble) {
            setShowBubble(false);
            setIsOpen(true);
          } else {
            setIsOpen(!isOpen);
          }
        }}
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

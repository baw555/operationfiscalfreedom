import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";

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
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={() => { setIsOpen(!isOpen); setShowBubble(false); }}
        data-testid="facer-c-bot"
      >
        <svg width="85" height="100" viewBox="0 0 100 120" className="drop-shadow-xl">
          <defs>
            <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDBF6F" />
              <stop offset="100%" stopColor="#E8A850" />
            </linearGradient>
            <linearGradient id="shirtBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#0F1F33" />
            </linearGradient>
            <linearGradient id="pantsBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2C3E50" />
              <stop offset="100%" stopColor="#1A252F" />
            </linearGradient>
          </defs>
          
          <ellipse cx="50" cy="115" rx="22" ry="4" fill="rgba(0,0,0,0.15)" />
          
          <ellipse cx="38" cy="112" rx="6" ry="3" fill="#4A3728" />
          <ellipse cx="62" cy="112" rx="6" ry="3" fill="#4A3728" />
          
          <path d="M 32 85 L 30 108 L 46 108 L 44 85 Z" fill="url(#pantsBlue)" />
          <path d="M 56 85 L 54 108 L 70 108 L 68 85 Z" fill="url(#pantsBlue)" />
          
          <path d="M 30 50 L 25 75 L 35 75 L 38 55 Z" fill="url(#shirtBlue)" />
          <path d="M 70 50 L 75 75 L 65 75 L 62 55 Z" fill="url(#shirtBlue)" />
          <rect x="32" y="48" width="36" height="40" rx="4" fill="url(#shirtBlue)" />
          
          <path d="M 35 48 L 50 42 L 65 48 L 65 52 L 50 46 L 35 52 Z" fill="white" />
          <polygon points="50,42 45,52 55,52" fill="white" />
          <circle cx="50" cy="56" r="2" fill="#C41E3A" />
          
          <ellipse cx="18" cy="68" rx="12" ry="8" fill="url(#skinTone)" />
          <ellipse cx="16" cy="70" rx="10" ry="6" fill="url(#skinTone)" />
          <ellipse cx="14" cy="72" rx="4" ry="3" fill="url(#skinTone)" />
          <path d="M 8 64 L 12 60 L 16 64 L 12 68 Z" fill="url(#skinTone)" />
          
          <ellipse cx="82" cy="60" rx="14" ry="9" fill="url(#skinTone)" />
          <ellipse cx="85" cy="58" rx="12" ry="7" fill="url(#skinTone)" />
          <ellipse cx="88" cy="56" rx="5" ry="4" fill="url(#skinTone)" />
          <path d="M 92 50 L 96 46 L 100 50 L 96 54 Z" fill="url(#skinTone)" />
          
          <g transform="translate(16, 66)">
            <ellipse cx="0" cy="0" rx="4" ry="3" fill="#1E5C3A" opacity="0.8" />
            <path d="M -2 -1 L 4 -2 L 4 0 L -2 1 Z" fill="#1E5C3A" />
          </g>
          
          <ellipse cx="50" cy="26" rx="18" ry="20" fill="url(#skinTone)" />
          
          <path d="M 32 18 Q 32 8 50 6 Q 68 8 68 18 L 68 12 Q 68 5 50 3 Q 32 5 32 12 Z" fill="white" />
          <ellipse cx="50" cy="6" rx="12" ry="4" fill="white" />
          <rect x="45" y="2" width="10" height="2" fill="white" />
          
          <g className="transition-transform duration-100" style={{ transform: `translate(${eyePosition.x * 0.5}px, ${eyePosition.y * 0.3}px)` }}>
            <ellipse cx="42" cy="24" rx="4" ry={isBlinking ? 0.5 : 2} fill="black">
              <animate attributeName="ry" values="2;2;0.5;2;2" dur="4s" repeatCount="indefinite" keyTimes="0;0.45;0.5;0.55;1" />
            </ellipse>
            <ellipse cx="58" cy="22" rx="3" ry={isBlinking ? 0.5 : 1.5} fill="black">
              <animate attributeName="ry" values="1.5;1.5;0.5;1.5;1.5" dur="4s" repeatCount="indefinite" keyTimes="0;0.45;0.5;0.55;1" />
            </ellipse>
          </g>
          
          <ellipse cx="50" cy="30" rx="3" ry="2" fill="#D4956A" />
          
          <path d="M 62 32 L 78 28 L 80 30 L 78 32 L 62 34 Z" fill="#8B6914" />
          <ellipse cx="80" cy="30" rx="3" ry="2" fill="#8B6914" />
          
          <ellipse cx="83" cy="26" rx="4" ry="3" fill="#CCCCCC" opacity="0.6">
            <animate attributeName="cy" values="26;23;26" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="86" cy="22" rx="3" ry="2" fill="#CCCCCC" opacity="0.4">
            <animate attributeName="cy" values="22;18;22" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.2;0.4" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
          
          <path d="M 38 36 L 40 42 Q 50 48 60 42 L 62 38" fill="none" stroke="url(#skinTone)" strokeWidth="4" />
          <ellipse cx="50" cy="44" rx="8" ry="4" fill="url(#skinTone)" />
          
          <path d="M 44 40 Q 50 44 56 40" fill="none" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" />
        </svg>
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
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

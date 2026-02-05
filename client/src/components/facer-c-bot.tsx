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
        <svg width="90" height="100" viewBox="0 0 120 130" className="drop-shadow-2xl filter">
          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2C3E2D" />
              <stop offset="30%" stopColor="#1A2A1C" />
              <stop offset="70%" stopColor="#3D4F3E" />
              <stop offset="100%" stopColor="#1A2A1C" />
            </linearGradient>
            <linearGradient id="visorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00CC66" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#009944" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0" />
              <stop offset="50%" stopColor="#00FF88" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chestPlate" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3D4F3E" />
              <stop offset="50%" stopColor="#2C3E2D" />
              <stop offset="100%" stopColor="#1A2A1C" />
            </linearGradient>
            <linearGradient id="goldStar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#DAA520" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="innerGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          
          <ellipse cx="60" cy="118" rx="30" ry="8" fill="rgba(0,255,136,0.15)">
            <animate attributeName="rx" values="30;32;30" dur="2s" repeatCount="indefinite" />
          </ellipse>
          
          <path d="M 45 95 L 42 115 L 48 115 L 50 100 Z" fill="url(#metalGradient)" stroke="#1A2A1C" strokeWidth="1" />
          <path d="M 75 95 L 78 115 L 72 115 L 70 100 Z" fill="url(#metalGradient)" stroke="#1A2A1C" strokeWidth="1" />
          <ellipse cx="45" cy="116" rx="5" ry="2" fill="#1A2A1C" />
          <ellipse cx="75" cy="116" rx="5" ry="2" fill="#1A2A1C" />
          <circle cx="45" cy="116" r="2" fill="#00FF88" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="116" r="2" fill="#00FF88" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
          </circle>
          
          <path d="M 30 50 L 25 50 L 22 65 L 28 68 L 35 55 Z" fill="url(#metalGradient)" stroke="#1A2A1C" strokeWidth="1" />
          <path d="M 90 50 L 95 50 L 98 65 L 92 68 L 85 55 Z" fill="url(#metalGradient)" stroke="#1A2A1C" strokeWidth="1" />
          <circle cx="24" cy="58" r="3" fill="#00FF88" filter="url(#glow)">
            <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="96" cy="58" r="3" fill="#00FF88" filter="url(#glow)">
            <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          
          <path d="M 35 45 L 35 95 L 45 100 L 55 95 L 55 50 L 50 45 Z" fill="url(#chestPlate)" stroke="#1A2A1C" strokeWidth="1.5" />
          <path d="M 85 45 L 85 95 L 75 100 L 65 95 L 65 50 L 70 45 Z" fill="url(#chestPlate)" stroke="#1A2A1C" strokeWidth="1.5" />
          <path d="M 55 48 L 55 90 L 60 93 L 65 90 L 65 48 L 60 45 Z" fill="#1A2A1C" />
          
          <rect x="50" y="70" width="20" height="15" rx="2" fill="#0A1A0C" stroke="#00FF88" strokeWidth="0.5" />
          <rect x="53" y="73" width="4" height="4" rx="1" fill="#00FF88">
            <animate attributeName="fill" values="#00FF88;#00AA55;#00FF88" dur="0.8s" repeatCount="indefinite" />
          </rect>
          <rect x="58" y="73" width="4" height="4" rx="1" fill="#FFD700">
            <animate attributeName="fill" values="#FFD700;#FFA500;#FFD700" dur="1.2s" repeatCount="indefinite" />
          </rect>
          <rect x="63" y="73" width="4" height="4" rx="1" fill="#FF3333">
            <animate attributeName="fill" values="#FF3333;#CC0000;#FF3333" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="53" y="79" width="14" height="3" rx="1" fill="#00FF88" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
          </rect>
          
          <path d="M 32 15 L 32 40 Q 32 48 40 48 L 80 48 Q 88 48 88 40 L 88 15 Q 88 5 60 5 Q 32 5 32 15 Z" fill="url(#metalGradient)" stroke="#1A2A1C" strokeWidth="2" />
          <path d="M 28 20 L 32 18 L 32 35 L 28 33 Z" fill="#2C3E2D" />
          <path d="M 92 20 L 88 18 L 88 35 L 92 33 Z" fill="#2C3E2D" />
          
          <polygon points="60,2 64,12 56,12" fill="url(#goldStar)" stroke="#8B6914" strokeWidth="0.5" filter="url(#glow)">
            <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
          </polygon>
          <circle cx="60" cy="7" r="1.5" fill="#FFFACD">
            <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          
          <path d="M 36 25 L 84 25 L 84 42 Q 84 45 80 45 L 40 45 Q 36 45 36 42 Z" fill="#0A1A0C" stroke="#00FF88" strokeWidth="1" opacity="0.95" />
          
          <g className="transition-transform duration-75" style={{ transform: `translate(${eyePosition.x * 1.2}px, ${eyePosition.y * 0.8}px)` }}>
            <rect x="40" y="28" width="14" height={isBlinking ? 2 : 12} rx="2" fill="url(#visorGradient)" filter="url(#innerGlow)">
              <animate attributeName="height" values="12;12;2;12;12" dur="4s" repeatCount="indefinite" keyTimes="0;0.45;0.5;0.55;1" />
            </rect>
            <rect x="66" y="28" width="14" height={isBlinking ? 2 : 12} rx="2" fill="url(#visorGradient)" filter="url(#innerGlow)">
              <animate attributeName="height" values="12;12;2;12;12" dur="4s" repeatCount="indefinite" keyTimes="0;0.45;0.5;0.55;1" />
            </rect>
            <rect x="42" y="30" width="3" height="3" rx="1" fill="#FFFFFF" opacity="0.6" />
            <rect x="68" y="30" width="3" height="3" rx="1" fill="#FFFFFF" opacity="0.6" />
            <line x1="40" y1="34" x2="54" y2="34" stroke="#00FF88" strokeWidth="0.5" opacity="0.5">
              <animate attributeName="x2" values="54;50;54" dur="0.5s" repeatCount="indefinite" />
            </line>
            <line x1="66" y1="34" x2="80" y2="34" stroke="#00FF88" strokeWidth="0.5" opacity="0.5">
              <animate attributeName="x2" values="80;76;80" dur="0.5s" repeatCount="indefinite" begin="0.25s" />
            </line>
          </g>
          
          <line x1="56" y1="30" x2="64" y2="30" stroke="#00FF88" strokeWidth="1" opacity="0.4" />
          <line x1="58" y1="34" x2="62" y2="34" stroke="#00FF88" strokeWidth="1" opacity="0.4" />
          <line x1="57" y1="38" x2="63" y2="38" stroke="#00FF88" strokeWidth="1" opacity="0.4" />
          
          <circle cx="35" cy="30" r="2" fill="#FF3333" filter="url(#glow)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="85" cy="30" r="2" fill="#FF3333" filter="url(#glow)">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" begin="0.4s" />
          </circle>
          
          <rect x="36" y="55" width="8" height="2" fill="#00FF88" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
          </rect>
          <rect x="76" y="55" width="8" height="2" fill="#00FF88" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" begin="1.5s" />
          </rect>
          
          <text x="60" y="63" textAnchor="middle" fill="#00FF88" fontSize="5" fontFamily="monospace" opacity="0.7">FACER-C</text>
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

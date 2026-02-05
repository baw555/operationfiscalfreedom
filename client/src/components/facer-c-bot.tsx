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
        <div className="absolute bottom-24 right-0 w-72 animate-bounce-in" data-testid="speech-bubble">
          <div className="relative bg-white border-4 border-black rounded-2xl p-4 shadow-lg">
            <div className="absolute -bottom-4 right-8 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-black"></div>
            <div className="absolute -bottom-2 right-9 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-white"></div>
            <p className="font-bold text-sm leading-relaxed" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard', cursive" }}>
              Hey, I am <span className="text-[#E21C3D]">FACER-C</span>, Your Friendly Army Corp of Engineers Repair Bot! If you are having issues tell me and I will try and fix it!
            </p>
            <button 
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-700"
              data-testid="close-bubble"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-24 right-0 w-80 bg-white border-2 border-[#1A365D] rounded-xl shadow-xl overflow-hidden animate-slide-up" data-testid="chat-panel">
          <div className="bg-[#1A365D] text-white p-3 font-bold flex items-center gap-2">
            <span className="text-lg">🤖</span>
            FACER-C Repair Console
          </div>
          <div className="p-4 space-y-3">
            <textarea
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#1A365D] focus:outline-none resize-none"
              placeholder="Tell me what's broken..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              rows={3}
              data-testid="issue-input"
            />
            <button
              onClick={submitIssue}
              className="w-full bg-[#E21C3D] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              data-testid="submit-issue"
            >
              Send to FACER-C
            </button>
            {status && (
              <div className="text-center text-sm font-medium text-[#1A365D] bg-blue-50 p-2 rounded-lg" data-testid="status-message">
                {status}
              </div>
            )}
          </div>
        </div>
      )}

      <div 
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={() => { setIsOpen(!isOpen); setShowBubble(false); }}
        data-testid="facer-c-bot"
      >
        <svg width="80" height="80" viewBox="0 0 100 100" className="drop-shadow-lg">
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A90D9" />
              <stop offset="100%" stopColor="#1A365D" />
            </linearGradient>
            <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#5DADE2" />
            </linearGradient>
          </defs>
          
          <ellipse cx="50" cy="85" rx="25" ry="8" fill="rgba(0,0,0,0.2)" />
          
          <rect x="40" y="70" width="8" height="12" rx="2" fill="#3A5A8C" />
          <rect x="52" y="70" width="8" height="12" rx="2" fill="#3A5A8C" />
          <ellipse cx="44" cy="82" rx="6" ry="3" fill="#2D4A6F" />
          <ellipse cx="56" cy="82" rx="6" ry="3" fill="#2D4A6F" />
          
          <rect x="25" y="35" width="50" height="40" rx="8" fill="url(#bodyGradient)" stroke="#1A365D" strokeWidth="2" />
          
          <rect x="15" y="45" width="12" height="6" rx="3" fill="#3A5A8C" />
          <rect x="73" y="45" width="12" height="6" rx="3" fill="#3A5A8C" />
          <circle cx="13" cy="48" r="4" fill="#E21C3D" />
          <circle cx="87" cy="48" r="4" fill="#E21C3D" />
          
          <rect x="30" y="10" width="40" height="30" rx="6" fill="url(#faceGradient)" stroke="#1A365D" strokeWidth="2" />
          
          <rect x="42" y="2" width="4" height="10" rx="2" fill="#3A5A8C" />
          <circle cx="44" cy="2" r="4" fill="#E21C3D">
            <animate attributeName="fill" values="#E21C3D;#FFD700;#E21C3D" dur="2s" repeatCount="indefinite" />
          </circle>
          
          <g className="transition-transform duration-100" style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}>
            <ellipse cx="40" cy="22" rx="7" ry={isBlinking ? 1 : 6} fill="white" stroke="#1A365D" strokeWidth="1">
              <animate attributeName="ry" values="6;6;1;6;6" dur="4s" repeatCount="indefinite" begin="0s" keyTimes="0;0.45;0.5;0.55;1" />
            </ellipse>
            <ellipse cx="60" cy="22" rx="7" ry={isBlinking ? 1 : 6} fill="white" stroke="#1A365D" strokeWidth="1">
              <animate attributeName="ry" values="6;6;1;6;6" dur="4s" repeatCount="indefinite" begin="0s" keyTimes="0;0.45;0.5;0.55;1" />
            </ellipse>
            <circle cx="40" cy="23" r="3" fill="#1A365D" />
            <circle cx="60" cy="23" r="3" fill="#1A365D" />
            <circle cx="41" cy="21" r="1" fill="white" />
            <circle cx="61" cy="21" r="1" fill="white" />
          </g>
          
          <path d="M 42 32 Q 50 38 58 32" fill="none" stroke="#1A365D" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="d" values="M 42 32 Q 50 38 58 32;M 42 33 Q 50 40 58 33;M 42 32 Q 50 38 58 32" dur="3s" repeatCount="indefinite" />
          </path>
          
          <rect x="35" y="55" width="30" height="12" rx="3" fill="#2D4A6F" stroke="#1A365D" strokeWidth="1" />
          <rect x="38" y="58" width="6" height="6" rx="1" fill="#4ADE80">
            <animate attributeName="fill" values="#4ADE80;#22C55E;#4ADE80" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="47" y="58" width="6" height="6" rx="1" fill="#60A5FA">
            <animate attributeName="fill" values="#60A5FA;#3B82F6;#60A5FA" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="56" y="58" width="6" height="6" rx="1" fill="#FBBF24">
            <animate attributeName="fill" values="#FBBF24;#F59E0B;#FBBF24" dur="1.8s" repeatCount="indefinite" />
          </rect>
          
          <circle cx="30" cy="23" r="3" fill="#E21C3D" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="70" cy="23" r="3" fill="#E21C3D" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" begin="0.5s" />
          </circle>
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

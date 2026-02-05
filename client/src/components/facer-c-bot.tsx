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
        <div className="absolute bottom-28 right-0 w-80 bg-[#F5F5DC] border-2 border-[#4B5320] rounded-xl shadow-xl overflow-hidden animate-slide-up" data-testid="chat-panel">
          <div className="bg-gradient-to-r from-[#4B5320] to-[#556B2F] text-white p-3 font-bold flex items-center gap-2">
            <span className="text-lg">⭐</span>
            FACER-C Repair Console
            <span className="ml-auto text-xs bg-[#8B0000] px-2 py-0.5 rounded">ARMY</span>
          </div>
          <div className="p-4 space-y-3 bg-gradient-to-b from-[#F5F5DC] to-[#E8E4D0]">
            <textarea
              className="w-full p-3 border-2 border-[#8B7355] rounded-lg text-sm focus:border-[#4B5320] focus:outline-none resize-none bg-white"
              placeholder="Report your issue, soldier..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              rows={3}
              data-testid="issue-input"
            />
            <button
              onClick={submitIssue}
              className="w-full bg-gradient-to-r from-[#4B5320] to-[#556B2F] hover:from-[#3D4220] hover:to-[#4B5320] text-white font-bold py-2 px-4 rounded-lg transition-colors border border-[#3D4220]"
              data-testid="submit-issue"
            >
              🎖️ Send to FACER-C
            </button>
            {status && (
              <div className="text-center text-sm font-medium text-[#4B5320] bg-[#C4A76C] bg-opacity-30 p-2 rounded-lg border border-[#8B7355]" data-testid="status-message">
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
        <svg width="80" height="90" viewBox="0 0 100 110" className="drop-shadow-lg">
          <defs>
            <linearGradient id="camoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B5320" />
              <stop offset="50%" stopColor="#5C4033" />
              <stop offset="100%" stopColor="#556B2F" />
            </linearGradient>
            <linearGradient id="camoGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6B8E23" />
              <stop offset="100%" stopColor="#4B5320" />
            </linearGradient>
            <linearGradient id="faceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C4A76C" />
              <stop offset="100%" stopColor="#A0855B" />
            </linearGradient>
            <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#556B2F" />
              <stop offset="50%" stopColor="#4B5320" />
              <stop offset="100%" stopColor="#3D4220" />
            </linearGradient>
            <pattern id="camoPattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#4B5320"/>
              <circle cx="5" cy="5" r="4" fill="#5C4033"/>
              <circle cx="15" cy="12" r="3" fill="#6B8E23"/>
              <ellipse cx="10" cy="18" rx="5" ry="3" fill="#8B7355"/>
              <circle cx="18" cy="3" r="2" fill="#556B2F"/>
            </pattern>
          </defs>
          
          <ellipse cx="50" cy="95" rx="25" ry="8" fill="rgba(0,0,0,0.2)" />
          
          <rect x="40" y="80" width="8" height="12" rx="2" fill="#4B5320" />
          <rect x="52" y="80" width="8" height="12" rx="2" fill="#4B5320" />
          <ellipse cx="44" cy="92" rx="6" ry="3" fill="#3D4220" />
          <ellipse cx="56" cy="92" rx="6" ry="3" fill="#3D4220" />
          
          <rect x="25" y="45" width="50" height="40" rx="8" fill="url(#camoPattern)" stroke="#3D4220" strokeWidth="2" />
          <ellipse cx="35" cy="55" rx="4" ry="3" fill="#5C4033" />
          <ellipse cx="65" cy="60" rx="5" ry="4" fill="#6B8E23" />
          <ellipse cx="50" cy="75" rx="6" ry="3" fill="#8B7355" />
          
          <rect x="15" y="55" width="12" height="6" rx="3" fill="#4B5320" />
          <rect x="73" y="55" width="12" height="6" rx="3" fill="#4B5320" />
          <circle cx="13" cy="58" r="4" fill="#8B0000" />
          <circle cx="87" cy="58" r="4" fill="#8B0000" />
          
          <rect x="30" y="20" width="40" height="30" rx="6" fill="url(#faceGradient)" stroke="#3D4220" strokeWidth="2" />
          
          <path d="M 25 22 Q 25 5 50 5 Q 75 5 75 22 L 75 20 Q 75 12 50 12 Q 25 12 25 20 Z" fill="url(#helmetGradient)" stroke="#3D4220" strokeWidth="2" />
          <ellipse cx="50" cy="8" rx="18" ry="6" fill="#4B5320" />
          <path d="M 22 22 L 25 22 L 25 25 L 22 25 Z" fill="#4B5320" />
          <path d="M 75 22 L 78 22 L 78 25 L 75 25 Z" fill="#4B5320" />
          
          <polygon points="50,3 53,10 47,10" fill="#FFD700" stroke="#B8860B" strokeWidth="0.5">
            <animate attributeName="fill" values="#FFD700;#FFA500;#FFD700" dur="2s" repeatCount="indefinite" />
          </polygon>
          
          <g className="transition-transform duration-100" style={{ transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)` }}>
            <ellipse cx="40" cy="32" rx="7" ry={isBlinking ? 1 : 6} fill="white" stroke="#3D4220" strokeWidth="1">
              <animate attributeName="ry" values="6;6;1;6;6" dur="4s" repeatCount="indefinite" begin="0s" keyTimes="0;0.45;0.5;0.55;1" />
            </ellipse>
            <ellipse cx="60" cy="32" rx="7" ry={isBlinking ? 1 : 6} fill="white" stroke="#3D4220" strokeWidth="1">
              <animate attributeName="ry" values="6;6;1;6;6" dur="4s" repeatCount="indefinite" begin="0s" keyTimes="0;0.45;0.5;0.55;1" />
            </ellipse>
            <circle cx="40" cy="33" r="3" fill="#3D4220" />
            <circle cx="60" cy="33" r="3" fill="#3D4220" />
            <circle cx="41" cy="31" r="1" fill="white" />
            <circle cx="61" cy="31" r="1" fill="white" />
          </g>
          
          <path d="M 42 42 Q 50 48 58 42" fill="none" stroke="#3D4220" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="d" values="M 42 42 Q 50 48 58 42;M 42 43 Q 50 50 58 43;M 42 42 Q 50 48 58 42" dur="3s" repeatCount="indefinite" />
          </path>
          
          <rect x="35" y="65" width="30" height="12" rx="3" fill="#3D4220" stroke="#2D3218" strokeWidth="1" />
          <rect x="38" y="68" width="6" height="6" rx="1" fill="#4ADE80">
            <animate attributeName="fill" values="#4ADE80;#22C55E;#4ADE80" dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="47" y="68" width="6" height="6" rx="1" fill="#FFA500">
            <animate attributeName="fill" values="#FFA500;#FF8C00;#FFA500" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="56" y="68" width="6" height="6" rx="1" fill="#DC143C">
            <animate attributeName="fill" values="#DC143C;#B22222;#DC143C" dur="1.8s" repeatCount="indefinite" />
          </rect>
          
          <circle cx="28" cy="32" r="3" fill="#8B0000" opacity="0.7">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="72" cy="32" r="3" fill="#8B0000" opacity="0.7">
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

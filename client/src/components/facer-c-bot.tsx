import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Mic, MicOff, Send, Volume2, Loader2, Lightbulb, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import popeyeBot from "../assets/images/popeye-sailor.png";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  inputType?: string;
  createdAt: string;
}

function generateSessionId(): string {
  const existing = localStorage.getItem("sailorSessionId");
  if (existing) return existing;
  const newId = `sailor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem("sailorSessionId", newId);
  return newId;
}

export function FacerCBot() {
  const [showBubble, setShowBubble] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(true);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [location] = useLocation();
  
  const botRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sessionId = useRef(generateSessionId());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      fetchTips();
      initConversation();
    }
  }, [isOpen, location]);

  async function fetchTips() {
    try {
      const res = await fetch(`/api/sailor/tips?page=${encodeURIComponent(location)}`);
      if (res.ok) {
        const data = await res.json();
        setTips(data.tips);
      }
    } catch (e) {
      console.error("Failed to fetch tips:", e);
    }
  }

  async function initConversation() {
    try {
      const res = await fetch("/api/sailor/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.current, currentPage: location })
      });
      if (res.ok) {
        const conv = await res.json();
        setConversationId(conv.id);
        await loadMessages(conv.id);
      }
    } catch (e) {
      console.error("Failed to init conversation:", e);
    }
  }

  async function loadMessages(convId: number) {
    try {
      const res = await fetch(`/api/sailor/conversation/${convId}/messages`);
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    }
  }

  async function sendMessage(text?: string) {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    setInputText("");
    setIsLoading(true);
    setShowTips(false);

    setMessages(prev => [...prev, {
      id: -Date.now(),
      role: "user" as const,
      content: messageText,
      inputType: "text",
      createdAt: new Date().toISOString()
    }]);

    try {
      const res = await fetch("/api/sailor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message: messageText,
          currentPage: location
        })
      });

      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversationId);
        await loadMessages(data.conversationId);
      } else {
        setMessages(prev => prev.filter(m => m.id > 0).concat({
          id: -Date.now() - 1,
          role: "assistant" as const,
          content: "Blimey! Something went wrong. Try again, shipmate!",
          createdAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.filter(m => m.id > 0).concat({
        id: -Date.now() - 1,
        role: "assistant" as const,
        content: "Arr! Lost connection there. Give it another try!",
        createdAt: new Date().toISOString()
      }));
    } finally {
      setIsLoading(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        await sendVoiceMessage(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Could not access microphone. Please allow microphone access.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function sendVoiceMessage(audioBlob: Blob) {
    setIsLoading(true);
    setShowTips(false);

    setMessages(prev => [...prev, {
      id: -Date.now(),
      role: "user" as const,
      content: "Transcribing...",
      inputType: "voice",
      createdAt: new Date().toISOString()
    }]);

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("sessionId", sessionId.current);
    formData.append("currentPage", location);

    try {
      const res = await fetch("/api/sailor/voice-chat", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversationId);
        await loadMessages(data.conversationId);
      } else {
        const errData = await res.json().catch(() => ({}));
        setMessages(prev => prev.filter(m => m.id > 0).concat({
          id: -Date.now() - 1,
          role: "assistant" as const,
          content: errData.message || "Couldn't hear ya there, shipmate! Try again!",
          createdAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error("Voice chat error:", error);
      setMessages(prev => prev.filter(m => m.id > 0).concat({
        id: -Date.now() - 1,
        role: "assistant" as const,
        content: "Voice message hit some rough seas. Try typing instead!",
        createdAt: new Date().toISOString()
      }));
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
              "Well blow me down! I'm here to help with VA claims, tax credits, and more! Click me to chat!"
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
        <div className="absolute bottom-36 right-0 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up border-4 border-[#1A365D]" style={{ maxHeight: '70vh' }} data-testid="chat-panel">
          <div className="bg-gradient-to-r from-[#1A365D] to-[#0D2847] text-white p-4 flex items-center gap-3">
            <img src={popeyeBot} alt="Sailor Man" className="w-12 h-12 rounded-full border-2 border-white" />
            <div className="flex-1">
              <div className="font-black text-lg" style={{ fontFamily: 'Impact, sans-serif' }}>SAILOR MAN</div>
              <div className="text-[10px] text-[#E21C3D] tracking-widest font-bold">SENIOR AID INTEL REPAIR</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              data-testid="close-chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white" data-testid="messages-container">
            {showTips && tips.length > 0 && messages.length === 0 && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[#1A365D] font-bold text-sm">
                  <Lightbulb className="w-4 h-4 text-[#EAB308]" />
                  Quick Questions:
                </div>
                {tips.map((tip, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(tip)}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-[#1A365D] border border-blue-200 transition-colors"
                    data-testid={`tip-button-${i}`}
                  >
                    <HelpCircle className="w-4 h-4 inline mr-2 text-blue-500" />
                    {tip}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.id}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-[#1A365D] text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="text-xs font-bold text-[#E21C3D] mb-1">SAILOR MAN:</div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.inputType === "voice" && (
                    <div className="text-xs opacity-60 mt-1 flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> Voice
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Sailor Man is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`p-3 rounded-full transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                data-testid="voice-button"
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading || isRecording}
                className="flex-1 p-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent disabled:opacity-50"
                data-testid="chat-input"
              />
              
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isLoading || isRecording}
                className="p-3 bg-[#1A365D] text-white rounded-full hover:bg-[#0D2847] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="send-button"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            {isRecording && (
              <div className="mt-2 text-center text-sm text-red-500 font-medium animate-pulse">
                🎙️ Recording... Click mic to stop
              </div>
            )}
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
          alt="Sailor Man AI Assistant" 
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

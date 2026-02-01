import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Bot,
  Send,
  Image,
  Video,
  Music,
  FileText,
  Brain,
  Zap,
  Settings,
  Trash2,
  Copy,
  Sparkles,
  Wand2,
  MessageSquare,
  User,
  Loader2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  model?: string;
}

const AI_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Most capable model for complex tasks", icon: "🧠" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", description: "Fast and efficient for most tasks", icon: "⚡" },
];

const TASK_PRESETS = [
  { id: "general", name: "General Assistant", icon: MessageSquare, color: "blue" },
  { id: "writing", name: "Writing & Content", icon: FileText, color: "purple" },
  { id: "code", name: "Code & Technical", icon: Zap, color: "green" },
  { id: "creative", name: "Creative & Media", icon: Sparkles, color: "pink" },
  { id: "research", name: "Research & Analysis", icon: Brain, color: "orange" },
];

export default function OperatorAI() {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Operator AI, your comprehensive AI command center. I'm here to assist you with text analysis, writing, coding, research, and creative tasks. How can I help you today?",
      timestamp: new Date(),
      model: "gpt-4o"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Settings
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [selectedPreset, setSelectedPreset] = useState("general");
  const [memoryMode, setMemoryMode] = useState<"stateless" | "session" | "persistent">("stateless");
  const [showSettings, setShowSettings] = useState(false);
  
  // Generate a unique session ID for this browser session
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/operator-ai/chat", {
        message,
        model: selectedModel,
        preset: selectedPreset,
        memoryMode,
        sessionId,
        // Only send client history for stateless mode
        conversationHistory: memoryMode === "stateless" 
          ? messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
          : undefined,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        model: selectedModel
      }]);
      setIsTyping(false);
    },
    onError: (error: any) => {
      setIsTyping(false);
      toast({
        title: "Chat Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear session memory
  const clearSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/operator-ai/session/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Session memory cleared. Starting fresh conversation.",
        timestamp: new Date(),
        model: selectedModel
      }]);
      toast({ title: "Session Cleared", description: "Your session memory has been forgotten." });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    
    // Send to API
    chatMutation.mutate(inputMessage);
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared. How can I help you?",
      timestamp: new Date(),
      model: selectedModel
    }]);
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({ title: "Copied", description: "Message copied to clipboard" });
    } catch {
      toast({ title: "Copy Failed", description: "Unable to copy message", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900">
        {/* Hero Header */}
        <section className="relative py-8 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-5" />
          <div className="absolute inset-0">
            <div className="absolute top-10 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-display text-white">
                    Operator AI
                  </h1>
                  <p className="text-blue-300 text-sm">
                    Q Branch Comprehensive AI Command Center
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                  Online
                </Badge>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white" data-testid="select-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        <span className="flex items-center gap-2">
                          <span>{model.icon}</span>
                          <span>{model.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowSettings(!showSettings)}
                  data-testid="button-settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Task Presets & Settings */}
            <div className="space-y-4">
              {/* Task Presets */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Task Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {TASK_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        selectedPreset === preset.id 
                          ? "bg-blue-600 text-white" 
                          : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      }`}
                      data-testid={`preset-${preset.id}`}
                    >
                      <preset.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Memory Mode Selection */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Memory Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Stateless Mode */}
                  <button
                    onClick={() => setMemoryMode("stateless")}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      memoryMode === "stateless"
                        ? "bg-gray-700 border-2 border-purple-500"
                        : "bg-gray-700/50 border border-gray-600 hover:border-gray-500"
                    }`}
                    data-testid="memory-stateless"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">Stateless</span>
                      <span className="text-xs text-gray-400">Default</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">No history stored. Every prompt is isolated.</p>
                  </button>

                  {/* Session Mode */}
                  <button
                    onClick={() => setMemoryMode("session")}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      memoryMode === "session"
                        ? "bg-gray-700 border-2 border-blue-500"
                        : "bg-gray-700/50 border border-gray-600 hover:border-gray-500"
                    }`}
                    data-testid="memory-session"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">Session</span>
                      <span className="text-xs text-blue-400">Temp</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Stored until you close or click Forget.</p>
                  </button>

                  {/* Persistent Mode */}
                  <button
                    onClick={() => setMemoryMode("persistent")}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      memoryMode === "persistent"
                        ? "bg-gray-700 border-2 border-green-500"
                        : "bg-gray-700/50 border border-gray-600 hover:border-gray-500"
                    }`}
                    data-testid="memory-persistent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">Persistent</span>
                      <span className="text-xs text-green-400">Opt-in</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Remembers across sessions. Requires login.</p>
                  </button>

                  {/* Memory Actions */}
                  <div className="pt-2 space-y-2 border-t border-gray-700">
                    {memoryMode === "session" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-orange-600 text-orange-300 hover:bg-orange-900/30"
                        onClick={() => clearSessionMutation.mutate()}
                        disabled={clearSessionMutation.isPending}
                        data-testid="button-forget-session"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Forget Session
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={clearChat}
                      data-testid="button-clear-chat"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Display
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-pink-400" />
                    Media Studio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => window.location.href = "/naval-intelligence"}
                    data-testid="button-video-gen"
                  >
                    <Video className="w-4 h-4 mr-2 text-blue-400" />
                    Video Generation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => window.location.href = "/naval-intelligence"}
                    data-testid="button-music-gen"
                  >
                    <Music className="w-4 h-4 mr-2 text-green-400" />
                    Music Generation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
                    data-testid="button-image-gen"
                  >
                    <Image className="w-4 h-4 mr-2 text-purple-400" />
                    Image Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-800/50 border-gray-700 h-[calc(100vh-280px)] flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Operator AI</h3>
                        <p className="text-gray-400 text-xs">
                          {AI_MODELS.find(m => m.id === selectedModel)?.name} • {TASK_PRESETS.find(p => p.id === selectedPreset)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-gray-400 border-gray-600">
                        {messages.length - 1} messages
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            message.role === "user" 
                              ? "bg-brand-red" 
                              : "bg-gradient-to-br from-blue-500 to-purple-600"
                          }`}>
                            {message.role === "user" 
                              ? <User className="w-4 h-4 text-white" />
                              : <Bot className="w-4 h-4 text-white" />
                            }
                          </div>
                          <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                            <div className={`inline-block rounded-2xl px-4 py-3 ${
                              message.role === "user"
                                ? "bg-brand-red text-white rounded-tr-sm"
                                : "bg-gray-700 text-gray-100 rounded-tl-sm"
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${message.role === "user" ? "justify-end" : ""}`}>
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              {message.model && <span>• {message.model}</span>}
                              {message.role === "assistant" && (
                                <button 
                                  onClick={() => copyMessage(message.content)}
                                  className="hover:text-gray-300 transition-colors"
                                  data-testid={`copy-message-${message.id}`}
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Ask Operator AI anything..."
                        className="min-h-[44px] max-h-[120px] resize-none bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-12"
                        data-testid="input-message"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={chatMutation.isPending || !inputMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid="button-send"
                    >
                      {chatMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line • Powered by {AI_MODELS.find(m => m.id === selectedModel)?.provider}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

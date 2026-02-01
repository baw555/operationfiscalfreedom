import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Bot,
  Send,
  Paperclip,
  Image,
  Video,
  Music,
  FileText,
  Brain,
  Zap,
  Settings,
  History,
  Trash2,
  Download,
  Copy,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Upload,
  Mic,
  Camera,
  Wand2,
  Shield,
  Star,
  MessageSquare,
  User,
  Clock,
  MoreVertical,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  model?: string;
  attachments?: Array<{
    type: "image" | "video" | "audio" | "file";
    url: string;
    name: string;
  }>;
}

interface ConversationSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

const AI_MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Most capable model for complex tasks", icon: "🧠" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", description: "Fast and efficient for most tasks", icon: "⚡" },
  { id: "claude-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", description: "Excellent for analysis and writing", icon: "📝" },
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
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Operator AI, your comprehensive AI command center. I'm here to assist you with text, image, video, and audio tasks. How can I help you today?",
      timestamp: new Date(),
      model: "gpt-4o"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Settings
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [selectedPreset, setSelectedPreset] = useState("general");
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [streamingEnabled, setStreamingEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

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
        memoryEnabled,
        conversationHistory: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
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

  const handleSendMessage = () => {
    if (!inputMessage.trim() && attachments.length === 0) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      attachments: attachments.map(f => ({
        type: f.type.startsWith("image") ? "image" : 
              f.type.startsWith("video") ? "video" : 
              f.type.startsWith("audio") ? "audio" : "file",
        url: URL.createObjectURL(f),
        name: f.name,
      }))
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setAttachments([]);
    setIsTyping(true);
    
    // Send to API
    chatMutation.mutate(inputMessage);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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

              {/* Memory & Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 text-sm">Session Memory</Label>
                    <Switch 
                      checked={memoryEnabled} 
                      onCheckedChange={setMemoryEnabled}
                      data-testid="switch-memory"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300 text-sm">Streaming</Label>
                    <Switch 
                      checked={streamingEnabled} 
                      onCheckedChange={setStreamingEnabled}
                      data-testid="switch-streaming"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={clearChat}
                    data-testid="button-clear-chat"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Chat
                  </Button>
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
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((att, i) => (
                                    <div key={i} className="text-xs opacity-80 flex items-center gap-1">
                                      <Paperclip className="w-3 h-3" />
                                      {att.name}
                                    </div>
                                  ))}
                                </div>
                              )}
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

                {/* Attachments Preview */}
                {attachments.length > 0 && (
                  <div className="px-4 py-2 border-t border-gray-700 flex gap-2 flex-wrap">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300">
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{file.name}</span>
                        <button 
                          onClick={() => removeAttachment(index)}
                          className="hover:text-red-400"
                          data-testid={`remove-attachment-${index}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileSelect}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="button-attach"
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
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
                      disabled={chatMutation.isPending || (!inputMessage.trim() && attachments.length === 0)}
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

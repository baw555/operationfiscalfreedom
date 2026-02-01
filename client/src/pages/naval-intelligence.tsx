import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { useVeteranVerification } from "@/components/veteran-verification-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Video, 
  Music, 
  Film,
  Share2,
  Copy, 
  Wand2, 
  Download, 
  Play, 
  Pause, 
  RefreshCw,
  Image,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Flag,
  Star,
  Heart,
  Users
} from "lucide-react";

const GENERATION_TYPES = {
  "text-to-video": { icon: Video, label: "Text to Video", color: "bg-blue-500" },
  "image-to-video": { icon: Image, label: "Image to Video", color: "bg-purple-500" },
  "text-to-music": { icon: Music, label: "Text to Music", color: "bg-green-500" },
  "music-video": { icon: Film, label: "Music Video", color: "bg-red-500" }
};

const TEMPLATE_CATEGORIES = [
  { id: "memorial", label: "Memorial & Tribute", icon: Flag },
  { id: "celebration", label: "Celebration", icon: Star },
  { id: "family", label: "Family", icon: Heart },
  { id: "motivation", label: "Motivation", icon: Sparkles },
  { id: "custom", label: "Custom", icon: Wand2 }
];

const MUSIC_GENRES = [
  "Patriotic Orchestral",
  "Country",
  "Rock",
  "Pop",
  "Hip Hop",
  "R&B",
  "Classical",
  "Jazz",
  "Electronic",
  "Folk",
  "Gospel",
  "Cinematic"
];

type GenerationType = "text-to-video" | "image-to-video" | "text-to-music" | "music-video";

interface AiGeneration {
  id: number;
  type: string;
  status: string;
  prompt: string;
  generatedVideoUrl?: string;
  generatedMusicUrl?: string;
  generatedMusicVideoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt: string;
  errorMessage?: string;
}

interface AiTemplate {
  id: number;
  name: string;
  category: string;
  type: string;
  description?: string;
  videoPrompt?: string;
  musicPrompt?: string;
  musicGenre?: string;
  suggestedLyrics?: string;
  thumbnailUrl?: string;
  usageCount: number;
}

function GenerationCard({ generation }: { generation: AiGeneration }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const typeInfo = GENERATION_TYPES[generation.type as GenerationType] || GENERATION_TYPES["text-to-video"];
  const Icon = typeInfo.icon;
  
  const statusColors = {
    queued: "bg-yellow-500",
    processing: "bg-blue-500",
    completed: "bg-green-500",
    failed: "bg-red-500"
  };

  const StatusIcon = {
    queued: Clock,
    processing: Loader2,
    completed: CheckCircle,
    failed: XCircle
  }[generation.status] || Clock;

  const hasVideo = generation.status === 'completed' && generation.generatedVideoUrl;
  const hasMusic = generation.status === 'completed' && generation.generatedMusicUrl;

  return (
    <Card className="overflow-hidden border-brand-navy/20 hover:shadow-lg transition-shadow" data-testid={`card-generation-${generation.id}`}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-video bg-gradient-to-br from-brand-navy to-brand-blue cursor-pointer group">
            {hasVideo ? (
              <video 
                src={generation.generatedVideoUrl} 
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
              />
            ) : generation.thumbnailUrl ? (
              <img src={generation.thumbnailUrl} alt={generation.prompt} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-16 h-16 text-white/30" />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge className={`${typeInfo.color} text-white`}>
                <Icon className="w-3 h-3 mr-1" />
                {typeInfo.label}
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <Badge className={`${statusColors[generation.status as keyof typeof statusColors]} text-white`}>
                <StatusIcon className={`w-3 h-3 mr-1 ${generation.status === 'processing' ? 'animate-spin' : ''}`} />
                {generation.status}
              </Badge>
            </div>
            {hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-brand-navy ml-1" />
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 bg-brand-navy text-white">
            <DialogTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              {typeInfo.label} Preview
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {hasVideo && (
              <video 
                src={generation.generatedVideoUrl} 
                controls 
                autoPlay
                className="w-full rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            )}
            {hasVideo && (
              <div className="hidden items-center justify-center py-12 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Video unavailable</p>
                  <p className="text-sm text-gray-400">The video file could not be loaded</p>
                </div>
              </div>
            )}
            {hasMusic && (
              <audio 
                src={generation.generatedMusicUrl} 
                controls 
                autoPlay
                className="w-full"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            )}
            {hasMusic && (
              <div className="hidden items-center justify-center py-8 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <XCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Audio unavailable</p>
                  <p className="text-sm text-gray-400">The audio file could not be loaded</p>
                </div>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-600">{generation.prompt}</p>
            <div className="flex gap-2 mt-4">
              {hasVideo && (
                <a href={generation.generatedVideoUrl} download className="flex-1" data-testid={`download-video-${generation.id}`}>
                  <Button className="w-full bg-brand-navy hover:bg-brand-navy/90" data-testid={`button-download-video-${generation.id}`}>
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" /> Download Video
                  </Button>
                </a>
              )}
              {hasMusic && (
                <a href={generation.generatedMusicUrl} download className="flex-1" data-testid={`download-music-${generation.id}`}>
                  <Button className="w-full bg-brand-navy hover:bg-brand-navy/90" data-testid={`button-download-music-${generation.id}`}>
                    <Download className="w-4 h-4 mr-2" aria-hidden="true" /> Download Music
                  </Button>
                </a>
              )}
              {(hasVideo || hasMusic) && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      const mediaUrl = generation.generatedVideoUrl || generation.generatedMusicUrl;
                      if (mediaUrl) {
                        const url = window.location.origin + mediaUrl;
                        try {
                          await navigator.clipboard.writeText(url);
                          toast({
                            title: "Link Copied",
                            description: "Media link copied to clipboard",
                          });
                        } catch (err) {
                          toast({
                            title: "Copy Failed",
                            description: "Unable to copy link. Please copy the URL manually.",
                            variant: "destructive",
                          });
                        }
                      }
                    }}
                    className="shrink-0"
                    data-testid="button-copy-link"
                    aria-label="Copy link to clipboard"
                  >
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const mediaUrl = generation.generatedVideoUrl || generation.generatedMusicUrl;
                      if (mediaUrl) {
                        const url = window.location.origin + mediaUrl;
                        const text = `Check out this AI-generated content from Naval Intelligence! ${url}`;
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                      }
                    }}
                    className="shrink-0"
                    data-testid="button-share-twitter"
                    aria-label="Share on Twitter"
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <CardContent className="p-4">
        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{generation.prompt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(generation.createdAt).toLocaleDateString()}</span>
          {generation.duration && <span>{generation.duration}s</span>}
        </div>
        {generation.status === 'completed' && (
          <div className="flex gap-2 mt-3">
            {generation.generatedVideoUrl && (
              <a href={generation.generatedVideoUrl} download className="flex-1">
                <Button size="sm" variant="outline" className="w-full" data-testid="button-download-video" aria-label="Download video">
                  <Download className="w-4 h-4 mr-1" aria-hidden="true" /> Video
                </Button>
              </a>
            )}
            {generation.generatedMusicUrl && (
              <a href={generation.generatedMusicUrl} download className="flex-1">
                <Button size="sm" variant="outline" className="w-full" data-testid="button-download-music" aria-label="Download music">
                  <Download className="w-4 h-4 mr-1" aria-hidden="true" /> Music
                </Button>
              </a>
            )}
          </div>
        )}
        {generation.status === 'failed' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700">Generation Failed</p>
                <p className="text-xs text-red-600 mt-1">{generation.errorMessage || "An unexpected error occurred"}</p>
              </div>
            </div>
          </div>
        )}
        {generation.status === 'processing' && (
          <div className="mt-3">
            <Progress value={undefined} className="h-2 animate-pulse" />
            <p className="text-xs text-blue-600 mt-1 animate-pulse">Generating your content...</p>
          </div>
        )}
        {generation.status === 'queued' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-xs text-yellow-600">
              <Clock className="w-3 h-3" />
              <span>Queued - waiting to start</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TemplateCard({ template, onSelect }: { template: AiTemplate; onSelect: (t: AiTemplate) => void }) {
  const category = TEMPLATE_CATEGORIES.find(c => c.id === template.category);
  const Icon = category?.icon || Wand2;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg hover:border-brand-red transition-all group"
      onClick={() => onSelect(template)}
      data-testid={`card-template-${template.id}`}
    >
      <div className="relative aspect-video bg-gradient-to-br from-brand-red/20 to-brand-blue/20 rounded-t-lg overflow-hidden">
        {template.thumbnailUrl ? (
          <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="w-12 h-12 text-brand-navy/30 group-hover:text-brand-red transition-colors" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-brand-navy">{template.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline">{category?.label}</Badge>
          <span className="text-xs text-gray-400">{template.usageCount} uses</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NavalIntelligence() {
  const { showPopup, isVerified, checkVerification, VeteranPopup } = useVeteranVerification();
  
  useEffect(() => {
    checkVerification();
  }, []);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<GenerationType>("text-to-video");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [duration, setDuration] = useState("8");
  const [resolution, setResolution] = useState("720p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [musicGenre, setMusicGenre] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isInstrumental, setIsInstrumental] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AiTemplate | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "video" | "music">("all");
  const [previousPrompt, setPreviousPrompt] = useState<string | null>(null);

  const { data: generations = [], isLoading: loadingGenerations } = useQuery<AiGeneration[]>({
    queryKey: ["/api/ai/gallery"],
  });

  const { data: templates = [], isLoading: loadingTemplates } = useQuery<AiTemplate[]>({
    queryKey: ["/api/ai/templates"],
  });

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/ai/generate", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Generation Started",
        description: "Your content is being generated. Check the gallery for progress.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ai/gallery"] });
      setPrompt("");
      setNegativePrompt("");
      setLyrics("");
      setSelectedTemplate(null);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to start generation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a description for your content.",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      type: activeTab,
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      duration: parseInt(duration),
      resolution,
      aspectRatio,
      musicGenre: activeTab.includes("music") ? musicGenre : undefined,
      musicLyrics: activeTab === "text-to-music" ? lyrics : undefined,
      musicInstrumental: isInstrumental,
      templateId: selectedTemplate?.id,
    });
  };

  const handleTemplateSelect = (template: AiTemplate) => {
    setSelectedTemplate(template);
    if (template.videoPrompt) setPrompt(template.videoPrompt);
    if (template.musicPrompt && activeTab.includes("music")) setPrompt(template.musicPrompt);
    if (template.musicGenre) setMusicGenre(template.musicGenre);
    if (template.suggestedLyrics) setLyrics(template.suggestedLyrics);
    
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been loaded. Customize it to your needs!`,
    });
  };

  const activeGenerations = generations.filter(g => g.status === 'processing' || g.status === 'queued');
  const completedGenerations = generations.filter(g => g.status === 'completed');

  // Stats for the dashboard
  const totalGenerations = generations.length;
  const totalTemplates = templates.length;
  const totalDuration = generations.reduce((sum, g) => sum + (g.duration || 0), 0);

  return (
    <Layout>
      <VeteranPopup />
      <div className="bg-gradient-to-b from-gray-50 to-white">
        {/* Enhanced Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-[url('/patterns/stars.svg')] opacity-10" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">Powered by Google Veo 3.1 & Suno V5</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-display text-white mb-6 leading-tight">
                  Naval<br />
                  <span className="text-brand-gold">Intelligence</span>
                </h1>
                <p className="text-xl text-white/80 mb-4 max-w-lg">
                  State-of-the-art AI video and music creation suite built exclusively for veteran families.
                </p>
                <p className="text-lg text-white/60 mb-8 max-w-lg">
                  Create stunning tribute videos, memorial content, and original patriotic music in minutes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90 font-display text-lg px-8"
                    onClick={() => document.getElementById('create-section')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-start-creating"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Start Creating
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' })}
                    data-testid="button-view-gallery"
                  >
                    <Film className="w-5 h-5 mr-2" />
                    View Gallery
                  </Button>
                </div>
              </div>
              
              {/* Right: Featured Video Showcase */}
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/50 to-transparent z-10 pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                  <video 
                    src="/videos/flag-tribute.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full aspect-video object-cover"
                    aria-label="Featured AI-generated flag tribute video"
                    data-testid="video-hero-showcase"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white font-medium">Featured Creation</p>
                    <p className="text-white/70 text-sm">AI-Generated Flag Tribute Video</p>
                  </div>
                </div>
                {/* Floating stats cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 z-20" data-testid="stat-videos-created">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-navy" aria-label={`${totalGenerations} videos created`}>{totalGenerations}</p>
                      <p className="text-xs text-gray-500">Videos Created</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 z-20" data-testid="stat-total-runtime">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Video className="w-5 h-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-navy" aria-label={`${totalDuration} seconds total runtime`}>{totalDuration}s</p>
                      <p className="text-xs text-gray-500">Total Runtime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Bar */}
        <section className="bg-white border-b py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Video className="w-5 h-5 text-brand-blue" />
                  <span className="text-3xl font-display text-brand-navy">{totalGenerations}</span>
                </div>
                <p className="text-sm text-gray-500">Videos in Gallery</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flag className="w-5 h-5 text-brand-red" />
                  <span className="text-3xl font-display text-brand-navy">{totalTemplates}</span>
                </div>
                <p className="text-sm text-gray-500">Veteran Templates</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-brand-gold" />
                  <span className="text-3xl font-display text-brand-navy">{totalDuration}</span>
                </div>
                <p className="text-sm text-gray-500">Seconds of Content</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <span className="text-3xl font-display text-brand-navy">4K</span>
                </div>
                <p className="text-sm text-gray-500">Max Resolution</p>
              </div>
            </div>
          </div>
        </section>

        {/* Active Generations Banner */}
        {activeGenerations.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 py-3" role="status" aria-live="polite">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" aria-hidden="true" />
                <span className="text-blue-700 font-medium">
                  {activeGenerations.length} generation{activeGenerations.length > 1 ? 's' : ''} in progress
                </span>
                <div className="flex-1 max-w-xs">
                  <Progress value={undefined} className="animate-pulse" />
                  <span className="sr-only">Processing your content</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <section id="create-section" className="py-12 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Panel - Generation Form */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-brand-navy/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-brand-navy/5 to-brand-blue/5 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-red to-brand-navy flex items-center justify-center">
                        <Wand2 className="w-5 h-5 text-white" />
                      </div>
                      Create New Content
                    </CardTitle>
                    <CardDescription className="text-base">
                      Use AI to generate videos, music, and complete music videos for your veteran family
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GenerationType)}>
                      <TabsList className="grid grid-cols-4 w-full mb-6" aria-label="Content generation types">
                        {Object.entries(GENERATION_TYPES).map(([key, { icon: Icon, label }]) => (
                          <TabsTrigger 
                            key={key} 
                            value={key} 
                            className="flex items-center gap-2 text-xs sm:text-sm"
                            data-testid={`tab-${key}`}
                            aria-label={label}
                          >
                            <Icon className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">{label}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <div className="space-y-4">
                        {/* Prompt Input */}
                        <div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="prompt" className="text-base font-semibold">
                              {activeTab.includes("video") ? "Describe your video" : "Describe your music"}
                            </Label>
                            <div className="flex gap-2">
                              {previousPrompt && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setPrompt(previousPrompt);
                                    setPreviousPrompt(null);
                                    toast({
                                      title: "Prompt Restored",
                                      description: "Reverted to your original prompt.",
                                    });
                                  }}
                                  className="text-gray-500 hover:text-gray-700"
                                  data-testid="button-undo-enhance"
                                >
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  Undo
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (!prompt.trim()) {
                                    toast({
                                      title: "Enter a prompt first",
                                      description: "Write a basic description, then click enhance to improve it.",
                                    });
                                    return;
                                  }
                                  const enhancements = activeTab.includes("video") ? [
                                    "cinematic lighting, professional quality, 4K resolution, slow motion",
                                    "dramatic composition, emotional atmosphere, golden hour lighting",
                                    "patriotic theme, honoring service, smooth camera movement",
                                    "detailed textures, vibrant colors, studio quality footage"
                                  ] : [
                                    "emotional crescendo, rich orchestration, professional mixing",
                                    "patriotic brass section, stirring strings, powerful drums",
                                    "uplifting melody, harmonious arrangement, studio quality",
                                    "inspiring anthem, full orchestra, dramatic dynamics"
                                  ];
                                  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
                                  setPreviousPrompt(prompt);
                                  setPrompt(prev => `${prev.trim()}, ${randomEnhancement}`);
                                  toast({
                                    title: "Prompt Enhanced",
                                    description: "Added professional quality suggestions. Click Undo to revert.",
                                  });
                                }}
                                className="text-brand-blue hover:text-brand-navy"
                                data-testid="button-enhance-prompt"
                              >
                                <Sparkles className="w-4 h-4 mr-1" />
                                Enhance
                              </Button>
                            </div>
                          </div>
                          <Textarea
                            id="prompt"
                            placeholder={
                              activeTab === "text-to-video" 
                                ? "A cinematic aerial shot of the American flag waving at sunset over a military cemetery, with golden light casting long shadows..." 
                                : activeTab === "text-to-music"
                                ? "An uplifting patriotic orchestral piece with powerful brass, stirring strings, and a hopeful melody..."
                                : "Describe what you want to create..."
                            }
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="mt-2 min-h-[120px] border-2 focus:border-brand-blue transition-colors"
                            data-testid="input-prompt"
                          />
                          {selectedTemplate && (
                            <p className="text-sm text-brand-blue mt-1">
                              Using template: <strong>{selectedTemplate.name}</strong>
                              <Button 
                                variant="link" 
                                size="sm" 
                                onClick={() => setSelectedTemplate(null)}
                                className="text-red-500 ml-2"
                                data-testid="button-clear-template"
                                aria-label="Clear selected template"
                              >
                                Clear
                              </Button>
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Tip: Click "Enhance" to add professional quality suggestions to your prompt
                          </p>
                        </div>

                        {/* Video-specific options */}
                        {activeTab.includes("video") && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <Label>Duration</Label>
                              <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger data-testid="select-duration">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="4">4 seconds</SelectItem>
                                  <SelectItem value="6">6 seconds</SelectItem>
                                  <SelectItem value="8">8 seconds</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Resolution</Label>
                              <Select value={resolution} onValueChange={setResolution}>
                                <SelectTrigger data-testid="select-resolution">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="720p">720p</SelectItem>
                                  <SelectItem value="1080p">1080p</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Aspect Ratio</Label>
                              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                                <SelectTrigger data-testid="select-aspect-ratio">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="16:9">16:9 Landscape</SelectItem>
                                  <SelectItem value="9:16">9:16 Portrait</SelectItem>
                                  <SelectItem value="1:1">1:1 Square</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* Music-specific options */}
                        {activeTab.includes("music") && (
                          <div className="space-y-4">
                            <div>
                              <Label>Genre</Label>
                              <Select value={musicGenre} onValueChange={setMusicGenre}>
                                <SelectTrigger data-testid="select-genre">
                                  <SelectValue placeholder="Select a genre" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MUSIC_GENRES.map((genre) => (
                                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {activeTab === "text-to-music" && (
                              <>
                                <div>
                                  <Label>Custom Lyrics (Optional)</Label>
                                  <Textarea
                                    placeholder="Enter your lyrics or leave blank for instrumental..."
                                    value={lyrics}
                                    onChange={(e) => setLyrics(e.target.value)}
                                    className="mt-1 min-h-[100px]"
                                    data-testid="input-lyrics"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="instrumental"
                                    checked={isInstrumental}
                                    onChange={(e) => setIsInstrumental(e.target.checked)}
                                    className="rounded"
                                  />
                                  <Label htmlFor="instrumental">Instrumental only (no vocals)</Label>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Negative Prompt */}
                        <div>
                          <Label htmlFor="negative-prompt" className="text-sm text-gray-600">
                            What to avoid (optional)
                          </Label>
                          <Input
                            id="negative-prompt"
                            placeholder="e.g., blurry, low quality, text overlays..."
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            className="mt-1"
                            data-testid="input-negative-prompt"
                          />
                        </div>

                        {/* Generate Button */}
                        <Button 
                          onClick={handleGenerate}
                          disabled={generateMutation.isPending || !prompt.trim()}
                          className="w-full h-12 text-lg font-display bg-gradient-to-r from-brand-red to-brand-navy hover:opacity-90"
                          data-testid="button-generate"
                        >
                          {generateMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Starting Generation...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-2" />
                              Generate {GENERATION_TYPES[activeTab].label}
                            </>
                          )}
                        </Button>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Templates Section */}
                <div className="mt-8">
                  <h2 className="text-2xl font-display text-brand-navy mb-4 flex items-center gap-2">
                    <Flag className="w-6 h-6 text-brand-red" />
                    Veteran Templates
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Start with a pre-made template designed for veteran families
                  </p>
                  {loadingTemplates ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-48" />
                      ))}
                    </div>
                  ) : templates.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {templates.map(template => (
                        <TemplateCard 
                          key={template.id} 
                          template={template}
                          onSelect={handleTemplateSelect}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Wand2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Templates coming soon! Use custom prompts above.</p>
                    </Card>
                  )}
                </div>
              </div>

              {/* Right Panel - Gallery */}
              <div id="gallery-section" className="scroll-mt-20">
                <Card className="sticky top-24 shadow-lg border-2 border-brand-navy/10">
                  <CardHeader className="bg-gradient-to-r from-brand-blue/5 to-brand-navy/5 border-b">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-navy flex items-center justify-center">
                          <Film className="w-4 h-4 text-white" />
                        </div>
                        Your Gallery
                      </span>
                      <Badge className="bg-brand-navy text-white">{generations.length} items</Badge>
                    </CardTitle>
                    <CardDescription>
                      Your AI-generated content collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[600px] overflow-y-auto space-y-4 p-4">
                    {loadingGenerations ? (
                      <div className="space-y-4">
                        {[1,2].map(i => (
                          <div key={i} className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg h-48" />
                        ))}
                      </div>
                    ) : generations.length > 0 ? (
                      <>
                        {/* Gallery Filter Tabs */}
                        <div className="flex gap-2 mb-4 flex-wrap" role="tablist" aria-label="Filter gallery content">
                          <button 
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${galleryFilter === "all" ? "bg-brand-navy text-white border-brand-navy" : "border-input bg-background hover:bg-brand-navy hover:text-white"}`}
                            onClick={() => setGalleryFilter("all")}
                            onKeyDown={(e) => e.key === 'Enter' && setGalleryFilter("all")}
                            role="tab"
                            tabIndex={0}
                            aria-selected={galleryFilter === "all"}
                            data-testid="filter-all"
                          >
                            All ({generations.length})
                          </button>
                          <button 
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${galleryFilter === "video" ? "bg-brand-blue text-white border-brand-blue" : "border-input bg-background hover:bg-brand-blue hover:text-white"}`}
                            onClick={() => setGalleryFilter("video")}
                            onKeyDown={(e) => e.key === 'Enter' && setGalleryFilter("video")}
                            role="tab"
                            tabIndex={0}
                            aria-selected={galleryFilter === "video"}
                            data-testid="filter-videos"
                          >
                            Videos ({generations.filter(g => g.type.includes('video')).length})
                          </button>
                          <button 
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 ${galleryFilter === "music" ? "bg-green-600 text-white border-green-600" : "border-input bg-background hover:bg-green-500 hover:text-white"}`}
                            onClick={() => setGalleryFilter("music")}
                            onKeyDown={(e) => e.key === 'Enter' && setGalleryFilter("music")}
                            role="tab"
                            tabIndex={0}
                            aria-selected={galleryFilter === "music"}
                            data-testid="filter-music"
                          >
                            Music ({generations.filter(g => g.type === 'text-to-music').length})
                          </button>
                        </div>
                        {generations
                          .filter(g => {
                            if (galleryFilter === "all") return true;
                            if (galleryFilter === "video") return g.type.includes('video');
                            if (galleryFilter === "music") return g.type === 'text-to-music';
                            return true;
                          })
                          .map(generation => (
                            <GenerationCard key={generation.id} generation={generation} />
                          ))}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <Video className="w-10 h-10 text-gray-300" aria-hidden="true" />
                        </div>
                        <p className="text-gray-600 font-medium mb-2">No creations yet</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Use the form to create your first AI video or music
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => document.getElementById('create-section')?.scrollIntoView({ behavior: 'smooth' })}
                          data-testid="button-empty-start-creating"
                          aria-label="Start creating content"
                        >
                          <Wand2 className="w-4 h-4 mr-2" aria-hidden="true" />
                          Start Creating
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display text-brand-navy text-center mb-12">
              What You Can Create
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Video,
                  title: "Memorial Videos",
                  description: "Create beautiful tribute videos honoring your veteran's service and sacrifice"
                },
                {
                  icon: Music,
                  title: "Original Music",
                  description: "Generate patriotic songs with AI vocals or instrumental tracks"
                },
                {
                  icon: Film,
                  title: "Music Videos",
                  description: "Combine AI video and music for complete audiovisual productions"
                },
                {
                  icon: Users,
                  title: "Family Celebrations",
                  description: "Create videos for homecomings, graduations, and family milestones"
                }
              ].map((feature, i) => (
                <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-red to-brand-blue mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-navy mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

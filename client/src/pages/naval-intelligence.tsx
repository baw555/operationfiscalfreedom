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
  Users,
  Workflow,
  ArrowRight,
  Brain,
  Mic,
  FileAudio,
  Upload,
  Zap,
  Settings2
} from "lucide-react";

const GENERATION_TYPES = {
  "text-to-video": { icon: Video, label: "Text to Video", color: "bg-blue-500" },
  "image-to-video": { icon: Image, label: "Image to Video", color: "bg-purple-500" },
  "text-to-music": { icon: Music, label: "Text to Music", color: "bg-green-500" },
  "music-video": { icon: Film, label: "Music Video", color: "bg-red-500" }
};

const MODEL_ICONS: Record<string, any> = {
  "text-reasoning": Brain,
  "image-generation": Image,
  "text-to-speech": Mic,
  "speech-to-text": FileAudio,
  "music-generation": Music,
  "video-generation": Video,
  "fusion": Workflow,
};

const MODEL_COLORS: Record<string, string> = {
  "text-reasoning": "from-purple-500 to-indigo-600",
  "image-generation": "from-pink-500 to-rose-600",
  "text-to-speech": "from-green-500 to-emerald-600",
  "speech-to-text": "from-teal-500 to-cyan-600",
  "music-generation": "from-orange-500 to-amber-600",
  "video-generation": "from-blue-500 to-sky-600",
  "fusion": "from-red-500 to-brand-red",
};

interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  steps: Array<{ taskType: string; description: string }>;
}

interface RouterDecision {
  selectedTemplate: string | null;
  taskTypes: string[];
  reasoning: string;
  steps: Array<{ order: number; taskType: string; description: string }>;
  estimatedDuration: string;
  estimatedCost: number;
  selectedModels?: Array<{ taskType: string; model: string; modelId: string }>;
}

function OrchestrationPanel() {
  const { toast } = useToast();
  const [userIntent, setUserIntent] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [routerDecision, setRouterDecision] = useState<RouterDecision | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [preferSpeed, setPreferSpeed] = useState(false);
  const [preferQuality, setPreferQuality] = useState(true);

  const { data: orchestrationData } = useQuery({
    queryKey: ["/api/orchestration/models"],
    queryFn: async () => {
      const res = await fetch("/api/orchestration/models");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const templates: PipelineTemplate[] = orchestrationData?.templates || [];

  const handleRouteIntent = async () => {
    if (!userIntent.trim()) {
      toast({ title: "Describe your creation", description: "Tell us what you want to create", variant: "destructive" });
      return;
    }

    setIsRouting(true);
    try {
      const res = await fetch("/api/orchestration/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIntent,
          inputs: [
            ...(uploadedImages.length ? [{ type: "image", count: uploadedImages.length }] : []),
            ...(uploadedAudio ? [{ type: "audio", name: uploadedAudio.name }] : []),
          ],
          preferSpeed,
          preferQuality,
        }),
      });

      if (!res.ok) throw new Error("Routing failed");
      
      const decision = await res.json();
      setRouterDecision(decision);
      toast({ title: "Pipeline Planned", description: `${decision.steps?.length || 0} steps identified` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to analyze your request", variant: "destructive" });
    } finally {
      setIsRouting(false);
    }
  };

  const handleExecutePipeline = async () => {
    if (!routerDecision) return;

    toast({ 
      title: "Pipeline Started", 
      description: "Your creation is being processed. This may take a few minutes.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl">AI Orchestration Engine</span>
              <p className="text-sm font-normal text-gray-500 mt-1">
                Smart router that chains the perfect models for your creation
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-2 block">What do you want to create?</Label>
            <Textarea
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
              placeholder="Example: Create a memorial tribute video using my photos with patriotic music and voice narration..."
              className="min-h-[100px] text-base"
              data-testid="input-orchestration-intent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Upload Images (optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={(e) => setUploadedImages(Array.from(e.target.files || []))}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {uploadedImages.length > 0 
                      ? `${uploadedImages.length} image(s) selected` 
                      : "Click to upload images"}
                  </p>
                </label>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Upload Audio (optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  id="audio-upload"
                  onChange={(e) => setUploadedAudio(e.target.files?.[0] || null)}
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <FileAudio className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {uploadedAudio ? uploadedAudio.name : "Click to upload audio"}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferQuality}
                onChange={(e) => { setPreferQuality(e.target.checked); if (e.target.checked) setPreferSpeed(false); }}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Prioritize Quality</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferSpeed}
                onChange={(e) => { setPreferSpeed(e.target.checked); if (e.target.checked) setPreferQuality(false); }}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm">Prioritize Speed</span>
            </label>
          </div>

          <Button
            onClick={handleRouteIntent}
            disabled={isRouting || !userIntent.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg"
            data-testid="button-analyze-pipeline"
          >
            {isRouting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing your request...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Analyze & Plan Pipeline
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {routerDecision && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Pipeline Plan Ready
            </CardTitle>
            <CardDescription>{routerDecision.reasoning}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estimated Duration: <strong>{routerDecision.estimatedDuration}</strong></span>
              <span className="text-gray-600">Estimated Cost: <strong>${routerDecision.estimatedCost?.toFixed(2) || "0.00"}</strong></span>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-blue-400 to-green-400" />
              
              <div className="space-y-4">
                {routerDecision.steps?.map((step, index) => {
                  const IconComponent = MODEL_ICONS[step.taskType] || Sparkles;
                  const colorClass = MODEL_COLORS[step.taskType] || "from-gray-500 to-gray-600";
                  const selectedModel = routerDecision.selectedModels?.find(m => m.taskType === step.taskType);
                  
                  return (
                    <div key={index} className="relative flex items-start gap-4 pl-0" data-testid={`pipeline-step-${index}`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg z-10`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Step {step.order}: {step.taskType.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</h4>
                          {selectedModel && (
                            <Badge variant="outline" className="text-xs">{selectedModel.model}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                      {index < (routerDecision.steps?.length || 0) - 1 && (
                        <ArrowRight className="absolute -bottom-4 left-5 w-4 h-4 text-gray-400 z-10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleExecutePipeline}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg"
              data-testid="button-execute-pipeline"
            >
              <Play className="w-5 h-5 mr-2" />
              Execute Pipeline
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? "border-2 border-purple-500 bg-purple-50" : "border hover:border-purple-300"
            }`}
            onClick={() => {
              setSelectedTemplate(template.id);
              setUserIntent(`Use the "${template.name}" workflow: ${template.description}`);
            }}
            data-testid={`template-${template.id}`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Workflow className="w-5 h-5 text-purple-600" />
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.steps.map((step, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {step.taskType.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const TEMPLATE_CATEGORIES = [
  { id: "memorial", label: "Memorial & Tribute", icon: Flag },
  { id: "celebration", label: "Celebration", icon: Star },
  { id: "family", label: "Family", icon: Heart },
  { id: "motivation", label: "Motivation", icon: Sparkles },
  { id: "custom", label: "Custom", icon: Wand2 }
];

const IMAGE_STYLES = [
  { id: "photorealistic", label: "Photorealistic", description: "Ultra-realistic photography" },
  { id: "cinematic", label: "Cinematic", description: "Movie-quality visuals" },
  { id: "oil-painting", label: "Oil Painting", description: "Classic art style" },
  { id: "watercolor", label: "Watercolor", description: "Soft, artistic style" },
  { id: "digital-art", label: "Digital Art", description: "Modern digital illustration" },
  { id: "vintage", label: "Vintage", description: "Retro, nostalgic look" },
];

const VOICE_OPTIONS = [
  { id: "alloy", label: "Alloy", description: "Neutral, balanced" },
  { id: "echo", label: "Echo", description: "Warm, inviting" },
  { id: "fable", label: "Fable", description: "Expressive, storyteller" },
  { id: "onyx", label: "Onyx", description: "Deep, authoritative" },
  { id: "nova", label: "Nova", description: "Youthful, energetic" },
  { id: "shimmer", label: "Shimmer", description: "Clear, professional" },
];

function ImageGenerationPanel() {
  const { toast } = useToast();
  const [imagePrompt, setImagePrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("photorealistic");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [quality, setQuality] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{
    url: string;
    prompt: string;
    style: string;
    createdAt: string;
  }>>([]);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast({ title: "Enter a description", description: "Describe the image you want to create", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: selectedStyle,
          aspectRatio,
          quality,
        }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!res.ok) throw new Error("Generation failed");
      
      const data = await res.json();
      
      setGeneratedImages(prev => [data.image, ...prev]);
      toast({ title: "Image Generated!", description: "Your AI image is ready" });
      setImagePrompt("");
    } catch (error) {
      clearInterval(progressInterval);
      toast({ title: "Generation Failed", description: "Unable to generate image. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  return (
    <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl">AI Image Generator</span>
            <p className="text-sm font-normal text-gray-500 mt-1">
              Create stunning images with GPT-4o Vision
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-2 block">Describe your image</Label>
          <Textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="A majestic bald eagle soaring over the American flag at sunset, photorealistic, dramatic lighting..."
            className="min-h-[100px] text-base"
            data-testid="input-image-prompt"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Style</Label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger data-testid="select-image-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    <div className="flex flex-col">
                      <span>{style.label}</span>
                      <span className="text-xs text-gray-500">{style.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger data-testid="select-image-aspect">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">1:1 Square</SelectItem>
                <SelectItem value="16:9">16:9 Landscape</SelectItem>
                <SelectItem value="9:16">9:16 Portrait</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Quality</Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger data-testid="select-image-quality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="hd">HD (Higher detail)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-pink-600 font-medium flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating your image...
              </span>
              <span className="text-gray-500">{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}

        <Button
          onClick={generateImage}
          disabled={isGenerating || !imagePrompt.trim()}
          className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-6 text-lg"
          data-testid="button-generate-image"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Image...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Image
            </>
          )}
        </Button>

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-gray-700">Generated Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {generatedImages.map((img, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={img.url} 
                    alt={img.prompt}
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-xs line-clamp-2 mb-2">{img.prompt}</p>
                      <div className="flex gap-2">
                        <a href={img.url} download={`ai-image-${index}.png`} className="flex-1">
                          <Button size="sm" variant="secondary" className="w-full">
                            <Download className="w-3 h-3 mr-1" /> Save
                          </Button>
                        </a>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(img.url);
                            toast({ title: "Copied!", description: "Image URL copied to clipboard" });
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TextToSpeechPanel() {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [speed, setSpeed] = useState("1.0");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast({ title: "Enter text", description: "Provide the text you want converted to speech", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
          speed: parseFloat(speed),
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      
      const data = await res.json();
      setAudioUrl(data.audio.data);
      toast({ title: "Speech Generated!", description: "Your audio is ready to play" });
    } catch (error) {
      toast({ title: "Generation Failed", description: "Unable to generate speech. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl">Text to Speech</span>
            <p className="text-sm font-normal text-gray-500 mt-1">
              Convert text to natural-sounding speech
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-2 block">Enter your text</Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech. This could be a narration, message, or any content..."
            className="min-h-[100px] text-base"
            data-testid="input-tts-text"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Voice</Label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger data-testid="select-voice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col">
                      <span>{voice.label}</span>
                      <span className="text-xs text-gray-500">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Speed</Label>
            <Select value={speed} onValueChange={setSpeed}>
              <SelectTrigger data-testid="select-speed">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                <SelectItem value="0.75">0.75x</SelectItem>
                <SelectItem value="1.0">1x (Normal)</SelectItem>
                <SelectItem value="1.25">1.25x</SelectItem>
                <SelectItem value="1.5">1.5x (Fast)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {audioUrl && (
          <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
            <Label className="text-sm font-medium mb-2 block text-green-700">Generated Audio</Label>
            <audio src={audioUrl} controls className="w-full" data-testid="audio-output" />
            <a href={audioUrl} download="speech.mp3" className="block mt-2">
              <Button variant="outline" size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" /> Download Audio
              </Button>
            </a>
          </div>
        )}

        <Button
          onClick={generateSpeech}
          disabled={isGenerating || !text.trim()}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg"
          data-testid="button-generate-speech"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Speech...
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Generate Speech
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

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

        {/* Model Registry - Showing the AI Router */}
        <section className="py-12 bg-gradient-to-br from-gray-900 via-brand-navy to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display text-white mb-3">AI Model Router</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                This is orchestration, not magic. Each task is routed to the optimal model for maximum quality.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all group" data-testid="model-text-reasoning">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Text Reasoning</h3>
                <p className="text-xs text-gray-400 mb-2">Scene planning, scripts</p>
                <Badge className="bg-purple-500/20 text-purple-300 text-xs">GPT-4o</Badge>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-pink-500/30 hover:border-pink-400/50 transition-all group" data-testid="model-image-gen">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Image Generation</h3>
                <p className="text-xs text-gray-400 mb-2">Thumbnails, frames</p>
                <Badge className="bg-pink-500/20 text-pink-300 text-xs">GPT Image</Badge>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 hover:border-green-400/50 transition-all group" data-testid="model-tts">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Text to Speech</h3>
                <p className="text-xs text-gray-400 mb-2">Narration, voiceover</p>
                <Badge className="bg-green-500/20 text-green-300 text-xs">GPT Audio</Badge>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30 hover:border-orange-400/50 transition-all group" data-testid="model-music">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Music Generation</h3>
                <p className="text-xs text-gray-400 mb-2">Background tracks</p>
                <Badge className="bg-orange-500/20 text-orange-300 text-xs">Suno V5</Badge>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all group" data-testid="model-video">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Video Generation</h3>
                <p className="text-xs text-gray-400 mb-2">Full video creation</p>
                <Badge className="bg-blue-500/20 text-blue-300 text-xs">Veo 3.1</Badge>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-red-500/30 hover:border-red-400/50 transition-all group" data-testid="model-fusion">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-brand-red flex items-center justify-center mb-3 group-hover:scale-110 transition-transform animate-pulse">
                  <Workflow className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">Fusion Pipeline</h3>
                <p className="text-xs text-gray-400 mb-2">Multi-model chains</p>
                <Badge className="bg-red-500/20 text-red-300 text-xs">Orchestrated</Badge>
              </div>
            </div>

            {/* Example Fusion Flow */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-gold" />
                Example Fusion Pipeline: Images + Audio → Movie
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4" data-testid="fusion-pipeline-example">
                <div className="flex flex-col items-center p-3 bg-gray-900/50 rounded-xl border border-gray-700/50" data-testid="pipeline-step-upload">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload</span>
                  <span className="text-xs text-white font-medium">Images + Audio</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 hidden md:block" />
                <div className="flex flex-col items-center p-3 bg-purple-900/30 rounded-xl border border-purple-500/30" data-testid="pipeline-step-scene-planner">
                  <Brain className="w-6 h-6 text-purple-400 mb-1" />
                  <span className="text-xs text-gray-400">Step 1</span>
                  <span className="text-xs text-white font-medium">Scene Planner</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 hidden md:block" />
                <div className="flex flex-col items-center p-3 bg-cyan-900/30 rounded-xl border border-cyan-500/30" data-testid="pipeline-step-frame-timing">
                  <Clock className="w-6 h-6 text-cyan-400 mb-1" />
                  <span className="text-xs text-gray-400">Step 2</span>
                  <span className="text-xs text-white font-medium">Frame Timing</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 hidden md:block" />
                <div className="flex flex-col items-center p-3 bg-blue-900/30 rounded-xl border border-blue-500/30" data-testid="pipeline-step-video-generator">
                  <Video className="w-6 h-6 text-blue-400 mb-1" />
                  <span className="text-xs text-gray-400">Step 3</span>
                  <span className="text-xs text-white font-medium">Video Generator</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 hidden md:block" />
                <div className="flex flex-col items-center p-3 bg-green-900/30 rounded-xl border border-green-500/30" data-testid="pipeline-step-audio-sync">
                  <FileAudio className="w-6 h-6 text-green-400 mb-1" />
                  <span className="text-xs text-gray-400">Step 4</span>
                  <span className="text-xs text-white font-medium">Audio Sync</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 hidden md:block" />
                <div className="flex flex-col items-center p-3 bg-orange-900/30 rounded-xl border border-orange-500/30" data-testid="pipeline-step-render">
                  <Settings2 className="w-6 h-6 text-orange-400 mb-1" />
                  <span className="text-xs text-gray-400">Step 5</span>
                  <span className="text-xs text-white font-medium">Render</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 hidden md:block" />
                <div className="flex flex-col items-center p-3 bg-brand-gold/20 rounded-xl border border-brand-gold/50" data-testid="pipeline-step-download">
                  <Download className="w-6 h-6 text-brand-gold mb-1" />
                  <span className="text-xs text-gray-400">Output</span>
                  <span className="text-xs text-white font-medium">Download</span>
                </div>
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

        {/* AI Orchestrator Section - NEW */}
        <section id="orchestrator-section" className="py-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge className="bg-purple-100 text-purple-700 mb-4">NEW: AI Orchestration Engine</Badge>
              <h2 className="text-3xl md:text-4xl font-display text-brand-navy mb-4">
                Smart Model <span className="text-purple-600">Router</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Describe what you want to create, and our AI router will automatically select and chain the best models for each task.
                <br />
                <strong>Image + Audio → Scene Planner → Video Generator → Audio Sync → Render → Download</strong>
              </p>
            </div>
            <OrchestrationPanel />
            
            {/* Quick Generation Tools */}
            <div className="mt-12 grid lg:grid-cols-2 gap-8">
              <ImageGenerationPanel />
              <TextToSpeechPanel />
            </div>
          </div>
        </section>

        {/* Main Content - Direct Creation */}
        <section id="create-section" className="py-12 scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display text-brand-navy mb-2">Direct Creation Tools</h2>
              <p className="text-gray-600">Or use individual tools for specific generation tasks</p>
            </div>
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

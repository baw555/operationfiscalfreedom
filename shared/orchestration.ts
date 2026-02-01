export type TaskType = 
  | "text-reasoning"
  | "image-generation"
  | "image-to-video"
  | "text-to-video"
  | "text-to-speech"
  | "speech-to-text"
  | "music-generation"
  | "video-generation"
  | "fusion";

export type ModelProvider = "openai" | "veo" | "suno" | "elevenlabs" | "internal";

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  taskTypes: TaskType[];
  description: string;
  costPerUnit: number;
  avgLatencyMs: number;
  maxInputTokens?: number;
  outputFormats?: string[];
}

export const MODEL_REGISTRY: ModelConfig[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    taskTypes: ["text-reasoning"],
    description: "Most capable model for complex reasoning and planning tasks",
    costPerUnit: 0.005,
    avgLatencyMs: 2000,
    maxInputTokens: 128000,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    taskTypes: ["text-reasoning"],
    description: "Fast and efficient for simpler reasoning tasks",
    costPerUnit: 0.001,
    avgLatencyMs: 800,
    maxInputTokens: 128000,
  },
  {
    id: "gpt-image-1",
    name: "GPT Image",
    provider: "openai",
    taskTypes: ["image-generation"],
    description: "High-quality image generation from text prompts",
    costPerUnit: 0.04,
    avgLatencyMs: 15000,
    outputFormats: ["png", "jpg"],
  },
  {
    id: "gpt-audio",
    name: "GPT Audio",
    provider: "openai",
    taskTypes: ["text-to-speech", "speech-to-text"],
    description: "Speech synthesis and transcription",
    costPerUnit: 0.006,
    avgLatencyMs: 3000,
    outputFormats: ["mp3", "wav"],
  },
  {
    id: "veo-3.1",
    name: "Veo 3.1",
    provider: "veo",
    taskTypes: ["text-to-video", "image-to-video", "video-generation"],
    description: "Google's advanced video generation model",
    costPerUnit: 0.15,
    avgLatencyMs: 60000,
    outputFormats: ["mp4"],
  },
  {
    id: "suno-v5",
    name: "Suno V5",
    provider: "suno",
    taskTypes: ["music-generation"],
    description: "AI music generation with vocals and instrumentals",
    costPerUnit: 0.05,
    avgLatencyMs: 30000,
    outputFormats: ["mp3", "wav"],
  },
];

export interface PipelineStep {
  id: string;
  taskType: TaskType;
  modelId: string;
  input: PipelineInput;
  dependsOn: string[];
  status: "pending" | "running" | "completed" | "failed";
  output?: PipelineOutput;
  error?: string;
}

export interface PipelineInput {
  type: "text" | "image" | "audio" | "video" | "previous-step";
  content?: string;
  url?: string;
  stepId?: string;
  metadata?: Record<string, any>;
}

export interface PipelineOutput {
  type: "text" | "image" | "audio" | "video";
  content?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface OrchestrationPipeline {
  id: string;
  name: string;
  description: string;
  steps: PipelineStep[];
  status: "draft" | "running" | "completed" | "failed";
  createdAt: Date;
  completedAt?: Date;
  totalCost?: number;
  finalOutput?: PipelineOutput;
}

export interface RouterDecision {
  taskType: TaskType;
  selectedModel: ModelConfig;
  reasoning: string;
  estimatedCost: number;
  estimatedLatency: number;
}

export interface OrchestrationRequest {
  userIntent: string;
  inputs: PipelineInput[];
  preferSpeed?: boolean;
  preferQuality?: boolean;
  maxBudget?: number;
}

export interface FusionRequest {
  images?: string[];
  audio?: string;
  text?: string;
  duration?: number;
  style?: string;
  outputFormat: "video" | "slideshow" | "music-video";
}

export const PIPELINE_TEMPLATES = [
  {
    id: "image-audio-to-movie",
    name: "Images + Audio → Movie",
    description: "Combine images with audio narration or music to create a video",
    steps: [
      { taskType: "text-reasoning", description: "Scene planner - analyze images and create timing" },
      { taskType: "video-generation", description: "Generate video from planned scenes" },
      { taskType: "fusion", description: "Sync audio with video and render" },
    ],
  },
  {
    id: "text-to-music-video",
    name: "Text → Music Video",
    description: "Generate a complete music video from a text description",
    steps: [
      { taskType: "text-reasoning", description: "Create storyboard and lyrics" },
      { taskType: "music-generation", description: "Generate music track" },
      { taskType: "image-generation", description: "Generate key frames" },
      { taskType: "video-generation", description: "Create video from frames" },
      { taskType: "fusion", description: "Sync music with video" },
    ],
  },
  {
    id: "narrated-slideshow",
    name: "Narrated Slideshow",
    description: "Create a narrated presentation from images and text",
    steps: [
      { taskType: "text-reasoning", description: "Create narration script" },
      { taskType: "text-to-speech", description: "Generate voice narration" },
      { taskType: "video-generation", description: "Create slideshow video" },
      { taskType: "fusion", description: "Sync narration with slideshow" },
    ],
  },
  {
    id: "memorial-tribute",
    name: "Memorial Tribute Video",
    description: "Create a touching memorial video with photos, music, and narration",
    steps: [
      { taskType: "text-reasoning", description: "Create tribute script and scene plan" },
      { taskType: "music-generation", description: "Generate appropriate memorial music" },
      { taskType: "text-to-speech", description: "Generate narration" },
      { taskType: "video-generation", description: "Create video with photo transitions" },
      { taskType: "fusion", description: "Combine music, narration, and video" },
    ],
  },
];

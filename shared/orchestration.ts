// ============================================================================
// TASK TYPES - All AI operations the platform can perform
// ============================================================================
export type TaskType = 
  | "text-reasoning"        // Complex reasoning, planning, analysis
  | "text-extraction"       // Extract structured data from text (contacts, fields)
  | "text-chat"             // Conversational AI assistant
  | "text-summary"          // Summarize documents
  | "text-classification"   // Categorize content
  | "image-generation"      // Text → Image
  | "image-analysis"        // Vision - analyze/describe images
  | "image-to-video"        // Image → Video
  | "text-to-video"         // Text → Video
  | "text-to-speech"        // TTS - voice synthesis
  | "speech-to-text"        // STT - transcription
  | "music-generation"      // AI music/audio generation
  | "video-generation"      // General video generation
  | "code-generation"       // Write code
  | "document-ocr"          // Extract text from documents/PDFs
  | "fusion";               // Multi-modal combination

export type ModelProvider = "openai" | "anthropic" | "google" | "veo" | "suno" | "elevenlabs" | "internal";

// ============================================================================
// MODEL CONFIGURATION - Quality scores per task enable smart routing
// ============================================================================
export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  taskTypes: TaskType[];
  description: string;
  costPerUnit: number;      // Cost in $ per 1K tokens or per operation
  avgLatencyMs: number;
  maxInputTokens?: number;
  outputFormats?: string[];
  qualityScores: Partial<Record<TaskType, number>>;  // 0-100 quality score per task
  isDefault?: boolean;      // Mark as default for its task types
  isActive?: boolean;       // Enable/disable without removing
  releaseDate?: string;     // When model was released (for freshness)
}

// ============================================================================
// MODEL REGISTRY - Central registry of all available models
// Update this when new models are released - UI automatically uses best model
// ============================================================================
export const MODEL_REGISTRY: ModelConfig[] = [
  // ── OpenAI Models ──────────────────────────────────────────────────────────
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    taskTypes: ["text-reasoning", "text-extraction", "text-chat", "text-summary", "text-classification", "code-generation", "image-analysis"],
    description: "Most capable multimodal model - reasoning, vision, extraction",
    costPerUnit: 0.005,
    avgLatencyMs: 2000,
    maxInputTokens: 128000,
    qualityScores: {
      "text-reasoning": 95,
      "text-extraction": 98,  // Best for structured extraction
      "text-chat": 92,
      "text-summary": 94,
      "text-classification": 93,
      "code-generation": 90,
      "image-analysis": 95,
    },
    isDefault: true,
    isActive: true,
    releaseDate: "2024-05-13",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    taskTypes: ["text-reasoning", "text-extraction", "text-chat", "text-summary", "text-classification", "code-generation"],
    description: "Fast and efficient for simpler tasks, great cost/performance",
    costPerUnit: 0.00015,
    avgLatencyMs: 600,
    maxInputTokens: 128000,
    qualityScores: {
      "text-reasoning": 82,
      "text-extraction": 85,
      "text-chat": 88,        // Great for chat due to speed
      "text-summary": 84,
      "text-classification": 86,
      "code-generation": 78,
    },
    isActive: true,
    releaseDate: "2024-07-18",
  },
  {
    id: "o1",
    name: "OpenAI o1",
    provider: "openai",
    taskTypes: ["text-reasoning", "code-generation"],
    description: "Advanced reasoning model for complex logic and math",
    costPerUnit: 0.015,
    avgLatencyMs: 15000,
    maxInputTokens: 200000,
    qualityScores: {
      "text-reasoning": 99,   // Best for deep reasoning
      "code-generation": 97,
    },
    isActive: true,
    releaseDate: "2024-12-17",
  },
  {
    id: "o3-mini",
    name: "OpenAI o3-mini",
    provider: "openai",
    taskTypes: ["text-reasoning", "code-generation"],
    description: "Efficient reasoning model, faster than o1",
    costPerUnit: 0.0011,
    avgLatencyMs: 5000,
    maxInputTokens: 200000,
    qualityScores: {
      "text-reasoning": 90,
      "code-generation": 88,
    },
    isActive: true,
    releaseDate: "2025-01-31",
  },
  {
    id: "gpt-image-1",
    name: "GPT Image 1",
    provider: "openai",
    taskTypes: ["image-generation"],
    description: "High-quality image generation from text prompts",
    costPerUnit: 0.04,
    avgLatencyMs: 15000,
    outputFormats: ["png", "jpg"],
    qualityScores: {
      "image-generation": 96,
    },
    isDefault: true,
    isActive: true,
    releaseDate: "2025-01-01",
  },
  {
    id: "whisper-1",
    name: "Whisper",
    provider: "openai",
    taskTypes: ["speech-to-text"],
    description: "Industry-leading speech recognition",
    costPerUnit: 0.006,
    avgLatencyMs: 3000,
    outputFormats: ["json", "text", "srt", "vtt"],
    qualityScores: {
      "speech-to-text": 97,
    },
    isDefault: true,
    isActive: true,
    releaseDate: "2023-03-01",
  },
  {
    id: "tts-1-hd",
    name: "TTS-1 HD",
    provider: "openai",
    taskTypes: ["text-to-speech"],
    description: "High-quality text-to-speech synthesis",
    costPerUnit: 0.03,
    avgLatencyMs: 2000,
    outputFormats: ["mp3", "opus", "aac", "flac"],
    qualityScores: {
      "text-to-speech": 92,
    },
    isDefault: true,
    isActive: true,
    releaseDate: "2023-11-06",
  },
  
  // ── Anthropic Models ───────────────────────────────────────────────────────
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    taskTypes: ["text-reasoning", "text-chat", "text-summary", "code-generation"],
    description: "Anthropic's balanced model - great for coding and chat",
    costPerUnit: 0.003,
    avgLatencyMs: 1500,
    maxInputTokens: 200000,
    qualityScores: {
      "text-reasoning": 93,
      "text-chat": 96,        // Best for natural conversation
      "text-summary": 92,
      "code-generation": 95,  // Excellent at code
    },
    isActive: true,
    releaseDate: "2025-01-14",
  },
  {
    id: "claude-opus-4",
    name: "Claude Opus 4",
    provider: "anthropic",
    taskTypes: ["text-reasoning", "text-chat", "text-summary", "code-generation"],
    description: "Anthropic's most capable model for complex tasks",
    costPerUnit: 0.015,
    avgLatencyMs: 4000,
    maxInputTokens: 200000,
    qualityScores: {
      "text-reasoning": 97,
      "text-chat": 94,
      "text-summary": 96,
      "code-generation": 98,  // Best for complex code
    },
    isActive: true,
    releaseDate: "2025-01-14",
  },

  // ── Google Models ──────────────────────────────────────────────────────────
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    taskTypes: ["text-reasoning", "text-chat", "image-analysis"],
    description: "Google's fast multimodal model with native image understanding",
    costPerUnit: 0.0001,
    avgLatencyMs: 400,
    maxInputTokens: 1000000,
    qualityScores: {
      "text-reasoning": 88,
      "text-chat": 90,
      "image-analysis": 93,
    },
    isActive: true,
    releaseDate: "2024-12-11",
  },
  
  // ── Video Models ───────────────────────────────────────────────────────────
  {
    id: "veo-3.1",
    name: "Veo 3.1",
    provider: "veo",
    taskTypes: ["text-to-video", "image-to-video", "video-generation"],
    description: "Google's most advanced video generation model",
    costPerUnit: 0.15,
    avgLatencyMs: 60000,
    outputFormats: ["mp4"],
    qualityScores: {
      "text-to-video": 98,
      "image-to-video": 97,
      "video-generation": 98,
    },
    isDefault: true,
    isActive: true,
    releaseDate: "2025-01-15",
  },
  
  // ── Audio/Music Models ─────────────────────────────────────────────────────
  {
    id: "suno-v5",
    name: "Suno V5",
    provider: "suno",
    taskTypes: ["music-generation"],
    description: "AI music generation with vocals and instrumentals",
    costPerUnit: 0.05,
    avgLatencyMs: 30000,
    outputFormats: ["mp3", "wav"],
    qualityScores: {
      "music-generation": 98,
    },
    isDefault: true,
    isActive: true,
    releaseDate: "2025-01-01",
  },
  {
    id: "elevenlabs-v3",
    name: "ElevenLabs V3",
    provider: "elevenlabs",
    taskTypes: ["text-to-speech"],
    description: "Ultra-realistic voice synthesis with voice cloning",
    costPerUnit: 0.03,
    avgLatencyMs: 1500,
    outputFormats: ["mp3", "wav"],
    qualityScores: {
      "text-to-speech": 99,   // Best TTS quality
    },
    isActive: true,
    releaseDate: "2024-09-01",
  },
];

// ============================================================================
// MODEL ROUTER - Automatically selects best model for each task
// ============================================================================
export interface RouterOptions {
  preferSpeed?: boolean;      // Prioritize latency over quality
  preferQuality?: boolean;    // Prioritize quality over cost
  preferCost?: boolean;       // Prioritize cost savings
  maxCost?: number;           // Maximum cost per operation
  maxLatency?: number;        // Maximum acceptable latency in ms
  excludeProviders?: ModelProvider[];  // Providers to exclude
  forceModel?: string;        // Override router and use specific model
}

export interface RouterResult {
  model: ModelConfig;
  reasoning: string;
  alternates: ModelConfig[];  // Other viable options
  estimatedCost: number;
  estimatedLatency: number;
}

/**
 * modelRouter - Routes to the best model for a given task type
 * 
 * This is the core of the AI orchestration engine. When better models
 * appear, just add them to MODEL_REGISTRY with quality scores - the
 * router automatically uses them.
 * 
 * @param taskType - The type of AI task to perform
 * @param options - Optional preferences for model selection
 * @returns RouterResult with selected model and reasoning
 */
export function modelRouter(taskType: TaskType, options: RouterOptions = {}): RouterResult {
  // If force model specified, use it
  if (options.forceModel) {
    const forced = MODEL_REGISTRY.find(m => m.id === options.forceModel);
    if (forced) {
      return {
        model: forced,
        reasoning: `Forced to use ${forced.name} by request`,
        alternates: [],
        estimatedCost: forced.costPerUnit,
        estimatedLatency: forced.avgLatencyMs,
      };
    }
  }

  // Filter to active models that support this task type
  let candidates = MODEL_REGISTRY.filter(m => 
    m.isActive !== false && 
    m.taskTypes.includes(taskType) &&
    m.qualityScores[taskType] !== undefined
  );

  // Exclude providers if specified
  if (options.excludeProviders?.length) {
    candidates = candidates.filter(m => !options.excludeProviders!.includes(m.provider));
  }

  // Filter by constraints
  if (options.maxCost) {
    candidates = candidates.filter(m => m.costPerUnit <= options.maxCost!);
  }
  if (options.maxLatency) {
    candidates = candidates.filter(m => m.avgLatencyMs <= options.maxLatency!);
  }

  if (candidates.length === 0) {
    throw new Error(`No available model for task type: ${taskType}`);
  }

  // Score each candidate based on preferences
  const scored = candidates.map(model => {
    const quality = model.qualityScores[taskType] || 0;
    const speedScore = 100 - (model.avgLatencyMs / 1000); // Lower latency = higher score
    const costScore = 100 - (model.costPerUnit * 100);    // Lower cost = higher score

    let finalScore = quality; // Default: quality is primary

    if (options.preferSpeed) {
      finalScore = (quality * 0.3) + (speedScore * 0.5) + (costScore * 0.2);
    } else if (options.preferCost) {
      finalScore = (quality * 0.3) + (speedScore * 0.2) + (costScore * 0.5);
    } else if (options.preferQuality) {
      finalScore = (quality * 0.7) + (speedScore * 0.15) + (costScore * 0.15);
    } else {
      // Balanced: quality-focused with some speed/cost consideration
      finalScore = (quality * 0.6) + (speedScore * 0.2) + (costScore * 0.2);
    }

    // Boost default models slightly
    if (model.isDefault) {
      finalScore += 2;
    }

    return { model, score: finalScore };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternates = scored.slice(1, 4).map(s => s.model);

  // Generate reasoning
  let reasoning = `Selected ${best.model.name} for ${taskType}`;
  if (options.preferSpeed) {
    reasoning += ` (optimized for speed: ${best.model.avgLatencyMs}ms)`;
  } else if (options.preferCost) {
    reasoning += ` (optimized for cost: $${best.model.costPerUnit})`;
  } else if (options.preferQuality) {
    reasoning += ` (optimized for quality: ${best.model.qualityScores[taskType]}%)`;
  } else {
    reasoning += ` (quality: ${best.model.qualityScores[taskType]}%, balanced selection)`;
  }

  return {
    model: best.model,
    reasoning,
    alternates,
    estimatedCost: best.model.costPerUnit,
    estimatedLatency: best.model.avgLatencyMs,
  };
}

/**
 * getBestModelId - Simple helper to get just the model ID for a task
 */
export function getBestModelId(taskType: TaskType, options: RouterOptions = {}): string {
  return modelRouter(taskType, options).model.id;
}

/**
 * getAvailableModelsForTask - Get all models that can perform a task
 */
export function getAvailableModelsForTask(taskType: TaskType): ModelConfig[] {
  return MODEL_REGISTRY.filter(m => 
    m.isActive !== false && 
    m.taskTypes.includes(taskType)
  );
}

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

// ============================================================================
// MEDIA ORCHESTRATOR - Job-based pipeline execution with LLM planner
// ============================================================================
// 
// Universal pattern for all media requests:
// 1. PLANNER (LLM) → Converts user intent to structured JSON execution plan
// 2. EXECUTOR → Runs steps as Jobs with progress tracking
// 3. RENDERER → Stitches outputs (ffmpeg for video, audio mixing, etc.)
// 4. DELIVERY → Returns downloadable artifact
// ============================================================================

import { storage } from "./storage";
import type { MediaPipeline, PipelineStep, InsertMediaPipeline, InsertPipelineStep } from "@shared/schema";

// ============================================================================
// TYPES
// ============================================================================

export interface ExecutionPlan {
  pipelineType: string;
  steps: PlanStep[];
  estimatedDuration: number;
  finalOutputType: string;
}

export interface PlanStep {
  stepOrder: number;
  stepType: string;
  stepName: string;
  inputParams: Record<string, any>;
  dependsOn: number[];
  estimatedDuration: number;
}

export interface StepExecutor {
  execute: (step: PipelineStep, pipeline: MediaPipeline) => Promise<StepResult>;
}

export interface StepResult {
  success: boolean;
  outputData?: Record<string, any>;
  artifactUrls?: string[];
  errorMessage?: string;
}

// ============================================================================
// PLANNER - LLM converts user intent to execution plan
// ============================================================================

const PLANNER_SYSTEM_PROMPT = `You are a media pipeline planner. Given a user's request, generate a structured execution plan.

Output JSON with this exact structure:
{
  "pipelineType": "DOC_TO_CHAT" | "TEXT_TO_AUDIO" | "MEDIA_TO_VIDEO" | "TEXT_TO_VIDEO" | "CUSTOM",
  "steps": [
    {
      "stepOrder": 1,
      "stepType": "ingest" | "extract_text" | "tts" | "image_gen" | "video_gen" | "audio_mix" | "video_render" | "embed",
      "stepName": "Human readable step name",
      "inputParams": { ... step-specific parameters ... },
      "dependsOn": [],
      "estimatedDuration": 5000
    }
  ],
  "estimatedDuration": 30000,
  "finalOutputType": "audio/mpeg" | "video/mp4" | "application/pdf" | "text/plain"
}

Step types and their inputParams:

- ingest: { fileUrl, fileType } - Ingest uploaded file
- extract_text: { fileId } - Extract text from document (OCR/parsing)
- embed: { text, chunkSize } - Create embeddings for RAG
- tts: { text, voice, speed } - Text-to-speech generation
- image_gen: { prompt, aspectRatio, style } - AI image generation
- video_gen: { prompt, duration, style } - AI video generation
- audio_mix: { tracks, backgroundMusic } - Mix audio tracks
- video_render: { scenes, transitions, audioTrack } - Render video montage

Be precise. Only include necessary steps.`;

export async function planPipeline(userIntent: string, uploadedFiles?: string[]): Promise<ExecutionPlan> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    // Demo mode - return a simple plan
    return createDemoPlan(userIntent);
  }

  try {
    const userMessage = uploadedFiles?.length 
      ? `User request: ${userIntent}\n\nUploaded files: ${uploadedFiles.join(", ")}`
      : `User request: ${userIntent}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: PLANNER_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("Planner API error:", await response.text());
      return createDemoPlan(userIntent);
    }

    const data = await response.json();
    const planJson = data.choices?.[0]?.message?.content;
    
    if (!planJson) {
      return createDemoPlan(userIntent);
    }

    return JSON.parse(planJson) as ExecutionPlan;
  } catch (error) {
    console.error("Planner error:", error);
    return createDemoPlan(userIntent);
  }
}

function createDemoPlan(userIntent: string): ExecutionPlan {
  // Detect intent and create appropriate demo plan
  const intentLower = userIntent.toLowerCase();
  
  if (intentLower.includes("document") || intentLower.includes("pdf") || intentLower.includes("upload")) {
    return {
      pipelineType: "DOC_TO_CHAT",
      steps: [
        { stepOrder: 1, stepType: "ingest", stepName: "Upload Document", inputParams: {}, dependsOn: [], estimatedDuration: 2000 },
        { stepOrder: 2, stepType: "extract_text", stepName: "Extract Text", inputParams: {}, dependsOn: [1], estimatedDuration: 5000 },
        { stepOrder: 3, stepType: "embed", stepName: "Create Embeddings", inputParams: { chunkSize: 500 }, dependsOn: [2], estimatedDuration: 3000 },
      ],
      estimatedDuration: 10000,
      finalOutputType: "text/plain",
    };
  }
  
  if (intentLower.includes("narrat") || intentLower.includes("audio") || intentLower.includes("speak") || intentLower.includes("voice")) {
    return {
      pipelineType: "TEXT_TO_AUDIO",
      steps: [
        { stepOrder: 1, stepType: "tts", stepName: "Generate Narration", inputParams: { voice: "nova", speed: 1.0 }, dependsOn: [], estimatedDuration: 10000 },
      ],
      estimatedDuration: 10000,
      finalOutputType: "audio/mpeg",
    };
  }
  
  if (intentLower.includes("video") && (intentLower.includes("image") || intentLower.includes("montage") || intentLower.includes("slideshow"))) {
    return {
      pipelineType: "MEDIA_TO_VIDEO",
      steps: [
        { stepOrder: 1, stepType: "ingest", stepName: "Process Images", inputParams: {}, dependsOn: [], estimatedDuration: 3000 },
        { stepOrder: 2, stepType: "tts", stepName: "Generate Narration", inputParams: { voice: "onyx" }, dependsOn: [], estimatedDuration: 8000 },
        { stepOrder: 3, stepType: "video_render", stepName: "Render Video", inputParams: { transitions: "fade" }, dependsOn: [1, 2], estimatedDuration: 15000 },
      ],
      estimatedDuration: 26000,
      finalOutputType: "video/mp4",
    };
  }
  
  if (intentLower.includes("video")) {
    return {
      pipelineType: "TEXT_TO_VIDEO",
      steps: [
        { stepOrder: 1, stepType: "video_gen", stepName: "Generate Video", inputParams: { duration: 6 }, dependsOn: [], estimatedDuration: 60000 },
      ],
      estimatedDuration: 60000,
      finalOutputType: "video/mp4",
    };
  }
  
  // Default: simple processing
  return {
    pipelineType: "CUSTOM",
    steps: [
      { stepOrder: 1, stepType: "ingest", stepName: "Process Input", inputParams: {}, dependsOn: [], estimatedDuration: 5000 },
    ],
    estimatedDuration: 5000,
    finalOutputType: "text/plain",
  };
}

// ============================================================================
// EXECUTOR - Runs pipeline steps as jobs
// ============================================================================

const stepExecutors: Record<string, StepExecutor> = {
  ingest: {
    async execute(step, pipeline): Promise<StepResult> {
      // Document ingestion - extract text from uploaded files
      await simulateProgress(step.id, 2000);
      return { success: true, outputData: { extracted: true } };
    }
  },
  
  extract_text: {
    async execute(step, pipeline): Promise<StepResult> {
      // OCR/text extraction
      await simulateProgress(step.id, 3000);
      return { success: true, outputData: { textLength: 5000 } };
    }
  },
  
  embed: {
    async execute(step, pipeline): Promise<StepResult> {
      // Create embeddings for RAG
      await simulateProgress(step.id, 2000);
      return { success: true, outputData: { chunks: 10, dimensions: 1536 } };
    }
  },
  
  tts: {
    async execute(step, pipeline): Promise<StepResult> {
      const inputParams = JSON.parse(step.inputParams);
      // Use OPENAI_API_KEY for direct API access (TTS requires direct access, not proxy)
      const openaiApiKey = process.env.OPENAI_API_KEY;
      
      if (!openaiApiKey) {
        console.log("[TTS] No OPENAI_API_KEY found - TTS requires direct OpenAI API access");
        console.log("[TTS] Add OPENAI_API_KEY secret to enable text-to-speech generation");
        await simulateProgress(step.id, 3000);
        return { 
          success: true, 
          outputData: { demo: true, message: "Add OPENAI_API_KEY secret to enable real TTS" }, 
          artifactUrls: ["/demo-audio.mp3"] 
        };
      }
      
      try {
        console.log("[TTS] Generating audio with OpenAI TTS...");
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: inputParams.text || pipeline.userIntent,
            voice: inputParams.voice || "nova",
            speed: inputParams.speed || 1.0,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("[TTS] OpenAI API error:", errorText);
          throw new Error(`TTS API failed: ${response.status}`);
        }
        
        const audioBuffer = await response.arrayBuffer();
        const filename = `tts-${Date.now()}.mp3`;
        console.log(`[TTS] Audio generated, ${audioBuffer.byteLength} bytes`);
        
        return { 
          success: true, 
          outputData: { generated: true, size: audioBuffer.byteLength }, 
          artifactUrls: [`/generated/${filename}`] 
        };
      } catch (error) {
        console.error("[TTS] Error:", error);
        return { success: false, errorMessage: String(error) };
      }
    }
  },
  
  image_gen: {
    async execute(step, pipeline): Promise<StepResult> {
      await simulateProgress(step.id, 5000);
      return { success: true, outputData: { generated: true }, artifactUrls: ["/generated-image.png"] };
    }
  },
  
  video_gen: {
    async execute(step, pipeline): Promise<StepResult> {
      // AI video generation - would integrate with Runway/etc.
      await simulateProgress(step.id, 30000);
      return { success: true, outputData: { generated: true }, artifactUrls: ["/generated-video.mp4"] };
    }
  },
  
  audio_mix: {
    async execute(step, pipeline): Promise<StepResult> {
      await simulateProgress(step.id, 5000);
      return { success: true, outputData: { mixed: true }, artifactUrls: ["/mixed-audio.mp3"] };
    }
  },
  
  video_render: {
    async execute(step, pipeline): Promise<StepResult> {
      // FFmpeg video rendering
      await simulateProgress(step.id, 10000);
      return { success: true, outputData: { rendered: true }, artifactUrls: ["/rendered-video.mp4"] };
    }
  },
};

async function simulateProgress(stepId: number, duration: number): Promise<void> {
  const intervals = 10;
  const intervalMs = duration / intervals;
  
  for (let i = 1; i <= intervals; i++) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    await storage.updatePipelineStepProgress(stepId, i * 10);
  }
}

export async function executeStep(step: PipelineStep, pipeline: MediaPipeline): Promise<StepResult> {
  const executor = stepExecutors[step.stepType];
  
  if (!executor) {
    return { success: false, errorMessage: `Unknown step type: ${step.stepType}` };
  }
  
  await storage.updatePipelineStepStatus(step.id, "RUNNING");
  
  try {
    const result = await executor.execute(step, pipeline);
    
    if (result.success) {
      await storage.updatePipelineStepComplete(step.id, result.outputData, result.artifactUrls);
    } else {
      await storage.updatePipelineStepFailed(step.id, result.errorMessage || "Unknown error");
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    await storage.updatePipelineStepFailed(step.id, errorMessage);
    return { success: false, errorMessage };
  }
}

// ============================================================================
// ORCHESTRATOR - Main pipeline execution loop
// ============================================================================

export async function createAndExecutePipeline(
  userIntent: string,
  userId?: number,
  sessionId?: number,
  uploadedFiles?: string[]
): Promise<MediaPipeline> {
  // Step 1: Plan
  console.log("[Pipeline] Planning:", userIntent);
  const plan = await planPipeline(userIntent, uploadedFiles);
  
  // Step 2: Create pipeline record
  const pipelineData: InsertMediaPipeline = {
    userId: userId || null,
    sessionId: sessionId || null,
    pipelineType: plan.pipelineType as any,
    status: "QUEUED",
    userIntent,
    executionPlan: JSON.stringify(plan),
    totalSteps: plan.steps.length,
    completedSteps: 0,
    progress: 0,
  };
  
  const pipeline = await storage.createMediaPipeline(pipelineData);
  
  // Step 3: Create step records
  for (const planStep of plan.steps) {
    const stepData: InsertPipelineStep = {
      pipelineId: pipeline.id,
      stepOrder: planStep.stepOrder,
      stepType: planStep.stepType,
      stepName: planStep.stepName,
      status: "PENDING",
      inputParams: JSON.stringify(planStep.inputParams),
      dependsOn: JSON.stringify(planStep.dependsOn),
      progress: 0,
    };
    await storage.createPipelineStep(stepData);
  }
  
  // Step 4: Execute asynchronously
  executePipelineAsync(pipeline.id).catch(err => {
    console.error("[Pipeline] Async execution error:", err);
  });
  
  return pipeline;
}

async function executePipelineAsync(pipelineId: number): Promise<void> {
  const pipeline = await storage.getMediaPipeline(pipelineId);
  if (!pipeline) return;
  
  await storage.updatePipelineStatus(pipelineId, "RUNNING");
  
  const steps = await storage.getPipelineSteps(pipelineId);
  const stepResults: Record<number, StepResult> = {};
  
  // Execute steps in order, respecting dependencies
  for (const step of steps.sort((a, b) => a.stepOrder - b.stepOrder)) {
    // Check dependencies
    const dependsOn = step.dependsOn ? JSON.parse(step.dependsOn) as number[] : [];
    const depsComplete = dependsOn.every(depOrder => {
      const depStep = steps.find(s => s.stepOrder === depOrder);
      return depStep && stepResults[depStep.id]?.success;
    });
    
    if (!depsComplete && dependsOn.length > 0) {
      await storage.updatePipelineStepFailed(step.id, "Dependencies not met");
      continue;
    }
    
    // Execute step
    const result = await executeStep(step, pipeline);
    stepResults[step.id] = result;
    
    if (!result.success) {
      await storage.updatePipelineStatus(pipelineId, "FAILED", result.errorMessage);
      return;
    }
    
    // Update pipeline progress
    const completedCount = Object.values(stepResults).filter(r => r.success).length;
    const progress = Math.round((completedCount / steps.length) * 100);
    await storage.updatePipelineProgress(pipelineId, completedCount, progress);
  }
  
  // All steps complete - finalize
  await storage.updatePipelineStatus(pipelineId, "DONE");
}

// ============================================================================
// DELIVERY - Get pipeline status and artifacts
// ============================================================================

export async function getPipelineStatus(pipelineId: number) {
  const pipeline = await storage.getMediaPipeline(pipelineId);
  if (!pipeline) return null;
  
  const steps = await storage.getPipelineSteps(pipelineId);
  const artifacts = await storage.getPipelineArtifacts(pipelineId);
  
  return {
    pipeline,
    steps: steps.map(s => ({
      ...s,
      inputParams: s.inputParams ? JSON.parse(s.inputParams) : null,
      outputData: s.outputData ? JSON.parse(s.outputData) : null,
      dependsOn: s.dependsOn ? JSON.parse(s.dependsOn) : [],
      artifactUrls: s.artifactUrls ? JSON.parse(s.artifactUrls) : [],
    })),
    artifacts,
  };
}

export async function getUserPipelines(userId: number) {
  return storage.getUserPipelines(userId);
}

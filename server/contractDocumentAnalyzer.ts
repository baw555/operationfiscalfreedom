import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
});

export interface DetectedField {
  name: string;
  placeholder: string;
  type: "text" | "date" | "signature" | "initials" | "address" | "phone" | "email";
  required: boolean;
  description: string;
}

export interface AnalysisResult {
  extractedText: string;
  detectedFields: DetectedField[];
  generatedTemplate: string;
  summary: string;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    return result.text || "";
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error("Failed to extract text from PDF. The file may be corrupted, scanned, or password-protected.");
  }
}

export async function extractTextFromDoc(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("Word document extraction error:", error);
    throw new Error("Failed to extract text from Word document. The file may be corrupted.");
  }
}

export async function extractTextFromImage(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    const base64Image = buffer.toString("base64");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert document reader. Extract ALL text from this scanned document image exactly as it appears. Preserve the structure, formatting, line breaks, and sections. If there are tables, preserve the table structure. If there are headers or titles, keep them clearly separated. Extract every word visible in the document - do not summarize or skip any content.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_completion_tokens: 8192,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Image OCR extraction error:", error);
    throw new Error("Failed to extract text from image. Please ensure the image is clear and readable.");
  }
}

export async function extractDocumentText(buffer: Buffer, filename: string): Promise<string> {
  const extension = filename.toLowerCase().split(".").pop();
  
  if (extension === "pdf") {
    return extractTextFromPDF(buffer);
  } else if (extension === "doc" || extension === "docx") {
    return extractTextFromDoc(buffer);
  } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    return extractTextFromImage(buffer, mimeTypes[extension || ""] || "image/jpeg");
  } else {
    throw new Error(`Unsupported file type: ${extension}. Please upload a PDF, Word document, or image (JPG, PNG, GIF, WebP).`);
  }
}

export async function reformatDocumentText(rawText: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a document formatting expert. Your job is to take raw extracted text from scanned documents and reformat it into clean, professional, properly structured text.

FORMATTING RULES:
1. Fix any OCR errors or typos that are obviously wrong
2. Restore proper paragraph breaks and spacing
3. Format headers and section titles appropriately
4. Align tables if present
5. Fix capitalization and punctuation issues
6. Preserve all original content - do not remove or summarize anything
7. Add appropriate line breaks between sections
8. Use consistent formatting throughout
9. If this appears to be a contract or legal document, use professional legal formatting

OUTPUT:
Return ONLY the reformatted text. Do not add any commentary or explanations.`
      },
      {
        role: "user",
        content: `Reformat this raw extracted document text into clean, professional format:\n\n${rawText}`
      }
    ],
    max_completion_tokens: 8192,
  });

  return response.choices[0]?.message?.content || rawText;
}

export async function fixTemplateContent(htmlContent: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert at fixing and cleaning up HTML contract templates. Your job is to take messy or poorly formatted HTML and fix it while preserving ALL content and placeholders.

CRITICAL RULES:
1. PRESERVE all placeholder brackets like [NAME], [EMAIL], [DATE], [INITIALS], [SIGNATURE], [COMPANY], [ADDRESS], [TITLE], etc. - these are essential
2. Fix broken HTML tags, unclosed elements, and malformed markup
3. Improve formatting and readability - proper indentation, consistent spacing
4. Fix obvious typos and grammatical errors in the text content
5. Ensure proper paragraph structure with <p> tags or <div> tags
6. Make headers consistent (use <h1>, <h2>, <h3> appropriately)
7. Clean up excessive whitespace and empty tags
8. Ensure the document has professional legal formatting
9. DO NOT remove any content - only fix and improve it
10. DO NOT add new placeholders that weren't there before
11. Keep all legal language intact

OUTPUT FORMAT:
Return ONLY the fixed HTML. Do not wrap in code blocks or add explanations.`
      },
      {
        role: "user",
        content: `Fix and clean up this HTML contract template:\n\n${htmlContent}`
      }
    ],
    max_completion_tokens: 16384,
  });

  return response.choices[0]?.message?.content || htmlContent;
}

export async function analyzeContractDocument(documentText: string): Promise<AnalysisResult> {
  const systemPrompt = `You are a contract analysis expert. Analyze contract documents and identify places where form fields should be inserted for the signer to fill in.

IMPORTANT RULES:
1. Only identify fields that are CLEARLY implied in the document - do NOT invent fields that aren't needed
2. Preserve the original text structure and formatting as much as possible
3. Insert placeholders only where the document clearly expects user input (signature lines, blanks, dates, etc.)
4. If the document already has names/dates filled in, leave them as-is unless they're obviously placeholder text

Field types to identify:
- NAME / SIGNER NAME: Full name of the person signing (look for signature lines or "Name:" labels)
- EMAIL: Email address fields
- PHONE: Phone number fields
- ADDRESS: Mailing or company address fields
- DATE / EFFECTIVE DATE: Date fields that need to be filled in
- SIGNATURE: Signature lines (often indicated by _____ or "Signature:" labels)
- INITIALS: Where initials are required (often next to paragraphs, checkboxes, or terms)
- COMPANY / COMPANY NAME: Business or organization name fields
- TITLE: Job title or position fields

Return a JSON object with:
1. "fields": Array of detected fields. Each field has: name (descriptive label), placeholder (e.g., "[NAME]"), type, required (boolean), and description (where in the document this field appears)
2. "template": The FULL contract text with placeholders inserted where fields should go. Use square brackets like [NAME], [DATE], [SIGNATURE]. Do NOT truncate or summarize the text.
3. "summary": A brief 1-2 sentence summary of what this contract is about`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Analyze this contract document and identify form fields. Preserve the full text structure:\n\n${documentText.substring(0, 15000)}` 
      }
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content || "{}";
  
  try {
    const parsed = JSON.parse(content);
    return {
      extractedText: documentText,
      detectedFields: parsed.fields || [],
      generatedTemplate: parsed.template || documentText,
      summary: parsed.summary || "Contract document",
    };
  } catch {
    return {
      extractedText: documentText,
      detectedFields: [],
      generatedTemplate: documentText,
      summary: "Could not analyze document",
    };
  }
}

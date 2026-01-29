import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
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

export async function extractDocumentText(buffer: Buffer, filename: string): Promise<string> {
  const extension = filename.toLowerCase().split(".").pop();
  
  if (extension === "pdf") {
    return extractTextFromPDF(buffer);
  } else if (extension === "doc" || extension === "docx") {
    return extractTextFromDoc(buffer);
  } else {
    throw new Error(`Unsupported file type: ${extension}. Please upload a PDF or Word document.`);
  }
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
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Analyze this contract document and identify form fields. Preserve the full text structure:\n\n${documentText.substring(0, 15000)}` 
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 8000,
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

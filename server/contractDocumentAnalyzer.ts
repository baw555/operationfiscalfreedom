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
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  return result.text;
}

export async function extractTextFromDoc(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
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
  const systemPrompt = `You are a contract analysis expert. Your task is to analyze contract documents and identify places where form fields should be inserted for the signer to fill in.

Identify these types of fields:
- NAME / SIGNER NAME: Full name of the person signing
- EMAIL: Email address
- PHONE: Phone number
- ADDRESS: Mailing or company address
- DATE / EFFECTIVE DATE: Dates that need to be filled in
- SIGNATURE: Where a signature is required
- INITIALS: Where initials are required (often next to paragraphs or terms)
- COMPANY / COMPANY NAME: Business or organization name
- TITLE: Job title or position

Return a JSON object with:
1. "fields": Array of detected fields with name, placeholder (e.g., "[NAME]"), type, required (boolean), and description
2. "template": The contract text with placeholders inserted where fields should go. Use square brackets like [NAME], [DATE], [SIGNATURE], etc.
3. "summary": A brief 1-2 sentence summary of what this contract is about`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Analyze this contract document and identify form fields:\n\n${documentText.substring(0, 15000)}` 
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 4000,
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

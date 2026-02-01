import mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as unzipper from "unzipper";
import * as path from "path";
import { createRequire } from "module";

// Use require for pdf-parse as it doesn't have proper ESM exports
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export interface ProcessedDocument {
  fileName: string;
  fileType: string;
  mimeType: string;
  textContent: string;
  metadata: {
    pages?: number;
    wordCount?: number;
    extractedAt: Date;
  };
}

export interface DocumentUpload {
  id: string;
  sessionId: string;
  userId?: number;
  memoryMode: "stateless" | "session" | "persistent";
  documents: ProcessedDocument[];
  createdAt: Date;
  expiresAt?: Date;
}

const SUPPORTED_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "text/csv": "csv",
  "text/plain": "txt",
  "text/markdown": "md",
  "image/png": "image",
  "image/jpeg": "image",
  "image/gif": "image",
  "image/webp": "image",
  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "audio/ogg": "audio",
  "video/mp4": "video",
  "video/webm": "video",
  "application/zip": "zip",
};

export async function detectFileType(buffer: Buffer, fileName: string): Promise<string> {
  const ext = path.extname(fileName).toLowerCase().slice(1);
  
  const extToType: Record<string, string> = {
    pdf: "pdf",
    docx: "docx",
    doc: "doc",
    xlsx: "xlsx",
    xls: "xls",
    csv: "csv",
    txt: "txt",
    md: "md",
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    webp: "image",
    mp3: "audio",
    wav: "audio",
    ogg: "audio",
    mp4: "video",
    webm: "video",
    zip: "zip",
  };
  
  return extToType[ext] || "unknown";
}

export async function extractPdfContent(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF extraction error:", error);
    return "[Unable to extract PDF content]";
  }
}

export async function extractDocxContent(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("DOCX extraction error:", error);
    return "[Unable to extract Word document content]";
  }
}

export async function extractExcelContent(buffer: Buffer): Promise<string> {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let content = "";
    
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      content += `\n=== Sheet: ${sheetName} ===\n${csv}\n`;
    }
    
    return content.trim();
  } catch (error) {
    console.error("Excel extraction error:", error);
    return "[Unable to extract Excel content]";
  }
}

export async function extractCsvContent(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8");
}

export async function extractTextContent(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8");
}

export async function extractMarkdownContent(buffer: Buffer): Promise<string> {
  return buffer.toString("utf-8");
}

export async function extractImageContent(buffer: Buffer, fileName: string): Promise<string> {
  return `[Image file: ${fileName}]\n[Note: Image analysis requires vision API. The image has been uploaded and can be referenced in conversation.]`;
}

export async function extractAudioContent(buffer: Buffer, fileName: string): Promise<string> {
  return `[Audio file: ${fileName}]\n[Note: Audio transcription requires Whisper API. The audio has been uploaded for reference.]`;
}

export async function extractVideoContent(buffer: Buffer, fileName: string): Promise<string> {
  return `[Video file: ${fileName}]\n[Note: Video processing requires additional APIs. The video has been uploaded for reference.]`;
}

export async function extractZipContent(buffer: Buffer): Promise<string> {
  try {
    const results: string[] = [];
    const directory = await unzipper.Open.buffer(buffer);
    
    for (const file of directory.files) {
      if (file.type === "File") {
        const fileBuffer = await file.buffer();
        const fileType = await detectFileType(fileBuffer, file.path);
        const content = await processFileContent(fileBuffer, file.path, fileType);
        results.push(`\n=== ${file.path} ===\n${content}`);
      }
    }
    
    return results.join("\n");
  } catch (error) {
    console.error("ZIP extraction error:", error);
    return "[Unable to extract ZIP content]";
  }
}

export async function processFileContent(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<string> {
  switch (fileType) {
    case "pdf":
      return extractPdfContent(buffer);
    case "docx":
    case "doc":
      return extractDocxContent(buffer);
    case "xlsx":
    case "xls":
      return extractExcelContent(buffer);
    case "csv":
      return extractCsvContent(buffer);
    case "txt":
      return extractTextContent(buffer);
    case "md":
      return extractMarkdownContent(buffer);
    case "image":
      return extractImageContent(buffer, fileName);
    case "audio":
      return extractAudioContent(buffer, fileName);
    case "video":
      return extractVideoContent(buffer, fileName);
    case "zip":
      return extractZipContent(buffer);
    default:
      return `[Unsupported file type: ${fileType}]`;
  }
}

export async function processDocument(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ProcessedDocument> {
  const fileType = await detectFileType(buffer, fileName);
  const textContent = await processFileContent(buffer, fileName, fileType);
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  
  return {
    fileName,
    fileType,
    mimeType,
    textContent,
    metadata: {
      wordCount,
      extractedAt: new Date(),
    },
  };
}

const documentStore = new Map<string, DocumentUpload>();

export function storeDocuments(upload: DocumentUpload): void {
  documentStore.set(upload.id, upload);
}

export function getDocuments(sessionId: string): DocumentUpload | undefined {
  const entries = Array.from(documentStore.entries());
  for (const [id, upload] of entries) {
    if (upload.sessionId === sessionId) {
      return upload;
    }
  }
  return undefined;
}

export function getDocumentById(id: string): DocumentUpload | undefined {
  return documentStore.get(id);
}

export function clearSessionDocuments(sessionId: string): void {
  const entries = Array.from(documentStore.entries());
  for (const [id, upload] of entries) {
    if (upload.sessionId === sessionId) {
      documentStore.delete(id);
    }
  }
}

export function getDocumentContext(sessionId: string): string {
  const upload = getDocuments(sessionId);
  if (!upload || upload.documents.length === 0) {
    return "";
  }
  
  const context = upload.documents.map(doc => 
    `\n--- Document: ${doc.fileName} (${doc.fileType}) ---\n${doc.textContent.slice(0, 10000)}`
  ).join("\n");
  
  return `\n\n[UPLOADED DOCUMENTS]\n${context}\n[END DOCUMENTS]\n`;
}

import PDFDocument from 'pdfkit';
import { NDA_TEMPLATE } from './templates/ndaTemplate';
import * as htmlparser2 from 'htmlparser2';
import { Element, Text, Node } from 'domhandler';

import crypto from 'crypto';

// CSU Contract PDF Generation
interface CsuContractData {
  templateName: string;
  templateContent: string;
  signerName: string;
  signerEmail: string;
  signerPhone?: string | null;
  address?: string | null; // Signer address/website
  clientAddress?: string | null; // FICA contract company address
  initials?: string | null;
  effectiveDate?: string | null;
  signedAt: string;
  signedIpAddress?: string | null;
  signatureData?: string | null;
  agreementId: number;
  userAgent?: string | null;
  clientCompany?: string | null;
  primaryTitle?: string | null;
  secondaryOwner?: string | null;
  esignConsent?: boolean;
  termsConsent?: boolean;
}

// Helper to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');
}

// Extract plain text from HTML element
function extractText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// Parse HTML content into structured elements for PDF rendering
interface PdfElement {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list-item' | 'initials-box' | 'signature-section' | 'divider' | 'warning-box' | 'info-box';
  content: string;
}

// Helper to get all text content from a DOM node recursively
function getNodeText(node: Node): string {
  if (node.type === 'text') {
    return (node as Text).data;
  }
  if (node.type === 'tag') {
    const el = node as Element;
    return el.children.map(child => getNodeText(child)).join('');
  }
  return '';
}

// Helper to check if element has specific style attribute
function hasStyle(el: Element, patterns: string[]): boolean {
  const style = (el.attribs?.style || '').toLowerCase();
  const className = (el.attribs?.class || '').toLowerCase();
  return patterns.some(p => style.includes(p) || className.includes(p));
}

// Robust HTML parser using htmlparser2 for proper DOM traversal
function parseHtmlForPdf(html: string): PdfElement[] {
  const elements: PdfElement[] = [];
  
  // Clean the HTML
  const cleanHtml = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  
  // Parse DOM
  const dom = htmlparser2.parseDocument(cleanHtml);
  
  // Track last added element to avoid consecutive duplicates only
  let lastKey = '';
  
  // Helper to add element only if not a consecutive duplicate
  function addElement(type: PdfElement['type'], content: string): void {
    const key = `${type}:${content.substring(0, 100)}`;
    if (key !== lastKey || type === 'divider') {
      elements.push({ type, content });
      lastKey = key;
    }
  }
  
  // Walk DOM in document order
  function walkNode(node: Node): void {
    if (node.type === 'tag') {
      const el = node as Element;
      const tagName = el.name.toLowerCase();
      
      // Process leaf elements (ones that contain text directly)
      if (tagName === 'h1') {
        const text = getNodeText(el).trim();
        if (text) {
          addElement('h1', text);
        }
        return; // Don't recurse into h1 children
      }
      
      if (tagName === 'h2') {
        const text = getNodeText(el).trim();
        if (text) {
          addElement('h2', text);
        }
        return; // Don't recurse into h2 children
      }
      
      if (tagName === 'h3') {
        const text = getNodeText(el).trim();
        if (text) {
          addElement('h3', text);
        }
        return; // Don't recurse into h3 children
      }
      
      if (tagName === 'li') {
        const text = getNodeText(el).trim();
        if (text) {
          addElement('list-item', text);
        }
        return; // Don't recurse into li children
      }
      
      if (tagName === 'p') {
        const text = getNodeText(el).trim();
        if (text) {
          addElement('paragraph', text);
        }
        return; // Don't recurse into p children
      }
      
      if (tagName === 'hr') {
        addElement('divider', '');
        return;
      }
      
      // Handle special styled divs
      if (tagName === 'div') {
        // Check for initials box (yellow background)
        if (hasStyle(el, ['#fff3cd', 'initials-block', '#fef9c3', '#ffc107'])) {
          const text = getNodeText(el).trim();
          if (text && text.toUpperCase().includes('INITIAL')) {
            addElement('initials-box', text);
            return; // Don't recurse
          }
        }
        
        // Check for warning box (red/error styling)
        if (hasStyle(el, ['#fce8e8', '#fef2f2', '#dc2626', 'warning'])) {
          const text = getNodeText(el).trim();
          if (text && text.length > 0) {
            addElement('warning-box', text);
            return; // Don't recurse
          }
        }
        
        // Check for signature pad placeholder
        if (hasStyle(el, ['signature-capture', 'signature-section'])) {
          addElement('signature-section', 'Signature Required');
          return;
        }
        
        // Check for signature/acknowledgment section (light purple/lavender background)
        if (hasStyle(el, ['#f3e8ff', '#f8f4ff', '#ede9fe'])) {
          const text = getNodeText(el).trim();
          if (text && text.length > 0) {
            addElement('info-box', text);
            return; // Don't recurse - content is complete
          }
        }
        
        // Check for footer section (grey background) - treat as info
        if (hasStyle(el, ['#f0f0f0', '#e5e5e5'])) {
          const text = getNodeText(el).trim();
          if (text && text.length > 0) {
            addElement('paragraph', text);
            return;
          }
        }
      }
      
      // For container elements (div, ul, ol, section, etc.), recurse into children
      for (const child of el.children) {
        walkNode(child);
      }
    }
  }
  
  // Walk all top-level nodes
  for (const node of dom.children) {
    walkNode(node);
  }
  
  return elements;
}

// Render parsed HTML elements to PDF with professional styling
function renderHtmlToPdf(
  doc: PDFKit.PDFDocument,
  elements: PdfElement[],
  data: {
    initials?: string;
    pageWidth: number;
    contentWidth: number;
    leftMargin: number;
  }
): void {
  const PURPLE_COLOR = '#6b21a8';
  const DARK_PURPLE = '#1a1a2e';
  const WARNING_COLOR = '#dc2626';
  const WARNING_BG = '#fef2f2';
  const INITIALS_BG = '#fef9c3';
  const INITIALS_BORDER = '#eab308';
  const BOTTOM_MARGIN = 72;
  
  // Helper to calculate text height using PDFKit's heightOfString
  const getTextHeight = (text: string, fontSize: number, width: number): number => {
    doc.fontSize(fontSize);
    return doc.heightOfString(text, { width }) + 10; // Add padding
  };
  
  // Helper to check if we need a new page with room for element
  const ensureSpace = (neededHeight: number) => {
    if (doc.y + neededHeight > doc.page.height - BOTTOM_MARGIN) {
      doc.addPage();
      doc.y = 72;
    }
  };
  
  for (const element of elements) {
    switch (element.type) {
      case 'h1':
        ensureSpace(40);
        doc.moveDown(0.5);
        doc.fontSize(16).font('Helvetica-Bold').fillColor(DARK_PURPLE)
          .text(element.content, { align: 'center' });
        doc.moveDown(0.3);
        // Draw decorative line under H1
        const h1LineY = doc.y;
        doc.moveTo(data.leftMargin + 100, h1LineY)
          .lineTo(data.leftMargin + data.contentWidth - 100, h1LineY)
          .lineWidth(2)
          .stroke(PURPLE_COLOR);
        doc.moveDown(0.5);
        break;
        
      case 'h2':
        ensureSpace(35);
        doc.moveDown(0.8);
        // Draw purple underline for section headers
        doc.fontSize(12).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
          .text(element.content);
        const lineY = doc.y + 2;
        doc.moveTo(data.leftMargin, lineY)
          .lineTo(data.leftMargin + data.contentWidth, lineY)
          .lineWidth(1.5)
          .stroke(PURPLE_COLOR);
        doc.moveDown(0.5);
        break;
        
      case 'h3':
        ensureSpace(25);
        doc.moveDown(0.5);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
          .text(element.content);
        doc.moveDown(0.3);
        break;
        
      case 'paragraph':
        // Calculate actual text height for accurate page breaks
        const pHeight = getTextHeight(element.content, 9, data.contentWidth);
        ensureSpace(pHeight);
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(element.content, { align: 'justify', lineGap: 2 });
        doc.moveDown(0.4);
        break;
        
      case 'list-item':
        // Calculate actual text height for list items
        const liHeight = getTextHeight(`• ${element.content}`, 9, data.contentWidth - 15);
        ensureSpace(liHeight);
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(`• ${element.content}`, { indent: 15, lineGap: 2 });
        doc.moveDown(0.2);
        break;
        
      case 'initials-box':
        // Render yellow initials acknowledgment box with dynamic height
        const cleanText = element.content
          .replace(/\[INITIALS\]/gi, '')
          .replace(/INITIAL HERE TO ACKNOWLEDGE/gi, 'Acknowledged:')
          .trim();
        
        // Calculate dynamic height based on text content
        doc.fontSize(9);
        const initialsTextHeight = doc.heightOfString(cleanText, { width: data.contentWidth - 100 });
        const boxHeight = Math.max(40, initialsTextHeight + 24);
        
        ensureSpace(boxHeight + 15);
        const boxY = doc.y;
        
        // Yellow background with border
        doc.rect(data.leftMargin, boxY, data.contentWidth, boxHeight)
          .fillAndStroke(INITIALS_BG, INITIALS_BORDER);
        
        // Left border accent
        doc.rect(data.leftMargin, boxY, 4, boxHeight).fill(INITIALS_BORDER);
        
        // Text content
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#92400e')
          .text(cleanText, data.leftMargin + 12, boxY + 12, { width: data.contentWidth - 100 });
        
        // Initials box on the right
        const initialsBoxX = data.leftMargin + data.contentWidth - 70;
        doc.rect(initialsBoxX, boxY + 8, 60, 24)
          .lineWidth(1.5)
          .stroke(PURPLE_COLOR);
        
        // Display initials
        const initialsText = data.initials || '___';
        doc.fontSize(12).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
          .text(initialsText, initialsBoxX + 5, boxY + 14, { width: 50, align: 'center' });
        
        doc.y = boxY + boxHeight + 10;
        break;
        
      case 'warning-box':
        // Red warning box with dynamic height
        doc.fontSize(9);
        const warnTextHeight = doc.heightOfString(element.content, { width: data.contentWidth - 24 });
        const warnBoxHeight = Math.max(35, warnTextHeight + 24);
        
        ensureSpace(warnBoxHeight + 15);
        const warnBoxY = doc.y;
        
        doc.rect(data.leftMargin, warnBoxY, data.contentWidth, warnBoxHeight)
          .fillAndStroke(WARNING_BG, WARNING_COLOR);
        
        // Left border accent
        doc.rect(data.leftMargin, warnBoxY, 4, warnBoxHeight).fill(WARNING_COLOR);
        
        doc.fontSize(9).font('Helvetica-Bold').fillColor(WARNING_COLOR)
          .text(element.content, data.leftMargin + 12, warnBoxY + 12, { width: data.contentWidth - 24 });
        
        doc.y = warnBoxY + warnBoxHeight + 10;
        break;
        
      case 'divider':
        ensureSpace(20);
        doc.moveDown(0.5);
        doc.moveTo(data.leftMargin, doc.y)
          .lineTo(data.leftMargin + data.contentWidth, doc.y)
          .lineWidth(2)
          .stroke(PURPLE_COLOR);
        doc.moveDown(0.5);
        break;
        
      case 'info-box':
        // Render light purple info/acknowledgment box with dynamic height
        doc.fontSize(9);
        const infoTextHeight = doc.heightOfString(element.content, { width: data.contentWidth - 24 });
        const infoBoxHeight = Math.max(50, infoTextHeight + 30);
        
        ensureSpace(infoBoxHeight + 15);
        const infoBoxY = doc.y;
        
        doc.rect(data.leftMargin, infoBoxY, data.contentWidth, infoBoxHeight)
          .fillAndStroke('#f8f4ff', PURPLE_COLOR);
        
        // Left border accent
        doc.rect(data.leftMargin, infoBoxY, 4, infoBoxHeight).fill(PURPLE_COLOR);
        
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(element.content, data.leftMargin + 12, infoBoxY + 15, { width: data.contentWidth - 24, lineGap: 2 });
        
        doc.y = infoBoxY + infoBoxHeight + 10;
        break;
        
      case 'signature-section':
        ensureSpace(60);
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
          .text('SIGNATURE REQUIRED - See Signature Page', { align: 'center' });
        doc.moveDown(0.5);
        break;
        
      default:
        // Fallback for unknown types
        ensureSpace(20);
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(element.content, { lineGap: 2 });
        doc.moveDown(0.3);
    }
  }
}

// Legacy strip function for backward compatibility
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Replace placeholders in contract content with actual values
export function replaceContractPlaceholders(
  content: string,
  data: {
    signerName?: string;
    signerEmail?: string;
    effectiveDate?: string;
    initials?: string;
    signatureData?: string;
    clientCompany?: string;
    clientAddress?: string;
    primaryTitle?: string;
    secondaryOwner?: string;
  }
): string {
  let result = content;
  
  // Replace signer name placeholders
  if (data.signerName) {
    result = result.replace(/\[SIGNER NAME[^\]]*\]/gi, data.signerName);
    result = result.replace(/\[PRIMARY OWNER\]/gi, data.signerName);
    result = result.replace(/\[AFFILIATE NAME[^\]]*\]/gi, data.signerName);
  }
  
  // Replace signer email placeholders
  if (data.signerEmail) {
    result = result.replace(/\[SIGNER EMAIL[^\]]*\]/gi, data.signerEmail);
    result = result.replace(/\[EMAIL[^\]]*\]/gi, data.signerEmail);
  }
  
  // Replace effective date placeholders
  if (data.effectiveDate) {
    result = result.replace(/\[EFFECTIVE DATE[^\]]*\]/gi, data.effectiveDate);
    result = result.replace(/\[DATE\]/gi, data.effectiveDate);
  }
  
  // Replace initials placeholders
  if (data.initials) {
    result = result.replace(/\[INITIALS[^\]]*\]/gi, data.initials);
  }
  
  // Replace company placeholders (FICA contract)
  if (data.clientCompany) {
    result = result.replace(/\[COMPANY NAME[^\]]*\]/gi, data.clientCompany);
    result = result.replace(/\[COMPANY\]/gi, data.clientCompany);
  }
  
  // Replace address placeholders (FICA contract)
  if (data.clientAddress) {
    result = result.replace(/\[COMPANY ADDRESS[^\]]*\]/gi, data.clientAddress);
    result = result.replace(/\[ADDRESS\]/gi, data.clientAddress);
  }
  
  // Replace title placeholders (FICA contract)
  if (data.primaryTitle) {
    result = result.replace(/\[TITLE[^\]]*\]/gi, data.primaryTitle);
  }
  
  // Replace secondary owner placeholders (FICA contract)
  const secondaryVal = data.secondaryOwner || "N/A";
  result = result.replace(/\[SECONDARY OWNER\]/gi, secondaryVal);
  result = result.replace(/\[OPTIONAL[^\]]*\]/gi, secondaryVal);
  
  // Replace signature placeholders (just mark as "See Signature Below" since actual signature is drawn)
  if (data.signatureData) {
    result = result.replace(/\[SIGNATURE[^\]]*\]/gi, '[Signature Captured - See Signature Page]');
  }
  
  return result;
}

// HTML escape utility to prevent XSS
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Check if content is plain text (no HTML) and add header for display
export function addPlainTextHeader(
  content: string,
  data: {
    signerName: string;
    signerEmail?: string;
    effectiveDate?: string;
    initials?: string;
  }
): string {
  // Check if this is plain text (no meaningful HTML tags)
  const hasHtmlTags = /<[a-zA-Z][^>]*>/.test(content);
  
  if (!hasHtmlTags) {
    // Escape user-provided values to prevent HTML injection
    const safeName = escapeHtml(data.signerName);
    const safeEmail = escapeHtml(data.signerEmail || '');
    const safeInitials = escapeHtml(data.initials || '[INITIALS]');
    
    // Format the date
    const dateDisplay = data.effectiveDate 
      ? new Date(data.effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '[DATE]';
    
    // Add styled header for plain text templates
    const headerHtml = `
      <div style="background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #9333ea;">
        <h3 style="color: #6b21a8; margin: 0 0 15px 0; font-weight: 700;">Agreement Details</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div><strong>Signer:</strong> ${safeName}</div>
          <div><strong>Email:</strong> ${safeEmail}</div>
          <div><strong>Effective Date:</strong> <span style="color: #166534; font-weight: 600;">${dateDisplay}</span></div>
          <div><strong>Initials:</strong> <span style="color: #166534; font-weight: 600;">${safeInitials}</span></div>
        </div>
      </div>
      <div style="white-space: pre-wrap; font-family: inherit;">`;
    return headerHtml + content + '</div>';
  }
  
  return content;
}

// Generate document hash for audit trail
function generateDocumentHash(data: CsuContractData): string {
  const content = `${data.templateName}|${data.signerName}|${data.signerEmail}|${data.signedAt}|${data.agreementId}`;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16).toUpperCase();
}

export async function generateCsuContractPdf(data: CsuContractData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 72, bottom: 72, left: 72, right: 72 },
        bufferPages: true
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 144;
      const PURPLE_COLOR = '#6b21a8';
      const DARK_PURPLE = '#1a1a2e';
      const GOLD_COLOR = '#C5A572';
      
      // Generate document hash
      const documentHash = generateDocumentHash(data);
      const signedDate = new Date(data.signedAt);

      // ===== PAGE 1: HEADER & CONTRACT INFO =====
      
      // Purple header bar
      doc.rect(0, 0, pageWidth, 80).fill(PURPLE_COLOR);
      
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('PAYZIUM', 72, 25, { align: 'center' });
      doc.fontSize(10).fillColor('#E9D5FF')
        .text('FICA Tips Tax Credit Services', { align: 'center' });
      
      doc.y = 100;
      
      // Agreement Title
      doc.fontSize(18).font('Helvetica-Bold').fillColor(DARK_PURPLE)
        .text(data.templateName, { align: 'center' });
      doc.moveDown(0.5);
      
      // Client Info Box
      doc.rect(72, doc.y, contentWidth, 100).lineWidth(2).stroke(PURPLE_COLOR);
      const boxY = doc.y + 10;
      
      doc.fontSize(11).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
        .text('CLIENT INFORMATION', 82, boxY);
      
      doc.fontSize(10).font('Helvetica').fillColor('#333');
      doc.text(`Company: ${data.clientCompany || data.signerName}`, 82, boxY + 20);
      doc.text(`Authorized Signer: ${data.signerName}`, 82, boxY + 35);
      doc.text(`Title: ${data.primaryTitle || 'Authorized Representative'}`, 82, boxY + 50);
      doc.text(`Email: ${data.signerEmail}`, 82, boxY + 65);
      doc.text(`Agreement Date: ${data.effectiveDate || signedDate.toLocaleDateString('en-US')}`, 320, boxY + 20);
      doc.text(`Agreement ID: CSU-${data.agreementId}`, 320, boxY + 35);
      
      doc.y = boxY + 110;

      // Contract Content (replace placeholders first, then clean)
      const contentWithReplacements = replaceContractPlaceholders(data.templateContent, {
        signerName: data.signerName,
        signerEmail: data.signerEmail,
        effectiveDate: data.effectiveDate || undefined,
        initials: data.initials || undefined,
        signatureData: data.signatureData || undefined,
        clientCompany: data.clientCompany || undefined,
        clientAddress: data.clientAddress || data.address || undefined, // Prefer explicit clientAddress, fall back to address
        primaryTitle: data.primaryTitle || undefined,
        secondaryOwner: data.secondaryOwner || undefined,
      });
      
      // Check if this is a plain text template (no HTML tags)
      const isPlainText = !/<[a-zA-Z][^>]*>/.test(data.templateContent);
      
      if (isPlainText) {
        // Add Agreement Details box for plain text templates
        const detailsBoxY = doc.y;
        doc.rect(72, detailsBoxY, contentWidth, 60).lineWidth(1).stroke(PURPLE_COLOR);
        doc.fontSize(11).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
          .text('Agreement Details', 82, detailsBoxY + 10);
        doc.fontSize(9).font('Helvetica').fillColor('#333');
        doc.text(`Signer: ${data.signerName}`, 82, detailsBoxY + 28);
        doc.text(`Email: ${data.signerEmail}`, 250, detailsBoxY + 28);
        const effectiveDateDisplay = data.effectiveDate 
          ? new Date(data.effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          : 'N/A';
        doc.text(`Effective Date: ${effectiveDateDisplay}`, 82, detailsBoxY + 43);
        doc.text(`Initials: ${data.initials || 'N/A'}`, 250, detailsBoxY + 43);
        doc.y = detailsBoxY + 75;
        
        // Plain text: use simple rendering
        const cleanContent = stripHtml(contentWithReplacements);
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(cleanContent, { align: 'left', lineGap: 3, columns: 1 });
      } else {
        // HTML content: parse and render with proper formatting
        const parsedElements = parseHtmlForPdf(contentWithReplacements);
        renderHtmlToPdf(doc, parsedElements, {
          initials: data.initials || undefined,
          pageWidth,
          contentWidth,
          leftMargin: 72
        });
      }
      
      // ===== SIGNATURE PAGE =====
      doc.addPage();
      
      // Header
      doc.rect(0, 0, pageWidth, 60).fill(PURPLE_COLOR);
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('SIGNATURE & VERIFICATION', 72, 20, { align: 'center' });
      
      doc.y = 80;

      // Signature Block with visible signer details
      doc.rect(72, doc.y, contentWidth, 180).lineWidth(2).stroke(PURPLE_COLOR);
      
      const sigBlockY = doc.y + 15;
      doc.fontSize(12).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
        .text('ELECTRONIC SIGNATURE', 82, sigBlockY);
      
      // Signer Info
      doc.fontSize(10).font('Helvetica').fillColor('#333');
      doc.text(`Signed by: ${data.signerName}`, 82, sigBlockY + 25);
      doc.text(`Email: ${data.signerEmail}`, 82, sigBlockY + 40);
      doc.text(`IP Address: ${data.signedIpAddress || 'N/A'}`, 82, sigBlockY + 55);
      doc.text(`Signed on: ${signedDate.toLocaleString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
      })}`, 82, sigBlockY + 70);
      
      // Signature Image
      if (data.signatureData && data.signatureData.startsWith('data:image/')) {
        try {
          const sigBuffer = Buffer.from(data.signatureData.split(',')[1], 'base64');
          doc.image(sigBuffer, 300, sigBlockY + 20, { 
            width: 180, 
            height: 70,
            fit: [180, 70]
          });
          doc.rect(295, sigBlockY + 15, 190, 80).lineWidth(1).stroke(GOLD_COLOR);
        } catch (e) {
          doc.fontSize(16).font('Helvetica-Oblique').fillColor('#666')
            .text(data.signerName, 300, sigBlockY + 45);
        }
      }
      
      // Initials
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#333')
        .text(`Initials: ${data.initials || 'N/A'}`, 82, sigBlockY + 100);
      
      doc.y = sigBlockY + 180;
      
      // ===== SIGNATURE CERTIFICATE PAGE =====
      doc.addPage();
      
      // Header
      doc.rect(0, 0, pageWidth, 70).fill(DARK_PURPLE);
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('SIGNATURE CERTIFICATE', 72, 20, { align: 'center' });
      doc.fontSize(10).fillColor('#E9D5FF')
        .text('Electronic Signature Verification & Audit Trail', { align: 'center' });
      
      doc.y = 90;

      // Certificate Box
      doc.rect(72, doc.y, contentWidth, 280).lineWidth(3).stroke(PURPLE_COLOR);
      
      let certY = doc.y + 20;
      
      // Certificate Icon Area
      doc.fontSize(12).font('Helvetica-Bold').fillColor(PURPLE_COLOR)
        .text('CERTIFICATE OF COMPLETION', 72, certY, { align: 'center', width: contentWidth });
      
      certY += 30;
      
      doc.fontSize(10).font('Helvetica').fillColor('#333')
        .text(`This document certifies that the following individual electronically signed the attached agreement:`, 92, certY, { width: contentWidth - 40 });
      
      certY += 40;
      
      // Signer Details Table
      const certDetails = [
        ['Document:', data.templateName],
        ['Agreement ID:', `CSU-${data.agreementId}`],
        ['Document Hash:', documentHash],
        ['', ''],
        ['Signer Name:', data.signerName],
        ['Email Address:', data.signerEmail],
        ['Phone:', data.signerPhone || 'Not provided'],
        ['Company:', data.clientCompany || 'Not provided'],
        ['', ''],
        ['Signed Date:', signedDate.toLocaleString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
        })],
        ['IP Address:', data.signedIpAddress || 'N/A'],
        ['User Agent:', (data.userAgent || 'N/A').substring(0, 60) + (data.userAgent && data.userAgent.length > 60 ? '...' : '')],
        ['Signature Method:', 'Drawn electronic signature via touch/mouse input'],
        ['E-SIGN Consent:', data.esignConsent ? 'Yes - Consented to electronic signatures' : 'No'],
        ['Terms Accepted:', data.termsConsent ? 'Yes - Agreed to agreement terms' : 'No'],
      ];

      for (const [label, value] of certDetails) {
        if (label === '') {
          certY += 8;
          continue;
        }
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#555')
          .text(label, 92, certY, { width: 120 });
        doc.font('Helvetica').fillColor('#333')
          .text(value || 'N/A', 215, certY, { width: contentWidth - 160 });
        certY += 16;
      }

      doc.y = doc.y + 300;
      
      // Legal Disclaimer
      doc.fontSize(10).font('Helvetica-Bold').fillColor(DARK_PURPLE)
        .text('LEGAL NOTICE', { align: 'center' });
      doc.moveDown(0.5);
      
      doc.fontSize(8).font('Helvetica').fillColor('#555')
        .text(`This electronic signature is legally binding pursuant to the Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.) and the Uniform Electronic Transactions Act (UETA). The signer consented to use electronic records and signatures and intended to sign this document electronically. The signature was captured and verified by the Payzium Contract Platform.`, { align: 'center', lineGap: 2 });
      
      doc.moveDown(1);
      
      doc.fontSize(8).fillColor('#888')
        .text(`Document generated on ${new Date().toLocaleString('en-US')} | Hash: ${documentHash}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

interface NdaData {
  fullName: string;
  veteranNumber?: string;
  address?: string;
  signedAt: string;
  signedIpAddress?: string;
  signatureData?: string;
  facePhoto?: string;
  idPhoto?: string;
}

const GOLD_COLOR = '#C5A572';
const NAVY_COLOR = '#1A365D';
const RED_COLOR = '#E21C3D';

export async function generateNdaPdf(ndaData: NdaData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 72, bottom: 72, left: 72, right: 72 },
        bufferPages: true
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const contentWidth = pageWidth - 144;

      drawGildedBorder(doc);
      drawHeader(doc, pageWidth);

      doc.moveDown(2);

      doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY_COLOR)
        .text(NDA_TEMPLATE.title, { align: 'center' });
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica').fillColor('#333')
        .text(`Effective Date: ${new Date(ndaData.signedAt).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })}`, { align: 'center' });
      doc.moveDown(1);

      doc.fontSize(10).font('Helvetica').fillColor('#333')
        .text(`This Non-Circumvention, Non-Disclosure and Confidentiality Agreement ("Agreement") is entered into between `, { continued: true })
        .font('Helvetica-Bold').text(`${NDA_TEMPLATE.organization.name}`, { continued: true })
        .font('Helvetica').text(`, a ${NDA_TEMPLATE.organization.type} (EIN: ${NDA_TEMPLATE.organization.ein}), located at ${NDA_TEMPLATE.organization.address} ("Organization"), and `, { continued: true })
        .font('Helvetica-Bold').text(`${ndaData.fullName}`, { continued: true })
        .font('Helvetica').text(` ("Signatory"), collectively referred to as the "Parties."`);
      
      doc.moveDown(1);

      for (const section of NDA_TEMPLATE.sections) {
        if (doc.y > doc.page.height - 150) {
          doc.addPage();
          drawGildedBorder(doc);
        }

        if (section.isHighlight) {
          doc.fontSize(11).font('Helvetica-Bold').fillColor(RED_COLOR)
            .text(section.title, { underline: true });
        } else {
          doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY_COLOR)
            .text(section.title);
        }
        doc.moveDown(0.3);

        for (const paragraph of section.content) {
          if (doc.y > doc.page.height - 100) {
            doc.addPage();
            drawGildedBorder(doc);
          }
          
          if (paragraph.startsWith('•')) {
            doc.fontSize(9).font('Helvetica').fillColor('#333')
              .text(paragraph, { indent: 15 });
          } else if (paragraph.includes('⚠️') || paragraph.includes('WARNING')) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor(RED_COLOR)
              .text(paragraph);
          } else {
            doc.fontSize(9).font('Helvetica').fillColor('#333')
              .text(paragraph);
          }
          doc.moveDown(0.2);
        }
        doc.moveDown(0.5);
      }

      doc.addPage();
      drawGildedBorder(doc);
      drawVerificationSection(doc, ndaData, pageWidth, contentWidth);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function drawGildedBorder(doc: PDFKit.PDFDocument) {
  const margin = 36;
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  
  doc.save();
  
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin)
    .lineWidth(3)
    .stroke(GOLD_COLOR);
  
  doc.rect(margin + 6, margin + 6, pageWidth - 2 * margin - 12, pageHeight - 2 * margin - 12)
    .lineWidth(1)
    .stroke(GOLD_COLOR);
  
  const cornerSize = 20;
  const corners = [
    { x: margin, y: margin },
    { x: pageWidth - margin - cornerSize, y: margin },
    { x: margin, y: pageHeight - margin - cornerSize },
    { x: pageWidth - margin - cornerSize, y: pageHeight - margin - cornerSize }
  ];
  
  for (const corner of corners) {
    doc.save();
    doc.rect(corner.x, corner.y, cornerSize, cornerSize)
      .lineWidth(2)
      .stroke(GOLD_COLOR);
    
    doc.moveTo(corner.x, corner.y)
      .lineTo(corner.x + cornerSize, corner.y + cornerSize)
      .stroke(GOLD_COLOR);
    doc.moveTo(corner.x + cornerSize, corner.y)
      .lineTo(corner.x, corner.y + cornerSize)
      .stroke(GOLD_COLOR);
    doc.restore();
  }
  
  doc.restore();
}

function drawHeader(doc: PDFKit.PDFDocument, pageWidth: number) {
  doc.y = 60;
  
  const starY = 70;
  const starCenterX = pageWidth / 2;
  const starSize = 25;
  
  doc.save();
  drawStar(doc, starCenterX, starY, starSize, NAVY_COLOR);
  doc.restore();
  
  doc.moveDown(3);
  
  doc.fontSize(22).font('Helvetica-Bold').fillColor(NAVY_COLOR)
    .text('NAVIGATOR USA', { align: 'center' });
  
  doc.fontSize(11).font('Helvetica').fillColor(GOLD_COLOR)
    .text("Veterans' Family Resources", { align: 'center' });
  
  doc.moveDown(0.5);
  
  doc.moveTo(pageWidth / 2 - 100, doc.y)
    .lineTo(pageWidth / 2 + 100, doc.y)
    .lineWidth(2)
    .stroke(GOLD_COLOR);
  
  doc.moveDown(0.5);
  
  doc.fontSize(9).font('Helvetica').fillColor('#666')
    .text('OFFICIAL LEGAL DOCUMENT', { align: 'center' });
}

function drawStar(doc: PDFKit.PDFDocument, cx: number, cy: number, size: number, color: string) {
  const points = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;
  
  doc.save();
  doc.fillColor(color);
  
  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI / points) - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    
    if (i === 0) {
      doc.moveTo(x, y);
    } else {
      doc.lineTo(x, y);
    }
  }
  doc.closePath().fill();
  doc.restore();
}

function drawVerificationSection(doc: PDFKit.PDFDocument, ndaData: NdaData, pageWidth: number, contentWidth: number) {
  doc.y = 80;
  
  doc.fontSize(16).font('Helvetica-Bold').fillColor(NAVY_COLOR)
    .text('SIGNATORY VERIFICATION & ATTESTATION', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.moveTo(pageWidth / 2 - 150, doc.y)
    .lineTo(pageWidth / 2 + 150, doc.y)
    .lineWidth(2)
    .stroke(GOLD_COLOR);
  
  doc.moveDown(1);
  
  doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY_COLOR)
    .text('SIGNATORY INFORMATION');
  doc.moveDown(0.3);
  
  const sigInfo = [
    ['Full Legal Name:', ndaData.fullName],
    ['Veteran Number:', ndaData.veteranNumber || 'N/A'],
    ['Address:', ndaData.address || 'N/A'],
    ['Date of Execution:', new Date(ndaData.signedAt).toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })],
    ['IP Address:', ndaData.signedIpAddress || 'N/A']
  ];
  
  for (const [label, value] of sigInfo) {
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#333')
      .text(label, { continued: true })
      .font('Helvetica').text(` ${value}`);
    doc.moveDown(0.2);
  }
  
  doc.moveDown(1);
  
  const photoY = doc.y;
  const photoWidth = 150;
  const photoHeight = 150;
  
  if (ndaData.facePhoto || ndaData.idPhoto) {
    doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY_COLOR)
      .text('IDENTITY VERIFICATION PHOTOS');
    doc.moveDown(0.5);
    
    const photoStartY = doc.y;
    
    if (ndaData.facePhoto) {
      try {
        const facePhotoBuffer = Buffer.from(ndaData.facePhoto.split(',')[1], 'base64');
        doc.image(facePhotoBuffer, 72, photoStartY, { 
          width: photoWidth, 
          height: photoHeight,
          fit: [photoWidth, photoHeight]
        });
        doc.fontSize(8).font('Helvetica').fillColor('#666')
          .text('Face Photo', 72, photoStartY + photoHeight + 5, { width: photoWidth, align: 'center' });
      } catch (e) {
        doc.fontSize(9).font('Helvetica').fillColor('#999')
          .text('[Face Photo - Unable to embed]', 72, photoStartY);
      }
    }
    
    if (ndaData.idPhoto) {
      try {
        const idPhotoBuffer = Buffer.from(ndaData.idPhoto.split(',')[1], 'base64');
        doc.image(idPhotoBuffer, 250, photoStartY, { 
          width: photoWidth, 
          height: photoHeight,
          fit: [photoWidth, photoHeight]
        });
        doc.fontSize(8).font('Helvetica').fillColor('#666')
          .text('ID Document', 250, photoStartY + photoHeight + 5, { width: photoWidth, align: 'center' });
      } catch (e) {
        doc.fontSize(9).font('Helvetica').fillColor('#999')
          .text('[ID Photo - Unable to embed]', 250, photoStartY);
      }
    }
    
    doc.y = photoStartY + photoHeight + 30;
  }
  
  doc.moveDown(1);
  
  doc.fontSize(11).font('Helvetica-Bold').fillColor(NAVY_COLOR)
    .text('ELECTRONIC SIGNATURE');
  doc.moveDown(0.5);
  
  const sigBoxY = doc.y;
  const sigBoxWidth = 300;
  const sigBoxHeight = 100;
  
  doc.rect(72, sigBoxY, sigBoxWidth, sigBoxHeight)
    .lineWidth(1)
    .stroke(GOLD_COLOR);
  
  if (ndaData.signatureData) {
    try {
      const sigBuffer = Buffer.from(ndaData.signatureData.split(',')[1], 'base64');
      doc.image(sigBuffer, 77, sigBoxY + 5, { 
        width: sigBoxWidth - 10, 
        height: sigBoxHeight - 10,
        fit: [sigBoxWidth - 10, sigBoxHeight - 10]
      });
    } catch (e) {
      doc.fontSize(12).font('Helvetica-Oblique').fillColor('#666')
        .text(ndaData.fullName, 77, sigBoxY + 40, { width: sigBoxWidth - 10, align: 'center' });
    }
  }
  
  doc.fontSize(8).font('Helvetica').fillColor('#666')
    .text('Authorized Signature', 72, sigBoxY + sigBoxHeight + 5, { width: sigBoxWidth, align: 'center' });
  
  doc.moveDown(3);
  
  doc.y = sigBoxY + sigBoxHeight + 40;
  
  doc.moveTo(72, doc.y)
    .lineTo(pageWidth - 72, doc.y)
    .lineWidth(1)
    .stroke(GOLD_COLOR);
  
  doc.moveDown(0.5);
  
  doc.fontSize(8).font('Helvetica').fillColor('#666')
    .text('This document was electronically signed and is legally binding pursuant to the Electronic Signatures in Global and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA). The signature, photos, and verification information above constitute authentic evidence of the Signatory\'s agreement to all terms contained herein.', { align: 'center' });
  
  doc.moveDown(1);
  
  doc.fontSize(9).font('Helvetica-Bold').fillColor(NAVY_COLOR)
    .text('NAVIGATOR USA CORP', { align: 'center' });
  doc.fontSize(8).font('Helvetica').fillColor('#666')
    .text('501(c)(3) Non-Profit Organization | EIN: 88-3349582', { align: 'center' });
  doc.text('429 D Shoreline Village Dr, Long Beach, CA 90802', { align: 'center' });
}

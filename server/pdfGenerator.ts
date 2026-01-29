import PDFDocument from 'pdfkit';
import { NDA_TEMPLATE } from './templates/ndaTemplate';

import crypto from 'crypto';

// CSU Contract PDF Generation
interface CsuContractData {
  templateName: string;
  templateContent: string;
  signerName: string;
  signerEmail: string;
  signerPhone?: string | null;
  address?: string | null;
  initials?: string | null;
  effectiveDate?: string | null;
  signedAt: string;
  signedIpAddress?: string | null;
  signatureData?: string | null;
  agreementId: number;
  userAgent?: string | null;
  clientCompany?: string | null;
  primaryTitle?: string | null;
  esignConsent?: boolean;
  termsConsent?: boolean;
}

// Helper to strip HTML tags and decode entities
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
    effectiveDate?: string;
    initials?: string;
    signatureData?: string;
  }
): string {
  let result = content;
  
  // Replace signer name placeholders
  if (data.signerName) {
    result = result.replace(/\[SIGNER NAME[^\]]*\]/gi, data.signerName);
  }
  
  // Replace effective date placeholders
  if (data.effectiveDate) {
    result = result.replace(/\[EFFECTIVE DATE[^\]]*\]/gi, data.effectiveDate);
  }
  
  // Replace initials placeholders
  if (data.initials) {
    result = result.replace(/\[INITIALS[^\]]*\]/gi, data.initials);
  }
  
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
        effectiveDate: data.effectiveDate || undefined,
        initials: data.initials || undefined,
        signatureData: data.signatureData || undefined,
      });
      
      // Check if this is a plain text template (no HTML tags) - add agreement details header
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
      }
      
      const cleanContent = stripHtml(contentWithReplacements);
      doc.fontSize(9).font('Helvetica').fillColor('#333')
        .text(cleanContent, { align: 'left', lineGap: 3, columns: 1 });
      
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

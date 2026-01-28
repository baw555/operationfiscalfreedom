import PDFDocument from 'pdfkit';
import { NDA_TEMPLATE } from './templates/ndaTemplate';

// CSU Contract PDF Generation
interface CsuContractData {
  templateName: string;
  templateContent: string;
  signerName: string;
  signerEmail: string;
  signerPhone?: string | null;
  address?: string | null;
  signedAt: string;
  signedIpAddress?: string | null;
  signatureData?: string | null;
  agreementId: number;
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
      const BLUE_COLOR = '#1E40AF';
      const GOLD_COLOR = '#C5A572';

      // Header
      doc.fontSize(24).font('Helvetica-Bold').fillColor(BLUE_COLOR)
        .text('COST SAVINGS UNIVERSITY', { align: 'center' });
      doc.moveDown(0.5);
      
      doc.fontSize(11).font('Helvetica').fillColor(GOLD_COLOR)
        .text('Contract Agreement', { align: 'center' });
      
      doc.moveDown(0.3);
      doc.moveTo(pageWidth / 2 - 100, doc.y)
        .lineTo(pageWidth / 2 + 100, doc.y)
        .lineWidth(2)
        .stroke(GOLD_COLOR);
      
      doc.moveDown(1);

      // Contract Title
      doc.fontSize(16).font('Helvetica-Bold').fillColor(BLUE_COLOR)
        .text(data.templateName, { align: 'center' });
      doc.moveDown(1);

      // Contract Content
      doc.fontSize(10).font('Helvetica').fillColor('#333')
        .text(data.templateContent, { align: 'left', lineGap: 4 });
      
      doc.moveDown(2);

      // Signature Section
      doc.addPage();
      
      doc.fontSize(16).font('Helvetica-Bold').fillColor(BLUE_COLOR)
        .text('SIGNATURE & VERIFICATION', { align: 'center' });
      doc.moveDown(1);

      // Signer Info
      const sigInfo = [
        ['Full Name:', data.signerName],
        ['Email:', data.signerEmail],
        ['Phone:', data.signerPhone || 'N/A'],
        ['Address:', data.address || 'N/A'],
        ['Date Signed:', new Date(data.signedAt).toLocaleString('en-US')],
        ['IP Address:', data.signedIpAddress || 'N/A'],
        ['Agreement ID:', `CSU-${data.agreementId}`]
      ];

      for (const [label, value] of sigInfo) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#333')
          .text(label, { continued: true })
          .font('Helvetica').text(` ${value}`);
        doc.moveDown(0.3);
      }

      doc.moveDown(1);

      // Signature Box
      doc.fontSize(11).font('Helvetica-Bold').fillColor(BLUE_COLOR)
        .text('ELECTRONIC SIGNATURE');
      doc.moveDown(0.5);

      const sigBoxY = doc.y;
      const sigBoxWidth = 300;
      const sigBoxHeight = 100;

      doc.rect(72, sigBoxY, sigBoxWidth, sigBoxHeight)
        .lineWidth(1)
        .stroke(GOLD_COLOR);

      if (data.signatureData && data.signatureData.startsWith('data:image/')) {
        try {
          const sigBuffer = Buffer.from(data.signatureData.split(',')[1], 'base64');
          doc.image(sigBuffer, 77, sigBoxY + 5, { 
            width: sigBoxWidth - 10, 
            height: sigBoxHeight - 10,
            fit: [sigBoxWidth - 10, sigBoxHeight - 10]
          });
        } catch (e) {
          doc.fontSize(12).font('Helvetica-Oblique').fillColor('#666')
            .text(data.signerName, 77, sigBoxY + 40, { width: sigBoxWidth - 10, align: 'center' });
        }
      }

      doc.fontSize(8).font('Helvetica').fillColor('#666')
        .text('Authorized Signature', 72, sigBoxY + sigBoxHeight + 5, { width: sigBoxWidth, align: 'center' });

      doc.moveDown(4);

      // Legal Footer
      doc.fontSize(8).font('Helvetica').fillColor('#666')
        .text('This document was electronically signed and is legally binding pursuant to the Electronic Signatures in Global and National Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA).', { align: 'center' });

      doc.moveDown(1);
      doc.fontSize(9).font('Helvetica-Bold').fillColor(BLUE_COLOR)
        .text('COST SAVINGS UNIVERSITY', { align: 'center' });

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

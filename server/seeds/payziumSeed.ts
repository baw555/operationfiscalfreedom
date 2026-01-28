import { db } from "../db";
import { users, csuContractTemplates } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const NEW_CLIENT_AGREEMENT_CONTENT = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">

<h1 style="text-align: center; color: #6b21a8; border-bottom: 3px solid #9333ea; padding-bottom: 15px;">NEW CLIENT AGREEMENT</h1>

<div style="background: #f8f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
<p style="margin: 0;"><strong>Effective Date:</strong> [EFFECTIVE DATE - Enter Above]</p>
<p style="margin: 10px 0;"><strong>Client:</strong> [SIGNER NAME - Enter Above]</p>
</div>

<h2 style="color: #6b21a8;">1. AGREEMENT TO TERMS</h2>
<p>By signing this agreement, the Client agrees to engage the services of Payzium and its affiliates for the purpose of payment processing, merchant services, and related financial services as detailed in this agreement.</p>

<h2 style="color: #6b21a8;">2. SERVICES PROVIDED</h2>
<p>Payzium agrees to provide the following services to the Client:</p>
<ul>
<li>Payment processing and merchant account services</li>
<li>Point of sale solutions and integrations</li>
<li>Financial reporting and analytics</li>
<li>Customer support and technical assistance</li>
<li>Compliance and security services</li>
</ul>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE:</strong> [INITIALS - Enter Above]</p>
</div>

<h2 style="color: #6b21a8;">3. FEES AND PAYMENT TERMS</h2>
<p>The Client agrees to pay all applicable fees as outlined in the accompanying fee schedule. Fees may include but are not limited to:</p>
<ul>
<li>Transaction processing fees</li>
<li>Monthly service fees</li>
<li>Equipment rental or purchase fees</li>
<li>Chargeback and dispute resolution fees</li>
</ul>

<h2 style="color: #6b21a8;">4. TERM AND TERMINATION</h2>
<p>This agreement shall commence on the Effective Date and continue until terminated by either party with 30 days written notice. Early termination may be subject to applicable fees.</p>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE:</strong> [INITIALS - Enter Above]</p>
</div>

<h2 style="color: #6b21a8;">5. CONFIDENTIALITY</h2>
<p>Both parties agree to maintain the confidentiality of all proprietary information shared during the course of this agreement. This includes customer data, transaction information, and business practices.</p>

<h2 style="color: #6b21a8;">6. LIABILITY</h2>
<p>Payzium shall not be liable for any indirect, incidental, or consequential damages arising from the use of its services. The Client assumes responsibility for maintaining accurate records and complying with all applicable laws.</p>

<hr style="border: 2px solid #6b21a8; margin: 40px 0;">

<h2 style="color: #6b21a8; text-align: center;">SIGNATURE AND ACKNOWLEDGMENT</h2>

<div style="background: #f3e8ff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #6b21a8;">
<p style="font-size: 14px; margin-bottom: 20px;">By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions set forth in this New Client Agreement.</p>
<p style="margin: 15px 0;"><strong>Full Legal Name:</strong> [SIGNER NAME - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Email Address:</strong> [SIGNER EMAIL - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Effective Date:</strong> [EFFECTIVE DATE - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Initials:</strong> [INITIALS - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Signature:</strong> [SIGNATURE - Use Signature Pad Below]</p>
</div>

<div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
<p style="font-size: 12px; color: #666; margin: 0;">This document is electronically signed and legally binding upon submission.</p>
<p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Payzium | payzium.com</p>
</div>

</div>`;

const SIGN_AFFILIATE_AGREEMENT_CONTENT = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">

<h1 style="text-align: center; color: #6b21a8; border-bottom: 3px solid #9333ea; padding-bottom: 15px;">AFFILIATE AGREEMENT</h1>
<p style="text-align: center; color: #6b21a8; font-weight: bold; margin-bottom: 30px;">Including Non-Disclosure Agreement (NDA)</p>

<div style="background: #f8f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
<p style="margin: 0;"><strong>Effective Date:</strong> [EFFECTIVE DATE - Enter Above]</p>
<p style="margin: 10px 0;"><strong>Affiliate:</strong> [SIGNER NAME - Enter Above]</p>
<p style="margin: 0;"><strong>Company:</strong> Payzium</p>
</div>

<h2 style="color: #6b21a8;">PART I: AFFILIATE PARTNERSHIP AGREEMENT</h2>

<h3 style="color: #9333ea;">1. APPOINTMENT</h3>
<p>Payzium hereby appoints the Affiliate as an independent representative to promote and refer customers for Payzium's payment processing and merchant services. The Affiliate accepts this appointment under the terms and conditions set forth herein.</p>

<h3 style="color: #9333ea;">2. AFFILIATE RESPONSIBILITIES</h3>
<p>The Affiliate agrees to:</p>
<ul>
<li>Represent Payzium in a professional manner at all times</li>
<li>Accurately describe services and pricing to potential customers</li>
<li>Comply with all applicable laws and regulations</li>
<li>Maintain confidentiality of customer and company information</li>
<li>Submit referrals through official company channels</li>
</ul>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE TO ACKNOWLEDGE RESPONSIBILITIES:</strong> [INITIALS - Enter Above]</p>
</div>

<h3 style="color: #9333ea;">3. COMPENSATION</h3>
<p>The Affiliate shall receive commission payments as outlined in the Payzium compensation structure for all qualified referrals that result in active merchant accounts. Commissions are paid monthly on active accounts.</p>

<h3 style="color: #9333ea;">4. INDEPENDENT CONTRACTOR STATUS</h3>
<p>The Affiliate is an independent contractor and not an employee of Payzium. The Affiliate is responsible for their own taxes, insurance, and business expenses. Payzium will not withhold taxes or provide benefits.</p>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE TO ACKNOWLEDGE CONTRACTOR STATUS:</strong> [INITIALS - Enter Above]</p>
</div>

<hr style="border: 1px solid #ddd; margin: 30px 0;">

<h2 style="color: #6b21a8;">PART II: NON-DISCLOSURE AGREEMENT (NDA)</h2>

<h3 style="color: #9333ea;">5. CONFIDENTIAL INFORMATION</h3>
<p>The Affiliate acknowledges that during the course of this relationship, they will have access to confidential and proprietary information belonging to Payzium ("Confidential Information"). This includes but is not limited to:</p>
<ul>
<li>Customer lists, contact information, and transaction data</li>
<li>Pricing structures, commission rates, and business strategies</li>
<li>Training materials, sales processes, and marketing strategies</li>
<li>Software, technology systems, and trade secrets</li>
<li>Financial information and business operations data</li>
</ul>

<h3 style="color: #9333ea;">6. NON-DISCLOSURE OBLIGATIONS</h3>
<p>The Affiliate agrees to:</p>
<ul>
<li><strong>Maintain Confidentiality:</strong> Keep all Confidential Information strictly confidential and not disclose it to any third party without prior written consent</li>
<li><strong>Limited Use:</strong> Use Confidential Information solely for the purpose of performing affiliate duties</li>
<li><strong>Secure Storage:</strong> Take all reasonable precautions to protect Confidential Information from unauthorized access or disclosure</li>
<li><strong>Return of Materials:</strong> Return or destroy all Confidential Information upon termination of this agreement</li>
</ul>

<div style="background: #fce8e8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc2626;">
<p style="margin: 0; font-weight: bold; color: #dc2626;">IMPORTANT: Violation of this NDA may result in immediate termination and legal action.</p>
</div>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE TO ACKNOWLEDGE NDA TERMS:</strong> [INITIALS - Enter Above]</p>
</div>

<h3 style="color: #9333ea;">7. DURATION OF CONFIDENTIALITY</h3>
<p>The confidentiality obligations in this agreement shall survive the termination of the affiliate relationship and continue for a period of five (5) years thereafter, or for as long as the information remains confidential, whichever is longer.</p>

<h3 style="color: #9333ea;">8. TERM AND TERMINATION</h3>
<p>This agreement shall commence on the Effective Date and continue until terminated by either party with 30 days written notice. Either party may terminate immediately for material breach of this agreement.</p>

<h3 style="color: #9333ea;">9. GOVERNING LAW</h3>
<p>This agreement shall be governed by and construed in accordance with the laws of the State of Arizona. Any disputes arising from this agreement shall be resolved through binding arbitration.</p>

<hr style="border: 2px solid #6b21a8; margin: 40px 0;">

<h2 style="color: #6b21a8; text-align: center;">SIGNATURE AND ACKNOWLEDGMENT</h2>

<div style="background: #f3e8ff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #6b21a8;">
<p style="font-size: 14px; margin-bottom: 20px;">By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions set forth in this Affiliate Agreement and Non-Disclosure Agreement. I understand that this is a legally binding document.</p>
<p style="margin: 15px 0;"><strong>Full Legal Name:</strong> [SIGNER NAME - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Email Address:</strong> [SIGNER EMAIL - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Effective Date:</strong> [EFFECTIVE DATE - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Initials:</strong> [INITIALS - See Form Above]</p>
<p style="margin: 15px 0;"><strong>Signature:</strong> [SIGNATURE - Use Signature Pad Below]</p>
</div>

<div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
<p style="font-size: 12px; color: #666; margin: 0;">This document is electronically signed and legally binding upon submission.</p>
<p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Payzium | payzium.com</p>
</div>

</div>`;

export async function seedPayziumData() {
  try {
    // Check if Maurice already exists
    const existingUser = await db.select().from(users).where(eq(users.email, "maurice@payzium.com")).limit(1);
    
    if (existingUser.length === 0) {
      // Create Maurice Verrelli admin account
      const passwordHash = await bcrypt.hash("Payzium2024!", 10);
      await db.insert(users).values({
        name: "Maurice Verrelli",
        email: "maurice@payzium.com",
        passwordHash,
        role: "admin",
        referralCode: "PAYZIUM",
      });
      console.log("[seed] Created Maurice Verrelli admin account");
    } else {
      console.log("[seed] Maurice Verrelli account already exists");
    }

    // Check and create New Client Agreement template
    const existingNewClient = await db.select().from(csuContractTemplates)
      .where(eq(csuContractTemplates.name, "New Client Agreement")).limit(1);
    
    if (existingNewClient.length === 0) {
      await db.insert(csuContractTemplates).values({
        name: "New Client Agreement",
        description: "Standard client agreement for new customers",
        content: NEW_CLIENT_AGREEMENT_CONTENT,
        isActive: true,
      });
      console.log("[seed] Created New Client Agreement template");
    }

    // Check and create Sign Affiliate Agreement template
    const existingAffiliate = await db.select().from(csuContractTemplates)
      .where(eq(csuContractTemplates.name, "Sign Affiliate Agreement")).limit(1);
    
    if (existingAffiliate.length === 0) {
      await db.insert(csuContractTemplates).values({
        name: "Sign Affiliate Agreement",
        description: "Affiliate partnership agreement with NDA for Payzium representatives",
        content: SIGN_AFFILIATE_AGREEMENT_CONTENT,
        isActive: true,
      });
      console.log("[seed] Created Sign Affiliate Agreement template");
    }

    console.log("[seed] Payzium seed data complete");
  } catch (error) {
    console.error("[seed] Error seeding Payzium data:", error);
  }
}

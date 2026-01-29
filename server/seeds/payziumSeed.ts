import { db } from "../db";
import { users, csuContractTemplates } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

// Mr. Verrelli's Agreement - CSU Independent Referral, Commission & MSO Agreement
const MR_VERRELLI_AGREEMENT_CONTENT = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.8;">

<h1 style="text-align: center; color: #6b21a8; border-bottom: 3px solid #9333ea; padding-bottom: 15px; font-size: 28px;">INDEPENDENT REFERRAL, COMMISSION & MSO AGREEMENT</h1>

<h2 style="color: #6b21a8; margin-top: 30px;">1. Parties</h2>
<p>This Agreement is entered into by and between <strong>Cost Savings University, LLC</strong> ("CSU"), a Wyoming limited liability company, located at 30 N Gould St Ste R, Sheridan, WY 82801, and <strong>[SIGNER NAME - Enter Above]</strong> ("Sales Representative").</p>

<h2 style="color: #6b21a8;">2. Purpose</h2>
<p>Sales Representative may introduce prospective clients or business opportunities to CSU. This Agreement governs commissions, confidentiality, non-circumvention, and liability related to such introductions.</p>

<h2 style="color: #6b21a8;">3. Managed Service Organization Disclosure</h2>
<p>CSU operates solely as a managed services organization ("MSO"). CSU provides only administrative, marketing, technology, and referral coordination services and does not provide legal, tax, accounting, insurance, medical, clinical, payroll, PEO, or other regulated professional services. All such services are provided exclusively by independent third-party providers who are solely responsible for licensing, compliance, professional judgment, services rendered, fees charged, and outcomes.</p>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE:</strong> [INITIALS - Enter Above]</p>
</div>

<h2 style="color: #6b21a8;">4. Commission</h2>
<p>CSU shall pay Sales Representative a commission equal to <strong>thirty-three percent (33%)</strong> of Net Fees actually received by CSU from business directly introduced by Sales Representative. "Net Fees" means amounts received by CSU after third-party vendor costs, refunds, chargebacks, taxes, and processing fees.</p>

<h2 style="color: #6b21a8;">5. Independent Contractor</h2>
<p>Sales Representative is an independent contractor and not an employee, agent, partner, joint venturer, or fiduciary of CSU. Sales Representative has no authority to bind CSU.</p>

<h2 style="color: #6b21a8;">6. Confidentiality</h2>
<p>Each party shall keep confidential all non-public business, financial, technical, and client information received from the other and shall not disclose or use such information except as necessary to perform under this Agreement.</p>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE:</strong> [INITIALS - Enter Above]</p>
</div>

<h2 style="color: #6b21a8;">7. Non-Circumvention</h2>
<p>Sales Representative shall not directly or indirectly bypass, interfere with, or circumvent CSU's relationships with any clients, vendors, partners, or opportunities introduced by or through CSU.</p>

<h2 style="color: #6b21a8;">8. Limitation of Sales Representative Liability</h2>
<p>To the maximum extent permitted by law, Sales Representative shall not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages. Sales Representative's liability for any single claim shall be limited to the lesser of (a) commissions paid to Sales Representative during the three (3) months preceding the event giving rise to the claim, or (b) One Thousand Dollars ($1,000). Sales Representative shall have no liability for negligence, gross negligence, or willful misconduct. Liability shall exist only for knowing and intentional fraud proven by a final, non-appealable judgment.</p>

<h2 style="color: #6b21a8;">9. Indemnity Limitation</h2>
<p>Any indemnification obligation of Sales Representative is limited to knowing and intentional fraud proven by final, non-appealable judgment and is subject to the same per-claim cap set forth above. Sales Representative shall have no obligation to indemnify CSU for the acts or omissions of CSU or any third-party provider.</p>

<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
<p style="margin: 0;"><strong>INITIAL HERE:</strong> [INITIALS - Enter Above]</p>
</div>

<h2 style="color: #6b21a8;">10. Term and Termination</h2>
<p>This Agreement is effective as of <strong>[EFFECTIVE DATE - Enter Above]</strong> and may be terminated by either party upon thirty (30) days written notice. Commissions earned on Net Fees received prior to termination remain payable.</p>

<h2 style="color: #6b21a8;">11. Governing Law and Dispute Resolution</h2>
<p>This Agreement shall be governed by the laws of the State of Wyoming. Any dispute shall be resolved by binding arbitration in Wyoming.</p>

<h2 style="color: #6b21a8;">12. Entire Agreement</h2>
<p>This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements or understandings. Any amendment must be in writing and signed by both parties.</p>

<hr style="border: 2px solid #6b21a8; margin: 40px 0;">

<h2 style="color: #6b21a8; text-align: center;">13. Signatures</h2>

<div style="background: #f8f4ff; padding: 20px; border-radius: 8px; border: 2px solid #6b21a8; margin-bottom: 20px;">
  <h3 style="color: #6b21a8; margin-top: 0;">Cost Savings University, LLC</h3>
  <p style="margin: 10px 0;"><strong>By:</strong> Maurice Verrelli</p>
  <p style="margin: 10px 0;"><strong>Name:</strong> Maurice Verrelli</p>
  <p style="margin: 10px 0;"><strong>Title:</strong> President & CEO</p>
  <p style="margin: 10px 0;"><strong>Date:</strong> [EFFECTIVE DATE - See Form Above]</p>
</div>

<div style="background: #f3e8ff; padding: 25px; border-radius: 8px; margin: 25px 0; border: 2px solid #6b21a8;">
  <h3 style="color: #6b21a8; margin-top: 0;">Sales Representative</h3>
  <p style="margin: 15px 0;"><strong>Full Legal Name:</strong> [SIGNER NAME - See Form Above]</p>
  <p style="margin: 15px 0;"><strong>Email Address:</strong> [SIGNER EMAIL - See Form Above]</p>
  <p style="margin: 15px 0;"><strong>Date:</strong> [EFFECTIVE DATE - See Form Above]</p>
  <p style="margin: 15px 0;"><strong>Signature:</strong> [SIGNATURE - Use Signature Pad Below]</p>
</div>

<div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
<p style="font-size: 12px; color: #666; margin: 0;">This document is electronically signed and legally binding upon submission.</p>
<p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Cost Savings University, LLC | 30 N Gould St Ste R, Sheridan, WY 82801</p>
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
        portal: "payzium",
        referralCode: "PAYZIUM",
      });
      console.log("[seed] Created Maurice Verrelli admin account");
    } else {
      if (!existingUser[0].portal) {
        await db.update(users)
          .set({ portal: "payzium" })
          .where(eq(users.email, "maurice@payzium.com"));
        console.log("[seed] Updated Maurice Verrelli with portal restriction");
      } else {
        console.log("[seed] Maurice Verrelli account already exists");
      }
    }

    // Check and create Mr. Verrelli's Agreement template
    const existingVerrelliAgreement = await db.select().from(csuContractTemplates)
      .where(eq(csuContractTemplates.name, "Mr. Verrelli's Agreement")).limit(1);
    
    if (existingVerrelliAgreement.length === 0) {
      await db.insert(csuContractTemplates).values({
        name: "Mr. Verrelli's Agreement",
        description: "CSU Independent Referral, Commission & MSO Agreement",
        content: MR_VERRELLI_AGREEMENT_CONTENT,
        isActive: true,
      });
      console.log("[seed] Created Mr. Verrelli's Agreement template");
    } else {
      // Update existing template with correct content
      await db.update(csuContractTemplates)
        .set({ 
          content: MR_VERRELLI_AGREEMENT_CONTENT,
          description: "CSU Independent Referral, Commission & MSO Agreement"
        })
        .where(eq(csuContractTemplates.name, "Mr. Verrelli's Agreement"));
      console.log("[seed] Updated Mr. Verrelli's Agreement template");
    }

    console.log("[seed] Payzium seed data complete");
  } catch (error) {
    console.error("[seed] Error seeding Payzium data:", error);
  }
}

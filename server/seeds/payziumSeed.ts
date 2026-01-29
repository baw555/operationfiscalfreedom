import { db } from "../db";
import { users, csuContractTemplates } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

// FICA Tips Tax Credit Services Agreement - Interactive Template
const FICA_TIPS_AGREEMENT_CONTENT = `<div style="font-family: 'Times New Roman', serif; max-width: 850px; margin: 0 auto; padding: 30px; line-height: 1.8; color: #1a1a1a;">

<h1 style="text-align: center; color: #1a365d; border-bottom: 3px solid #6b21a8; padding-bottom: 15px; font-size: 26px; margin-bottom: 30px;">FICA Tips Tax Credit Services Agreement</h1>

<!-- LETTER HEADER -->
<p style="margin-bottom: 5px;"><span class="auto-fill" data-field="currentDate">[DATE]</span></p>
<p style="margin-bottom: 5px;">SENT VIA EMAIL</p>

<p style="margin: 20px 0 5px 0;">To: <span class="auto-fill" data-field="primaryOwner">[PRIMARY OWNER]</span> and <span class="auto-fill" data-field="secondaryOwner">[SECONDARY OWNER]</span></p>
<p style="margin: 5px 0;"><span class="auto-fill" data-field="clientCompany">[COMPANY]</span></p>
<p style="margin: 5px 0 20px 0;"><span class="auto-fill" data-field="clientAddress">[ADDRESS]</span></p>

<div style="margin: 20px 0;">
  <p><strong>Legacy Tax & Resolution Services, LLC</strong></p>
  <p>3961 E. Chandler Blvd #111-301</p>
  <p>Phoenix, AZ 85048</p>
</div>

<p style="margin: 20px 0;"><strong>Re: FICA Tips Tax Credit</strong></p>

<p>Dear <span class="auto-fill" data-field="primaryOwner">[PRIMARY OWNER]</span> and <span class="auto-fill" data-field="secondaryOwner">[SECONDARY OWNER]</span>,</p>

<p>We appreciate the opportunity to provide FICA Tips Tax Credit Services to <span class="auto-fill" data-field="clientCompany">[COMPANY]</span>. To ensure an understanding between us, this letter sets forth the terms of our Engagement as well as the nature and limitations of our services to you.</p>

<p>This contract will serve as a formal agreement between <span class="auto-fill" data-field="clientCompany">[COMPANY]</span>, <span class="auto-fill" data-field="primaryOwner">[PRIMARY OWNER]</span>, <span class="auto-fill" data-field="secondaryOwner">[SECONDARY OWNER]</span> and Legacy Tax & Resolution Services LLC (LTRS, Company), organized in the State of Arizona for the purpose of aiding Consumers nationwide with resolving their tax issue(s) through a Plan of Action specifically designed for each individual customer.</p>

<p>This Agreement is to confirm and specify the terms of our Engagement with you and to clarify the nature and extent of services we will provide and the basis for compensation for these services. Upon execution of this Engagement Letter by each of the parties, this letter will constitute a binding agreement between LTRS and the Client (the "Agreement").</p>

<!-- SECTION 1: SCOPE OF SERVICES -->
<h2 style="color: #6b21a8; margin-top: 40px; border-bottom: 2px solid #9333ea; padding-bottom: 8px;">1. SCOPE OF SERVICES</h2>

<p>Our Engagement will be on a project basis, applying for qualifying FICA Tips Tax Credits.</p>

<p>LTRS will, on behalf of the Client, perform the following services (the "Services"):</p>

<p style="margin-left: 20px;"><strong>a.</strong> Provide a qualification document that enables the client to self-validate eligibility for the FICA Tips Tax Credit ("FICA Tips")</p>

<p style="margin-left: 20px;"><strong>b.</strong> Assist with the determination of employee qualification, as defined in section 3121(a) of the Internal Revenue Code ("Code"), and compensation as defined in section 3231(e) of the Code and as otherwise required by statute or regulation (collectively "Qualified Tips").</p>

<p style="margin-left: 20px;"><strong>c.</strong> Create attribution schedules detailing wage allocation to PPP loan forgiveness and wage allocation to ERTC on behalf of Client; and</p>

<p style="margin-left: 20px;"><strong>d.</strong> Prepare and file on Client's behalf amended entity and personal returns for Client, together with other document(s) needed to claim the FICA Tips Tax Credit for calendar years 2022, 2023, 2024, and 2025, with the Internal Revenue Service ("IRS").</p>

<p style="margin-left: 20px;"><strong>e.</strong> If Client is audited by the IRS and information regarding Client's FICA Tips Tax Credit is needed, LTRS agrees that it will assist the Client by providing the reports and other records utilized by LTRS in calculating the Client's FICA Tips Tax Credit; provided, however, LTRS shall not be obligated to: (i) take any actions other than those specifically stated; (ii) incur any additional costs; (iii) perform any research or examine Client's records with any degree of particularity; (iv) represent Client before the IRS, or (v) engage in any matter outside the scope of the Services.</p>

<p style="margin-left: 20px;"><strong>f. Error, fraud, or theft.</strong> Our engagement and the Services do not include any procedures designed to discover errors, fraud, or theft. Therefore, our engagement and the Services cannot be relied upon to disclose such matters. In addition, we are not responsible for identifying or communicating deficiencies in your internal controls. You are responsible for developing and implementing internal controls applicable to your operations. This engagement is limited to the Services outlined above.</p>

<!-- INITIALS BOX 1 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE SECTION 1(a-f):</p>
  </div>
  <div class="initials-capture" data-section="1" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<p style="margin-left: 20px;"><strong>g. Government inquiries.</strong> This engagement does not include responding to inquiries by any governmental agency or tax authority. If your tax return is selected for examination or audit, you may request that we assist you in responding to such inquiry. If you ask us to represent you, we will confirm this in a separate engagement letter.</p>

<p style="margin-left: 20px;"><strong>h. Responding to Subpoenas.</strong> All information you provide to us in connection with this engagement will be maintained by us in strict confidence. If we receive a summons or subpoena that our legal counsel determines requires us to produce documents regarding the Services or testify about the Services, we agree to inform you of such summons or subpoena as soon as practical.</p>

<p style="margin-left: 20px;"><strong>i. Responding to Outside Inquiries.</strong> We may receive requests for information in our possession arising out of the Services. The requests may come from governmental agencies, courts, or other tribunals. If permitted, we may notify you of any request for information prior to responding.</p>

<!-- INITIALS BOX 2 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE SECTION 1(g-i):</p>
  </div>
  <div class="initials-capture" data-section="2" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<p style="margin-left: 20px;"><strong>j. International Tax Work.</strong> LTRS may, from time to time, use third-party service providers in serving your account. We may share confidential information about you with these service providers, but we remain committed to maintaining the confidentiality and security of your information.</p>

<p style="margin-left: 20px;"><strong>k. Penalties and Interest Charges.</strong> Federal, state, and local tax authorities impose various penalties and interest charges for non-compliance with tax laws and regulations. You, as the taxpayer, remain responsible for the payment of all taxes, penalties, and interest charges imposed by tax authorities.</p>

<p style="margin-left: 20px;"><strong>l. Disclaimer of Legal and Investment Advice.</strong> Our services under this Agreement do not constitute legal or investment advice. We recommend that you retain legal counsel and investment advisor to provide such advice.</p>

<p style="margin-left: 20px;"><strong>m. Brokerage or Investment Advisory Statements.</strong> If you provide our firm with copies of brokerage statements, we will use the information solely for the purpose described in this Agreement. We will rely on the accuracy of the information provided and will not undertake any action to verify this information.</p>

<!-- INITIALS BOX 3 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE SECTION 1(j-m):</p>
  </div>
  <div class="initials-capture" data-section="3" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<p style="margin-left: 20px;"><strong>n. Client Privilege.</strong> Internal Revenue Code §7525, Confidentiality Privileges Related to Taxpayer Communication, provides a limited confidentiality privilege applying to tax advice embodied in taxpayer communications with federally authorized tax practitioners in certain limited situations.</p>

<p style="margin-left: 20px;"><strong>o. Confidentiality.</strong> If tax returns are prepared in connection with this engagement and are filed using the married filing jointly filing status, both spouses are deemed to be clients of LTRS under the terms of this Agreement.</p>

<p style="margin-left: 20px;"><strong>p. Limitations on Oral and Email Communications.</strong> We may discuss with you our views regarding the treatment of certain items or decisions you may encounter. Any advice or information delivered orally or in an email will be based upon limited research and a limited discussion and analysis of the underlying facts.</p>

<!-- INITIALS BOX 4 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE SECTION 1(n-p):</p>
  </div>
  <div class="initials-capture" data-section="4" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<p style="margin-left: 20px;"><strong>q. Privacy Policy.</strong> In accordance with the Federal Trade Commission's Privacy Rule for Consumer Financial Information, we are required to inform you of our policy regarding the privacy of client information.</p>

<p style="margin-left: 20px;"><strong>r. Types of Nonpublic Personal Information We Collect.</strong> We collect nonpublic personal information about you that is provided to us by you or obtained by us from third parties with your authorization.</p>

<p style="margin-left: 20px;"><strong>s. Parties to Whom We Disclose Information.</strong> For current and former clients, we do not disclose any nonpublic personal information obtained during our practice except as required or permitted by law.</p>

<p style="margin-left: 20px;"><strong>t. Protecting the Confidentiality and Security of Current and Former Clients' Information.</strong> We retain records of the professional services we provide so we can better assist you with your professional needs. To guard your nonpublic personal information, we maintain physical, electronic and procedural safeguards.</p>

<p style="margin-left: 20px;"><strong>u. Electronic Data Communication and Storage.</strong> In the interest of facilitating our services to your company, we may send data over the Internet, store electronic data via computer software applications hosted remotely on the Internet. We employ measures designed to maintain data security.</p>

<!-- INITIALS BOX 5 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE SECTION 1(q-u):</p>
  </div>
  <div class="initials-capture" data-section="5" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<!-- WHAT WE WILL NOT DO -->
<h3 style="color: #6b21a8; margin-top: 30px;">What We Will Not Do</h3>

<p>Our engagement is limited to the services indicated above. We will not audit or review your financial statements. We will not verify the data you submit for accuracy or completeness. LTRS will rely on the accuracy and completeness of the documents and information you provide. We do not provide any legal services at any time.</p>

<p>You are responsible for designing and implementing controls to prevent and detect fraud, and for informing us of all known or suspected fraud impacting the Company.</p>

<!-- INITIALS BOX 6 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE LIMITATIONS:</p>
  </div>
  <div class="initials-capture" data-section="6" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<!-- WHAT WE NEED FROM YOU -->
<h3 style="color: #6b21a8; margin-top: 30px;">What We Need from You</h3>

<p>To perform our services, we will need to obtain information from your Company on a timely and periodic basis. These items include all input, such as your income tax returns for 2022, 2023, and 2024, your federal tax ID number, payroll information, employee data, 941s for qualifying quarters, and any other information we may require completing the work of this Engagement.</p>

<p>Our advice is dependent upon the timeliness, accuracy, and completeness of the information and representations that we receive from you. If information changes during the engagement, you must provide us with the updated information on a timely basis.</p>

<!-- INITIALS BOX 7 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE DATA REQUIREMENTS:</p>
  </div>
  <div class="initials-capture" data-section="7" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<!-- SECTION 2: CLIENT RESPONSIBILITIES -->
<h2 style="color: #6b21a8; margin-top: 40px; border-bottom: 2px solid #9333ea; padding-bottom: 8px;">2. CLIENT RESPONSIBILITIES</h2>

<p>Within no less than ten (10) business days following the execution of this Agreement, Client shall provide LTRS the following ("Client Supplied Data"):</p>

<p style="margin-left: 20px;"><strong>a.</strong> Payroll reports exported from the Client's payroll provider from January 2022 through December 31, 2025. Broken down per employee by each Quarter.</p>

<p style="margin-left: 20px;"><strong>b.</strong> Payroll data for 2022 broken down per employee by each Quarter in a CSV format.</p>

<p style="margin-left: 20px;"><strong>c.</strong> Payroll data for 2023 broken down per employee by each Quarter in a CSV format.</p>

<p style="margin-left: 20px;"><strong>d.</strong> Payroll data for 2024 broken down per employee by each Quarter in a CSV format.</p>

<p style="margin-left: 20px;"><strong>e.</strong> Payroll data for 2025 broken down per employee by each Quarter in a CSV format.</p>

<p style="margin-left: 20px;"><strong>f.</strong> Client's prior Quarterly 941 tax filings for the 1st quarter of 2022 through the 4th quarter of 2025.</p>

<p style="margin-left: 20px;"><strong>g.</strong> Complete the FICA Tips Tax Credit - Initial Survey deemed necessary by LTRS to perform the services outlined in the Scope of Services.</p>

<p style="margin-left: 20px;"><strong>h.</strong> In order for LTRS to intercede or monitor progress with the IRS, Client agrees to execute and submit IRS Form 8821 (Designating Release of Tax Information) to LTRS.</p>

<!-- INITIALS BOX 8 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE CLIENT RESPONSIBILITIES:</p>
  </div>
  <div class="initials-capture" data-section="8" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<p>The Client agrees that LTRS will rely on Client-supplied data and Documents to provide the Services. Client specifically warrants and represents that all Client Supplied Data and Documents are true, accurate, and correct.</p>

<p style="margin-left: 20px;"><strong>i.</strong> Client shall indemnify, defend, and hold harmless LTRS from and against any claims, losses, damages, or penalties resulting from the Client's failure to perform any Client Responsibilities set forth herein.</p>

<p style="margin-left: 20px;"><strong>j.</strong> Client warrants and represents that it shall not, directly or indirectly, interfere with, circumvent, or attempt to avoid LTRS's right to full compensation for the services provided pursuant to this Agreement.</p>

<!-- SECTION 3: PAID PREPARER -->
<h2 style="color: #6b21a8; margin-top: 40px; border-bottom: 2px solid #9333ea; padding-bottom: 8px;">3. PAID PREPARER - AUTHORIZED BY CLIENT</h2>

<p>Client acknowledges, agrees, and authorizes that LTRS is authorized by Client to be listed as a Federal Tax Return Preparer ("Paid Preparer") for the amended entity and personal return filings necessary to provide the services. Client authorizes LTRS to maintain a valid PTIN with the IRS to assist Client.</p>

<!-- INITIALS BOX 9 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO AUTHORIZE PAID PREPARER:</p>
  </div>
  <div class="initials-capture" data-section="9" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<!-- SECTION 4: FEES -->
<h2 style="color: #6b21a8; margin-top: 40px; border-bottom: 2px solid #9333ea; padding-bottom: 8px;">4. FEES FOR SERVICES / CONSIDERATION</h2>

<h3 style="color: #9333ea;">Value Price</h3>

<p><strong>FEE TIMING; NO PAYMENT AT FILING; PAYMENT UPON RECEIPT; INTEREST; IRS AUTHORIZATION</strong></p>

<p><strong>4A.1 No Payment Due at Filing.</strong> Notwithstanding anything to the contrary contained in this Agreement, under no circumstances shall Client be required to remit any payment, deposit, advance, retainer, or fee at the time any amended return, claim, or filing is prepared or submitted to the Internal Revenue Service. LTRS expressly waives any right to demand payment prior to Client's actual receipt of FICA Tips Tax Credit refund proceeds.</p>

<p><strong>4A.2 Fees Contingent on Actual Receipt of Funds.</strong> Client's obligation to pay the Fee arises solely upon Client's actual receipt—whether by check, direct deposit, or wire transfer—of the FICA Tips Tax Credit refund from the IRS. If no refund is received by Client for any reason, including IRS denial, audit disallowance, or Client withdrawal, Client owes LTRS nothing for the Services rendered under this Agreement.</p>

<p><strong>4A.3 Fee Calculation.</strong> Upon receipt of the FICA Tips Tax Credit refund, Client agrees to pay LTRS a contingent fee equal to <strong>thirty-three percent (33%)</strong> of the gross FICA Tips Tax Credit refund received (the "Fee").</p>

<!-- INITIALS BOX 10 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE FEE STRUCTURE (33% CONTINGENT):</p>
  </div>
  <div class="initials-capture" data-section="10" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<p><strong>4A.4 Payment Timing.</strong> Within five (5) business days of receiving any FICA Tips Tax Credit refund, Client shall remit the Fee to LTRS via wire transfer or certified funds to the account designated by LTRS.</p>

<p><strong>4A.5 Interest on Late Payment.</strong> Any unpaid Fee shall accrue interest at the rate of one and one-half percent (1.5%) per month (18% per annum) beginning on the sixth (6th) business day following Client's receipt of funds until fully paid.</p>

<p><strong>4A.6 Authorization for Direct IRS Deposit (Optional).</strong> To streamline payment, Client may authorize the IRS to deposit all or part of the refund directly into an account jointly controlled by Client and LTRS. Such authorization is voluntary; if Client declines, Client remains fully responsible for timely remittance of the Fee.</p>

<!-- SECTION 5: TERM AND TERMINATION -->
<h2 style="color: #6b21a8; margin-top: 40px; border-bottom: 2px solid #9333ea; padding-bottom: 8px;">5. TERM AND TERMINATION</h2>

<p>This Agreement shall be effective as of <span class="auto-fill" data-field="currentDate">[DATE]</span> and shall continue until terminated. Either party may terminate this Agreement upon thirty (30) days written notice. Upon termination, Client remains responsible for payment of all Fees for Services rendered prior to termination.</p>

<!-- INITIALS BOX 11 -->
<div class="initials-block" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #ffc107; display: flex; align-items: center; gap: 20px;">
  <div style="flex: 1;">
    <p style="margin: 0; font-weight: bold; color: #856404;">INITIAL HERE TO ACKNOWLEDGE TERM & TERMINATION:</p>
  </div>
  <div class="initials-capture" data-section="11" style="width: 80px; height: 50px; border: 2px dashed #9333ea; border-radius: 6px; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
    <span style="color: #9333ea; font-size: 12px;">[INITIALS]</span>
  </div>
</div>

<!-- SECTION 6: GOVERNING LAW -->
<h2 style="color: #6b21a8; margin-top: 40px; border-bottom: 2px solid #9333ea; padding-bottom: 8px;">6. GOVERNING LAW AND DISPUTE RESOLUTION</h2>

<p>This Agreement shall be governed by and construed in accordance with the laws of the State of Arizona. Any disputes arising from this Agreement shall be resolved through binding arbitration in Maricopa County, Arizona.</p>

<hr style="border: 3px solid #6b21a8; margin: 50px 0;">

<!-- SIGNATURE SECTION -->
<h2 style="color: #6b21a8; text-align: center; margin-bottom: 30px;">SIGNATURE AND ACKNOWLEDGMENT</h2>

<div style="background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); padding: 30px; border-radius: 12px; margin: 30px 0; border: 3px solid #6b21a8;">
  <p style="font-size: 15px; margin-bottom: 25px; text-align: center;">By signing below, I acknowledge that I have read, understood, and agree to all terms and conditions set forth in this FICA Tips Tax Credit Services Agreement. I understand that this is a legally binding document.</p>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
    <div>
      <p style="margin: 8px 0;"><strong>Full Legal Name:</strong></p>
      <div style="background: #fff; padding: 12px; border-radius: 6px; border: 2px solid #9333ea;">
        <span class="auto-fill" data-field="primaryOwner">[SIGNER NAME - See Form Above]</span>
      </div>
    </div>
    <div>
      <p style="margin: 8px 0;"><strong>Title:</strong></p>
      <div style="background: #fff; padding: 12px; border-radius: 6px; border: 2px solid #9333ea;">
        <span class="auto-fill" data-field="primaryTitle">[TITLE - See Form Above]</span>
      </div>
    </div>
  </div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
    <div>
      <p style="margin: 8px 0;"><strong>Company:</strong></p>
      <div style="background: #fff; padding: 12px; border-radius: 6px; border: 2px solid #9333ea;">
        <span class="auto-fill" data-field="clientCompany">[COMPANY - See Form Above]</span>
      </div>
    </div>
    <div>
      <p style="margin: 8px 0;"><strong>Email Address:</strong></p>
      <div style="background: #fff; padding: 12px; border-radius: 6px; border: 2px solid #9333ea;">
        <span class="auto-fill" data-field="clientEmail">[SIGNER EMAIL - See Form Above]</span>
      </div>
    </div>
  </div>
  
  <div style="margin-bottom: 25px;">
    <p style="margin: 8px 0;"><strong>Agreement Date:</strong></p>
    <div style="background: #fff; padding: 12px; border-radius: 6px; border: 2px solid #9333ea;">
      <span class="auto-fill" data-field="currentDate">[EFFECTIVE DATE - See Form Above]</span>
    </div>
  </div>
  
  <div>
    <p style="margin: 8px 0;"><strong>Client Signature:</strong></p>
    <div class="signature-capture" style="background: #fff; min-height: 100px; border-radius: 8px; border: 3px dashed #9333ea; display: flex; align-items: center; justify-content: center; cursor: pointer;">
      <span style="color: #9333ea; font-size: 14px;">[SIGNATURE - Use Signature Pad Below]</span>
    </div>
  </div>
</div>

<!-- LTRS SIGNATURE BLOCK -->
<div style="background: #f8f4ff; padding: 25px; border-radius: 12px; margin: 30px 0; border: 2px solid #6b21a8;">
  <h3 style="color: #6b21a8; margin: 0 0 15px 0;">Legacy Tax & Resolution Services, LLC</h3>
  <p style="margin: 8px 0;"><strong>By:</strong> Authorized Representative</p>
  <p style="margin: 8px 0;"><strong>Title:</strong> Managing Member</p>
  <p style="margin: 8px 0;"><strong>Date:</strong> <span class="auto-fill" data-field="currentDate">[DATE]</span></p>
</div>

<div style="text-align: center; margin-top: 40px; padding: 25px; background: #f0f0f0; border-radius: 8px;">
  <p style="font-size: 12px; color: #666; margin: 0;">This document is electronically signed and legally binding upon submission.</p>
  <p style="font-size: 12px; color: #666; margin: 8px 0 0 0;"><strong>Legacy Tax & Resolution Services, LLC</strong></p>
  <p style="font-size: 12px; color: #666; margin: 4px 0 0 0;">3961 E. Chandler Blvd #111-301, Phoenix, AZ 85048</p>
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

    // Check and create/update FICA Tips Tax Credit Agreement template
    const existingFicaAgreement = await db.select().from(csuContractTemplates)
      .where(eq(csuContractTemplates.name, "FICA Tips Tax Credit Agreement")).limit(1);
    
    if (existingFicaAgreement.length === 0) {
      await db.insert(csuContractTemplates).values({
        name: "FICA Tips Tax Credit Agreement",
        description: "FICA Tips Tax Credit Services Agreement with Legacy Tax & Resolution Services",
        content: FICA_TIPS_AGREEMENT_CONTENT,
        isActive: true,
      });
      console.log("[seed] Created FICA Tips Tax Credit Agreement template");
    } else {
      await db.update(csuContractTemplates)
        .set({ 
          content: FICA_TIPS_AGREEMENT_CONTENT,
          description: "FICA Tips Tax Credit Services Agreement with Legacy Tax & Resolution Services"
        })
        .where(eq(csuContractTemplates.name, "FICA Tips Tax Credit Agreement"));
      console.log("[seed] Updated FICA Tips Tax Credit Agreement template");
    }

    console.log("[seed] Payzium seed data complete");
  } catch (error) {
    console.error("[seed] Error seeding Payzium data:", error);
  }
}

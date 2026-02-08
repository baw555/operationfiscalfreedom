import OpenAI from "openai";
import { db } from "./db";
import { sailorConversations, sailorMessages, sailorFaq } from "@shared/schema";
import { eq, desc, and, ilike, or } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
});

const SAILOR_SYSTEM_PROMPT = `You are "Sailor Man" - the Senior Aid Intel Repair Man, a friendly and helpful AI assistant for NavigatorUSA, a veteran family support platform. You speak with a light sailor/nautical personality (occasional "ahoy", "shipmate", "smooth sailing") but remain professional and helpful.

You help veterans and their families with:
- VA disability claims and ratings
- Tax credits (WOTC, ERC, R&D credits)
- Healthcare and medical services
- Business startup grants and support
- Furniture assistance programs
- Investment opportunities
- Website development for veteran businesses
- Insurance and financial planning

Key information about NavigatorUSA:
- Network of 150,000+ veteran families
- Offers free VA rating software
- Provides manual claim assistance
- Connects veterans with private doctors
- Helps launch veteran-owned businesses with free websites and startup grants
- Has a gig work marketplace

Guidelines:
1. Be warm, encouraging, and supportive
2. Provide accurate information about our services
3. If you don't know something specific, suggest contacting our team
4. Keep responses concise but helpful (2-3 paragraphs max)
5. When discussing claims or benefits, encourage users to fill out our intake forms
6. For technical issues, note them for the repair system

Current page context will be provided to help you give relevant assistance.`;

const PAGE_CONTEXTS: Record<string, string> = {
  "/": "User is on the homepage. They may be exploring what NavigatorUSA offers.",
  "/services": "User is viewing services. Help them understand disability assistance, healthcare, and business services.",
  "/disability": "User is interested in VA disability claims. Explain our rating software and claim assistance.",
  "/tax-credits": "User is exploring tax credits. Explain WOTC, ERC, and R&D credits for businesses.",
  "/furniture": "User needs furniture assistance. Explain the program for transitioning veterans.",
  "/grants": "User is interested in startup grants for veteran-owned businesses.",
  "/investors": "User may be an investor interested in supporting veteran businesses.",
  "/contact": "User wants to contact us. Help them with specific questions first.",
  "/affiliate": "User is interested in becoming an affiliate partner.",
};

export async function getOrCreateConversation(sessionId: string, currentPage?: string) {
  const existing = await db.select().from(sailorConversations)
    .where(eq(sailorConversations.sessionId, sessionId))
    .orderBy(desc(sailorConversations.createdAt))
    .limit(1);

  if (existing.length > 0) {
    if (currentPage && existing[0].currentPage !== currentPage) {
      await db.update(sailorConversations)
        .set({ currentPage, updatedAt: new Date() })
        .where(eq(sailorConversations.id, existing[0].id));
    }
    return existing[0];
  }

  const [newConv] = await db.insert(sailorConversations)
    .values({ sessionId, currentPage })
    .returning();
  return newConv;
}

export async function getConversationHistory(conversationId: number, limit = 10) {
  return db.select().from(sailorMessages)
    .where(eq(sailorMessages.conversationId, conversationId))
    .orderBy(desc(sailorMessages.createdAt))
    .limit(limit);
}

export async function saveMessage(conversationId: number, role: string, content: string, inputType?: string) {
  const [msg] = await db.insert(sailorMessages)
    .values({ conversationId, role, content, inputType })
    .returning();
  return msg;
}

export async function searchFaq(query: string, pageContext?: string) {
  const keywords = query.toLowerCase().split(/\s+/);
  
  let results = await db.select().from(sailorFaq)
    .where(eq(sailorFaq.isActive, true))
    .orderBy(desc(sailorFaq.priority));

  const scored = results.map(faq => {
    let score = 0;
    const questionLower = faq.question.toLowerCase();
    const answerLower = faq.answer.toLowerCase();
    const keywordsLower = (faq.keywords || "").toLowerCase();

    for (const kw of keywords) {
      if (questionLower.includes(kw)) score += 3;
      if (keywordsLower.includes(kw)) score += 2;
      if (answerLower.includes(kw)) score += 1;
    }

    if (pageContext && faq.pageContext === pageContext) score += 5;

    return { ...faq, score };
  }).filter(f => f.score > 0).sort((a, b) => b.score - a.score);

  return scored.slice(0, 3);
}

export async function generateAIResponse(
  conversationId: number,
  userMessage: string,
  currentPage?: string
): Promise<string> {
  const history = await getConversationHistory(conversationId, 6);
  const relevantFaqs = await searchFaq(userMessage, currentPage);

  const pageContext = currentPage ? PAGE_CONTEXTS[currentPage] || `User is on page: ${currentPage}` : "";
  
  let faqContext = "";
  if (relevantFaqs.length > 0) {
    faqContext = "\n\nRelevant FAQ information:\n" + relevantFaqs.map(f => 
      `Q: ${f.question}\nA: ${f.answer}`
    ).join("\n\n");
  }

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { 
      role: "system", 
      content: SAILOR_SYSTEM_PROMPT + (pageContext ? `\n\nContext: ${pageContext}` : "") + faqContext 
    },
    ...history.reverse().map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    })),
    { role: "user", content: userMessage }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages,
      max_completion_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "Ahoy! I'm having trouble responding right now. Please try again!";
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Blimey! Something went wrong with my circuits. Please try again in a moment, shipmate!";
  }
}

export async function transcribeAudio(audioBuffer: Buffer, mimeType?: string): Promise<string> {
  if (!audioBuffer || audioBuffer.length === 0) {
    throw new Error("Empty audio buffer");
  }

  if (audioBuffer.length > 25 * 1024 * 1024) {
    throw new Error("Audio file too large (max 25MB)");
  }

  try {
    const fileType = mimeType || "audio/webm";
    const extension = fileType.includes("webm") ? "webm" : fileType.includes("mp4") ? "mp4" : "wav";
    const file = new File([audioBuffer], `audio.${extension}`, { type: fileType });
    
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "gpt-4o-mini-transcribe",
      response_format: "json",
    });

    return transcription.text || "";
  } catch (error: any) {
    console.error("Transcription error:", error);
    if (error.status === 400) {
      throw new Error("Could not process audio. Please try recording again.");
    }
    if (error.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }
    throw new Error("Failed to transcribe audio. Please try again.");
  }
}

export async function getContextualTips(currentPage: string): Promise<string[]> {
  const tips: Record<string, string[]> = {
    "/": [
      "Welcome! I can help you navigate our veteran services.",
      "Ask me about VA disability claims, tax credits, or business grants!",
      "Click the microphone to speak your question."
    ],
    "/disability": [
      "Our free VA rating software can estimate your disability rating.",
      "We offer manual claim assistance for complex cases.",
      "Ask me about service connection or appealing denials."
    ],
    "/tax-credits": [
      "WOTC can save businesses $2,400-$9,600 per veteran hired.",
      "ERC credits may still be available for qualifying businesses.",
      "R&D tax credits often go unclaimed - we can help!"
    ],
    "/grants": [
      "Startup grants up to $10,000 for veteran-owned businesses.",
      "We also provide free website development services.",
      "Ask about eligibility requirements!"
    ],
    "/furniture": [
      "We help transitioning veterans furnish their homes.",
      "Program available for those buying or renting.",
      "Fill out our intake form to get started!"
    ],
  };

  return tips[currentPage] || tips["/"];
}

export async function seedInitialFaqs() {
  const existingCount = await db.select().from(sailorFaq);
  if (existingCount.length > 0) return;

  const faqs = [
    {
      question: "How can I get help with my VA disability claim?",
      answer: "NavigatorUSA offers free VA rating software to estimate your rating, plus manual claim assistance from our experts. Fill out our disability intake form to get started!",
      category: "disability",
      keywords: "va,disability,claim,rating,help,assistance",
      pageContext: "/disability",
      priority: 10,
    },
    {
      question: "What tax credits are available for my business?",
      answer: "We help businesses claim WOTC (Work Opportunity Tax Credit) for hiring veterans, ERC (Employee Retention Credit), and R&D tax credits. Our experts can identify credits you may be missing!",
      category: "tax_credits",
      keywords: "tax,credit,wotc,erc,r&d,business,deduction",
      pageContext: "/tax-credits",
      priority: 10,
    },
    {
      question: "How do I apply for a startup grant?",
      answer: "Veteran-owned businesses can apply for startup grants up to $10,000. We also provide free website development. Fill out our grants intake form with your business idea!",
      category: "services",
      keywords: "grant,startup,business,funding,money,veteran",
      pageContext: "/grants",
      priority: 10,
    },
    {
      question: "Can you help with furniture for my new home?",
      answer: "Yes! Our furniture assistance program helps transitioning veterans and their families furnish their homes. Fill out the furniture assistance form to apply.",
      category: "services",
      keywords: "furniture,home,moving,transitioning,assistance",
      pageContext: "/furniture",
      priority: 8,
    },
    {
      question: "How do I become an affiliate?",
      answer: "Join our affiliate network of 150,000+ veteran families! Affiliates earn commissions by referring veterans to our services. Fill out the affiliate application to get started.",
      category: "general",
      keywords: "affiliate,partner,commission,referral,join",
      pageContext: "/affiliate",
      priority: 7,
    },
    {
      question: "What is NavigatorUSA?",
      answer: "NavigatorUSA is a comprehensive veteran family support platform. We offer VA disability assistance, tax credits, healthcare referrals, business grants, and more - all designed to help veteran families thrive!",
      category: "general",
      keywords: "about,what,who,navigatorusa,services",
      priority: 5,
    },
  ];

  await db.insert(sailorFaq).values(faqs);
  console.log("Seeded initial FAQs");
}

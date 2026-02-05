import { getResendClient } from "../server/resendClient";
import { db } from "../server/db";
import { sailorConversations, sailorMessages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

async function sendConversations() {
  try {
    console.log("Fetching conversations...");
    const conversations = await db.select().from(sailorConversations).orderBy(desc(sailorConversations.createdAt));
    
    let emailContent = `<h1 style="color: #1A365D;">Sailor Man AI Chat Conversations</h1>
    <p>Export generated on ${new Date().toLocaleString()}</p>
    <hr/>`;
    
    for (const conv of conversations) {
      const messages = await db.select().from(sailorMessages)
        .where(eq(sailorMessages.conversationId, conv.id))
        .orderBy(sailorMessages.createdAt);
      
      emailContent += `
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        <h3 style="color: #1A365D;">Session: ${conv.sessionId}</h3>
        <p><strong>Page:</strong> ${conv.currentPage || '/'}</p>
        <p><strong>Started:</strong> ${conv.createdAt}</p>
        <div style="margin-top: 10px;">`;
      
      for (const msg of messages) {
        const bgColor = msg.role === 'user' ? '#e3f2fd' : '#f5f5f5';
        const label = msg.role === 'user' ? 'User' : 'Sailor Man';
        emailContent += `
          <div style="background: ${bgColor}; padding: 10px; margin: 5px 0; border-radius: 5px;">
            <strong>${label}:</strong> ${msg.content}
            <br/><small style="color: #666;">${msg.createdAt} ${msg.inputType ? `(${msg.inputType})` : ''}</small>
          </div>`;
      }
      
      emailContent += `</div></div>`;
    }
    
    if (conversations.length === 0) {
      emailContent += '<p>No conversations found.</p>';
    }
    
    console.log(`Found ${conversations.length} conversation(s). Sending email...`);
    
    const { client, fromEmail } = await getResendClient();
    const result = await client.emails.send({
      from: fromEmail,
      to: 'infoservicesbhi@gmail.com',
      subject: 'NavigatorUSA - Sailor Man Chat Conversations Export',
      html: emailContent
    });
    
    console.log('Email sent successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error sending conversations:', error);
    process.exit(1);
  }
}

sendConversations();

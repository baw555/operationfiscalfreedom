import { sendEmailWithRetry } from "../emailWithRetry";

type EmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendMail(args: EmailArgs) {
  return sendEmailWithRetry({
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });
}

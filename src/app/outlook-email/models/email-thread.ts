import { EmailMessage } from './email-message';

export interface EmailThread {
  threadId: string;
  subject: string;
  replyCount: number;
  messages: EmailMessage[];
}

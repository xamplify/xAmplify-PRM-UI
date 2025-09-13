import { EmailMessage } from './email-message';

export class EmailThread {
  threadId: string;
  subject: string;
  replyCount: number;
  messages: EmailMessage[];

  lastReceivedDate:string;
}

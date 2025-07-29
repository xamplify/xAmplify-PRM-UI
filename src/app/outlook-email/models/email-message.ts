export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  receivedDate: Date;
}

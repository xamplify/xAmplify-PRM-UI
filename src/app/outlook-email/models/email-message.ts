export class EmailMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  receivedDate: Date;
  attachments = [];
  bodyContent:string;
}

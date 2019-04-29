import { User } from '../../core/models/user';
import { EmailTemplate } from './email-template';

export class EmailSpamScore {
    id: number;
    score: string;
    subject: string;
    toEmail: string;
    user: User;
    emailTemplate: EmailTemplate;
    jsonResponse: any;
}
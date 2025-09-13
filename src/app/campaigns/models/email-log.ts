export class EmailLog {
    id: number;
    userId: number;
    videoId: number;
    actionId: number;
    campaignId: number;
    time: Date;
    url: string;
    deviceType: string;
    ipAddress: string;
    countryCode: string;
    replyId: number;
    urlId: number;
    openCount: number;
    firstName: string;
    lastName: string;
    emailId: string;
    os: string;
    city: string;
    country: string;
    isp: string;
    state: string;
    zip: string;
    latitude: string;
    longitude: string;
    subject: string;
    emailActionCount: number;
    utcTimeString : string;

    emailLogHistory: Array<EmailLog>;
    isExpand: boolean = false;
    
}
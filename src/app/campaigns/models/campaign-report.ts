export class CampaignReport {
    id: number;
    userId: number;
    campaigns: string;
    campaignReportOption: string = 'RECENT';
    response: string;
    responseMessage: string;
}
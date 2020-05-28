import { EmailLog } from './email-log';
export class CampaignReport {
    id: number;
    userId: number;
    campaigns: string;
    campaignReportOption: string = 'RECENT';
    response: string;
    responseMessage: string;
    selectedPartnerId: number =0;

    emailOpenCount: number = 0;
    emailClickedCount: number = 0;
    emailSentCount: number = 0;
    usersWatchCount: number = 0;
    totalUniqueWatchCount: number = 0;
    dataShareClickedUrlsCountForVendor:number = 0;
    
     smsOpenCount: number = 0;
    smsClickedCount: number = 0;
    smsSentCount:number =0;
    smsSentSuccessCount = 0;
    smsSentFailureCount = 0;

    lifetimeViewsCount: number = 0;
    thisMonthViewsCount: number = 0;
    todayViewsCount: number = 0;

    emailSentList: any;
    usersWatchList: any;
    totalUsersWatchList: any;
    totalWatchedList: any;

    emailActionType: string;
    emailLogs: Array<EmailLog>;
    totalEmailLogs: Array<EmailLog>;
    totalEmailActionList: any;

    totalYesCount: number = 0;
    totalNoCount: number = 0;
    totalMayBeCount: number = 0;
    totalNotYetRespondedCount: number = 0;
    totalEmailOpenCount: number = 0;
    totalAdditionalCount: number = 0;
    totalInvitiesCount: number = 0;
    totalLeadsCount:number = 0;
    totalAttendeesCount:number = 0;

    partnersYesCount: number = 0;
    partnersNoCount: number = 0;
    partnersEmailOpenedCount: number = 0;
    partnersTotalInvitiesCount: number = 0;
    partnersMayBeCount: number = 0;
    partnersNotYetRespondedCount: number = 0;
    additionalCount: number = 0;

    redistributionTotalYesCount: number = 0;
    redistributionTotalNoCount: number = 0;
    redistributionTotalMayBeCount: number = 0;
    redistributionTotalNotYetRespondedCount: number = 0;
    redistributionTotalEmailOpenCount: number = 0;
    redistributionTotalInvitiesCount: number = 0;
    redistributionTotalAdditionalCount: number = 0;
    redistributionTotalLeadsCount: number = 0;

    selectedPartnerFirstName: string;
    selectedPartnerLastName: string;
    selectedPartnerEmailId: string;
    selectedPartnerUserId: any;
    
    yesLeadCount: number = 0;
    noLeadCount: number = 0;
    maybeLeadCount: number = 0;
    
    leadAdditionalCount: number = 0;
    partnerLeadAdditionalCount: number = 0;
    
    yesPartnerLeadCount: number = 0;
    noPartnerLeadCount: number = 0;
    maybePartnerLeadCount: number = 0;
    totalPartnerLeadsCount:number = 0;
    
    allPartnersYesCount: number = 0;
    allPartnersNoCount: number = 0;   
    allPartnersMayBeCount: number = 0;
    allPartnersAdditionalCount: number = 0;

}

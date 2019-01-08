import { Pagination } from '../../core/models/pagination';
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

    lifetimeViewsCount: number = 0;
    thisMonthViewsCount: number = 0;
    todayViewsCount: number = 0;

    emailSentList: any;
    usersWatchList: any;
    totalWatchedList: any;

    emailActionType: string;
    emailLogs: Array<EmailLog>;
    totalEmailActionList: any;

    totalYesCount: number = 0;
    totalNoCount: number = 0;
    totalMayBeCount: number = 0;
    totalNotYetRespondedCount: number = 0;
    totalEmailOpenCount: number = 0;
    totalAdditionalCount: number = 0;

    partnersYesCount: number = 0;
    partnersNoCount: number = 0;
    partnersEmailOpenedCount: number = 0;
    partnersMayBeCount: number = 0;
    partnersNotYetRespondedCount: number = 0;
    additionalCount: number = 0;

    redistributionTotalYesCount: number = 0;
    redistributionTotalNoCount: number = 0;
    redistributionTotalMayBeCount: number = 0;
    redistributionTotalNotYetRespondedCount: number = 0;
    redistributionTotalEmailOpenCount: number = 0;

    selectedPartnerFirstName: string;
    selectedPartnerLastName: string;
    selectedPartnerEmailId: string;
    selectedPartnerUserId: any;

}
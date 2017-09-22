import { Pagination } from '../../core/models/pagination';
export class CampaignReport {
    id: number;
    userId: number;
    campaigns: string;
    campaignReportOption: string = 'RECENT';
    response: string;
    responseMessage: string;

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

    emailActionType: string;
    emailActionList: any;
}
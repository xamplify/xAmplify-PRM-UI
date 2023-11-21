export class PartnerJourneyRequest {
    partnerCompanyId: number;  
    loggedInUserId: number;  
    teamMemberUserId: number;  
    trackTypeFilter: any;
    assetTypeFilter: any;
    detailedAnalytics = false;
    selectedPartnerCompanyIds: any[] = [];
    partnerTeamMemberGroupFilter = false;
}

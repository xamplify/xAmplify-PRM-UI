export class TeamMemberAnalyticsRequest {
    partnerCompanyId: number;
    loggedInUserId: number;
    teamMemberUserId: number;
    vendorCompanyId: number;
    trackTypeFilter: any;
    selectedVendorCompanyIds: any[] = [];
    selectedTeamMemberIds: any[] = [];
    vanityUrlFilter: boolean;
    vendorCompanyProfileName: string;
}

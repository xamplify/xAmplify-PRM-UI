export class PartnerCompanyMetricsDto {
    totalLeads = 0;
    totalDeals = 0;
    totalDealContacts = 0;
    totalTeamMembers = 0;
    totalRedistributedCampaigns = 0;
    totalCampaignLeads = 0;
    totalCampaignDeals = 0;
    error = false;
    apiLoading = false;
    errorMessage = "";

    id: number = 0;
    firstName: string = '';
    lastName: string = '';
    companyName: string = '';
    emailId: string = '';
    contactUploadLimit: number = 0;
    uploadedContactCount: number = 0 ;
    exceeededContactCount: number = 0;
    companyId: number = 0;
    
}

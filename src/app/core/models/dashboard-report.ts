import { DashboardStatesReport } from "app/dashboard/models/dashboard-states-report";

export class DashboardReport {
    genderDemographicsMale  = 0;
    genderDemographicsFemale  = 0;
    genderDemographicsTotal  = 0;

    totalContacts  = 0;
    totalTeamMembers = 0;
    totalUploadedvideos  = 0;

    totalEmailOpenedCount  = 0;
    totalEmailClickedCount  = 0;
    totalEmailWatchedCount  = 0;

    emailLogList: DashboardStatesReport[];
    allEmailOpenLogList: any;
    allEmailClickedLogList: any;
    allEmailWatchedLogList: any;

    downloadEmailLogList: any;

    totalViews  = 0;
    toalEmailTemplates  = 0;
    totalCreatedCampaigns  = 0;
    totalSocialAccounts  = 0;
    totalCompanyPartnersCount = 0;
    vendorsCount = 0;
}

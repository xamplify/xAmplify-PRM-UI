import { Component, OnInit, OnDestroy } from '@angular/core';
import { Properties } from '../../common/models/properties';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DashboardService } from '../dashboard.service';

import { UserDefaultPage } from '../../core/models/user-default-page';
import { DashboardReport } from '../../core/models/dashboard-report';
declare var $:any;

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    providers: [Properties]
})
export class WelcomeComponent implements OnInit, OnDestroy {

    userDefaultPage: UserDefaultPage;
    dashboardReport: DashboardReport;
    loggedInUserId: number;
    hasVideoRole = false;
    hasContactRole = false;
    hasCampaignRole = false;
    hasEmailTemplateRole = false;
    hasStatsRole = false;
    hasSocialStatusRole = false;
    contactOrPartnerLink:string ="";
    constructor(
        private userService: UserService,
        public authenticationService: AuthenticationService,
        private referenceService: ReferenceService,
        private dashboardService: DashboardService,
        public properties: Properties
    ) {
        this.dashboardReport = new DashboardReport();
        this.userDefaultPage = new UserDefaultPage();
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
        this.hasContactRole = this.referenceService.hasRole(this.referenceService.roles.contactsRole);
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.hasEmailTemplateRole = this.referenceService.hasRole(this.referenceService.roles.emailTemplateRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roles.statsRole);
        this.hasSocialStatusRole = this.referenceService.hasRole(this.referenceService.roles.socialShare);

        if(authenticationService.module.isVendor){
            this.contactOrPartnerLink =  "/home/partners/manage";
        }else{
           this.contactOrPartnerLink =  "/home/contacts/manage";
        }

    }

    getDefaultPage(userId: number) {
        this.userService.getUserDefaultPage(userId)
            .subscribe(
                data => {
                    try {
                        if (data === 'welcome' || data['_body'].includes('welcome')) {
                            this.userDefaultPage.isCurrentPageDefaultPage = true;
                            this.referenceService.userDefaultPage = 'WELCOME';
                        }
                    } catch (error) {
                        console.log('data undefined in welcome page');
                    }
                },
                error => console.log(error),
                () => { }
            );
    }
    setWelcomeAsDefaultPage(event: any) {
        this.referenceService.userDefaultPage = event ? 'WELCOME' : 'DASHBOARD';
        this.userService.setUserDefaultPage(this.authenticationService.getUserId(), this.referenceService.userDefaultPage)
            .subscribe(
                data => {
                    this.userDefaultPage.isCurrentPageDefaultPage = event;
                    this.userDefaultPage.responseType = 'SUCCESS';
                    this.userDefaultPage.responseMessage = this.properties.PROCESS_REQUEST_SUCCESS;
                },
                error => {
                    this.userDefaultPage.responseType = 'ERROR';
                    this.userDefaultPage.responseMessage = this.properties.PROCESS_REQUEST_ERROR;
                },
                () => { }
            );
    }

    dashboardReports(loggedInUserId: number) {
        this.dashboardService.loadDashboardReportsCount(this.loggedInUserId)
            .subscribe(
                data => {
                  this.dashboardReport.totalViews = data.totalVideoViewsCount;
                  this.dashboardReport.totalContacts = data.totalcontactsCount;
                  this.dashboardReport.totalTeamMembers = data.totalTeamMembersCount;
                  this.dashboardReport.totalUploadedvideos = data.totalVideosCount;
                  this.dashboardReport.toalEmailTemplates = data.totalEmailTemplatesCount;
                  this.dashboardReport.totalCreatedCampaigns = data.totalCampaignsCount;
                  this.dashboardReport.totalSocialAccounts = data.totalSocialConnectionsCount;
                  this.referenceService.partnerCount = this.dashboardReport.totalCompanyPartnersCount = data.totalCompanyPartnersCount;
                },
                error => console.log(error),
                () => console.log('dashboard reports counts completed')
            );
    }

    ngOnInit() {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.getDefaultPage(this.loggedInUserId);
        this.dashboardReports(this.loggedInUserId);
    }
    ngOnDestroy(){
      $('#myModal').modal('hide');
    }
}

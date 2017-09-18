import { Component, OnInit } from '@angular/core';

import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DashboardService } from '../dashboard.service';

import { UserDefaultPage } from '../../core/models/user-default-page';
import { DashboardReport } from '../../core/models/dashboard-report';

@Component( {
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
    
    userDefaultPage: UserDefaultPage;
    dashboardReport: DashboardReport;
    loggedInUserId: number;

    constructor( private userService: UserService, private authenticationService: AuthenticationService, 
            private referenceService: ReferenceService, private dashboardService: DashboardService ) {
        this.dashboardReport = new DashboardReport();
        this.userDefaultPage = new UserDefaultPage();
    }
    
    getDefaultPage( userId: number ) {
        this.userService.getUserDefaultPage( userId )
            .subscribe(
            data => {
                if(data['_body'].includes('welcome')){
                    this.userDefaultPage.isCurrentPageDefaultPage = true;
                    this.referenceService.userDefaultPage = 'WELCOME';
                }
            },
            error => console.log( error ),
            () => { }
            );
    }
    setWelcomeAsDefaultPage( event: any ) {
        this.referenceService.userDefaultPage = event ?  'WELCOME': 'DASHBOARD';
        this.userService.setUserDefaultPage(this.authenticationService.getUserId(), this.referenceService.userDefaultPage)
            .subscribe(
            data => {
                this.userDefaultPage.isCurrentPageDefaultPage = event;
                this.userDefaultPage.responseType = 'SUCCESS';
                this.userDefaultPage.responseMessage = 'Your setting has been saved successfully';
            },
            error => {
                this.userDefaultPage.responseType = 'ERROR';
                this.userDefaultPage.responseMessage = 'an error occurred while processing your request';
            },
            () => { }
            );
    }
    
    dashboardReports(loggedInUserId: number){
        this.dashboardService.loadDashboardReportsCount(this.loggedInUserId)
            .subscribe(
            data => {
                this.dashboardReport.totalViews = data.totalVideoViewsCount;
                this.dashboardReport.totalContacts = data.totalcontactsCount;
                this.dashboardReport.totalUploadedvideos = data.totalVideosCount;
                this.dashboardReport.toalEmailTemplates = data.totalEmailTemplatesCount;
                this.dashboardReport.totalCreatedCampaigns = data.totalCampaignsCount;
                this.dashboardReport.totalSocialAccounts = data.totalSocialConnectionsCount;
            },
            error => console.log(error),
            () => console.log("dashboard reports counts completed")
            );
    
    }

    ngOnInit() {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.getDefaultPage(this.loggedInUserId);
        this.dashboardReports(this.loggedInUserId);
    }

}

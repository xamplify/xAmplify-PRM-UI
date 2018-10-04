import { Component, OnInit, OnDestroy } from '@angular/core';
import { Properties } from '../../common/models/properties';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';

import { UserDefaultPage } from '../../core/models/user-default-page';
import { DashboardReport } from '../../core/models/dashboard-report';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { DomSanitizer } from '@angular/platform-browser';

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
    vendor_welcome_text = {
        "videos": "Upload your content and you’ll soon be ready for primetime.",
        "contacts": "Add, segment, manage, and edit the members of your Strategic Network.",
        "campaigns": "Easily automate your audience’s digital journey.",
        "templates": "Design beautiful, responsive email  templates that communicate effectively.",
        "socialMedia": "Up your social game and coordinate your message across all of your social media accounts.",
        "analytics": "Manage, monitor, and measure various aspects of your campaigns and your partners."
    };

    partner_welcome_text = {
        "videos": "Check out the shareable content you received from your Strategic Alliances.",
        "contacts": "Add, segment, manage, and edit your customers and leads.",
        "campaigns": "Easily automate your audience’s digital journey.",
        "templates": "Browse through the email templates that your Strategic Alliances have provided.",
        "socialMedia": "Up your social game and coordinate your message across all of your social media accounts.",
        "analytics": "Manage, monitor, and measure various aspects of your campaigns."
    }
    welcome_text: any;
    videoUrl: any;
    uploadVideoUrl = 'https://xamplify.io/embed/2B4Iiu';
    addPartnerCreateUrl = 'https://xamplify.io/embed/Kxdzr3';
    addTeamMemberUrl = 'https://xamplify.io/embed/spPumv';
    createEmailTemplateUrl = 'https://xamplify.io/embed/ONlGz7';
    createCampaignUrl = 'https://xamplify.io/embed/5SxI8V';
    redistributeCampaignUrl='https://xamplify.io/embed/h1Y6O9';
    addContactsUrl = 'https://xamplify.io/embed/epPjw1';

    constructor(
        private userService: UserService,
        public authenticationService: AuthenticationService,
        private referenceService: ReferenceService,
        public properties: Properties, public xtremandLogger:XtremandLogger,
        public sanitizer:DomSanitizer
    ) {
        this.dashboardReport = new DashboardReport();
        this.userDefaultPage = new UserDefaultPage();
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
        this.hasContactRole = this.referenceService.hasRole(this.referenceService.roles.contactsRole);
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.hasEmailTemplateRole = this.referenceService.hasRole(this.referenceService.roles.emailTemplateRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roles.statsRole);
        this.hasSocialStatusRole = this.referenceService.hasRole(this.referenceService.roles.socialShare);

        if(authenticationService.module.isVendor || authenticationService.isAddedByVendor){
            this.contactOrPartnerLink =  "/home/partners/manage";
        }else{
           this.contactOrPartnerLink =  "/home/contacts/manage";
        }

    }
    showHowToVideo(url){
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      $('#myModal').modal('show');
    }
    getDefaultPage(userId: number) {
      try{
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
                error => {
                  this.xtremandLogger.error(error);
                  this.xtremandLogger.errorPage(error);},
                () => { }
            );
          }catch(error){ this.xtremandLogger.error(error);
            this.xtremandLogger.errorPage(error); }
    }
    setWelcomeAsDefaultPage(event: any) {
      try{
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
          }catch(error){ console.log(error);}
    }

    ngOnInit() {
      try{
        this.loggedInUserId = this.authenticationService.getUserId();
        this.getDefaultPage(this.loggedInUserId);
        this.welcome_text = this.authenticationService.isOnlyPartner() ? this.partner_welcome_text: this.vendor_welcome_text;
      }catch(error){ console.log(error);this.xtremandLogger.error(error);
        this.xtremandLogger.errorPage(error);}
  }
    ngOnDestroy(){
      $('#myModal').modal('hide');
    }

}

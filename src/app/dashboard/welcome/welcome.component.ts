import { Component, OnInit, OnDestroy } from '@angular/core';
import { Properties } from '../../common/models/properties';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { UserDefaultPage } from '../../core/models/user-default-page';
import { DashboardReport } from '../../core/models/dashboard-report';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VideoFileService } from '../../videos/services/video-file.service';
import { CustomResponse } from '../../common/models/custom-response';
import { DealsService } from 'app/deals/services/deals.service';
import { EnvService } from 'app/env.service';
import { CustomSkin } from '../models/custom-skin';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { Roles } from 'app/core/models/roles';


declare var $:any;

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css'],
    providers: [Properties, DealsService]
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
    welcomeVideoInfo: any;
    showDiv = false;
    applyFilter = true;
    ngxLoading = false;
    vendor_welcome_text = {
        "videos": "Upload your content and you'll soon be ready for primetime.",
        "contacts": "Add, segment, manage, and edit the members of your Strategic Network.",
        "campaigns": "Easily automate your audience's digital journey.",
        "templates": "Design beautiful, responsive email  templates that communicate effectively.",
        "socialMedia": "Up your social game and coordinate your message across all of your social media accounts.",
        "analytics": "Manage, monitor, and measure various aspects of your campaigns.",
        "teamMember": "Add team members to make content and campaign management a group effort."
    };

    partner_welcome_text = {
        "videos": "Check out the shareable content you received from your Strategic Alliances.",
        "contacts": "Add, segment, manage, and edit your customers and leads.",
        "campaigns": "Easily automate your audience's digital journey.",
        "templates": "Browse through the templates that your Strategic Alliances have provided.",
        "socialMedia": "Up your social game and coordinate your message across all of your social media accounts.",
        "analytics": "Manage, monitor, and measure various aspects of your campaigns.",
        "teamMember": "Add team members to make content and campaign management a group effort."

    }
    welcome_text: any;
    videoUrl: any;
    uploadVideoUrl = 'https://xamplify.io/embed/JFpLwU';
    addPartnerCreateUrl = 'https://xamplify.io/embed/mexS7o';
    addTeamMemberUrl = 'https://xamplify.io/embed/spPumv';
    createEmailTemplateUrl = 'https://xamplify.io/embed/rmFHF6';
    createCampaignUrl = 'https://xamplify.io/embed/Oen4LJ';
    redistributeCampaignUrl='https://xamplify.io/embed/W4UacK';
    addContactsUrl = 'https://xamplify.io/embed/epPjw1';
    logedInCustomerCompanyName: string;
    sourceType = "";
    videoFile:any;
    welcomePageItems: any;
    welcomePageItemsLoader = false;
    customResponse:CustomResponse = new CustomResponse();
    showDealForm: boolean = false;
    dealResponse:CustomResponse = new CustomResponse();
    showSandboxText = false;
    vanityLoginDto: VanityLoginDto = new VanityLoginDto();
    skin:CustomSkin = new CustomSkin();
    userId: number;
    /****** User Guide ******/
    mergeTagForGuide:any;
    isOnlyPartner:boolean;
    roleName: Roles = new Roles();
    /****** User Guide *******/

    constructor(
        private userService: UserService,
        public authenticationService: AuthenticationService,
        private referenceService: ReferenceService,
        public properties: Properties, public xtremandLogger:XtremandLogger,
        public sanitizer:DomSanitizer, public videoFileService: VideoFileService,
        private dashboardService:DashboardService,public envService:EnvService
    ) {
      let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    }else{
      this.vanityLoginDto.vanityUrlFilter = false;
    }
       this.sourceType = this.authenticationService.getSource();
        this.dashboardReport = new DashboardReport();
        this.userDefaultPage = new UserDefaultPage();
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
        this.hasContactRole = this.referenceService.hasRole(this.referenceService.roles.contactsRole);
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.hasEmailTemplateRole = this.referenceService.hasRole(this.referenceService.roles.emailTemplateRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roles.statsRole);
        this.hasSocialStatusRole = this.referenceService.hasRole(this.referenceService.roles.socialShare);
        this.loggedInUserId = this.authenticationService.getUserId();
        this.vanityLoginDto.userId = this.loggedInUserId;

        if(authenticationService.module.isVendor || authenticationService.isAddedByVendor){
            this.contactOrPartnerLink =  "/home/partners/manage";
        }else{
           this.contactOrPartnerLink =  "/home/contacts/manage";
        }
        this.showSandboxText = ("https://xamplify.co/"==envService.CLIENT_URL && !this.authenticationService.vanityURLEnabled);


    }
    closeModal(event: any){
      console.log('closed modal'+event);
      this.videoFile = undefined;
    }

    showHowToVideo(url, title){
      // this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      let videoInfo: any;
      if(title.includes('Partners')){ 
        title = this.authenticationService.partnerModule.customName;
        videoInfo =  this.welcome_text.contacts;
       }
      if(title.includes('Videos')){ videoInfo =  this.welcome_text.videos; }
      if(title.includes('Contacts')){ videoInfo =  this.welcome_text.contacts; }
      if(title.includes('Templates')){ videoInfo =  this.welcome_text.templates; }
      if(title.includes('Campaigns')){ videoInfo =  this.welcome_text.campaigns; }
      if(title.includes('Team members')){ videoInfo =  this.welcome_text.teamMember; }

      this.welcomeVideoInfo = {  "title":title, "videoInfo": videoInfo }
      this.videoUrl = url;
      this.getVideo(this.videoUrl.substring(this.videoUrl.length - 6));
    }
    getVideo(shortnerUrlAlias: string) {
      this.videoFileService.getVideoByShortenerUrlAliasXamplify(shortnerUrlAlias)
            .subscribe((result:any)=>{  
              this.videoFile = result;
              if(this.videoFile!=undefined){
                let description = this.videoFile.description;
                if("How to Add partners and create list demo"==description){
                  this.videoFile.description = "How to Add "+this.authenticationService.partnerModule.customName+" and create list demo";
                }
              }
             });
     }
    getDefaultPage(userId: number) {
      try{
        this.userService.loadUserDefaultPage(userId, this.authenticationService.companyProfileName)
            .subscribe(
                data => {
                    try {
                        if (data.dashboardType === 'welcome' || data.dashboardType.includes('welcome')) {
                            this.userDefaultPage.isCurrentPageDefaultPage = data.isCurrentPageDefaultPage;
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
          const currentUser = localStorage.getItem( 'currentUser' );
          this.logedInCustomerCompanyName = JSON.parse( currentUser )['logedInCustomerCompanyNeme'];
          this.loggedInUserId = this.authenticationService.getUserId();
        this.getDefaultPage(this.loggedInUserId);
        this.welcome_text = this.authenticationService.isOnlyPartner() ? this.partner_welcome_text: this.vendor_welcome_text;
        this.getWelcomePageItems();
        this.getMainContent(this.userId);
      }catch(error){ console.log(error);this.xtremandLogger.error(error);
        this.xtremandLogger.errorPage(error);}
  }

    ngOnDestroy(){
      $('#myModal').modal('hide');
    }

    getWelcomePageItems(){
      this.customResponse = new CustomResponse();
      this.welcomePageItemsLoader = true;
      let vanityUrlPostDto = {};
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            vanityUrlPostDto['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
            vanityUrlPostDto['vanityUrlFilter'] = true;
        }
        vanityUrlPostDto['userId'] = this.authenticationService.getUserId();
        this.dashboardService.getWelcomePageItems(vanityUrlPostDto)
        .subscribe(
          data => {
            this.welcomePageItemsLoader = false;
           this.welcomePageItems = data;
           /**XNFR-2*****/
           this.showDiv = data.showAnalytics || data.showCampaigns || data.showContacts || data.showContent 
           || data.showPartners || data.showSocialAccounts || data.showTeamMembers || data.showTemplates;
        },
        _error => {
          this.welcomePageItemsLoader = false;
            this.customResponse = new CustomResponse('ERROR',this.properties.unableToShowWelcomePageItems,true);
          },
          () => {
            
          }
        );
    }

    showSubmitDealSuccess() {
      this.showDealForm = false;
      this.dealResponse = new CustomResponse('SUCCESS', "Deal Submitted Successfully", true);
    }
  
    closeDealForm() {
      this.showDealForm = false;
    }

    getSelectedIndexFromPopup(event:any){
      this.ngxLoading = true;
      let self = this;
      setTimeout(function() {
      self.ngxLoading = false;
      self.applyFilter = event['selectedOptionIndex'] == 1;
      }, 500);
    }

    navigateToModule(deletedPartner:boolean,url:string){
      if(deletedPartner){
        this.referenceService.showSweetAlert("Please Upgrade Your Account","","info");
      }else{
        this.referenceService.goToRouter(url);
      }
    }
   

    getMainContent(userId:number){
      this.dashboardService.getTopNavigationBarCustomSkin(this.vanityLoginDto).subscribe(
        (response) =>{
         let cskinMap  = response.data;
         this.skin  = cskinMap.MAIN_CONTENT;
         console.log(this.skin);
      }
      )
      
    }
    /** User Guide **/
    urlLink:any;
    goToUserGuidePage(moduleId:any,isTrue:boolean){
      if(isTrue){
      this.urlLink = this.authenticationService.DOMAIN_URL +'home/help/guides/' + moduleId;
      } else {
        this.urlLink = this.authenticationService.DOMAIN_URL + 'home/help/' + moduleId;
      }
    }
    /** User Guide **/
  
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReferenceService } from "../services/reference.service";
import { UserService } from "../services/user.service";
import { AuthenticationService } from "../services/authentication.service";
import { VideoUtilService } from "../../videos/services/video-util.service";
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Roles } from '../../core/models/roles';
import { Pagination } from '../../core/models/pagination';
import { DealRegistrationService } from "app/deal-registration/services/deal-registration.service";
import { Title }     from '@angular/platform-browser';
import { VanityURLService } from "app/vanity-url/services/vanity.url.service";
import { CustomSkin } from "app/dashboard/models/custom-skin";
import { DashboardService } from "app/dashboard/dashboard.service";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";


declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public refcategories: any;
  pagination: Pagination
  roleName: Roles = new Roles();
  public currentUser = JSON.parse(localStorage.getItem("currentUser"));
  userId: any;
  token: any;
  loggedInThroughVanityUrl = false;
  loader = false;
  skin:CustomSkin = new CustomSkin();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number;
  constructor(
    private titleService: Title,
    public referenceService: ReferenceService,
    public userService: UserService,
    public dealsService:DealRegistrationService,
    public xtremandLogger: XtremandLogger,
    private router: Router,
    public authenticationService: AuthenticationService,
    public videoUtilService: VideoUtilService,
    private vanityURLService:VanityURLService,
    public dashBoardService:DashboardService
  ) {
    this.loggedInThroughVanityUrl =  this.vanityURLService.isVanityURLEnabled();
    this.isAuthorized();
    /**** XNFR-134 ****/
    this.loggedInUserId = this.authenticationService.getUserId();
    this.vanityLoginDto.userId = this.loggedInUserId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    }else{
      this.vanityLoginDto.vanityUrlFilter = false;
    }
  }

  isAuthorized(): boolean {
    try {
      if (!localStorage.getItem("currentUser")) {
        $(".page-container,.page-header.navbar.navbar-fixed-top").html("");
        if(this.authenticationService.unauthorized){
          this.router.navigateByUrl("/401");
        }else{
          this.router.navigateByUrl("/login");
        }
        return false;
      }
    } catch (error) {
      this.xtremandLogger.error(error);
    }
  }
  getCategorisService() {
    try {
      this.referenceService.getCategories().subscribe(
        (result: any) => {
          this.refcategories = result;
          this.referenceService.refcategories = this.refcategories;
        },
        (error: any) => {
          this.xtremandLogger.error("error" + error);
        },
        () => this.xtremandLogger.log("categoriss api called"));
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  getVideoTitles() {
    try {
      this.referenceService.getVideoTitles().subscribe((result: any) => {
        this.referenceService.videoTitles = result.titles;
      });
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  getVideoDefaultSettings() {
    try {
      this.userService.getVideoDefaultSettings().subscribe(
        (response: any) => {
          if (response !== "") {
            this.referenceService.videoBrandLogo = response.brandingLogoUri;
            this.referenceService.defaultPlayerSettings = response;
            this.referenceService.companyId = response.companyProfile.id;
            this.referenceService.companyProfileImage = response.companyProfile.companyLogoPath;
            if (!response.brandingLogoUri || !response.brandingLogoDescUri) {
                const logoLink = this.videoUtilService.isStartsWith(response.companyProfile.website);
                this.saveVideoBrandLog( response.companyProfile.companyLogoPath, logoLink);
            }
          }
        },
        (error: any) => {
          this.xtremandLogger.errorPage(error);
        }
      );
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  saveVideoBrandLog(companyLogoPath, logoLink) {
  }
  getCompanyId() {
    try {
      this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
        (result: any) => {
          if (result !== "") { 
            this.loader = false;
            this.referenceService.companyId = result;
            if(result!=undefined && result>0){
              this.getOrgCampaignTypes();
            }
            
          }
        }, (error: any) => { this.xtremandLogger.log(error); }
      );
    } catch (error) { this.xtremandLogger.log(error);  } }

  getOrgCampaignTypes(){
      this.referenceService.getOrgCampaignTypes( this.referenceService.companyId).subscribe(
      data=>{
        this.referenceService.videoCampaign = data.video;
        this.referenceService.emailCampaign = data.regular;
        this.referenceService.socialCampaign = data.social;
        this.referenceService.eventCampaign = data.event;
      });
    }
  
  getPartnerCampaignsNotifications(){
    if(!this.referenceService.eventCampaignTabAccess || !this.referenceService.socialCampaignTabAccess){
      const url = "partner/access/" + this.userId + "?access_token=" + this.token;
      this.userService.getEventAccessTab(url)
          .subscribe(
              data => {
                  this.referenceService.eventCampaignTabAccess = data.event;
                  this.referenceService.socialCampaignTabAccess = data.social;
              },
              error => { },
              () => this.xtremandLogger.info('Finished home component CampaignNotification()')
          );
     }
  }
  
  getTeamMembersDetails(){
      const url = "admin/getRolesByUserId/" + this.userId + "?access_token=" + this.token;
      this.userService.getHomeRoles(url)
      .subscribe(
      response => {
           if(response.statusCode==200){
              this.authenticationService.loggedInUserRole = response.data.role;
              this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
              this.authenticationService.superiorRole = response.data.superiorRole;
              const roles = this.authenticationService.getRoles();
              this.checkEnableLeads()

              if ( roles ) {
                  
                  if(roles.indexOf(this.roleName.companyPartnerRole) > -1) {
                      this.authenticationService.isCompanyPartner = true;
                  } 
                  
                  if ( roles.indexOf( this.roleName.campaignRole ) > -1 ||
                      roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                      roles.indexOf( this.roleName.vendorRole ) > -1 ||
                      roles.indexOf( this.roleName.companyPartnerRole ) > -1) {
                      this.authenticationService.isShowCampaign = true;
                      if( (roles.indexOf( this.roleName.campaignRole ) > -1 && (this.authenticationService.superiorRole === 'OrgAdmin & Partner' || this.authenticationService.superiorRole === 'Vendor & Partner' || this.authenticationService.superiorRole === 'Partner'))
                              || this.authenticationService.isCompanyPartner){
                          this.authenticationService.isShowRedistribution = true;
                      }else{
                          this.authenticationService.isShowRedistribution = false;
                      }
                      
                      if ( roles.indexOf( this.roleName.contactsRole ) > -1 ||
                              roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                              roles.indexOf( this.roleName.companyPartnerRole ) > -1 
                              //||(this.authenticationService.superiorRole === 'OrgAdmin & Partner' || (this.authenticationService.superiorRole === 'Vendor & Partner' && !this.loggedInThroughVanityUrl)) 
                              )
                          {
                             // this.authenticationService.isShowContact = true;
                          }
                      
                  }
           }else{
               this.authenticationService.loggedInUserRole = 'User';
           }
           }
      },
      () => {
          this.xtremandLogger.log('Finished');
         }
      );
  }
  
  checkEnableLeads(){
    if(this.authenticationService.loggedInUserRole != "Team Member"){
      const url = "admin/get-company-id/" + this.userId + "?access_token=" + this.token;
      this.referenceService.getHomeCompanyIdByUserId( url )
      .subscribe( response => {
          const campaignUrl = "campaign/access/" + response + "?access_token=" + this.token;
          this.referenceService.getHomeOrgCampaignTypes( campaignUrl )
          .subscribe( data => {
              this.authenticationService.enableLeads = data.enableLeads;
             if(!this.authenticationService.enableLeads){
                this.checkEnableLeadsForPartner();
             }
          } );

      } )
    }else if(this.authenticationService.superiorRole.includes("Vendor") || this.authenticationService.superiorRole.includes("OrgAdmin")){
       
          try {
            this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
              (result: any) => {
                if (result !== "") {  this.referenceService.companyId = result;
                  this.dealsService.getVendorLeadServices(this.authenticationService.user.id,this.referenceService.companyId).subscribe(response=>{
                    this.authenticationService.enableLeads =response.data;
                    if(!this.authenticationService.enableLeads){
                      this.checkEnableLeadsForPartner();
                   }
                  })
                }
              }, (error: any) => { this.xtremandLogger.log(error); }
            );
          } catch (error) { this.xtremandLogger.log(error);  } 
       
    }else{
      if(!this.authenticationService.enableLeads){
        this.checkEnableLeadsForPartner();
      }
    }
    
      
  }
  
  checkEnableLeadsForPartner(){

      if (!this.authenticationService.enableLeads && ( this.authenticationService.isCompanyPartner || (this.authenticationService.loggedInUserRole == "Team Member" && this.authenticationService.superiorRole.includes("Partner")) ) )
      {

        try {
          this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
            (result: any) => {
              if (result !== "") {  this.referenceService.companyId = result;
                this.dealsService.getPartnerLeadServices(this.authenticationService.user.id,this.referenceService.companyId).subscribe(response=>{
                  this.authenticationService.enableLeads =response.data;
                })
              }
            }, (error: any) => { this.xtremandLogger.log(error); }
          );
        } catch (error) { this.xtremandLogger.log(error);  } 
         
      }
  }
  public setTitle( newTitle: string) {
      this.titleService.setTitle( newTitle );
    } 
  
  ngOnInit() {
      try {
        this.loader = true;
          if(this.currentUser['logedInCustomerCompanyNeme'] != undefined){            
            if(this.authenticationService.vanityURLEnabled && this.authenticationService.v_companyName){
              this.setTitle(this.authenticationService.v_companyName);
            }else{
              this.setTitle(this.currentUser['logedInCustomerCompanyNeme']);
            }
          }else{
              this.setTitle('xAmplify'); 
          }
          this.userId = this.currentUser['userId'];
          this.token = this.currentUser['accessToken'];
          const roleNames = this.currentUser['roles'];
          if (
            this.referenceService.defaulgVideoMethodCalled === false &&
            (roleNames.length > 1 && this.authenticationService.hasCompany())
          ) {
            this.getVideoDefaultSettings();
            this.referenceService.defaulgVideoMethodCalled = true;
            this.getTeamMembersDetails();
            this.getPartnerCampaignsNotifications();
            this.getCategorisService();
          }
         this.vanityURLService.isVanityURLEnabled();  
         this.getCompanyId();  
         this.getMainContent(this.userId);  
       } catch (error) {
         this.xtremandLogger.error("error" + error);
       }  
  }
  getMainContent(userId:number){
    this.dashBoardService.getTopNavigationBarCustomSkin(this.vanityLoginDto).subscribe(
      (response) =>{
       let cskinMap  = response.data;
       this.skin  = cskinMap.MAIN_CONTENT;
    }
    )
    
  }
}

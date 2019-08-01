import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ReferenceService } from "../services/reference.service";
import { UserService } from "../services/user.service";
import { AuthenticationService } from "../services/authentication.service";
import { VideoUtilService } from "../../videos/services/video-util.service";
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Roles } from '../../core/models/roles';


declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public refcategories: any;
  roleName: Roles = new Roles();
  public currentUser = JSON.parse(localStorage.getItem("currentUser"));
  constructor(
    public referenceService: ReferenceService,
    public userService: UserService,
    public xtremandLogger: XtremandLogger,
    private router: Router,
    public authenticationService: AuthenticationService,
    public videoUtilService: VideoUtilService
  ) {
    this.isAuthorized();
  }

  isAuthorized(): boolean {
    try {
      if (!localStorage.getItem("currentUser")) {
        $(".page-container,.page-header.navbar.navbar-fixed-top").html("");
        this.router.navigateByUrl("/login");
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
            this.getOrgCampaignTypes();
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
    try {
      this.userService.saveBrandLogo(companyLogoPath, logoLink,this.authenticationService.user.id)
        .subscribe( (data: any) => {
            if (data !== undefined) { this.xtremandLogger.log("logo updated successfully");}
          },
          error => { this.xtremandLogger.error("error" + error); });
    } catch (error) {
      this.xtremandLogger.error("error" + error);
    }
  }
  getCompanyId() {
    try {
      this.referenceService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
        (result: any) => {
          if (result !== "") {  this.referenceService.companyId = result;
            this.getOrgCampaignTypes();
          }
        }, (error: any) => { this.xtremandLogger.log(error); }
      );
    } catch (error) { this.xtremandLogger.log(error);  } }

  getOrgCampaignTypes(){
      this.referenceService.getOrgCampaignTypes( this.referenceService.companyId).subscribe(
      data=>{
        this.xtremandLogger.log(data);
        this.referenceService.videoCampaign = data.video;
        this.referenceService.emailCampaign = data.regular;
        this.referenceService.socialCampaign = data.social;
        this.referenceService.eventCampaign = data.event
      });
    }
  
  getTeamMembersDetails(){
      
      const currentUser = localStorage.getItem('currentUser');
      const userId = JSON.parse(currentUser)['userId'];
      const token = JSON.parse(currentUser)['accessToken'];
      const url = "admin/getRolesByUserId/" + userId + "?access_token=" + token;
      this.userService.getHomeRoles(url)
      .subscribe(
      response => {
           if(response.statusCode==200){
              this.authenticationService.loggedInUserRole = response.data.role;
              this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
              this.authenticationService.superiorRole = response.data.superiorRole;
              const roles = this.authenticationService.getRoles();
              if ( roles ) {
                  if ( roles.indexOf( this.roleName.campaignRole ) > -1 ||
                      roles.indexOf( this.roleName.orgAdminRole ) > -1 ||
                      roles.indexOf( this.roleName.vendorRole ) > -1 ||
                      roles.indexOf( this.roleName.companyPartnerRole ) > -1) {
                      this.authenticationService.isShowCampaign = true;
                      // this.isCampaign = true;
                      if( (roles.indexOf( this.roleName.campaignRole ) > -1 && (this.authenticationService.superiorRole === 'OrgAdmin & Partner' || this.authenticationService.superiorRole === 'Vendor & Partner' || this.authenticationService.superiorRole === 'Partner'))
                              || this.authenticationService.module.isCompanyPartner){
                          this.authenticationService.isShowRedistribution = true;
                      }
                  }
           }else{
               this.authenticationService.loggedInUserRole = 'User';
           }
           }
      },
      () => {
          this.xtremandLogger.log('Finished');
          const roleNames = this.authenticationService.getRoles();
          if (
            this.referenceService.defaulgVideoMethodCalled === false &&
            (roleNames.length > 1 && this.authenticationService.hasCompany())
          ) {
            this.getVideoDefaultSettings();
            this.referenceService.defaulgVideoMethodCalled = true;
          }}
      );
  }
  
  ngOnInit() {
      try {
          this.getTeamMembersDetails();
       } catch (error) {
         this.xtremandLogger.error("error" + error);
       }  
  }
}

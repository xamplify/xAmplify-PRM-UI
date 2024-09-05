import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { LoginAsEmailNotificationDto } from 'app/dashboard/models/login-as-email-notification-dto';
import { EnvService } from 'app/env.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

declare var $:any;
@Component({
  selector: 'app-login-as-partner',
  templateUrl: './login-as-partner.component.html',
  styleUrls: ['./login-as-partner.component.css'],
  providers:[TeamMemberService]
})
export class LoginAsPartnerComponent implements OnInit {
  isPartner = false;
  @Input() contact:any;
  @Input() showLogOutButton = false;
  @Input() showLoginAsButton = false;
  loading = false;
  loggedInUserId: number;
  isLoggedInThroughVanityUrl: any;
  isLoggedInAsPartner = false;
  isLoggedInAsTeamMember = false;
  title = "";
  loginAsEmailNotificationDto:LoginAsEmailNotificationDto = new LoginAsEmailNotificationDto();
  isLoggedInAsPartnerFromXamplify = false;
  constructor(public authenticationService:AuthenticationService,private router:Router,private teamMemberService:TeamMemberService,
    private referenceService:ReferenceService,private vanityUrlService:VanityURLService,
    private utilService:UtilService,private xtremandLogger:XtremandLogger,public envService: EnvService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.isLoggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
      this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
      this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
      let subDomain = this.authenticationService.getSubDomain();
      this.isLoggedInAsPartnerFromXamplify = subDomain.length==0 && (this.isLoggedInAsPartner);

     }

  ngOnInit() {
    this.isPartner = this.router.url.includes('home/partners');
    if(this.isLoggedInAsTeamMember){
      this.title = "Login as disabled as you are already logged in as team member";
    }else if(this.isLoggedInAsPartnerFromXamplify){
      this.title = "Login as disabled as you are already logged in as partner";
    }else{
      if(this.contact!=undefined){
        if(!this.contact.loginAsPartnerOptionEnabledForVendor && (this.contact.signedUp && this.contact.companyId>0)){
          this.title = "You do not have enough privileges to Login as";
        }else if(this.contact.signedUp && this.contact.companyId>0 && this.contact.loginAsPartnerOptionEnabledForVendor){
          this.title = "Login as";
        }else if((!this.contact.signedUp || this.contact.companyId==0) && !this.contact.loginAsPartnerOptionEnabledForVendor){
          this.title = "Company profile not created";
        }
      }
    }
    
  }

  loginAsPartner(){
    this.utilService.addLoginAsLoader();
    setTimeout(() => {
      this.sendEmailNotificationToPartner();
    }, 2000);
    
  }
  sendEmailNotificationToPartner() {
    this.loginAsEmailNotificationDto.partnerCompanyUserId = this.contact.id;
    this.loginAsEmailNotificationDto.vendorCompanyUserId = this.authenticationService.user.id;
    this.loginAsEmailNotificationDto.domainName = this.authenticationService.companyProfileName;
    let loginAsUserEmailId = this.authenticationService.getLocalStorageItemByKey("loginAsUserEmailId")
    this.loginAsEmailNotificationDto.superAdminLoggedIn = "admin@xamplify.io"==loginAsUserEmailId;
    this.authenticationService.sendLoginAsPartnerEmailNotification(this.loginAsEmailNotificationDto).
    subscribe(
      response=>{
        this.xtremandLogger.debug("Login As Email Notification Success");
      },error=>{
        this.xtremandLogger.error("Login As Email Notification Failed");
        this.findRolesAndSetLocalStroageDataAndLogInAsPartner(this.contact.emailId,false);
      },()=>{
        this.findRolesAndSetLocalStroageDataAndLogInAsPartner(this.contact.emailId,false);
      }
    );
  }

  logoutAsPartner(){
    let vendorAdminCompanyUserEmailId = JSON.parse(localStorage.getItem('vendorAdminCompanyUserEmailId'));
    this.findRolesAndSetLocalStroageDataAndLogInAsPartner(vendorAdminCompanyUserEmailId, true);
  }

  logoutAsPartnerOrTeamMember(){
    this.utilService.addLoginAsLoader();
    if(this.isLoggedInAsTeamMember){
      this.logoutAsTeamMember();
    }else{
      this.logoutAsPartner();
    }
  }

  logoutAsTeamMember() {
    let adminEmailId = JSON.parse(localStorage.getItem('adminEmailId'));
    this.loginAsTeamMember(adminEmailId, true);
  }


  findRolesAndSetLocalStroageDataAndLogInAsPartner(emailId: any, logoutButtonClicked: boolean) {
    if (this.isLoggedInThroughVanityUrl) {
      this.teamMemberService.getVanityUrlRoles(emailId)
      .subscribe(response => {
        this.addOrRemoveVendorAdminDetails(logoutButtonClicked);
        this.setLocalStorageAndRedirectToDashboard(emailId, response.data);
      },
        (error: any) => {
          this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
          this.loading = false;
        }
      );
    }else{
      this.authenticationService.getUserByUserName(emailId).subscribe
      (response=>{
        this.addOrRemoveVendorAdminDetails(logoutButtonClicked);
        this.setLocalStorageAndRedirectToDashboard(emailId, response);
      },
      (error: any) => {
        this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
        this.loading = false;
      }
      );
    }
    
    
  }

  private addOrRemoveVendorAdminDetails(logoutButtonClicked: boolean) {
    if (logoutButtonClicked) {
      this.removeVendorAdminData();
    } else {
      this.addVendorAdminData();
    }
  }

  private addVendorAdminData() {
    let vendorAdminCompanyUserId = JSON.parse(localStorage.getItem('vendorAdminCompanyUserId'));
    if (vendorAdminCompanyUserId == null) {
      localStorage.vendorAdminCompanyUserId = JSON.stringify(this.loggedInUserId);
      localStorage.vendorAdminCompanyUserEmailId = JSON.stringify(this.authenticationService.user.emailId);
    }
  }

  private removeVendorAdminData() {
    localStorage.removeItem('vendorAdminCompanyUserId');
    localStorage.removeItem('vendorAdminCompanyUserEmailId');
    this.isLoggedInAsPartner = false;
  }

  private setLocalStorageAndRedirectToDashboard(emailId: any, data: any) {
    this.utilService.setUserInfoIntoLocalStorage(emailId, data);
    let self = this;
    setTimeout(function () {
      const currentUser = localStorage.getItem( 'currentUser' );
      let isVanityWelcomePageRequired = JSON.parse( currentUser )['isVanityWelcomePageRequired'];
      console.log("alsl asljkdnlaj alsdnlk");
      console.log(isVanityWelcomePageRequired)
      let routingLink = isVanityWelcomePageRequired? 'welcome-page':'home/dashboard/';
      self.router.navigate([routingLink])
        .then(() => {
          window.location.reload();
        });
    }, 500);
  }

 
loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean) {
  if (this.isLoggedInThroughVanityUrl) {
    this.getVanityUrlRoles(emailId, isLoggedInAsAdmin);
  } else {
    this.getUserData(emailId, isLoggedInAsAdmin);
  }
}
getVanityUrlRoles(emailId: string, isLoggedInAsAdmin: boolean) {
  this.teamMemberService.getVanityUrlRoles(emailId)
    .subscribe(response => {
      this.setLoggedInTeamMemberData(isLoggedInAsAdmin, emailId, response.data);
    },
      (error: any) => {
        this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
        this.loading = false;
      }
    );
}

getUserData(emailId: string, isLoggedInAsAdmin: boolean) {
  this.authenticationService.getUserByUserName(emailId)
    .subscribe(
      response => {
        this.setLoggedInTeamMemberData(isLoggedInAsAdmin, emailId, response);
      },
      (error: any) => {
        this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
        this.loading = false;
      }
    );
}

setLoggedInTeamMemberData(isLoggedInAsAdmin: boolean, emailId: string, response: any) {
  if (isLoggedInAsAdmin) {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminEmailId');
    this.isLoggedInAsTeamMember = false;
  } else {
    let adminId = JSON.parse(localStorage.getItem('adminId'));
    if (adminId == null) {
      localStorage.adminId = JSON.stringify(this.loggedInUserId);
      localStorage.adminEmailId = JSON.stringify(this.authenticationService.user.emailId);
    }
  }
  this.setLocalStorageAndRedirectToDashboard(emailId,response);

}


}



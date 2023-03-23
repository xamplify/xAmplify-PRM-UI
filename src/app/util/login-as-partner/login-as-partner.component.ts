import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
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
  constructor(public authenticationService:AuthenticationService,private router:Router,private teamMemberService:TeamMemberService,
    private referenceService:ReferenceService,private vanityUrlService:VanityURLService,private utilService:UtilService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.isLoggedInThroughVanityUrl = this.vanityUrlService.isVanityURLEnabled();
      this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
      this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();

     }

  ngOnInit() {
    this.isPartner = this.router.url.includes('home/partners');
    
  }

  loginAsPartner(){
    this.loading = true;
    this.findRolesAndSetLocalStroageDataAndLogInAsPartner(this.contact.emailId,false);
  }

  logoutAsPartner(){
    this.loading = true;
    let vendorAdminCompanyUserEmailId = JSON.parse(localStorage.getItem('vendorAdminCompanyUserEmailId'));
    this.findRolesAndSetLocalStroageDataAndLogInAsPartner(vendorAdminCompanyUserEmailId, true);
  }

  findRolesAndSetLocalStroageDataAndLogInAsPartner(emailId: any, logoutButtonClicked: boolean) {
    this.teamMemberService.getVanityUrlRoles(emailId)
    .subscribe(response => {
      this.addOrRemoveVendorAdminDetails(logoutButtonClicked);
      this.setLocalStorageAndRedirectToDashboard(emailId, response);
    },
      (error: any) => {
        this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
        this.loading = false;
      }
    );
    
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

  private setLocalStorageAndRedirectToDashboard(emailId: any, response: any) {
    this.utilService.setUserInfoIntoLocalStorage(emailId, response.data);
    let self = this;
    setTimeout(function () {
      self.router.navigate(['home/dashboard/'])
        .then(() => {
          window.location.reload();
        });
    }, 500);
  }
}

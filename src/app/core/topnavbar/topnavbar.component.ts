import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SocialService } from '../../social/services/social.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { Roles } from '../../core/models/roles';
import { Properties } from '../../common/models/properties';
declare var $:any;

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css'],
  providers: [Properties]
})
export class TopnavbarComponent implements OnInit {
  currentUrl: string;
  roleName: Roles = new Roles();
  isUser = false;
  @Input() model = { 'displayName': '', 'profilePicutrePath': 'assets/images/icon-user-default.png' };
  constructor(public router: Router, public userService: UserService, public utilService: UtilService,
    public socialService: SocialService, public authenticationService: AuthenticationService,
    public refService: ReferenceService, public logger: XtremandLogger,public properties: Properties) {
    try{
        this.currentUrl = this.router.url;
    const userName = this.authenticationService.user.emailId;
    if(userName!=undefined){
        if (this.refService.topNavbarUserService === false || this.utilService.topnavBareLoading === false) {
            this.refService.topNavbarUserService = true;
            this.utilService.topnavBareLoading = true;
            this.userService.getUserByUserName(userName).
              subscribe(
              data => {
                console.log(data);
                refService.userDefaultPage = data.userDefaultPage;
                const loggedInUser = data;
                if (loggedInUser.firstName != null) {
                  this.model.displayName = loggedInUser.firstName;
                  refService.topNavBarUserDetails.displayName = loggedInUser.firstName;
                } else {
                  this.model.displayName = loggedInUser.emailId;
                  refService.topNavBarUserDetails.displayName = loggedInUser.emailId;
                }
                if (!(loggedInUser.profileImagePath.indexOf(null) > -1)) {
                  this.model.profilePicutrePath = loggedInUser.profileImagePath;
                  refService.topNavBarUserDetails.profilePicutrePath = loggedInUser.profileImagePath;
                } else {
                  this.model.profilePicutrePath = 'assets/images/icon-user-default.png';
                  refService.topNavBarUserDetails.profilePicutrePath = 'assets/images/icon-user-default.png';
                }
              },
              error => { this.logger.error(this.refService.errorPrepender + ' Constructor():' + error); },
              () => this.logger.log('Finished')
              );
          }


    const roles = this.authenticationService.getRoles();
    if(roles!=undefined){
        if (roles.indexOf(this.roleName.videRole) > -1 || roles.indexOf(this.roleName.allRole) > -1) {
            this.authenticationService.module.hasVideoRole = true;
          }
          if (roles.indexOf(this.roleName.socialShare) > -1 || roles.indexOf(this.roleName.allRole) > -1) {
            this.authenticationService.module.hasSocialStatusRole = true;
          }
          if (roles.indexOf(this.roleName.orgAdminRole) > -1) {
            this.authenticationService.module.isOrgAdmin = true;
          }
          if (roles.length === 1) {
            this.isUser = true;
          }
          if (roles.indexOf(this.roleName.companyPartnerRole) > -1) {
            this.authenticationService.module.isCompanyPartner = true;
          }

          if(roles.indexOf(this.roleName.vendorRole)>-1){
              this.authenticationService.module.isVendor = true;
          }

    }
    }else{
       this.authenticationService.logout();
    }
    }catch(error) {this.logger.error('error'+error); }
  }
  errorHandler(event:any){
    event.target.src = 'assets/images/icon-user-default.png';
  }
  connectToWebSocket(){
      let error_callback = function(error) {
          // display the error's message header:
          alert(error.headers.message);
        };
      let stompClient = this.authenticationService.connect();
      let headers = {
              login: 'mahisravan07@gmail.com',
              passcode: 'Sravan@07',
              // additional header
              'client-id': 'my-trusted-client'
            };

      stompClient.connect(headers, error_callback);
   /*   stompClient.connect(headers, frame => {
          stompClient.subscribe('/topic/notification', notifications => {
          });

      });*/


  }



  getUnreadNotificationsCount() {
   try{
    this.userService.getUnreadNotificationsCount(this.authenticationService.getUserId())
      .subscribe(
      data => {
        this.userService.unreadNotificationsCount = data;
      },
      error => this.logger.log(error),
      () => this.logger.log('Finished')
      );
    }catch(error) {this.logger.error('error'+error); }
  }

  isAddedByVendor(){
    try{
      this.userService.isAddedByVendor(this.authenticationService.getUserId())
      .subscribe(
      data => {
           this.authenticationService.isAddedByVendor=data;
      },
      error => this.logger.log(error),
      () => this.logger.log('Finished')
      );
    }catch(error) {this.logger.error('error'+error); }
  }


  isAddedByPartner(){
    if(this.authenticationService.showRoles()=="Team Member"){
      this.userService.isAddedByOnlyPartner(this.authenticationService.getUserId())
      .subscribe(
      data => {
           this.authenticationService.isPartnerTeamMember=data.onlyPartner;
      },
      error => this.logger.log(error),
      () => this.logger.log('Finished')
      );
    }
  }

  onRightClick(event){
    return false;
  }
  ngOnInit() {
    try{
     this.getUnreadNotificationsCount();
     this.isAddedByVendor();
     this.isAddedByPartner();
    }catch(error) {this.logger.error('error'+error); }
  }
  lockScreen(){
    this.router.navigate(['/userlock']);
  }
  errorImage(event) { event.target.src = 'assets/images/xamplify-logo.png'; }
  logout() {
    this.refService.userDefaultPage = 'NoneOf';
    this.refService.isSidebarClosed = false;
    this.refService.defaulgVideoMethodCalled = false;
    this.refService.companyProfileImage = '';
    document.body.className = 'login page-header-fixed page-sidebar-closed-hide-logo page-container-bg-solid page-sidebar-closed-hide-logo';
    localStorage.setItem('isLogout', 'loggedOut');
    this.authenticationService.logout();
   // this.router.navigate(['/']);
  }
}

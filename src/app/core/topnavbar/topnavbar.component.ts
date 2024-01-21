import { Component, OnInit, Input,OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SocialService } from '../../social/services/social.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { Roles } from '../../core/models/roles';
import { Properties } from '../../common/models/properties';
import { CustomResponse } from '../../common/models/custom-response';
import { VendorInvitation } from '../../dashboard/models/vendor-invitation';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { DashboardService } from "../../dashboard/dashboard.service";
import { FormGroup, FormBuilder, Validators, FormControl , NgModel} from '@angular/forms';
declare var $, CKEDITOR, ckInstance:any;
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import "rxjs/add/observable/of";
import { tap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css'],
  providers: [Properties, VendorInvitation]
})
export class TopnavbarComponent implements OnInit,OnDestroy {
  currentUrl: string;
  roleName: Roles = new Roles();
  vendoorInvitation: VendorInvitation = new VendorInvitation();
  vendorDetails: any;
  loading = false;
  newEmailIds: string[] = [];
  emailIds = [];
  isValidVendorInvitation = false;
  isError = false;
  customResponse: CustomResponse = new CustomResponse();
  isValidationMessage = false;
  validationMessage = "";
  isUser = false;
  isShowCKeditor = false;
  invalidTagError = false;
  @ViewChild('tagInput')
  tagInput: SourceTagInput;
  public validators = [ this.must_be_email.bind(this) ];
  public errorMessages = {'must_be_email': 'Please be sure to use a valid email format'};
  public onAddedFunc = this.beforeAdd.bind(this);
  private addFirstAttemptFailed = false;
  @Input() model = { 'displayName': '', 'profilePicutrePath': 'assets/images/icon-user-default.png' };
  sourceType = "";
  isLoggedInFromAdminSection = false;
  dashboardTypes = [];
  loadTopNavBar = false;
  result:any;
  userId : number;
  cskin:CustomSkin = new CustomSkin();
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  showMyVendors: boolean = false;
  vendorCount: any = 0;
  superiorRole: string = "";
  myVendorsLoader: boolean;
  /****XNFR-224 ****/
  isLoggedInAsPartner = false;
  loggedInAsUserEmailId = "";
  isLoggedInAsTeamMember = false;
  vendorAdminCompanyUserEmailId: any;
  guideHomeUrl:any;
  constructor(public dashboardService: DashboardService, public router: Router, public userService: UserService, public utilService: UtilService,
    public socialService: SocialService, public authenticationService: AuthenticationService,
    public refService: ReferenceService, public logger: XtremandLogger,public properties: Properties,private translateService: TranslateService,
    private vanityServiceURL:VanityURLService) {
    try{
      if(this.authenticationService.isLocalHost() || this.authenticationService.isQADomain()){
        this.connectToWebSocket();
      }
    this.isLoggedInFromAdminSection = this.utilService.isLoggedInFromAdminPortal();
    this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
    this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
    this.currentUrl = this.router.url;
    const userName = this.authenticationService.user.emailId;
    this.loggedInAsUserEmailId = userName;
    if(this.isLoggedInAsTeamMember){
      this.vendorAdminCompanyUserEmailId = this.utilService.getLoggedInAdminCompanyEmailId();
    }else{
      this.vendorAdminCompanyUserEmailId = this.utilService.getLoggedInVendorAdminCompanyEmailId();
    }
    this.userId = this.authenticationService.getUserId();
    /*** XNFR-134** */
    this.vanityLoginDto.userId = this.userId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
    }else{
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    if(userName!=undefined){
      this.sourceType = this.authenticationService.getSource();
        if (this.refService.topNavbarUserService === false || this.utilService.topnavBareLoading === false) {
            this.refService.topNavbarUserService = true;
            this.utilService.topnavBareLoading = true;
            this.userService.getUserByUserName(userName).
              subscribe(
              data => {
                this.translateService.use(data.preferredLanguage);
                this.getAllPreferredLanguages(data.preferredLanguage);
                if(this.vanityServiceURL.isVanityURLEnabled()){
                  this.vanityServiceURL.checkVanityURLDetails();
                }                
                refService.userDefaultPage = data.userDefaultPage;
                const loggedInUser = data;
                if (loggedInUser.firstName) {
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
          if (roles.indexOf(this.roleName.vendorTierRole) > -1){
            this.authenticationService.module.isVendorTier = true;
          }
          if (roles.indexOf(this.roleName.marketingRole) > -1){
            this.authenticationService.module.isMarketing = true;
          }
	    	if (roles.indexOf(this.roleName.prmRole) > -1){
            this.authenticationService.module.isPrm = true;
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
  private must_be_email(control: FormControl) {
    if (this.addFirstAttemptFailed && !this.validateEmail(control.value)) {
        return { "must_be_email": true };
    }
    return null;
  }
  private beforeAdd(tag: any) {
    let isPaste = false;
    if(tag['value']) {  isPaste = true; tag = tag.value;}
    if (!this.validateEmail(tag)) {
      if (!this.addFirstAttemptFailed) {
        this.addFirstAttemptFailed = true;
        if(!isPaste) { this.tagInput.setInputValue(tag); }
      }
      if(isPaste) {  return Observable.throw(this.errorMessages['must_be_email']); }
      else { return Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag)))); }
    }
    this.addFirstAttemptFailed = false;
    return Observable.of(tag);
  }
  private validateEmail(text: string) {
    var EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/i;
    return (text && EMAIL_REGEXP.test(text));
  }
  public notifications = 0;
  
  connectToWebSocket(){
      
   // Open connection with server socket
      let stompClient = this.authenticationService.connect();
      stompClient.connect({}, frame => {
          console.log("********************************************WebSocket*********************")
          // Subscribe to notification topic
          stompClient.subscribe('/topic/notification', notifications => {
              // Update notifications attribute with the recent messsage sent from the server
              this.notifications = JSON.parse(notifications.body).count;
          })
      });
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

  getRoles() {
    this.userService.getRoles(this.authenticationService.getUserId())
      .subscribe(
        response => {
          if (response.statusCode == 200) {
            this.authenticationService.loggedInUserRole = response.data.role;
            this.authenticationService.isPartnerTeamMember = response.data.partnerTeamMember;
            this.authenticationService.hasOnlyPartnerRole = this.authenticationService.loggedInUserRole == "Partner" && this.authenticationService.isPartnerTeamMember == false;
            this.superiorRole = response.data.superiorRole;
            if (this.superiorRole == undefined || this.superiorRole == null) {
              this.superiorRole = "";
            }
          } else {
            this.authenticationService.loggedInUserRole = 'User';
          }
        },
        error => this.logger.errorPage(error),
        () => {
          if (this.vanityLoginDto.vanityUrlFilter) {
            this.vendorCount = 1;
          } else {
            this.getVendorCount();
          }
        }
      );
  }

  getVendorCount() {
    this.myVendorsLoader = true;
    this.dashboardService.getVendorCount(this.vanityLoginDto).subscribe(
      (response) =>{
        if (response.statusCode == 200) {
          this.vendorCount = response.data;
        }     
       this.myVendorsLoader = false;
      },error=>{
        this.myVendorsLoader = false;
      }
    )
  }

  onRightClick(event){
    return false;
  }
  ngOnDestroy(){
    this.isShowCKeditor = false;
    
    $('#requestForVendor').modal('hide');
  }
  ngOnInit() {
    try{
     this.getDashboardType();
     this.getUnreadNotificationsCount();
     this.getRoles();
     this.isAddedByVendor();
      //this.getTopNavigationColor(this.userId);
      this.guideHomeUrl = this.authenticationService.DOMAIN_URL + 'home/help/guides';
    }catch(error) {this.logger.error('error'+error); }
  }
  getDashboardType(){
    this.userService.getDashboardType().
    subscribe(
      data=>{
        let filteredDashboardTypes:Array<any>;
        if(data!=undefined && data.length>0){
          if(this.currentUrl.endsWith('welcome') || this.currentUrl.endsWith('welcome/')){
            filteredDashboardTypes = this.refService.filterArrayList(data,'Welcome');
          }else if(this.currentUrl.endsWith('dashboard') || this.currentUrl.endsWith('dashboard/')){
            filteredDashboardTypes = this.excludeDashboardAndAdvancedDashboard(data,filteredDashboardTypes);
          }else if(this.currentUrl.endsWith('detailed') || this.currentUrl.endsWith('detailed/')){
            filteredDashboardTypes = this.refService.filterArrayList(data,'Detailed Dashboard');
          }else{
            if(this.refService.userDefaultPage=="WELCOME"){
              filteredDashboardTypes = this.refService.filterArrayList(data,'Welcome');
            }else if(this.refService.userDefaultPage=="DASHBOARD"){
              filteredDashboardTypes = this.excludeDashboardAndAdvancedDashboard(data,filteredDashboardTypes);
            }else{
              filteredDashboardTypes = data;
            }
          }
        }
        this.dashboardTypes = filteredDashboardTypes;
        this.authenticationService.dashboardTypes = data;
      },error=>{
        this.logger.error(error);
      }
    );
  }

  excludeDashboardAndAdvancedDashboard(data:any,filteredDashboardTypes:any){
    if(data.indexOf('Dashboard')>-1){
      filteredDashboardTypes = this.refService.filterArrayList(data,'Dashboard');
    }else if(data.indexOf('Advanced Dashboard')>-1){
      filteredDashboardTypes = this.refService.filterArrayList(data,'Advanced Dashboard');
    }
    return filteredDashboardTypes;
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
  }


  openRequestAsVendorModal(){
      this.isShowCKeditor = true;
      CKEDITOR.config.height = '300px';
      CKEDITOR.config.baseFloatZIndex = 1E5;
      this.vendoorInvitation.subject = "Check out xAmplify's marketing automation platform"
      this.vendoorInvitation.message = "Hi There," + "<br><br>" + "As one of your channel partners, I wanted to tell you about this great new marketing automation platform that has made redistributing campaigns so much more efficient and effective for me. It's called xAmplify and I really think you should check it out."

          + "<br><br>" + "You see, once a vendor uses xAmplify to share an email, video, or social media campaign with me, I can log in and redistribute it in just a few clicks. I then get access to end-user metrics on every email and video campaign (opens, clicks, views, watch times) to easily prioritize who to follow up with. Plus, there are other useful features like automatic co-branding and deal registration all built into a single platform."

          + "<br><br>" + "It'd be great if I could redistribute your content via xAmplify. Like I said, it's made a real impact on my other co-marketing efforts and it would be awesome for our partnership to experience the same success."

          + "<br><br>" + "Visit " + "<a href='www.xamplify.com'>" + "www.xamplify.com" + "</a>" + " to learn more, or feel free to ask me questions about how it works on my end."

          + "<br><br>" + "Best, " + "<br><br>"

          + this.authenticationService.user.firstName

          + "<br>" + this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName

          + "<br>" + this.authenticationService.user.companyName

          $( '#requestForVendor' ).modal( 'show' );
  }

  validateVendoorInvitation(){
      if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.emailIds){
          this.isValidVendorInvitation = true;
      }else{
          this.isValidVendorInvitation = false;
      }
  }
  sendRequestForVendorEmail(){
      this.loading = true;
      this.isError = false;
      this.refService.onAddingEmailIds(this.emailIds);
		let self = this;
	$.each(this.emailIds,function(_index:number,value:any){
		let emailId = value.value;
		self.vendoorInvitation.emailIds.push(emailId);
	});
     if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.emailIds.length != 0 ){
      this.dashboardService.sendVendorInvitation(this.authenticationService.getUserId(), this.vendoorInvitation)
        .subscribe(
          data => {
              this.isValidationMessage = true;
              if(data.statusCode === 200){
                this.customResponse = new CustomResponse( 'SUCCESS', "Vendor invitation has been sent successfully.", true );
              }else if(data.statusCode === 417){
                this.customResponse = new CustomResponse( 'ERROR', data.data[0].message, true );
              }
              else{
                  this.customResponse = new CustomResponse( 'ERROR', "Mail sending failed! something went wrong please try after some time.", true );
              }
            this.loading = false;
           // this.closeInvitationModal()
          },
          error => {console.log(error)
            this.loading = false;
            //this.closeInvitationModal();
            this.customResponse = new CustomResponse( 'ERROR', "Mail sending failed! something went wrong please try after some time.", true );
          },
          () => {
            this.loading = false;
            //this.closeInvitationModal();
          }
        );
      }else{
          this.isError = true;
          this.loading = false;
          $('#requestForVendor').animate({ scrollTop: 0 }, 'fast');
          $("#requestForVendor").scrollTop(0);
      }
  }

  closeInvitationModal() {
      $('#requestForVendor').modal('hide');
      this.vendoorInvitation.emailIds = [];
      this.emailIds = [];
      this.isValidationMessage = false;
  }

  goBackToAdminPanel(){
    this.utilService.addLoginAsLoader();
    this.loading = true;
    let adminEmailId = JSON.parse(localStorage.getItem('loginAsUserEmailId'));
    this.refService.loaderFromAdmin = true;
    this.dashboardService.getVendorsMyProfile(adminEmailId)
    .subscribe(
      response => {
        localStorage.removeItem('loginAsUserId');
        localStorage.removeItem('loginAsUserEmailId');
        /***Removing Team Member Local Stoarage**********/
        localStorage.removeItem('adminId');
				localStorage.removeItem('adminEmailId');
        this.utilService.setUserInfoIntoLocalStorage(adminEmailId, response);
        let self = this;
        setTimeout(function () {
          self.router.navigate(['home/dashboard/admin-report'])
            .then(() => {
              window.location.reload();
            })
        }, 500);
      },
      (error: any) => {
        this.refService.showSweetAlertErrorMessage("Unable to Go back to admin panel.Please try after sometime");
        this.loading = false;
        this.refService.loaderFromAdmin = false;
      },
      () => this.logger.info('Finished goBackToAdminPanel()')
    );
  }
  
  getAllPreferredLanguages(userPreferredLangId: string) {    
    let preferredLangFilePath = 'assets/config-files/preferred-languages.json';
    this.userService.getAllPreferredLanguages(preferredLangFilePath).subscribe(result => {
      this.authenticationService.allLanguagesList = result.languages;
      if(userPreferredLangId){
        this.authenticationService.userPreferredLanguage = this.authenticationService.allLanguagesList.find(item => item.id === userPreferredLangId).id;
        this.authenticationService.beeLanguageCode = this.authenticationService.allLanguagesList.find(item => item.id === userPreferredLangId).beeId;
      }      
    }, error => {
      console.log(error);
    });
  }

  selectedLanguage(langCode:any){
    this.authenticationService.userPreferredLanguage= langCode;
    this.translateService.use(langCode);
  }

  navigateToDashboardType(dashboardType: string) {
    if (dashboardType == "Detailed Dashboard") {
      this.delayAndNavigate('/home/dashboard/detailed');
    } else if (dashboardType == "Welcome") {
      this.delayAndNavigate('/home/dashboard/welcome');
    } else if (dashboardType == "Advanced Dashboard" || dashboardType == "Dashboard") {
      this.delayAndNavigate('/home/dashboard');
    }

  }

  goToRouter(url:string){
    this.delayAndNavigate(url);
}

// getting loading from here
delayAndNavigate(url:string){
  this.authenticationService.module.topNavBarLoader = true;
  let self = this;
    setTimeout(()=>{     
      self.refService.goToRouter(url);
      self.authenticationService.module.topNavBarLoader = false;          
		}, 500);
  }
//
  
navigateToCompanyProfile(url:string,companyProfileCreated:boolean){
  if(companyProfileCreated){
    this.refService.goToRouter(url);
  }else{
    this.refService.goToRouter("/home/dashboard/add-company-profile");
  }
}

 



  

  /****Add Leads****/
  navigateAndOpenAddLeadsModalPopUp(){
    this.authenticationService.module.navigatedFromMyProfileSection = true;
    this.refService.goToRouter("/home/leads/manage");
  }

  /****Add Deals****/
  navigateAndOpenAddDealsModalPopUp(){
    this.authenticationService.module.navigatedFromMyProfileSection = true;
    this.refService.goToRouter("/home/deal/manage");

  }
}
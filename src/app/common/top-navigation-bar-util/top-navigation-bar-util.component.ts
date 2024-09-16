import { Component, OnInit, Input, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import "rxjs/add/observable/of";
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import {  FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SocialService } from '../../social/services/social.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { Roles } from '../../core/models/roles';
import { Properties } from '../../common/models/properties';
import { CustomResponse } from '../../common/models/custom-response';
import { VendorInvitation } from '../../dashboard/models/vendor-invitation';
import { DashboardService } from "../../dashboard/dashboard.service";
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { CustomSkin } from 'app/dashboard/models/custom-skin';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { LEAD_CONSTANTS } from 'app/constants/lead.constants';
import { DEAL_CONSTANTS } from 'app/constants/deal.constants';

import {  DoCheck,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { MenuItem } from 'app/core/models/menu-item';
import { UserService } from 'app/core/services/user.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { Module } from 'app/core/models/module';

declare var $:any, CKEDITOR:any;

@Component({
  selector: 'app-top-navigation-bar-util',
  templateUrl: './top-navigation-bar-util.component.html',
  styleUrls: ['./top-navigation-bar-util.component.css'],
  providers: [Properties, VendorInvitation]

})
export class TopNavigationBarUtilComponent implements OnInit,DoCheck {
  readonly LEAD_CONSTANTS = LEAD_CONSTANTS;
  readonly DEAL_CONSTANTS = DEAL_CONSTANTS;
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
  public validators = [this.must_be_email.bind(this)];
  public errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
  public onAddedFunc = this.beforeAdd.bind(this);
  private addFirstAttemptFailed = false;
   @Input() model = { 'displayName': '', 'profilePicutrePath': 'assets/images/icon-user-default.png' };
  sourceType = "";
  isLoggedInFromAdminSection = false;
  dashboardTypes = [];
  loadTopNavBar = false;
  result: any;
  userId: number;
  cskin: CustomSkin = new CustomSkin();
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
  guideHomeUrl: any;

  isScrolled: boolean = false;
  isRegisterDealEnabled:boolean = true;
  isReferVendorOptionEnabledForVanity = false;
//left menu
	isLoggedInFromAdminPortal: boolean;
	menuItem: MenuItem = new MenuItem();
	menuItemError = false;
	contentDivs: Array<boolean> = new Array<boolean>();
	prmContentDivs: Array<boolean> = new Array<boolean>();
	isSuperAdmin = false;
	emailtemplates: boolean;
	contacts: boolean;
	partners: boolean;
	campaigns: boolean;
	videos: boolean;
	forms: boolean;
	landingPages: boolean;
	mdf: boolean;
	dam: boolean;
	assignLeads: boolean;
	deals: any;
	sharedLeads: boolean;
	lms: any;
	playbook: boolean;
	backgroundColor: any;
	customNamePartners = "Partners";

	subMenuMergeTag = ["partners","contacts","assignLeads","campaigns","opportunities"]; 
	/*** XNFR-134***/
	skin:CustomSkin = new CustomSkin();
	showWorkFlow = false;
	/*** XNFR-224***/
	/*** XNFR-276***/
	public menuItems:Array<any> =  [];
	mergeTag: any;
	clickedMergeTag: string;
  displayedItems: any[] = [];
  showAll: boolean = false;
  displayedMoreItems: any[] = [];
  itemsToShow: number = 3;
  isWelcomePageActive:boolean = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 100;
  }
  constructor(public dashboardService: DashboardService, public router: Router, public userService: UserService, public utilService: UtilService,
    public socialService: SocialService, public authenticationService: AuthenticationService,
    public refService: ReferenceService, public logger: XtremandLogger, public properties: Properties, private translateService: TranslateService,
    private vanityServiceURL: VanityURLService, private integrationService: IntegrationService,
    private renderer2: Renderer2, @Inject(DOCUMENT) private _document:any,public location: Location, public referenceService: ReferenceService
		, private dashBoardService: DashboardService) {
    try {
      if (this.authenticationService.isLocalHost() || this.authenticationService.isQADomain()) {
      }
      this.isLoggedInFromAdminSection = this.utilService.isLoggedInFromAdminPortal();
      this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
      this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
      if(this.isLoggedInAsPartner || this.isLoggedInAsTeamMember) {
        $('.page-header-fixed .page-container').css('margin-top', '110px');
        $('.xamplify-welcome-page-div-top').css('margin-top', '90px')
      }
      this.currentUrl = this.router.url;
      const userName = this.authenticationService.user.emailId;
      this.loggedInAsUserEmailId = userName;
      if (this.isLoggedInAsTeamMember) {
        this.vendorAdminCompanyUserEmailId = this.utilService.getLoggedInAdminCompanyEmailId();
      } else {
        this.vendorAdminCompanyUserEmailId = this.utilService.getLoggedInVendorAdminCompanyEmailId();
      }
      this.userId = this.authenticationService.getUserId();
      /*** XNFR-134** */
      this.vanityLoginDto.userId = this.userId;
      let companyProfileName = this.authenticationService.companyProfileName;
      if (companyProfileName !== undefined && companyProfileName !== "") {
        this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
        this.vanityLoginDto.vanityUrlFilter = true;
      } else {
        this.vanityLoginDto.vanityUrlFilter = false;
      }

      this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
      this.isLoggedInAsPartner = this.utilService.isLoggedAsPartner();
      this.sourceType = this.authenticationService.getSource();
      this.isLoggedInFromAdminPortal = this.utilService.isLoggedInFromAdminPortal();
      this.isSuperAdmin = this.authenticationService.getUserId() == 1;
      /*** XNFR-134***/
      this.userId = this.authenticationService.getUserId();
      this.vanityLoginDto.userId = this.userId;
     


      if (userName != undefined) {
        this.sourceType = this.authenticationService.getSource();
        if (this.refService.topNavbarUserService === false || this.utilService.topnavBareLoading === false) {
          this.refService.topNavbarUserService = true;
          this.utilService.topnavBareLoading = true;
          this.userService.getUserByUserName(userName).
            subscribe(
              data => {
                this.translateService.use(data.preferredLanguage);
                this.getAllPreferredLanguages(data.preferredLanguage);
                if (this.vanityServiceURL.isVanityURLEnabled()) {
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
        if (roles != undefined) {
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
          if (roles.indexOf(this.roleName.vendorRole) > -1) {
            this.authenticationService.module.isVendor = true;
          }
          if (roles.indexOf(this.roleName.vendorTierRole) > -1) {
            this.authenticationService.module.isVendorTier = true;
          }
          if (roles.indexOf(this.roleName.marketingRole) > -1) {
            this.authenticationService.module.isMarketing = true;
          }
          if (roles.indexOf(this.roleName.prmRole) > -1) {
            this.authenticationService.module.isPrm = true;
          }
        }
      } else {
        this.authenticationService.logout();
      }
    } catch (error) { this.logger.error('error' + error); }
  }
  errorHandler(event: any) {
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
    if (tag['value']) { isPaste = true; tag = tag.value; }
    if (!this.validateEmail(tag)) {
      if (!this.addFirstAttemptFailed) {
        this.addFirstAttemptFailed = true;
        if (!isPaste) { this.tagInput.setInputValue(tag); }
      }
      if (isPaste) { return Observable.throw(this.errorMessages['must_be_email']); }
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

  connectToWebSocket() {

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
    try {
      this.userService.getUnreadNotificationsCount(this.authenticationService.getUserId())
        .subscribe(
          data => {
            this.userService.unreadNotificationsCount = data;
          },
          error => this.logger.log(error),
          () => this.logger.log('Finished')
        );
    } catch (error) { this.logger.error('error' + error); }
  }

  isAddedByVendor() {
    try {
      this.userService.isAddedByVendor(this.authenticationService.getUserId())
        .subscribe(
          data => {
            this.authenticationService.isAddedByVendor = data;
          },
          error => this.logger.log(error),
          () => this.logger.log('Finished')
        );
    } catch (error) { this.logger.error('error' + error); }
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
      (response) => {
        if (response.statusCode == 200) {
          this.vendorCount = response.data;
        }
        this.myVendorsLoader = false;
      }, error => {
        this.myVendorsLoader = false;
      }
    )
  }

  onRightClick(event) {
    return false;
  }
  ngOnDestroy() {
    this.isShowCKeditor = false;

    $('#requestForVendor').modal('hide');
  }
  ngOnInit() {
    try {
      this.getDashboardType();
      this.getUnreadNotificationsCount();
      this.getRoles();
      this.isAddedByVendor();
      this.guideHomeUrl = this.authenticationService.DOMAIN_URL + 'home/help/guides';
      this.getVendorRegisterDealValue();
      this.getReferVendorOption();

      this.findMenuItems();
      this.getMergeTagByPath();
      this.isWelcomePageActive =this.router.url.includes('/welcome-page');
      this.model = this.refService.topNavBarUserDetails;

 
    } catch (error) { this.logger.error('error' + error); }
  }
  getReferVendorOption() {
    if(this.vanityLoginDto.vanityUrlFilter){
      this.dashboardService.isReferVendorOptionEnabled(this.vanityLoginDto).subscribe(
        response=>{
            this.isReferVendorOptionEnabledForVanity = response.data;
        },error=>{
          this.isReferVendorOptionEnabledForVanity = false;
        });
    }
   
  }
  getDashboardType() {
    this.userService.getDashboardType().
      subscribe(
        data => {
          let filteredDashboardTypes: Array<any>;
          if (data != undefined && data.length > 0) {
            if (this.currentUrl.endsWith('welcome') || this.currentUrl.endsWith('welcome/')) {
              filteredDashboardTypes = this.refService.filterArrayList(data, 'Welcome');
            } else if (this.currentUrl.endsWith('dashboard') || this.currentUrl.endsWith('dashboard/')) {
              filteredDashboardTypes = this.excludeDashboardAndAdvancedDashboard(data, filteredDashboardTypes);
            } else if (this.currentUrl.endsWith('detailed') || this.currentUrl.endsWith('detailed/')) {
              filteredDashboardTypes = this.refService.filterArrayList(data, 'Detailed Dashboard');
            } else {
              if (this.refService.userDefaultPage == "WELCOME") {
                filteredDashboardTypes = this.refService.filterArrayList(data, 'Welcome');
              } else if (this.refService.userDefaultPage == "DASHBOARD") {
                filteredDashboardTypes = this.excludeDashboardAndAdvancedDashboard(data, filteredDashboardTypes);
              } else {
                filteredDashboardTypes = data;
              }
            }
          }
          this.dashboardTypes = filteredDashboardTypes;
          this.authenticationService.dashboardTypes = data;
        }, error => {
          this.logger.error(error);
        }
      );
  }

  excludeDashboardAndAdvancedDashboard(data: any, filteredDashboardTypes: any) {
    if (data.indexOf('Dashboard') > -1) {
      filteredDashboardTypes = this.refService.filterArrayList(data, 'Dashboard');
    } else if (data.indexOf('Advanced Dashboard') > -1) {
      filteredDashboardTypes = this.refService.filterArrayList(data, 'Advanced Dashboard');
    }
    return filteredDashboardTypes;
  }

  lockScreen() {
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


  openRequestAsVendorModal() {
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

    $('#requestForVendor').modal('show');
  }

  validateVendoorInvitation() {
    if (this.vendoorInvitation.message.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.emailIds) {
      this.isValidVendorInvitation = true;
    } else {
      this.isValidVendorInvitation = false;
    }
  }
  sendRequestForVendorEmail() {
    this.loading = true;
    this.isError = false;
    this.refService.onAddingEmailIds(this.emailIds);
    let self = this;
    $.each(this.emailIds, function (_index: number, value: any) {
      let emailId = value.value;
      self.vendoorInvitation.emailIds.push(emailId);
    });
    if (this.vendoorInvitation.message.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.subject.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.vendoorInvitation.emailIds.length != 0) {
      this.dashboardService.sendVendorInvitation(this.authenticationService.getUserId(), this.vendoorInvitation)
        .subscribe(
          data => {
            this.isValidationMessage = true;
            if (data.statusCode === 200) {
              this.customResponse = new CustomResponse('SUCCESS', "Vendor invitation has been sent successfully.", true);
            } else if (data.statusCode === 417) {
              this.customResponse = new CustomResponse('ERROR', data.data[0].message, true);
            }
            else {
              this.customResponse = new CustomResponse('ERROR', "Mail sending failed! something went wrong please try after some time.", true);
            }
            this.loading = false;
            // this.closeInvitationModal()
          },
          error => {
            console.log(error)
            this.loading = false;
            //this.closeInvitationModal();
            this.customResponse = new CustomResponse('ERROR', "Mail sending failed! something went wrong please try after some time.", true);
          },
          () => {
            this.loading = false;
            //this.closeInvitationModal();
          }
        );
    } else {
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

  goBackToAdminPanel() {
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
      if (userPreferredLangId) {
        this.authenticationService.userPreferredLanguage = this.authenticationService.allLanguagesList.find(item => item.id === userPreferredLangId).id;
        this.authenticationService.beeLanguageCode = this.authenticationService.allLanguagesList.find(item => item.id === userPreferredLangId).beeId;
      }
    }, error => {
      console.log(error);
    });
  }

  selectedLanguage(langCode: any) {
    this.authenticationService.userPreferredLanguage = langCode;
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

  goToRouter(url: string) {
    this.delayAndNavigate(url);
  }

  // getting loading from here
  delayAndNavigate(url: string) {
    this.authenticationService.module.topNavBarLoader = true;
    let isWelcomePage = this.router.url.includes('/welcome-page')
    let self = this;
    setTimeout(() => {
      self.router.navigate([url]).then(() => {
        // Reload the page (optional, Angular should handle route changes without a full reload)
        if(isWelcomePage){
          window.location.reload();
          self.referenceService.isWelcomePageLoading = true;
        }
      });
      self.authenticationService.module.topNavBarLoader = false;
    }, 500);
  }
  //

  navigateToCompanyProfile(url: string, companyProfileCreated: boolean) {
    let isWelcomePage = this.router.url.includes('/welcome-page')
    if (companyProfileCreated) {
        this.router.navigate([url]).then(() => {
          // Reload the page (optional, Angular should handle route changes without a full reload)
          if(isWelcomePage){
            window.location.reload();
            this.referenceService.isWelcomePageLoading = true;
          }
        });
      
    } else {
      this.router.navigate(["/home/dashboard/add-company-profile"]).then(() => {
        // Reload the page (optional, Angular should handle route changes without a full reload)
        if(isWelcomePage){
          window.location.reload();
          this.referenceService.isWelcomePageLoading = true;
        }
      });

    }
  }

  /****Add Leads****/
  navigateAndOpenAddLeadsModalPopUp() {
    this.authenticationService.module.navigatedFromMyProfileSection = true;
    //this.refService.goToRouter("/home/leads/manage");
    let isWelcomePage = this.router.url.includes('/welcome-page')
        this.router.navigate(["/home/leads/manage"]).then(() => {
          if(isWelcomePage){
            window.location.reload();
          }
        });
  }

  /****Add Deals****/
  navigateAndOpenAddDealsModalPopUp() {
    this.authenticationService.module.navigatedFromMyProfileSection = true;
    let isWelcomePage = this.router.url.includes('/welcome-page')
        this.router.navigate(["/home/deal/manage"]).then(() => {
          if(isWelcomePage){
            window.location.reload();
          }
        });
  }
  // header navbar start
  isNavbarBackgroundVisible: boolean = false;
  isMaintenance:boolean = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollY = window.scrollY;
    if(scrollY>0){
   this.isMaintenance = false;
    } else {
      this.isMaintenance = true;
    }
    this.isNavbarBackgroundVisible = scrollY > 50;
  }
   
  getVendorRegisterDealValue() {
    if (this.authenticationService.vanityURLEnabled) {
      this.integrationService.getVendorRegisterDealValue(this.userId,this.vanityLoginDto.vendorCompanyProfileName).subscribe(
        data => {
          if (data.statusCode == 200) {
            this.isRegisterDealEnabled = data.data;
          }
        }
      )
    }
  }

  openSidebar() {
    let navLinks = document.querySelector(".nav-link") as HTMLElement | null;
    if (navLinks) {
      navLinks.style.left = "0";
    }
    //document.querySelector(".navbar-navs .fa-bars").addEventListener("click", this.openSidebar);
  }
  closeSidebar() {
    let navLinks = document.querySelector(".nav-link") as HTMLElement | null;
    if (navLinks) {
      navLinks.style.left = "-100%";
    }
  }



  findMenuItems() {
		this.loading = true;
		let module = this.authenticationService.module;
		module.contentLoader = true;
		let vanityUrlPostDto = {};
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			vanityUrlPostDto['vendorCompanyProfileName'] = this.authenticationService.companyProfileName;
			vanityUrlPostDto['vanityUrlFilter'] = true;
		}
		vanityUrlPostDto['userId'] = this.authenticationService.getUserId();
		vanityUrlPostDto['loginAsUserId'] = this.utilService.getLoggedInVendorAdminCompanyUserId();
		//XNFR-276
		this.mergeTag = this.getMergeTagByPath();
		vanityUrlPostDto['mergeTag'] = this.mergeTag;
		this.dashBoardService.listLeftSideNavBarItems(vanityUrlPostDto)
			.subscribe(
				data => {
					this.menuItem.companyProfileCreated = data.companyProfileCreated;
					module.companyProfileCreated = data.companyProfileCreated;
					this.menuItem.accountDashboard = data.accountDashboard;
					this.menuItem.partners = data.partners;
					module.isPartner = data.partners;
					module.isOnlyPartnerCompany = data.onlyPartnerCompany;
					module.showAddLeadsAndDealsOptionInTheDashboard = data.showAddLeadsAndDealsOptionsInDashboard;
					this.setContentMenu(data, module);
					this.menuItem.contacts = data.contacts;
					this.menuItem.shareLeads = data.shareLeads;
					this.authenticationService.module.hasShareLeadAccess = data.shareLeads;
					this.menuItem.sharedLeads = data.sharedLeads;
					this.menuItem.pagesAccessAsPartner = data.pagesAccessAsPartner;

					this.setDesignMenu(data,module);

					this.menuItem.campaign = data.campaign;
					this.authenticationService.module.createCampaign = data.campaign;
					this.menuItem.campaignAccessAsPartner = data.redistribute;
					module.isCampaign = data.campaign || data.redistribute;
					module.showCampaignOptionInManageVideos = data.campaign;
					module.isReDistribution = data.redistribute;
					module.hasLandingPageCampaignAccess = data.pageCampaign;

					module.isStats = data.stats;

					this.menuItem.opportunities = data.opportunities;
					module.hasOpportunityRole = data.opportunities;
					this.menuItem.opportunitiesAccessAsPartner = data.opportunitiesAccessAsPartner;
					module.opportunitiesAccessAsPartner = data.opportunitiesAccessAsPartner;
					this.authenticationService.enableLeads = data.opportunities;

					this.menuItem.socialFeeds = data.rssFeeds;
					this.menuItem.socialFeedsAccessAsPartner = data.rssFeedsAccessAsPartner;
					module.hasSocialStatusRole = data.socialShare;

					this.menuItem.mdf = data.mdf;
					this.menuItem.mdfAccessAsPartner = data.mdfAccessAsPartner;
					
					this.menuItem.team = data.team;

					this.setAuthenticationServiceVariables(module,data);

					const roles = this.authenticationService.getRoles();
					this.authenticationService.isCompanyPartner = roles.indexOf(this.roleName.companyPartnerRole) > -1;
					module.isCompanyPartner = roles.indexOf(this.roleName.companyPartnerRole) > -1;
					module.isOrgAdmin = roles.indexOf(this.roleName.orgAdminRole) > -1;
					module.isVendor = roles.indexOf(this.roleName.vendorRole) > -1;
					module.isPrm = roles.indexOf(this.roleName.prmRole) > -1;
					module.isMarketing = roles.indexOf(this.roleName.marketingRole) > -1;
					module.isVendorTier = roles.indexOf(this.roleName.vendorTierRole) > -1;
					this.addZendeskScript(data);
					/*****XNFR-84 **********/
					if(data.moduleNames!=undefined && data.moduleNames.length>0 && data.moduleNames!=null){
						this.authenticationService.moduleNames = data.moduleNames;
						this.authenticationService.partnerModule = this.authenticationService.moduleNames[0];
						this.customNamePartners = this.authenticationService.partnerModule.customName;
						localStorage.setItem('partnerModuleCustomName',this.customNamePartners);
					}else{
						this.authenticationService.partnerModule.customName = "Partners";
						this.customNamePartners = this.authenticationService.partnerModule.customName;
						localStorage.setItem('partnerModuleCustomName',this.customNamePartners);
					}
					this.authenticationService.module.loggedInThroughOwnVanityUrl = data.loggedInThroughOwnVanityUrl;
					this.authenticationService.module.loggedInThroughVendorVanityUrl = data.loggedInThroughVendorVanityUrl;
					this.authenticationService.module.loggedInThroughXamplifyUrl = data.loggedInThroughXamplifyUrl;
					this.authenticationService.module.adminOrSuperVisor = data.adminOrSuperVisor;
					this.authenticationService.module.deletedPartner = data.deletedPartner;
					this.authenticationService.module.upgradeToMarketing = data.upgradeToMarketing;
					this.authenticationService.module.loginAs = data.loginAs;
					/*****XNFR-130*****/
					this.authenticationService.module.prmDashboard = data.prmDashboard;
					/***XBI-1533**/
					this.authenticationService.module.isAdmin = data.admin;
					this.authenticationService.module.isPartnerAdmin = data.partnerAdmin;
					this.authenticationService.module.isTeamMember = data.teamMember;
					this.authenticationService.module.isPartnerCompany = data.partnerCompany;
					this.authenticationService.module.isAdminAndPartnerCompany = data.adminAndPartnerCompany;
					/*****XNFR-224*****/
					this.authenticationService.module.loginAsPartner = data.loginAsPartner;
					this.authenticationService.module.showSupportSettingOption = data.showSupportSettingOption;
					let loginAsPartnerOptionEnabledForVendor = data.loginAsPartnerOptionEnabledForVendor;
					if(this.isLoggedInAsPartner && !loginAsPartnerOptionEnabledForVendor){
						this.referenceService.showSweetAlertProcessingLoader("Login as is not available for this account. We are redirecting you to the login page.");
						setTimeout(() => {
							this.authenticationService.logout();
						}, 7000);
					}
					this.authenticationService.module.showAddLeadOrDealButtonInMyProfileSection = data.showAddLeadOrDealButtonInMyProfileSection;
					this.authenticationService.module.navigateToPartnerSection = data.navigateToPartnerViewSection;
					//XNFR-276
          this.menuItems = data.menuItems;
/*           this.displayedItems = this.menuItems.slice(0, 4);
          console.log(this.displayedItems)
          this.displayedMoreItems = this.menuItems.slice(4, this.menuItems.length)
          console.log(this.displayedMoreItems) */

				},
				error => {
					let statusCode = JSON.parse(error['status']);
					if (statusCode == 401) {
						this.loading = false;
						this.authenticationService.revokeAccessToken();
					} else if (statusCode == 500) {
						this.loading = false;
						this.menuItemError = true;
					}
				},
				() => {
					this.loading = false;
					module.contentLoader = false;
					this.authenticationService.leftSideMenuLoader = false;
					this.menuItemError = false;
				}
			);
	}

	setAuthenticationServiceVariables(module: Module, data: any) {
		module.isContact = data.contacts;
		module.showCampaignsAnalyticsDivInDashboard = data.showCampaignsAnalyticsDivInDashboard;
		this.authenticationService.contactsCount = data.contactsCount;
		module.damAccess = data.dam;
		module.damAccessAsPartner = data.damAccessAsPartner;
		module.isPartnershipEstablishedOnlyWithVendorTier = data.partnershipEstablishedOnlyWithVendorTier;
		let roleDisplayDto = data.roleDisplayDto;
		module.isOnlyPartner = roleDisplayDto.partner;
		module.partnerTeamMember = roleDisplayDto.partnerTeamMember;
		module.isPrm = roleDisplayDto.prm;
		module.isPrmTeamMember = roleDisplayDto.prmTeamMember;
		module.isPrmAndPartner = roleDisplayDto.prmAndPartner;
		module.isPrmAndPartnerTeamMember = roleDisplayDto.prmAndPartnerTeamMember;
		module.isVendorTier = roleDisplayDto.vendorTier;
		module.isVendorTierTeamMember = roleDisplayDto.vendorTierTeamMember;
		module.isVendorTierAndPartner = roleDisplayDto.vendorTierAndPartner;
		module.isVendorTierAndPartnerTeamMember = roleDisplayDto.vendorTierAndPartnerTeamMember;
		module.isPrmSuperVisor = roleDisplayDto.prmSuperVisor;
		module.isMarketingSuperVisor = roleDisplayDto.marketingSuperVisor;
		this.authenticationService.isVendorAndPartnerTeamMember = roleDisplayDto.vendorAndPartnerTeamMember;
		this.authenticationService.isVendorTeamMember = roleDisplayDto.vendorTeamMember;
		this.authenticationService.isVendorSuperVisor = roleDisplayDto.vendorSuperVisor;
		this.authenticationService.isOrgAdminSuperVisor = roleDisplayDto.orgAdminSuperVisor;
		this.authenticationService.isOrgAdminAndPartnerTeamMember = roleDisplayDto.orgAdminAndPartnerTeamMember;
		this.authenticationService.isOrgAdminTeamMember = roleDisplayDto.orgAdminTeamMember;
		this.authenticationService.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner = data.partnershipEstablishedOnlyWithPrmAndLoggedInAsPartner;
		this.authenticationService.partnershipEstablishedOnlyWithPrm = data.partnershipEstablishedOnlyWithPrm;
		this.authenticationService.folders = data.folders;
		this.authenticationService.lmsAccess = data.lms;
		this.authenticationService.leadsAndDeals = data.opportunities;
		this.authenticationService.mdf = data.mdf;
		this.authenticationService.mdfAccessAsPartner = data.mdfAccessAsPartner;
		module.hasPartnerLandingPageAccess = data.pagesAccessAsPartner;
		module.playbookAccess = data.playbook;
		module.playbookAccessAsPartner = data.playbookAccessAsPartner;
		module.showContent = data.content;
		module.showPartnerEmailTemplatesFilter = (roleDisplayDto.vendorTierAndPartner || roleDisplayDto.vendorTierAndPartnerTeamMember || roleDisplayDto.vendorAndPartner || roleDisplayDto.vendorAndPartnerTeamMember || roleDisplayDto.orgAdminAndPartner || roleDisplayDto.orgAdminAndPartnerTeamMember);
		module.isPartnerSuperVisor = roleDisplayDto.partnerSuperVisor;
		module.isAnyAdminOrSupervisor = roleDisplayDto.anyAdminOrSuperVisor;
		module.allBoundSamlSettings = data.allBoundSamlSettings;
		module.notifyPartners = data.notifyPartners;
		module.isMarketingTeamMember = roleDisplayDto.marketingTeamMember;
		module.isMarektingAndPartner = roleDisplayDto.marketingAndPartner;
    	module.isMarketingAndPartnerTeamMember = roleDisplayDto.marketingAndPartnerTeamMember;
		module.isMarketingCompany = module.isMarketing || module.isMarketingTeamMember || module.isMarektingAndPartner || module.isMarketingAndPartnerTeamMember;
		module.isPrmCompany = module.isPrm || module.isPrmTeamMember || module.isPrmAndPartner || module.isPrmAndPartnerTeamMember;
		module.isOrgAdminCompany = roleDisplayDto.orgAdmin || roleDisplayDto.orgAdminTeamMember || roleDisplayDto.orgAdminAndPartner || roleDisplayDto.orgAdminAndPartnerTeamMember;
		/****XNFR-326****/
		module.emailNotificationSettings = data.emailNotificationSettings;
		module.showWorkFlow = data.createWorkflow;
		module.ssoEnabled = data.ssoEnabled;
		/****XNFR-583****/
		module.vendorPagesEnabled = data.vendorPagesEnabled;
		module.chatGptIntegrationEnabled = data.chatGptIntegrationEnabled;
	}

	setContentMenu(data: any, module: any) {
		this.menuItem.content = data.content;
		module.showContent = data.content;
		module.isVideo = data.videos;
		module.damAccess = data.dam;
		module.damAccessAsPartner = data.damAccessAsPartner;
		module.lmsAccess = data.lms;
		module.lmsAccessAsPartner = data.lmsAccessAsPartner;
		module.playbookAccess = data.playbook;
		module.playbookAccessAsPartner = data.playbookAccessAsPartner;
		if (data.content) {
			this.contentDivs.push(module.damAccess || module.damAccessAsPartner);
			this.contentDivs.push(module.lmsAccess || module.lmsAccessAsPartner);
			this.contentDivs.push(module.playbookAccess || module.playbookAccessAsPartner);
			const count = this.contentDivs.filter((value) => value).length;
			module.contentDivsCount = count;
			this.prmContentDivs.push(module.damAccess || module.damAccessAsPartner);
			this.prmContentDivs.push(module.lmsAccess || module.lmsAccessAsPartner);
			this.prmContentDivs.push(module.playbookAccess || module.playbookAccessAsPartner);
			module.prmContentDivsCount = this.prmContentDivs.filter((value) => value).length;
		} else {
			module.contentDivsCount = 0;
			module.prmContentDivsCount = 0;
		}
		/***XBI-2313***/
		module.isInstanceNavigationLinksOptionDisplayed = module.damAccess || module.damAccessAsPartner || module.lmsAccess || module.lmsAccessAsPartner 
														|| module.playbookAccess || module.playbookAccessAsPartner;
	}

	setDesignMenu(data: any,module:any) {
		this.menuItem.design = data.design;
		this.menuItem.emailTemplates = data.emailTemplates;
		this.menuItem.forms = data.forms;
		this.menuItem.pages = data.pages;
		module.isEmailTemplate = data.emailTemplates;
		module.hasFormAccess = data.forms;
		module.hasLandingPageAccess = data.pages;
		
	}

	

	addZendeskScript(data:any){
		let chatSupport = data.chatSupport;
		let chatSupportAccessAsPartner = data.chatSupportAccessAsPartner;
		if(chatSupport || chatSupportAccessAsPartner){
			var element = document.getElementById('ze-snippet');
			$('#launcher').contents().find('#Embed').show();
			if(element==null){
				const s = this.renderer2.createElement('script');
				s.type = 'text/javascript';
				s.src = 'https://static.zdassets.com/ekr/snippet.js?key=4fd51adb-a388-4f74-bfec-00878e3f02cf';
				s.text = ``;
				s.id = 'ze-snippet';
				this.renderer2.appendChild(this._document.body, s);
			}
		}else{
			this.authenticationService.removeZenDeskScript();
			
		}
	}	

	ngDoCheck() {
		if (window.innerWidth > 990) {
			this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, false, false, false);
		}
	}
   
	toggleSubMenu(urlType: string){
		if (window.innerWidth < 990) {
			if (urlType === this.clickedMergeTag) {
				this.clickedMergeTag = "";
			} else {
				this.clickedMergeTag = urlType;
			}
		}
	}


	openOrCloseTabs(urlType: string) {
		if (window.innerWidth < 990) {
			if (urlType === 'emailtemplates') {
				this.emailtemplates = this.router.url.includes('emailtemplates') ? true : (this.emailtemplates = !this.emailtemplates);
				this.clearSubMenuValues(this.emailtemplates, false, false, false, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'contacts') {
				this.contacts = this.router.url.includes('contacts') ? true : (this.contacts = !this.contacts);
				this.clearSubMenuValues(false, false, false, this.contacts, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'partners') {
				this.partners = this.router.url.includes('partners') ? true : (this.partners = !this.partners);
				this.clearSubMenuValues(false, false, false, false, this.partners, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'campaigns') {
				this.campaigns = this.router.url.includes('campaigns') ? true : (this.campaigns = !this.campaigns);
				this.clearSubMenuValues(false, this.campaigns, false, false, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'content') {
				this.videos = this.router.url.includes('content') ? true : (this.videos = !this.videos);
				this.clearSubMenuValues(false, false, this.videos, false, false, false, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'forms') {
				this.videos = this.router.url.includes('forms') ? true : (this.forms = !this.forms);
				this.clearSubMenuValues(false, false, false, false, false, this.forms, false, false, false, false, false, false, false, false);
			}
			else if (urlType === 'landing-pages') {
				this.videos = this.router.url.includes('forms') ? true : (this.landingPages = !this.landingPages);
				this.clearSubMenuValues(false, false, false, false, false, false, this.landingPages, false, false, false, false, false, false, false);
			}
			else if (urlType === 'mdf') {
				this.mdf = this.router.url.includes('mdf') ? true : (this.mdf = !this.mdf);
				this.clearSubMenuValues(false, false, false, false, false, false, false, this.mdf, false, false, false, false, false, false);
			}
			else if (urlType === 'dam') {
				this.dam = this.router.url.includes('dam') ? true : (this.dam = !this.dam);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, this.dam, false, false, false, false, false);
			}
			else if (urlType === 'assignleads') {
				this.assignLeads = this.router.url.includes('assignleads') ? true : (this.assignLeads = !this.assignLeads);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, true, false, false, false, false);
			}
			else if (urlType === 'opportunities') {
				this.authenticationService.module.navigatedFromMyProfileSection = false;
				this.authenticationService.module.navigateToPartnerSection = false;
				this.deals = this.router.url.includes('deal') ? true : (this.deals = !this.deals);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, this.deals, false, false, false);
			}
			else if (urlType === 'sharedleads') {
				this.sharedLeads = this.router.url.includes('sharedleads') ? true : (this.sharedLeads = !this.sharedLeads);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, this.sharedLeads, false, false);
			} else if (urlType === 'lms') {
				this.lms = this.router.url.includes('lms') ? true : (this.lms = !this.lms);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, false, this.lms, false);
			} else if (urlType === 'playbook') {
				this.playbook = this.router.url.includes('playbook') ? true : (this.playbook = !this.playbook);
				this.clearSubMenuValues(false, false, false, false, false, false, false, false, false, false, false, false, false, this.playbook);
			}
		}
	}
	clearSubMenuValues(emailTemplate, campaigs, videos, contacts, partners, forms, landingPages, mdf, dam, assignLeads, deals, sharedLeads, lms, playbook) {
		this.emailtemplates = emailTemplate; 
		this.campaigns = campaigs; 
		this.videos = videos; 
		this.contacts = contacts; 
		this.partners = partners;
		this.forms = forms; 
		this.landingPages = landingPages; 
		this.mdf = mdf; 
		this.dam = dam; 
		this.assignLeads = assignLeads; 
		this.sharedLeads = sharedLeads;
		this.deals = deals;
		this.lms = lms;
		this.playbook = playbook;
	}
	
	startLoader(){
		this.authenticationService.leftSideMenuLoader = true;
	}

	getMergeTagByPath(){
		if(this.router.url.includes('dashboard')){
            this.mergeTag = "dashboard";
			if(this.router.url.includes('myprofile')){
				this.mergeTag = "configuration";
			}	
		}
		else if(this.router.url.includes('partners')){
			this.mergeTag = "partners";
		}
		else if(this.router.url.includes('select-modules') || this.router.url.includes('content') || this.router.url.includes('dam') || this.router.url.includes('tracks') || this.router.url.includes('playbook')){
			this.mergeTag = "content";
		}
		else if(this.router.url.includes('contacts')){
			this.mergeTag = "contacts";
		}
		else if(this.router.url.includes('assignleads')){
			this.mergeTag = "assignleads";
		}
		else if(this.router.url.includes('sharedleads')){
			this.mergeTag = "sharedleads";
		}
		else if(this.router.url.includes('pages/partner') || this.router.url.includes('forms/partner')){
			this.mergeTag = "pages";
		}
		else if(this.router.url.includes('design') || this.router.url.includes('emailtemplates') || (this.router.url.includes('forms') && !this.router.url.includes('forms/partner') && !this.router.url.includes('forms/clpf') && !this.router.url.includes('/analytics/cfa')) || (this.router.url.includes('pages') && !this.router.url.includes('pages/partner') && !this.router.url.includes('campaign'))){
			this.mergeTag = "design";
		}
		else if((this.router.url.includes('campaigns') || this.router.url.includes('campaign') || this.router.url.includes('clpf') || this.router.url.includes('/analytics/cfa'))){
			this.mergeTag = "campaigns";
		}
		else if((this.router.url.includes('deal') || this.router.url.includes('leads') && !this.router.url.includes('assign') && !this.router.url.includes('dashboard') || this.router.url.includes('shared'))){
			this.mergeTag = "opportunities";
		}
		else if(this.router.url.includes('rss')){
			this.mergeTag = "social_feeds";
		}
		else if(this.router.url.includes('mdf')){
			this.mergeTag = "mdf";
		}
		else if(this.router.url.includes('team')){
			this.mergeTag = "team";
		}
		else if(this.router.url.includes('company')){
			this.mergeTag = "company";
		}		
	}
 
  navigate(menu: any) {
    // Ensure the path starts with '/home'
    this.mergeTag = menu.mergeTag;
    if(this.router.url.includes('/welcome-page')){
      this.referenceService.isWelcomePageLoading = true;
      menu.angularPath = menu.angularPath.replace(/^\.\/+/, '/');;
    const path = menu.angularPath.startsWith('/home') ? menu.angularPath : `/home${menu.angularPath}`;
    
    // Use the Angular Router to navigate
    this.router.navigate([path]).then(() => {
      // Reload the page (optional, Angular should handle route changes without a full reload)
      window.location.reload();
    });
  }else{
    menu.angularPath = menu.angularPath.replace(/^\.\/+/, '/');
    const path = menu.angularPath.startsWith('/home') ? menu.angularPath : `/home${menu.angularPath}`;
    this.router.navigate([path]);
  }
  }
  //loading:boolean = false;
  naviagteToWelcomePage(path:any) {
    this.mergeTag = 'welcomepage'
    this.router.navigate([path]).then(() => {
      // Reload the page (optional, Angular should handle route changes without a full reload)
      this.referenceService.isWelcomePageLoading = true;
      window.location.reload();
    });
  }
  
  navigateToGivenPath(path:any){
    if(this.router.url.includes('/welcome-page')){
      this.referenceService.isWelcomePageLoading = true;
    this.router.navigate([path]).then(() => {
      window.location.reload();
    });
  }else{
    this.router.navigate([path]);
  }
  }
}

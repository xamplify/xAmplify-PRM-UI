import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CompanyProfile } from '../company-profile/models/company-profile';
import { CompanyProfileService } from '../company-profile/services/company-profile.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Processor } from 'app/core/models/processor';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { CustomLoginScreen } from 'app/vanity-url/models/custom-login-screen';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { CustomLoginTemplate } from 'app/email-template/models/custom-login-template';
import { EmailTemplatePreviewUtilComponent } from 'app/util/email-template-preview-util/email-template-preview-util.component';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { EnvService } from 'app/env.service';
import { CompanyLoginTemplateActive } from 'app/email-template/models/company-login-template-active';

declare var $, swal: any;
@Component({
  selector: 'app-custom-login-screen-settings',
  templateUrl: './custom-login-screen-settings.component.html',
  styleUrls: ['./custom-login-screen-settings.component.css'],
  providers: [Properties, Processor]
})
export class CustomLoginScreenSettingsComponent implements OnInit {

  @Output() editLoginTemplate = new EventEmitter();
  @Input() saveCustomResponse: CustomResponse;
  @Input() isTemplatesListDiv;
  pagination: Pagination = new Pagination();
  companyProfile: CompanyProfile = new CompanyProfile();
  customLoginScreen: CustomLoginScreen = new CustomLoginScreen();
  customLoginScreenStyle1: CustomLoginScreen = new CustomLoginScreen();
  loggedInUserId = 0;
  bgImageFile: File;
  companyBgImagePath = "";
  companyBgImagePath2 = "";
  cropLogoImageText: string;
  squareDataForBgImage: any;
  croppedImageForBgImage: any = '';
  bgImageChangedEvent: any = '';
  cropRounded: boolean;
  companyLogoImageUrlPath = "";
  backGroundImage = "https://i.imgur.com/tgYLuLr.jpg";
  backGroundImage2 = "https://i.imgur.com/tgYLuLr.jpg";
  customResponse: CustomResponse = new CustomResponse();
  loadingcrop = false;
  logoErrorMessage = "";
  logoError = false;
  errorUploadCropper = false;
  showCropper = false;
  message = "";
  statusCode: number;
  isShowUploadScreen = false;
  @ViewChild("emailTemplatePreviewPopupComponent") emailTemplatePreviewUtilComponent: EmailTemplatePreviewUtilComponent;
  loading: boolean;
  customLoinTemplates: CustomLoginTemplate[] = [];
  aspectRatio: any;
  /**** PAginaton */
  pager: any = {};
  isShowFinalDiv: boolean;
  isStyle1: boolean = false;
  isStyle2: boolean = false;
  loginType: string;
  templateName: string;
  formPosition: string;
  styleOneBackgroundImagePath = "";
  styleTwoBackgroundImagePath = "";
  constructor(public envService: EnvService, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public properties: Properties,
    private companyProfileService: CompanyProfileService, private logger: XtremandLogger, public utilService: UtilService, public refService: ReferenceService, private vanityURLService: VanityURLService, private pagerService: PagerService, public socialPagerService: SocialPagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    if (!this.companyBgImagePath) {
      this.squareDataForBgImage = {};
    }
    if (!this.companyBgImagePath2) {
      this.squareDataForBgImage = {};
    }
    // if (this.isTemplatesListDiv) {
    //   this.styleOneBackgroundImagePath = this.authenticationService.v_companyBgImagePath2;
    //   this.showStyle1();
    //   this.isShowFinalDiv = false;
    //   $('#alertDiv').hide();
    // } else {
    this.getCompanyProfileByUserId(this.loggedInUserId)
    this.getLogInScreenDetails();
    this.getCustomLoginTemplates(this.pagination);
    this.getFinalScreenTableView();
  }
  showLoginStylesDiv() {
    this.isShowFinalDiv = false;
    if (this.loginType == "STYLE_ONE") {
      this.styleOneBackgroundImagePath = this.authenticationService.MEDIA_URL + this.backGroundImage;
      this.showStyle1();
      $('#styleDivOne').show();
    } else {
      this.styleTwoBackgroundImagePath = this.authenticationService.MEDIA_URL + this.backGroundImage2;
      this.showStyle2();
      $('#styleDivTwo').show();
    }
    // $('#alertDiv1').hide();
    $('#alertDiv').hide();
    $('#updateDiv').show();

  }
  resizeToWidth:any;
  bgImageClickForStyle1() {
    this.isShowUploadScreen = false;
    this.cropLogoImageText = "Choose the image to be used as your company background";
    this.cropRounded = false;
    this.isShowUploadScreen = true;
    $('#cropBgImage').modal('show');
    this.aspectRatio = (8 / 9);
    this.resizeToWidth = 640;
  }

  setVendorLogoOption(event: any) {
    this.customLoginScreen.showVendorCompanyLogo = event;
  }

  designTemplate(loginTempalte: CustomLoginTemplate) {
    this.editLoginTemplate.emit(loginTempalte);
  }

  previewTemplate(emailTemplate: CustomLoginTemplate) {
    this.emailTemplatePreviewUtilComponent.previewEmailTemplate(emailTemplate);
  }

  bgImageClick() {
    this.isShowUploadScreen = false;
    this.cropLogoImageText = "Choose the image to be used as your company background";
    this.cropRounded = false;
    this.isShowUploadScreen = true;
    this.aspectRatio = (16 / 9);
    this.resizeToWidth = 1280;
    $('#cropBgImage').modal('show');
  }

  errorHandler(event) { event.target.src = 'assets/images/company-profile-logo.png'; }

  getCompanyProfileByUserId(userId) {
    if (userId != undefined) {
      this.companyProfileService.getByUserId(userId)
        .subscribe(
          data => {
            if (data.data != undefined) {
              this.companyProfile = data.data;
              this.formPosition = data.data.loginScreenDirection;
              //this.authenticationService.v_companyBgImagePath2 = this.companyProfile.backgroundLogoStyle2;
              this.loginType = data.data.loginType;
              // if ($.trim(this.companyProfile.backgroundLogoPath).length > 0) {
              //   this.backGroundImage = this.authenticationService.MEDIA_URL + this.companyProfile.backgroundLogoPath;
              //   this.companyBgImagePath = this.companyProfile.backgroundLogoPath;
              //   this.styleOneBackgroundImagePath = this.backGroundImage;
              // }
              // if ($.trim(this.companyProfile.backgroundLogoStyle2).length > 0) {
              //   this.backGroundImage2 = this.authenticationService.MEDIA_URL + this.companyProfile.backgroundLogoStyle2;
              //   this.companyBgImagePath2 = this.companyProfile.backgroundLogoStyle2;
              //   this.styleTwoBackgroundImagePath = this.backGroundImage2;
              // }
              
              this.setCompanyProfileViewData()
            }
          },
          error => { this.logger.errorPage(error) },
          () => { this.logger.info("Completed getCompanyProfileByUserId()") }
        );
    }
  }
  setCompanyProfileViewData() {
    if ($.trim(this.companyProfile.backgroundLogoPath).length > 0) {
      this.backGroundImage = this.authenticationService.MEDIA_URL + this.companyProfile.backgroundLogoPath;
      this.companyBgImagePath = this.companyProfile.backgroundLogoPath;
      //this.authenticationService.v_companyBgImagePath = this.companyBgImagePath;
      this.styleOneBackgroundImagePath = this.backGroundImage;
    }
    if ($.trim(this.companyProfile.backgroundLogoStyle2).length > 0) {
      this.backGroundImage2 = this.authenticationService.MEDIA_URL + this.companyProfile.backgroundLogoStyle2;
      this.companyBgImagePath2 = this.companyProfile.backgroundLogoStyle2;
     // this.authenticationService.v_companyBgImagePath2 = this.companyBgImagePath2;
      this.styleTwoBackgroundImagePath = this.backGroundImage2;
    }
    if(this.isTemplatesListDiv) {
      this.isShowFinalDiv = false;
      this.showStyle1();
    } else {
    this.isShowFinalDiv = true;
    $('#alertDiv').show();
    $('#styleDivOne').hide()
    $('#styleDivTwo').hide()
    $('#updateDiv').hide();
    }
  }
  croppedImageForBgImage2: string = "";
  backgroundImage(event: any) {
    this.croppedImageForBgImage = event;
    if (this.isStyle1) {
      this.styleOneBackgroundImagePath = event;
    } else {
      this.styleTwoBackgroundImagePath = event;
    }
    if (this.croppedImageForBgImage != "") {
      this.loadingcrop = true;
      let fileObj: any;
      fileObj = this.utilService.convertBase64ToFileObject(this.croppedImageForBgImage);
      fileObj = this.utilService.blobToFile(fileObj);
      this.processBgImageFile(fileObj);
    } else {
      this.errorUploadCropper = false;
      this.showCropper = false;
    }
  }
  processBgImageFile(fileObj: File) {
    this.companyProfileService.uploadBgImageFile(fileObj).subscribe(result => {
      if (result.statusCode === 200) {
        if (this.isStyle1) {
          this.companyProfile.backgroundLogoPath = result.data;
          this.companyBgImagePath = result.data;
          this.authenticationService.v_companyBgImagePath = this.companyBgImagePath;
        } else {
          this.companyProfile.backgroundLogoStyle2 = result.data;
          this.companyBgImagePath2 = result.data;
          this.authenticationService.v_companyBgImagePath2 = this.companyBgImagePath2;
        }
        this.logoError = false;
        this.logoErrorMessage = "";
        $('#cropBgImage').modal('hide');
      }
    }, error => {
      console.log(error);
      $('#cropLogoImage').modal('hide');
      this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, true)
    },
      () => {
        this.loadingcrop = false; if (this.companyProfile.website) {
        }
      });
  }
  updateCustomLogInScreenData() {
    this.customLoginScreen.backGroundLogoPath = this.companyBgImagePath;
    this.customLoginScreen.backgroundLogoStyle2 = this.companyBgImagePath2;
    if (this.isStyle1) {
      this.customLoginScreen.loginType = "STYLE_ONE";
    } else {
      this.customLoginScreen.loginType = "STYLE_TWO";
    }
    this.loginType = this.customLoginScreen.loginType;
    this.formPosition = this.customLoginScreen.logInScreenDirection;
    this.companyProfileService.updateCustomLogInScreenData(this.customLoginScreen)
      .subscribe(
        data => {
          this.message = data.message;
          if (data.statusCode === 200) {
            // this.message = "Missing Field";
            // this.customResponse = new CustomResponse('ERROR', this.message, true)
            if(this.isStyle1) {
            this.saveOrUpdateLoginTemplateActiveForCompany(this.selectedTemplate);
            } else {
               this.customResponse = new CustomResponse('SUCCESS', this.message, true)
                this.isShowFinalDiv = true;
                this.showStyle2();
              //  $('#alertDiv').show();
              //  $('#styleDivOne').hide()
              //  $('#styleDivTwo').hide()
              //  $('#updateDiv').hide();
            }
          } else {
            this.customResponse = new CustomResponse('SUCCESS', this.message, true)
          }
          this.statusCode = data.statusCode;
        });
    // this.saveOrUpdateLoginTemplateActiveForCompany(this.selectedTemplate);
    // this.isShowFinalDiv = true;
    // $('#alertDiv').show();
    // // $('#alertDiv1').show()
    // $('#styleDivOne').hide()
    // $('#styleDivTwo').hide()
    // $('#updateDiv').hide();
  }
  showVendorCompanyLogo: boolean;
  getLogInScreenDetails() {
    this.styleOneDirection = this.authenticationService.loginScreenDirection;
    this.styleTwoDirection = this.authenticationService.loginScreenDirection;
    if (this.styleOneDirection == 'Center') {
      this.styleOneDirection = 'Right';
    }
    this.customLoginScreen.logInScreenDirection = this.authenticationService.loginScreenDirection;
    this.customLoginScreen.showVendorCompanyLogo = this.authenticationService.v_showCompanyLogo;
    this.customLoginScreen.backGroundLogoPath = this.authenticationService.v_companyBgImagePath;
    this.customLoginScreen.backgroundLogoStyle2 = this.authenticationService.v_companyBgImagePath2;
  }
  styleOneDirection: any;
  styleTwoDirection: any
  onSelectChangeStyale1(style1: any) {
    this.styleOneDirection = style1;
    this.customLoginScreen.logInScreenDirection = this.styleOneDirection;
  }
  onSelectChangeStyale2(style2: any) {
    this.styleTwoDirection = style2;
    this.customLoginScreen.logInScreenDirection = this.styleTwoDirection;

  }

  showStyle1() {
    this.styleTwoBackgroundImagePath = this.authenticationService.MEDIA_URL + this.companyBgImagePath;
    if (!this.isShowFinalDiv) {
      this.isStyle1 = true;
      $('#styleDivOne').show();
      $('#styleDivTwo').hide();
      $('#alertDiv').hide();
    } else {
      $('#alertDiv').show();
      $('#styleDivOne').hide()
      $('#styleDivTwo').hide()
      $('#updateDiv').hide();
      this.isShowFinalDiv = true;
    }
  }
  showStyle2() {
    this.styleTwoBackgroundImagePath = this.authenticationService.MEDIA_URL + this.companyBgImagePath2;
    if (!this.isShowFinalDiv) {
      this.isStyle1 = false;
      $('#styleDivOne').hide();
      $('#styleDivTwo').show();
      $('#alertDiv').hide();
    } else {
      $('#alertDiv').show();
      $('#styleDivOne').hide()
      $('#styleDivTwo').hide()
      $('#updateDiv').hide();
      this.isShowFinalDiv = true;
    }
  }
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getCustomLoginTemplates(this.pagination);
  }

  getCustomLoginTemplates(pagination: Pagination) {
    this.loading = true;
    pagination.userId = this.authenticationService.getUserId();
    this.vanityURLService.getCustomLoginTemplates(pagination).subscribe(result => {
      const data = result.data;
      this.customLoinTemplates = result.data
      if (result.statusCode === 200) {
        this.loading = false;
        this.selectedTemplate = this.authenticationService.lognTemplateId;
        pagination.totalRecords = this.customLoinTemplates.length;
        pagination = this.pagerService.getPagedItems(pagination, data);
        this.pager = this.socialPagerService.getPager(this.customLoinTemplates.length, this.pagination.pageIndex, this.pagination.maxResults);
        this.pagination.pagedItems = this.customLoinTemplates.slice(this.pager.startIndex, this.pager.endIndex + 1);
      } else {
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      this.customResponse = new CustomResponse('ERROR', "Error while deleting Email Template", true);
    });
  }
  deleteTemplate(id: number) {
    let self = this;
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      swalConfirmButtonColor: '#54a7e9',
      swalCancelButtonColor: '#999',
      confirmButtonText: 'Yes, Delete it!'
    }).then(function () {
      self.deleteCustomLogInTempalte(id);
    }, function (dismiss: any) {
      console.log("you clicked showAlert cancel" + dismiss);
    });
  }
  deleteCustomLogInTempalte(id: number) {
    this.vanityURLService.deleteCustomLogInTemplateById(id).subscribe(result => {
      if (result.statusCode === 200) {
        this.customResponse = new CustomResponse('ERROR', result.message, true);
        this.referenceService.goToTop();
        this.getCustomLoginTemplates(this.pagination);
      }
    }, error => {
      this.customResponse = new CustomResponse('ERROR', "Error while deleting Email Template", true);
    });
  }
  companyLoginTemplateActive: CompanyLoginTemplateActive = new CompanyLoginTemplateActive();
  saveOrUpdateLoginTemplateActiveForCompany(tId: number) {
    this.companyLoginTemplateActive.createdBy = this.loggedInUserId;
    this.companyLoginTemplateActive.templateId = tId;
    this.activateTemplate(this.companyLoginTemplateActive);
  }

  activateTemplate(companyLoginTemplateActive: CompanyLoginTemplateActive) {
    this.companyProfileService.saveOrUpdateTemplateForCompany(companyLoginTemplateActive).subscribe(result => {
      if (result.statusCode === 200) {
        this.selectedTemplate = result.data;
        // this.customResponse = new CustomResponse('SUCCESS', result.data, true);
        this.customResponse = new CustomResponse('SUCCESS', this.message, true)
        this.isShowFinalDiv = true;
        // $('#alertDiv').show();
        // // $('#alertDiv1').show()
        // $('#styleDivOne').hide()
        // $('#styleDivTwo').hide()
        // $('#updateDiv').hide();
        this.showStyle1();
      } else {
        this.customResponse = new CustomResponse('ERROR', result.data.errorMessages[0].message, true);
      }
    }, error => {
      //this.customLoginTemplateResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_EMAIL_TEMPLATE_ERROR_TEXT, true)
    });
  }
  selectedTemplate: number;
  selectedTemplateId(id: number) {
    if(id != 1) {
    this.selectedTemplate = id;
    } 
  }
  selectTemplateName(name:any){
    if(name != 'Create_Template') {
      this.templateName = name;
      } 
  }

  getFinalScreenTableView() {
    this.vanityURLService.getFinalScreenTableView()
      .subscribe(
        data => {
          this.loginType = data.data.loginType
          this.templateName = data.data.templateName
          this.selectedTemplate = data.data.templateId;
        })
  }
}

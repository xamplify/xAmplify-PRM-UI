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
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { VideoUtilService } from 'app/videos/services/video-util.service';

declare var $, Swal, swal: any;
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
  /*** XNFR-416 ****/
  imageUrl: any
  isValidColorCode = true;
  isValidBackgroundColorStyle1 = true;
  isValidBackgroundColorStyle2 = true;
  valueRange: number;
  selectedColor2: any = '#000';
  selectedColor1: any = '#000'
  isBackgroundColorStyleTwo: boolean = false;
  isBackgroundColorStyleOne: boolean = false;
  /**** XNFR-416 ******/
  constructor(public envService: EnvService, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public properties: Properties,
    private companyProfileService: CompanyProfileService, private logger: XtremandLogger, public utilService: UtilService, public refService: ReferenceService, private vanityURLService: VanityURLService, private pagerService: PagerService, public socialPagerService: SocialPagerService, public regularExpressions: RegularExpressions, public videoUtilService: VideoUtilService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    if (!this.companyBgImagePath) {
      this.squareDataForBgImage = {};
    }
    if (!this.companyBgImagePath2) {
      this.squareDataForBgImage = {};
    }
    this.isShowFinalDiv = true;
    this.getCompanyProfileByUserId(this.loggedInUserId)
    this.getLogInScreenDetails();
    this.getCustomLoginTemplates(this.pagination);
    this.getFinalScreenTableView();
  }
  showLoginStylesDiv() {
    this.isShowFinalDiv = false;
    this.customResponse = new CustomResponse('ERROR', this.properties.SOMTHING_WENT_WRONG, false)
    if (this.loginType == "STYLE_ONE") {
      this.styleOneBackgroundImagePath = this.companyProfile.backgroundLogoPath;
      this.showStyle1();
      $('#styleDivOne').show();
    } else {
      this.styleTwoBackgroundImagePath = this.companyProfile.backgroundLogoStyle2;
      this.showStyle2();
      $('#styleDivTwo').show();
    }
    $('#alertDiv').hide();
    $('#updateDiv').show();
    $('.styles').show();
  }
  backToPrevoiusPage() {
    if (this.selectedTemplate != this.activeTemplateId && this.isStyle1) {
      this.showSweetAlert()
    } else {
      this.isShowFinalDiv = true;
      $('#alertDiv').show();
      $('#styleDivOne').hide()
      $('#styleDivTwo').hide()
      $('#updateDiv').hide();
    }
  }

  clickedButtonName = "";
  createButton(text: string, cb: any) {
    let buttonClass = "btn btn-sm btn-primary";
    let cancelButtonClass = "btn btn-sm Btn-Gray";
    let cancelButtonSettings = 'class="' + cancelButtonClass + '"';
    if (text == "Yes,Update it") {
      return $('<input type="submit" class="' + buttonClass + '"  value="' + text + '"  id="save" >').on('click', cb);
    } else if (text == "Cancel") {
      return $('<input type="submit" class="btn btn-sm btn-default"  value="' + text + '" id="save-and-redirect" >').on('click', cb);
    } else if (text == "Back") {
      return $('<input type="submit" class="btn btn-sm Btn-Gray"  value="' + text + '" id="save-as" >').on('click', cb);
    }
  }
  showSweetAlert() {
    let self = this;
    let text = "Do you really want to change the template?"
    var buttons = $('<div><div id="bee-save-buton-loader"></div>')
      .append('<div class=""><h5>"' + text + '"</h5></div><br> ');
    buttons.append(self.createButton('Yes,Update it', function () {
      self.updateCustomLogInScreenData(false);
      swal.close();
    })).append(self.createButton('Cancel', function () {
      swal.close();
    })).append(self.createButton('Back', function () {
      swal.close();
      this.isShowFinalDiv = true;
      //this.getFinalScreenTableView()
      $('#alertDiv').show();
      $('#styleDivOne').hide()
      $('#styleDivTwo').hide()
      $('#updateDiv').hide();
      $('.styles').hide();
    }))
    swal({
      title: 'Are you sure!',
      type: 'warning',
      html: buttons,
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  resizeToWidth: any;
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
              /**** XNFR-416 *****/
              this.selectedColor1 = data.data.backgroundColorStyle1;
              this.selectedColor2 = data.data.backgroundColorStyle2;
              this.isBackgroundColorStyleOne = data.data.styleOneBgColor;
              this.isBackgroundColorStyleTwo = data.data.styleTwoBgColor
              this.authenticationService.isstyleTWoBgColor = data.data.styleTwoBgColor
              /**** XNFR-416 *****/
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
      this.backGroundImage = this.companyProfile.backgroundLogoPath;
      this.companyBgImagePath = this.companyProfile.backgroundLogoPath;
      this.styleOneBackgroundImagePath = this.backGroundImage;
    }
    if ($.trim(this.companyProfile.backgroundLogoStyle2).length > 0) {
      this.backGroundImage2 = this.companyProfile.backgroundLogoStyle2;
      this.companyBgImagePath2 = this.companyProfile.backgroundLogoStyle2;
      this.styleTwoBackgroundImagePath = this.backGroundImage2;
    }
    if (this.isTemplatesListDiv) {
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
          this.styleOneBackgroundImagePath = result.data;
          this.authenticationService.v_companyBgImagePath = this.companyBgImagePath;
        } else {
          this.companyProfile.backgroundLogoStyle2 = result.data;
          this.companyBgImagePath2 = result.data;
          this.authenticationService.v_companyBgImagePath2 = this.companyBgImagePath2;
          this.styleTwoBackgroundImagePath = result.data;
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
  updateCustomLogInScreenData(isUpdate:boolean) {
    this.customLoginScreen.backGroundLogoPath = this.companyBgImagePath;
    this.customLoginScreen.backgroundLogoStyle2 = this.companyBgImagePath2;
      /**** XNFR-146  *******/
      this.customLoginScreen.styleOneBgColor = this.isBackgroundColorStyleOne;
      this.customLoginScreen.styleTwoBgColor = this.isBackgroundColorStyleTwo
      this.customLoginScreen.backgroundColorStyle1 = this.selectedColor1;
      this.customLoginScreen.backgroundColorStyle2 = this.selectedColor2;
      /**** XNFR-146 ******/
    if (this.isStyle1) {
      this.customLoginScreen.loginType = "STYLE_ONE";
      if (this.customLoginScreen.logInScreenDirection === 'Center') {
        this.customLoginScreen.logInScreenDirection = 'Right';
        this.formPosition = "Right";
      } else {
        this.formPosition = this.customLoginScreen.logInScreenDirection;
        this.customLoginScreen.logInScreenDirection = this.customLoginScreen.logInScreenDirection;
      }
    } else {
      this.customLoginScreen.loginType = "STYLE_TWO";
      this.formPosition = this.customLoginScreen.logInScreenDirection;
    }
    this.loginType = this.customLoginScreen.loginType;
    //this.formPosition = this.customLoginScreen.logInScreenDirection;
    this.companyProfileService.updateCustomLogInScreenData(this.customLoginScreen)
      .subscribe(
        data => {
          this.message = data.message;
          if (data.statusCode === 200) {
            if (this.isStyle1) {
              this.saveOrUpdateLoginTemplateActiveForCompany(this.selectedTemplate,isUpdate);
            } else {
              this.customResponse = new CustomResponse('SUCCESS', this.message, true)
              if(!isUpdate) {
              this.isShowFinalDiv = true;
              this.showStyle2();
              }
            }
          } else {
            this.customResponse = new CustomResponse('SUCCESS', this.message, true)
          }
          this.statusCode = data.statusCode;
        });
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
    this.styleTwoBackgroundImagePath = this.companyBgImagePath;
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
    this.styleTwoBackgroundImagePath = this.companyBgImagePath2;
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
        //this.selectedTemplate = this.authenticationService.lognTemplateId;
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
      title: 'Are you sure!',
      text: "Do you want to delete the template?",
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

  deleteOrDeleteAndUpdate(id: number) {
    if (id === this.activeTemplateId) {
      this.deleteAndUpdateTemplateSweetAlert(id)
    } else {
      this.deleteTemplate(id);
    }
  }
  deleteAndUpdateTemplateSweetAlert(id: number) {
    let self = this;
    swal({
      title: 'Are you sure!',
      text: "Do you want to delete the template and update it with selected one?",
      type: 'warning',
      showCancelButton: true,
      swalConfirmButtonColor: '#54a7e9',
      swalCancelButtonColor: '#999',
      confirmButtonText: 'Yes, Update it!'
    }).then(function () {
      self.deleteCustomLogInTempalte(id)
      setTimeout(() => {
        self.updateCustomLogInScreenData(false);// Execute method2 after a 2-second delay
      }, 2000);
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
  saveOrUpdateLoginTemplateActiveForCompany(tId: number,isUpdate:boolean) {
    this.companyLoginTemplateActive.createdBy = this.loggedInUserId;
    this.companyLoginTemplateActive.templateId = tId;
    this.activateTemplate(this.companyLoginTemplateActive,isUpdate);
  }
  activeTemplateId: number;
  activateTemplate(companyLoginTemplateActive: CompanyLoginTemplateActive,isUpdate:boolean) {
    this.companyProfileService.saveOrUpdateTemplateForCompany(companyLoginTemplateActive).subscribe(result => {
      if (result.statusCode === 200) {
        this.selectedTemplate = result.data;
        this.activeTemplateId = result.data
        this.refService.goToTop();
        this.getFinalScreenTableView();
        // this.customResponse = new CustomResponse('SUCCESS', result.data, true);
        this.customResponse = new CustomResponse('SUCCESS', this.message, true)
        if(!isUpdate) {
        this.isShowFinalDiv = true;
        this.showStyle1();
        }
      } else {
        if (result.data.errorMessages[0].message === "templateId parameter is missing") {
          this.message = "Please select an template."
        } else {
          this.message = "something went wrong. Please try again.";
        }
        this.customResponse = new CustomResponse('ERROR', this.message, true);
      }
    }, error => {
      //this.customLoginTemplateResponse = new CustomResponse('ERROR', this.properties.VANITY_URL_EMAIL_TEMPLATE_ERROR_TEXT, true)
    });
  }
  selectedTemplate: number;
  selectedTemplateId(id: number) {
    if (id != 1) {
      this.selectedTemplate = id;
    }
  }
  // selectTemplateName(name: any) {
  //   if (name != 'Create_Template') {
  //     this.templateName = name;
  //   }
  // }


  getFinalScreenTableView() {
    this.vanityURLService.getFinalScreenTableView()
      .subscribe(
        data => {
          this.loginType = data.data.loginType
          this.templateName = data.data.templateName
          this.selectedTemplate = data.data.templateId;
          this.activeTemplateId = data.data.templateId;
        })
  }
  /**** XNFR-416 ******/
  setDefaultBgImage() {
    this.styleOneBackgroundImagePath = "";
    this.imageUrl = "assets/images/stratapps.jpeg"
    this.setDefaultImage(this.imageUrl, 'stratapps.jpeg');
  }
  private setDefaultImage(imageUrl: any, name: any) {
    this.vanityURLService.getImageFile(imageUrl, name).subscribe(
      (file: File) => {
        // Now you have the image file, you can do further processing or save it.
        this.processBgImageFile(file);
        console.log(file);
      },
      (error) => {
        console.error('Error uploading image:', error);
      });
  }
  setDefaultBgImageStyleTwo() {
    this.styleTwoBackgroundImagePath = "";
    this.imageUrl = "assets/images/xAmplify-sandbox.png"
    this.setDefaultImage(this.imageUrl, 'xAmplify-sandbox.png');
  }

  setBackgroundColorForStyle1() {
    this.isBackgroundColorStyleOne = !this.isBackgroundColorStyleOne;
  }

  setBackgroundColorForStyle2() {
    this.isBackgroundColorStyleTwo = !this.isBackgroundColorStyleTwo;
  }
  checkValidColorCode(colorCode: string, type: string) {
    if ($.trim(colorCode).length > 0) {
      if (!this.regularExpressions.COLOR_CODE_PATTERN.test(colorCode)) {
        this.addColorCodeErrorMessage(type);
      } else {
        this.removeColorCodeErrorMessage(colorCode, type);
      }
    } else {
      //this.removeColorCodeErrorMessage(colorCode, type);
    }
  }
  private addColorCodeErrorMessage(type: string) {
    this.isValidColorCode = false;
    if (type === "selectedColor1") {
      this.customLoginScreen.backgroundColorStyle1 = "";
      this.isValidBackgroundColorStyle1 = true;
    } else if (type === "selecteColor2") {
      this.customLoginScreen.backgroundColorStyle2 = "";
      this.isValidBackgroundColorStyle2 = true;
    }
  } catch(error) {
    console.log(error);
  }
  removeColorCodeErrorMessage(colorCode: string, type: string) {
    if (type === "selectedColor1") {
      this.customLoginScreen.backgroundColorStyle1 = colorCode;
      this.isValidBackgroundColorStyle1 = true;
    } else if (type === "selecteColor2") {
      this.customLoginScreen.backgroundColorStyle2 = colorCode;
      this.isValidBackgroundColorStyle2 = true;
    }
  }
  changeControllerColor(event: any, type: string) {
    try {
      const rgba = this.videoUtilService.transparancyControllBarColor(event, this.valueRange);
      $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
      /*******Header Form*********8 */
      if (type === "selectedColor1") {
        this.selectedColor1 = event;
        this.isValidBackgroundColorStyle1 = true;
      } else if (type === "selectedColor2") {
        this.selectedColor2 = event;
        this.isValidBackgroundColorStyle2 = true;
      }
    } catch (error) { console.log(error); }

  }
  openNewTab(){
    const newTabUrl = this.authenticationService.DOMAIN_URL +'login/preview'; // Replace with the URL you want to open
    // Open the URL in a new tab
    window.open(newTabUrl, '_blank');
  }
}

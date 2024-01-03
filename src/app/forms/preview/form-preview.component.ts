import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from '../../common/models/custom-response';
import { FormService } from '../services/form.service';
import { Form } from '../models/form';
import { FormSubmit } from '../models/form-submit';
import { FormSubmitField } from '../models/form-submit-field';
import { ColumnInfo } from '../models/column-info';
import { FormOption } from '../models/form-option';
import { UtilService } from '../../core/services/util.service';
import { GeoLocationAnalytics } from '../../util/geo-location-analytics';
import { Ng2DeviceService } from 'ng2-device-detector';
import { LandingPageService } from '../../landing-pages/services/landing-page.service';
import { DomSanitizer } from "@angular/platform-browser";
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { SocialService } from 'app/social/services/social.service'
import { EnvService } from 'app/env.service'
import { GeoLocationAnalyticsType } from 'app/util/geo-location-analytics-type.enum';
import { TracksPlayBook } from '../../tracks-play-book-util/models/tracks-play-book';
import { TracksPlayBookUtilService } from '../../tracks-play-book-util/services/tracks-play-book-util.service';

declare var $,swal: any;


@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css', '../../../assets/css/loader.css'],
  providers: [HttpRequestLoader, FormService, Processor, LandingPageService, TracksPlayBookUtilService],
})
export class FormPreviewComponent implements OnInit {
  deviceInfo: any;
  ngxLoading = false;
  customResponse: CustomResponse = new CustomResponse();
  alias: any;
  form: Form = new Form();
  hasFormExists = true;
  validForm = true;
  isValidEmailIds = true;
  alertClass = "";
  successAlertClass = "alert alert-success";
  errorAlertClass = "alert-danger error-alert-custom-padding";
  show: boolean;
  formSubmitted = false;
  message: string;
  isSubmittedAgain = false;
  uploadedFile: File = null;
  formBackgroundImage = "";
  pageBackgroundColor = "";
  enableButton = false;
  siteKey = "";
  @Input() learningTrackId:number;
  @Input() isTrackQuizSubmitted:boolean = false;
  @Input() partnerId: number;
  @Output() notifyParent: EventEmitter<any>;
  @Output() captchaValue: EventEmitter<any>;

  geoLocationAnalytics : GeoLocationAnalytics;
  selectedPartnerFormAnswers : any;
  quizScore:number;
  maxScore: number;
  loggedInUserEmail: string;

  /*****XNFR-423****/
  countryNames = [];

  resolved(captchaResponse: string) {
    if(captchaResponse){
      this.formService.validateCaptcha(captchaResponse).subscribe(
        (response: any) => {
          this.enableButton = response;
          this.captchaValue.emit(this.enableButton);
        },
        (error: string) => {
          this.logger.errorPage(error);
        }
      );
    }else{
      this.enableButton = false;
      this.captchaValue.emit(this.enableButton);
    }
  }
  constructor(private route: ActivatedRoute, public envService: EnvService, private referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private formService: FormService,
    private logger: XtremandLogger, public httpRequestLoader: HttpRequestLoader, public processor: Processor, private router: Router, private socialService: SocialService,
    private landingPageService: LandingPageService, public deviceService: Ng2DeviceService, public utilService: UtilService, public sanitizer: DomSanitizer, private vanityURLService: VanityURLService,
     private tracksPlayBookUtilService: TracksPlayBookUtilService) {
      this.siteKey = this.envService.captchaSiteKey;
      this.notifyParent = new EventEmitter<any>();
      this.captchaValue = new EventEmitter<any>();

  }

  ngOnInit() {
    if (this.vanityURLService.isVanityURLEnabled()) {
      this.vanityURLService.checkVanityURLDetails();
    }

    $('.mobile-camp').removeClass('mobile-camp');
    // $('body').css('cssText', 'background-image: url(https://www.xamplify.com/wp-content/uploads/2019/12/rsvp-bg.png);background-repeat: no-repeat;background-size: cover;background-position: center;');
    this.processor.set(this.processor);
    if (this.authenticationService.formAlias) {
      this.alias = this.authenticationService.formAlias;
    } else {
      this.alias = this.route.snapshot.params['alias'];
    }
    let loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser !== undefined && loggedInUser !== null) {
      let userJSON = JSON.parse(loggedInUser);
      if(userJSON !== undefined && userJSON !== null){
        this.loggedInUserEmail = userJSON.userName;
      }
    }
    this.getFormFieldsByAlias(this.alias);
  }

  refreshForm() {
    this.validForm = true;
    this.isValidEmailIds = true;
    this.customResponse = new CustomResponse();
    this.show = false;
    if(this.form.showCaptcha){
      grecaptcha.reset();
    }
    this.getFormFieldsByAlias(this.alias);
  }

  getFormFieldsByAlias(alias: string) {
    this.ngxLoading = true;
    this.formService.getByAlias(alias)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            let self = this;
            this.hasFormExists = true;
            this.form = response.data;
            this.countryNames = this.authenticationService.addCountryNamesToList(this.form.countryNames,this.countryNames);
            if (this.form.showBackgroundImage) {
              this.formBackgroundImage = this.form.backgroundImage;
              this.pageBackgroundColor = "";
            } else {
              this.pageBackgroundColor = this.form.pageBackgroundColor;
              this.authenticationService.formBackground = this.pageBackgroundColor ;
              this.formBackgroundImage = "";
            }
            if (!this.isSubmittedAgain) {
              this.saveLocationDetails(this.form);
            }
            $.each(this.form.formLabelDTOs, function (index: number, value: ColumnInfo) {
              if (value.labelType == 'quiz_radio') {
                  value.choices = value.radioButtonChoices;
              } else if (value.labelType == 'quiz_checkbox') {
                  value.choices = value.checkBoxChoices;
              } else if (value.labelType == 'email' && value.required && self.learningTrackId !== undefined && self.learningTrackId > 0 && !self.isTrackQuizSubmitted) {
                value.value = self.loggedInUserEmail;
              }
          });
          this.setCustomCssValues();
          } else if (response.statusCode === 409) {
            this.formSubmitted = true;
          }else {
            this.hasFormExists = false;
            this.addHeaderMessage("Oops! This form does not exists.", this.errorAlertClass);
          }
          this.processor.remove(this.processor);

          if (this.authenticationService.formValues.length > 0) {
            this.form.formLabelDTOs = this.authenticationService.formValues;
          }
          if(this.learningTrackId !== undefined && this.learningTrackId > 0 && this.isTrackQuizSubmitted){
            this.getPartnerFormAnalytics();
          } else {
            this.ngxLoading = false;
          }
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.ngxLoading = false;
          this.logger.errorPage(error);
          this.referenceService.showServerError(this.httpRequestLoader);
        }
      );
  }

  saveLocationDetails(form: Form) {
    this.utilService.getJSONLocation()
      .subscribe(
        (response: any) => {
          let geoLocationAnalytics = new GeoLocationAnalytics();
          this.deviceInfo = this.deviceService.getDeviceInfo();
          if (this.deviceInfo.device === 'unknown') {
            this.deviceInfo.device = 'computer';
          }
          geoLocationAnalytics.openedTime = new Date();
          geoLocationAnalytics.deviceType = this.deviceInfo.device;
          geoLocationAnalytics.os = this.deviceInfo.os;
          geoLocationAnalytics.city = response.city;
          geoLocationAnalytics.country = response.country;
          geoLocationAnalytics.isp = response.isp;
          geoLocationAnalytics.ipAddress = response.query;
          geoLocationAnalytics.state = response.regionName;
          geoLocationAnalytics.zip = response.zip;
          geoLocationAnalytics.latitude = response.lat;
          geoLocationAnalytics.longitude = response.lon;
          geoLocationAnalytics.countryCode = response.countryCode;
          geoLocationAnalytics.timezone = response.timezone;
          geoLocationAnalytics.formId = form.id;
          geoLocationAnalytics.landingPageId = form.landingPageId;
          geoLocationAnalytics.analyticsType = form.analyticsType;
          geoLocationAnalytics.campaignId = form.campaignId;
          geoLocationAnalytics.userId = form.userId;
          geoLocationAnalytics.partnerCompanyId = form.partnerCompanyId;
          this.geoLocationAnalytics = geoLocationAnalytics;
          this.saveAnalytics(geoLocationAnalytics);
        },
        (error: string) => {
          this.logger.error("Error In Fetching Location Details");
        }
      );
  }

  saveAnalytics(geoLocationAnalytics: GeoLocationAnalytics) {
    this.landingPageService.saveAnalytics(geoLocationAnalytics)
      .subscribe(
        (data: any) => {
        },
        (error: string) => {
          this.logger.error("Error In saving Location Details", error);
        }
      );

  }


  validateEmail(columnInfo: ColumnInfo) {
    if (columnInfo.labelType == 'email') {
      if(columnInfo.value != undefined && columnInfo.value.length > 0) {
        if (!this.referenceService.validateEmailId($.trim(columnInfo.value))) {
          columnInfo.divClass = "error";
        } else {
          columnInfo.divClass = "success";
        }
      } else {
        columnInfo.divClass = "success";
      }
    }
    const invalidEmailIdsFieldsCount = this.form.formLabelDTOs.filter((item) => (item.divClass == 'error')).length;
    if (invalidEmailIdsFieldsCount == 0) {
      this.isValidEmailIds = true;
    } else {
      this.isValidEmailIds = false;
    }
  }

  onFileChangeEvent(event: any, columnInfo: ColumnInfo, index: number) {
    if (event.target.files.length > 0) {
      this.ngxLoading = true;
      let file = event.target.files[0];
      const formData: any = new FormData();
      formData.append("uploadedFile", file, file['name']);
      const formSubmit = new FormSubmit();
      formSubmit.id = this.form.id;
      this.formService.uploadFile(formData, formSubmit)
        .subscribe(
          (response: any) => {
            if (response.statusCode == 200) {
              columnInfo.value = response.data;
              this.ngxLoading = false;
            } else {
              $('#file-' + index).val('');
              this.ngxLoading = false;
              columnInfo.value = "";
              this.referenceService.showSweetAlertErrorMessage(response.message);
            }
          },
          (error: string) => {
            this.showUploadErrorMessage(columnInfo);
          }
        );

    } else {
      columnInfo.value = "";
    }
  }

  showUploadErrorMessage(columnInfo: ColumnInfo) {
    this.ngxLoading = false;
    columnInfo.value = "";
    this.referenceService.showSweetAlertServerErrorMessage();
  }

   /*******Submit Forms********* */
  submitForm() {
    this.show = false;
    this.ngxLoading = true;
    this.referenceService.goToTop();
    this.validForm = true;
    const formLabelDtos = this.form.formLabelDTOs;
    let self = this.form;
    if (this.form.disableEmail) {
      let emailLabels = formLabelDtos.filter((item) => (item.labelType === "email"));
      $.each(emailLabels, function (_index: number, field: ColumnInfo) {
        field.value = self.emailId;
      });
    }
    
    const requiredFormLabels = formLabelDtos.filter((item) => (item.required === true && $.trim(item.value).length === 0));
    const invalidEmailIdsFieldsCount = formLabelDtos.filter((item) => (item.divClass == 'error')).length;
    const invalidCountryNameCount =formLabelDtos.filter((item) => ( item.labelType=="country" && item.required === true && $.trim(item.value)=="Please Select Country")).length;
    if (requiredFormLabels.length > 0 || invalidEmailIdsFieldsCount > 0 || invalidCountryNameCount>0) {
      this.validForm = false;
      this.addHeaderMessage('Please fill required fields', this.errorAlertClass);
    } else {
      this.validForm = true;
      const formSubmit = new FormSubmit();
      formSubmit.id = this.form.id;
      formSubmit.alias = this.alias;
      $.each(formLabelDtos, function (_index: number, field: ColumnInfo) {
        const formField = new FormSubmitField();
        formField.id = field.id;
        formField.value = $.trim(field.value);
        if (field.labelType === "checkbox" || field.labelType === "quiz_checkbox") {
          formField.dropdownIds = field.value;
          formField.value = "";
        }
        /****XNFR-423****/
        if(field.labelType=="country"){
          if(!field.required && formField.value=="Please Select Country"){
            formField.value = "";
          }
        }
        /****XNFR-423****/
        formSubmit.fields.push(formField);
      });
      let formType:string = null
      if(this.learningTrackId != undefined && this.learningTrackId > 0){
        formType = "lms-form"
        formSubmit.userId = this.authenticationService.getUserId();
        formSubmit.learningTrackId = this.learningTrackId;
      }
      
      let geoLocationAnalytics = this.geoLocationAnalytics;    
      formSubmit.geoLocationAnalyticsDTO = geoLocationAnalytics;
      this.formService.submitForm(formSubmit, formType)
        .subscribe(
          (response: any) => {
            if (response.statusCode == 200) {
              this.addHeaderMessage(response.message, this.successAlertClass);
              this.formSubmitted = true;
              this.isTrackQuizSubmitted = true;
              let formSubmissionUrl = this.form.formSubmissionUrl;
              if (formSubmissionUrl != undefined && $.trim(formSubmissionUrl).length > 0 && !formSubmissionUrl.startsWith("https://")) {
                formSubmissionUrl = "https://" + formSubmissionUrl;
              }
              let openLinkInNewTab = this.form.openLinkInNewTab;
              if((this.learningTrackId !== undefined && this.learningTrackId > 0 && this.isTrackQuizSubmitted)){
                openLinkInNewTab = true;
              }
              if(formSubmissionUrl!=undefined && $.trim(formSubmissionUrl).length>0){
                let redirectMessage = '<strong> You are being redirect to '+formSubmissionUrl+'</strong>' ;
                let text = !openLinkInNewTab ? redirectMessage:redirectMessage+' <br>(opens in new window)';
                swal( {
                  title:'Please Wait',
                  text: text,
                  allowOutsideClick: false, 
                  showConfirmButton: false, 
                  imageUrl: 'assets/images/loader.gif',
              });
                setTimeout(function() {
                if(openLinkInNewTab){
                  window.open(formSubmissionUrl, '_blank');
                }else{
                  window.parent.location.href = formSubmissionUrl;
                }
                swal.close();
                }, 3000);
              }
              if (this.learningTrackId !== undefined && this.learningTrackId > 0 && this.isTrackQuizSubmitted) {
                this.getPartnerFormAnalytics();
                this.ngxLoading = true;
              } else {
                // if (this.form.quizForm && response.data != undefined && response.data.submittedData != undefined) {
                //   this.selectedPartnerFormAnswers = response.data; 
                //   this.setQuizAnswersInfo(response.data.submittedData);
                // }
                this.ngxLoading = false;
              }

            } else if (response.statusCode == 404) {
              this.addHeaderMessage(response.message, this.errorAlertClass);
              this.notifyParent.emit(new CustomResponse('ERROR', response.message, true));
            } else if (response.statusCode == 400) {
              this.notifyParent.emit(new CustomResponse('ERROR', response.message, true));
            }
          },
          (error: string) => {
            this.ngxLoading = false;
            this.addHeaderMessage("Something went wrong.Please try after sometime", this.errorAlertClass);
          }
        );


    }
  }

  resetGeoLocationAnalyticsTypeInfo(geoLocationAnalytics : GeoLocationAnalytics) {
          geoLocationAnalytics.formId = null;
          geoLocationAnalytics.landingPageId = null;
          geoLocationAnalytics.analyticsType = null;
          geoLocationAnalytics.campaignId = null;
          geoLocationAnalytics.userId = null;
          geoLocationAnalytics.partnerCompanyId = null;
  }

  addHeaderMessage(message: string, divAlertClass: string) {
    this.ngxLoading = false;
    this.show = true;
    this.message = message;
    this.alertClass = divAlertClass;
  }
  removeErrorMessage() {
    this.show = false;
  }

  updateCheckBoxModel(columnInfo: ColumnInfo, formOption: FormOption, event: any) {
    if (columnInfo.value === undefined) {
      columnInfo.value = Array<number>();
    }
    if (event.target.checked) {
      columnInfo.value.push(formOption.id);
    } else {
      columnInfo.value.splice($.inArray(formOption.id, columnInfo.value), 1);
    }
  }

  updateQuizModel(columnInfo: ColumnInfo, formOption: FormOption, event: any) {
    if(columnInfo.labelType.split('_')[1] === 'checkbox'){
      if (columnInfo.value === undefined) {
        columnInfo.value = Array<number>();
      }
      if (event.target.checked) {
        columnInfo.value.push(formOption.id);
      } else {
        columnInfo.value.splice($.inArray(formOption.id, columnInfo.value), 1);
      }
    } else if(columnInfo.labelType.split('_')[1] === 'radio'){
      columnInfo.value = formOption.id;
    }
  }

  showForm() {
    this.formSubmitted = false;
    this.show = false;
    this.form = new Form();
    this.customResponse = new CustomResponse();
    this.isSubmittedAgain = true;
    this.getFormFieldsByAlias(this.alias);
  }

  omitNegativeCharacters(event: any) {
    var k;
    k = event.charCode;
    return (k > 47 && k < 58 || k == 46);
  }

  getPartnerFormAnalytics() {
    this.ngxLoading = true;
    let formAnalytics: TracksPlayBook = new TracksPlayBook();
    formAnalytics.userId = this.partnerId;
    formAnalytics.partnershipId = this.partnerId;
    formAnalytics.quizId = this.form.id;
    formAnalytics.id = this.learningTrackId;
    this.tracksPlayBookUtilService.getPartnerFormAnalytics(formAnalytics).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          let self = this;
          const data = response.data;
          this.selectedPartnerFormAnswers = data;
          this.setQuizAnswersInfo(this.selectedPartnerFormAnswers);
        } else {
          this.referenceService.showSweetAlertErrorMessage(response.message);
        }
        this.ngxLoading = false;
      });
    (error: any) => {
      this.ngxLoading = false;
      this.customResponse = new CustomResponse('ERROR', 'Unable to get data.Please Contact Admin.', true);
    }
  } 

  setQuizAnswersInfo(data: any) {
    this.quizScore = data.score;
    this.maxScore = data.maxScore;
    let answers = data.submittedData;
    $.each(this.form.formLabelDTOs, function (index: number, value: ColumnInfo) {
      if (answers !== undefined && answers[value.id] !== undefined) {
        if (value.labelType === "select") {
          value.value = answers[value.id].submittedAnswer[0];
        } else {
          value.value = answers[value.id].submittedAnswer;
          if (value.labelType === "upload") {
            let lastIndex = value.value.lastIndexOf("/");
            let fileName = value.value.substring(lastIndex + 1);
            value['fileName'] = fileName;
          }
        }
        let choices: any;
        if (value.labelType === "quiz_radio" || value.labelType === "quiz_checkbox") {
          choices = value.choices;
        } else if (value.labelType === "radio") {
          choices = value.radioButtonChoices;
        } else if (value.labelType === "checkbox") {
          choices = value.checkBoxChoices;
        }
        $.each(choices, function (index: number, choice: any) {
          if (value.value.indexOf(choice.id) > -1) {
            choice.isSelected = true;
          } else {
            choice.isSelected = false;
          }
        });
        value.skipped = answers[value.id].skipped;
        value.submittedAnswerCorrect = answers[value.id].submittedAnswerCorrect;
      } else {
        value.value = "";
        value.skipped = true;
      }
    });
  }

  setCustomCssValues() {
    document.documentElement.style.setProperty('--form-page-bg-color', this.pageBackgroundColor);
    document.documentElement.style.setProperty('--form-border-color', this.form.borderColor);
    document.documentElement.style.setProperty('--form-label-color', this.form.labelColor);
    document.documentElement.style.setProperty('--form-description-color', this.form.descriptionColor);
    document.documentElement.style.setProperty('--form-title-color', this.form.titleColor);
    document.documentElement.style.setProperty('--form-bg-color', this.form.backgroundColor);
    require("style-loader!../../../assets/admin/layout2/css/themes/form-custom-skin.css");
  }

}

import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute,Router,NavigationStart, NavigationEnd  } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from '../../common/models/custom-response';
import { filter, pairwise } from 'rxjs/operators';
import {FormService} from '../services/form.service';
import { Form } from '../models/form';
import { FormSubmit } from '../models/form-submit';
import { FormSubmitField } from '../models/form-submit-field';
import { ColumnInfo } from '../models/column-info';
import {FormOption} from '../models/form-option';
import { UtilService } from '../../core/services/util.service';
import { GeoLocationAnalytics } from '../../util/geo-location-analytics';
import { Ng2DeviceService } from 'ng2-device-detector';
import { LandingPageService } from '../../landing-pages/services/landing-page.service';

declare var $:any;


@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css','../../../assets/css/loader.css'],
  providers: [HttpRequestLoader,FormService,Processor,LandingPageService],
})
export class FormPreviewComponent implements OnInit {
    deviceInfo: any;
    ngxLoading = false;
    customResponse: CustomResponse = new CustomResponse();
    alias: any;
    form:Form = new Form();
    hasFormExists = true;
    validForm = true;
    isValidEmailIds = true;
    alertClass ="";
    successAlertClass = "alert alert-success";
    errorAlertClass = "alert-danger error-alert-custom-padding";
    show: boolean;
    formSubmitted = false;
    message: string;
    isSubmittedAgain = false;
  constructor(private route: ActivatedRoute,private referenceService:ReferenceService,
    private authenticationService:AuthenticationService,private formService:FormService,
    private logger:XtremandLogger,public httpRequestLoader: HttpRequestLoader,public processor:Processor,private router:Router,
    private landingPageService:LandingPageService,public deviceService: Ng2DeviceService,private utilService:UtilService) {
      
  }

  ngOnInit() {
     $('.mobile-camp').removeClass('mobile-camp');
     $('body').css('cssText', 'background-image: url(https://www.xamplify.com/wp-content/uploads/2019/12/rsvp-bg.png);background-repeat: no-repeat;background-size: cover;background-position: center;');
      this.processor.set(this.processor);
      if(this.authenticationService.formAlias){
          this.alias = this.authenticationService.formAlias;
      }else{
          this.alias = this.route.snapshot.params['alias'];
      }
      this.getFormFieldsByAlias(this.alias);

  }
  
  refreshForm(){
      this.validForm = true;
      this.isValidEmailIds = true;
      this.customResponse = new CustomResponse();
      this.show = false;
      this.getFormFieldsByAlias(this.alias);
  }

  getFormFieldsByAlias(alias: string) {
    this.ngxLoading = true;
    this.formService.getByAlias(alias)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.hasFormExists = true;
            this.form = response.data;
            if(!this.isSubmittedAgain){
                this.saveLocationDetails(this.form);
            }
            
          } else {
            this.hasFormExists = false;
            this.addHeaderMessage("Oops! This form does not exists.",this.errorAlertClass);
          }
          this.processor.remove(this.processor);
          
          if(this.authenticationService.formValues.length > 0){
              this.form.formLabelDTOs = this.authenticationService.formValues;
          }
         
          
          this.ngxLoading = false;
        },
        (error: string) => {
          this.processor.remove(this.processor);
          this.ngxLoading = false;
          this.logger.errorPage(error);
          this.referenceService.showServerError(this.httpRequestLoader);
        }
      );

  }
  
  saveLocationDetails(form:Form){
      this.utilService.getJSONLocation()
      .subscribe(
        (response: any) => {
            let geoLocationAnalytics = new GeoLocationAnalytics();
            let upForm = new Form();
            this.deviceInfo = this.deviceService.getDeviceInfo();
            if (this.deviceInfo.device === 'unknown') {
                this.deviceInfo.device = 'computer';
            }
            geoLocationAnalytics.openedTime =new Date();
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
            this.saveAnalytics(geoLocationAnalytics);
        },
        (error: string) => {
            this.logger.error( "Error In Fetching Location Details" ); 
        }
      );
  }
  
  saveAnalytics(geoLocationAnalytics:GeoLocationAnalytics){
      this.landingPageService.saveAnalytics(geoLocationAnalytics)
      .subscribe(
        (data: any) => {
            console.log(data);
        },
        (error: string) => {
            this.logger.error( "Error In saving Location Details",error); 
        }
      );
      
  }
  
  
  validateEmail(columnInfo:ColumnInfo){
      if(columnInfo.labelType=='email'){
          if(!this.referenceService.validateEmailId($.trim(columnInfo.value))){
              columnInfo.divClass="error";
          }else{
              columnInfo.divClass="success";
          }
      }
      const invalidEmailIdsFieldsCount = this.form.formLabelDTOs.filter((item) => (item.divClass=='error')).length;
      if(invalidEmailIdsFieldsCount==0){
          this.isValidEmailIds = true;
      }else{
          this.isValidEmailIds = false;
      }
  }


  /*******Submit Forms********* */
  submitForm(){
    this.show = false;
    this.ngxLoading = true;
    this.referenceService.goToTop();
    this.validForm = true;
    const formLabelDtos = this.form.formLabelDTOs;
    const requiredFormLabels = formLabelDtos.filter((item) => (item.required === true && $.trim(item.value).length===0) );
    const invalidEmailIdsFieldsCount = formLabelDtos.filter((item) => (item.divClass=='error')).length;
    if(requiredFormLabels.length>0 ||invalidEmailIdsFieldsCount>0){
      this.validForm = false;
      this.addHeaderMessage('Please fill required fields',this.errorAlertClass);
    }else{
      this.validForm = true;
      const formSubmit = new FormSubmit();
      formSubmit.id = this.form.id;
      formSubmit.alias = this.alias;
      $.each(formLabelDtos,function(index:number,field:ColumnInfo){
          const formField  = new FormSubmitField();
          formField.id = field.id;
          formField.value = $.trim(field.value);
          if(field.labelType==="checkbox"){
            formField.dropdownIds = field.value;
            formField.value = "";
          }
          formSubmit.fields.push(formField);
      });
      this.formService.submitForm(formSubmit)
      .subscribe(
        (response: any) => {
          if(response.statusCode==200){
              this.addHeaderMessage(response.message,this.successAlertClass);
              this.formSubmitted = true;
          }else if(response.statusCode==404){
              this.addHeaderMessage(response.message,this.errorAlertClass);
          }
        },
        (error: string) => {
          this.ngxLoading = false;
          this.addHeaderMessage("Something went wrong.Please try after sometime",this.errorAlertClass);
        }
      );


    }
  }

  addHeaderMessage(message:string,divAlertClass:string){
      this.ngxLoading = false;
      this.show = true;
      this.message = message;
      this.alertClass = divAlertClass;
  }
  removeErrorMessage(){
    this.show = false;
  }

  updateCheckBoxModel(columnInfo:ColumnInfo,formOption:FormOption,event:any){
    if(columnInfo.value===undefined){
      columnInfo.value = Array<number>();
    }
    if(event.target.checked){
      columnInfo.value.push(formOption.id);
    }else{
      columnInfo.value.splice($.inArray(formOption.id,columnInfo.value),1);
    }
  }
  
  showForm(){
      this.formSubmitted = false;
      this.show = false;
      this.form = new Form();
      this.customResponse = new CustomResponse();
      this.isSubmittedAgain = true;
      this.getFormFieldsByAlias(this.alias);
  }

}

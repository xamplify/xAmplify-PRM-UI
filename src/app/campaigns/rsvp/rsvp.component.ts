import { Component, OnInit, ViewChild, OnDestroy, ElementRef, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';

import { Processor } from '../../core/models/processor';
import { CampaignRsvp } from '../models/campaign-rsvp';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormPreviewComponent } from '../../forms/preview/form-preview.component';
import { FormSubmit } from '../../forms/models/form-submit';
import { FormSubmitField } from '../../forms/models/form-submit-field';
import { ColumnInfo } from '../../forms/models/column-info';
import { Form } from '../../forms/models/form';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { FormService } from '../../forms/services/form.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { GeoLocationAnalytics } from 'app/util/geo-location-analytics';
import { UtilService } from 'app/core/services/util.service';
import { Ng2DeviceService } from 'ng2-device-detector';


declare var $: any;

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css'],
  providers: [Processor, FormService]
})
export class RsvpComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('dataContainer') dataContainer: ElementRef;
  @ViewChild('dataContainerDup') dataContainerDup: ElementRef;
  @ViewChild('formPreviewComponent') formPreviewComponent: FormPreviewComponent;
  alias: string;
  eventcampaign: any;
  isDataLoaded = false;
  campaignRsvp: CampaignRsvp = new CampaignRsvp();
  responseMessage: string;
  isRsvp = false;
  totalGuests = 0;
  type = "";
  replyUserName = "";
  characterleft = 140;
  rsvpSavingProcessing = false;
  eventExpiredError = false;
  isCancelledEvent = false;
  errorLogMessage = "";
  formAlias: any;
  form:Form = new Form();
  selectedType: string;
  selectedUtmType: string;
  hideForm = false;
  isCaptchaValid = false;
  geoLocationAnalytics : GeoLocationAnalytics;

  constructor(private changeDetectorRef: ChangeDetectorRef, public referenceService: ReferenceService, private route: ActivatedRoute, public campaignService: CampaignService, public processor: Processor,
    public authenticationService: AuthenticationService, private vanityURLService: VanityURLService, private formService: FormService, private logger: XtremandLogger, public utilService: UtilService, 
    public deviceService: Ng2DeviceService) { }

  getEventCampaign (alias: string) {
    this.campaignService.getEventCampaignByAlias(alias)
      .subscribe(
      (response:any) => {
       if(response.statusCode == 200){
        this.eventcampaign = response.data;
        if(response.data.targetUserDTO.emailId){
           this.authenticationService.isPartnerRsvp = true;
        }
        this.dataContainer.nativeElement.innerHTML = this.addURLs(this.eventcampaign.emailTemplateDTO.body);
        this.dataContainerDup.nativeElement.innerHTML = this.addURLs(this.eventcampaign.emailTemplateDTO.body);
        this.isRsvp = this.eventcampaign.campaignEventRsvps.length>0 ? true: false;
        this.campaignRsvp.alias = this.alias;
        this.isDataLoaded = true;
         if (this.eventcampaign.formDTOs[0].formLabelDTOs) {
           this.eventcampaign.formDTOs[0].formLabelDTOs.forEach((dto) => {
             if (dto.labelType == 'quiz_checkbox') {
               dto.choices = dto.checkBoxChoices;
             }
             else if (dto.labelType == 'country') {
              dto.value = "Please Select Country";
             }
             if (dto.checkBoxChoices && dto.dropdownIds) {
               if (dto['checkBoxChoices'] !== undefined && dto.checkBoxChoices.length > 0 && dto.dropdownIds.length > 0) {
                 dto.checkBoxChoices.forEach((value) => { value['isChecked'] = false; })
                 dto.value = dto.dropdownIds;
                 dto.dropdownIds.forEach((ids) => {
                   dto.checkBoxChoices.forEach((check) => {
                     if (ids === check.id) { check.isChecked = true; }
                   });

                 });
               }
             }

             if (dto['dropDownChoices'] !== undefined && dto.dropDownChoices.length > 0) {
               dto.dropDownChoices.forEach((value) => { value['selected'] = false; })

               dto.dropDownChoices.forEach((select) => {
                 if (dto.selectedValue) {
                   //select.selected = true;
                   dto.value = dto.selectedValue;
                 } else {
                   dto.value = dto.dropDownChoices[0].id;
                 }
               });
             }
             if (dto['radioButtonChoices'] !== undefined && dto.radioButtonChoices.length > 0) {
               dto.radioButtonChoices.forEach((select) => {
                 if (dto.selectedValue) {
                   dto.value = dto.selectedValue;
                 }
               });
             }
             if (dto.labelType == 'quiz_radio') {
              dto.choices = dto.radioButtonChoices;
              dto.radioButtonChoices.forEach((choice) => {
                if (dto.selectedValue === choice.id) { choice.isChecked = true; }
              });
            }
           });

           this.authenticationService.formValues = this.eventcampaign.formDTOs[0].formLabelDTOs;
           console.log(this.authenticationService.formValues);
         }
        this.replyUserName = this.eventcampaign.targetUserDTO.firstName;
        this.processor.remove(this.processor);
        this.eventStartTimeError();
        
        if(this.eventcampaign.eventCancellation.cancelled){
            this.isCancelledEvent = true;
        }
        
        this.formAlias = this.eventcampaign.formDTOs[0].alias;
        this.authenticationService.formAlias = this.eventcampaign.formDTOs[0].alias;
        
       }
       /*if(this.selectedUtmType === 'public'){
           this.eventcampaign.inviteOthers = false;
       }*/
       
       if(response.statusCode == 2000 || response.statusCode == 2001 || response.statusCode == 2002){
           this.isCancelledEvent = true;
           this.errorLogMessage = response.message;
           console.log(this.errorLogMessage);
       }
      },
      error => {
        console.log(error);
        this.processor.remove(this.processor);
      },
      () => console.log("Campaign Names Loaded")
      );
  }

  eventStartTimeError(){
      const currentDate = new Date().getTime();
      const startDate = Date.parse(this.eventcampaign.campaignEventTimes[0].startTimeString);

          if(startDate < currentDate){
            this.eventExpiredError = true;
            }
   }

  addURLs(templateBody:any){
    // just to avoid 404 link, added the links here.

      /*if ( this.eventcampaign.campaign ) {
          templateBody.body = templateBody.body.replace( "EVENT_TITLE", this.eventcampaign.campaign );
      }
      if ( this.eventcampaign.campaignEventTimes[0].startTimeString ) {
          let startTime = new Date(this.eventcampaign.campaignEventTimes[0].startTimeString);
          let srtTime = this.referenceService.formatAMPM(startTime);
          let date1 = startTime.toDateString()
          templateBody.body = templateBody.body.replace( "EVENT_START_TIME", date1 + " " + srtTime );
      }

      if ( this.eventcampaign.campaignEventTimes[0].endTimeString ) {
          let endDate = new Date(this.eventcampaign.campaignEventTimes[0].endTimeString);
          let endTime = this.referenceService.formatAMPM(endDate);
          let date2 = endDate.toDateString()
          templateBody.body = templateBody.body.replace( "EVENT_END_TIME", date2 + " " + endTime );
      }else if(this.eventcampaign.campaignEventTimes[0].allDay){

          let startTime = new Date(this.eventcampaign.campaignEventTimes[0].startTimeString);
          let date1 = startTime.toDateString()
          templateBody.body = templateBody.body.replace( "EVENT_END_TIME", date1 + " " + '11:59 PM' );
      }

      if ( this.eventcampaign.message ) {
          templateBody.body = templateBody.body.replace( "EVENT_DESCRIPTION", this.eventcampaign.message );
      }
      if ( !this.eventcampaign.onlineMeeting ) {
          if ( this.eventcampaign.campaignLocation.location && this.eventcampaign.campaignLocation.street ) {
              templateBody.body = templateBody.body.replace( /ADDRESS_LANE1/g, this.eventcampaign.campaignLocation.location + "," + this.eventcampaign.campaignLocation.street + "," );
              templateBody.body = templateBody.body.replace( /ADDRESS_LANE2/g, this.eventcampaign.campaignLocation.city + "," + this.eventcampaign.campaignLocation.state + "," + this.eventcampaign.campaignLocation.zip );
          }
      } else {
          templateBody.body = templateBody.body.replace( /EVENT_LOCATION/g, "Online Meeting" )
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "EVENT_EMAILID", this.eventcampaign.email );
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "VENDOR_NAME", this.authenticationService.user.firstName );
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "VENDOR_TITLE", this.authenticationService.user.jobTitle );
      }
      if ( this.eventcampaign.email ) {
          templateBody.body = templateBody.body.replace( "VENDOR_EMAILID", this.authenticationService.user.emailId );
      }
      if ( this.eventcampaign.campaignEventMedias[0].filePath ) {
          templateBody.body = templateBody.body.replace( "IMAGE_URL", this.eventcampaign.campaignEventMedias[0].filePath );
      }else{
          templateBody.body = templateBody.body.replace( "IMAGE_URL", "https://aravindu.com/vod/images/conference2.jpg" );
      }*/


 /*   templateBody = templateBody.replace('EVENT_TITLE', this.eventcampaign.campaign);
    templateBody = templateBody.replace('EVENT_START_TIME', this.eventcampaign.campaignEventTimes[0].startTimeString);
    templateBody = templateBody.replace('EVENT_END_TIME', this.eventcampaign.campaignEventTimes[0].endTimeString);
    if(this.eventcampaign.campaignLocation.location){
      templateBody = templateBody.replace('EVENT_LOCATION', 'Location: '+this.eventcampaign.campaignLocation.location);
    }else {
      templateBody = templateBody.replace('EVENT_LOCATION', '');
    }
    templateBody = templateBody.replace('EVENT_DESCRIPTION', 'Message:'+this.eventcampaign.message);*/
    templateBody = templateBody.replace("https://aravindu.com/vod/images/us_location.png", " ");
    templateBody = templateBody.replace('href="LINK_YES"',"hidden");
    templateBody = templateBody.replace('href="LINK_NO"',"hidden");
    templateBody = templateBody.replace('href="LINK_MAY_BE"',"hidden");

    // templateBody = templateBody.replace('LINK_YES',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=YES");
    // templateBody = templateBody.replace('LINK_NO',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=NO");
    // templateBody = templateBody.replace('LINK_MAY_BE',this.authenticationService.APP_URL+'rsvp/'+this.alias+"?type=MAYBE");
    return templateBody;
  }

  saveEventCampaignRsvp() {
    this.referenceService.goToTopImmediately();
    if(this.formPreviewComponent){
        this.form.formLabelDTOs = this.formPreviewComponent.form.formLabelDTOs;
        this.form.id = this.formPreviewComponent.form.id;
    }
    
    let self = this;
    
    const formLabelDtos = this.form.formLabelDTOs;
    const requiredFormLabels = formLabelDtos.filter((item) => (item.required === true && $.trim(item.value).length===0) );
    const invalidEmailIdsFieldsCount = formLabelDtos.filter((item) => (item.divClass=='error')).length;
    if(requiredFormLabels.length>0 ||invalidEmailIdsFieldsCount>0){
      this.formPreviewComponent.addHeaderMessage('Please fill required fields',this.formPreviewComponent.errorAlertClass);
      this.referenceService.goToTop();
    }else{
     this.rsvpSavingProcessing = true;
     const formSubmit = new FormSubmit();
     formSubmit.id = this.form.id;
     formSubmit.alias = this.alias;
     $.each(formLabelDtos,function(index:number,field:ColumnInfo){
        const formField: any = { };
        formField.id = field.id;
        formField.value = $.trim(field.value);
        if(field.labelType==="checkbox" || field.labelType === "quiz_checkbox"){
          formField.dropdownIds = field.value;
          formField.value = ""; 
        }
        formSubmit.fields.push(formField);
        //self.campaignRsvp.formSubmitDTO.push(formField);
    });
    formSubmit.geoLocationAnalyticsDTO = this.geoLocationAnalytics;
    this.campaignRsvp.formSubmitDTO = formSubmit;
    
    this.campaignRsvp.eventCampaignRsvp = this.selectedType;
    
    this.campaignRsvp.additionalCount = this.totalGuests;
    this.campaignService.saveEventCampaignRsvp(this.campaignRsvp)
      .subscribe(
      response => {
        this.referenceService.goToTop();
        this.totalGuests = 0;
        $('#myModal').modal('hide');
        this.campaignRsvp.message = '';
        this.hideForm = true;
      },
      error => {
        this.processor.remove(this.processor);
        this.rsvpSavingProcessing = false;
      },
      () => console.log("Campaign Names Loaded")
      );
    }
  }
  closeRsvpModel(){
    this.campaignRsvp.message = null;
    this.totalGuests = 0;
    this.replyUserName = '';
  }
  characterSize(){
    this.characterleft = 140 - this.campaignRsvp.message.length;
  }
  
  ngAfterViewChecked(){
      if(this.formPreviewComponent){
          this.form.formLabelDTOs = this.formPreviewComponent.form.formLabelDTOs;
          this.form.id = this.formPreviewComponent.form.id;
          this.form.showCaptcha = this.formPreviewComponent.form.showCaptcha;
      }
      this.changeDetectorRef.detectChanges();
      /* this.authenticationService.formAlias = this.formAlias;*/
  }
  
  
  setCampaignRsvpType(rspvType: any){
      this.campaignRsvp.eventCampaignRsvp = rspvType;
      this.selectedType = rspvType;
  }

  ngOnInit() {
    try {
      if (this.vanityURLService.isVanityURLEnabled()) {
        this.vanityURLService.checkVanityURLDetails();
      }
      this.authenticationService.isFromRsvpPage = true;
      $('body').css('cssText', 'background-image: url(https://www.xamplify.com/wp-content/uploads/2019/12/rsvp-bg.png);background-repeat: no-repeat;background-size: cover;background-position: center;');
      this.processor.set(this.processor);
      this.alias = this.route.snapshot.params['alias'];
      this.campaignRsvp.eventCampaignRsvp = this.route.snapshot.queryParams['type'];
      this.selectedType = this.route.snapshot.queryParams['type'];
      this.selectedUtmType = this.route.snapshot.queryParams['utm_source'];
      this.getEventCampaign(this.alias);
      this.setLocationDetails();
    } catch (error) {
      console.error(error);
    }
  }
  
  ngOnDestroy() {
      this.authenticationService.isFromRsvpPage = false;
      this.authenticationService.isPartnerRsvp = false;
      this.isDataLoaded = false;
      this.responseMessage = '';
  }

  setEnableCaptcha(event:any){
    this.isCaptchaValid = event;
  }

  setLocationDetails() {
    this.utilService.getJSONLocation()
      .subscribe(
        (response: any) => {
          let geoLocationAnalytics = new GeoLocationAnalytics();
          let deviceInfo = this.deviceService.getDeviceInfo();
          if (deviceInfo.device === 'unknown') {
            deviceInfo.device = 'computer';
          }
          geoLocationAnalytics.openedTime = new Date();
          geoLocationAnalytics.deviceType = deviceInfo.device;
          geoLocationAnalytics.os = deviceInfo.os;
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
          this.geoLocationAnalytics = geoLocationAnalytics;
        },
        (error: string) => {
          this.logger.error("Error In Fetching Location Details");
        }
      );
  }
}

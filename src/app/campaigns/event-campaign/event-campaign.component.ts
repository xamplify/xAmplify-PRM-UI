import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { ContactService } from '../.././contacts/services/contact.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';

import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { EventCampaign } from '../models/event-campaign';
import { CampaignEventMedia } from '../models/campaign-event-media';
import { Pagination } from '../../core/models/pagination';
import { ContactList } from '../../contacts/models/contact-list';
import { EmailTemplate } from '../../email-template/models/email-template';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { Properties } from '../../common/models/properties';
import { Reply } from '../models/campaign-reply';
import { CampaignEmailTemplate } from '../models/campaign-email-template';
import { EventError } from '../models/event-error';
import { CustomResponse } from '../../common/models/custom-response';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CountryNames } from '../../common/models/country-names';
import { Roles } from '../../core/models/roles';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
var moment = require('moment-timezone');

declare var $,swal, flatpickr, CKEDITOR,require;

@Component({
  selector: 'app-event-campaign',
  templateUrl: './event-campaign-step.component.html',
  styleUrls: ['./event-campaign.component.css','../create-campaign/create-campaign.component.css'],
  providers: [PagerService, Pagination, CallActionSwitch, Properties,EventError,HttpRequestLoader, CountryNames]
})
export class EventCampaignComponent implements OnInit, OnDestroy,AfterViewInit {
  emailTemplates: Array<EmailTemplate> = [];
  campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
  reply: Reply = new Reply();
  showSelectedTemplate: any;
  countries: Country[];
  timezonesCampaignEventTime: Timezone[];
  timezones: Timezone[];
  allItems = [];
  dataError = false;
  errorLength = 0;
  showErrorMessage = false;
  launchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
  selectedLaunchOption: string;
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: number;
  isPartnerUserList: boolean;  // changed for code ,, future it may change
  eventCampaign: EventCampaign = new EventCampaign();
  @ViewChild("myckeditor") ckeditor: any;
  ckeConfig: any;

  previewContactList = new ContactList();
  contactListsPagination: Pagination = new Pagination();
  contactsPagination: Pagination = new Pagination();
  paginationType: string;

  teamMemberEmailIds: any[] = [];
  isFormSubmitted = false;
  emailNotOpenedReplyDaysSum = 0;
  emailOpenedReplyDaysSum = 0;
  onClickScheduledDaysSum = 0;
  userListIds:any = [];
  isPreviewEvent = false;
  eventRouterPage = false;
  isSelectedSchedule = false;
  isLaunched = false;
  hasInternalError = false;
  isReloaded = false;
  isAdd = true;
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  isValidCampaignName = false;
  names: string[] = [];
  editedCampaignName = '';
  datePassedError = '';
  endDateErrorMesg = '';
  endDatePassedError = '';
  endDatePassError = false;
  currentDate:any;
  scheduleCampaignError = '';
  parternUserListIds = [];
  reDistributeEvent = false;
  loader = false;
  isEditCampaign = false;
  checkLaunchOption:string;

  campaignEmailTemplates=[];
  emailTemplatesPagination:Pagination = new Pagination();

  detailsTab = false;
  recipientsTab = false;
  emailTemplatesTab = false;
  launchTab = false;

  detailsTabClass: string;
  recipientsTabClass = "disableRecipientsTab";
  emailTemplatesTabClass = "disableRecipientsTab";
  launchTabClass = "disableRecipientsTab";
  currentTab: string;
  showContactType:boolean = false;
  roleName: Roles= new Roles();
  gridLoader = false;
  selectedListOfUserLists = [];
  selectedListOfUserListForPreview = [];
  isHeaderCheckBoxChecked: boolean = false;
  contactSearchInput: string = "";
  emailTemplateSearchInput: string = "";
  timeZoneSetValue: any;
  showSelectedEmailTemplate:boolean = false;
  filteredEmailTemplateIds: Array<number>;
  emailTemplateId:number=0;
  selectedEmailTemplateRow:number;
  isHighLet = false;
  parentCampaignId = false;
  reDistributeEventManage = false;
  parentCampaignIdValue:number;
  isPartnerToo = false;
  constructor(public callActionSwitch: CallActionSwitch, public referenceService: ReferenceService,
    private contactService: ContactService,
    public campaignService: CampaignService,
    public authenticationService: AuthenticationService,
    public emailTemplateService: EmailTemplateService,
    private pagerService: PagerService,
    private logger: XtremandLogger,
    private router: Router, public activatedRoute:ActivatedRoute,
    public properties: Properties, public eventError:EventError, public countryNames: CountryNames) {
    this.countries = this.referenceService.getCountries();
    this.eventCampaign.campaignLocation.country = ( this.countryNames.countries[0] );
    //this.listEmailTemplates();
    CKEDITOR.config.height = '100';
    this.isPreviewEvent = this.router.url.includes('/home/campaigns/event-preview')? true: false;
    this.isEditCampaign = this.router.url.includes('/home/campaigns/event-edit')? true: false;
    CKEDITOR.config.readOnly = this.isPreviewEvent ? true: false;
    this.reDistributeEvent = this.router.url.includes('/home/campaigns/re-distribute-event')? true: false;
    this.reDistributeEventManage = this.router.url.includes('/home/campaigns/re-distribute-manage')? true: false;
    if(this.reDistributeEvent) { this.isPartnerUserList = false; } else { this.isPartnerUserList = true; }
    if(this.authenticationService.isOnlyPartner()) {  this.isPartnerUserList = false; }
    this.isPartnerToo = this.authenticationService.checkIsPartnerToo();

  }
  isEven(n) { if(n % 2 === 0){ return true;} return false;}
  loadCampaignNames(userId:number){
    this.campaignService.getCampaignNames(userId).subscribe(data => { this.names.push(data); },
    error => console.log( error ), () => console.log( "Campaign Names Loaded" ) );
}
  validateCampaignName(campaignName:string){
     campaignName.replace( /\s\s+/g, '' )
     this.eventTitleError();
     this.resetTabClass();
     const lowerCaseCampaignName = $.trim(campaignName.toLowerCase());//Remove all spaces
     const list = this.names[0];
     if(this.isAdd){
         if($.inArray(lowerCaseCampaignName, list) > -1){
             this.isValidCampaignName = false;
         }else{
             this.isValidCampaignName = true;
         }
     }else{
         console.log(this.editedCampaignName.toLowerCase()+":::::::::"+lowerCaseCampaignName);
         if($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName.toLowerCase()!=lowerCaseCampaignName){
             this.isValidCampaignName = false;
         }else{
             this.isValidCampaignName = true;
         }
     }
     this.resetTabClass();
 }
 imageClick(){
  $('#eventImage').click();
 }

 eventHandler(event:any){
  if(event===13) { this.searchEmailTemplate();}
 }
 ngOnInit() {
    this.detailsTab = true;
    this.resetTabClass()
    this.loggedInUserId = this.authenticationService.getUserId();
    this.loadCampaignNames( this.loggedInUserId );
    this.listAllTeamMemberEmailIds();
   // this.loadContactLists(this.contactListsPagination);

    if (this.referenceService.selectedCampaignType!=='eventCampaign' && this.router.url.includes('/home/campaigns/event') && !this.activatedRoute.snapshot.params['id']) {
      console.log( "This page is reloaded" );
      this.router.navigate(['/home/campaigns/select']);
        this.isReloaded = true;
    }
    else if(this.activatedRoute.snapshot.params['id']){
      this.isAdd = false;
      this.eventRouterPage =true;
      const alias = this.activatedRoute.snapshot.params['id'];
      if(this.reDistributeEvent){ this.campaignService.reDistributeEvent = true; }
      this.campaignService.getEventCampaignById(alias).subscribe(
        (result)=>{
        this.campaignService.eventCampaign = result.data;
        this.eventCampaign = result.data;
        if(result.data.enableCoBrandingLogo){ this.eventCampaign.enableCoBrandingLogo = result.data.enableCoBrandingLogo; }
        else { this.eventCampaign.enableCoBrandingLogo = false;}
        if(result.data.parentCampaignId) { this.parentCampaignIdValue = result.data.parentCampaignId; this.parentCampaignId =true; this.isPartnerUserList = false;}
        this.editedCampaignName = this.eventCampaign.campaign;
        this.validateCampaignName(this.eventCampaign.campaign);
        console.log( this.eventCampaign);
        this.eventCampaign.emailTemplate = result.data.emailTemplateDTO;
        if(!this.eventCampaign.emailTemplate) { this.eventCampaign.emailTemplate = new EmailTemplate(); }
        else { this.showSelectedTemplate = result.data.emailTemplateDTO.id;}
        this.eventCampaign.user = result.data.userDTO;
        if(result.data.campaignReplies===undefined){ this.eventCampaign.campaignReplies = [];}
        else {this.getCampaignReplies(this.eventCampaign);}
        this.eventCampaign.campaignEventTimes = result.data.campaignEventTimes;
        if(!this.eventCampaign.campaignEventTimes[0]){
          this.eventCampaign.campaignEventTimes = [];
          this.eventCampaign.campaignEventTimes[0].startTimeString = new Date().toDateString();
          if(!this.eventCampaign.campaignEventTimes[0].allDay){
            this.eventCampaign.campaignEventTimes[0].endTimeString =  new Date().toDateString();
          }
        }
       if(this.eventCampaign.country === undefined || this.eventCampaign.country === ""  ){ this.eventCampaign.countryId = 0; }
       else { this.eventCampaign.countryId = this.countries.find(x => x.name == result.data.country).id; }
        //  this.eventCampaign.campaignEventTimes[0].countryId = this.countries.find(x => x.name == result.data.campaignEventTimes[0].country).id;
        if( this.eventCampaign.campaignEventTimes[0].countryId===undefined) { this.eventCampaign.campaignEventTimes[0].countryId=0; }
        for(let i=0; i< this.countries.length;i++){
          if(this.countries[i].name=== result.data.campaignEventTimes[0].country){
            this.eventCampaign.campaignEventTimes[0].countryId = this.countries[i].id;
            break;
          }
        }
        if ( !this.eventCampaign.campaignLocation.country ) {
            this.eventCampaign.campaignLocation.country = ( this.countryNames.countries[0] );
        }
        this.onChangeCountryCampaignEventTime(this.eventCampaign.campaignEventTimes[0].countryId)
        if(this.reDistributeEvent){ this.isPartnerUserList = false;}
        this.eventCampaign.userListIds = [];
        for(let i=0; i< result.data.userListDTOs.length;i++){
         this.parternUserListIds.push(result.data.userListDTOs[i].id);
         this.eventCampaign.userListIds.push(result.data.userListDTOs[i].id);
        }
        if(this.reDistributeEvent){
            this.eventCampaign.userListIds = []; this.userListIds = [];this.parternUserListIds = [];
            this.checkLaunchOption = this.eventCampaign.campaignScheduleType;
        }
        this.eventCampaign.userLists = [];
        console.log(this.userListIds);

        if(this.isPreviewEvent){
          this.selectedListOfUserListForPreview = result.data.userListDTOs;
          this.setUserLists()
        }
        if(this.authenticationService.isOnlyPartner()){
          const emailTemplates:any = [];
          this.emailTemplates.forEach((element,index)=>{
            if(element.id === this.eventCampaign.emailTemplate.id){ emailTemplates.push(element);}
          });
          this.emailTemplates = emailTemplates;
        }

        if(this.isEditCampaign){
            if(this.parternUserListIds.length>0){
                this.contactsPagination.editCampaign = true;
                this.parternUserListIds = this.eventCampaign.userListIds.sort();
                this.emailTemplateId = this.eventCampaign.emailTemplate.id;
            }

            if ( this.eventCampaign.campaignScheduleType === 'SAVE' ) {
                this.launchOptions[2];
                this.setLaunchOptions( 'SAVE' );
            } else if( this.eventCampaign.campaignScheduleType === 'SCHEDULE' ){
                this.launchOptions[1];
                this.setLaunchOptions( 'SCHEDULE' );
            }
        }
        for(let i=0; i< this.timezonesCampaignEventTime.length; i++){
          if(this.timezonesCampaignEventTime[i].timezoneId === this.eventCampaign.campaignEventTimes[0].timeZone){
            console.log(this.timezonesCampaignEventTime[i].timezoneId);
          }
        }

        this.loadContactLists(this.contactListsPagination);
        this.setTemplateId();
        if(!this.eventCampaign.nurtureCampaign){ this.loadEmailTemplates(this.emailTemplatesPagination); }
        this.recipientsTabClass = "enableRecipientsTab";
        this.detailsTab = true;
        this.resetTabClass();
        this.eventStartTimeError()

      }
    );
    }
    else{
    /*this.eventCampaign.emailTemplate = this.emailTemplates[0];*/
    this.eventCampaign.countryId = this.countries[0].id;
    this.eventCampaign.campaignEventTimes[0].countryId = this.countries[0].id;
    this.loadContactLists(this.contactListsPagination);
    this.loadEmailTemplates(this.emailTemplatesPagination);
  }
    flatpickr('.flatpickr', {
      enableTime: true,
      dateFormat: 'm/d/Y h:i K',
      time_24hr: false,
      minDate: new Date(),
    });
    this.ckeConfig = {
      allowedContent: true,
    };
  }
  ngAfterViewInit() {
   // this.listAllTeamMemberEmailIds();
      this.detailsTab = true;
      this.resetTabClass()
  }

  setTemplateId(){
      this.emailTemplateId = this.eventCampaign.emailTemplate.id;
      this.eventCampaign.selectedEditEmailTemplate = this.eventCampaign.emailTemplate;
  }

  eventTitleError(){
      this.eventError.eventTitleError = this.eventCampaign.campaign.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") ? false: true;
  }

  eventSubjectLineError(){
      this.eventError.eventSubjectLineError = this.eventCampaign.subjectLine.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") ? false: true;
      this.resetTabClass();
  }

  eventHostByError(){
    this.eventError.eventHostByError = this.eventCampaign.fromName.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") ? false: true;
    this.resetTabClass();
  }
  eventStartTimeError(){
     const currentDate = new Date().getTime();
     const startDate = Date.parse(this.eventCampaign.campaignEventTimes[0].startTimeString);
     if(startDate < currentDate) { this.setStartTimeErrorMessage(true, 'Start Date / Time is already over.');}
     else if( startDate > currentDate){ this.setStartTimeErrorMessage(false, '');}
     else if(!this.eventCampaign.campaignEventTimes[0].startTimeString){this.setStartTimeErrorMessage(true, 'The start date is required.'); }
     else { this.setStartTimeErrorMessage(false, ''); }

     if(this.reDistributeEvent){
         if(startDate < currentDate){
          this.eventError.eventExpiredError = true;
         }
     }
     this.eventEndTimeError();
     this.eventSameDateError();
     this.resetTabClass();
  }
  setStartTimeErrorMessage(event:boolean, mesg:string){
    this.eventError.eventStartTimeError = event;
    this.datePassedError = mesg;
  }
  eventEndTimeError(){
  if(!this.eventCampaign.campaignEventTimes[0].allDay){
    this.eventError.eventEndDateError = !this.eventCampaign.campaignEventTimes[0].endTimeString ? true: false;
    this.endDateErrorMesg = 'The end date is required.'
  } else {
    this.eventError.eventEndDateError = false;
    this.endDateErrorMesg = '';
   }
   this.eventSameDateError();
   this.resetTabClass();
  }
  eventSameDateError(){
    const endDate = Date.parse(this.eventCampaign.campaignEventTimes[0].endTimeString);
    const startDate = Date.parse(this.eventCampaign.campaignEventTimes[0].startTimeString);
    if(this.eventCampaign.campaignEventTimes[0].endTimeString && !this.eventCampaign.campaignEventTimes[0].allDay && startDate===endDate){
     this.eventError.eventSameDateError = true;
     this.endDatePassedError = 'The event must end after the start date and time';
    } else if(startDate > endDate && !this.eventCampaign.campaignEventTimes[0].allDay ){ this.setSameDateErrorMesg(true,true,'The event must end after the start date and time.');
    } else { this.setSameDateErrorMesg(false,false,''); }
  this.resetTabClass();
  }
  setSameDateErrorMesg(endDate,sameDate,mesg){ this.endDatePassError = endDate; this.eventError.eventSameDateError = sameDate;this.endDatePassedError = mesg;}
  eventLocationError(){
    if(!this.eventCampaign.onlineMeeting){
    this.eventError.eventLocationError = this.eventCampaign.campaignLocation.location.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") ? false: true;
    } else { this.eventError.eventLocationError = false;}
    this.resetTabClass()
  }
  eventCountryError(){
    this.eventError.eventCountryAndTimeZone = this.eventCampaign.campaignEventTimes[0].countryId ? false: true;
    this.resetTabClass();
  }
  eventDescriptionError(){
    this.eventError.eventDescription = this.eventCampaign.message ? false: true;
    this.resetTabClass();
  }
  eventContactListError(){
    this.eventError.eventContactError = this.eventCampaign.userListIds.length>0 ? false: true;
    this.resetTabClass();
  }
  onBlurValidation(){
   this.eventTitleError();
   this.eventHostByError();
   this.eventStartTimeError();
   this.eventEndTimeError();
   this.eventCountryError();
   this.eventLocationError();
   this.eventDescriptionError();
   this.eventContactListError();
   this.eventSameDateError();
  }

  /*****************LOAD CONTACTLISTS WITH PAGINATION START *****************/

  searchContactList(){
      this.contactListsPagination.pageIndex = 1;
      this.contactListsPagination.searchKey = this.contactSearchInput;
      this.loadContactLists(this.contactListsPagination);
  }

  clearContactListSearch(){
      this.contactListsPagination.pageIndex = 1;
      this.contactListsPagination.searchKey = "";
      this.loadContactLists(this.contactListsPagination);
  }
  eventHandlerContact(event:any){ if(event===13){ this.searchContactList(); }}

  loadContactLists(contactListsPagination: Pagination) {
    this.paginationType = 'contactlists';
    if(this.isEditCampaign){
       contactListsPagination.editCampaign = true;
       contactListsPagination.campaignId = this.eventCampaign.id;
    }
   if(this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner()){
       this.contactListsPagination.filterValue = false;
       this.contactListsPagination.filterKey = null;
       this.showContactType = true;
   }else {
       if(this.reDistributeEvent || this.reDistributeEventManage){
           this.contactListsPagination.filterValue = false;
       }else{
       this.contactListsPagination.filterValue = true;
       }
       this.showContactType = false;
       this.contactListsPagination.filterKey = 'isPartnerUserList';
   }
    this.contactService.loadContactLists(contactListsPagination)
      .subscribe(
      (data: any) => {
        this.contactListsPagination.totalRecords = data.totalRecords;
        this.contactListsPagination = this.pagerService.getPagedItems(this.contactListsPagination, data.listOfUserLists);
      //  this.contactListsPagination.pagedItems = this.referenceService.removeDuplicatesObjects(this.contactListsPagination.pagedItems, "id");
        if(this.isPreviewEvent && this.authenticationService.isOnlyPartner()){
          const contactsAll:any = [];
          this.contactListsPagination.pagedItems.forEach((element, index) => {
              if( element.id ===this.parternUserListIds[index]) {
                contactsAll.push(this.contactListsPagination.pagedItems[index]);
              }
            });
            this.contactListsPagination.pagedItems = contactsAll;
           }
        const contactIds = this.contactListsPagination.pagedItems.map( function( a ) { return a.id; });
        const items = $.grep( this.parternUserListIds, function( element ) {
            return $.inArray( element, contactIds ) !== -1;
        });
        if ( items.length == contactListsPagination.totalRecords || items.length == this.contactListsPagination.pagedItems.length ) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
        if(this.authenticationService.isOrgAdmin() || this.authenticationService.isOrgAdminPartner()){
           this.contactListsPagination.pagedItems = this.referenceService.removeDuplicatesObjects(this.contactListsPagination.pagedItems, "id");
        }
      },
      (error: any) => {
        this.logger.error(error);
      },
      () => { this.logger.info('event campaign page loadContactLists() finished'); } );
  }

  /*****************LOAD CONTACTLISTS WITH PAGINATION END *****************/

  /*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION START *****************/
  loadContactsOnPreview(contactList: ContactList, pagination: Pagination) {
    pagination.pageIndex = 1;
    this.contactsPagination.maxResults = 12;
    this.loadContacts(contactList, pagination);
  }

  loadContacts(contactList: ContactList, pagination: Pagination) {
    this.paginationType = 'contacts';
    this.previewContactList = contactList;
    this.contactService.loadUsersOfContactList(this.previewContactList.id, pagination).subscribe(
      (data: any) => {
        pagination.totalRecords = data.totalRecords;
        this.contactsPagination = this.pagerService.getPagedItems(pagination, data.listOfUsers);
        $('#contactsModal').modal('show');
      },
      error =>
        () => console.log('loadContacts() finished')
    );
  }
  loadContactsPreviewOn(userId:any){
    let contactList = new ContactList(userId);
    contactList.name = "selected Contact Lists"
    this.loadContacts(contactList,this.contactsPagination)

  }
  switchStatusChange(){
      this.eventCampaign.channelCampaign = !this.eventCampaign.channelCampaign;

      if(!this.eventCampaign.channelCampaign){
          this.eventCampaign.enableCoBrandingLogo = false;
          this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
          this.loadEmailTemplates(this.emailTemplatesPagination);
      }
  }

  setCoBrandingLogo(event:any){
      this.eventCampaign.enableCoBrandingLogo = event;
      if(this.eventCampaign.enableCoBrandingLogo){
          //this.eventCampaign.enableCoBrandingLogo = true;
          this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.EVENT_CO_BRANDING;
      }else{
          //this.eventCampaign.enableCoBrandingLogo = false;
          this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
      }
      this.loadEmailTemplates(this.emailTemplatesPagination);

      //let isRegularCoBranding = this.eventCampaign.emailTemplate!=undefined && this.eventCampaign.emailTemplate.regularCoBrandingTemplate;
      //let isVideoCoBranding =  this.eventCampaign.emailTemplate!=undefined &&  this.eventCampaign.emailTemplate.videoCoBrandingTemplate;
      //this.filterCoBrandedTemplates(event);
  }

  searchEmailTemplate(){
      this.emailTemplatesPagination.pageIndex = 1;
      this.emailTemplatesPagination.searchKey = this.emailTemplateSearchInput;
      this.emailTemplatesPagination.coBrandedEmailTemplateSearch = this.eventCampaign.enableCoBrandingLogo;
      this.loadEmailTemplates(this.emailTemplatesPagination);
  }
  clearEmailTemplateSearch(){
      this.emailTemplatesPagination.pageIndex = 1;
      this.emailTemplatesPagination.searchKey = "";
      this.loadEmailTemplates(this.emailTemplatesPagination);
  }

  loadEmailTemplates(pagination:Pagination){
      this.gridLoader = true;
      pagination.throughPartner = this.eventCampaign.channelCampaign;
      this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
      if(pagination.searchKey==null || pagination.searchKey==""){
          pagination.campaignDefaultTemplate = true;
      }else{
          pagination.campaignDefaultTemplate = false;
          pagination.isEmailTemplateSearchedFromCampaign = true;
      }
      pagination.filterBy = 'campaignEventEmails';
      pagination.userId = this.loggedInUserId;
      this.emailTemplateService.listTemplates(pagination,this.loggedInUserId)
      .subscribe(
          (data:any) => {
              let allEventEmailTemplates = data.emailTemplates;
              this.gridLoader = false;
              this.campaignEmailTemplates = [];
              for(let i=0;i< allEventEmailTemplates.length;i++){
                  if(this.eventCampaign.channelCampaign){
                      if(allEventEmailTemplates[i].beeEventCoBrandingTemplate){
                       this.campaignEmailTemplates.push(allEventEmailTemplates[i]);
                      }
                   }else{
                       this.campaignEmailTemplates = allEventEmailTemplates;
                   }
              }
              pagination.totalRecords = data.totalRecords;
              this.emailTemplatesPagination = this.pagerService.getPagedItems(pagination, this.campaignEmailTemplates);
              this.filterEmailTemplateForEditCampaign();
             this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
          },
          (error:string) => {
             this.logger.errorPage(error);
          },
          () => this.logger.info("Finished loadEmailTemplates()", this.emailTemplatesPagination)
          )
  }


  setPage(event: any) {
    if (event.type === 'contacts') {
      this.contactsPagination.pageIndex = event.page;
      this.loadContacts(this.previewContactList, this.contactsPagination);
    }
    else if (event.type === 'contactlists') {
      this.contactListsPagination.pageIndex = event.page;
      this.loadContactLists(this.contactListsPagination);
    }else if(event.type ==="emailTemplates"){
        this.emailTemplatesPagination.pageIndex = event.page;
        this.loadEmailTemplates(this.emailTemplatesPagination);
    }
  }

  loadPaginationDropdownTemplates(paginarion:Pagination){
      this.loadEmailTemplates(paginarion);
      }

  paginationDropDown(pagination: Pagination) {
    if (this.paginationType === 'contacts') { this.loadContacts(this.previewContactList, pagination); }
    else if (this.paginationType === 'contactlists') { this.loadContactLists(pagination); }
  }
  changeAllDay(){
    this.eventCampaign.campaignEventTimes[0].allDay = !this.eventCampaign.campaignEventTimes[0].allDay;
    if(this.eventCampaign.campaignEventTimes[0].allDay && this.eventCampaign.campaignEventTimes[0].endTimeString){
      this.eventCampaign.campaignEventTimes[0].endTimeString = '';
      this.eventError.eventDateError = false;
      this.eventStartTimeError();
    } else if(this.eventCampaign.campaignEventTimes[0].allDay){
      this.endDateErrorMesg = '';
      this.eventError.eventEndDateError = false;
      this.eventStartTimeError();
    }
     else {
      this.endDateErrorMesg = 'The end date is required.';
      this.eventError.eventEndDateError = true;
    }
    this.resetTabClass();
  }
  toggleContactLists() {
    this.eventError.eventContactError = true;
    this.isPartnerUserList = !this.isPartnerUserList;
    if(this.isPartnerUserList) {
     if(this.parternUserListIds.length>0) { this.userListIds = [];
      this.eventError.eventContactError = false;
    }
    }
    else {if(this.userListIds.length>0) { this.parternUserListIds = [];
        this.eventError.eventContactError = false;}
    }
    this.contactListsPagination.pageIndex = 1;
    this.loadContactLists(this.contactListsPagination);
  }

  checkAllForPartners( ev: any ) {
      try {
          if ( ev.target.checked ) {
              console.log( "checked" );
              $( '[name="campaignContact[]"]' ).prop( 'checked', true );
              let self = this;
              $( '[name="campaignContact[]"]:checked' ).each( function() {
                  var id = $( this ).val();
                  self.parternUserListIds.push( parseInt( id ) );
                  console.log( self.parternUserListIds );
                  $( '#campaignContactListTable_' + id ).addClass( 'contact-list-selected' );
                  self.eventError.eventContactError = false;
              });
              this.parternUserListIds = this.referenceService.removeDuplicates( this.parternUserListIds );
          } else {
              $( '[name="campaignContact[]"]' ).prop( 'checked', false );
              $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );
              if ( this.contactListsPagination.maxResults == this.contactListsPagination.totalRecords ) {
                  this.parternUserListIds = [];
                  this.userListIds = [];
                  $( '#user_list_tb tr' ).removeClass( "contact-list-selected" );
              } else {
                  let currentPageContactIds = this.contactListsPagination.pagedItems.map( function( a ) { return a.id; });
                  this.parternUserListIds = this.referenceService.removeDuplicatesFromTwoArrays( this.parternUserListIds, currentPageContactIds );
              }
              if(this.parternUserListIds.length===0){  this.eventError.eventContactError = true;}
          }
          ev.stopPropagation();
          this.resetTabClass();
      } catch ( error ) {
          console.error( error, "editContactComponent", "checkingAllContacts()" );
      }
  }

  partnerHighlightRow(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    if (isChecked) {
      if (!this.parternUserListIds.includes(contactListId)) {
        this.parternUserListIds.push(contactListId);
        if(this.parternUserListIds.length>0){  this.eventError.eventContactError = false;
        }else{this.eventError.eventContactError = true;}
        this.userListIds = [];
        $('#campaignContactListTable_'+contactListId).addClass('contact-list-selected');
      }
      $('#' + contactListId).parent().closest('tr').addClass('contact-list-selected');
    } else {
      this.parternUserListIds.splice($.inArray(contactListId, this.parternUserListIds), 1);
      $('#' + contactListId).parent().closest('tr').removeClass('contact-list-selected');
      $('#campaignContactListTable_'+contactListId).removeClass('contact-list-selected');
      if(this.parternUserListIds.length>0){  this.eventError.eventContactError = false;
      }else{this.eventError.eventContactError = true;}
    }

    if ( this.parternUserListIds.length == this.contactListsPagination.pagedItems.length ) {
        this.isHeaderCheckBoxChecked = true;
    } else {
        this.isHeaderCheckBoxChecked = false;
    }
  }

highlightPartnerContactRow(contactId:number,event:any,count:number,isValid:boolean){
  if(isValid){
      if(count>0){
          let isChecked = $('#'+contactId).is(':checked');
          if(isChecked){
              //Removing Highlighted Row
              $('#'+contactId).prop( "checked", false );
              $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
              console.log("Revmoing"+contactId);
              this.parternUserListIds.splice($.inArray(contactId,this.parternUserListIds),1);
              if(this.parternUserListIds.length>0){  this.eventError.eventContactError = false;
              }else{this.eventError.eventContactError = true;}
        }else{
            //Highlighting Row
            $('#'+contactId).prop( "checked", true );
            $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
            console.log("Adding"+contactId);
            this.parternUserListIds.push(contactId);
            if(this.parternUserListIds.length === 0){  this.eventError.eventContactError = true;
            }else{this.eventError.eventContactError = false;}
        }
          // this.contactsUtility();
        if ( this.parternUserListIds.length == this.contactListsPagination.pagedItems.length ) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
          event.stopPropagation();
          console.log(this.parternUserListIds);
      }else{
         // this.emptyContactsMessage = "Contacts are in progress";
      }
      this.resetTabClass();

  }

}
  closeModal() {
    this.paginationType = 'contactlists';
    this.contactsPagination = new Pagination();
  }

  validForm(eventCampaign:any){
   if(!this.eventError.eventStartTimeError &&!this.eventError.eventSameDateError && !this.eventError.eventEndDateError && !this.eventError.eventTitleError && !this.eventError.eventDateError && !this.eventError.eventHostByError
    && !this.eventError.eventLocationError && eventCampaign.campaign && eventCampaign.campaignEventTimes[0].startTimeString &&
    eventCampaign.campaignEventTimes[0].country!="Select Country" && this.errorLength===0 &&
    this.isFormSubmitted && eventCampaign.userListIds.length>0){ return true;}
   else { return false;}
  }
  scheduleTimeError(){
    const startDate = Date.parse(this.eventCampaign.campaignEventTimes[0].startTimeString);
    const currentDate = new Date().getTime();
    const scheduleTime = Date.parse(this.eventCampaign.launchTimeInString);
    if(scheduleTime > currentDate &&  scheduleTime > startDate) {
      this.setScheduleErrorMesg(true,'Your launch time must be before the event start date and time.'); }
    else if(scheduleTime === startDate){ this.setScheduleErrorMesg(true,'Your launch time must be before the event start date and time.');}
    else if(scheduleTime < currentDate){ this.setScheduleErrorMesg(true,'Please choose a different launch time.');}
    else if(!this.eventCampaign.launchTimeInString) {  this.setScheduleErrorMesg(true,'Schedule time is required');}
    else { this.setScheduleErrorMesg(false,''); }
  }
  setScheduleErrorMesg(event:boolean,mesg:string){ this.eventError.scheduleTimeError = event; this.scheduleCampaignError = mesg;}
  setScheduleEvent(){
    this.isSelectedSchedule = !this.isSelectedSchedule;
    this.checkLaunchOption = 'SCHEDULE';
    this.scheduleTimeError();
    if(this.isSelectedSchedule) { this.selectedLaunchOption = 'SCHEDULE';
    this.timezones = this.referenceService.getTimeZonesByCountryId(this.eventCampaign.countryId);
    }
  }
  setLaunchOptions(options:any){
    this.checkLaunchOption = options;
    if(this.checkLaunchOption=='SCHEDULE'){ this.setScheduleEvent();}
  }
  scheduleCampaign(){
    this.scheduleTimeError();
    this.referenceService.campaignSuccessMessage = "SCHEDULE";
    if(!this.eventError.scheduleTimeError && this.eventCampaign.countryId) {
      this.createEventCampaign(this.eventCampaign,'SCHEDULE');
    }

  }
  getCampaignData(eventCampaign:any){
    if(this.authenticationService.isOnlyPartner()){ eventCampaign.channelCampaign = false; }
    eventCampaign.user.userId = this.loggedInUserId;
    if(this.eventCampaign.campaignReplies && this.eventCampaign.campaignReplies.length>0){ this.getRepliesData(); }
    if(eventCampaign.userListIds != undefined){
    for (let userListId of eventCampaign.userListIds) {
      let contactList = new ContactList(userListId);
      eventCampaign.userLists.push(contactList);
    }
    }
   console.log(eventCampaign);
   let timeZoneId = "";
   if (eventCampaign.campaignScheduleType === "NOW" || eventCampaign.campaignScheduleType ==="SAVE") {
   //  eventCampaign.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
     let intlTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
     if(intlTimeZone!=undefined){
         timeZoneId = intlTimeZone;
     }else if(moment.tz.guess()!=undefined){
         timeZoneId = moment.tz.guess();
     }
     eventCampaign.launchTimeInString = null;
     eventCampaign.timeZone = timeZoneId;
    //  eventCampaign.campaignEventTimes[0].timeZone = timeZoneId;
    if(!this.timeZoneSetValue) { this.timeZoneSetValue = this.setEventTimeZone(); }
     eventCampaign.campaignEventTimes[0].timeZone = this.timeZoneSetValue;
   } else {
     const eventTimeZoneId = $('#timezoneId option:selected').val();
    if(!this.timeZoneSetValue) { this.timeZoneSetValue = this.setEventTimeZone(); }
    //  eventCampaign.timeZone = this.timeZoneSetValue;
    //  if(!timeZoneId) { eventCampaign.timeZone = this.timeZoneSetValue; }
     this.eventCampaign.campaignEventTimes[0].timeZone = this.timeZoneSetValue;
     eventCampaign.timeZone = eventTimeZoneId;
   }
   eventCampaign.campaign = this.referenceService.replaceMultipleSpacesWithSingleSpace(eventCampaign.campaign);
   eventCampaign.fromName = this.referenceService.replaceMultipleSpacesWithSingleSpace(eventCampaign.fromName);


   console.log(this.timeZoneSetValue);
   eventCampaign.campaignEventTimes[0].country = this.countries.find(x => x.id == eventCampaign.campaignEventTimes[0].countryId).name;
   eventCampaign.country = this.countries.find(x => x.id == eventCampaign.countryId).name;
   eventCampaign.toPartner = !eventCampaign.channelCampaign;
   if(eventCampaign.id){
    const customEventCampaign = {
      'id':eventCampaign.id,
      'campaign': this.referenceService.replaceMultipleSpacesWithSingleSpace(this.eventCampaign.campaign),
      'user':eventCampaign.user,
      'message':eventCampaign.message,
      'subjectLine':eventCampaign.subjectLine,
      'channelCampaign':eventCampaign.channelCampaign,
      'enableCoBrandingLogo':eventCampaign.enableCoBrandingLogo,
      'countryId': eventCampaign.countryId,
      'email':eventCampaign.email,
      'emailOpened':eventCampaign.emailOpened,
      'socialSharingIcons':eventCampaign.socialSharingIcons,
      'fromName': this.referenceService.replaceMultipleSpacesWithSingleSpace(eventCampaign.fromName),
      'launchTimeInString':eventCampaign.launchTimeInString,
      'emailTemplate':eventCampaign.emailTemplate,
      'timeZone': eventCampaign.timeZone,
      'campaignScheduleType': eventCampaign.campaignScheduleType,
      'campaignLocation': eventCampaign.campaignLocation,
      'campaignEventMedias': [{"filePath": eventCampaign.campaignEventMedias[0].filePath}],
      'campaignEventTimes': eventCampaign.campaignEventTimes,
      'country': eventCampaign.country,
      'publicEventCampaign': eventCampaign.publicEventCampaign,
      'toPartner':eventCampaign.toPartner,
      'inviteOthers':eventCampaign.inviteOthers,
      'rsvpReceived':eventCampaign.rsvpReceived,
      'onlineMeeting':eventCampaign.onlineMeeting,
      'userLists' : eventCampaign.userLists,
      'userListIds':eventCampaign.userListIds,
      'campaignReplies': eventCampaign.campaignReplies,
    }
    eventCampaign = customEventCampaign;
   }
   return eventCampaign;
  }
  createEventCampaign(eventCampaign: any, launchOption: string) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.loader = true;
    this.isFormSubmitted = true;
    eventCampaign.userListIds = this.parternUserListIds;
    if(this.eventCampaign.campaignLocation.country === "Select Country"){
        this.eventCampaign.campaignLocation.country = "";
    }
    this.onBlurValidation();
    eventCampaign.campaignScheduleType = launchOption;
    eventCampaign =  this.getCampaignData(eventCampaign)
    if((this.isEditCampaign || this.reDistributeEventManage) && !eventCampaign.onlineMeeting && !eventCampaign.campaignLocation.id)  {  }
    else {  eventCampaign.campaignLocation.id = null;}
    eventCampaign.campaignEventTimes[0].id = null;
    eventCampaign.campaignEventMedias[0].id = null;
    eventCampaign.user.id = null;

    for(let i=0; i< eventCampaign.campaignReplies.length;i++){
      eventCampaign.campaignReplies[i].id = null;
    }

    if(this.reDistributeEvent || this.reDistributeEventManage) {
      if(this.reDistributeEvent){
      eventCampaign.parentCampaignId = this.activatedRoute.snapshot.params['id'];
      eventCampaign.id = null; }
      if(this.reDistributeEventManage){
          eventCampaign.parentCampaignId = this.parentCampaignIdValue;
       }

      eventCampaign.enableCoBrandingLogo = eventCampaign.enableCoBrandingLogo;
      eventCampaign.nurtureCampaign = true;
      eventCampaign.selectedEditEmailTemplate = eventCampaign.emailTemplate.id;
      eventCampaign.channelCampaign = false;
      eventCampaign.toPartner = false;

    }

    delete eventCampaign.emailTemplateDTO;
    delete eventCampaign.userDTO
    delete eventCampaign.userListDTOs
    if (eventCampaign.campaignScheduleType === "NOW" || eventCampaign.campaignScheduleType ==="SAVE"){ eventCampaign.launchTimeInString = this.campaignService.setLaunchTime();}
    if(this.validForm(eventCampaign) && this.isFormSubmitted){
      this.referenceService.startLoader(this.httpRequestLoader);
      console.log(eventCampaign);
      this.campaignService.createEventCampaign(eventCampaign)
      .subscribe(
      response => {
        if (response.statusCode === 2000) {
          this.isLaunched = true;
          this.referenceService.stopLoader(this.httpRequestLoader);
          this.router.navigate(["/home/campaigns/manage"]);
          this.referenceService.campaignSuccessMessage = launchOption;
        } else {
          this.loader = false;
          this.referenceService.stopLoader(this.httpRequestLoader);
          if (response.statusCode === 2016) {
            this.customResponse = new CustomResponse( 'ERROR', response.errorResponses[0].message, true );
          }
          else if(response.statusCode === 7000){
            if(response.errorResponses[0].field =='campaign' && response.errorResponses[0].message=='Already Exists'){
              this.customResponse = new CustomResponse( 'ERROR', 'Campaign name is already exists.', true );
            }
            else if(response.errorResponses[0].field =="eventStartTimeString"){
              this.customResponse = new CustomResponse( 'ERROR', 'Please change the start time, its already over.', true );
            }
            else if(response.errorResponses[0].field =="scheduleTime"){
              this.customResponse = new CustomResponse( 'ERROR', 'Please change the schedule time, it should be before the event start time.', true );
            }
            else {
              this.customResponse = new CustomResponse( 'ERROR', response.errorResponses[0].message, true );
            }
            this.referenceService.goToTop();
          }
        }
      },
      (error:any) => { this.loader = false; console.log(error); },
      () => console.log("Campaign Names Loaded") );
    } else {
      this.referenceService.goToTop();
      this.showErrorMessage = true;
      this.loader = false;
      if( eventCampaign.campaignEventTimes[0].country=="Select Country"){
       // this.customResponse = new CustomResponse( 'ERROR', 'Please select the valid country', true );
      } else {
      this.customResponse = new CustomResponse( 'ERROR', 'Please complete the * required fields', true );
      }
      this.referenceService.goToTop();
    }
  }

  listAllTeamMemberEmailIds() {
    this.campaignService.getAllTeamMemberEmailIds(this.loggedInUserId)
      .subscribe(
      data => {
        console.log(data);
        const self = this;
        $.each(data, function (index, value) {
          self.teamMemberEmailIds.push(data[index]);
        });
        const teamMember = this.teamMemberEmailIds.filter((teamMember) => teamMember.id === this.loggedInUserId)[0];
        this.eventCampaign.email = teamMember.emailId;
        this.eventCampaign.fromName = $.trim(teamMember.firstName + " " + teamMember.lastName);
        this.eventCampaign.hostedBy = this.eventCampaign.fromName + " [" + this.eventCampaign.email + "]";
        this.setEmailIdAsFromName();
      },
      error => console.log(error),
      () => { console.log("Campaign Names Loaded");
      this.setFromName(); }
      );
  }

  setEmailIdAsFromName() {
    if (this.eventCampaign.fromName.length === 0) {
      this.eventCampaign.fromName = this.eventCampaign.email;
    }
  }

  setFromName() {
    const user = this.teamMemberEmailIds.filter((teamMember) => teamMember.emailId === this.eventCampaign.email)[0];
    this.eventCampaign.fromName = $.trim(user.firstName + " " + user.lastName);
    this.setEmailIdAsFromName();
    this.eventHostByError();
  }

  fileChange(event: any) {
    let file: File;
    if(event.target.files) { file = event.target.files[0]; }
    else if( event.dataTransfer.files) { file = event.dataTransfer.files[0]; }
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    this.campaignService.uploadEventCampaignMedia(this.loggedInUserId, formData)
      .subscribe(
      data => {
        this.eventCampaign.campaignEventMedias[0].filePath = data.data;
      },
      error => console.log(error),
      () => console.log('Finished')
      );
  }

  resetcampaignEventMedia() {
    this.eventCampaign.campaignEventMedias[0] = new CampaignEventMedia();
  }
  paginateEmailTemplateRows(pageIndex:number,reply:Reply){
    reply.emailTemplatesPagination.pageIndex = pageIndex;
    this.loadEmailTemplatesForAddReply(reply);
  }
  filterReplyTemplates(type:string,index:number,reply:Reply){
    if(type=="BASIC"){
        reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
    }else if(type=="RICH"){
        reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
    }else if(type=="UPLOADED"){
        reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
    }else if(type=="NONE"){
        reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
    }
    else if(type=="PARTNER"){
        reply.emailTemplatesPagination.emailTemplateType = EmailTemplateType.PARTNER;
    }
     reply.selectedEmailTemplateTypeIndex = index;
     reply.emailTemplatesPagination.pageIndex = 1;
     this.loadEmailTemplatesForAddReply(reply);
 }
 eventReplyHandler(keyCode: any, reply:Reply) {  if (keyCode === 13) {  this.searchReplyEmailTemplate(reply); } }
 searchReplyEmailTemplate(reply:Reply){
  reply.emailTemplatesPagination.pageIndex = 1;
  reply.emailTemplatesPagination.searchKey = reply.emailTemplateSearchInput;
  this.loadEmailTemplatesForAddReply(reply);
 }
  addReplyRows() {
    this.reply = new Reply();
    let length = this.allItems.length;
    length = length + 1;
    const id = 'reply-' + length;
    this.reply.divId = id;
    this.reply.actionId = 0;
    this.reply.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.eventCampaign.subjectLine);

    this.eventCampaign.campaignReplies.push(this.reply);
    this.allItems.push(id);
    this.loadEmailTemplatesForAddReply(this.reply);
  }

  loadEmailTemplatesForAddReply(reply: Reply) {
    if(!this.eventCampaign.nurtureCampaign){
    this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss = true;
    this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
    reply.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
    if (reply.emailTemplatesPagination.searchKey == null || reply.emailTemplatesPagination.searchKey == "") {
      reply.emailTemplatesPagination.campaignDefaultTemplate = true;
    } else {
      reply.emailTemplatesPagination.campaignDefaultTemplate = false;
      reply.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
    }
    reply.emailTemplatesPagination.maxResults = 12;
    this.emailTemplateService.listTemplates(reply.emailTemplatesPagination, this.loggedInUserId)
      .subscribe(
      (data: any) => {
        reply.emailTemplatesPagination.totalRecords = data.totalRecords;
        reply.emailTemplatesPagination = this.pagerService.getPagedItems(reply.emailTemplatesPagination, data.emailTemplates);
        this.filterReplyrEmailTemplateForEditCampaign(reply);
        this.filterEmailTemplateForEditCampaign();
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
      },
      (error: string) => {
        this.logger.errorPage(error);
      },
      () => this.logger.info("Finished loadEmailTemplatesForAddReply()", reply.emailTemplatesPagination)
      )
    }
  }

  filterEmailTemplateForEditCampaign(){
      this.filteredEmailTemplateIds = this.emailTemplatesPagination.pagedItems.map(function(a) {return a.id;});
      if(this.filteredEmailTemplateIds.indexOf(this.emailTemplateId)>-1){
          this.showSelectedEmailTemplate=true;
      }else{
          this.showSelectedEmailTemplate=false;
      }
  }

  filterReplyrEmailTemplateForEditCampaign(reply: Reply) {
    if (reply.emailTemplatesPagination.emailTemplateType == 0 && reply.emailTemplatesPagination.searchKey == null) {
      if (reply.emailTemplatesPagination.pageIndex == 1) {
        reply.showSelectedEmailTemplate = true;
      } else {
        reply.showSelectedEmailTemplate = false;
      }
    } else {
      const emailTemplateIds = reply.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
      if (emailTemplateIds.indexOf(reply.selectedEmailTemplateIdForEdit) > -1) {
        reply.showSelectedEmailTemplate = true;
      } else {
        reply.showSelectedEmailTemplate = false;
      }
    }
  }

  remove(divId: string, type: string) {
    if (type === "replies") {
      this.eventCampaign.campaignReplies = this.spliceArray(this.eventCampaign.campaignReplies, divId);
      console.log(this.eventCampaign.campaignReplies);
    }
    $('#' + divId).remove();
    const index = divId.split('-')[1];
    const editorName = 'editor' + index;
    this.errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
    if (this.errorLength === 0) { this.dataError = false; }
  }

  spliceArray(arr: any, id: string) {
    arr = $.grep(arr, function (data, index) {
      return data.divId !== id
    });
    return arr;
  }

  setReplyEmailTemplate(emailTemplateId: number, reply: Reply, index: number, isDraft: boolean) {
    if (!isDraft) {
      reply.selectedEmailTemplateId = emailTemplateId;
      // reply.emailTemplate.id = emailTemplateId;
      // this.eventCampaign.campaignReplies[index].selectedEmailTemplateId = emailTemplateId;
      // this.eventCampaign.campaignReplies[index].emailTemplate =  new EmailTemplate();
      // this.eventCampaign.campaignReplies[index].emailTemplate['id'] = emailTemplateId;
      $('#reply-' + index + emailTemplateId).prop("checked", true);
    }
  }
  selectReplyEmailBody(event: any, index: number, reply: Reply) {
    reply.defaultTemplate = event;
  }

  getEmailTemplatePreview(emailTemplate: EmailTemplate) {
    let body = emailTemplate.body;
    let emailTemplateName = emailTemplate.name;
    if (emailTemplateName.length > 50) {
      emailTemplateName = emailTemplateName.substring(0, 50) + "...";
    }
    $("#htmlContent").empty();
    $("#email-template-title").empty();
    $("#email-template-title").append(emailTemplateName);
    $('#email-template-title').prop('title', emailTemplate.name);
    let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">", "<div id=\"video-tag\" style=\"display:none\">");
    $("#htmlContent").append(updatedBody);
    $('.modal .modal-body').css('overflow-y', 'auto');
    $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
    $("#show_email_template_preivew").modal('show');
  }

  previewEventCampaignEmailTemplate(emailTemplateId: number) {
    //this.eventCampaign.campaignEventMedias[0].filePath = this.eventCampaign.campaignEventMedias[0].filePath===undefined?null:this.eventCampaign.campaignEventMedias[0].filePath;
      this.emailTemplateService.getById(emailTemplateId)
          .subscribe(
      (data: any) => {

          let dateFormat = require('dateformat');
          if ( this.eventCampaign.campaign ) {
              data.body = data.body.replace( "{{event_title}}", this.eventCampaign.campaign );
          }
          if ( this.eventCampaign.campaignEventTimes[0].startTimeString ) {
             /* let startTime = new Date(this.eventCampaign.campaignEventTimes[0].startTimeString);
              let srtTime = this.referenceService.formatAMPM(startTime);
              let date1 = startTime.toDateString()*/

              let date1 = new Date(this.eventCampaign.campaignEventTimes[0].startTimeString);
              date1 = dateFormat(date1, "dddd, mmmm dS, yyyy, h:MM TT");


              if(!this.eventCampaign.campaignEventTimes[0].allDay){
              data.body = data.body.replace( "{{event_start_time}}", date1 );
              data.body = data.body.replace( "&lt;To&gt;", 'To' );
              data.body = data.body.replace( "{{To}}", 'To' );
              }else{
                  data.body = data.body.replace( "{{event_start_time}}", date1 + " " + '(All Day)' );
                  data.body = data.body.replace( "{{event_end_time}}", " " );
              }
          }

          if ( this.eventCampaign.campaignEventTimes[0].endTimeString ) {
//              let endDate = new Date(this.eventCampaign.campaignEventTimes[0].endTimeString);
//              let endTime = this.referenceService.formatAMPM(endDate);
//              let date2 = endDate.toDateString()

              let date2 = new Date(this.eventCampaign.campaignEventTimes[0].endTimeString);
              date2 = dateFormat(date2, "dddd, mmmm dS, yyyy, h:MM TT");

              data.body = data.body.replace( "{{event_end_time}}", date2  );
          }
          else if(this.eventCampaign.campaignEventTimes[0].allDay){
              data.body = data.body.replace( "&lt;To&gt;", ' ' );
              data.body = data.body.replace( "{{To}}", ' ' );
          }

          if ( this.eventCampaign.message ) {
              data.body = data.body.replace( "{{event_description}}", this.eventCampaign.message );
          }
          if ( !this.eventCampaign.onlineMeeting ) {
              if ( this.eventCampaign.campaignLocation.location && this.eventCampaign.campaignLocation.street ) {
                  data.body = data.body.replace( /{{address}}/g, this.eventCampaign.campaignLocation.location + "<br/>" +  this.eventCampaign.campaignLocation.street + ", " + this.eventCampaign.campaignLocation.city + "<br/>" + this.eventCampaign.campaignLocation.state + ", " + this.eventCampaign.campaignLocation.zip);
                 /* data.body = data.body.replace( /{{addreess_lane2}}/g, this.eventCampaign.campaignLocation.city + "," + this.eventCampaign.campaignLocation.state + "," + this.eventCampaign.campaignLocation.zip );*/
              }
          } else {
              data.body = data.body.replace( /{{address}}/g, "Online Meeting" )
              data.body = data.body.replace( /{{address}}/g, " " )
          }
          if ( this.eventCampaign.fromName ) {
              data.body = data.body.replace( "{{event_fromName}}", this.eventCampaign.fromName );
          }
          if ( this.eventCampaign.email ) {
              data.body = data.body.replace( "{{event_emailId}}", this.eventCampaign.email );
          }


          if(!this.reDistributeEvent && !this.isPreviewEvent){
          if ( this.eventCampaign.email ) {
              data.body = data.body.replace( "{{vendor_name}}", this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName );
          }
          if ( this.eventCampaign.email ) {
              data.body = data.body.replace( "VENDOR_TITLE", this.authenticationService.user.jobTitle );
          }
          if ( this.eventCampaign.email ) {
              data.body = data.body.replace( "{{vendor_emailId}}", this.authenticationService.user.emailId );
          }
          }else{
              data.body = data.body.replace( "{{vendor_name}}", this.eventCampaign.userDTO.firstName + " " + this.eventCampaign.userDTO.lastName);
              data.body = data.body.replace( "{{vendor_emailId}}", this.eventCampaign.userDTO.emailId );

          }



          if ( this.eventCampaign.campaignEventMedias[0].filePath ) {
              data.body = data.body.replace( "https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png", this.eventCampaign.campaignEventMedias[0].filePath );
          }else{
              data.body = data.body.replace( "https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png", "https://xamplify.s3.amazonaws.com/images/bee-259/rocket-color.png" );
          }

          if ( this.eventCampaign.campaignLocation.location ) {
              data.body = data.body.replace( "LOCATION_MAP_URL", "https://maps.google.com/maps?q=" + this.eventCampaign.campaignLocation.location + "," + this.eventCampaign.campaignLocation.street + ","+this.eventCampaign.campaignLocation.city + ","+this.eventCampaign.campaignLocation.state + ","+this.eventCampaign.campaignLocation.zip + "&z=15&output=embed" );
          }else{
              data.body = data.body.replace( "LOCATION_MAP_URL", "https://maps.google.com/maps?q=42840 Christy Street, uite 100 Fremont, US CA 94538&z=15&output=embed" );
          }

          if ( this.eventCampaign.email ) {
              data.body = data.body.replace( "https://aravindu.com/vod/images/us_location.png", " " );
          }

          this.getEmailTemplatePreview( data );
      },
      (error: string) => {
        this.logger.errorPage(error);
      },
      () => this.logger.info("Finished previewEventCampaignEmailTemplate()", emailTemplateId)
      )

  }
  onChangeCountryCampaignEventTime(countryId: number) {
    this.timezonesCampaignEventTime = this.referenceService.getTimeZonesByCountryId(countryId);
    for ( let i = 0; i < this.countries.length; i++ ) {
      if ( countryId == this.countries[i].id ) { this.eventCampaign.campaignLocation.country = this.countries[i].name; break; }
    }
   setTimeout(() => {this.setEventTimeZone(); }, 100);
   this.resetTabClass();
  }
  onChangeCountry(countryId: number) {
    this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
  }
  getCampaignReplies(campaign: EventCampaign) {
    if(campaign.campaignReplies!=undefined){
        this.eventCampaign.campaignReplies = campaign.campaignReplies;
        for(var i=0;i< this.eventCampaign.campaignReplies.length;i++){
            let reply = this.eventCampaign.campaignReplies[i];
            if(reply.defaultTemplate){
                reply.selectedEmailTemplateIdForEdit = reply.selectedEmailTemplateId;
            }
            reply.emailTemplatesPagination = new Pagination();
            reply.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(reply.replyTimeInHoursAndMinutes);
            if($.trim(reply.subject).length==0){
             //   reply.subject = campaign.subjectLine;
            }
            let length = this.allItems.length;
            length = length+1;
            var id = 'reply-'+length;
            reply.divId = id;
            this.allItems.push(id);
            this.loadEmailTemplatesForAddReply(reply);
        }
    }

 }

  getRepliesData(){
    for(let i=0;i< this.eventCampaign.campaignReplies.length;i++){
        const reply = this.eventCampaign.campaignReplies[i];
        $('#'+reply.divId).removeClass('portlet light dashboard-stat2 border-error');
        this.removeStyleAttrByDivId('reply-days-'+reply.divId);
        this.removeStyleAttrByDivId('send-time-'+reply.divId);
        this.removeStyleAttrByDivId('message-'+reply.divId);
        this.removeStyleAttrByDivId('reply-subject-'+reply.divId);
        this.removeStyleAttrByDivId('email-template-'+reply.divId);
        this.removeStyleAttrByDivId('reply-message-'+reply.divId);
        $('#'+reply.divId).addClass('portlet light dashboard-stat2');
        this.validateReplySubject(reply);
        if(reply.actionId!==16 && reply.actionId!==17 && reply.actionId!==18){
            this.validateReplyInDays(reply);
            if(reply.actionId!==22 && reply.actionId!==23){
                this.validateReplyTime(reply);
            }
            this.validateEmailTemplateForAddReply(reply);
        }else{
            this.validateEmailTemplateForAddReply(reply);
        }
        this.errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if(this.errorLength==0){
            this.addEmailNotOpenedReplyDaysSum(reply, i);
            this.addEmailOpenedReplyDaysSum(reply, i);
        }
        }
    }

    addEmailNotOpenedReplyDaysSum(reply:Reply,index:number){
      if(reply.actionId===0){
          if(index===0){
              this.emailNotOpenedReplyDaysSum = reply.replyInDays;
          }else{
              this.emailNotOpenedReplyDaysSum = reply.replyInDays+this.emailNotOpenedReplyDaysSum;
          }
          reply.replyInDaysSum = this.emailNotOpenedReplyDaysSum;
      }
     }
      addEmailOpenedReplyDaysSum(reply:Reply,index:number){
      if(reply.actionId===13){
          if(index===0){
              this.emailOpenedReplyDaysSum = reply.replyInDays;
          }else{
              this.emailOpenedReplyDaysSum = reply.replyInDays+this.emailOpenedReplyDaysSum;
          }
          reply.replyInDaysSum = this.emailOpenedReplyDaysSum;
          }
      }
       validateReplyInDays(reply:Reply){
          if( reply.actionId!== 22 &&  reply.actionId!== 23 && reply.replyInDays==null){
                this.addReplyDaysErrorDiv(reply);
            }else if(reply.actionId===22 ||reply.actionId===23 ){
                if(reply.replyInDays==null || reply.replyInDays===0){ this.addReplyDaysErrorDiv(reply);}
          }
        }

          addReplyDaysErrorDiv(reply:Reply){
              this.addReplyDivError(reply.divId);
              $('#reply-days-'+reply.divId).css('color','red');
          }

          validateReplyTime(reply:Reply){
              if(reply.replyTime==undefined || reply.replyTime==null){
                  this.addReplyDivError(reply.divId);
                  $('#send-time-'+reply.divId).css('color','red');
              }else{
                  reply.replyTime = this.campaignService.setAutoReplyDefaultTime(this.eventCampaign.campaignScheduleType, reply.replyInDays,reply.replyTime,this.eventCampaign.launchTimeInString);
                  reply.replyTimeInHoursAndMinutes = this.extractTimeFromDate(reply.replyTime);
              }
          }
          extractTimeFromDate(replyTime){
                //let dt = new Date(replyTime);
                let dt = replyTime;
                let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
                let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
                return hours+":"+minutes;
            }
          validateReplySubject(reply:Reply){
              if( reply.subject==null||reply.subject==undefined || $.trim(reply.subject).length==0){
                  this.addReplyDivError(reply.divId);
                  console.log("Added Reply Subject Eror");
                  $('#reply-subject-'+reply.divId).css('color','red');
              }
          }

          validateEmailTemplateForAddReply(reply:Reply){
              if(reply.defaultTemplate && reply.selectedEmailTemplateId==0){
                  $('#'+reply.divId).addClass('portlet light dashboard-stat2 border-error');
                  $('#email-template-'+reply.divId).css('color','red');
              }else if(!reply.defaultTemplate &&(reply.body==null || reply.body==undefined || $.trim(reply.body).length==0)){
                  $('#'+reply.divId).addClass('portlet light dashboard-stat2 border-error');
                  $('#reply-message-'+reply.divId).css('color','red');
              }
          }

        addReplyDivError(divId:string){
            $('#'+divId).addClass('portlet light dashboard-stat2 border-error');
        }
        removeStyleAttrByDivId(divId:string){
            $('#'+divId).removeAttr("style");
        }
        getTodayTime(){
          /*let newDate:any = new Date().toLocaleString();
          newDate = newDate.substring(0,newDate.length-6);
          newDate = newDate.replace(',','');
          return newDate;*/

            var dt = new Date();
            var d = dt.toLocaleDateString();
            var t = dt.toLocaleTimeString();
            t = t.replace(/\u200E/g, '');
            t = t.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
            var result = d + ' ' + t;
            return result;
        }
        saveCampaignOnDestroy(){
          const eventCampaign = this.getCampaignData(this.eventCampaign);
          if((this.isEditCampaign || this.reDistributeEventManage)&& !eventCampaign.onlineMeeting  && !eventCampaign.campaignLocation.id) {  }
          else {  eventCampaign.campaignLocation.id = null;}
          eventCampaign.campaignEventTimes[0].id = null;
          eventCampaign.campaignEventMedias[0].id = null;
          eventCampaign.userListIds = this.parternUserListIds;
          for (let userListId of eventCampaign.userListIds) {
            let contactList = new ContactList(userListId);
            eventCampaign.userLists.push(contactList);
          }
          eventCampaign.user.id = null;
          for(let i=0; i< eventCampaign.campaignReplies.length;i++){
            eventCampaign.campaignReplies[i].id = null;
          }

          if(this.reDistributeEvent || this.reDistributeEventManage) {
            if(this.reDistributeEvent){
            eventCampaign.parentCampaignId = this.activatedRoute.snapshot.params['id'];
            eventCampaign.id = null; }
            if(this.reDistributeEventManage){
                eventCampaign.parentCampaignId = this.parentCampaignIdValue;
             }
            //eventCampaign.enableCoBrandingLogo = this.eventCampaign.enableCoBrandingLogo;
            eventCampaign.nurtureCampaign = true;
            eventCampaign.selectedEditEmailTemplate = eventCampaign.emailTemplate.id;
            eventCampaign.channelCampaign = false;
            eventCampaign.toPartner = false;
          }
          if(!eventCampaign.campaignEventTimes[0].startTimeString) {  eventCampaign.campaignEventTimes[0].startTimeString = this.getTodayTime();}
          if(!eventCampaign.campaignEventTimes[0].endTimeString && !this.eventCampaign.campaignEventTimes[0].allDay){ eventCampaign.campaignEventTimes[0].endTimeString = this.getTodayTime(); }
          if( this.eventCampaign.campaignEventTimes[0].countryId===undefined) { this.eventCampaign.campaignEventTimes[0].countryId=0; }
          const errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
          delete eventCampaign.emailTemplateDTO;
          delete eventCampaign.userDTO
          delete eventCampaign.userListDTOs
          if(errorLength===0){
              this.dataError = false;
              this.campaignService.createEventCampaign(eventCampaign)
              .subscribe(
                response => {
                  console.log(response);
                  if(response.statusCode === 2000){
                      this.isLaunched = true;
                      this.reInitialize();
                      if("/home/campaigns/manage"===this.router.url){
                        this.router.navigate(["/home/campaigns/manage"]);
                      }
                  }
              },
              error => {
                  this.hasInternalError = true;
                  this.logger.error("error in saveCampaignOnDestroy()", error);
              },
              () => this.logger.info("Finished saveCampaignOnDestroy()")
          );
          }
      return false;
      }

     emailTemplateSelection(emailTemplate){
            this.eventCampaign.emailTemplate = emailTemplate;
            this.resetTabClass();
        }
    reInitialize(){
      this.referenceService.selectedCampaignType = "";
      this.eventCampaign.userListIds = [];
      this.campaignService.campaign = undefined;
    }


    resetTabs(currentTab : string){
        this.currentTab = currentTab;
        if( currentTab == 'details' ){
            this.detailsTab = true;
            this.recipientsTab = false;
            this.emailTemplatesTab = false;
            this.launchTab = false;
        } else if( currentTab == 'recipients' ){
            this.detailsTab = false;
            this.recipientsTab = true;
            this.emailTemplatesTab = false;
            this.launchTab = false;
            this.setEventTimeZone();
        }else if( currentTab == 'templates' ){
            this.detailsTab = false;
            this.recipientsTab = false;
            this.emailTemplatesTab = true;
            this.launchTab = false;
        }else if( currentTab == 'launch' ){
            this.detailsTab = false;
            this.recipientsTab = false;
            this.emailTemplatesTab = false;
            this.launchTab = true;
            this.setUserLists();
           // this.addUserEmailIds();
            }

    }
    setUserLists(){
      this.selectedListOfUserLists = [];
      this.parternUserListIds = this.referenceService.removeDuplicates( this.parternUserListIds);
      this.eventCampaign.userListIds = this.parternUserListIds;
      for(let i=0; i< this.contactListsPagination.pagedItems.length; i++ ) {
        if(this.eventCampaign.userListIds[0] === this.contactListsPagination.pagedItems[i].id){
          const list = {'id': this.eventCampaign.userListIds[0],
            'name': this.contactListsPagination.pagedItems[i].name
          }
          this.selectedListOfUserLists.push(list);
        }
      }
      console.log(this.selectedListOfUserLists);
    }
    addUserEmailIds(){
      let self = this;
      self.selectedListOfUserLists = [];
      $('[name="campaignContact[]"]:checked').each(function(index){
          var id = $(this).val();
          var name = $(this)[0].lang;
          var  contactList = {'id':id,'name':name};
          if(self.selectedListOfUserLists.length<=1){
              self.selectedListOfUserLists.push(contactList);
          }
       });
  }
    setEventTimeZone(){
      try{
       this.timeZoneSetValue = '';
       let e:any = document.getElementById("timezoneIdChange");
       //let timeZoneId = $('#timezoneIdCampaignEventTime option:selected').val();
       var value = e.options[e.selectedIndex].value;
       var text = e.options[e.selectedIndex].text;
       console.log(value+'::::'+text);
       this.timeZoneSetValue = text;
       console.log(this.timezonesCampaignEventTime);
       for(let i=0; i< this.timezonesCampaignEventTime.length; i++){
        if(this.timezonesCampaignEventTime[i].cityName === text) {
        this.timeZoneSetValue = this.timezonesCampaignEventTime[i].timezoneId;
        break;
      }
      }
      this.eventCampaign.campaignEventTimes[0].timeZone = this.timeZoneSetValue;
      return this.timeZoneSetValue;
      }catch(error) { console.log(error);}
    }
    onlineMeetingSwitchStatusChange(){
        this.eventCampaign.onlineMeeting = !this.eventCampaign.onlineMeeting;
        this.resetTabClass();
    }

    resetTabClass(){
        if((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError)) ) && (this.userListIds.length === 0 && this.parternUserListIds.length === 0)){
            this.recipientsTabClass = "enableRecipientsTab";
        } else if((this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError)) ) && (this.userListIds.length !=0 || this.parternUserListIds.length !=0) ){
            this.recipientsTabClass = "recipientsTabComplate";
        } else{
            this.recipientsTabClass = "disableRecipientsTab";
        }

        if( (this.eventCampaign.campaign && !this.eventError.eventTitleError &&  this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError)) ) && (this.userListIds.length !=0 || this.parternUserListIds.length !=0) && !this.eventCampaign.emailTemplate.id ){
            this.emailTemplatesTabClass = "enableEmailTemplate";
        }else if( (this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError))) &&(this.userListIds.length !=0 || this.parternUserListIds.length !=0) && this.eventCampaign.emailTemplate.id){
            this.emailTemplatesTabClass = "emailTemplateTabComplete";
        }else{
            this.emailTemplatesTabClass = "disableTemplateTab";
        }

        if( (this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError)) ) && (this.userListIds.length !=0 || this.parternUserListIds.length !=0) && this.eventCampaign.emailTemplate.id && !this.checkLaunchOption){
            this.launchTabClass = "enableLaunchTab";
        }else if( (this.eventCampaign.campaign && !this.eventError.eventTitleError && this.isValidCampaignName && this.eventCampaign.fromName && !this.eventError.eventSubjectLineError && this.eventCampaign.subjectLine && !this.eventError.eventHostByError && this.eventCampaign.campaignEventTimes[0].startTimeString && (this.eventCampaign.campaignEventTimes[0].endTimeString || this.eventCampaign.campaignEventTimes[0].allDay) && !this.eventError.eventSameDateError && this.datePassedError == '' && this.eventCampaign.campaignEventTimes[0].countryId && (this.eventCampaign.onlineMeeting || (this.eventCampaign.campaignLocation.location && !this.eventError.eventLocationError)) ) && (this.userListIds.length !=0 || this.parternUserListIds.length !=0) && this.eventCampaign.emailTemplate.id && this.checkLaunchOption){
            this.launchTabClass = "emailLauchTabComplete";
        }else{
            this.launchTabClass = "disableLaunchTab";
        }

        this.resetTabs(this.currentTab);

        if(this.isPreviewEvent){
            this.setUserLists();
            this.detailsTab = true;
            this.recipientsTab = false;
            this.emailTemplatesTab = false;
            this.launchTab = true;
        }

        if(this.reDistributeEvent || this.reDistributeEventManage){
            this.setUserLists();
            this.detailsTab = true;
            this.recipientsTab = true;
            this.emailTemplatesTab = false;
            this.launchTab = true;
        }

    }

   ngOnDestroy() {
    this.campaignService.eventCampaign = undefined;
    CKEDITOR.config.readOnly = false;
    if(!this.hasInternalError && this.router.url!=="/" && !this.isPreviewEvent && !this.reDistributeEvent && !this.reDistributeEventManage){
     if(!this.isReloaded){
      if(!this.isLaunched){
          if(this.isAdd){
              this.saveCampaignOnDestroy();
          }else{
              let self = this;
              swal( {
                  title: 'Are you sure?',
                  text: "You have unchanged Campaign data",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#54a7e9',
                  cancelButtonColor: '#999',
                  confirmButtonText: 'Yes, Save it!',
                  cancelButtonText: 'No'

              }).then(function() {
                      self.saveCampaignOnDestroy();
              },function (dismiss) {
                if (dismiss === 'No') {
                    self.reInitialize();
                }
            })
          }
         }
        }
     }
    $('#contactsModal').modal('hide');
    $('#show_email_template_preivew').modal('hide');
 }

}

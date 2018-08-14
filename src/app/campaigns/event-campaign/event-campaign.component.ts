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
import { CampaignEventTime } from '../models/campaign-event-time';
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


declare var $, flatpickr, CKEDITOR;

@Component({
  selector: 'app-event-campaign',
  templateUrl: './event-campaign.component.html',
  styleUrls: ['./event-campaign.component.css'],
  providers: [PagerService, Pagination, CallActionSwitch, Properties,EventError]
})
export class EventCampaignComponent implements OnInit, OnDestroy,AfterViewInit {
  emailTemplates: Array<EmailTemplate> = [];
  campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
  reply: Reply = new Reply();
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
  isPartnerUserList = false;
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

  constructor(public callActionSwitch: CallActionSwitch, public referenceService: ReferenceService,
    private contactService: ContactService,
    public campaignService: CampaignService,
    public authenticationService: AuthenticationService,
    public emailTemplateService: EmailTemplateService,
    private pagerService: PagerService,
    private logger: XtremandLogger,
    private router: Router, public activatedRoute:ActivatedRoute,
    public properties: Properties, public eventError:EventError) {
    this.countries = this.referenceService.getCountries();
    this.listEmailTemplates();
    CKEDITOR.config.height = '100';
    this.isPreviewEvent = this.router.url.includes('/home/campaigns/event-preview')? true: false;
     if(this.isPreviewEvent){
       CKEDITOR.config.readOnly = true;
      } else {
        CKEDITOR.config.readOnly = false;
      }
  }
  toggleRsvp(){
    this.eventCampaign.rsvpReceived = !this.eventCampaign.rsvpReceived;
  }
  toggleEmailOpened(){
    this.eventCampaign.emailOpened = !this.eventCampaign.emailOpened;
  }
  toggleInviteOthers(){
    this.eventCampaign.inviteOthers = !this.eventCampaign.inviteOthers;
  }
  ngOnInit() {
    if (this.referenceService.selectedCampaignType!=='eventCampaign' && this.router.url.includes('/home/campaigns/event') && !this.activatedRoute.snapshot.params['id']) {
      console.log( "This page is reloaded" );
      this.router.navigate(['/home/campaigns/select']);

    }
    else if(this.activatedRoute.snapshot.params['id']){
      this.eventRouterPage =true;
      const alias = this.activatedRoute.snapshot.params['id'];
      this.campaignService.getEventCampaignById(alias).subscribe(
        (result)=>{
        this.campaignService.eventCampaign = result.data;
        this.eventCampaign = result.data;
        console.log( this.eventCampaign);
        this.eventCampaign.emailTemplate = result.data.emailTemplateDTO;
        this.eventCampaign.user = result.data.userDTO;
        if(result.data.campaignReplies===undefined){ this.eventCampaign.campaignReplies = [];}
        else {this.getCampaignReplies(this.eventCampaign); }
        // this.eventCampaign.userListIds = this.campaignService.eventCampaign.userListDTOs;
        this.eventCampaign.campaignEventTimes = result.data.campaignEventTimes;
        for(let i=0; i<this.countries.length;i++){
          if(this.countries[i].name=== result.data.campaignEventTimes[0].country){
            this.eventCampaign.countryId = this.countries[i].id;
            this.eventCampaign.campaignEventTimes[0].countryId = this.countries[i].id;
            break;
          }
        }
        this.onChangeCountryCampaignEventTime(this.eventCampaign.campaignEventTimes[0].countryId)
        for(let i=0; i< result.data.userListDTOs.length;i++){
         this.userListIds.push(result.data.userListDTOs[i].id);
        }
        this.eventCampaign.userListIds = this.userListIds;
        this.eventCampaign.userLists = [];
        console.log(this.userListIds);
      });
    }
    else{
    this.eventCampaign.emailTemplate = this.emailTemplates[0];
    this.eventCampaign.countryId = this.countries[0].id;
    this.eventCampaign.campaignEventTimes[0].countryId = this.countries[0].id;
    }
    this.loggedInUserId = this.authenticationService.getUserId();

    this.loadContactLists(this.contactListsPagination);
    flatpickr('.flatpickr', {
      enableTime: true,
      dateFormat: 'm/d/Y H:i',
      time_24hr: false,
      minDate: new Date(),
    });
    this.ckeConfig = {
      allowedContent: true,
    };
  }
  ngAfterViewInit() {
    this.listAllTeamMemberEmailIds();
  }
  eventTitleError(){
    this.eventError.eventTitleError = this.eventCampaign.campaign ? false: true;
  }
  eventHostByError(){
    this.eventError.eventHostByError = this.eventCampaign.fromName? false:true;
  }
  eventStartTimeError(){
    this.eventError.eventStartTimeError= this.eventCampaign.campaignEventTimes[0].startTimeString ?false:true ;
    // this.eventSameDateError();
  }
  eventCountryError(){
    this.eventError.eventCountryAndTimeZone = this.eventCampaign.campaignEventTimes[0].countryId ? false: true;
  }
  eventLocationError(){
    if(!this.eventCampaign.onlineMeeting){
    this.eventError.eventLocationError = this.eventCampaign.campaignLocation.location? false: true;
    } else { this.eventError.eventLocationError = false;}
  }
  eventDescriptionError(){
    this.eventError.eventDescription = this.eventCampaign.message ? false: true;
  }
  eventContactListError(){
    this.eventError.eventContactError = this.eventCampaign.userListIds.length>0 ? false: true;
  }
  eventEndTimeError(){
  if(!this.eventCampaign.campaignEventTimes[0].allDay){
    this.eventError.eventEndDateError = this.eventCampaign.campaignEventTimes[0].endTimeString ? false: true;
   } else {
    this.eventError.eventEndDateError = false;
   }
   this.eventSameDateError();
  }
  eventSameDateError(){
    if(this.eventCampaign.campaignEventTimes[0].endTimeString && !this.eventCampaign.campaignEventTimes[0].allDay && this.eventCampaign.campaignEventTimes[0].endTimeString===this.eventCampaign.campaignEventTimes[0].startTimeString){
    //  this.eventError.eventEndDateError = true;
    //  this.eventError.eventStartTimeError = true;
     this.eventError.eventSameDateError = true;
    } else {
      // this.eventError.eventEndDateError = false;
      // this.eventError.eventStartTimeError = false;
      this.eventError.eventSameDateError = false;
     // if(this.eventCampaign.campaignEventTimes[0].allDay){this.eventCampaign.campaignEventTimes[0].endTimeString = undefined;}

    }

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

  loadContactLists(contactListsPagination: Pagination) {
    this.paginationType = 'contactlists';
    this.contactListsPagination.filterKey = 'isPartnerUserList';
    this.contactListsPagination.filterValue = this.isPartnerUserList;
    this.contactService.loadContactLists(contactListsPagination)
      .subscribe(
      (data: any) => {
        contactListsPagination.totalRecords = data.totalRecords;
        contactListsPagination = this.pagerService.getPagedItems(contactListsPagination, data.listOfUserLists);
      },
      (error: any) => {
        this.logger.error(error);
      },
      () => this.logger.info('MangeContactsComponent loadContactLists() finished')
      );
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

  setPage(event: any) {
    if (event.type === 'contacts') {
      this.contactsPagination.pageIndex = event.page;
      this.loadContacts(this.previewContactList, this.contactsPagination);
    }
    else if (event.type === 'contactlists') {
      this.contactListsPagination.pageIndex = event.page;
      this.loadContactLists(this.contactListsPagination);
    }
  }
  paginationDropDown(pagination: Pagination) {
    if (this.paginationType === 'contacts') { this.loadContacts(this.previewContactList, pagination); }
    else if (this.paginationType === 'contactlists') { this.loadContactLists(pagination); }
  }
  toggleContactLists() {
    this.userListIds = this.eventCampaign.userListIds = [];
    this.eventError.eventContactError = true;
    this.isPartnerUserList = !this.isPartnerUserList;
    this.contactListsPagination.pageIndex = 1;
    this.loadContactLists(this.contactListsPagination);
  }

  highlightRow(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    if (isChecked) {
      if (!this.eventCampaign.userListIds.includes(contactListId)) {
        this.eventCampaign.userListIds.push(contactListId);
        this.eventError.eventContactError = false;
      }
      $('#' + contactListId).parent().closest('tr').addClass('highlight');
    } else {
      this.eventCampaign.userListIds.splice($.inArray(contactListId, this.eventCampaign.userListIds), 1);
      $('#' + contactListId).parent().closest('tr').removeClass('highlight');
      if(this.eventCampaign.userListIds.length===0){  this.eventError.eventContactError = true;}
    }
  }
  closeModal() {
    this.paginationType = 'contactlists';
    this.contactsPagination = new Pagination();
  }

  validForm(eventCampaign:any){
   if(!this.eventError.eventSameDateError && !this.eventError.eventEndDateError && !this.eventError.eventTitleError && !this.eventError.eventDateError && !this.eventError.eventHostByError
    && !this.eventError.eventLocationError && !this.eventError.eventDescription &&
    eventCampaign.message && eventCampaign.campaign && eventCampaign.campaignEventTimes[0].startTimeString &&
    eventCampaign.campaignEventTimes[0].country!="Select Country" && this.errorLength===0 &&
    this.isFormSubmitted && eventCampaign.userListIds.length>0){ return true;}
   else { return false;}
  }

  setScheduleEvent(){
    this.isSelectedSchedule = !this.isSelectedSchedule;
    if(this.isSelectedSchedule) { this.selectedLaunchOption = 'SCHEDULE';
    this.timezones = this.referenceService.getTimeZonesByCountryId(this.eventCampaign.countryId);
    }
  }
  scheduleCampaign(){
    this.referenceService.campaignSuccessMessage = "SCHEDULE";
    this.createEventCampaign(this.eventCampaign,'SCHEDULE');
  }

  createEventCampaign(eventCampaign: any, launchOption: string) {
    this.isFormSubmitted = true;
    this.onBlurValidation();
    if(this.eventCampaign.campaignReplies && this.eventCampaign.campaignReplies.length>0){ this.getRepliesData(); }
    this.referenceService.goToTop();
    for (let userListId of eventCampaign.userListIds) {
      let contactList = new ContactList(userListId);
      eventCampaign.userLists.push(contactList);
    }
    eventCampaign.campaignReplies.forEach((item, index) => {
      console.log(item); // 9, 2, 5
      console.log(index); // 0, 1, 2
    });
     eventCampaign.user.userId = this.loggedInUserId;
     eventCampaign.campaignScheduleType = launchOption;
    console.log(eventCampaign);
    if (eventCampaign.campaignScheduleType == "NOW" || eventCampaign.campaignScheduleType == "SAVE") {
      eventCampaign.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      eventCampaign.launchTimeInString = this.campaignService.setLaunchTime();
    } else {
      eventCampaign.timeZone = $('#timezoneId option:selected').val();
    }

    eventCampaign.campaignEventTimes[0].timeZone = $('#timezoneIdCampaignEventTime option:selected').val();
    eventCampaign.campaignEventTimes[0].country = this.countries.find(x => x.id == eventCampaign.campaignEventTimes[0].countryId).name;

    if(eventCampaign.id){
     const customEventCampaign = {
       'id':eventCampaign.id,
       'campaign': this.eventCampaign.campaign,
       'user':eventCampaign.user,
       'message':eventCampaign.message,
       'channelCampaign':eventCampaign.channelCampaign,
       'countryId': eventCampaign.countryId,
       'email':eventCampaign.email,
       'emailOpened':eventCampaign.emailOpened,
       'socialSharingIcons':eventCampaign.socialSharingIcons,
       'fromName': eventCampaign.fromName,
       'launchTimeInString':eventCampaign.launchTimeInString,
       'emailTemplate':eventCampaign.emailTemplate,
       'timeZone': eventCampaign.timeZone,
       'campaignScheduleType': eventCampaign.campaignScheduleType,
       'campaignLocation': eventCampaign.campaignLocation,
       'campaignEventMedias': [{"filePath": eventCampaign.campaignEventMedias[0].filePath}],
       'campaignEventTimes': eventCampaign.campaignEventTimes,
       'country': eventCampaign.campaignEventTimes[0].country,
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
    eventCampaign.campaignLocation.id = null;
    eventCampaign.campaignEventTimes[0].id = null;
    eventCampaign.campaignEventMedias[0].id = null;
    eventCampaign.user.id = null;

    if(this.validForm(eventCampaign) && this.isFormSubmitted){
      // alert('success');
      this.campaignService.createEventCampaign(eventCampaign)
      .subscribe(
      response => {
        if (response.statusCode === 2000) {
          this.router.navigate(["/home/campaigns/manage"]);
          this.referenceService.campaignSuccessMessage = launchOption;
        } else {
          if (response.statusCode === 2016) {
            this.customResponse = new CustomResponse( 'ERROR', response.errorResponses[0].message, true );
          }
          else if(response.statusCode === 7000){
            if(response.errorResponses[0].field =='campaign' && response.errorResponses[0].message=='Already Exists'){
              this.customResponse = new CustomResponse( 'ERROR', 'Campaign name is already exists.', true );
            }
            else if(response.errorResponses[0].field =='eventEndTimeString'){
              this.customResponse = new CustomResponse( 'ERROR', response.errorResponses[0].message, true );

            }
            else if(response.errorResponses[0].field ="eventStartTimeString"){
              this.customResponse = new CustomResponse( 'ERROR', 'Please change the start time, its already over.', true );
              // this.eventError.eventDateError = true;
            }
            else {
              this.customResponse = new CustomResponse( 'ERROR', response.errorResponses[0].message, true );
            }
          }
        }
      },
      error => console.log(error),
      () => console.log("Campaign Names Loaded")
      );
    } else {
      this.showErrorMessage = true;
      if(eventCampaign.campaignEventTimes[0].country=="Select Country"){
       // this.customResponse = new CustomResponse( 'ERROR', 'Please select the valid country', true );
      } else {
      this.customResponse = new CustomResponse( 'ERROR', 'Please complete the * required fields', true );
      }
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
      () => console.log("Campaign Names Loaded")
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

  addReplyRows() {
    this.reply = new Reply();
    let length = this.allItems.length;
    length = length + 1;
    const id = 'reply-' + length;
    this.reply.divId = id;
    this.reply.actionId = 0;
    this.reply.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(this.eventCampaign.campaign);

    this.eventCampaign.campaignReplies.push(this.reply);
    this.allItems.push(id);
    this.loadEmailTemplatesForAddReply(this.reply);
  }

  loadEmailTemplatesForAddReply(reply: Reply) {
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
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
      },
      (error: string) => {
        this.logger.errorPage(error);
      },
      () => this.logger.info("Finished loadEmailTemplatesForAddReply()", reply.emailTemplatesPagination)
      )
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
    this.emailTemplateService.getById(emailTemplateId)
          .subscribe(
      (data: any) => {
        this.getEmailTemplatePreview(data);
      },
      (error: string) => {
        this.logger.errorPage(error);
      },
      () => this.logger.info("Finished previewEventCampaignEmailTemplate()", emailTemplateId)
      )

  }

  listEmailTemplates() {
    const emailTemplate1 = new EmailTemplate(); emailTemplate1.id = 1700; emailTemplate1.name = "event based template 1";
    const emailTemplate2 = new EmailTemplate(); emailTemplate2.id = 1701; emailTemplate2.name = "event based template 2";
    const emailTemplate3 = new EmailTemplate(); emailTemplate3.id = 1702; emailTemplate3.name = "event based template 3";
    this.emailTemplates.push(emailTemplate1);
    this.emailTemplates.push(emailTemplate2);
    this.emailTemplates.push(emailTemplate3);
  }

  onChangeCountryCampaignEventTime(countryId: number) {
    this.timezonesCampaignEventTime = this.referenceService.getTimeZonesByCountryId(countryId);
  }
  onChangeCountry(countryId: number) {
    this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
  }
  getCampaignReplies(campaign: EventCampaign) {
    if(campaign.campaignReplies!=undefined){
        this.eventCampaign.campaignReplies = campaign.campaignReplies;
        for(var i=0;i<this.eventCampaign.campaignReplies.length;i++){
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
    for(let i=0;i<this.eventCampaign.campaignReplies.length;i++){
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

   ngOnDestroy(): void {
      this.campaignService.eventCampaign = undefined;
      CKEDITOR.config.readOnly = false;
   }

}

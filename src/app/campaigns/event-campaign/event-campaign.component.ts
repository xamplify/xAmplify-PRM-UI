import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

declare var $, flatpickr, CKEDITOR;

@Component({
  selector: 'app-event-campaign',
  templateUrl: './event-campaign.component.html',
  styleUrls: ['./event-campaign.component.css'],
  providers: [PagerService, Pagination, CallActionSwitch, Properties,EventError]
})
export class EventCampaignComponent implements OnInit {
  emailTemplates: Array<EmailTemplate> = [];
  campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
  reply: Reply = new Reply();
  countries: Country[];
  timezonesCampaignEventTime: Timezone[];
  timezones: Timezone[];
  allItems = [];
  dataError: boolean = false;

  launchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
  selectedLaunchOption: string;

  loggedInUserId: number;
  isPartnerUserList: boolean = false;
  eventCampaign: EventCampaign = new EventCampaign();
  @ViewChild("myckeditor") ckeditor: any;
  ckeConfig: any;

  previewContactList = new ContactList();
  contactListsPagination: Pagination = new Pagination();
  contactsPagination: Pagination = new Pagination();
  paginationType: string;

  teamMemberEmailIds: any[] = [];
  isFormSubmitted = false;
  emailNotOpenedReplyDaysSum:number = 0;
  emailOpenedReplyDaysSum:number = 0;
  onClickScheduledDaysSum:number = 0;

  constructor(public callActionSwitch: CallActionSwitch, public referenceService: ReferenceService,
    private contactService: ContactService,
    public campaignService: CampaignService,
    public authenticationService: AuthenticationService,
    public emailTemplateService: EmailTemplateService,
    private pagerService: PagerService,
    private logger: XtremandLogger,
    private router: Router,
    public properties: Properties, public eventError:EventError) {
    this.countries = this.referenceService.getCountries();
    this.listEmailTemplates();
    this.eventCampaign.emailTemplate = this.emailTemplates[0];
    this.eventCampaign.countryId = this.countries[0].id;
    this.eventCampaign.campaignEventTimes[0].countryId = this.countries[0].id;
    CKEDITOR.config.height = '175';
  }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listAllTeamMemberEmailIds();
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
  eventTitleError(){
    this.eventError.eventTitleError = this.eventCampaign.campaign ? false: true;
  }
  eventHostByError(){
    this.eventError.eventHostByError = this.eventCampaign.fromName? false:true;
  }
  eventStartTimeError(){
    this.eventError.eventStartTimeError= this.eventCampaign.campaignEventTimes[0].startTimeString ?false:true ;
  }
  eventCountryError(){
    this.eventError.eventCountryAndTimeZone = this.eventCampaign.campaignEventTimes[0].countryId ? false: true;
  }
  eventLocationError(){
    if(!this.eventCampaign.onlineMeeting){
    this.eventError.eventLocationError = this.eventCampaign.campaignLocation.location? false: true;
    }
  }
  eventDescriptionError(){
    this.eventError.eventDescription = this.eventCampaign.message ? false: true;
  }
  onBlurValidation(){
   this.eventTitleError();
   this.eventHostByError();
   this.eventStartTimeError();
   this.eventCountryError();
   this.eventLocationError();
   this.eventDescriptionError();
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
    this.isPartnerUserList = !this.isPartnerUserList;
    this.contactListsPagination.pageIndex = 1;
    this.loadContactLists(this.contactListsPagination);
  }

  highlightRow(contactListId: number) {
    const isChecked = $('#' + contactListId).is(':checked');
    if (isChecked) {

      if (!this.eventCampaign.userListIds.includes(contactListId)) {
        this.eventCampaign.userListIds.push(contactListId);
      }
      $('#' + contactListId).parent().closest('tr').addClass('highlight');
    } else {
      this.eventCampaign.userListIds.splice($.inArray(contactListId, this.eventCampaign.userListIds), 1);
      $('#' + contactListId).parent().closest('tr').removeClass('highlight');
    }
  }
  closeModal() {
    this.paginationType = 'contactlists';
    this.contactsPagination = new Pagination();
  }

  createEventCampaign(eventCampaign: EventCampaign, launchOption: string) {
    this.isFormSubmitted = true;
    this.onBlurValidation();
    this.getRepliesData();
    this.referenceService.goToTop();
    for (let userListId of eventCampaign.userListIds) {
      let contactList = new ContactList(userListId);
      eventCampaign.userLists.push(contactList);
    }
    this.eventCampaign.campaignReplies.forEach((item, index) => {
      console.log(item); // 9, 2, 5
      console.log(index); // 0, 1, 2
    });
    this.eventCampaign.user.userId = this.loggedInUserId;
    this.eventCampaign.campaignScheduleType = launchOption;
    console.log(eventCampaign);
    let scheduleTime:any;
    if (eventCampaign.campaignScheduleType == "NOW" || eventCampaign.campaignScheduleType == "SAVE") {
      eventCampaign.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      eventCampaign.launchTimeInString = this.campaignService.setLaunchTime();
    } else {
      eventCampaign.timeZone = $('#timezoneId option:selected').val();
    }

    eventCampaign.campaignEventTimes[0].timeZone = $('#timezoneIdCampaignEventTime option:selected').val();
    eventCampaign.campaignEventTimes[0].country = this.countries.find(x => x.id == eventCampaign.campaignEventTimes[0].countryId).name;

    this.campaignService.createEventCampaign(eventCampaign)
      .subscribe(
      response => {
        if (response.statusCode === 2000) {
          this.router.navigate(["/home/campaigns/manage"]);
        } else {
          if (response.statusCode === 2016) {
            this.campaignService.addErrorClassToDiv(response.data.emailErrorDivs);
            this.campaignService.addErrorClassToDiv(response.data.websiteErrorDivs);
          }
        }
      },
      error => console.log(error),
      () => console.log("Campaign Names Loaded")
      );
  }

  listAllTeamMemberEmailIds() {
    this.campaignService.getAllTeamMemberEmailIds(this.loggedInUserId)
      .subscribe(
      data => {
        console.log(data);
        let self = this;
        $.each(data, function (index, value) {
          self.teamMemberEmailIds.push(data[index]);
        });
        let teamMember = this.teamMemberEmailIds.filter((teamMember) => teamMember.id === this.loggedInUserId)[0];
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
    let user = this.teamMemberEmailIds.filter((teamMember) => teamMember.emailId === this.eventCampaign.email)[0];
    this.eventCampaign.fromName = $.trim(user.firstName + " " + user.lastName);
    this.setEmailIdAsFromName();
  }

  fileChange(event: any) {
    const file: File = event.target.files[0];
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
    var id = 'reply-' + length;
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
      let emailTemplateIds = reply.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
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
    let index = divId.split('-')[1];
    let editorName = 'editor' + index;
    let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
    if (errorLength === 0) {
      this.dataError = false;
    }
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
    let emailTemplate1 = new EmailTemplate(); emailTemplate1.id = 1700; emailTemplate1.name = "event based template 1";
    let emailTemplate2 = new EmailTemplate(); emailTemplate2.id = 1701; emailTemplate2.name = "event based template 2";
    let emailTemplate3 = new EmailTemplate(); emailTemplate3.id = 1702; emailTemplate3.name = "event based template 3";
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
  getRepliesData(){
    for(var i=0;i<this.eventCampaign.campaignReplies.length;i++){
        let reply = this.eventCampaign.campaignReplies[i];
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
        var errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
        if(errorLength==0){
            this.addEmailNotOpenedReplyDaysSum(reply, i);
            this.addEmailOpenedReplyDaysSum(reply, i);
        }
        }
    }

    addEmailNotOpenedReplyDaysSum(reply:Reply,index:number){
      if(reply.actionId==0){
          if(index==0){
              this.emailNotOpenedReplyDaysSum = reply.replyInDays;
          }else{
              this.emailNotOpenedReplyDaysSum = reply.replyInDays+this.emailNotOpenedReplyDaysSum;
          }
          reply.replyInDaysSum = this.emailNotOpenedReplyDaysSum;
      }
  }
  addEmailOpenedReplyDaysSum(reply:Reply,index:number){
      if(reply.actionId==13){
          if(index==0){
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
            }else if(reply.actionId==22 ||reply.actionId==23 ){
                if(reply.replyInDays==null || reply.replyInDays==0){
                        this.addReplyDaysErrorDiv(reply);
              }
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
              //    reply.replyTime = this.campaignService.setAutoReplyDefaultTime(this.campaignLaunchForm.value.scheduleCampaign, reply.replyInDays,reply.replyTime,this.campaignLaunchForm.value.launchTime);
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

}

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
import { User } from '../../core/models/user';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { Properties } from '../../common/models/properties';
import { Reply } from '../models/campaign-reply';
import { CampaignEmailTemplate } from '../models/campaign-email-template';

declare var $, flatpickr, CKEDITOR;

@Component({
  selector: 'app-event-campaign',
  templateUrl: './event-campaign.component.html',
  styleUrls: ['./event-campaign.component.css'],
  providers: [PagerService, Pagination, CallActionSwitch, Properties]
})
export class EventCampaignComponent implements OnInit {
  emailTemplates: Array<EmailTemplate> = [];
  campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
  reply: Reply = new Reply();
  countries: Country[];
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

  constructor(public callActionSwitch: CallActionSwitch, public referenceService: ReferenceService,
    private contactService: ContactService,
    public campaignService: CampaignService,
    public authenticationService: AuthenticationService,
    public emailTemplateService: EmailTemplateService,
    private pagerService: PagerService,
    private logger: XtremandLogger,
    private router: Router,
    public properties: Properties) {
    this.countries = this.referenceService.getCountries();
    this.listEmailTemplates();
    this.eventCampaign.emailTemplate = this.emailTemplates[0];
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
    for (let userListId of eventCampaign.userListIds) {
      let contactList = new ContactList(userListId);
      eventCampaign.userLists.push(contactList);
    }
    this.eventCampaign.user.userId = this.loggedInUserId;
    this.eventCampaign.campaignScheduleType = launchOption;
    console.log(eventCampaign);

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

  onChangeCountry(countryId) {
    this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
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
}

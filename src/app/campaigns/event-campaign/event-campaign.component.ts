import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { ContactService } from '../.././contacts/services/contact.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { EventCampaign } from '../models/event-campaign';
import { CampaignEventTime } from '../models/campaign-event-time';
import { Pagination } from '../../core/models/pagination';
import { ContactList } from '../../contacts/models/contact-list';
import { EmailTemplate } from '../../email-template/models/email-template';
import { User } from '../../core/models/user';

declare var $, flatpickr, CKEDITOR;

@Component({
  selector: 'app-event-campaign',
  templateUrl: './event-campaign.component.html',
  styleUrls: ['./event-campaign.component.css'],
  providers: [PagerService, Pagination, CallActionSwitch]
})
export class EventCampaignComponent implements OnInit {
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
    private pagerService: PagerService,
    private logger: XtremandLogger,
    private router: Router) {
    this.eventCampaign.campaignEventTimes.push(new CampaignEventTime());
  }

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listAllTeamMemberEmailIds();
    this.loadContactLists(this.contactListsPagination);
    flatpickr('.flatpickr', {
      enableTime: true,
      dateFormat: 'm/d/Y H:i',
      time_24hr: false
    });
    this.ckeConfig = {
      allowedContent: true,
      toolbar: 'Basic'
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
    this.eventCampaign.emailTemplate.id = 1700;
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
}

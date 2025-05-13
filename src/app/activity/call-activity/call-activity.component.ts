import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { ContactService } from 'app/contacts/services/contact.service';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CallIntegrationService } from 'app/core/services/call-integration.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-call-activity',
  templateUrl: './call-activity.component.html',
  styleUrls: ['./call-activity.component.css'],
  providers: [PaginationComponent]
})
export class CallActivityComponent implements OnInit {

  @Input() contactId: number;
  @Input() activeCallDetails: any;
  @Input() isReloadTab: boolean;
  @Input() isCompanyJourney: boolean = false;
  @Input() selectedUserListId: any;
  @Input() mobileNumber: any;

  @Output() notifyClose = new EventEmitter();
  @Output() notifyOliver = new EventEmitter();
  @Output() notifyAskOliver = new EventEmitter();

  callActivities = [];
  ngxLoading: boolean = false;
  callActivityPagination: Pagination = new Pagination();
  showFilterOption: boolean = false;
  selectedFilterIndex: number = 1;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  callSortOption: SortOption = new SortOption();
  callActivitysResponse: any;
  callActivityPagedItems = new Array();
  pageSize: number = 12;
  callActivityPager: any = {};
  searchKey: any;
  filteredCallActivities: any;
  pageNumber: any;
  callIntegrationType: any;
  showPreviewCall: boolean = false;
  showConfigureMessage: boolean = false;
  isFirstChange: boolean = true;
  userListUsersLoader: HttpRequestLoader = new HttpRequestLoader();
  companyUsersSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
  contactErrorResponse: CustomResponse = new CustomResponse();
  showAircallDialer: boolean = false;

  constructor(public referenceService: ReferenceService, public pagerService: PagerService, private callIntegrationService:CallIntegrationService, public authenticationService: AuthenticationService,
      public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent, public contactService: ContactService, public properties: Properties) { }

  ngOnInit() {
    this.callIntegrationType = this.activeCallDetails != undefined ? this.activeCallDetails.type : '';
    this.pageNumber = this.paginationComponent.numberPerPage[0];
    if (this.isCompanyJourney) {
      this.fetchUsersForCompanyJourney();
      this.selectedUserListId = this.contactId;
    } else {
      this.showAllCallActivities();
    }
  }

  showAllCallActivities() {
    if (this.contactId != undefined && this.contactId > 0) {
      this.resetCallActivityPagination();
      this.contactErrorResponse.isVisible = false;
      if (this.referenceService.checkIsValidString(this.callIntegrationType)) {
        this.fetchAllCallActivities(this.callActivityPagination);
      } else {
        this.showConfigureMessage = true;
      }
    } else {
      this.contactErrorResponse = new CustomResponse('ERROR', 'Please select contact.', true);
    }
  }

  resetCallActivityPagination() {
    this.callActivityPagination.maxResults = 12;
    this.callActivityPagination = new Pagination;
    this.callActivityPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
    this.showFilterOption = false;
  }

  fetchAllCallActivities(callActivityPagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    callActivityPagination.contactId = this.contactId;
    callActivityPagination.userListId = this.selectedUserListId;
    this.callIntegrationService.fetchAllCallActivities(callActivityPagination, this.callIntegrationType.toLowerCase(), this.isCompanyJourney).subscribe(
      response => {
        if (response.statusCode === XAMPLIFY_CONSTANTS.HTTP_OK) {
          if (this.callIntegrationType == 'AIRCALL') {
            this.callActivitysResponse = response.data.list;
          } else {
            callActivityPagination.totalRecords = response.totalRecords;
            callActivityPagination = this.pagerService.getPagedItems(callActivityPagination, response.list);
          }
          this.setCallActivitiesPage(1);
        } else if (response.statusCode == 400) {
          this.resetCallActivities();
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        } else {
          this.resetCallActivities();
          this.customResponse = new CustomResponse('ERROR', "Unable to get task activities", true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        let message = this.referenceService.getApiErrorMessage(error);
        if (message.includes("401 UnAuthorized from External API")) {
          this.resetCallActivities();
          this.customResponse = new CustomResponse('ERROR', "Your " + this.callIntegrationType.toLowerCase() + " integration is invalid. Please Re-configure.", true);
        } else {
          this.resetCallActivities();
          this.customResponse = new CustomResponse('ERROR', message, true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  private resetCallActivities() {
    this.callActivitysResponse = [];
    this.setCallActivitiesPage(1);
  }

  setCallActivitiesPage(page: number) {
    try {
      if (page < 1 || (this.callActivityPager.totalPages > 0 && page > this.callActivityPager.totalPages)) {
        return;
      }
      if (this.callSortOption.callIntegrationDropDownOption !== undefined && this.callActivitysResponse != undefined) {
        if (this.callSortOption.callIntegrationDropDownOption === 'asc') {
          this.callActivitysResponse.sort((a, b) => {
            const dateA = new Date(a.createdTime);
            const dateB = new Date(b.createdTime);

            return dateA.getTime() - dateB.getTime();
          });
        } else if (this.callSortOption.callIntegrationDropDownOption === 'desc') {
          this.callActivitysResponse.sort((a, b) => {
            const dateA = new Date(a.createdTime);
            const dateB = new Date(b.createdTime);

            return dateB.getTime() - dateA.getTime();
          });
        }
      }
      this.referenceService.goToTop();
      if (this.callActivitysResponse != undefined) {
        if (this.searchKey !== undefined && this.searchKey !== '') {
          this.filteredCallActivities = this.callActivitysResponse.filter(call =>
            (call.name.toLowerCase().includes(this.searchKey.trim().toLowerCase()) || call.name.toLowerCase().includes(this.searchKey.trim().toLowerCase()))
          );
          this.callActivityPager = this.socialPagerService.getPager(this.filteredCallActivities.length, page, this.pageSize);
          this.callActivityPagedItems = this.filteredCallActivities.slice(this.callActivityPager.startIndex, this.callActivityPager.endIndex + 1);
        } else {
          this.callActivityPager = this.socialPagerService.getPager(this.callActivitysResponse.length, page, this.pageSize);
          this.callActivityPagedItems = this.callActivitysResponse.slice(this.callActivityPager.startIndex, this.callActivityPager.endIndex + 1);
        }
      } else {
        this.callActivityPager = {};
        this.callActivityPagedItems = [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  openPreviewModalPopup(id: any) {
    this.showPreviewCall = true;
  }

  sortFieldsByOption() {
    if (this.referenceService.checkIsValidString(this.callIntegrationType)) {
      this.setCallActivitiesPage(1);
    } else {
      this.showConfigureMessage = true;
    }
  }

  toggleRecordingCard(card: any) {
    if (card.voiceMailExpanded) {
      card.voiceMailExpanded = false;
    }
    card.recordExpanded = !card.recordExpanded;
  }

  fetchUsersForCompanyJourney() {
    this.referenceService.loading(this.userListUsersLoader, true);
    this.contactService.fetchUsersForCompanyJourney(this.contactId, true).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.companyUsersSearchableDropDownDto.data = response.data;
          this.companyUsersSearchableDropDownDto.placeHolder = "Select a contact";
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.referenceService.loading(this.userListUsersLoader, false);
      }, error => {
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.referenceService.loading(this.userListUsersLoader, false);
      }, () => {
        if (this.companyUsersSearchableDropDownDto.data != undefined && this.companyUsersSearchableDropDownDto.data.length > 0) {
          this.contactId = this.companyUsersSearchableDropDownDto.data[0].id;
          this.mobileNumber = this.companyUsersSearchableDropDownDto.data[0].mobileNumber;
          this.showAllCallActivities();
        } else {
          this.contactErrorResponse = new CustomResponse('ERROR', 'No contact is available', true);
        }
      }
    )
  }

  getSelectedAssignedToUserId(event) {
    this.contactId = event != undefined ? event['id'] : 0;
    this.mobileNumber = event != undefined ? event['mobileNumber'] : '';
    this.showAllCallActivities();
  }

  selectedPageNumber(event) {
    this.pageNumber.value = event;
    if (event === 0) { event = this.callActivitysResponse.length; }
    this.pageSize = event;
    this.setCallActivitiesPage(1);
  }

  ngOnChanges() {
    if (this.isFirstChange) {
      this.isFirstChange = false;
    } else {
      this.callIntegrationType = this.activeCallDetails != undefined ? this.activeCallDetails.type : '';
      this.pageNumber = this.paginationComponent.numberPerPage[0];
      this.showAllCallActivities();
    }
  }

  // openAircallDialer() {
  //   this.showAircallDialer = true;
  // }

  closeCallModalPopup(event) {
    this.isReloadTab = event;
    this.showAircallDialer = false;
    this.notifyClose.emit(event);
  }

  toggleVoiceMailCard(card: any) {
    if (card.recordExpanded) {
      card.recordExpanded = false;
    }
    card.voiceMailExpanded = !card.voiceMailExpanded;
  }

  openAircallDialer() {
    this.referenceService.openModalPopup("addCallModalPopup");
  }

  dialNumber() {
    this.openAircallDialer();
    const payload = {
      phone_number: this.mobileNumber
    };
    this.referenceService.aircallPhone.send(
      'dial_number',
      payload,
      (success, data) => {
      }
    );
  }

  askOliver() {
    this.notifyOliver.emit();
  }

  askOliverForCallRecording(callActivity) {
    this.notifyAskOliver.emit(callActivity);
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { MeetingActivityService } from '../services/meeting-activity.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { PaginationComponent } from 'app/common/pagination/pagination.component';

@Component({
  selector: 'app-meeting-activity',
  templateUrl: './meeting-activity.component.html',
  styleUrls: ['./meeting-activity.component.css'],
  providers: [MeetingActivityService, PaginationComponent]
})
export class MeetingActivityComponent implements OnInit {

  @Input() contactId:number;
  @Input() activeCalendarDetails:any;
  @Input() isReloadTab:boolean;

  @Output() notifyClose = new EventEmitter();

  meetingActivities = [];
  ngxLoading:boolean = false;
  meetingActivityPagination: Pagination = new Pagination();
  showFilterOption: boolean = false;
  selectedFilterIndex: number = 1;
  customResponse: CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  meetingSortOption: SortOption = new SortOption();
  meetingActivitysResponse: any;
  meetingActivityPagedItems = new Array();
  pageSize: number = 12;
  meetingActivityPager: any = {};
  searchKey: any;
  filteredMeetingActivities: any;
  pageNumber: any;
  showMeetingModalPopup: boolean = false;
  showCalendarIntegrationsModalPopup: boolean = false;
  calendarType:any;
  showPreviewMeeting:boolean = false;
  eventUrl: any;
  showConfigureMessage: boolean = false;

  constructor(public meetingActivityService: MeetingActivityService, public referenceService: ReferenceService, public pagerService: PagerService, 
    public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent) { }

  ngOnInit() {
    this.calendarType = this.activeCalendarDetails != undefined ? this.activeCalendarDetails.type : '';
    this.pageNumber = this.paginationComponent.numberPerPage[0];
    this.showAllMeetingActivities();
  }

  ngOnChanges() {
    this.calendarType = this.activeCalendarDetails != undefined ? this.activeCalendarDetails.type : '';
    this.pageNumber = this.paginationComponent.numberPerPage[0];
    this.showAllMeetingActivities();
  }

  showAllMeetingActivities() {
    this.resetTaskActivityPagination();
    if (this.referenceService.checkIsValidString(this.calendarType)) {
      this.fetchAllMeetingActivities(this.meetingActivityPagination);
    } else {
      this.showConfigureMessage = true;
    }
  }

  resetTaskActivityPagination() {
    this.meetingActivityPagination.maxResults = 12;
    this.meetingActivityPagination = new Pagination;
    this.meetingActivityPagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    this.showFilterOption = false;
  }

  fetchAllMeetingActivities(meetingActivityPagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    meetingActivityPagination.contactId = this.contactId;
    this.meetingActivityService.fetchAllMeetingActivities(meetingActivityPagination, this.calendarType.toLowerCase()).subscribe(
      response => {
        const data = response.data;
        let isSuccess = response.statusCode === 200;
        if(isSuccess){
          if (this.calendarType == 'CALENDLY') {
            this.meetingActivitysResponse = data.list;
          } else {
            meetingActivityPagination.totalRecords = data.totalRecords;
            meetingActivityPagination = this.pagerService.getPagedItems(meetingActivityPagination, data.list);
          }
          this.setMeetingActivitiesPage(1);
        }else{
          this.customResponse = new CustomResponse('ERROR',"Unable to get task activities",true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        let message = this.referenceService.getApiErrorMessage(error);
        if (message.includes("401 UnAuthorized from External API")) {
          this.customResponse = new CustomResponse('ERROR',"Your "+ this.calendarType.toLowerCase()+" integration is invalid. Please Re-configure.",true);
        } else {
          this.customResponse = new CustomResponse('ERROR',message,true);
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      }
    )
  }

  setMeetingActivitiesPage(page: number) {
		try {
			if (page < 1 || (this.meetingActivityPager.totalPages > 0 && page > this.meetingActivityPager.totalPages)) {
				return;
			}
			if (this.meetingSortOption.calendlyDropDownOption !== undefined) {
				if (this.meetingSortOption.calendlyDropDownOption === 'asc') {
					this.meetingActivitysResponse.sort((a, b) => {
            const dateA = new Date(a.createdTime);
            const dateB = new Date(b.createdTime);
          
            return dateA.getTime() - dateB.getTime();
          });
				} else if (this.meetingSortOption.calendlyDropDownOption === 'desc') {
					this.meetingActivitysResponse.sort((a, b) => {
            const dateA = new Date(a.createdTime);
            const dateB = new Date(b.createdTime);
          
            return dateB.getTime() - dateA.getTime();
          });
				}
			}
			this.referenceService.goToTop();
			if (this.searchKey !== undefined && this.searchKey !== '') {
				this.filteredMeetingActivities = this.meetingActivitysResponse.filter(meeting =>
					(meeting.name.toLowerCase().includes(this.searchKey.trim().toLowerCase()) || meeting.name.toLowerCase().includes(this.searchKey.trim().toLowerCase()))
				);
				this.meetingActivityPager = this.socialPagerService.getPager(this.filteredMeetingActivities.length, page, this.pageSize);
				this.meetingActivityPagedItems = this.filteredMeetingActivities.slice(this.meetingActivityPager.startIndex, this.meetingActivityPager.endIndex + 1);
			} else {
				this.meetingActivityPager = this.socialPagerService.getPager(this.meetingActivitysResponse.length, page, this.pageSize);
				this.meetingActivityPagedItems = this.meetingActivitysResponse.slice(this.meetingActivityPager.startIndex, this.meetingActivityPager.endIndex + 1);
			}
		} catch (error) {
		}
	}

  searchFieldsKeyPress(keyCode: any) {
		if (keyCode === 13) {
			this.searchFields();
		}
	}

	searchFields() {
    if (this.referenceService.checkIsValidString(this.calendarType)) {
      this.setMeetingActivitiesPage(1);
    } else {
      this.customResponse = new CustomResponse('ERROR',"Please configure with atleast one calendar integration.",true);
    }
	}

  getAllFilteredResultsFields() {
    this.showAllMeetingActivities();
  }

  sortFieldsByOption() {
    if (this.referenceService.checkIsValidString(this.calendarType)) {
      this.setMeetingActivitiesPage(1);
    } else {
      this.customResponse = new CustomResponse('ERROR',"Please configure with atleast one calendar integration.",true);
    }
	}

  clearSearch() {
		this.searchKey = '';
		if (this.referenceService.checkIsValidString(this.calendarType)) {
      this.setMeetingActivitiesPage(1);
    } else {
      this.customResponse = new CustomResponse('ERROR',"Please configure with atleast one calendar integration.",true);
    }
	}

  openMeetingModalPopup() {
    if (this.activeCalendarDetails != undefined) {
      this.showMeetingModalPopup = true;
    } else {
      this.showCalendarIntegrationsModalPopup = true;
    }
  }

  closeCalendarIntegrationsModalPopup() {
    this.showCalendarIntegrationsModalPopup = false;
  }

  closeMeetingModalPopup(event) {
    this.showMeetingModalPopup = false;
    this.notifyClose.emit(event);
  }

  openPreviewModalPopup(eventUrl:any) {
    this.eventUrl = eventUrl;
    this.showPreviewMeeting =true;
  }

  closePreviewMeetingModalPopup() {
    this.showPreviewMeeting = false;
  }

}

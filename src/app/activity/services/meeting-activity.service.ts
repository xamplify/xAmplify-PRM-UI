import { Injectable } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Injectable()
export class MeetingActivityService {

  URL = this.authenticationService.REST_URL + "/meeting";
  ACCESS_TOKEN_URL = "?access_token="+this.authenticationService.access_token;

  constructor(private authenticationService: AuthenticationService, private referenceService: ReferenceService) { }

  fetchAllMeetingActivities(meetingActivityPagination: Pagination, type:any) {
    meetingActivityPagination.userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(meetingActivityPagination);
    let url = this.URL + "/fetchAllMeetingActivities/" + this.authenticationService.getUserId() + "/" + meetingActivityPagination.contactId + "/" + type + this.ACCESS_TOKEN_URL + pageableUrl;
    return this.authenticationService.callGetMethod(url);
  }

}

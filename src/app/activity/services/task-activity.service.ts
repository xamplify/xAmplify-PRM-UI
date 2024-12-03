import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { TaskActivity } from '../models/task-activity-dto';
import { Pagination } from 'app/core/models/pagination';

@Injectable()
export class TaskActivityService {
    
    URL = this.authenticationService.REST_URL + "/task";
    ACCESS_TOKEN_URL = "?access_token="+this.authenticationService.access_token;

    constructor(private http: Http, private authenticationService: AuthenticationService, private referenceService: ReferenceService) {}

  save(taskActivity: TaskActivity) {
    taskActivity.loggedInUserId = this.authenticationService.getUserId();
    let url = this.URL + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callPostMethod(url, taskActivity);
  }

  fetchAssignToDropDownOptions() {
    let url = this.URL + "/fetchAssignToDropDownOptions/" + this.authenticationService.getUserId() + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  fetchStatusDropDownOptions() {
    let url = this.URL + "/fetchStatusDropDownOptions/" + this.authenticationService.getUserId() + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  fetchAllTaskActivities(taskActivityPagination: Pagination) {
    let pageableUrl = this.referenceService.getPagebleUrl(taskActivityPagination);
    let url = this.URL + "/fetchAllTaskActivities/" + this.authenticationService.getUserId() + "/" + taskActivityPagination.contactId + this.ACCESS_TOKEN_URL + pageableUrl;
    return this.authenticationService.callGetMethod(url);
  }

  fetchTaskActivityByIdForEdit(taskActivityId:any) {
    let url = this.URL + "/fetchTaskActivityByIdForEdit/" + taskActivityId + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  update(taskActivity:TaskActivity) {
    taskActivity.loggedInUserId = this.authenticationService.getUserId();
    let url = this.URL + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callPutMethod(url, taskActivity);
  }

  delete(id:any) {
    let url = this.URL + "/" + id + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callDeleteMethod(url);
  }

  fetchTaskActivityByIdForPreview(taskActivityId:any) {
    let url = this.URL + "/fetchTaskActivityByIdForPreivew/" + taskActivityId + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

}

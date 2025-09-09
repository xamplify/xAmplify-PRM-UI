import { Component, OnInit } from '@angular/core';
import { ContactService } from 'app/contacts/services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { EmailActivity } from 'app/activity/models/email-activity-dto';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { PagerService } from 'app/core/services/pager.service';
@Component({
  selector: 'app-welcome-email-list',
  templateUrl: './welcome-email-list.component.html',
  styleUrls: ['./welcome-email-list.component.css'],
  providers: [HttpRequestLoader, SortOption]
})
export class WelcomeEmailListComponent implements OnInit {

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  emailActivity: EmailActivity[] = [];
  emailActivityId: any;
  searchKey: any;
  sortOption: SortOption = new SortOption();
  pagination: Pagination = new Pagination();
  showEmailModalPopup: boolean = false;
  scrollClass: string;

  constructor(private pagerService: PagerService, public referenceService: ReferenceService,private utilService: UtilService,public contactService: ContactService, public authenticationService: AuthenticationService) {
  this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.pagination.pageIndex = 1;
    this.getWelcomeEmailsList(this.pagination);
  }
  getWelcomeEmailsList(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.pagination.searchKey = this.searchKey || '';
    let pageIndex = pagination.pageIndex;
    this.pagination = this.utilService.sortOptionValues(
      this.sortOption.sendWelcomeMailSortOptions,
      pagination
    );
    this.pagination.pageIndex = pageIndex;
    this.contactService.getWelcomeEmailsList(this.pagination).subscribe(
       (response: any) => {
        this.referenceService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.emailActivity= response.data;
          this.pagination.totalRecords = response.data.totalRecords;
          if(pagination.totalRecords == 0){
            this.scrollClass = 'noData'
          } else {
            this.scrollClass = 'tableHeightScroll'
          }
          this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }
      },
      error => {
        console.error("Error fetching welcome emails:", error);
      }
    );
  }
  previewMailData(emailActivityId:any) {
    this.emailActivityId = emailActivityId;
    this.showEmailModalPopup = true;
  }
  
  closeModalPopup() {
    this.showEmailModalPopup = false;
  }
  search() {
    this.getAllFilteredResults(this.pagination);
  }
    getAllFilteredResults(pagination: Pagination) {
    pagination.searchKey = this.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.sendWelcomeMailSortOptions, pagination);
    this.getWelcomeEmailsList(pagination);
  }
  sortWelcomeEmails(text: any) {
    this.sortOption.sendWelcomeMailSortOptions = text;
    this.getAllFilteredResults(this.pagination);
  }
  downloadWelcomeEmailsList(){
    let pageableUrl = this.referenceService.getPagebleUrl(this.pagination);
    let userId = this.loggedInUserId;
    let url = this.authenticationService.REST_URL + "userlists/" +
      "/downloadWelcomeEmailsList/userId/" + userId +
      "?access_token=" + this.authenticationService.access_token + pageableUrl;
    this.referenceService.openWindowInNewTab(url);
  }
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getWelcomeEmailsList(this.pagination);
  }
  getWelcomePageDetails(event: any) {
    this.pagination = event;
    this.getWelcomeEmailsList(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
  navigateToRouter(urlType: any) {
    if (urlType == 'home') {
      this.referenceService.goToRouter(this.referenceService.homeRouter);
    } else if (urlType == 'partner') {
      this.referenceService.goToRouter(this.referenceService.onboardingPartnerRouter);
    }
    }
}

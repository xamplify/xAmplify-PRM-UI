import { Component, OnInit, Input, OnChanges,Output,EventEmitter } from '@angular/core';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Location } from '@angular/common';
import { UserGuide } from '../models/user-guide';
import { AuthenticationService } from 'app/core/services/authentication.service';


@Component({
  selector: 'app-search-guides',
  templateUrl: './search-guides.component.html',
  styleUrls: ['./search-guides.component.css']
})
export class SearchGuidesComponent implements OnInit, OnChanges {
  @Input() pagination: Pagination;
  @Input() searchKey:any;
  @Input() loading: boolean = false;
  public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  userGuides: UserGuide[];
  pager: any = {};
  @Output() changeEvent = new EventEmitter<any>();
  constructor(public refService: ReferenceService, public dashboardService: DashboardService, public pagerService: PagerService, public socialPagerService: SocialPagerService,
    public location:Location,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.getSearchResultsOfUserGuides(this.pagination)
  }
  getSearchResultByModuleName(){
    if (this.searchKey.toLowerCase() === 'Campaign'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase() === 'Account Dashboard'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase() === 'Contacts'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Content'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'DAM'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Design'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Forms'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'MDF'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Opportunities'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Pages'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Partner'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Play Book'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Share Leads'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Shared Leads'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Social Feeds'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Team'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Templates'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Track Builder'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else if (this.searchKey.toLowerCase()  === 'Configuration'.toLowerCase()) {
      this.pagination.searchWithModuleName = true;
		} else {
      this.pagination.searchWithModuleName = false;

    }
  }
  ngOnChanges(){
    this.loading = false;
    this.getSearchResultsOfUserGuides(this.pagination);
    this.getSearchResultByModuleName();
  }
  getSearchResultsOfUserGuides(pagination: Pagination) {
    this.loading = true;
    this.refService.loading(this.httpRequestLoader, true);
    this.httpRequestLoader.isHorizontalCss = true;
    this.getSearchResultByModuleName();
    this.pagination.searchKey = this.searchKey;
    this.dashboardService.getSearchResultsOfUserGuides(pagination).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          let userGuide = response.data;
          this.userGuides = userGuide.list;
          console.log(userGuide.totalRecords);
          console.log(userGuide.list)
          this.loading = false;
          pagination.totalRecords = userGuide.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, userGuide.list);
          this.pager = this.socialPagerService.getPager(this.userGuides.length, this.pagination.pageIndex, this.pagination.maxResults);
          this.pagination.pagedItems = this.userGuides.slice(this.pager.startIndex, this.pager.endIndex + 1);
          this.refService.loading(this.httpRequestLoader, false);
          this.location.replaceState('home/help/search');
        } else {
         this.loading = false;
        }
      }, (error: any) => {
        this.loading = false;
        this.refService.loading(this.httpRequestLoader, false);
        // this.customResponse = new CustomResponse('ERROR', "Opps Something Went Wrong", true);
      })
  }
  getGuideLinkByTitle(value:String){
    this.changeEvent.emit(value);
  }
//   sendStatusCode(statusCode:any){
//    this.changeStatusCode.emit(this.statusCode)
//   }
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.getSearchResultsOfUserGuides(this.pagination);
	}
}

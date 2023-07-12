import { Component, OnInit, Input, OnChanges,Output,EventEmitter } from '@angular/core';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Location } from '@angular/common';
import { UserGuide } from '../models/user-guide';


@Component({
  selector: 'app-search-guides',
  templateUrl: './search-guides.component.html',
  styleUrls: ['./search-guides.component.css']
})
export class SearchGuidesComponent implements OnInit, OnChanges {
  @Input() pagination: Pagination;
  @Input() searchKey:any;
  loading: boolean = false;
  public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  userGuides: UserGuide[];
  pager: any = {};
  @Output() changeEvent = new EventEmitter<any>();

  constructor(public refService: ReferenceService, public dashboardService: DashboardService, public pagerService: PagerService, public socialPagerService: SocialPagerService,
    public location:Location) { }

  ngOnInit() {
    this.getSearchResultsOfUserGuides(this.pagination)
  }
  ngOnChanges(){
    this.pagination.searchKey = this.searchKey
    this.getSearchResultsOfUserGuides(this.pagination)
  }
  getSearchResultsOfUserGuides(pagination: Pagination) {
    this.loading = true;
    // this.showListId = "";
    this.refService.loading(this.httpRequestLoader, true);
    this.httpRequestLoader.isHorizontalCss = true;
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
          this.pager = this.socialPagerService.getPager(userGuide.totalRecords, this.pagination.pageIndex, this.pagination.maxResults);
          this.pagination.pagedItems = this.userGuides.slice(this.pager.startIndex, this.pager.endIndex + 1);
          this.refService.loading(this.httpRequestLoader, false);
          this.location.replaceState('home/help/search/'+ this.searchKey);

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
  resetResponse() {
		//this.customResponse = new CustomResponse();
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	search() {
		this.resetResponse();
		this.pagination.searchKey = this.searchKey;
		this.pagination.pageIndex = 1;
		//this.isSearch = true;
		//this.getSearchResultsOfUserGuides(this.pagination);
	}
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		//this.getSearchResultsOfUserGuides(this.pagination);
	}
}

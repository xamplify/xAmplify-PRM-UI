import { Component, OnInit, Input } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ParterService } from 'app/partners/services/parter.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { SortOption } from 'app/core/models/sort-option';

@Component({
  selector: 'app-active-partners-table',
  templateUrl: './active-partners-table.component.html',
  styleUrls: ['./active-partners-table.component.css']
})
export class ActivePartnersTableComponent implements OnInit {
  @Input() applyFilter:boolean;
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
      this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    alert("Hiiii");
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
		this.getActivePartners();
  }

  getActivePartners() {
		this.referenseService.loading(this.httpRequestLoader, true);
		this.pagination.userId = this.loggedInUserId;
    this.parterService.getActivePartners(this.pagination).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        this.sortOption.totalRecords = response.data.totalRecords;
				this.pagination.totalRecords = response.data.totalRecords;
				this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);				
			},
			(_error: any) => {
			}
		);
  }

  activePartnerSearch(keyCode: any) { if (keyCode === 13) { this.searchActivePartnerAnalytics(); } }

	searchActivePartnerAnalytics() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.searchKey;
		this.getActivePartners();
	}

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getActivePartners();
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    if (this.sortOption.itemsSize.value == 0) {
        pagination.maxResults = pagination.totalRecords;
    } else {
        pagination.maxResults = this.sortOption.itemsSize.value;
    }
    let sortedValue = this.sortOption.defaultSortOption.value;
        this.setSortColumns(pagination, sortedValue);
        this.getActivePartners();
  }

  setSortColumns(pagination: Pagination, sortedValue: any) {
    if (sortedValue != "") {
        let options: string[] = sortedValue.split("-");
        pagination.sortcolumn = options[0];
        pagination.sortingOrder = options[1];
    }
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) { 
      this.search(); 
    } 
  }

  search() {
    this.getAllFilteredResults(this.pagination); 
  }  

  dropDownList(event) {
    this.pagination = event;
    this.getAllFilteredResults(this.pagination);
  }

}

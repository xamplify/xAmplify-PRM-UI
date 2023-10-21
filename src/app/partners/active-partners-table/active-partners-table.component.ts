import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { PagerService } from '../../core/services/pager.service';
import { ParterService } from 'app/partners/services/parter.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from 'app/common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';

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
  customResponse: CustomResponse = new CustomResponse();
  @Output() notifyShowDetailedAnalytics = new EventEmitter();

  constructor(public listLoaderValue: ListLoaderValue, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
      this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
		this.getActivePartners(this.pagination);
  }

  getActivePartners(pagination: Pagination) {
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

	search() {
		// this.pagination.pageIndex = 1;
		// this.pagination.searchKey = this.searchKey;
		// this.getActivePartners(this.pagination);
    this.getAllFilteredResults(this.pagination);
	}

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) { 
      this.search(); 
    } 
  } 

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getActivePartners(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getActivePartners(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getActivePartners(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }  

  setSortColumns(pagination: Pagination, sortedValue: any) {
    if (sortedValue != "") {
        let options: string[] = sortedValue.split("-");
        pagination.sortcolumn = options[0];
        pagination.sortingOrder = options[1];
    }
  }  

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId); 
  }

}

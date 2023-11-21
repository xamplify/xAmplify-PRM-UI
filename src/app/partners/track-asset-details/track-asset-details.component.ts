import { Component, OnInit , Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
@Component({
  selector: 'app-track-asset-details',
  templateUrl: './track-asset-details.component.html',
  styleUrls: ['./track-asset-details.component.css'],
  providers: [SortOption]
})
export class TrackAssetDetailsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() type: any;
  @Input()  isDetailedAnalytics: boolean;
  @Input() applyFilter: boolean;
  @Input() selectedPartnerCompanyIds: any = [];

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();

  constructor(public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService,
    public pagerService: PagerService, public utilService: UtilService,
    public xtremandLogger: XtremandLogger, public sortOption: SortOption) {
      this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {   
  }

  ngOnChanges() {    
    this.pagination.pageIndex = 1;
    this.getTrackAssetDetails(this.pagination);
  }

  getTrackAssetDetails(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.maxResults = 6;
    this.pagination.lmsType = this.type;
    if (this.teamMemberId !== undefined && this.teamMemberId != null && this.teamMemberId > 0) {
      this.pagination.teamMemberId = this.teamMemberId;
    }    
    this.parterService.getTrackAssetDetails(this.pagination).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
				  this.pagination.totalRecords = response.data.totalRecords;
				  this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }        	
			},
			(_error: any) => {
        this.httpRequestLoader.isServerError = true;
        this.xtremandLogger.error(_error);
			}
		);
  }

  search() {		
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
    this.getTrackAssetDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getTrackAssetDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getTrackAssetDetails(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }  

}

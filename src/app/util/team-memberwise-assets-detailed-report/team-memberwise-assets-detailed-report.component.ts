import { Component, OnInit , Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ParterService } from '../../partners/services/parter.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';

@Component({
  selector: 'app-team-memberwise-assets-detailed-report',
  templateUrl: './team-memberwise-assets-detailed-report.component.html',
  styleUrls: ['./team-memberwise-assets-detailed-report.component.css'],
  providers: [SortOption]
})
export class TeamMemberwiseAssetsDetailedReportComponent implements OnInit {

  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion : boolean =  false;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId: number = 0;
  searchKey: string = "";
	pagination: Pagination = new Pagination();
  scrollClass: any;

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
    this.getTeamMemberWiseTrackAssetDetails(this.pagination);
  }

  getTeamMemberWiseTrackAssetDetails(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.maxResults = 6;
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    this.parterService.getTeamMemberWiseTrackAssetDetails(this.pagination).subscribe(
			(response: any) => {	
        this.referenseService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {          
          this.sortOption.totalRecords = response.data.totalRecords;
				  this.pagination.totalRecords = response.data.totalRecords;
          if(pagination.totalRecords == 0){
            this.scrollClass = 'noData'
          } else {
            this.scrollClass = 'tableHeightScroll'
          }

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
    this.getTeamMemberWiseTrackAssetDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getTeamMemberWiseTrackAssetDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getTeamMemberWiseTrackAssetDetails(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  } 

}

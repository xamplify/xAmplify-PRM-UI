import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-typewise-track-content-details',
  templateUrl: './typewise-track-content-details.component.html',
  styleUrls: ['./typewise-track-content-details.component.css'],
  providers: [SortOption]
})
export class TypewiseTrackContentDetailsComponent implements OnInit {
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() trackType: any = "";
  @Input() assetType: any = "";
  @Input() applyFilter: boolean;
  @Output() notifyShowDetailedAnalytics = new EventEmitter();
  @Input()  isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() isTeamMemberAnalytics : boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion : boolean = false;


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
    this.getTypeWiseTrackContentDetails(this.pagination);
  }

  getTypeWiseTrackContentDetailsForPartnerJourney(pagination : Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.partnerCompanyId = this.partnerCompanyId;
    this.pagination.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    this.pagination.detailedAnalytics = this.isDetailedAnalytics;
    this.pagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.pagination.trackTypeFilter = this.trackType;
    this.pagination.assetTypeFilter = this.assetType;
    this.pagination.maxResults = 6;
    this.pagination.teamMemberId = this.teamMemberId;   
    this.parterService.getTypeWiseTrackContentDetails(this.pagination).subscribe(
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

  getTypeWiseTrackContentDetailsForTeamMember(pagination: Pagination) {
    this.referenseService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.pagination.trackTypeFilter = this.trackType;
    this.pagination.assetTypeFilter = this.assetType;
    this.pagination.maxResults = 6; 
    this.pagination.selectedTeamMemberIds = this.selectedTeamMemberIds;
    this.pagination.selectedVendorCompanyIds = this.selectedVendorCompanyIds; 
    this.parterService.getTypeWiseTrackContentDetailsForTeamMember(this.pagination,this.isVendorVersion).subscribe(
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
    this.getTypeWiseTrackContentDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getTypeWiseTrackContentDetails(this.pagination);
  }

  setPage(event:any) {
		this.pagination.pageIndex = event.page;
		this.getTypeWiseTrackContentDetails(this.pagination);
	}  

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  viewAnalytics(partnerCompanyId: any) {
    this.notifyShowDetailedAnalytics.emit(partnerCompanyId);
    this.referenseService.goToTop(); 
  }
  getClassForStatus(status: string) {
    if (status === 'SUBMITTED') {
      return 'submitted-class';
    } else if (status === 'VIEWED') {
      return 'viewed-class';
    } else if (status === 'NOT OPENED') {
      return 'notOpened-class';
    } else if (status === 'OPENED') {
      return 'opened-class';
    } else if (status === 'DOWNLOADED') {
      return 'downloaded-class';
    } else {
      return 'default-class';
    }
  }
  getTypeWiseTrackContentDetails(pagination : Pagination){
    if(!this.isTeamMemberAnalytics){
      this.getTypeWiseTrackContentDetailsForPartnerJourney(this.pagination);
    }else{
      this.getTypeWiseTrackContentDetailsForTeamMember(this.pagination);
    }
  }
}

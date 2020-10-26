import { Component, OnInit } from '@angular/core';
import { DamService } from '../services/dam.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { DamAnalyticsTilesDto } from '../models/dam-analytics-tiles-dto';
declare var $, swal: any;

@Component({
  selector: 'app-dam-analytics',
  templateUrl: './dam-analytics.component.html',
  styleUrls: ['./dam-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class DamAnalyticsComponent implements OnInit {
  loading = false;
  loggedInUserId: number = 0;
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserCompanyId: any;
  analyticsLoader: HttpRequestLoader = new HttpRequestLoader();
  tilesLoader = false;
  tileClass = "col-sm-4 col-xs-8 col-lg-4 col-md-4";
  damAnalyticsTilesDto: DamAnalyticsTilesDto = new DamAnalyticsTilesDto();
  selectedAnalyticsTypeIndex = 0;
  dataFound = false;
  constructor(private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.callApis();
  }

  callApis(){
    this.startLoaders();
    this.pagination.campaignId = parseInt(this.route.snapshot.params['damPartnerId']);
    this.getTilesInfo();
  }

  getTilesInfo(){
    this.tilesLoader = true;
    this.damService.getDamAnalyticsTilesInfo(this.pagination.campaignId).
    subscribe((response)=>{
      this.damAnalyticsTilesDto = response.data;
      if(this.damAnalyticsTilesDto!=undefined){
        this.dataFound = true;
        let fullName = this.damAnalyticsTilesDto.fullName;
        if(fullName!=undefined && fullName!="" && fullName!=null){
          this.damAnalyticsTilesDto.circleAlphabet = fullName.slice(0,1);
          }else{
          this.damAnalyticsTilesDto.circleAlphabet = this.damAnalyticsTilesDto.emailId.slice(0,1);
          }
          this.tilesLoader = false;
          this.stopLoaders();
      }else{
        this.dataFound = false;
        this.referenceService.showSweetAlertErrorMessage("No Data Found");
        this.goBack();
      }
      
    },(error)=>{
      this.xtremandLogger.log(error);
			this.xtremandLogger.errorPage(error);
    },
    () => {
      if(this.dataFound){
        this.listAnalytics(this.pagination);
      }
    }
    );
  }

  listAnalytics(pagination: Pagination) {
		this.referenceService.goToTop();
		this.startLoaders();
		this.damService.listDamAnalytics(pagination).subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
				pagination.totalRecords = data.totalRecords;
				let damAnalytics = data.list;
				$.each(damAnalytics,function(_index:number,damAnalyticsDto:any){
					damAnalyticsDto.displayTime = new Date(damAnalyticsDto.actionTimeInUTCString);
				});
				pagination = this.pagerService.getPagedItems(pagination, damAnalytics);
			}
			this.stopLoaders();
		}, error => {
			this.xtremandLogger.log(error);
			this.xtremandLogger.errorPage(error);
		});
  }

   /********************Pagaination&Search Code*****************/
  /*************************Search********************** */
  searchAnalytics() {
    this.getAllFilteredResults();
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults();
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listAnalytics(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
	 this.listAnalytics(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchAnalytics(); } }
  /********************Pagaination&Search Code*****************/
  
  filterAnalytics(type: string, index: number) {
    this.selectedAnalyticsTypeIndex = index;//This is to highlight the tab
    this.pagination.pageIndex = 1;
    this.pagination.filterKey = type;
    this.listAnalytics(this.pagination);
}

  startLoaders() {
		this.loading = true;
		this.referenceService.loading(this.analyticsLoader, true);
	}
	stopLoaders() {
		this.loading = false;
		this.tilesLoader = false;
		this.referenceService.loading(this.analyticsLoader, false);
  }
  goBack(){
    this.loading = true;
    this.referenceService.goToRouter("/home/dam/shared");
  }
  refreshPage(){
    this.callApis();
  }

}

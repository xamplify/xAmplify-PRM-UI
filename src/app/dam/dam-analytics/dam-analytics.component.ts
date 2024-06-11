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
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
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
  vendorView = false;
  damId:number = 0;
  selecteAssetDetails:any;
  selectedAssetName = "";
  initLoader = false;
  partnerId:number = 0;
  viewOrDownloadText = "View / Download";
  /******XNFR-169********/
  viewType: string;
  categoryId: number;
  folderViewType: string;
  folderListView = false;
  partnerModuleCustomName = "";
  constructor(private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
    /****XNFR-169****/
    this.viewType = this.route.snapshot.params['viewType'];
		this.categoryId = this.route.snapshot.params['categoryId'];
		this.folderViewType = this.route.snapshot.params['folderViewType'];
    this.partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    if(this.folderViewType=="fl"){
			this.folderListView = true;
		}
  }

  ngOnInit() {
    this.initLoader = true;
    this.callApis();
  }

  callApis(){
    this.startLoaders();
    this.vendorView = this.router.url.indexOf('vda')>-1;
    let decodedDamPartnerId = this.referenceService.decodePathVariable(this.route.snapshot.params['damPartnerId']);
    this.pagination.campaignId = parseInt(decodedDamPartnerId);
    if(this.vendorView){
      let encodedDamId =  this.referenceService.decodePathVariable(this.route.snapshot.params['damId']);
      this.damId = parseInt(encodedDamId);
      let encodedPartnerId = this.referenceService.decodePathVariable(this.route.snapshot.params['partnerId']);
      this.partnerId = parseInt(encodedPartnerId);
      this.getTilesInfo();
    }else{
      this.checkDamPartnerId();
    }
   
  }

  checkDamPartnerId(){
    this.referenceService.goToTop();
		this.startLoaders();
		this.damService.checkDamPartnerId(this.pagination.campaignId).subscribe((result: any) => {
			if (result.statusCode === 200) {
        this.getTilesInfo();
			}else{
        this.referenceService.goToPageNotFound();
      }
		}, error => {
			this.xtremandLogger.log(error);
			this.xtremandLogger.errorPage(error);
		});
  }

  checkDamAndPartnerId(){
    this.referenceService.goToTop();
    this.damService.checkDamIdAndPartnerId(this.damId,this.partnerId).
      subscribe((result: any) => {
			if (result.statusCode === 200) {
        this.getTilesInfo();
			}else{
        this.referenceService.goToPageNotFound();
      }
		}, error => {
			this.xtremandLogger.log(error);
			this.xtremandLogger.errorPage(error);
		});
  }

  getTilesInfo(){
    this.tilesLoader = true;
    if(this.vendorView){
      this.pagination.userId = this.partnerId;
    }else{
      this.pagination.userId = this.authenticationService.getUserId();
    }
    this.damService.getDamAnalyticsTilesInfo(this.pagination).
    subscribe((response)=>{
      this.damAnalyticsTilesDto = response.data.tilesInfo;
      if(this.damAnalyticsTilesDto!=undefined){
        this.selectedAssetName = response.data.assetName;
        this.dataFound = true;
        let contactCompany = this.damAnalyticsTilesDto.contactCompany;
        if(contactCompany!=undefined && contactCompany!="" && contactCompany!=null){
          this.damAnalyticsTilesDto.circleAlphabet = contactCompany.slice(0,1);
          }else{
            if(this.damAnalyticsTilesDto.emailId!="" && this.damAnalyticsTilesDto.emailId!=null){
              this.damAnalyticsTilesDto.circleAlphabet = this.damAnalyticsTilesDto.emailId.slice(0,1);
            }
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
    if(this.vendorView){
      this.pagination.partnerId = this.partnerId;
    }else{
      this.pagination.partnerId = this.authenticationService.getUserId();
    }
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
    if(this.selectedAnalyticsTypeIndex==0){
      this.viewOrDownloadText = "View / Download";
    }else if(this.selectedAnalyticsTypeIndex==1){
      this.viewOrDownloadText = "View";
    }else if(this.selectedAnalyticsTypeIndex==2){
      this.viewOrDownloadText = "Download";
    }
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
    this.initLoader = false;
  }
  goBack(){
    this.loading = true;
    if(this.router.url.indexOf("vda")>-1){
      let url = "/home/dam/partner-analytics/"+this.referenceService.encodePathVariable(this.damId)+"/"+this.referenceService.encodePathVariable(this.pagination.campaignId);
      this.referenceService.navigateToRouterByViewTypes(url,this.categoryId,this.viewType,this.folderViewType,this.folderListView);
    }else{
      this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,!this.vendorView);
    }
  }
  refreshPage(){
    this.callApis();
  }
  goToDam(){
    this.loading = true;
    this.referenceService.navigateToManageAssetsByViewType(this.folderViewType,this.viewType,this.categoryId,!this.vendorView);
  }

  goBackToPartnerCompanies(){
    let prefixUrl = RouterUrlConstants['home']+RouterUrlConstants['dam']+RouterUrlConstants['damPartnerCompanyAnalytics'];
    let url = prefixUrl+this.referenceService.encodePathVariable(this.damId);
    this.referenceService.navigateToRouterByViewTypes(url, this.categoryId, this.viewType, this.folderViewType, this.folderListView);
  }

}

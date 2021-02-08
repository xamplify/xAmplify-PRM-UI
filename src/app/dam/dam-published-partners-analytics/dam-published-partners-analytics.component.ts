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
declare var $, swal: any;

@Component({
  selector: 'app-dam-published-partners-analytics',
  templateUrl: './dam-published-partners-analytics.component.html',
  styleUrls: ['./dam-published-partners-analytics.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties]
})
export class DamPublishedPartnersAnalyticsComponent implements OnInit {
	
  loading = false;
  loggedInUserId: number = 0;
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserCompanyId: any;
  listLoader:HttpRequestLoader = new HttpRequestLoader();
  damId:number = 0;
  selectedAssetName: any;
  initLoader = false;
  statusCode=200;
   constructor(private route: ActivatedRoute, private utilService: UtilService, public sortOption: SortOption, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.initLoader = true;
    this.loading = true;
    this.damId = parseInt(this.route.snapshot.params['damId']);
    this.referenceService.loading(this.listLoader, true);
    this.getCompanyId();
  }

  getCompanyId() {
    if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
      this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
        (result: any) => {
          if (result !== "") {
            this.loggedInUserCompanyId = result;
          } else {
            this.stopLoaders();
            this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
            this.router.navigate(["/home/dashboard"]);
          }
        }, (error: any) => {
          this.stopLoaders();
          this.xtremandLogger.log(error);
          this.xtremandLogger.errorPage(error);
        },
        () => {
          this.getAssetDetailsById();
        }
      );
    } else {
      this.stopLoaders();
      this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
      this.router.navigate(["/home/dashboard"]);
    }

  }

  getAssetDetailsById(){
    this.loading = true;
    this.referenceService.loading(this.listLoader, true);
    this.damService.getAssetDetailsById(this.damId).subscribe((result: any) => {
      this.statusCode = result.statusCode;
      if(this.statusCode==200){
        let data = result.data;
        this.selectedAssetName = data.assetName;
      }else{
        this.referenceService.goToPageNotFound();
      }
      
    }, error => {
      this.loading = false;
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    }, ()=>{
      if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0 && this.statusCode==200) {
        this.pagination.vendorCompanyId = this.loggedInUserCompanyId;
        this.pagination.formId = this.damId;
        this.listPartners(this.pagination);
      }
    });
  }

  listPartners(pagination: Pagination) {
    this.referenceService.goToTop();
    this.loading = true;
    this.referenceService.loading(this.listLoader, true);
    this.damService.listPublishedPartnersAnalytics(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
      }else{
        this.referenceService.goToPageNotFound();
      }
      this.loading = false;
      this.initLoader = false;
      this.referenceService.loading(this.listLoader, false);
    }, error => {
      this.loading = false;
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.publishedPartnerAnalyticsSortOption = text;
    this.getAllFilteredResults();
  }


  /*************************Search********************** */
  searchPartners() {
    this.getAllFilteredResults();
  }


  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listPartners(this.pagination);
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.publishedPartnerAnalyticsSortOption, this.pagination);
    this.listPartners(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }
  /********************Pagaination&Search Code*****************/

  stopLoaders() {
    this.loading = false;
    this.referenceService.loading(this.listLoader, false);
    this.initLoader = false;
  }


goBack(){
  this.loading = true;
	this.referenceService.goToRouter("/home/dam/manage");
}

refreshPage(){
	this.listPartners(this.pagination);
}

viewDetailedAnalytics(partner:any){
  this.loading = true;
  this.referenceService.goToRouter("/home/dam/vda/"+this.damId+"/"+partner.damPartnerId);
}


}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {VanityLoginDto} from '../../util/models/vanity-login-dto';
import {MdfRequestTiles} from '../models/mdf-request-tiles';
import {MdfRequestVendorDto} from '../models/mdf-request-vendor-dto';
/*****Common Imports**********************/
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
import { MdfService } from '../services/mdf.service';
declare var $: any;
/********************************************************* */
@Component({
  selector: 'app-manage-mdf-requests',
  templateUrl: './manage-mdf-requests.component.html',
  styleUrls: ['./manage-mdf-requests.component.css','../mdf-html/mdf-html.component.css'],
  providers: [HttpRequestLoader, SortOption,Properties]

})
export class ManageMdfRequestsComponent implements OnInit,OnDestroy {

  loggedInUserId: number=0;
  loggedInUserCompanyId:number = 0;
  loading = false;
  tilesLoader = false;
  tileData:any;
  customResponse: CustomResponse = new CustomResponse();
  isPartnerView = false;
  listLoader: HttpRequestLoader = new HttpRequestLoader();
  vendorTilesClass = "col-sm-3 col-xs-6 col-lg-3 col-md-3";
  partnerTilesClass = "col-sm-4 col-xs-6 col-lg-4 col-md-4";
  tileClass: string = "";
  vanityLoginDto:VanityLoginDto = new VanityLoginDto();
  role: string="";
  pagination:Pagination = new Pagination();
  mdfRequestTiles:MdfRequestTiles = new MdfRequestTiles();
  vendors:Array<MdfRequestVendorDto> = new Array<MdfRequestVendorDto>();
  showMdfFormAnalyticsForParnterView  = false;
  vendorCompanyId:number = 0;
  partnershipId:number = 0;
  mdfRequestVendorDto: MdfRequestVendorDto = new MdfRequestVendorDto();
  vanityLogin = false;
  constructor(private utilService: UtilService, public sortOption: SortOption, private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties,private route:ActivatedRoute) {
    this.loggedInUserId = this.authenticationService.getUserId();
     this.vanityLoginDto.userId = this.loggedInUserId; 
    if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
      this.vanityLogin = true;
    }
    if(this.referenceService.isCreated){
      this.customResponse = new CustomResponse('SUCCESS','Request Saved Successfully',true);
    }
   }


  ngOnInit() {
    this.loading  = true;
    this.tilesLoader = true;
    this.referenceService.loading(this.listLoader, true);
    this.role = this.route.snapshot.params['role'];
    if(this.role!=undefined && this.role=="p"){
      this.isPartnerView = true;
      this.tileClass = this.partnerTilesClass;
    }else{
      this.isPartnerView = false;
      this.tileClass = this.vendorTilesClass;
    }
    this.getCompanyId();
  }

  stopLoaders(){
    this.loading  = false;
    this.tilesLoader = false;
    this.referenceService.loading(this.listLoader, false);
  }
  
  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.loggedInUserCompanyId = result;
        }else{
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => {
         this.xtremandLogger.log(error);
         this.xtremandLogger.errorPage(error);
         },
      () => {
        if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          if(this.isPartnerView){
            this.pagination.partnerCompanyId = this.loggedInUserCompanyId;
            if(this.vanityLogin){
              this.pagination.vanityUrlFilter  = this.vanityLoginDto.vanityUrlFilter;
              this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
              this.listVendors(this.pagination);
            }else{
              this.getTilesInfoForPartner();
              this.listVendors(this.pagination);
            }
            
          }else{
            this.pagination.vendorCompanyId = this.loggedInUserCompanyId;
            this.getTilesInfoForVendor();
          }
        }
      }
    );
  }
  
  getTilesInfoForPartner() {
    this.tilesLoader = true;
    this.loading = true;
    this.mdfService.getMdfRequestTilesInfoForPartners(this.vanityLoginDto).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
         this.loading = false;
         this.mdfRequestTiles = result.data;
      }
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }
  listVendors(pagination:Pagination) {
    this.loading = true;
    this.referenceService.loading(this.listLoader, true);
    this.mdfService.listMdfAccessVendors(this.pagination).subscribe((result: any) => {
      let data = result.data;
      pagination.totalRecords = data.totalRecords;
      pagination = this.pagerService.getPagedItems(pagination, data.vendors);
      if(this.vanityLogin){
        this.viewRequests(data.vendors[0]);
      }
      this.loading = false;
      this.referenceService.loading(this.listLoader, false);
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }
  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.mdfVendorsSortOption = text;
    this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  searchVendors() {
    this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listVendors(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.mdfVendorsSortOption, this.pagination);
    this.listVendors(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchVendors(); } }
  /********************Pagaination&Search Code*****************/

  getTilesInfoForVendor() {
    this.mdfService.getMdfRequestTilesInfoForVendors(this.vanityLoginDto).subscribe((result: any) => {
      this.tilesLoader = false;
      this.loading = false;
      this.mdfRequestTiles = result.data;
    }, error => {
      this.xtremandLogger.errorPage(error);
    });
  }

  /****Add Request***** */
  goToAddRequest(vendorCompanyId:number){
    this.referenceService.goToRouter("/home/mdf/create-request/"+vendorCompanyId);
  }

  viewRequests(mdfRequestVendorDto:MdfRequestVendorDto){
    this.showMdfFormAnalyticsForParnterView = true;
    this.mdfRequestVendorDto = mdfRequestVendorDto;
    this.vanityLoginDto.vendorCompanyProfileName =mdfRequestVendorDto.companyProfileName;
    this.vanityLoginDto.vanityUrlFilter = true;
    this.tileClass = this.vendorTilesClass;
    this.getTilesInfoForPartner();
    this.vendorCompanyId = mdfRequestVendorDto.companyId;
    this.partnershipId = mdfRequestVendorDto.partnershipId;
    this.referenceService.goToTop();
    
  }
  goToManageRequest(){
    this.showMdfFormAnalyticsForParnterView = false;
    this.mdfRequestVendorDto = new MdfRequestVendorDto();
    this.vanityLoginDto.vendorCompanyProfileName ="";
    this.vanityLoginDto.vanityUrlFilter = false;
    this.tileClass = this.partnerTilesClass;
    this.getTilesInfoForPartner();
    this.vendorCompanyId =0;
    this.partnershipId = 0;
  }

  ngOnDestroy() {
    this.referenceService.isCreated = false;
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { ActivatedRoute } from '@angular/router';
import {VanityLoginDto} from '../../util/models/vanity-login-dto';
import {MdfRequestTiles} from '../models/mdf-request-tiles'
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
import {ErrorResponse} from 'app/util/models/error-response';
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
  partnerListLoader: HttpRequestLoader = new HttpRequestLoader();
  vendorTilesClass = "col-sm-3 col-xs-6 col-lg-3 col-md-3";
  partnerTilesClass = "col-sm-4 col-xs-6 col-lg-4 col-md-4";
  tileClass: string = "";
  vanityLoginDto:VanityLoginDto = new VanityLoginDto();
  role: string="";
  pagination:Pagination = new Pagination();
  mdfRequestTiles:MdfRequestTiles = new MdfRequestTiles();
  constructor(private utilService: UtilService, public sortOption: SortOption, private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties,private route:ActivatedRoute) {
    this.loggedInUserId = this.authenticationService.getUserId();
     this.vanityLoginDto.userId = this.loggedInUserId; 
    if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
      }
    if(this.referenceService.isCreated){
      this.customResponse = new CustomResponse('SUCCESS','Request Saved Successfully',true);
    }
   }


  ngOnInit() {
    this.loading  = true;
    this.tilesLoader = true;
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
          this.pagination.vendorCompanyId = this.loggedInUserCompanyId;
          if(this.isPartnerView){
            this.getTilesInfoForPartner();
          }else{
            this.getTilesInfoForVendor();
          }
         // this.listMdfRequests(this.pagination);
        }
      }
    );
  }
  
  getTilesInfoForPartner() {
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

  getTilesInfoForVendor() {
    this.mdfService.getMdfRequestTilesInfoForVendors(this.vanityLoginDto).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.tilesLoader = false;
        this.loading = false;
        this.tileData = result.data;
     }
    }, error => {
      console.log(error);
      this.xtremandLogger.errorPage(error);
    });
  }

  ngOnDestroy() {
    this.referenceService.isCreated = false;
  }

}

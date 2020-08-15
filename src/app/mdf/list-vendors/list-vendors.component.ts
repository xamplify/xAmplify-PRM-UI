import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
@Component({
  selector: 'app-list-vendors',
  templateUrl: './list-vendors.component.html',
  styleUrls: ['./list-vendors.component.css','../html-sample/html-sample.component.css'],
  providers: [HttpRequestLoader, SortOption,Properties]
})
export class ListVendorsComponent implements OnInit {

  loading = false;
  loggedInUserCompanyId: number=0;
  loggedInUserId: number=0;
  customResponse: CustomResponse = new CustomResponse();
  listLoader: HttpRequestLoader  = new HttpRequestLoader();
  vendorsList:Array<any> = new Array<any>();
  constructor(private utilService: UtilService,public sortOption: SortOption,private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

   ngOnInit() {
    this.loading  = true;
    this.getCompanyId();
   
 }

  getCompanyId() {
   this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
     (result: any) => {
       if (result !== "") { 
         this.loggedInUserCompanyId = result;
       }else{
         this.loading = false;
         this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
         this.router.navigate(["/home/dashboard"]);
       }
     }, (error: any) => { this.xtremandLogger.log(error); },
     () => {
       if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          this.listVendors();
       }
     }
   );
 }
 
 listVendors() {
  this.loading = true;
  this.referenceService.loading(this.listLoader, true);
  this.mdfService.listMdfAccessVendorCompanyDetailsByPartnerCompanyId(this.loggedInUserCompanyId).subscribe((result: any) => {
    if (result.statusCode === 200) {
      this.vendorsList = result.data;
      if(this.vendorsList.length==0){
        this.customResponse = new CustomResponse('INFO','No data found',true);
      }
    }else{
      this.customResponse = new CustomResponse('INFO','No data found',true);
    }
    this.loading = false;
    this.referenceService.loading(this.listLoader, false);
  }, error => {
    this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
  });
}

goToMangeMdfRequests(){
  this.loading = true;
  this.router.navigate(["/home/mdf/requests/p"]);
}
}

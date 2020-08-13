import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { MdfFunds } from '../models/mdf.funds';
import { MdfCreditTransaction } from '../models/mdf.credit.history';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-mdf-funds',
  templateUrl: './manage-mdf-funds.component.html',
  styleUrls: ['./manage-mdf-funds.component.css','../html-sample/html-sample.component.css']
})
export class ManageMdfFundsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  mdfCreditTransaction: MdfCreditTransaction = new MdfCreditTransaction();
  mdfFundsPartnersInfoList: Array<MdfFunds> = new Array<MdfFunds>();
  vendorCompanyId: number;
  loggedInUserId: number=0;
  loading = false;
  tilesLoader = false;
  tileData:any;
  constructor(private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

   ngOnInit() {
    // this.loading  = true;
     this.getCompanyId();
    
  }

   getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.vendorCompanyId = result;
        }else{
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
          this.router.navigate(["/home/dashboard"]);
        }
      }, (error: any) => { this.xtremandLogger.log(error); },
      () => {
        if(this.vendorCompanyId!=undefined && this.vendorCompanyId>0){
          this.getTilesInfo();
        }

      }
    );
  }

 

  getTilesInfo() {
    this.tilesLoader = true;
    this.mdfService.getMdfFundsAnalyticsForTiles(this.vendorCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
         this.tileData = result.data;
        //this.getAllMdfFunds(this.pagination);
      }
    }, error => {
      console.log(error);
    });
  }

  getAllMdfFunds(pagination: Pagination) {
    this.mdfService.getMdfFundsAnalyticsForPagination(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        pagination.totalRecords = result.totalRecords;
        this.mdfFundsPartnersInfoList = result.data;
        pagination = this.pagerService.getPagedItems(pagination, this.mdfFundsPartnersInfoList);
      }
    }, error => {
      console.log(error);
    });
  }

  addCreditTransaction() {
    this.mdfService.addCreditTransaction(this.mdfCreditTransaction).subscribe((result: any) => {
      if (result.statusCode === 200) {
      }
    }, error => {
      console.log(error);
    });
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllMdfFunds(this.pagination);
  }
}

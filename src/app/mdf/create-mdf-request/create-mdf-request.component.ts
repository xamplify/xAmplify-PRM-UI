import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdfService } from '../services/mdf.service';
import { MdfRequest } from '../models/mdf.request';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
@Component({
  selector: 'app-create-mdf-request',
  templateUrl: './create-mdf-request.component.html',
  styleUrls: ['./create-mdf-request.component.css'],
  providers: [HttpRequestLoader,Properties]
})
export class CreateMdfRequestComponent implements OnInit {

  loggedInUserId: number=0;
  loading = false;
  tilesLoader = false;
  tileData:any;
  customResponse: CustomResponse = new CustomResponse();
  mdfRequest: MdfRequest = new MdfRequest();
  vendorCompanyId:number = 0;
  loggedInUserCompanyId: number = 0;
  constructor(private mdfService: MdfService,private route: ActivatedRoute,private utilService: UtilService,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loading = true;
    this.vendorCompanyId = this.route.snapshot.params['vendorCompanyId'];
    if(this.vendorCompanyId!=undefined && this.vendorCompanyId>0){
      this.getCompanyId();
    }else{
      this.loading = false;
      this.referenceService.showSweetAlertErrorMessage('Vendor Company Id Not Found');
      this.router.navigate(["/home/dashboard"]);
    }
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
          this.getTilesInfo();
        }
      }
    );
  }


  getTilesInfo() {
    this.tilesLoader = true;
    this.mdfService.getPartnerMdfBalance(this.vendorCompanyId,this.loggedInUserCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
         this.tileData = result.data;
      }
      this.loading = false;
    }, error => {
      this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
    });
  }
  


  goToVendorList(){
    this.loading = true;
    this.router.navigate(["/home/mdf/vendors"]);
  }

  getTi

  getAllMdfRequests() {
    this.mdfService.getAllMdfRequestsForPagination().subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      console.log(error);
    });
  }

  saveMdfRequest() {
    this.mdfService.saveMdfRequest(this.mdfRequest).subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      console.log(error);
    });
  }

  updateMdfRequest() {
    this.mdfService.updateMdfRequest(this.mdfRequest).subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      console.log(error);
    });
  }

}

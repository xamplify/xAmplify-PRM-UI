import { Component, OnInit } from '@angular/core';
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
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
declare var $: any;
@Component({
  selector: 'app-edit-mdit-request',
  templateUrl: './edit-mdit-request.component.html',
  styleUrls: ['./edit-mdit-request.component.css','../html-sample/html-sample.component.css'],
  providers: [HttpRequestLoader, SortOption,Properties]
})
export class EditMditRequestComponent implements OnInit {
  loading = false;
  pageLoader = false;
  loggedInUserId: number=0;
  loggedInUserCompanyId: number = 0;
  mdfId: number=0;
  rightCornerData : any;
  constructor(private mdfService: MdfService, private pagerService: PagerService,private route: ActivatedRoute,private utilService: UtilService,public sortOption: SortOption,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.loading = true;
    this.pageLoader = true;
    this.mdfId = this.route.snapshot.params['mdfId'];
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
          this.loadRightSideCornerData();
        }
      }
    );
  }

  loadRightSideCornerData(){
    this.mdfService.getMdfRequestsOwnerAndOtherDetails(this.loggedInUserCompanyId,this.mdfId).
    subscribe((result: any) => {
        this.rightCornerData = result.data;
        console.log(this.rightCornerData);
        this.loading = false;
        this.pageLoader  = false;
    }, error => {
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    },
    () => {
    }
    );
  }

  goToManageMdfRequests(){
    this.loading = true;
    this.router.navigate(["/home/mdf/requests"]);
  }

}

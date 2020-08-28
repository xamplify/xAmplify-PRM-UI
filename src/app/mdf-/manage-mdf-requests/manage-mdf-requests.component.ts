import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { ActivatedRoute } from '@angular/router';
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
export class ManageMdfRequestsComponent implements OnInit {

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


  constructor(private utilService: UtilService, public sortOption: SortOption, private mdfService: MdfService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if(this.referenceService.isCreated){
      this.customResponse = new CustomResponse('SUCCESS','Request Saved Successfully',true);
    }
   }


  ngOnInit() {
  }

}

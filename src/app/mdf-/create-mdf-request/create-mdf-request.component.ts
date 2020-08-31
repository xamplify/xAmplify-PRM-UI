import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import {ErrorResponse} from 'app/util/models/error-response';
import { MdfService } from '../services/mdf.service';
import { Form } from 'app/forms/models/form';
import { FormSubmit } from 'app/forms/models/form-submit';
import { FormSubmitField } from 'app/forms/models/form-submit-field';
import { ColumnInfo } from 'app/forms/models/column-info';
import { FormOption } from 'app/forms/models/form-option';
import { FormService } from 'app/forms/services/form.service';
declare var $: any;

@Component({
  selector: 'app-create-mdf-request',
  templateUrl: './create-mdf-request.component.html',
  styleUrls: ['./create-mdf-request.component.css','../mdf-html/mdf-html.component.css'],
  providers: [HttpRequestLoader,Properties]

})
export class CreateMdfRequestComponent implements OnInit {

  loading = true;
  tilesLoader = false;
  loggedInUserId:number = 0;
  loggedInUserCompanyId:number = 0;
  @Input() vendorCompanyId:number;
  constructor(private mdfService: MdfService,private route: ActivatedRoute,private utilService: UtilService,public authenticationService: AuthenticationService,public xtremandLogger: XtremandLogger,public referenceService: ReferenceService,private router: Router,public properties:Properties,private formService:FormService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loading = true;
    this.tilesLoader = true;
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
          this.getTilesInfo();
        }
      }
    );
  }


  getTilesInfo() {
    this.tilesLoader = true;
    this.mdfService.getPartnerMdfAmountTilesInfo(this.vendorCompanyId,this.loggedInUserCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
         this.tilesLoader = false;
      }
    }, error => {
      this.xtremandLogger.log(error);
    this.xtremandLogger.errorPage(error);
    });
  }

}

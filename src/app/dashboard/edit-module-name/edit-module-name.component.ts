import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Router,ActivatedRoute } from '@angular/router';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import {ModuleCustomName} from "../models/module-custom-name";
import { RegularExpressions } from 'app/common/models/regular-expressions';
declare var swal: any, $: any;

@Component({
  selector: 'app-edit-module-name',
  templateUrl: './edit-module-name.component.html',
  styleUrls: ['./edit-module-name.component.css'],
  providers: [HttpRequestLoader, Properties,RegularExpressions]
})
export class EditModuleNameComponent implements OnInit {

  loading = false;
  customResponse:CustomResponse = new CustomResponse();
  public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId:number = 0;
  companyId:number = 0;
  moduleCustomName:ModuleCustomName = new ModuleCustomName();
  disableButton = false;
  errorMessage  = "";
  constructor(public properties: Properties, public dashboardService: DashboardService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public router: Router,public xtremandLogger:XtremandLogger,
    public route:ActivatedRoute,public regularExpressions:RegularExpressions) {
      this.loggedInUserId = this.authenticationService.getUserId();
      if(this.loggedInUserId!=1){
        this.referenceService.goToAccessDeniedPage();
      }
     }

  ngOnInit() {
    this.companyId = this.route.snapshot.params['companyId'];
    this.findPartnerModuleByCompanyId();
  }

  goToAdminReport() {
    this.router.navigate(["/home/dashboard/admin-report"]);
  }

  findPartnerModuleByCompanyId(){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.dashboardService.findPartnerModuleByCompanyId(this.companyId).
    subscribe(
      response=>{
        this.referenceService.stopLoader(this.httpRequestLoader);
        this.moduleCustomName = response.data;
      },error=>{
        this.xtremandLogger.errorPage(error);
      }

    );
  }

  validateCustomName(moduleCustomName:ModuleCustomName){
    this.disableButton = false;
    this.errorMessage = "";
    let customName = $.trim(moduleCustomName.customName);
    if(customName.length>0){
      let isValidName = this.regularExpressions.ALPHABETS_PATTERN.test(customName);
      if(isValidName){
        this.disableButton = false;
      }else{
        this.disableButton = true;
        this.errorMessage = "Invalid name";
      }
    }else{
      this.disableButton = true;
      this.errorMessage = "Please enter name";
    }
    
  }

  update(){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.dashboardService.updateModuleName(this.moduleCustomName)
    .subscribe(
        response=>{
          this.customResponse = new CustomResponse('SUCCESS',response.message,true);
          this.referenceService.stopLoader(this.httpRequestLoader);
        },error=>{
          this.xtremandLogger.errorPage(error);
        }
    );
  }

}

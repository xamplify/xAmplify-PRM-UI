import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Router,ActivatedRoute } from '@angular/router';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

declare var swal: any, $: any;

@Component({
  selector: 'app-edit-module-name',
  templateUrl: './edit-module-name.component.html',
  styleUrls: ['./edit-module-name.component.css'],
  providers: [HttpRequestLoader, Properties]
})
export class EditModuleNameComponent implements OnInit {

  loading = false;
  customResponse:CustomResponse = new CustomResponse();
  public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loggedInUserId:number = 0;
  companyId:number = 0;
  customModuleNames:Array<any> = new Array<any>();
  constructor(public properties: Properties, public dashboardService: DashboardService, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public router: Router,public xtremandLogger:XtremandLogger,public route:ActivatedRoute) {
      this.loggedInUserId = this.authenticationService.getUserId();
      if(this.loggedInUserId!=1){
        this.referenceService.goToAccessDeniedPage();
      }
     }

  ngOnInit() {
    this.companyId = this.route.snapshot.params['companyId'];
    this.findCustomModuleNames();
  }

  goToAdminReport() {
    this.router.navigate(["/home/dashboard/admin-report"]);
  }

  findCustomModuleNames(){
    this.referenceService.startLoader(this.httpRequestLoader);
    this.dashboardService.findCustomModuleNames(this.companyId).
    subscribe(
      response=>{
        this.referenceService.stopLoader(this.httpRequestLoader);
        this.customModuleNames = response.data;
      },error=>{
        this.xtremandLogger.errorPage(error);
      }

    );
  }

}

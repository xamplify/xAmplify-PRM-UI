import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../services/util.service';
import { LmsService } from 'app/lms/services/lms.service';
@Component({
  selector: 'app-select-content-modules',
  templateUrl: './select-content-modules.component.html',
  styleUrls: ['./select-content-modules.component.css'],
  providers: [ HttpRequestLoader, LmsService],
})
export class SelectContentModulesComponent implements OnInit {

  loading = false;
  prefixUrl = "home/";
  searchWithModuleName:any;
  loadModules:boolean = false;
  loggedInUserId: any;
  contentCounts: any;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  vendorCompanyProfileName: string = null;
  
  constructor(public router:Router,public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger, public utilService: UtilService, private lmsService:LmsService) {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
    }
     }

  ngOnInit() {
    this.searchWithModuleName = 4;
    this.loadModules = true;
    setTimeout(() => {
      this.loadModules = false;
      }, 5000);
      this.getContentCounts();
  }
  navigate(suffixUrl:string){
    this.loading = true;
    this.referenceService.universalModuleType = "";
    this.utilService.searchKey = "";
    this.referenceService.goToRouter(this.prefixUrl+suffixUrl);
  }

    getContentCounts() {
      this.referenceService.loading(this.httpRequestLoader, true);
      this.lmsService.getContentCounts(this.vendorCompanyProfileName).subscribe(
        (response: any) => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (response.statusCode == 200) {
            this.contentCounts = response.map;
          }
        },
        (_error: any) => {
          this.httpRequestLoader.isServerError = true;
          this.xtremandLogger.error(_error);
        }
      );
    }
  

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../services/util.service';
@Component({
  selector: 'app-select-content-modules',
  templateUrl: './select-content-modules.component.html',
  styleUrls: ['./select-content-modules.component.css'],
  providers: [ HttpRequestLoader],
})
export class SelectContentModulesComponent implements OnInit {

  loading = false;
  prefixUrl = "home/";
  searchWithModuleName:any;
  loadModules:boolean = false;
  constructor(public router:Router,public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger, public utilService: UtilService) { }

  ngOnInit() {
    this.searchWithModuleName = 4;
    this.loadModules = true;
    setTimeout(() => {
      this.loadModules = false;
      }, 5000);
  }
  navigate(suffixUrl:string){
    this.loading = true;
    this.referenceService.universalModuleType = "";
    this.utilService.searchKey = "";
    this.referenceService.goToRouter(this.prefixUrl+suffixUrl);
  }

}

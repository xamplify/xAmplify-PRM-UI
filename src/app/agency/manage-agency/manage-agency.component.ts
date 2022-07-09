import { Component, OnInit, ViewChild, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { FileUtil } from '../../core/models/file-util';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { AgencyService } from './../services/agency.service';

@Component({
  selector: 'app-manage-agency',
  templateUrl: './manage-agency.component.html',
  styleUrls: ['./manage-agency.component.css'],
  providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch, Properties]
})
export class ManageAgencyComponent implements OnInit,OnDestroy {
  loader:HttpRequestLoader = new HttpRequestLoader();
  constructor(public agencyService:AgencyService,public logger: XtremandLogger, public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
    private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch,private router: Router, public properties: Properties) {

    }
  ngOnDestroy(): void {
    
  }

  ngOnInit() {
    this.referenceService.loading(this.loader,true);
    setTimeout(() => {
      let agencyAccess = this.authenticationService.module.agencyAccess;
      if(!agencyAccess){
        this.referenceService.goToPageNotFound();
      }else{
          
      }
      this.referenceService.loading(this.loader,false);
    }, 500);
    
  }

}

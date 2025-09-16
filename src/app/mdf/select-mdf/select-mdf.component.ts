import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { LmsService } from 'app/lms/services/lms.service';
@Component({
  selector: 'app-select-mdf',
  templateUrl: './select-mdf.component.html',
  styleUrls: ['./select-mdf.component.css'],
  providers: [ HttpRequestLoader, LmsService],
})
export class SelectMdfComponent implements OnInit {

  loading = false;
  prefixUrl = "home/";
  searchWithModuleName = 8;
  constructor(public router:Router,public authenticationService:AuthenticationService,
    public referenceService:ReferenceService,public xtremandLogger:XtremandLogger, public lmsService:LmsService) { }

  ngOnInit() {
    this.checkAWSCredentials();
  }
  navigate(suffixUrl:string){
    this.loading = true;
    this.referenceService.goToRouter(this.prefixUrl+suffixUrl);
  }

  checkAWSCredentials() {
    this.loading = true;
    this.lmsService.checkAWSCredentials().subscribe(
      (response: any) => {
        this.loading = false;
        if (response.statusCode == 200 && response.data == false) {
          this.referenceService.showAlertForAWSAccess();
        }
      },
      (_error: any) => {
        this.loading = false;
      }, () => {
        this.loading = false;
      }
    );
  }

}

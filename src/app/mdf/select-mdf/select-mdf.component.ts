import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
@Component({
  selector: 'app-select-mdf',
  templateUrl: './select-mdf.component.html',
  styleUrls: ['./select-mdf.component.css'],
  providers: [ HttpRequestLoader]
})
export class SelectMdfComponent implements OnInit {

  loading = false;
  prefixUrl = "home/";
  constructor(public router:Router,public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger) { }

  ngOnInit() {

  }
  navigate(suffixUrl:string){
    this.loading = true;
    this.referenceService.goToRouter(this.prefixUrl+suffixUrl);
  }

}

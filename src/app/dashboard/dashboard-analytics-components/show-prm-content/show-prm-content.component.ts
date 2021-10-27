import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
@Component({
  selector: 'app-show-prm-content',
  templateUrl: './show-prm-content.component.html',
  styleUrls: ['./show-prm-content.component.css'],
  providers: [ HttpRequestLoader]
})
export class ShowPrmContentComponent implements OnInit {

  loading = false;
  prefixUrl = "home/";
  @Input() hideRowClass = false;
  constructor(public router:Router,public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger) { }

  ngOnInit() {

  }
  navigate(suffixUrl:string){
    this.loading = true;
    this.referenceService.goToRouter(this.prefixUrl+suffixUrl);
  }
}

import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';

@Component({
  selector: 'app-active-queries',
  templateUrl: './active-queries.component.html',
  styleUrls: ['./active-queries.component.css'],
  providers: [HttpRequestLoader, Properties]
})
export class ActiveQueriesComponent implements OnInit {

  activeQueries:Array<any> = new Array<any>();
  apiError = false;
  constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader, public authenticationService: AuthenticationService, 
		public logger: XtremandLogger) { }

  ngOnInit() {
    this.findActiveQueries();
  }

  findActiveQueries(){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.apiError = false;
    this.dashboardService.findActiveQueries().
    subscribe(
      response=>{
        this.activeQueries = response.data;
        this.apiError = false;
        this.referenceService.loading(this.httpRequestLoader, false);
      },error=>{
        this.referenceService.loading(this.httpRequestLoader, false);
        this.apiError = true;
      }
    )
  }

}

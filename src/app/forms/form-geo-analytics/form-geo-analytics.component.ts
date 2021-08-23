import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { FormService } from '../services/form.service';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';

@Component({
  selector: 'app-form-geo-analytics',
  templateUrl: './form-geo-analytics.component.html',
  styleUrls: ['./form-geo-analytics.component.css'],
  providers: [Pagination, HttpRequestLoader, FormService]
})
export class FormGeoAnalyticsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();

  constructor(public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public formService: FormService,
    public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService,
    public logger: XtremandLogger) { }

  ngOnInit() {
  }

  search() {
    this.pagination.pageIndex = 1;
   // this.listSubmittedData(this.pagination);
}


eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

refreshList() {
    this.pagination.searchKey = "";
    //this.listSubmittedData(this.pagination);
}
/************Page************** */
setPage(event: any) {
    this.pagination.pageIndex = event.page;
    //this.listSubmittedData(this.pagination);
}

}

import { Component, Input, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { FormService } from '../services/form.service';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { SortOption } from 'app/core/models/sort-option';

@Component({
  selector: 'app-form-geo-analytics',
  templateUrl: './form-geo-analytics.component.html',
  styleUrls: ['./form-geo-analytics.component.css'],
  providers: [Pagination, HttpRequestLoader, FormService]
})
export class FormGeoAnalyticsComponent implements OnInit {

  @Input() alias: any;
  pagination: Pagination = new Pagination();
  customResponse: CustomResponse = new CustomResponse();
  sortOption: SortOption = new SortOption();
  searchKey = "";
  detailedResponse = false;
  selectedFormSubmitId: number;

  constructor(public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public formService: FormService,
    public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService,
    public logger: XtremandLogger) { }

  ngOnInit() {
    this.getGeoAnalytics(this.pagination);
  }

  getGeoAnalytics(pagination: Pagination) {
    pagination.searchKey = this.searchKey;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.formService.getFormGeoAnalytics(pagination, this.alias).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.data);
        } else {
          this.referenceService.goToPageNotFound();
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => { this.logger.errorPage(error); });
  }

  search() {
    this.pagination.pageIndex = 1;
    this.getGeoAnalytics(this.pagination);
  }

  eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }

  refreshList() {
    this.pagination.searchKey = "";
    this.getGeoAnalytics(this.pagination);
  }
  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getGeoAnalytics(this.pagination);
  }


  viewDetailedResponse(formDataRow: any) {
    this.selectedFormSubmitId = formDataRow.formSubmitId;
    this.detailedResponse = true;
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FormService } from '../services/form.service';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component'


declare var swal, $: any;

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css'],
  providers: [Pagination, HttpRequestLoader]
})
export class SelectFormComponent implements OnInit {

  ngxloading = false;
  pagination: Pagination = new Pagination();
  searchKey = "";
  selectedFormTypeIndex = 0;
  @ViewChild('previewPopupComponent') previewPopupComponent: PreviewPopupComponent;

  constructor(public referenceService: ReferenceService,
    public httpRequestLoader: HttpRequestLoader, public pagerService: PagerService, public authenticationService: AuthenticationService,
    public router: Router, public logger: XtremandLogger, public formService: FormService) { }

  ngOnInit() {
    this.selectedFormTypeIndex = 0;
    this.pagination.filterKey = "All";
    this.listDefaultForms(this.pagination);
  }

  showAllForms(type: string, index: number) {
    this.selectedFormTypeIndex = index;
    this.pagination.filterKey = type;
    this.listDefaultForms(this.pagination);
  }

  listDefaultForms(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.formService.listDefaultForms(pagination).subscribe(
      (response: any) => {
          let data = response.data;
          if (response.statusCode == 200) {
            pagination.totalRecords = data.totalRecords;
            pagination = this.pagerService.getPagedItems(pagination, data.forms);
          }
          this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => { this.logger.errorPage(error); });
  }

  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchForms(); } }

  searchForms() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.searchKey;
    this.listDefaultForms(this.pagination);
  }

  setFormsPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listDefaultForms(this.pagination);
  }

  createForm(id: number) {
    let formId = id;
    this.formService.formId = formId;
    this.router.navigate(["/home/forms/add"]);
  }

  ngOnDestroy() {
  }

  previewForm(id: number){
    this.previewPopupComponent.previewForm(id)
  }

  addDefaultForm(){
    this.router.navigate(["/home/forms/add"]);
}

}

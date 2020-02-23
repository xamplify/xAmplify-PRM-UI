import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { Properties } from '../../common/models/properties';
@Component({
  selector: 'app-clicked-urls-vendor-analytics',
  templateUrl: './clicked-urls-vendor-analytics.component.html',
  styleUrls: ['./clicked-urls-vendor-analytics.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption, Properties]
})
export class ClickedUrlsVendorAnalyticsComponent implements OnInit {

  modalPopupId = "clicked-urls-vendor-popup";
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  pagination: Pagination = new Pagination();
  constructor(private campaignService: CampaignService, private referenceService: ReferenceService, private authenticationService: AuthenticationService, public logger: XtremandLogger, public pagerService:
    PagerService, public sortOption: SortOption, public properties: Properties) { }

  ngOnInit() {
  }

  showPopup(campaignId:number) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.referenceService.showModalPopup(this.modalPopupId);
    this.pagination.campaignId = campaignId;
    this.listItems(this.pagination);
  }

  listItems(pagination:Pagination){
    this.referenceService.loading(this.httpRequestLoader, true);
    this.campaignService.listClickedUrlAnalyticsForVendor(this.pagination).subscribe(
      (response: any) => {
        console.log(response);
         const data = response.data;
         pagination.totalRecords = data.totalRecords;
         pagination = this.pagerService.getPagedItems(pagination, data.list);
         this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => { this.referenceService.showSweetAlert(this.properties.serverErrorMessage, "", "error"); this.referenceService.loading(this.httpRequestLoader, false); this.closePopup(); });

  }

  closePopup() {
    this.referenceService.closeModalPopup(this.modalPopupId);
    this.pagination = new Pagination();
    this.sortOption = new SortOption();
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listItems(this.pagination);
  }

  paginationDropdown(items: any) {
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.listItems(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchUrls(); } }

  searchUrls() {
    this.getAllFilteredResults(this.pagination);
  }
}

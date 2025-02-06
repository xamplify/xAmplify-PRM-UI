import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { CampaignService } from 'app/campaigns/services/campaign.service';

declare var $:any;

@Component({
  selector: 'app-campaign-mdf-requests-emails-sent-history',
  templateUrl: './campaign-mdf-requests-emails-sent-history.component.html',
  styleUrls: ['./campaign-mdf-requests-emails-sent-history.component.css'],
  providers: [Properties, SortOption],
  animations: [CustomAnimation]
})
export class CampaignMdfRequestsEmailsSentHistoryComponent implements OnInit, OnDestroy {

  emailsHistoryPagination = new Pagination();
  requestHistoryPagination = new Pagination();
  httpRequestLoader = true;
  customResponse: CustomResponse = new CustomResponse();
  sortOption: SortOption = new SortOption();
  historyLoader = true;
  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService, public pagerService: PagerService,
    public properties: Properties, public utilService: UtilService, public campaignService: CampaignService) { }


  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.closeModal();
  }

  openModalPopup(campaignId: number) {
    this.httpRequestLoader = true;
    this.emailsHistoryPagination = new Pagination();
    this.emailsHistoryPagination.campaignId = campaignId;
    this.customResponse = new CustomResponse();
    this.referenceService.openModalPopup("campaign-mdf-emails-history-modal");
    this.findMdfRequestsByCampaignId(this.emailsHistoryPagination);
  }


  findMdfRequestsByCampaignId(emailsHistoryPagination: Pagination) {
    this.referenceService.scrollToModalBodyTopByClass();
    this.httpRequestLoader = true;
    this.customResponse = new CustomResponse();
    this.campaignService.findMdfRequestsByCampaignId(emailsHistoryPagination).subscribe(
      response => {
        const data = response.data;
        emailsHistoryPagination.totalRecords = data.totalRecords;
        emailsHistoryPagination = this.pagerService.getPagedItems(emailsHistoryPagination, data.list);
        this.httpRequestLoader = false;
      }, error => {
        this.httpRequestLoader = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      });
  }

  navigateHistoryRecordsByPageNumber(event: any) {
    this.emailsHistoryPagination.pageIndex = event.page;
    this.findMdfRequestsByCampaignId(this.emailsHistoryPagination);
  }

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.campaignMdfEmailsHistorySortOption = text;
    this.getAllFilteredResults();
  }

  searchOnKeyPress(keyCode: number) {
    if (keyCode == 13) {
      this.search();
    }
  }


  /*************************Search********************** */
  search() {
    this.getAllFilteredResults();
  }

  getAllFilteredResults() {
    this.emailsHistoryPagination.pageIndex = 1;
    this.emailsHistoryPagination.searchKey = this.sortOption.searchKey;
    this.emailsHistoryPagination = this.utilService.sortOptionValues(this.sortOption.campaignMdfEmailsHistorySortOption, this.emailsHistoryPagination);
    this.findMdfRequestsByCampaignId(this.emailsHistoryPagination);
  }

  viewMoreColumns(history: any) {
    this.historyLoader = false;
    this.requestHistoryPagination = new Pagination();
    this.emailsHistoryPagination.pagedItems.forEach((element) => {
      let id = element.id;
      let clickedId = history.id;
      if (clickedId != id) {
        element.expand = false;
      }
    });
    history.expand = !history.expand;
    if (history.expand) {
      this.historyLoader = true;
      this.requestHistoryPagination.type = history.mdfAlias;
      this.findMdfRequestHistoriesByMdfKey(this.requestHistoryPagination);
    }
  }
  findMdfRequestHistoriesByMdfKey(requestHistoryPagination: Pagination) {
    this.historyLoader = true;
    this.campaignService.findMdfRequestHistoriesByMdfKey(requestHistoryPagination, requestHistoryPagination.type).subscribe(
      response => {
        const data = response.data;
        requestHistoryPagination.totalRecords = data.totalRecords;
        requestHistoryPagination = this.pagerService.getPagedItems(requestHistoryPagination, data.list);
        this.referenceService.scrollSmoothToDiv("history-"+this.requestHistoryPagination.type);
        this.historyLoader = false;
      }, error => {
        this.historyLoader = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      });
  }

  navigateMdfAliasRequestsHistoryByPageNumber(event: any) {
    this.requestHistoryPagination.pageIndex = event.page;
    this.findMdfRequestHistoriesByMdfKey(this.requestHistoryPagination);
  }



  closeModal() {
    this.emailsHistoryPagination = new Pagination();
    this.customResponse = new CustomResponse();
    this.referenceService.closeModalPopup("campaign-mdf-emails-history-modal");
  }

}

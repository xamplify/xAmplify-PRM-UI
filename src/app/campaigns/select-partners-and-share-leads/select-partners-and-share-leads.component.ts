import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { CustomResponse } from 'app/common/models/custom-response';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ParterService } from 'app/partners/services/parter.service';
import { SortOption } from 'app/core/models/sort-option';
declare var $:any;

@Component({
  selector: 'app-select-partners-and-share-leads',
  templateUrl: './select-partners-and-share-leads.component.html',
  styleUrls: ['./select-partners-and-share-leads.component.css'],
  providers:[Properties,HttpRequestLoader,SortOption]
})
export class SelectPartnersAndShareLeadsComponent implements OnInit {

  @Output() selectPartnersAndShareLeadsEmitter = new EventEmitter();
  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  pagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  partnerCompaniesSortOption: SortOption = new SortOption();
  selectedContactListIds = [];
  emptyContactListMessage = "";
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger,
    public pagerService:PagerService,public partnerService:ParterService) { }

  ngOnInit() {
    this.findPartnerCompanies(this.pagination);
  }

  findPartnerCompanies(pagination: Pagination) {
		this.referenceService.startLoader(this.httpRequestLoader);
		this.partnerService.loadPartnerCompanies(pagination,this.authenticationService.getUserId()).
    subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, error => {
      this.xtremandLogger.error(error);
      this.xtremandLogger.errorPage(error);
		}, () => {

		});
	}

  /*************************Search********************** */
	searchPartnerCompanies() {
		this.getAllFilteredResults();
	}

	/************Page************** */
	navigateToNextPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findPartnerCompanies(this.pagination);
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.findPartnerCompanies(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchPartnerCompanies(); } }
}

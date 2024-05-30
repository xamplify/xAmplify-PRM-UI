import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from './../../core/models/http-request-loader';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from 'app/common/models/custom-response';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { DamService } from '../services/dam.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dam-partner-company-analytics',
  templateUrl: './dam-partner-company-analytics.component.html',
  styleUrls: ['./dam-partner-company-analytics.component.css'],
  providers:[Properties,HttpRequestLoader,SortOption]
})
export class DamPartnerCompanyAnalyticsComponent implements OnInit {

  customResponse:CustomResponse = new CustomResponse();
  properties:Properties = new Properties();
  pagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  partnerCompaniesSortOption: SortOption = new SortOption();
  damId:any;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public xtremandLogger:XtremandLogger,public pagerService:PagerService,public damService:DamService,public route:ActivatedRoute) { }

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.damId = atob(this.route.snapshot.params['id']);
    this.findPartnerCompanies(this.pagination);
  }
  findPartnerCompanies(pagination: Pagination) {
		this.damService.findPartnerCompanies(pagination,this.damId).
    	subscribe((result: any) => {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.list);
			this.referenceService.stopLoader(this.httpRequestLoader);
		}, error => {
			this.xtremandLogger.error(error);
			this.xtremandLogger.errorPage(error);
		});
  }

}

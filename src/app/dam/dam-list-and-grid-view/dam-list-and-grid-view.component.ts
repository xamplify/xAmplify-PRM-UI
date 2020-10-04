import { Component, OnInit } from '@angular/core';
import { DamService } from '../services/dam.service';
/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { ErrorResponse } from 'app/util/models/error-response';
declare var $: any;
@Component({
  selector: 'app-dam-list-and-grid-view',
  templateUrl: './dam-list-and-grid-view.component.html',
  styleUrls: ['./dam-list-and-grid-view.component.css'],
providers: [HttpRequestLoader, SortOption, Properties]
})
export class DamListAndGridViewComponent implements OnInit {

 loading = false;
	loggedInUserId: number = 0;
	pagination:Pagination = new Pagination();
	customResponse:CustomResponse = new CustomResponse();
	loggedInUserCompanyId: any;
	constructor(private utilService: UtilService, public sortOption: SortOption, public listLoader: HttpRequestLoader, private damService: DamService, private pagerService: PagerService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}

	ngOnInit() {
		this.loading = true;
		this.getCompanyId();
	}

	getCompanyId() {
		if (this.loggedInUserId != undefined && this.loggedInUserId > 0) {
		  this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
			(result: any) => {
			  if (result !== "") {
				this.loggedInUserCompanyId = result;
			  } else {
				this.stopLoaders();
				this.referenceService.showSweetAlertErrorMessage('Company Id Not Found.Please try aftersometime');
				this.router.navigate(["/home/dashboard"]);
			  }
			}, (error: any) => {
			  this.stopLoaders();
			  this.xtremandLogger.log(error);
			  this.xtremandLogger.errorPage(error);
			},
			() => {
			  if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
				this.pagination.companyId = this.loggedInUserCompanyId;
				this.listAssets(this.pagination);
			  }
			}
		  );
		} else {
		  this.stopLoaders();
		  this.referenceService.showSweetAlertErrorMessage('UserId Not Found.Please try aftersometime');
		  this.router.navigate(["/home/dashboard"]);
		}
	  }

	  stopLoaders(){
		this.loading = false;
		this.referenceService.loading(this.listLoader, false);
	  }
	listAssets(pagination: Pagination) {
		this.referenceService.goToTop();
		this.loading = true;
		this.referenceService.loading(this.listLoader, true);
		this.damService.list(pagination).subscribe((result: any) => {
		  if (result.statusCode === 200) {
			let data = result.data;
			pagination.totalRecords = data.totalRecords;
			pagination = this.pagerService.getPagedItems(pagination, data.assets);
		  }
		  this.loading = false;
		  this.referenceService.loading(this.listLoader, false);
		}, error => {
		  this.loading = false;
		  this.xtremandLogger.log(error);
		  this.xtremandLogger.errorPage(error);
		});
	  }
}

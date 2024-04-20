import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Properties } from '../../common/models/properties';
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
declare var $, swal: any;
@Component({
	selector: 'app-vendor-invitation-report',
	templateUrl: './vendor-invitation-report.component.html',
	styleUrls: ['./vendor-invitation-report.component.css','../admin-report/admin-report.component.css'],
	providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class VendorInvitationReportComponent implements OnInit {

	pagination: Pagination = new Pagination();
	hasError = false;
	selectedFilterIndex = 0;
	loading = false;
	constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption, private utilService: UtilService) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}

	ngOnInit() {
		this.pagination.filterKey = 'invited';
		this.findVendorInvitationReports(this.pagination);
	}

	findVendorInvitationReports(pagination: Pagination) {
		this.hasError = false;
		this.referenceService.loading(this.httpRequestLoader, true);
		this.dashboardService.findVendorInvitationReports(pagination).subscribe(
			(response: any) => {
				const data = response.data;
				pagination.totalRecords = data.totalRecords;
				this.sortOption.totalRecords = data.totalRecords;
				$.each(data.list, function (_index: number, report: any) {
					report.invitedOn = new Date(report.createdTimeInString);
					report.declinedOn = new Date(report.updatedTimeInString);
				});
				pagination = this.pagerService.getPagedItems(pagination, data.list);
				this.referenceService.loading(this.httpRequestLoader, false);
				this.loading = false;
			},
			(error: any) => {
				this.hasError = false;
				this.loading = false;
				this.referenceService.loading(this.httpRequestLoader, false);
			});
	}
	/*************************Search********************** */
	search() {
		this.getAllFilteredResults();
	}

	/************Page************** */
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findVendorInvitationReports(this.pagination);
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.findVendorInvitationReports(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	refreshList() {
		this.pagination.pageIndex = 1;
		this.sortOption.searchKey = "";
		this.pagination.searchKey = "";
		this.findVendorInvitationReports(this.pagination);
	}

	filterInvitations(index: number, type: string) {
		this.selectedFilterIndex = index;
		this.pagination.filterKey = type;
		this.pagination.pageIndex = 1;
		this.findVendorInvitationReports(this.pagination);
	}

	upgrade(report: any) {
		let inviteeRole = report.inviteeRole;
		if (inviteeRole == "Partner") {
			if(report.inviteeCompanyId > 0){
				this.showSweetAlertConfirmation(report.inviteeId);
			}else{
				this.referenceService.showSweetAlert('Company Profile Is Not Created.', '', 'info');
			}
		} else if (inviteeRole == "PRM") {
			this.referenceService.showSweetAlert('PRM cannot be upgraded as Vendor.', '', 'info');
		} else if (inviteeRole == "Vendor" || inviteeRole == "Org Admin" || inviteeRole == "Vendor Tier") {
			this.referenceService.showSweetAlert('Not Available.', '', 'info');
		} else if (inviteeRole == "User" && report.inviteeCompanyId == 0) {
			this.referenceService.goToRouter('/home/dashboard/admin-company-profile/' + report.inviteeEmailId);
		} else if (inviteeRole == "User" && report.inviteeCompanyId > 0) {
			this.referenceService.showSweetAlert('Company Profile Is Not Created.', '', 'info');
		}
	}

	showSweetAlertConfirmation(partnerId:number) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "This account will be upgraded as Vendor",
			type: 'info',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, Upgrade it!'
		}).then(function () {
			self.upgradeAsVendor(partnerId);
		}, function (_dismiss: any) {

		});
	}

	upgradeAsVendor(partnerId:number){
		this.loading = true;
		this.dashboardService.upgradeAsVendor(partnerId).subscribe(
			(response)=>{
				this.referenceService.showSweetAlert('Upgraded Successfully To Vendor.', '', 'info');
				this.findVendorInvitationReports(this.pagination);
			},(error:any)=>{
				this.loading = false;
				this.referenceService.showSweetAlertServerErrorMessage();
			}
		);
	}


}

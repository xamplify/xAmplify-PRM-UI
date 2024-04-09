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
import { CustomResponse } from 'app/common/models/custom-response';
import { ContactService } from 'app/contacts/services/contact.service';

declare var $: any, swal: any;


@Component({
	selector: 'app-processing-user-lists',
	templateUrl: './processing-user-lists.component.html',
	styleUrls: ['./processing-user-lists.component.css', '../admin-report/admin-report.component.css'],
	providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class ProcessingUserListsComponent implements OnInit {

	loading = false;
	hasError: boolean;
	statusCode: any;
	pagination: Pagination = new Pagination();
	processingUserLists: Array<any> = new Array<any>();
	customResponse: CustomResponse = new CustomResponse();

	constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption, private utilService: UtilService,
		public xtremandLogger: XtremandLogger, public properties: Properties,public contactService:ContactService) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}

	ngOnInit() {
		this.getAllFilteredResults();
	}

	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }


	refreshList() {
		this.sortOption.searchKey = "";
		this.getAllFilteredResults();
	}

	findProcessingUserLists(pagination: Pagination) {
		this.hasError = false;
		this.referenceService.loading(this.httpRequestLoader, true);
		this.dashboardService.findProcessingUserLists(pagination).subscribe(
			(response: any) => {
				this.statusCode = response.statusCode;
				if (this.statusCode == 200) {
					const data = response.data;
					pagination.totalRecords = data.totalRecords;
					this.sortOption.totalRecords = data.totalRecords;
					this.processingUserLists = data.list;
				}
				this.referenceService.loading(this.httpRequestLoader, false);
			},
			(error: any) => { this.hasError = true; this.referenceService.loading(this.httpRequestLoader, false); });

	}

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedProcessingUserListsDropDownOption = text;
		this.getAllFilteredResults();
	}


	/*************************Search********************** */
	search() {
		this.getAllFilteredResults();
	}

	getAllFilteredResults() {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedProcessingUserListsDropDownOption, this.pagination);
		this.findProcessingUserLists(this.pagination);
	}

	deleteUserList(userList: any) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to undo this action!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#54a7e9',
			cancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function (myData: any) {
			self.deleteContactList(userList);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}


	deleteContactList(userList: any) {
		this.customResponse = new CustomResponse();
		this.referenceService.loading(this.httpRequestLoader, true);
		this.contactService.deleteContactListFromSuperAdminScreen(userList.userListId,userList.createdUserId)
			.subscribe(
				data => {
					this.referenceService.loading(this.httpRequestLoader, false);
					if (data.access) {
						this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACT_LIST_DELETE_SUCCESS, true);
						this.getAllFilteredResults();
					} else {
						this.authenticationService.forceToLogout();
					}
				},
				(error: any) => {
					if (error._body.includes('Please launch or delete those campaigns first')) {
						this.customResponse = new CustomResponse('ERROR', error._body, true);
					} else {
						this.xtremandLogger.errorPage(error);
					}
					this.referenceService.loading(this.httpRequestLoader, false);
				},
				() => { }
			);
	}

}

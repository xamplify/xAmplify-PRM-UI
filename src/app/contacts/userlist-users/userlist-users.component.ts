import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ContactService } from '../services/contact.service';

@Component({
	selector: 'app-userlist-users',
	templateUrl: './userlist-users.component.html',
	styleUrls: ['./userlist-users.component.css']
})
export class UserlistUsersComponent implements OnInit {

	@Input() public userListId: any;
	@Input() public searchKey: any;

	usersPagination: Pagination = new Pagination();
	usersSortOption: SortOption = new SortOption();
	usersLoader: HttpRequestLoader = new HttpRequestLoader();
	usersCustomResponse: CustomResponse = new CustomResponse();
	emptyListMessage: string = "No Data Found.";

	constructor(public referenceService: ReferenceService, private pagerService: PagerService,
		public properties: Properties, public contactService: ContactService) { }

	ngOnInit() {
		this.usersPagination = new Pagination();
		this.usersPagination.searchKey = this.searchKey;
		this.usersPagination.userListId = this.userListId;
		this.getMatchedContacts(this.usersPagination);
	}

	getMatchedContacts(pagination: Pagination) {
		this.referenceService.loading(this.usersLoader, true);
		this.usersCustomResponse = new CustomResponse();
		this.contactService.findUsersByUserListId(pagination).subscribe(
			response => {
				if (response.statusCode == 200) {
					this.referenceService.loading(this.usersLoader, false);
					pagination.totalRecords = response.data.totalRecords;
					pagination = this.pagerService.getPagedItems(pagination, response.data.list);
					this.usersSortOption.totalRecords = response.data.totalRecords;
					if (pagination.totalRecords == 0) {
						if (pagination.searchKey != "") {
							this.emptyListMessage = "No data found for given search criteria : "+ pagination.searchKey;
						}
					}
				}
			},
			error => {
				this.referenceService.loading(this.usersLoader, false);
				this.usersCustomResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}

	setUsersPage(event: any) {
		this.usersPagination.pageIndex = event.page;
		this.getMatchedContacts(this.usersPagination);
	}

	getAllFilteredResultsUsers(pagination: Pagination) {
		pagination.pageIndex = 1;
		pagination.searchKey = this.usersSortOption.searchKey;
		this.getMatchedContacts(pagination);
	}

}

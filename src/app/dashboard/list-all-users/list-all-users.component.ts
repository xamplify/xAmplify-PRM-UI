import { Component, OnInit,Input } from '@angular/core';
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
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
declare var $:any, swal: any;


@Component({
	selector: 'app-list-all-users',
	templateUrl: './list-all-users.component.html',
	styleUrls: ['./list-all-users.component.css','../admin-report/admin-report.component.css'],
	providers: [Pagination, HttpRequestLoader, Properties, SortOption]

})
export class ListAllUsersComponent implements OnInit {
	loading = false;
	hasError: boolean;
	statusCode: any;
	pagination: Pagination = new Pagination();
	isVanityUrlEnabled = false;
	headerText = "All Approved Users";
	@Input() showPartners = false;
	collpsableId = "collapsible-all-users";
	companiesSearchableDropDownDto: SearchableDropdownDto = new SearchableDropdownDto();
	selectedCompanyId = 0;
	dropdownDataLoading = true;
    isSearchableDropdownHidden = false;
	constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption, private utilService: UtilService) {
		this.isVanityUrlEnabled = this.authenticationService.vanityURLEnabled;
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}

	ngOnInit() {
		this.referenceService.loading(this.httpRequestLoader, true);
		if(this.showPartners){
			this.collpsableId = "collapsible-all-partners";
			this.headerText = "Partner Company Users";
      		this.isSearchableDropdownHidden = false;
			this.findAllPartnerCompanies();
		}else{
      if(this.isVanityUrlEnabled){
        this.isSearchableDropdownHidden = true;
        this.headerText = this.authenticationService.v_companyName;
      }
			this.findAllCompanyNames();
		}
		this.listAllApprovedUsers(this.pagination);
	}
	findAllPartnerCompanies() {
		if (this.isVanityUrlEnabled) {
			this.dashboardService.findAllPartnerCompanyNames(this.authenticationService.companyProfileName).subscribe(
				response => {
					this.setSearchableDropdownData(response);
				}, error => {

				});
		}
	}

	findAllCompanyNames() {
		this.dashboardService.findAllCompanyNames().subscribe(
			response => {
				this.setSearchableDropdownData(response);
			}, error => {

			});
	}

	private setSearchableDropdownData(response: any) {
		this.companiesSearchableDropDownDto.data = response.data;
		this.companiesSearchableDropDownDto.placeHolder = "Please Select Company";
		this.dropdownDataLoading = false;
	}

	searchableDropdownEventReceiver(event:any){
		if(event!=null){
			this.pagination = new Pagination();
			this.pagination.companyId = event['id'];
		}else{
			this.pagination = new Pagination();
		}
		this.listAllApprovedUsers(this.pagination);

	}

	listAllApprovedUsers(pagination: Pagination) {
		this.hasError = false;
		if(this.isVanityUrlEnabled){
			pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			if(this.showPartners){
				this.pagination.filterBy = "vendorCompany";
			}
		}
		this.referenceService.loading(this.httpRequestLoader, true);
		this.dashboardService.listAllApprovedUsers(pagination).subscribe(
			(response: any) => {
				this.statusCode = response.statusCode;
				if (this.statusCode == 200) {
					const data = response.data;
					pagination.totalRecords = data.totalRecords;
					this.sortOption.totalRecords = data.totalRecords;
					pagination = this.pagerService.getPagedItems(pagination, data.list);
				}
				this.referenceService.loading(this.httpRequestLoader, false);
			},
			(error: any) => { this.hasError = true; this.referenceService.loading(this.httpRequestLoader, false); });
	}


	/********************Pagaination&Search Code*****************/

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedActiveUsersSortOption = text;
		this.getAllFilteredResults(this.pagination);
	}


	/*************************Search********************** */
	search() {
		this.getAllFilteredResults(this.pagination);
	}

	paginationDropdown(items: any) {
		this.sortOption.itemsSize = items;
		this.getAllFilteredResults(this.pagination);
	}

	/************Page************** */
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.listAllApprovedUsers(this.pagination);
	}

	getAllFilteredResults(pagination: Pagination) {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedActiveUsersSortOption, this.pagination);
		this.listAllApprovedUsers(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	refreshList() {
		this.pagination.pageIndex = 1;
		this.sortOption.searchKey = "";
		this.pagination.searchKey = "";
		this.sortOption.selectedActiveUsersSortOption = this.sortOption.activeUsersSortDropDownOptions[4];
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedActiveUsersSortOption, this.pagination);
		this.listAllApprovedUsers(this.pagination);
	}

	loginAs(result: any) {
		this.utilService.addLoginAsLoader();
		if(this.isVanityUrlEnabled){
			this.loginAsTeamMemberForVanityLogin(result.emailId,false,result.userId);
		}else{
			this.loginAsTeamMember(result.emailId, false, result.userId);
		}


	}

	loginAsTeamMemberForVanityLogin(emailId:any,isLoggedInAsAdmin:boolean,userId:number){
		let vanityUrlRoles:any;
			this.authenticationService.getVanityURLUserRolesForLoginAs(emailId,userId).
			subscribe(
				response=>{
					vanityUrlRoles = response.data;
				},error=>{
					this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
					this.loading = false;
					this.referenceService.loaderFromAdmin = false;
					this.authenticationService.logout();
				},()=>{
					this.authenticationService.getUserByUserName(emailId)
					.subscribe(
						response => {
							response['roles'] = vanityUrlRoles;
							this.addOrRemoveLocalStorage(isLoggedInAsAdmin, userId, emailId, response);
						},
						(error: any) => {
							this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
							this.loading = false;
							this.referenceService.loaderFromAdmin = false;
						},
						() => this.logger.info('Finished loginAsTeamMember()')
					);

				});
	}

	loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean, userId: number) {
		this.loading = true;
		this.referenceService.loaderFromAdmin = true;
		this.authenticationService.getUserByUserName(emailId)
			.subscribe(
				response => {
					this.addOrRemoveLocalStorage(isLoggedInAsAdmin, userId, emailId, response);
				},
				(error: any) => {
					this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
					this.loading = false;
					this.referenceService.loaderFromAdmin = false;
				},
				() => this.logger.info('Finished loginAsTeamMember()')
			);
	}

	private addOrRemoveLocalStorage(isLoggedInAsAdmin: boolean, userId: number, emailId: string, response: any) {
		if (isLoggedInAsAdmin) {
			localStorage.removeItem('loginAsUserId');
			localStorage.removeItem('loginAsUserEmailId');
		} else {
			let loginAsUserId = JSON.parse(localStorage.getItem('loginAsUserId'));
			if (loginAsUserId == null) {
				localStorage.loginAsUserId = JSON.stringify(userId);
				localStorage.loginAsUserEmailId = JSON.stringify(this.authenticationService.user.emailId);
			}
		}
		this.utilService.setUserInfoIntoLocalStorage(emailId, response);
		let self = this;
		setTimeout(function () {
			self.router.navigate(['home/dashboard/'])
				.then(() => {
					window.location.reload();
				});
		}, 500);
	}

	logoutAsTeamMember() {
		let adminEmailId = JSON.parse(localStorage.getItem('adminEmailId'));
		if(this.isVanityUrlEnabled){
			this.loginAsTeamMemberForVanityLogin(adminEmailId, true, 1);
		}else{
			this.loginAsTeamMember(adminEmailId, true, 1);
		}

	}
	confirmLogout(result: any) {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "This will remove the access token for this user",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, remove it!'

			}).then(function() {
				self.logout(result);
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showSweetAlertErrorMessage("Unable to confirmLogout().Please try after sometime");
		}
	}

	logout(result: any) {
		this.loading = true;
		this.dashboardService.revokeAccessTokenByUserId(result.userId)
			.subscribe(
				response => {
					let statusCode = response.statusCode;
					let message = response.message;
					if (statusCode == 200) {
						this.referenceService.showSweetAlertSuccessMessage(message);
					} else {
						this.referenceService.showSweetAlertFailureMessage(message);
					}
					this.loading = false;
				},
				(_error: any) => {
					this.referenceService.showSweetAlertErrorMessage("Unable to Logout.Please try after sometime");
					this.loading = false;
				},
				() => this.logger.info('Finished logout()')
			);
	}

	confirmLogoutForAll() {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "This will remove all access token for all users",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, remove it!'

			}).then(function() {
				self.logoutAllUsers();
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showSweetAlertErrorMessage("Unable to confirmLogout().Please try after sometime");
		}
	}

	logoutAllUsers() {
		this.loading = true;
		this.dashboardService.revokeAccessTokensForAll()
			.subscribe(
				response => {
					let statusCode = response.statusCode;
					let message = response.message;
					if (statusCode == 200) {
						this.referenceService.showSweetAlertSuccessMessage(message);
						this.authenticationService.revokeAccessToken();
					} else {
						this.referenceService.showSweetAlertFailureMessage(message);
					}
					this.loading = false;
				},
				(_error: any) => {
					this.referenceService.showSweetAlertErrorMessage("Unable to Logout All Users.Please try after sometime");
					this.loading = false;
				},
				() => this.logger.info('Finished logout()')
			);
	}

	download(csvName: string) {
		const url = this.authenticationService.REST_URL + "superadmin/" + csvName + '?access_token=' + this.authenticationService.access_token;
		window.location.assign(url);

	}

	copyApprovedUserEmailAddress(inputElement:any,index:number){
		$(".success").hide();
		$('#copied-apporved-users-email-address-' + index).hide();
		inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
		$('#copied-apporved-users-email-address-' + index).show(600);
	}

}

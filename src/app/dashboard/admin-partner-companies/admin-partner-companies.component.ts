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
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { AnalyticsCountDto } from 'app/core/models/analytics-count-dto';

declare var $,swal: any;

@Component({
	selector: 'app-admin-partner-companies',
	templateUrl: './admin-partner-companies.component.html',
	styleUrls: ['./admin-partner-companies.component.css','../admin-report/admin-report.component.css'],
	providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class AdminPartnerCompaniesComponent implements OnInit {

	loading = false;
	hasError: boolean;
	statusCode: any;
	pagination: Pagination = new Pagination();
	selectedPartnerCompany:any;
	dnsConfigured = false;
	modalPopupLoader = false;
	campaignAccess:CampaignAccess = new CampaignAccess();
	analyticsCountDto: any;
	constructor(public dashboardService: DashboardService, public referenceService: ReferenceService,
		public httpRequestLoader: HttpRequestLoader,
		public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router,
		public logger: XtremandLogger, public sortOption: SortOption, private utilService: UtilService) {
		if (this.authenticationService.getUserId() != 1) {
			this.router.navigate(['/access-denied']);
		}
	}

	ngOnInit() {
		this.listAllPartners(this.pagination);
	}

	listAllPartners(pagination: Pagination) {
		this.hasError = false;
		this.referenceService.loading(this.httpRequestLoader, true);
		this.dashboardService.listAllPartners(pagination).subscribe(
			(response: any) => {
				const data = response.data;
				pagination.totalRecords = data.totalRecords;
				this.sortOption.totalRecords = data.totalRecords;
				pagination = this.pagerService.getPagedItems(pagination, data.list);
				this.referenceService.loading(this.httpRequestLoader, false);
			},
			(error: any) => { 
				this.hasError = true; 
				this.referenceService.loading(this.httpRequestLoader, false); });
	}


	/********************Pagaination&Search Code*****************/

	/*************************Sort********************** */
	sortBy(text: any) {
		this.sortOption.selectedPartnerCompanyDropDownOption = text;
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
		this.listAllPartners(this.pagination);
	}

	getAllFilteredResults(pagination: Pagination) {
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = this.sortOption.searchKey;
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedPartnerCompanyDropDownOption, this.pagination);
		this.listAllPartners(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
	refreshList() {
		this.pagination.pageIndex = 1;
		this.sortOption.searchKey = "";
		this.pagination.searchKey = "";
		this.sortOption.selectedPartnerCompanyDropDownOption = this.sortOption.partnerCompanySortDropDownOptions[0];
		this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedPartnerCompanyDropDownOption, this.pagination);
		this.listAllPartners(this.pagination);
	}

	viewModules(partnerCompany:any){
		this.findMaximumAdminsLimitDetails(partnerCompany);
		
	}

	updateDnsConfiguration(companyId:number){
		this.modalPopupLoader = true;
		this.dashboardService.updateDnsConfigurationDetails(companyId,this.dnsConfigured).
		subscribe(result => {
		  this.modalPopupLoader = false;
		  if(result.statusCode==200){
			this.listAllPartners(this.pagination);
			this.referenceService.showSweetAlertSuccessMessage('DNS Configuration Updated Successfully');
		  }else{
			this.referenceService.showSweetAlertErrorMessage('Unable to update DNS Configuartion.');
		  }
		}, _error => {
			this.modalPopupLoader = false;
			this.referenceService.showSweetAlertErrorMessage('Unable to update DNS Configuartion.');
		});
	  }

	  updateModules(partnerCompany:any){
		this.modalPopupLoader = true;
		this.campaignAccess.companyId = partnerCompany.companyId;
		this.dashboardService.updatePartnerModuleAccess(this.campaignAccess).
		subscribe(result => {
		  this.modalPopupLoader = false;
		  if(result.statusCode==200){
			this.listAllPartners(this.pagination);
			this.referenceService.showSweetAlertSuccessMessage('Modules Updated Successfully');
			$('#partner-module-access').modal('hide');
		  }else{
			this.referenceService.showSweetAlertErrorMessage(result.message);
		  }
		}, _error => {
			this.modalPopupLoader = false;
			this.referenceService.showSweetAlertErrorMessage('Unable to update Modules.');
		});
	  }

	  /** XNFR-139 ***** */
  setMaxAdmins(){
    let maxAdmins =  $('#maxAdmins-partners-Edit option:selected').val();
    this.campaignAccess.maxAdmins = maxAdmins;
}

findMaximumAdminsLimitDetails(partnerCompany:any){
	$('#partner-module-access').modal('show');
	this.modalPopupLoader = true;
	this.dashboardService.findMaximumAdminsLimitDetailsByCompanyId(partnerCompany.companyId).subscribe(
	  response=>{
		this.analyticsCountDto = response.data;
		this.modalPopupLoader = false;
	  },error=>{
		this.analyticsCountDto = new AnalyticsCountDto();
		this.modalPopupLoader =false;
		this.referenceService.showSweetAlertServerErrorMessage();
		$('#partner-module-access').modal('hide');
	  },()=>{
		this.selectedPartnerCompany = partnerCompany;
		this.dnsConfigured = partnerCompany.emailDnsConfigured;
		this.campaignAccess.loginAsTeamMember = partnerCompany.loginAsTeamMember;
		this.campaignAccess.excludeUsersOrDomains = partnerCompany.excludeUsersOrDomains;
		this.campaignAccess.maxAdmins = partnerCompany.maxAdmins;
	  }
	);
  }
}

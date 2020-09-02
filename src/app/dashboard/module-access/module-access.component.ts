import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { ReferenceService } from 'app/core/services/reference.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { MdfService } from 'app/mdf/services/mdf.service';


declare var $;
@Component({
	selector: 'app-module-access',
	templateUrl: './module-access.component.html',
	styleUrls: ['./module-access.component.css'],
	providers: [HttpRequestLoader,  MdfService]
})
export class ModuleAccessComponent implements OnInit {

	companyId: any;
	userAlias: any;
	companyProfilename: any
	customResponse: CustomResponse = new CustomResponse();
	campaignAccess = new CampaignAccess();
	moduleAccessList: any = [];
	companyAndUserDetails: any;
	companyLoader = true;
	moduleLoader = true;
	ngxLoading = false;
	constructor(public authenticationService: AuthenticationService, private dashboardService: DashboardService, public route: ActivatedRoute, public referenceService: ReferenceService, private mdfService: MdfService) { }

	roleId: number = 0;


	ngOnInit() {
		this.companyId = this.route.snapshot.params['alias'];
		this.userAlias = this.route.snapshot.params['userAlias'];
		this.companyProfilename = this.route.snapshot.params['companyProfileName'];
		this.getCompanyAndUserDetails();
	}
	getCompanyAndUserDetails() {
		this.dashboardService.getCompanyDetailsAndUserId(this.companyId, this.userAlias).subscribe(result => {
			this.companyLoader = false;
			this.companyAndUserDetails = result;
			this.roleId = result.roleId;
		}, error => {
			this.companyLoader = false;
			this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
		},
			() => {
				this.getModuleAccessByCompanyId();
			}

		);

	}

	getModuleAccessByCompanyId() {
		if (this.companyId) {
			this.dashboardService.getAccess(this.companyId).subscribe(result => {
				this.campaignAccess = result;
				this.campaignAccess.allBoundSource = this.companyAndUserDetails.allBoundSource;
				this.moduleLoader = false;
			}, error => {
				this.moduleLoader = false;
				this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
			});
		}
	}

	updateModuleAccess() {
		this.ngxLoading = true;
		this.campaignAccess.companyId = this.companyId;
		this.campaignAccess.roleId = $('#roleId option:selected').val();
		this.campaignAccess.userId = this.companyAndUserDetails.id;
		this.dashboardService.changeAccess(this.campaignAccess).subscribe(result => {
			if (result.statusCode === 200) {
				if (this.campaignAccess.mdf) {
					this.mdfService.saveMdfRequestForm(this.companyAndUserDetails.emailId, this.companyProfilename).subscribe((result: any) => {
						if (result.access) {
							if (result.statusCode === 100) {
								console.log("Mdf form already exists");
							}
						}
					}, error => {
						this.ngxLoading = false;
						this.customResponse = new CustomResponse('Error', "Something went wrong.", true);
					});
				}
				this.customResponse = new CustomResponse('SUCCESS', "Modules updated successfully", true);
				this.getModuleAccessByCompanyId();
				this.getCompanyAndUserDetails();
				this.referenceService.goToTop();
				this.ngxLoading = false;
			}
		}, error => {
			this.ngxLoading = false;
			this.customResponse = new CustomResponse('Error', "Something went wrong.", true);
		});
	}

	addAmount() {
		let mdfAmount = $('#mdfAmount').val();
		if (mdfAmount != "") {
			this.ngxLoading = true;
			this.mdfService.addDefaultMdfAmountToPartners(this.companyId, mdfAmount).subscribe(result => {
				this.referenceService.showSweetAlertSuccessMessage("Success");
				this.ngxLoading = false;
			}, error => {
				this.ngxLoading = false;
				this.customResponse = new CustomResponse('ERROR', 'Something went wrong.', true);
			});
		} else {
			this.referenceService.showSweetAlertErrorMessage("Invalid Amount");
		}

	}
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomFieldsDto } from '../models/custom-fields-dto';
declare var swal:any, $:any;

@Component({
	selector: 'app-integration-settings',
	templateUrl: './integration-settings.component.html',
	styleUrls: ['./integration-settings.component.css']
})
export class IntegrationSettingsComponent implements OnInit {

	loggedInUserId: any;
	@Input() integrationType: String;
	@Output() closeEvent = new EventEmitter<any>();
	@Output() unlinkEvent = new EventEmitter<any>();
	@Output() refreshEvent = new EventEmitter<any>();
	customResponse: CustomResponse = new CustomResponse();
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	loading: boolean = false;
	userProfileImage = "assets/images/icon-user-default.png";
	selectedCfIds = [];
	canNotUnSelectIds = [];
	ngxloading: boolean;
	sfCustomFieldsResponse: any;
	sfcfMasterCBClicked: boolean = false;
	isOnlyPartner: boolean = false;
	isPartnerTeamMember: boolean = false;
	requiredCfIds = [];
	paginatedSelectedIds = [];
	sfcfPager: any = {};
	pageSize: number = 12;
	sfcfPagedItems = new Array<CustomFieldsDto>();
	isHeaderCheckBoxChecked: boolean = false;
	pageNumber: any;
	selectedCustomFieldIds = [];
	customFieldsResponse: CustomResponse = new CustomResponse();
	activeCRMDetails: any;
	integrationDetails: any;
	integrationPipelines = [];
	selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
	customFieldsDtosLoader = false;

	constructor(private integrationService: IntegrationService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent,
		public referenceService: ReferenceService, public authenticationService: AuthenticationService) {
		this.pageNumber = this.paginationComponent.numberPerPage[0];
		this.loggedInUserId = this.authenticationService.getUserId();
		this.isOnlyPartner = this.authenticationService.isOnlyPartner();
		this.isPartnerTeamMember = this.authenticationService.isPartnerTeamMember;
	}
	
	ngOnInit() {
		this.getIntegrationDetails();
	}

	checkAuthorization() {
		this.ngxloading = true;
		let type: string = this.integrationType.toLowerCase();
		if (this.integrationType.toLowerCase() === 'salesforce') {
			type = 'isalesforce';
		}
		this.integrationService.checkConfigurationByType(type).subscribe(data => {
			this.ngxloading = false;
			let response = data;
			if (response.data.isAuthorize !== undefined && response.data.isAuthorize) {

			}
		}, error => {
			this.ngxloading = false;
		}, () => { }
		);
	}

	listSalesforceCustomFields() {
		this.ngxloading = true;
		let self = this;
		self.selectedCfIds = [];
		self.integrationService.listSalesforceCustomFields(this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.sfCustomFieldsResponse = data.data;
						this.sfcfMasterCBClicked = false;
						$.each(this.sfCustomFieldsResponse, function (_index: number, customField) {
							if (customField.selected) {
								self.selectedCfIds.push(customField.name);
							}

							if (customField.required) {
								self.requiredCfIds.push(customField.name);
								if (!customField.selected) {
									self.selectedCfIds.push(customField.name);
								}
							}
						});
						this.setSfCfPage(1);
					} else if (data.statusCode === 401 && data.message === "Expired Refresh Token") {
						this.customFieldsResponse = new CustomResponse('ERROR', "We found something wrong about your Vendor's configuration. Please contact your Vendor.", true);
					}
				},
				error => {
					this.ngxloading = false;
					this.customFieldsResponse = new CustomResponse('ERROR', "Your Salesforce integration is not valid. Re-configure with valid credentials", true);
				},
				() => { }
			);
	}

	listExternalCustomFields() {
		this.ngxloading = true;
		this.customFieldsDtosLoader = true;
		let self = this;
		self.selectedCfIds = [];
		self.integrationService.listExternalCustomFields(this.integrationType.toLowerCase(), this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.sfCustomFieldsResponse = data.data;
						this.sfcfMasterCBClicked = false;
						$.each(this.sfCustomFieldsResponse, function (_index: number, customField) {
							if (customField.selected) {
								self.selectedCfIds.push(customField.name);
							}

							if (customField.required) {
								self.requiredCfIds.push(customField.name);
								if (!customField.selected) {
									self.selectedCfIds.push(customField.name);
								}
								if (!customField.canUnselect){
									self.canNotUnSelectIds.push(customField.name)
								}
							}
						});
						this.setSfCfPage(1);
					}
					this.customFieldsDtosLoader = false;
				},
				error => {
					this.ngxloading = false;
					let errorMessage = this.referenceService.getApiErrorMessage(error);
                    this.customFieldsResponse = new CustomResponse('ERROR',errorMessage,true);
					this.customFieldsDtosLoader = false;
				},
				() => { }
			);

	}

	setSfCfPage(page: number) {
		this.referenceService.goToTop();
		this.paginatedSelectedIds = [];
		try {
			if (page < 1 || (this.sfcfPager.totalPages > 0 && page > this.sfcfPager.totalPages)) {
				return;
			}
			this.sfcfPager = this.socialPagerService.getPager(this.sfCustomFieldsResponse.length, page, this.pageSize);
			this.sfcfPagedItems = this.sfCustomFieldsResponse.slice(this.sfcfPager.startIndex, this.sfcfPager.endIndex + 1);
			var cfIds = this.sfcfPagedItems.map(function (a) { return a.name; });
			var items = $.grep(this.selectedCfIds, function (element) {
				return $.inArray(element, cfIds) !== -1;
			});
			if (items.length == this.sfcfPager.pageSize || items.length == this.sfCustomFieldsResponse.length || items.length == this.sfcfPagedItems.length) {
				this.isHeaderCheckBoxChecked = true;
			} else {
				this.isHeaderCheckBoxChecked = false;
			}

			if (items) {
				for (let i = 0; i < items.length; i++) {
					this.paginatedSelectedIds.push(items[i]);
				}
			}
		} catch (error) {
		}

	}

	selectedPageNumber(event) {
		this.pageNumber.value = event;
		if (event === 0) { event = this.sfCustomFieldsResponse.length; }
		this.pageSize = event;
		this.setSfCfPage(1);
	}

	saveCustomFieldsSelection() {
		this.ngxloading = true;
		let self = this;
		this.selectedCustomFieldIds = [];
		$('[name="sfcf[]"]:checked').each(function () {
			var id = $(this).val();
			self.selectedCustomFieldIds.push(id);
		});

		/*****XNFR-339*****/
		this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
		$.each(this.sfCustomFieldsResponse,function(_index:number,customFiledDto:any){
			if(customFiledDto.selected){
				let selectedCustomFieldsDto = new CustomFieldsDto();
				selectedCustomFieldsDto.name = customFiledDto.name;
				selectedCustomFieldsDto.required = customFiledDto.required;
				selectedCustomFieldsDto.placeHolder = customFiledDto.placeHolder;
				self.selectedCustomFieldsDtos.push(selectedCustomFieldsDto);
			}
		});
		 if (this.integrationType.toLowerCase() === 'salesforce') {
		 	this.integrationService.syncSalesforceCustomForm(this.loggedInUserId, this.selectedCfIds)
		 		.subscribe(
		 			data => {
		 				this.ngxloading = false;
						if (data.statusCode == 200) {
							this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
							this.listSalesforceCustomFields();
		 				}
		 			},
					error => {
						this.ngxloading = false;
				},
					() => { }
		 		);
		 } else {
		 	this.integrationService.syncCustomForm(this.loggedInUserId, this.selectedCustomFieldsDtos, this.integrationType.toLowerCase())
				.subscribe(
		 			data => {
	 				this.ngxloading = false;
						if (data.statusCode == 200) {
		 					this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
		 					this.listExternalCustomFields();
		 				}
					},
					error => {
						this.ngxloading = false;
					},
		 			() => { }
		 		);
		 }

	}

	closeSfSettings() {
		this.closeEvent.emit();
	}

	selectCf(sfCustomField: any) {
		let cfName = sfCustomField.name;
		let isChecked = $('#' + cfName).is(':checked');
		if (isChecked) {
			if (this.selectedCfIds.indexOf(cfName) == -1) {
				this.selectedCfIds.push(cfName);
			}
			if (this.paginatedSelectedIds.indexOf(cfName) == -1) {
				this.paginatedSelectedIds.push(cfName);
			}
			sfCustomField.selected = true;
		} else {
			this.selectedCfIds.splice($.inArray(cfName, this.selectedCfIds), 1);
			this.paginatedSelectedIds.splice($.inArray(cfName, this.paginatedSelectedIds), 1);
			sfCustomField.selected = false;
		}
		this.isHeaderCheckBoxChecked = this.paginatedSelectedIds.length == this.sfcfPagedItems.length;
		
	}

	reloadCustomFields() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;
		if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields();
		} else {
			this.listExternalCustomFields();
		}
	}

	unlinkCRM() {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "Unlinking CRM delete pipelines and some deal data, click Yes to continue.",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete!'

			}).then(function () {
				let request: any = {};
				request.userId = self.loggedInUserId;
				request.type = self.integrationType;
				self.ngxloading = true;
				self.integrationService.unlinkCRM(self.loggedInUserId, self.integrationType.toLowerCase())
					.subscribe(
						data => {
							if (data.statusCode == 200) {
								self.unlinkEvent.emit();
							}
						});
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showServerError(this.httpRequestLoader);
		}
	}


	getIntegrationDealPipelines() {
		this.ngxloading = true;
		this.integrationService.getCRMPipelines(this.loggedInUserId, this.integrationType)
		.subscribe(
		  data => {
		    this.referenceService.loading(this.httpRequestLoader, false);
		    if (data.statusCode == 200) {
				this.integrationPipelines = data.data;
		    }
			this.ngxloading = false;
		  },
		  error => {
			this.ngxloading = false;
		    this.httpRequestLoader.isServerError = true;
		  },
		  () => { }
		);
	}


	activateCRM() {
		if (this.integrationType === 'HUBSPOT' || this.integrationType === 'PIPEDRIVE') {
			this.activateCRMBySelectingDealPipeline();
		} else {
			this.activateCRMNormal();
		}

	}
	activateCRMBySelectingDealPipeline() {
		if (this.integrationPipelines != undefined && this.integrationPipelines != null
			&& this.integrationPipelines.length > 0) {
			let self = this;
			let modalPopUp = $('<div><div id="bee-save-buton-loader"></div>');
			let dropDown = '<div class="form-group">';
			dropDown += '<label style="color: #575757;font-size: 17px; font-weight: 500;">Select default deal pipeline </label>';
			dropDown += '<select class="form-control" id="deal-pipeline-dropdown" style="max-height: 50px;">';
			$.each(this.integrationPipelines, function (_index: number, pipeline: any) {
				dropDown += '<option value=' + pipeline.id + '>' + pipeline.name + '</option>';
				$.each(pipeline.stages, function (_index: number, stage: any) {
					dropDown += '<option disabled style="font-style:italic">&nbsp;&nbsp;&nbsp;' + stage.stageName + '</option>';
				});

			});
			dropDown += '</select>';
			dropDown += '</div><br>';
			modalPopUp.append(dropDown);
			modalPopUp.append(self.createButton('Activate', function () {
				swal.close();
				let request: any = {};
				request.userId = self.loggedInUserId;
				request.type = self.integrationType;
				request.defaultDealPipelineId = $.trim($('#deal-pipeline-dropdown option:selected').val());
				self.setActiveCRM(request);
			})).append(self.createButton('Cancel', function () {
				swal.close();
			}));
			swal({ html: modalPopUp, showConfirmButton: false, showCancelButton: false });
		} else {
			this.customFieldsResponse = new CustomResponse('ERROR', "Activation failed as there are no deal pipelines.", true);
		}
	}

	createButton(text, cb) {
		if (text == "Activate") {
			return $('<input type="submit" class="btn btn-primary" value="' + text + '" id="activate">').on('click', cb);
		} else {
			return $('<input type="submit" class="btn Btn-Gray" value="' + text + '">').on('click', cb);
		}
	}

	activateCRMNormal() {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "Click Yes to mark this as your active CRM",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, activate!'

			}).then(function () {
				let request: any = {};
				request.userId = self.loggedInUserId;
				request.type = self.integrationType;
				self.setActiveCRM(request);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showServerError(this.httpRequestLoader);
		}
	}

	setActiveCRM(request: any) {
		this.ngxloading = true;
		this.integrationService.setActiveCRM(request)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.getIntegrationDetails();
						this.refreshEvent.emit();
					}
				});
	}

	getActiveCRMDetails() {
		this.integrationService.getActiveCRMDetailsByUserId(this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					this.activeCRMDetails = data.data;
				});
	}

	getIntegrationDetails() {
		this.ngxloading = true;
		let self = this;
		self.integrationService.getIntegrationDetails(this.integrationType.toLowerCase(), this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.integrationDetails = data.data;
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => {
					if (this.integrationType.toLowerCase() === 'salesforce') {
						this.listSalesforceCustomFields();
					} else {						
						if (this.integrationType.toLowerCase() === 'hubspot' || this.integrationType.toLowerCase() === 'pipedrive') {
							this.getIntegrationDealPipelines();
						}
						this.listExternalCustomFields();
					}
				}
			);
	}

	checkAll(ev: any) {
		if (ev.target.checked) {
			$('[name="sfcf[]"]').prop('checked', true);
			let self = this;
			$('[name="sfcf[]"]:checked').each(function () {
				var id = $(this).val();
				self.selectedCfIds.push(id);
				self.paginatedSelectedIds.push(id);
			});
			this.selectedCfIds = this.referenceService.removeDuplicates(this.selectedCfIds);
			this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
			$.each(this.sfcfPagedItems,function(index:number,value:any){
				value.selected = true;
			});

		} else {
			let self = this;
			$('[name="sfcf[]"]').each(function () {
				var id = $(this).val();
				if (self.canNotUnSelectIds.indexOf(id) == -1) {
					$(this).prop('checked', false);
					self.paginatedSelectedIds.splice($.inArray(id, self.paginatedSelectedIds), 1);
				}
			});

			if (this.sfcfPager.maxResults == this.sfcfPager.totalItems) {
				this.selectedCfIds = [];
				this.paginatedSelectedIds = [];
			} else {
				let currentPageCfIds = this.sfcfPagedItems.map(function (a) { if (self.requiredCfIds.indexOf(a.name) == -1) { return a.name; } });
				this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
				this.selectedCfIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedCfIds, currentPageCfIds);
			}
			$.each(self.sfcfPagedItems,function(index:number,value:any){
				if(value.canUnselect){
					value.selected = false;
				}
			});
		}
		ev.stopPropagation();
	}

	
}

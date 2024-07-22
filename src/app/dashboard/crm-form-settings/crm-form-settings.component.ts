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
  selector: 'app-crm-form-settings',
  templateUrl: './crm-form-settings.component.html',
  styleUrls: ['./crm-form-settings.component.css']
})
export class CrmFormSettingsComponent {

  @Input() integrationType: String;
  @Input() opportunityType :any;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() notifySubmitSuccess = new EventEmitter<any>();
  loggedInUserId: any;
	customResponse: CustomResponse = new CustomResponse();
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	loading: boolean = false;
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
	customField = new CustomFieldsDto;
	isHeaderCheckBoxChecked: boolean = false;
	pageNumber: any;
	selectedCustomFieldIds = [];
	customFieldsResponse: CustomResponse = new CustomResponse();
	activeCRMDetails: any;
	integrationDetails: any;
	integrationPipelines = [];
	selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
	customFieldsDtosLoader = false;
	expandField: boolean = false;
	typeMismatchMessage: any;
	searchKey: any;
	FilteredCustomFields: any;
	haveCustomFields: boolean = false;
	isSortApplied: boolean = false;
	isFilterApplied: boolean = false;
	isCustomFieldsModelPopUp: boolean = false;
	isCustomFieldsOrderModelPopUp: boolean = false;
	customFieldsList: any;
	selectedCustomFields: Array<CustomFieldsDto> = new Array<CustomFieldsDto>();
	showHeaderTextArea: boolean = false;
	dealHeader = '';

	sortOptions = [
		{ 'name': 'Sort by', 'value': '' },
		{ 'name': 'Field name (A-Z)', 'value': 'asc' },
		{ 'name': 'Field name (Z-A)', 'value': 'desc' },
	];

	public sortOption: any = this.sortOptions[0].value;
	
	

	constructor(private integrationService: IntegrationService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent,
		public referenceService: ReferenceService, public authenticationService: AuthenticationService) {
		this.pageNumber = this.paginationComponent.numberPerPage[0];
		this.loggedInUserId = this.authenticationService.getUserId();
		this.isPartnerTeamMember = this.authenticationService.isPartnerTeamMember;
	}
	
	ngOnChanges() {
		if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		} else {
			this.listExternalCustomFields();
		}
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

	listSalesforceCustomFields(opportunityType: any) {
		this.ngxloading = true;
		let self = this;
		this.customFieldsDtosLoader = true;
		self.integrationService.listSalesforceCustomFields(this.loggedInUserId, opportunityType)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						if (!this.isSortApplied && !this.isFilterApplied) {
							self.selectedCfIds = [];
							this.sfCustomFieldsResponse = data.data;
							if (this.sfCustomFieldsResponse != undefined) {
								if (this.sfCustomFieldsResponse.length > 0) {
									this.haveCustomFields = true;
								}
							}
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
									if (!customField.canUnselect) {
										self.canNotUnSelectIds.push(customField.name)
									}
								}
							});
						}
						this.setSfCfPage(1);
					} else if (data.statusCode === 401 && data.message === "Expired Refresh Token") {
						this.customFieldsResponse = new CustomResponse('ERROR', "Your Salesforce integration is not valid. Re-configure with valid credentials", true);
                        this.notifySubmitSuccess.emit(this.customFieldsResponse);
					}
					this.customFieldsDtosLoader = false;
				},
				error => {
					this.ngxloading = false;
					this.haveCustomFields = false;
					this.customFieldsResponse = new CustomResponse('ERROR', "Your Salesforce integration is not valid. Re-configure with valid credentials", true);
                    this.notifySubmitSuccess.emit(this.customFieldsResponse);
					this.customFieldsDtosLoader = false;
				},
				() => {
					this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
					$.each(this.sfCustomFieldsResponse, function (_index: number, customFiledDto: any) {
						if (customFiledDto.selected) {
							  self.selectedCustomFieldsDtos.push(customFiledDto);
						}
						if (customFiledDto.order >= 1) {
							self.selectedCustomFieldsDtos.sort((a, b) => {
								if (a['order'] === null) return 1;  
								if (b['order'] === null) return -1;
								return a['order'] - b['order'];
							});
						}
					});
				}
			);
	}

	listExternalCustomFields() {
		//this.ngxloading = true;
		this.customFieldsDtosLoader = true;
		let self = this;
		self.integrationService.listExternalCustomFields(this.integrationType.toLowerCase(), this.loggedInUserId)
			.subscribe(
				data => {
					//this.ngxloading = false;
					if (data.statusCode == 200) {
						if (!this.isSortApplied && !this.isFilterApplied) {
							self.selectedCfIds = [];
							this.sfCustomFieldsResponse = data.data;
							if(this.sfCustomFieldsResponse != undefined){
								if (this.sfCustomFieldsResponse.length > 0) {
									this.haveCustomFields = true;
								}
							}
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
									if (!customField.canUnselect) {
										self.canNotUnSelectIds.push(customField.name)
									}
								}
							});
						}
						this.setSfCfPage(1);
					}
					this.customFieldsDtosLoader = false;
				},
				error => {
					this.ngxloading = false;
					this.haveCustomFields = false;
					let errorMessage = this.referenceService.getApiErrorMessage(error);
                    this.customFieldsResponse = new CustomResponse('ERROR',errorMessage,true);
					this.customFieldsDtosLoader = false;
				},
				() => {
					// this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
					// $.each(this.sfCustomFieldsResponse, function (_index: number, customFiledDto: any) {
					// 	if (customFiledDto.selected) {
					// 		  self.selectedCustomFieldsDtos.push(customFiledDto);
					// 	}
					// 	if (customFiledDto.order >= 1) {
					// 		self.selectedCustomFieldsDtos.sort((a, b) => a['order'] - b['order']);
					// 	}
					// });
				 }
			);

	}


	setSfCfPage(page: number) {
		this.paginatedSelectedIds = [];
		try {
			if (page < 1 || (this.sfcfPager.totalPages > 0 && page > this.sfcfPager.totalPages)) {
				return;
			}
			if (this.sortOption !== undefined) {
				if (this.sortOption === 'asc') {
					this.sfCustomFieldsResponse.sort((a, b) => a.label.localeCompare(b.label));
				} else if (this.sortOption === 'desc') {
					this.sfCustomFieldsResponse.sort((a, b) => b.label.localeCompare(a.label));
				} else if (this.sortOption === '') {
					this.sfCustomFieldsResponse.sort((a, b) => {
						if (a.canUnselect && !b.canUnselect) {
							return 1;
						} else if (!a.canUnselect && b.canUnselect) {
							return -1;
						}

						if (!a.selected && b.selected) {
							return 1;
						} else if (a.selected && !b.selected) {
							return -1;
						}

						return a.label.localeCompare(b.label);
					});
				}
			}
			this.referenceService.goToTop();
			if (this.searchKey !== undefined && this.searchKey !== '') {
				this.FilteredCustomFields = this.sfCustomFieldsResponse.filter(customField =>
					customField.label.toLowerCase().includes(this.searchKey.trim().toLowerCase())
				);
				this.sfcfPager = this.socialPagerService.getPager(this.FilteredCustomFields.length, page, this.pageSize);
				this.sfcfPagedItems = this.FilteredCustomFields.slice(this.sfcfPager.startIndex, this.sfcfPager.endIndex + 1);
				var cfIds = this.sfcfPagedItems.map(function (a) { return a.name; });
				var items = $.grep(this.selectedCfIds, function (element) {
					return $.inArray(element, cfIds) !== -1;
				});
				if ((items.length == this.sfcfPager.pageSize || items.length == this.FilteredCustomFields.length || items.length == this.sfcfPagedItems.length) && this.FilteredCustomFields.length > 0) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
			} else {
				this.sfcfPager = this.socialPagerService.getPager(this.sfCustomFieldsResponse.length, page, this.pageSize);
				this.sfcfPagedItems = this.sfCustomFieldsResponse.slice(this.sfcfPager.startIndex, this.sfcfPager.endIndex + 1);
				var cfIds = this.sfcfPagedItems.map(function (a) { return a.name; });
				var items = $.grep(this.selectedCfIds, function (element) {
					return $.inArray(element, cfIds) !== -1;
				});
				if ((items.length == this.sfcfPager.pageSize || items.length == this.sfCustomFieldsResponse.length || items.length == this.sfcfPagedItems.length) && this.sfCustomFieldsResponse.length > 0) {
					this.isHeaderCheckBoxChecked = true;
				} else {
					this.isHeaderCheckBoxChecked = false;
				}
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

		 if (this.integrationType.toLowerCase() === 'salesforce') {
			const displayName = this.selectedCustomFieldsDtos.find(field => $.trim(field.displayName).length <= 0);
			if((this.integrationType.toLowerCase() === 'salesforce') && displayName)
			{
				this.ngxloading = false;
				const missingFields: string[] = [];
				this.selectedCustomFieldsDtos.forEach(field => {
							if ($.trim(field.displayName).length <= 0) {
								missingFields.push(field.label);
							}
						});
						const missingFieldsMessage = missingFields.join(', ');
						this.referenceService.goToTop();
						return this.customFieldsResponse = new CustomResponse('ERROR', `Please enter the display name for ${missingFieldsMessage} field(s).`, true);	
            
			}
			this.integrationService.syncCustomForm(this.loggedInUserId, this.selectedCustomFieldsDtos, 'isalesforce', this.opportunityType)
		 		.subscribe(
		 			data => {
		 				this.ngxloading = false;
						if (data.statusCode == 200) {
							this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
                            this.notifySubmitSuccess.emit(this.customFieldsResponse);
							this.isFilterApplied = false;
							this.isSortApplied = false;
							this.listSalesforceCustomFields(this.opportunityType);
		 				}
		 			},
					error => {
						this.ngxloading = false;
				},
					() => { }
		 		);
		 } else {
		this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
		if(this.integrationType.toLowerCase() != 'salesforce'){
			this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
			$.each(this.sfCustomFieldsResponse,function(_index:number,customFiledDto:any){
				if(customFiledDto.selected){
					let selectedCustomFieldsDto = new CustomFieldsDto();
					selectedCustomFieldsDto.name = customFiledDto.name;
					selectedCustomFieldsDto.label = customFiledDto.label;
					selectedCustomFieldsDto.required = customFiledDto.required;
					selectedCustomFieldsDto.placeHolder = customFiledDto.placeHolder;
					selectedCustomFieldsDto.displayName = customFiledDto.displayName;
					selectedCustomFieldsDto.formDefaultFieldType = customFiledDto.formDefaultFieldType;
					selectedCustomFieldsDto.options = customFiledDto.options;
					selectedCustomFieldsDto.originalCRMType = customFiledDto.originalCRMType;
					self.selectedCustomFieldsDtos.push(selectedCustomFieldsDto);
				}
			});
		}
			const amountField = this.selectedCustomFieldsDtos.find(field => field.formDefaultFieldType === 'AMOUNT');
			const closeDateField = this.selectedCustomFieldsDtos.find(field => field.formDefaultFieldType === 'CLOSE_DATE');
			const dealNameField = this.selectedCustomFieldsDtos.find(field => field.formDefaultFieldType === 'DEAL_NAME');
			const displayName = this.selectedCustomFieldsDtos.find(field => $.trim(field.displayName).length <= 0);	
			 if (((this.integrationType === 'HUBSPOT') && (!amountField || !closeDateField || !dealNameField)) && (!this.authenticationService.module.isTeamMember || this.authenticationService.module.isAdmin)) {
				 this.ngxloading = false;
				 const missingFields: string[] = [];
				 if (!amountField) {
					missingFields.push('Amount');
				 }
				 if (!closeDateField) {
					 missingFields.push('Close Date');
				 }
				 if (!dealNameField) {
					 missingFields.push('Deal Name');
				 }
				 const missingFieldsMessage = missingFields.join(', ');
				 this.referenceService.goToTop();
				 return this.customFieldsResponse = new CustomResponse('ERROR', `Please Map the ${missingFieldsMessage} field(s).`, true);	
			}
			if((this.integrationType === 'HUBSPOT' || this.integrationType === 'PIPEDRIVE' || this.integrationType === 'CONNECTWISE' || this.integrationType === 'HALOPSA' || this.integrationType === 'ZOHO') && displayName)
			{
				this.ngxloading = false;
				const missingFields: string[] = [];
				this.selectedCustomFieldsDtos.forEach(field => {
							if ($.trim(field.displayName).length <= 0) {
								missingFields.push(field.label);
							}
						});
						const missingFieldsMessage = missingFields.join(', ');
						this.referenceService.goToTop();
						return this.customFieldsResponse = new CustomResponse('ERROR', `Please enter the display name for ${missingFieldsMessage} field(s).`, true);	
			}
		 	this.integrationService.syncCustomForm(this.loggedInUserId, this.selectedCustomFieldsDtos, this.integrationType.toLowerCase(), this.opportunityType)
				.subscribe(
		 			data => {
	 				this.ngxloading = false;
						if (data.statusCode == 200) {
		 					this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
                            this.notifySubmitSuccess.emit(this.customFieldsResponse );
							 this.isFilterApplied = false;
							 this.isSortApplied = false;
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
				this.selectedCustomFieldsDtos.push(sfCustomField);
			}
			if (this.paginatedSelectedIds.indexOf(cfName) == -1) {
				this.paginatedSelectedIds.push(cfName);
			}
			sfCustomField.selected = true;
		} else {
			this.selectedCustomFieldsDtos.splice(this.selectedCustomFieldsDtos.indexOf(sfCustomField), 1);
			let indexInSelectedIds = this.selectedCfIds.indexOf(cfName);
			if (indexInSelectedIds !== -1) {
				this.selectedCfIds.splice(indexInSelectedIds, 1);
			}
			
			let indexInPaginatedIds = this.paginatedSelectedIds.indexOf(cfName);
			if (indexInPaginatedIds !== -1) {
				this.paginatedSelectedIds.splice(indexInPaginatedIds, 1);
			}
	
			sfCustomField.selected = false;
			sfCustomField.required = false;
		}
		this.isHeaderCheckBoxChecked = this.paginatedSelectedIds.length == this.sfcfPagedItems.length;
	}

	reloadCustomFields() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.searchKey = '';
		this.sortOption = '';
		this.isFilterApplied = false;
		this.isSortApplied = false;
		this.customFieldsResponse.isVisible = false;
		if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		} else {
			this.listExternalCustomFields();
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
					this.getDealHeader();
					if (this.integrationType.toLowerCase() === 'salesforce') {
						// this.listSalesforceCustomFields(this.opportunityType);
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
				self.selectedCustomFieldsDtos.push(value);
			});
			self.selectedCustomFieldsDtos = this.referenceService.removeDuplicates(self.selectedCustomFieldsDtos);
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
					self.selectedCustomFieldsDtos.splice(self.selectedCustomFieldsDtos.indexOf(value), 1);
				}
			});
			self.selectedCustomFieldsDtos = this.referenceService.removeDuplicates(this.selectedCustomFieldsDtos);
		}
		ev.stopPropagation();
	}
	toggleSettings(sfCustomField){
		sfCustomField.showSettings = !sfCustomField.showSettings;
	}
		
	onFieldSelectionChange(selectedField: any): void {
		const selectedFieldType = selectedField.formDefaultFieldType;
		const selectedFieldTypeName = selectedField.type;

		selectedField.typeMismatch = false;
		selectedField.typeMismatchMessage = '';

		if (selectedFieldType === null) {
			selectedField.canUnselect = true;
			return;
		}

		if (
			(selectedFieldType === 'AMOUNT' && selectedFieldTypeName !== 'number') ||
			(selectedFieldType === 'DEAL_NAME' && selectedFieldTypeName !== 'text') ||
			(selectedFieldType === 'CLOSE_DATE' && selectedFieldTypeName !== 'date')
		) {
			selectedField.typeMismatch = true;
			selectedField.typeMismatchMessage = `Type mismatch for ${selectedFieldType}. Expected type is ${selectedFieldType === 'AMOUNT' ? 'number' : selectedFieldType === 'DEAL_NAME' ? 'text' : 'date'
				}.`;
			selectedField.formDefaultFieldType = null;
			return;
		}

		let countSelectedType = 0;

		this.sfCustomFieldsResponse.forEach(field => {
			if (
				field.formDefaultFieldType === selectedFieldType &&
				((selectedFieldTypeName === 'number' && selectedFieldType === 'AMOUNT') ||
					(selectedFieldTypeName === 'text' && selectedFieldType === 'DEAL_NAME') ||
					(selectedFieldTypeName === 'date' && selectedFieldType === 'CLOSE_DATE'))
			) {
				countSelectedType++;
				field.required = true;
				field.canUnselect = false;
				field.canEditRequired = false;
			} else {
				field.typeMismatch = false;
				field.typeMismatchMessage = '';
			}
		});

		if (countSelectedType > 1) {
			this.sfCustomFieldsResponse.forEach(field => {
				if (
					field.formDefaultFieldType === selectedFieldType &&
					((selectedFieldTypeName === 'number' && selectedFieldType === 'AMOUNT') ||
						(selectedFieldTypeName === 'text' && selectedFieldType === 'DEAL_NAME') ||
						(selectedFieldTypeName === 'date' && selectedFieldType === 'CLOSE_DATE')) &&
					field !== selectedField
				) {
					field.formDefaultFieldType = null;
					field.canUnselect = true;
					field.canEditRequired = true;
				}
			});
		}
	}


	searchFieldsKeyPress(keyCode: any) {
		if (keyCode === 13) {
			this.searchFields();
		}
	}

	searchFields() {
		this.getAllFilteredResultsFields();
	}

	getAllFilteredResultsFields() {
		this.isFilterApplied = true;
		if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		} else {
			this.listExternalCustomFields();
		}
	}

	clearFieldSearch() {
		this.searchKey = '';
		if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		} else {
			this.listExternalCustomFields();
		}
	}

	sortFieldsByOption() {
		this.isSortApplied = true;
		if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		} else {
			this.listExternalCustomFields();
		}
	}

	//XNFR-576
	addCustomFielsdModalOpen(customfield: any){
		this.isCustomFieldsModelPopUp = true;
		this.customField = customfield;
		this.customFieldsList = this.sfCustomFieldsResponse;
	}

	closeCustomFielsModal(event: any) {
		if (event === "0") {
			this.isCustomFieldsModelPopUp = false;
		}	
  }

  //XNFR-601
		addCustomFielsdOrderModalOpen(){
			this.isCustomFieldsOrderModelPopUp = true;
			this.customFieldsList = this.selectedCustomFieldsDtos;
		}

		closeCustomFielsOrderModal(event: any) {
			if (event === "0") {
				this.isCustomFieldsOrderModelPopUp = false;
			}	
	}

	//XNFR-611
	toggleHeaderSettings(){
		this.showHeaderTextArea = !this.showHeaderTextArea;
	}
      
	getDealHeader(){
		this.integrationService.getDealHeaderByUserId(this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if(data.data != undefined && data.data!=null && data.data!="")
					this.dealHeader = data.data;
				});
	}

	setDealHeader() {
		this.ngxloading = true;
		if (this.dealHeader == undefined || this.dealHeader.length == 0 || this.dealHeader == '') {
			this.ngxloading = false;
			return this.customFieldsResponse = new CustomResponse('ERROR', `Please Enter Description.`, true);
		}
		this.integrationService.setDealHeader(this.loggedInUserId, this.dealHeader)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
						this.getDealHeader();
					}
				});
	}



}

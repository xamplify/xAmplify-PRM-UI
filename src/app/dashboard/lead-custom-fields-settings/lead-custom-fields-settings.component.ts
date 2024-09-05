import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeadsService } from 'app/leads/services/leads.service';
import { LeadCustomFieldDto } from 'app/leads/models/lead-custom-field';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { DragulaService } from 'ng2-dragula';
import { CustomFieldsDto } from '../models/custom-fields-dto';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { CustomFields } from '../models/custom-fields';
declare var $: any;

@Component({
  selector: 'app-lead-custom-fields-settings',
  templateUrl: './lead-custom-fields-settings.component.html',
  styleUrls: ['./lead-custom-fields-settings.component.css'],
  providers: [LeadsService]
})
export class LeadCustomFieldsSettingsComponent implements OnInit {
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
  isAddCustomFieldsModelPopUp: boolean = false;
	isCustomFieldsOrderModelPopUp: boolean = false;
	customFieldsList: any;
	selectedCustomFields: Array<CustomFieldsDto> = new Array<CustomFieldsDto>();
	showHeaderTextArea: boolean = false;
	dealHeader = '';
  customFields = new CustomFields;

	sortOptions = [
		{ 'name': 'Sort by', 'value': '' },
		{ 'name': 'Field name (A-Z)', 'value': 'asc' },
		{ 'name': 'Field name (Z-A)', 'value': 'desc' },
	];

	public sortOption: any = this.sortOptions[0].value;
	
	

  constructor(private leadService: LeadsService,private dragulaService: DragulaService, public referenceService: ReferenceService,public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent, public authenticationService: AuthenticationService, public integrationService: IntegrationService) { 
    this.pageNumber = this.paginationComponent.numberPerPage[0];
		this.loggedInUserId = this.authenticationService.getUserId();
		this.isPartnerTeamMember = this.authenticationService.isPartnerTeamMember;
    // dragulaService.setOptions('leadFieldDragula', {})
    // dragulaService.dropModel.subscribe((value) => {
    //   this.onDropModel(value);
    // });
  }
  // ngxloading: boolean;
  // customFieldsDtosLoader = false;
  // leadCustomFields = new Array<LeadCustomFieldDto>();
  // customResponse: CustomResponse = new CustomResponse();
  // isValid: boolean = false;
  // isOrderChanged : boolean = false;

  ngOnInit() {
    // this.getLeadFields();
    this.listSalesforceCustomFields("LEAD");
  }

  // ngOnDestroy() {
  //   this.dragulaService.destroy('leadFieldDragula');
  // }

  // private onDropModel(args) {
  //   this.isOrderChanged = true;
  // }

  // getLeadFields() {
  //   this.ngxloading = true;
  //   this.customFieldsDtosLoader = true;
  //   this.leadService.getLeadCustomFields().subscribe(data => {
  //     if (data.statusCode == 200) {
  //       this.ngxloading = false;
  //       this.customFieldsDtosLoader = false;
  //       this.leadCustomFields = data.data;
  //       this.isOrderChanged = false;
  //     }
  //   },
  //     error => {
  //       this.ngxloading = false;
  //       this.customFieldsDtosLoader = false;
  //     }
  //   );
  // }

  // validateAndSubmit() {
  //   this.isValid = true;
  //   let errorMessage = "";
  //   this.isOrderChanged = false;
  //   this.leadCustomFields.forEach(field => {
  //     if ($.trim(field.displayName).length <= 0) {
  //       this.isValid = false;
  //        errorMessage = "Please enter the display name";
  //     }
  //   });

  //   if (this.isValid) {
  //     this.saveLeadCustomFields();
  //   } else {
  //     this.customResponse = new CustomResponse('ERROR', errorMessage, true);
  //     this.referenceService.goToTop();
  //   }
  // }

  // saveLeadCustomFields() {
  //   this.ngxloading = true;
  //   this.customFieldsDtosLoader = true;
  //   this.leadService.saveCustomLeadFields(this.leadCustomFields).subscribe(data => {
  //     if (data.statusCode == 200) {
  //       this.customResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
  //       this.ngxloading = false;
  //       this.customFieldsDtosLoader = false;
  //       this.referenceService.goToTop();
  //       this.getLeadFields();
  //     }
  //   },
  //     error => {
  //       this.ngxloading = false;
  //       this.customFieldsDtosLoader = false;
  //       let errorMessage = this.referenceService.getApiErrorMessage(error);
  //       this.customResponse = new CustomResponse('ERROR', errorMessage, true);
  //     }
  //   );
  // }


	listSalesforceCustomFields(opportunityType: any) {
		this.ngxloading = true;
		let self = this;
		this.customFieldsDtosLoader = true;
		self.integrationService.getLeadCustomFields()
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
					(customField.label.toLowerCase().includes(this.searchKey.trim().toLowerCase()) || customField.name.toLowerCase().includes(this.searchKey.trim().toLowerCase()))
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

		//  if (this.integrationType.toLowerCase() === 'salesforce') {
			// const displayName = this.selectedCustomFieldsDtos.find(field => $.trim(field.displayName).length <= 0);
			// if(displayName)
			// {
			// 	this.ngxloading = false;
			// 	const missingFields: string[] = [];
			// 	this.selectedCustomFieldsDtos.forEach(field => {
			// 				if ($.trim(field.displayName).length <= 0) {
			// 					missingFields.push(field.label);
			// 				}
			// 			});
			// 			const missingFieldsMessage = missingFields.join(', ');
			// 			this.referenceService.goToTop();
			// 			this.customFieldsResponse = new CustomResponse('ERROR', `Please enter the display name for ${missingFieldsMessage} field(s).`, true);
			// 			return this.notifySubmitSuccess.emit(this.customFieldsResponse);	
            
			// }
      this.customFields.loggedInUserId = this.loggedInUserId;
      this.customFields.selectedFields = this.selectedCustomFieldsDtos;
      this.customFields.objectType = 'LEAD';
			this.integrationService.syncCustomFieldsForm(this.customFields)
		 		.subscribe(
		 			data => {
		 				this.ngxloading = false;
						if (data.statusCode == 200) {
              this.customResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
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
      // }
		//  } else {
		// this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
		// if(this.integrationType.toLowerCase() != 'salesforce'){
		// 	this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
		// 	$.each(this.sfCustomFieldsResponse,function(_index:number,customFiledDto:any){
		// 		if(customFiledDto.selected){
		// 			let selectedCustomFieldsDto = new CustomFieldsDto();
		// 			selectedCustomFieldsDto.name = customFiledDto.name;
		// 			selectedCustomFieldsDto.label = customFiledDto.label;
		// 			selectedCustomFieldsDto.required = customFiledDto.required;
		// 			selectedCustomFieldsDto.placeHolder = customFiledDto.placeHolder;
		// 			selectedCustomFieldsDto.displayName = customFiledDto.displayName;
		// 			selectedCustomFieldsDto.formDefaultFieldType = customFiledDto.formDefaultFieldType;
		// 			selectedCustomFieldsDto.options = customFiledDto.options;
		// 			selectedCustomFieldsDto.originalCRMType = customFiledDto.originalCRMType;
		// 			self.selectedCustomFieldsDtos.push(selectedCustomFieldsDto);
		// 		}
		// 	});
		// }
		// 	const amountField = this.selectedCustomFieldsDtos.find(field => field.formDefaultFieldType === 'AMOUNT');
		// 	const closeDateField = this.selectedCustomFieldsDtos.find(field => field.formDefaultFieldType === 'CLOSE_DATE');
		// 	const dealNameField = this.selectedCustomFieldsDtos.find(field => field.formDefaultFieldType === 'DEAL_NAME');
		// 	const displayName = this.selectedCustomFieldsDtos.find(field => $.trim(field.displayName).length <= 0);	
		// 	 if (((this.integrationType === 'HUBSPOT') && (!amountField || !closeDateField || !dealNameField)) && (!this.authenticationService.module.isTeamMember || this.authenticationService.module.isAdmin)) {
		// 		 this.ngxloading = false;
		// 		 const missingFields: string[] = [];
		// 		 if (!amountField) {
		// 			missingFields.push('Amount');
		// 		 }
		// 		 if (!closeDateField) {
		// 			 missingFields.push('Close Date');
		// 		 }
		// 		 if (!dealNameField) {
		// 			 missingFields.push('Deal Name');
		// 		 }
		// 		 const missingFieldsMessage = missingFields.join(', ');
		// 		 this.referenceService.goToTop();
		// 		 this.customFieldsResponse = new CustomResponse('ERROR', `Please Map the ${missingFieldsMessage} field(s).`, true);	
		// 		 return this.notifySubmitSuccess.emit(this.customFieldsResponse);
		// 	}
		// 	if((this.integrationType === 'HUBSPOT' || this.integrationType === 'PIPEDRIVE' || this.integrationType === 'CONNECTWISE' || this.integrationType === 'HALOPSA' || this.integrationType === 'ZOHO') && displayName)
		// 	{
		// 		this.ngxloading = false;
		// 		const missingFields: string[] = [];
		// 		this.selectedCustomFieldsDtos.forEach(field => {
		// 					if ($.trim(field.displayName).length <= 0) {
		// 						missingFields.push(field.label);
		// 					}
		// 				});
		// 				const missingFieldsMessage = missingFields.join(', ');
		// 				this.referenceService.goToTop();
		// 				this.customFieldsResponse = new CustomResponse('ERROR', `Please enter the display name for ${missingFieldsMessage} field(s).`, true);
		// 				return this.notifySubmitSuccess.emit(this.customFieldsResponse);
		// 	}
		//  	this.integrationService.syncCustomForm(this.loggedInUserId, this.selectedCustomFieldsDtos, this.integrationType.toLowerCase(), this.opportunityType)
		// 		.subscribe(
		//  			data => {
	 	// 			this.ngxloading = false;
		// 				if (data.statusCode == 200) {
		//  					this.customFieldsResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
    //                         this.notifySubmitSuccess.emit(this.customFieldsResponse );
		// 					 this.isFilterApplied = false;
		// 					 this.isSortApplied = false;
		//  					// this.listExternalCustomFields();
		//  				}
		// 			},
		// 			error => {
		// 				this.ngxloading = false;
		// 			},
		//  			() => { }
		//  		);
		//  }

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

		this.setAllParentFieldsSelected(sfCustomField,isChecked);

	}


	setAllParentFieldsSelected(sfCustomField: any, isChildChecked: any) {
		if (sfCustomField.controllerName != null && sfCustomField.controllerName != undefined) {
			let cfParentName = sfCustomField.controllerName;
			if (isChildChecked) {
				$('#' + cfParentName).prop('checked', true);
			}
			let sfParentName = sfCustomField.controllerName;
			let sfParentFields = this.sfCustomFieldsResponse.filter(field => field.name === sfParentName);
			for (let sfParentfield of sfParentFields) {
				if (isChildChecked) {
					let cfName = sfParentfield.name;
					if (this.selectedCfIds.indexOf(cfName) == -1) {
						this.selectedCfIds.push(cfName);
						this.selectedCustomFieldsDtos.push(sfParentfield);
					}
					if (this.paginatedSelectedIds.indexOf(cfName) == -1) {
						this.paginatedSelectedIds.push(cfName);
					}
					sfParentfield.selected = true;
					sfParentfield.canUnselect = false;
					this.selectedCustomFieldsDtos = this.referenceService.removeDuplicates(this.selectedCustomFieldsDtos);
				} else {
					let cfParentName = sfCustomField.controllerName;
					$('#' + cfParentName).prop('checked', true);
					sfParentfield.canUnselect = true;
					sfParentfield.selected = true;
				}

				if (sfParentfield.controllerName != null && sfParentfield.controllerName != undefined) {
					let cfParentName = sfParentfield.controllerName;
					let isChecked = false;
					if (sfParentfield.selected || !(sfParentfield.canUnselect)) {
						$('#' + cfParentName).prop('checked', true);
						isChecked = true;
					}
					this.setAllParentFieldsSelected(sfParentfield, isChecked);
				}
			}
		}
	}

	checkIfhasParentField(sfCustomField: any, isChecked: any) {
		if (sfCustomField.controllerName != null && sfCustomField.controllerName != undefined) {
			let cfParentName = sfCustomField.controllerName;
			if (isChecked) {
				$('#' + cfParentName).prop('checked', true);
			}
			this.setParentFieldSelected(sfCustomField, isChecked);
		}
	}

	checkIParentFieldisUnChecked(sfCustomField: any) {
		if (sfCustomField.controllerName != null && sfCustomField.controllerName != undefined) {
			let sfParentName = sfCustomField.controllerName;
			let sfParentFields = this.sfCustomFieldsResponse.filter(field => field.name === sfParentName);
			for (let sfParentfield of sfParentFields) {
				let hasParentLabel = this.sfcfPagedItems.some(field => field.name === sfParentName);
				if (sfCustomField.canUnselect) {
					if (hasParentLabel || !(sfParentfield.canUnselect)) {
						sfParentfield.selected = false;
						sfParentfield.canUnselect = true;
						this.checkIParentFieldisUnChecked(sfParentfield);
					}
				} else {
					let cfParentName = sfCustomField.controllerName;
					$('#' + cfParentName).prop('checked', true);
					sfCustomField.selected = true;
					sfCustomField.canUnselect = false;
					sfParentfield.selected = true;
					sfParentfield.canUnselect = false;
				}
			}
		}
	}


	setParentFieldSelected(sfCustomField: any, isChildChecked: any) {
		if (sfCustomField.controllerName != null && sfCustomField.controllerName != undefined) {
			let sfParentName = sfCustomField.controllerName;
			let sfParentFields = this.sfCustomFieldsResponse.filter(field => field.name === sfParentName);
			for (let sfParentfield of sfParentFields) {
				if (isChildChecked) {
					let cfName = sfParentfield.name;
					if (this.selectedCfIds.indexOf(cfName) == -1) {
						this.selectedCfIds.push(cfName);
						this.selectedCustomFieldsDtos.push(sfParentfield);
					}
					if (this.paginatedSelectedIds.indexOf(cfName) == -1) {
						this.paginatedSelectedIds.push(cfName);
					}
					sfParentfield.selected = true;
					sfParentfield.canUnselect = false;
					this.selectedCustomFieldsDtos = this.referenceService.removeDuplicates(this.selectedCustomFieldsDtos);
				} else {
					let cfParentName = sfParentfield.controllerName;
					$('#' + cfParentName).prop('checked', true);
					sfParentfield.canUnselect = true;
					sfParentfield.selected = true;
				}
			}
		}
	}

	// reloadCustomFields() {
	// 	this.sfcfPagedItems = [];
	// 	this.sfcfMasterCBClicked = false;
	// 	this.searchKey = '';
	// 	this.sortOption = '';
	// 	this.isFilterApplied = false;
	// 	this.isSortApplied = false;
	// 	this.customFieldsResponse.isVisible = false;
	// 	if (this.integrationType.toLowerCase() === 'salesforce') {
	// 		this.listSalesforceCustomFields(this.opportunityType);
	// 	} else {
	// 		this.listExternalCustomFields();
	// 	}
	// }

  // getIntegrationDealPipelines() {
	// 	this.ngxloading = true;
	// 	this.integrationService.getCRMPipelines(this.loggedInUserId, this.integrationType)
	// 	.subscribe(
	// 	  data => {
	// 	    this.referenceService.loading(this.httpRequestLoader, false);
	// 	    if (data.statusCode == 200) {
	// 			this.integrationPipelines = data.data;
	// 	    }
	// 		this.ngxloading = false;
	// 	  },
	// 	  error => {
	// 		this.ngxloading = false;
	// 	    this.httpRequestLoader.isServerError = true;
	// 	  },
	// 	  () => { }
	// 	);
	// }

  // getActiveCRMDetails() {
	// 	this.integrationService.getActiveCRMDetailsByUserId(this.loggedInUserId)
	// 		.subscribe(
	// 			data => {
	// 				this.ngxloading = false;
	// 				this.activeCRMDetails = data.data;
	// 			});
	// }

	// getIntegrationDetails() {
	// 	this.ngxloading = true;
	// 	let self = this;
	// 	self.integrationService.getIntegrationDetails(this.integrationType.toLowerCase(), this.loggedInUserId)
	// 		.subscribe(
	// 			data => {
	// 				this.ngxloading = false;
	// 				if (data.statusCode == 200) {
	// 					this.integrationDetails = data.data;
	// 				}
	// 			},
	// 			error => {
	// 				this.ngxloading = false;
	// 			},
	// 			() => {
	// 				if (this.integrationType.toLowerCase() === 'salesforce') {
	// 					// this.listSalesforceCustomFields(this.opportunityType);
	// 				} else {						
	// 					if (this.integrationType.toLowerCase() === 'hubspot' || this.integrationType.toLowerCase() === 'pipedrive') {
	// 						this.getIntegrationDealPipelines();
	// 					}
	// 					this.listExternalCustomFields();
	// 				}
	// 			}
	// 		);
	// }

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
			$.each(this.sfcfPagedItems, function (index: number, value: any) {
				value.selected = true;
				self.selectedCustomFieldsDtos.push(value);
				self.setAllParentFieldsSelected(value, true);
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
			$.each(self.sfcfPagedItems, function (index: number, value: any) {
				if (value.canUnselect) {
					value.selected = false;
					self.selectedCustomFieldsDtos.splice(self.selectedCustomFieldsDtos.indexOf(value), 1);
					if (value.controllerName != null && value.controllerName != undefined) {
						self.checkIfhasParentField(value, false);
						self.checkIParentFieldisUnChecked(value);
					}
				}
			});
			self.selectedCustomFieldsDtos = this.referenceService.removeDuplicates(this.selectedCustomFieldsDtos);
		}
		ev.stopPropagation();
	}
	toggleSettings(sfCustomField){
		sfCustomField.showSettings = !sfCustomField.showSettings;
	}
		
	// onFieldSelectionChange(selectedField: any): void {
	// 	const selectedFieldType = selectedField.formDefaultFieldType;
	// 	const selectedFieldTypeName = selectedField.type;

	// 	selectedField.typeMismatch = false;
	// 	selectedField.typeMismatchMessage = '';

	// 	if (selectedFieldType === null) {
	// 		selectedField.canUnselect = true;
	// 		return;
	// 	}

	// 	if (
	// 		(selectedFieldType === 'AMOUNT' && selectedFieldTypeName !== 'number') ||
	// 		(selectedFieldType === 'DEAL_NAME' && selectedFieldTypeName !== 'text') ||
	// 		(selectedFieldType === 'CLOSE_DATE' && selectedFieldTypeName !== 'date')
	// 	) {
	// 		selectedField.typeMismatch = true;
	// 		selectedField.typeMismatchMessage = `Type mismatch for ${selectedFieldType}. Expected type is ${selectedFieldType === 'AMOUNT' ? 'number' : selectedFieldType === 'DEAL_NAME' ? 'text' : 'date'
	// 			}.`;
	// 		selectedField.formDefaultFieldType = null;
	// 		return;
	// 	}

	// 	let countSelectedType = 0;

	// 	this.sfCustomFieldsResponse.forEach(field => {
	// 		if (
	// 			field.formDefaultFieldType === selectedFieldType &&
	// 			((selectedFieldTypeName === 'number' && selectedFieldType === 'AMOUNT') ||
	// 				(selectedFieldTypeName === 'text' && selectedFieldType === 'DEAL_NAME') ||
	// 				(selectedFieldTypeName === 'date' && selectedFieldType === 'CLOSE_DATE'))
	// 		) {
	// 			countSelectedType++;
	// 			field.required = true;
	// 			field.canUnselect = false;
	// 			field.canEditRequired = false;
	// 		} else {
	// 			field.typeMismatch = false;
	// 			field.typeMismatchMessage = '';
	// 		}
	// 	});

	// 	if (countSelectedType > 1) {
	// 		this.sfCustomFieldsResponse.forEach(field => {
	// 			if (
	// 				field.formDefaultFieldType === selectedFieldType &&
	// 				((selectedFieldTypeName === 'number' && selectedFieldType === 'AMOUNT') ||
	// 					(selectedFieldTypeName === 'text' && selectedFieldType === 'DEAL_NAME') ||
	// 					(selectedFieldTypeName === 'date' && selectedFieldType === 'CLOSE_DATE')) &&
	// 				field !== selectedField
	// 			) {
	// 				field.formDefaultFieldType = null;
	// 				field.canUnselect = true;
	// 				field.canEditRequired = true;
	// 			}
	// 		});
	// 	}
	// }


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
		// if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		// }
	}

	clearFieldSearch() {
		this.searchKey = '';
		// if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		// } else {
			// this.listExternalCustomFields();
		// }
	}

	sortFieldsByOption() {
		this.isSortApplied = true;
		// if (this.integrationType.toLowerCase() === 'salesforce') {
			this.listSalesforceCustomFields(this.opportunityType);
		// } else {
			// this.listExternalCustomFields();
		// }
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

  //XNFR-662
  addCustomFieldsdModalOpen(){
    this.isAddCustomFieldsModelPopUp = true;
  }

  closeAddCustomFieldsModal(event: any) {
    if (event === "0") {
      this.isAddCustomFieldsModelPopUp = false;
      this.customResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
    }
  }

}


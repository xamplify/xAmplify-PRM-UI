import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeadsService } from 'app/leads/services/leads.service';
import { LeadCustomFieldDto } from 'app/leads/models/lead-custom-field';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomFieldsDto } from '../models/custom-fields-dto';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { CustomFields } from '../models/custom-fields';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { SortOption } from 'app/core/models/sort-option';
declare var $: any, swal: any;

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
	pagination: Pagination = new Pagination();
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

	// sortOptions = [
	// 	{ 'name': 'Sort by', 'value': '' },
	// 	{ 'name': 'Field name (A-Z)', 'value': 'asc' },
	// 	{ 'name': 'Field name (Z-A)', 'value': 'desc' },
	// ];

	// public sortOption: any = this.sortOptions[0].value;
	
	

  constructor(private leadService: LeadsService, public pagerService: PagerService, public referenceService: ReferenceService,public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent, public authenticationService: AuthenticationService, public integrationService: IntegrationService, public sortOption: SortOption) { 
        this.pageNumber = this.paginationComponent.numberPerPage[0];
		this.loggedInUserId = this.authenticationService.getUserId();
		this.isPartnerTeamMember = this.authenticationService.isPartnerTeamMember;
  }

  ngOnInit() {
	this.listCustomFields(this.pagination);
  }
  
	listSalesforceCustomFields(opportunityType: any) {
		this.ngxloading = true;
		let self = this;
		this.customFieldsDtosLoader = true;
		self.integrationService.getLeadCustomFields(this.pagination)
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
					}
					this.customFieldsDtosLoader = false;
				},
				error => {
					this.ngxloading = false;
					this.haveCustomFields = false;
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
			// if (this.sortOption !== undefined){ 
			// 	if (this.sortOption === 'asc') {
			// 		this.sfCustomFieldsResponse.sort((a, b) => a.label.localeCompare(b.label));
			// 	} else if (this.sortOption === 'desc') {
			// 		this.sfCustomFieldsResponse.sort((a, b) => b.label.localeCompare(a.label));
			// 	} else if (this.sortOption === '') {
			// 		this.sfCustomFieldsResponse.sort((a, b) => {
			// 			if (a.canUnselect && !b.canUnselect) {
			// 				return 1;
			// 			} else if (!a.canUnselect && b.canUnselect) {
			// 				return -1;
			// 			}

			// 			if (!a.selected && b.selected) {
			// 				return 1;
			// 			} else if (a.selected && !b.selected) {
			// 				return -1;
			// 			}

			// 			return a.label.localeCompare(b.label);
			// 		});
			// 	}
			// }
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
	}
	closeSfSettings() {
		this.closeEvent.emit();
	}

	selectCf(sfCustomField: any, event: any) {
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
			this.isHeaderCheckBoxChecked =  true;
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
			this.isHeaderCheckBoxChecked =  false;	
			sfCustomField.selected = false;
			sfCustomField.required = false;
		}
		event.stopPropagation();
		// this.isHeaderCheckBoxChecked = this.paginatedSelectedIds.length == this.sfcfPagedItems.length;
	}

	checkAll(event: any) {
		// this.selectedCfIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('customFields-tr', 'custom-fields-table', 'sfcf', this.selectedCfIds, this.pagination, event);
		if (event.target.checked) {
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
					}
				}
			});
			self.selectedCustomFieldsDtos = this.referenceService.removeDuplicates(this.selectedCustomFieldsDtos);
		}
		event.stopPropagation();
	}
	toggleSettings(sfCustomField){
		sfCustomField.showSettings = !sfCustomField.showSettings;
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
	addCustomFielsdOrderModalOpen() {
		this.isCustomFieldsOrderModelPopUp = true;
		this.customFieldsList = this.selectedCustomFieldsDtos;
	}

	closeCustomFielsOrderModal(event: any) {
		if (event === "0") {
			this.isCustomFieldsOrderModelPopUp = false;
		}
	}
	toggleHeaderSettings() {
		this.showHeaderTextArea = !this.showHeaderTextArea;
	}

	listCustomFields(pagination: Pagination) {
		this.ngxloading = true;
		let self = this;
		this.pagination.userId = this.loggedInUserId;
		self.integrationService.getLeadCustomFields(this.pagination).subscribe(
			(response: any) => {
				this.ngxloading = false;
				this.sfCustomFieldsResponse = response.data.list;
				this.sortOption.totalRecords = response.data.totalRecords;
				pagination.totalRecords = response.data.totalRecords;
				this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
				self.selectedCfIds = [];
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
			},
			error => {
				this.ngxloading = false;
			},
			() => {
				this.selectedCustomFieldsDtos = new Array<CustomFieldsDto>();
				$.each(this.sfCustomFieldsResponse, function (_index: number, customFiledDto: any) {
					if (customFiledDto.selected) {
						self.selectedCustomFieldsDtos.push(customFiledDto);
					}
				});
			}
		);
	}


  addCustomFieldsdModalOpen(){
    this.isAddCustomFieldsModelPopUp = true;
  }

  closeAddCustomFieldsModal(event: any) {
    if (event === "0") {
      this.isAddCustomFieldsModelPopUp = false;
      this.customResponse = new CustomResponse('SUCCESS', "Submitted Successfully", true);
      this.listSalesforceCustomFields("LEAD");
    }
  }

  confirmDelete(customfield : CustomFieldsDto) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "This Custom Field will be deleted from your Custom Fields.",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function () {
			self.deleteCustomField(customfield);
		}, function (dismiss: any) {
			console.log('you clicked on option' + dismiss);
		});
	}

  deleteCustomField(customfield : CustomFieldsDto){
    this.ngxloading = true;
    this.integrationService.deleteCustomField(customfield, this.loggedInUserId).subscribe(
        response=>{
          if(response.statusCode == 200){
            this.customResponse = new CustomResponse('SUCCESS', "Deleted Successfully", true);
            this.listSalesforceCustomFields("LEAD");
          }
          this.ngxloading = false;
        },error=>{
          this.ngxloading = false;
        });  
  }

  setCustomFieldsPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listCustomFields(this.pagination);
  }

}


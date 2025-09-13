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
	@Input() integrationType: string;
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
	activeTab: string = 'home';
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
	opportunityType: any;
	isSalesForceType = false;
	isCRMSettingsModelPopUp:boolean = false;
	isZohoOrHaloPSAIntegrationValid: boolean = true;
	isLoading : boolean = false;

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
	
	ngOnInit() {
		this.isSalesForceType = this.integrationType!=undefined && (this.integrationType=='SALESFORCE' || this.integrationType=='salesforce');
		this.getIntegrationDetails();
	}
	
	checkAuthorization() {
	
	}

	listSalesforceCustomFields(opportunityType: any) {
		
	}

	listExternalCustomFields() {
		

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

	unlinkCRM() {
	
	}


	getIntegrationDealPipelines() {
	
	}


	activateCRM() {
		

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
		
	}

	getActiveCRMDetails() {
		
	}

	getIntegrationDetails() {
	
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
	setActiveTab(tabName: string) {
		this.activeTab = tabName;
		if(tabName === 'menu1'){
			this.opportunityType = 'DEAL';
			// this.listSalesforceCustomFields(this.opportunityType);
		}
		if(tabName === 'menu2'){
			this.opportunityType = 'LEAD';
			// this.listSalesforceCustomFields(this.opportunityType);
		}
		if (tabName === 'menu3') {
			this.isCRMSettingsModelPopUp = true;
		}
		if (tabName !== 'menu3') {
			this.isCRMSettingsModelPopUp = false;
		}
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

	setCustomResponse(event: any) {
		this.customFieldsResponse = event;
	}


}

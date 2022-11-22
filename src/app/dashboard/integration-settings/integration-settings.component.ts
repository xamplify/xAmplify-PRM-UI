import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IntegrationService } from 'app/core/services/integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var swal, $;

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
  customResponse: CustomResponse = new CustomResponse(); 
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();  
  loading: boolean = false;
  userProfileImage = "assets/images/icon-user-default.png";
  selectedCfIds = [];
  ngxloading: boolean;
  sfCustomFieldsResponse: any;
  sfcfMasterCBClicked: boolean =false;
  requiredCfIds = [];
  paginatedSelectedIds = [];  
  sfcfPager: any = {};
  pageSize: number = 12;
  sfcfPagedItems: any[];
  isHeaderCheckBoxChecked: boolean = false;
  pageNumber: any;
  selectedCustomFieldIds = [];
  customFieldsResponse: CustomResponse = new CustomResponse();
  activeCRMDetails: any;
  integrationDetails: any;
  
  constructor(private integrationService: IntegrationService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent, 
    public referenceService: ReferenceService, public authenticationService: AuthenticationService) {
    this.pageNumber = this.paginationComponent.numberPerPage[0];
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.getIntegrationDetails();
    if (this.integrationType.toLowerCase() === 'salesforce') {
      this.listSalesforceCustomFields();
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
		}, () => {}
    );
  }

  listSalesforceCustomFields() {
		let self = this;
		self.selectedCfIds = [];
		self.integrationService.listSalesforceCustomFields(this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.sfCustomFieldsResponse = data.data;
						this.sfcfMasterCBClicked = false;
						$.each(this.sfCustomFieldsResponse, function(_index: number, customField) {
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
				},
				() => { }
			);
	}

  listExternalCustomFields() {
    this.ngxloading = true;
		let self = this;
		self.selectedCfIds = [];
		self.integrationService.listExternalCustomFields(this.integrationType.toLowerCase(), this.loggedInUserId)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == 200) {
						this.sfCustomFieldsResponse = data.data;
						this.sfcfMasterCBClicked = false;
						$.each(this.sfCustomFieldsResponse, function(_index: number, customField) {
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
					}
				},
				error => {
					this.ngxloading = false;
				},
				() => { }
			);

	}

  setSfCfPage(page: number) {
		this.paginatedSelectedIds = [];
		try {
			if (page < 1 || (this.sfcfPager.totalPages > 0 && page > this.sfcfPager.totalPages)) {
				return;
			}
			this.sfcfPager = this.socialPagerService.getPager(this.sfCustomFieldsResponse.length, page, this.pageSize);
			this.sfcfPagedItems = this.sfCustomFieldsResponse.slice(this.sfcfPager.startIndex, this.sfcfPager.endIndex + 1);
			var cfIds = this.sfcfPagedItems.map(function(a) { return a.name; });
			var items = $.grep(this.selectedCfIds, function(element) {
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
			// this.xtremandLogger.error( error, "setSfCfPage()." )
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
		$('[name="sfcf[]"]:checked').each(function() {
			var id = $(this).val();
			console.log(id);
			self.selectedCustomFieldIds.push(id);
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
      this.integrationService.syncCustomForm(this.loggedInUserId, this.selectedCfIds, this.integrationType.toLowerCase())
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

  selectCf(cfName: string) {
		let isChecked = $('#' + cfName).is(':checked');
		console.log(this.selectedCfIds)
		if (isChecked) {
			if (this.selectedCfIds.indexOf(cfName) == -1) {
				this.selectedCfIds.push(cfName);
			}
			if (this.paginatedSelectedIds.indexOf(cfName) == -1) {
				this.paginatedSelectedIds.push(cfName);
			}

			console.log(this.selectedCfIds);
		} else {
			this.selectedCfIds.splice($.inArray(cfName, this.selectedCfIds), 1);
			this.paginatedSelectedIds.splice($.inArray(cfName, this.paginatedSelectedIds), 1);

		}
		if (this.paginatedSelectedIds.length == this.sfcfPagedItems.length) {
			this.isHeaderCheckBoxChecked = true;
		} else {
			this.isHeaderCheckBoxChecked = false;
		}
		event.stopPropagation();
	}

  reloadCustomFields() {
		this.sfcfPagedItems = [];
		this.sfcfMasterCBClicked = false;
		this.customFieldsResponse.isVisible = false;		
		this.ngxloading = true;
		this.listExternalCustomFields();
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
				let request:any = {};
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

  activateCRM() {
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
				let request:any = {};
				request.userId = self.loggedInUserId;
				request.type = self.integrationType;
				self.ngxloading = true;
				self.integrationService.setActiveCRM(request)
					.subscribe(
						data => {
							if (data.statusCode == 200) {
								self.getIntegrationDetails();
							}
						});
			}, function (dismiss: any) {
			  console.log('you clicked on option' + dismiss);
			});
		  } catch (error) {
			  this.referenceService.showServerError(this.httpRequestLoader);
		  }		
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
				() => { }
      );
  }

  checkAll(ev: any) {
	if (ev.target.checked) {
		$('[name="sfcf[]"]').prop('checked', true);
		let self = this;
		$('[name="sfcf[]"]:checked').each(function() {
			var id = $(this).val();
			self.selectedCfIds.push(id);
			self.paginatedSelectedIds.push(id);
		});
		this.selectedCfIds = this.referenceService.removeDuplicates(this.selectedCfIds);
		this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
	} else {
		let self = this;
		//$( '[name="sfcf[]"]' ).prop( 'checked', false );

		$('[name="sfcf[]"]').each(function() {
			var id = $(this).val();
			if (self.requiredCfIds.indexOf(id) == -1) {
				$(this).prop('checked', false);
				self.paginatedSelectedIds.splice($.inArray(id, self.paginatedSelectedIds), 1);
			}

		});

		if (this.sfcfPager.maxResults == this.sfcfPager.totalItems) {
			this.selectedCfIds = [];
			this.paginatedSelectedIds = [];
			//this.allselectedUsers.length = 0;
		} else {
			//this.paginatedSelectedIds = [];
			let currentPageCfIds = this.sfcfPagedItems.map(function (a) { if (self.requiredCfIds.indexOf(a.name) == -1) { return a.name; } });
			this.paginatedSelectedIds = this.referenceService.removeDuplicates(this.paginatedSelectedIds);
			this.selectedCfIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedCfIds, currentPageCfIds);
		}
	}
	ev.stopPropagation();
}

}

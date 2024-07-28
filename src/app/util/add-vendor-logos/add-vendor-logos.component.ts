import { Component, OnInit, Input, Output, EventEmitter,OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { VendorLogoDetails } from 'app/landing-pages/models/vendor-logo-details';
declare var $: any;
@Component({
  selector: 'app-add-vendor-logos',
  templateUrl: './add-vendor-logos.component.html',
  styleUrls: ['./add-vendor-logos.component.css']
})
export class AddVendorLogosComponent implements OnInit {

	hideButton: boolean;
	@Input() input: any;
	@Output() notifyComponent = new EventEmitter();
	@Output() passValueAndNotifyComponent = new EventEmitter();
	successMessagePrefix = "Copied";
	modalPopupId = "add-vendor-logo-popup";
	@Input()  vendorLogoDetails:VendorLogoDetails[];

	@Input() sharedVendorLogoDetails:VendorLogoDetails[]=[];
	responseMessage="";
	dropdownSettings={};
	selectedItems = [];
	@Input() dropdownList;
	constructor(public authenticationService: AuthenticationService) { }

	ngOnInit() {
		this.hideButton = this.input['hideButton'];

		if (this.hideButton == undefined) {
			this.hideButton = false;
		}
		if (this.hideButton) {
			this.showMergeTagsPopUp();
		}
	}

	ngOnDestroy() {
		$('#' + this.modalPopupId).modal('hide');
	  }  
    
    showMergeTagsPopUp() {
		$('#add-vendor-logo-popup').modal('show');
	}

	hideModal() {
		this.responseMessage = "";
		if ( (this.authenticationService.module.isTeamMember &&  (this.sharedVendorLogoDetails.every(logo=>!logo.selected || (logo.selected && logo.categoryIds!= null && logo.categoryIds.length>0))))
		 || (this.authenticationService.module.isAnyAdminOrSupervisor && (this.sharedVendorLogoDetails.every(logo=>logo.teamMembers.every(member=>!member.selected 
		||(member.selected && member.categoryIds != null && member.categoryIds.length>0)))))){
			this.notifyComponent.emit();
			$('#' + this.modalPopupId).modal('hide');				
		}else{
			this.responseMessage = "Please Select The Catogory('s) for the selected Vendors";
		}
	}

	viewTeamMembers(item: any) {
		this.sharedVendorLogoDetails.forEach((element) => {
			let partnerCompanyId = element.companyId
			let clickedCompanyId = item.companyId;
			if (clickedCompanyId == partnerCompanyId) {
				element.expand = !element.expand;
			}else{
				element.expand= false;
			}
		});
	}	

	selctectLandingPageForCompany(companyId:number, partnerId:number){
		for (let company of this.sharedVendorLogoDetails) {
			if (company.companyId == companyId) {
				for (let member of company.teamMembers) {
					if (member.partnerId != partnerId) {
						member.selected = false;
					}
					if(!member.selected){
						member.categoryIds = [];
						member.selectedCategories =[];
					}
					var dropdownSettings  = {
						text: "Please select",
						selectAllText: 'Select All',
						unSelectAllText: 'UnSelect All',
						enableSearchFilter: true,
						classes: "myclass custom-class",
						disabled: !member.selected,
						};
						member.dropdownSettings = {...dropdownSettings };
				}
			}
		}
	}

	setSelectedCategories(companyId:number, partnerId:number){
		for (let company of this.sharedVendorLogoDetails) {
			if (company.companyId == companyId) {
				for (let member of company.teamMembers) {
					if (member.partnerId == partnerId ) {
						if(member.selectedCategories != null && member.selectedCategories.length > 0){
							member.categoryIds = member.selectedCategories.map(category=>category.id);
						}else{
							member.categoryIds=[];
						}
					}
				}
				console.log(this.sharedVendorLogoDetails)
			}
		}
	}
}

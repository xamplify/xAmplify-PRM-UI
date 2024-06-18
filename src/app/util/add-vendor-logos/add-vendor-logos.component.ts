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
		this.notifyComponent.emit();
		$('#' + this.modalPopupId).modal('hide');
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
				}
			}
		}
		console.log(this.sharedVendorLogoDetails)
	}


}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from '../models/custom-response';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { VendorLogoDetails } from 'app/landing-pages/models/vendor-logo-details';
import { Pagination } from 'app/core/models/pagination';
import { ParterService } from 'app/partners/services/parter.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { PagerService } from 'app/core/services/pager.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
declare var $: any;

@Component({
  selector: 'app-vendor-company-model-popup',
  templateUrl: './vendor-company-model-popup.component.html',
  styleUrls: ['./vendor-company-model-popup.component.css']
})
export class VendorCompanyModelPopupComponent implements OnInit {

	hideButton: boolean;
	@Input() input: any;
	@Output() closePopup = new EventEmitter();
	@Output() passValueAndNotifyComponent = new EventEmitter();
	successMessagePrefix = "Copied";
	modalPopupId = "sharePartnerPagePopup";
	@Input()  vendorLogoDetails:VendorLogoDetails[];

	@Input() sharedVendorLogoDetails:VendorLogoDetails[]=[];
	responseMessage="";
	dropdownSettings={};
	@Input() selectedCompanyIds= [];
	marketPlaceCategoryResponse:CustomResponse = new CustomResponse();

  	pagination:Pagination= new Pagination();
  	@Input() loggedInUserCompanyId: any;
	@Input() loggedInUserId: any;
  	customResponse: CustomResponse = new CustomResponse();
  	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

	constructor(public authenticationService: AuthenticationService, private partnerService:ParterService,
    public referenceService: ReferenceService,public pagerService:PagerService, private landingPageService:LandingPageService,
   ) { }

	ngOnInit() {
			this.getVendorCompanyDetails();
	}

	ngOnDestroy() {
		$('#' + this.modalPopupId).modal('hide');
	  }  
    
    getVendorCompanyDetails() {

      this.pagination.userId = this.authenticationService.getUserId();
      this.pagination.companyId = this.loggedInUserCompanyId;
      this.partnerService.findVendorCompanies(this.pagination).subscribe((result: any) => {
        let data = result.data;
        this.pagination.totalRecords = data.totalRecords;
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.list);
        $('#sharePartnerPagePopup').modal('show');
      }, _error => {
      });
	}

	hideModal() {
		this.marketPlaceCategoryResponse = new CustomResponse();
			this.closePopup.emit();
			$('#' + this.modalPopupId).modal('hide');				
	}

  highlightSelectedCompany(companyId){
	let isChecked = $('#vendorCompany'+companyId).is(':checked');

    if(isChecked){
      if(!(this.selectedCompanyIds.indexOf(companyId)>-1)){
        this.selectedCompanyIds.push(companyId);
      }
    }else{
      this.selectedCompanyIds.splice($.inArray(companyId, this.selectedCompanyIds), 1);
    }
  }

  publish() {
		this.customResponse = new CustomResponse();
		if (this.selectedCompanyIds.length > 0 || this.selectedCompanyIds ) {
			this.setValuesAndPublish();
		} else {
			this.referenceService.goToTop();
			this.customResponse = new CustomResponse('ERROR', 'Please select atleast one row', true);
		}
	}

  setValuesAndPublish(){
		  this.referenceService.startLoader(this.httpRequestLoader);
		  let shareLandingPageDTO = {
			  "loggedInUserId": this.loggedInUserId,
			  "vendorJourneyLandingPageId": this.input,
			  "vendorCompanyIds": this.selectedCompanyIds
		  }
		  
	  	this.shareLandingPageToPartners(shareLandingPageDTO);
		}

		shareLandingPageToPartners(shareLandingPageDTO : any){
			this.landingPageService.sharePartnerJourneyLandingPageToPartners(shareLandingPageDTO).subscribe((data: any) => {
				this.referenceService.scrollToModalBodyTopByClass();
				if (data.access) {
					if (data.statusCode == 200) {
						this.responseMessage = "Published Successfully";
					} else {
						this.responseMessage = data.message;
					}
					this.closePopupEmit(this.responseMessage)
				} else {
					this.authenticationService.forceToLogout();
				}
			}, _error => {
				this.referenceService.goToTop();
			});
		}

		closePopupEmit(message) {
			this.closePopup.emit(message);
		}

  
}

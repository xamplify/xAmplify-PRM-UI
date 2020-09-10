import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { MdfService } from '../services/mdf.service';
/*****Common Imports**********************/
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router } from '@angular/router';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ErrorResponse } from 'app/util/models/error-response';
import { MdfPartnerDto } from '../models/mdf-partner-dto';
import { MdfDetails } from '../models/mdf-details';
import { MdfAmountType } from '../models/mdf-amount-type.enum';
declare var $: any;

@Component({
	selector: 'app-add-mdf-funds-modal-popup',
	templateUrl: './add-mdf-funds-modal-popup.component.html',
	styleUrls: ['./add-mdf-funds-modal-popup.component.css', '../mdf-html/mdf-html.component.css'],
	providers: [Properties]

})
export class AddMdfFundsModalPopupComponent implements OnInit {

	modalPopupLoader: boolean;
	loggedInUserCompanyId: number = 0;
	loggedInUserId: number = 0;
	loading = false;
	customResponse: CustomResponse = new CustomResponse();
	mdfPartnerDto: MdfPartnerDto = new MdfPartnerDto();
	mdfDetails: MdfDetails = new MdfDetails();
	errorResponses: Array<ErrorResponse> = new Array<ErrorResponse>();
	errorFieldNames: Array<string> = new Array<string>();
  	MdfAmountType = MdfAmountType;
	@Input() partnershipId:number;
	@Output() notifyParentComponent = new EventEmitter();
	@Output() updateList = new EventEmitter();
	modalPopupId = "addMdfAmountPopup";
	constructor(private mdfService: MdfService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, private router: Router, public properties: Properties) {
		this.loggedInUserId = this.authenticationService.getUserId();
	}


	ngOnInit() {
		if(this.partnershipId!=undefined && this.partnershipId>0){
			this.modalPopupLoader = true;
			$("#"+this.modalPopupId).modal('show');
			this.getPartnerAndMdfAmountDetails();
		}else{
			this.referenceService.showSweetAlertErrorMessage("Partnership does not exists");
		}

	}

	getPartnerAndMdfAmountDetails() {
		this.mdfService.getPartnerAndMdfAmountDetails(this.partnershipId).subscribe((result: any) => {
			this.mdfPartnerDto = result.data;
			console.log(this.mdfPartnerDto);
			this.mdfDetails = new MdfDetails();
			this.mdfDetails.partnershipId = this.mdfPartnerDto.partnershipId;
			this.mdfDetails.mdfAmountTypeInString = MdfAmountType[MdfAmountType.FUND_ADDED];
			this.mdfDetails.calculatedAvailableBalance = this.mdfPartnerDto.availableBalance;
			this.modalPopupLoader = false;
		}, error => {
		  this.xtremandLogger.log(error);
		  $('#'+this.modalPopupId).modal('hide');
		  this.referenceService.showSweetAlertErrorMessage(this.properties.serverErrorMessage);
		});
	  }

	  updateFieldsStatus() {
		this.calculateTotalAvailableBalance();
	  }
	
	  calculateTotalAvailableBalance() {
		this.resetErrors();
		let mdfAmount = 0;
		if (this.mdfDetails.mdfAmount != undefined) {
		  mdfAmount = this.mdfDetails.mdfAmount;
		}
		if ((this.mdfDetails.mdfAmountTypeInString==MdfAmountType[MdfAmountType.FUND_ADDED])) {
		  this.mdfDetails.calculatedAvailableBalance = this.mdfPartnerDto.availableBalance + mdfAmount;
		} else {
		  this.mdfDetails.calculatedAvailableBalance = this.mdfPartnerDto.availableBalance - mdfAmount;
		  this.mdfDetails.allocationDateInString = "";
		  this.mdfDetails.expirationDateInString = "";
		}
	  }

	closeMdfAmountPopup() {
		$('#'+this.modalPopupId).modal('hide');
		this.mdfDetails = new MdfDetails();
		this.mdfPartnerDto = new MdfPartnerDto();
		this.resetErrors();
	}

	hidePopup(){
		this.notifyParentComponent.emit();
		this.closeMdfAmountPopup();
	}
	
	updateParentComponent(){
		this.updateList.emit();	
		this.closeMdfAmountPopup();
	}

	resetErrors() {
		this.errorFieldNames = [];
		this.errorResponses = new Array<ErrorResponse>();
		this.customResponse = new CustomResponse();
	  }

	
	  updateMdfAmount() {
		this.modalPopupLoader = true;
		this.resetErrors();
		this.mdfDetails.createdBy = this.loggedInUserId;
		this.mdfService.updateMdfAmount(this.mdfDetails).subscribe(
		  (result: any) => {
			if (result.statusCode == 200) {
			  if(this.mdfDetails.mdfAmountTypeInString==MdfAmountType[MdfAmountType.FUND_ADDED]){
				this.referenceService.showSweetAlertSuccessMessage("Fund Added Successfully");
				this.updateParentComponent();
			  }else{
				this.referenceService.showSweetAlertSuccessMessage("Fund Removed Successfully");
			  }
			 this.closeMdfAmountPopup();
			} else {
			  this.errorResponses = result.errorResponses;
			  this.errorFieldNames = this.referenceService.filterSelectedColumnsFromArrayList(this.errorResponses,'field');
			}
			this.modalPopupLoader = false;
		  }, error => {
			this.modalPopupLoader = false;
			this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
			this.xtremandLogger.log(error);
		  });
	  }

}

import { CustomResponse } from 'app/common/models/custom-response';
import { AgencyContentStatusDto } from './../../common/models/agency-content-status-dto';
import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $:any;
@Component({
  selector: 'app-change-agency-content-status',
  templateUrl: './change-agency-content-status.component.html',
  styleUrls: ['./change-agency-content-status.component.css'],
  providers:[CustomResponse]
})
export class ChangeAgencyContentStatusComponent implements OnInit,OnDestroy {

  templateStatusArray = ['REQUESTED','APPROVED','REJECTED'];
	templateStautsChangeSweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
	isUpdateAgencyTemplateStatus = false;
  loader = false;
  @Input() agencyContentStatusDto:AgencyContentStatusDto;
  @Output() agencyContentStatusEventEmitter = new EventEmitter();
  agencyContentStatusModalPopUpId = "changeAgencyContentStatusModalPopUp";
  customResponse:CustomResponse = new CustomResponse();
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    if(this.agencyContentStatusDto.id!=undefined){
      this.referenceService.showModalPopup(this.agencyContentStatusModalPopUpId);
    }else{
      this.referenceService.showSweetAlertServerErrorMessage();
    }
  }

  ngOnDestroy(): void {
    this.closeModalPopUp();
  }
  closeModalPopUp() {
    this.referenceService.closeModalPopup(this.agencyContentStatusModalPopUpId);
    this.agencyContentStatusEventEmitter.emit();
  }


  updateStatus(){
    alert(this.agencyContentStatusDto.status+":::::::::::::::"+this.agencyContentStatusDto.id);
    this.loader = true;
    this.authenticationService.updateAgencyContentStatus(this.agencyContentStatusDto)
    .subscribe(
      response=>{
        this.loader = false;
        this.customResponse = new CustomResponse('SUCCESS',response.message,true);
      },error=>{
        this.customResponse = this.referenceService.showServerErrorCustomResponse();
      });

  }

	updateAgencyTemplateStatus(event:any){
		if(event){

		}else{
			this.isUpdateAgencyTemplateStatus = false;
  	}
	}


}

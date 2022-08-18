import { AgencyContentStatusDto } from './../../common/models/agency-content-status-dto';
import { Component, OnInit,Input,Output,EventEmitter, OnDestroy } from '@angular/core';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { CustomResponse } from 'app/common/models/custom-response';

declare var $:any;
@Component({
  selector: 'app-change-agency-content-status',
  templateUrl: './change-agency-content-status.component.html',
  styleUrls: ['./change-agency-content-status.component.css'],
  animations:[CustomAnimation]
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
  statusUpdated = false;
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService) { }

  ngOnInit() {
    if(this.agencyContentStatusDto.id!=undefined){
      if(this.agencyContentStatusDto.status!=this.templateStatusArray[0]){
        this.templateStatusArray.shift();
      }
      this.referenceService.showModalPopup(this.agencyContentStatusModalPopUpId);
    }else{
      this.referenceService.showSweetAlertServerErrorMessage();
    }
  }

  ngOnDestroy(): void {
    this.closeModalPopUp(this.statusUpdated);
  }
  closeModalPopUp(statusUpdated:boolean) {
    this.referenceService.closeModalPopup(this.agencyContentStatusModalPopUpId);
    this.agencyContentStatusEventEmitter.emit(statusUpdated);
  }


  updateStatus(){
    this.loader = true;
    this.customResponse = new CustomResponse();
    this.authenticationService.updateAgencyContentStatus(this.agencyContentStatusDto)
    .subscribe(
      response=>{
        this.loader = false;
        this.closeModalPopUp(true);
        this.referenceService.showSweetAlertSuccessMessage(response.message);
      },error=>{
        this.loader = false;
        this.customResponse = this.referenceService.showServerErrorCustomResponse();
      });

  }


}

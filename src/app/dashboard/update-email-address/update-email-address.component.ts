import { ChangeEmailAddressRequestDto } from './../models/change-email-address-request-dto';
import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from '../dashboard.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { Properties } from 'app/common/models/properties';
@Component({
  selector: 'app-update-email-address',
  templateUrl: './update-email-address.component.html',
  styleUrls: ['./update-email-address.component.css'],
  animations :[CustomAnimation],
  providers:[Properties]
})
export class UpdateEmailAddressComponent implements OnInit {

  updateEmailAddressLoader = false;
  updateEmailAddressResponse:CustomResponse = new CustomResponse();
  isUpdateButtonDisabled = true;
  changeEmailAddressRequestDto:ChangeEmailAddressRequestDto = new ChangeEmailAddressRequestDto();
  isEmailAddressUpdatedSuccessfully = false;
  isCampaignEmailAddressUpdatedSuccessfully = false;
  isAccessTokenRemoved = false;
  statusCode = 0;

  constructor(public referenceService:ReferenceService,public dashboardService:DashboardService,public properties:Properties) { }

  ngOnInit() {
  }


  closeUpdateEmailAddressAccountModal(){
    this.referenceService.closeModalPopup("update-email-address-modal");
    this.changeEmailAddressRequestDto = new ChangeEmailAddressRequestDto();
  }

  openModalPopup(){
    this.referenceService.openModalPopup("update-email-address-modal");
  }

  updateEmailAddress(){
    this.updateEmailAddressResponse = new CustomResponse();
    this.updateEmailAddressLoader = true;
    this.changeEmailAddressRequestDto.existingEmailAddressErrorMessage = "";
    this.changeEmailAddressRequestDto.updatedEmailAddressErrorMessage = "";
    this.dashboardService.updateEmailAddress(this.changeEmailAddressRequestDto).subscribe(
      response=>{
        this.statusCode = response.statusCode;
        if(this.statusCode==400){
          let errorObjects = response.data.errorMessages;
          errorObjects.forEach((errorObject: { field: any; message: any; }) => {
            let field = errorObject.field;
            let errorMessage = errorObject.message;
            if(field=="existingEmailAddress"){
              this.changeEmailAddressRequestDto.existingEmailAddressErrorMessage = errorMessage;
            }
            if(field=="updatedEmailAddress"){
              this.changeEmailAddressRequestDto.updatedEmailAddressErrorMessage = errorMessage;
            }
          });
        }else{
          this.isEmailAddressUpdatedSuccessfully = true;
        }
        this.updateEmailAddressLoader = false;
      },error=>{
        this.updateEmailAddressLoader = false;
        this.updateEmailAddressResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      },()=>{

      });
  }

  validateExistingEmailAddress(){
    this.changeEmailAddressRequestDto.isValidExistingEmailAddress = this.referenceService.validateEmailId(this.changeEmailAddressRequestDto.existingEmailAddress);
    this.changeEmailAddressRequestDto.existingEmailAddressErrorMessage = this.changeEmailAddressRequestDto.isValidExistingEmailAddress ? '' : 'Please enter a valid email address';
    this.isUpdateButtonDisabled = !this.changeEmailAddressRequestDto.isValidExistingEmailAddress && !this.changeEmailAddressRequestDto.isValidUpdatedEmailAddress;
  }

  validateUpdatedEmailAddress(){
    this.changeEmailAddressRequestDto.isValidUpdatedEmailAddress = this.referenceService.validateEmailId(this.changeEmailAddressRequestDto.updatedEmailAddress);
    this.changeEmailAddressRequestDto.updatedEmailAddressErrorMessage = this.changeEmailAddressRequestDto.isValidUpdatedEmailAddress ? '' : 'Please enter a valid email address';
    this.isUpdateButtonDisabled = !this.changeEmailAddressRequestDto.isValidExistingEmailAddress && !this.changeEmailAddressRequestDto.isValidUpdatedEmailAddress;
  }
  

  
}

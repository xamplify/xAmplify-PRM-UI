import { ChangeEmailAddressRequestDto } from './../models/change-email-address-request-dto';
import { Component, OnInit } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
import { Properties } from 'app/common/models/properties';
import { SuperAdminServiceService } from '../super-admin-service.service';

@Component({
  selector: 'app-update-email-address',
  templateUrl: './update-email-address.component.html',
  styleUrls: ['./update-email-address.component.css'],
  animations :[CustomAnimation],
  providers:[Properties]
})
export class UpdateEmailAddressComponent implements OnInit {

  validateEmailAddressLoader = false;
  updateEmailAddressResponse:CustomResponse = new CustomResponse();
  isUpdateButtonDisabled = true;
  changeEmailAddressRequestDto:ChangeEmailAddressRequestDto = new ChangeEmailAddressRequestDto();
  isEmailAddressValidatedSuccessfully = false;
  isCampaignEmailAddressUpdatedSuccessfully = false;
  isAccessTokenRemoved = false;
  statusCode = 0;
  constructor(public referenceService:ReferenceService,public superAdminService:SuperAdminServiceService,public properties:Properties) { }

  ngOnInit() {
  }


  closeUpdateEmailAddressAccountModal(){
    if(this.changeEmailAddressRequestDto.isEmailAddressUpdatedSuccessfully){
       window.location.reload();
    }
    this.referenceService.closeModalPopup("update-email-address-modal");
    this.changeEmailAddressRequestDto = new ChangeEmailAddressRequestDto();
  }

  openModalPopup(){
    this.referenceService.openModalPopup("update-email-address-modal");
  }

  updateEmailAddress(){
    this.validateEmailAddressLoader = true;
    this.changeEmailAddressRequestDto.existingEmailAddressErrorMessage = "";
    this.changeEmailAddressRequestDto.updatedEmailAddressErrorMessage = "";
    this.superAdminService.validateEmailAddressChange(this.changeEmailAddressRequestDto).subscribe(
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
          this.validateEmailAddressLoader = false;
          this.isEmailAddressValidatedSuccessfully = false;
        }else{
          this.isEmailAddressValidatedSuccessfully = true;
        }
      },error=>{
        this.validateEmailAddressLoader = false;
        this.updateEmailAddressResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      },()=>{
        if(this.isEmailAddressValidatedSuccessfully){
          this.changeEmailAddressRequestDto.displayEmailAddressFields = false;
          this.changeEmailAddressRequestDto.updateUserProfileLoader = true;
          this.changeEmailAddressRequestDto.updateCampaignEmailLoader = true;
          this.changeEmailAddressRequestDto.removeAccessTokenLoader = true;
          this.validateEmailAddressLoader = false;
          this.updateEmailAddressInUserProfileTable();
        }
      });
  }

  private updateEmailAddressInUserProfileTable() {
    this.superAdminService.updateEmailAddress(this.changeEmailAddressRequestDto).subscribe(
      response => {
        this.changeEmailAddressRequestDto.emailAddressUpdatedSuccessfully = true;
        this.changeEmailAddressRequestDto.emailAddressUpdateError = false;
        this.changeEmailAddressRequestDto.isEmailAddressUpdatedSuccessfully = true;
      }, error => {
        this.changeEmailAddressRequestDto.emailAddressUpdateError = true;
        this.changeEmailAddressRequestDto.campaignEmailAddressUpdateError = true;
        this.changeEmailAddressRequestDto.accessTokenRemovedError = true;
        this.changeEmailAddressRequestDto.isEmailAddressUpdatedSuccessfully = false;
      },()=>{
        this.updateCampaignEmailAddress();
        this.removeAccessToken();
      });
  }

  private removeAccessToken() {
    this.superAdminService.removeAccessToken(this.changeEmailAddressRequestDto).subscribe(
      response => {
        this.changeEmailAddressRequestDto.accessTokenRemovedSuccessfully = true;
        this.changeEmailAddressRequestDto.accessTokenRemovedError = false;
      }, error => {
        this.changeEmailAddressRequestDto.accessTokenRemovedError = true;
      }
    );
  }

  private updateCampaignEmailAddress() {
    this.superAdminService.updateCampaignEmail(this.changeEmailAddressRequestDto).subscribe(
      response => {
        this.changeEmailAddressRequestDto.campaignEmailAddressUpdatedSuccessfully = true;
        this.changeEmailAddressRequestDto.campaignEmailAddressUpdateError = false;
      }, error => {
        this.changeEmailAddressRequestDto.campaignEmailAddressUpdateError = true;
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
  

  showEmailAddressFields(){
    this.changeEmailAddressRequestDto = new ChangeEmailAddressRequestDto();
    this.changeEmailAddressRequestDto.removeLoaders();
  }

  
}

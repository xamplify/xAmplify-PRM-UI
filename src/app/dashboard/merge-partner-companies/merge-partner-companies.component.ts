import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SuperAdminService } from '../super-admin.service';
import { AccountDetailsDto } from '../models/account-details-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';

@Component({
  selector: 'app-merge-partner-companies',
  templateUrl: './merge-partner-companies.component.html',
  styleUrls: ['./merge-partner-companies.component.css'],
})
export class MergePartnerCompaniesComponent implements OnInit {
  isvalidEmailAddressEntered = false;
  emailAddressErrorMessage = "";
  accountDetailsDto:AccountDetailsDto = new AccountDetailsDto();
  apiLoading = false;
  statusCode = 0;
  vendorCompanies:Array<any> = new Array<any>();
  errorOrSuccessResponse:CustomResponse = new CustomResponse();

  constructor(private referenceService: ReferenceService,public authenticationService:AuthenticationService,
    public superAdminService:SuperAdminService,public logger:XtremandLogger) { }

  ngOnInit() {
  }

  findDetailsByEmailAddressOnKeyPress(keyCode:any){
    if(keyCode==13){
      this.findDetailsByEmailAddress();
    }
  }

  findDetailsByEmailAddress() {
    this.resetFormValues();
    let emailId = this.accountDetailsDto.emailId;
    this.accountDetailsDto.emailId = this.referenceService.getTrimmedData(emailId);
    this.isvalidEmailAddressEntered = emailId != undefined && emailId.length > 0;
    this.emailAddressErrorMessage = this.isvalidEmailAddressEntered ? '':'Please Enter Email Address';
    if(this.isvalidEmailAddressEntered){
      this.apiLoading = true;
      this.superAdminService.findVendorCompanies(this.accountDetailsDto).subscribe(
        response=>{
          this.statusCode = response.statusCode;
          if(this.statusCode==200){
            this.vendorCompanies = response.data;
          }else{
            this.errorOrSuccessResponse = new CustomResponse('ERROR',response.message,true);
          }
          this.apiLoading = false;
        },error=>{
          this.logger.errorPage(error);
        }
      );
    }
  }




  private resetFormValues() {
    this.emailAddressErrorMessage = "";
    this.isvalidEmailAddressEntered = false;
    this.errorOrSuccessResponse = new CustomResponse();
  }
}

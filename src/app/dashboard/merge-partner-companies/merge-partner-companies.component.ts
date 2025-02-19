import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SuperAdminService } from '../super-admin.service';
import { AccountDetailsDto } from '../models/account-details-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';

@Component({
  selector: 'app-merge-partner-companies',
  templateUrl: './merge-partner-companies.component.html',
  styleUrls: ['./merge-partner-companies.component.css'],
})
export class MergePartnerCompaniesComponent implements OnInit {
  isvalidEmailAddressEntered = false;
  accountDetailsDto:AccountDetailsDto = new AccountDetailsDto();
  apiLoading = false;
  apiError = false;
  statusCode = 0;
  vendorCompanies:Array<any> = new Array<any>();
  errorOrSuccessResponse:CustomResponse = new CustomResponse();
  vendorCompaniesSearchableDropdownDto: SearchableDropdownDto = new SearchableDropdownDto();
  selectedVendorCompanyId = 0;
  isVendorCompaniesSearchableDropdownDisplayed = false;
  partnerCompanyName = "";
  vendorCompanyName = "";
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
    if(!this.isvalidEmailAddressEntered){
      this.errorOrSuccessResponse = new CustomResponse('ERROR','Please Enter Email Address',true);
    }
    if(this.isvalidEmailAddressEntered){
      this.apiLoading = true;
      this.superAdminService.findVendorCompanies(this.accountDetailsDto).subscribe(
        response=>{
          this.statusCode = response.statusCode;
          if(this.statusCode==200){
            this.vendorCompanies = response.data;
            this.partnerCompanyName = response['map']['partnerCompanyName'];
            if(this.vendorCompanies.length==1){
              let vendorCompany = this.vendorCompanies[0];
              console.log(vendorCompany);
              this.selectedVendorCompanyId = vendorCompany['id'];
              this.vendorCompanyName = vendorCompany['name'];
            }else if(this.vendorCompanies.length>1){
              this.isVendorCompaniesSearchableDropdownDisplayed = true;
              this.vendorCompaniesSearchableDropdownDto.data = response.data;
              this.vendorCompaniesSearchableDropdownDto.placeHolder = "Please Select Vendor Company";
            }
           
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

  searchableDropdownEventReceiver(event:any){
    if(event!=null){
      this.selectedVendorCompanyId = event['id'];
    }else{
      this.selectedVendorCompanyId = 0;
    }
  }




  private resetFormValues() {
    this.isvalidEmailAddressEntered = false;
    this.errorOrSuccessResponse = new CustomResponse();
    this.isVendorCompaniesSearchableDropdownDisplayed = false;
    this.vendorCompanies = [];
    this.partnerCompanyName = "";
    this.vendorCompanyName = "";
    this.selectedVendorCompanyId = 0;
  }
}

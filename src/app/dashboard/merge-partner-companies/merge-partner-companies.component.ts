import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SuperAdminService } from '../super-admin.service';
import { AccountDetailsDto } from '../models/account-details-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { PartnerCompanyMetricsDto } from '../models/partner-company-metrics-dto';
import { Properties } from 'app/common/models/properties';

@Component({
  selector: 'app-merge-partner-companies',
  templateUrl: './merge-partner-companies.component.html',
  styleUrls: ['./merge-partner-companies.component.css'],
  providers:[Properties]
})
export class MergePartnerCompaniesComponent implements OnInit {
  isvalidEmailAddressEntered = false;
  accountDetailsDto: AccountDetailsDto = new AccountDetailsDto();
  apiLoading = false;
  apiError = false;
  statusCode = 0;
  vendorCompanies: Array<any> = new Array<any>();
  errorOrSuccessResponse: CustomResponse = new CustomResponse();
  vendorCompaniesSearchableDropdownDto: SearchableDropdownDto = new SearchableDropdownDto();
  selectedVendorCompanyId = 0;
  partnerCompaniesSearchableDropdownDto: SearchableDropdownDto = new SearchableDropdownDto();
  partnerCompanyIdForTransfer = 0;
  isPartnerCompaniesSearchableDropdownDisplayed = false;
  isVendorCompaniesSearchableDropdownDisplayed = false;
  partnerCompanyName = "";
  partnerCompanyId = 0;
  partnerCompanies: Array<any> = new Array<any>();
  partnerCompaniesApiLoading = false;
  vendorCompanyName = "";
  partnerCompanyMetricsDto:PartnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
  constructor(private referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public superAdminService: SuperAdminService, public logger: XtremandLogger,public properties:Properties) { }

  ngOnInit() {
    if(this.authenticationService.getUserId()!=1){
      this.referenceService.goToAccessDeniedPage();
    }
  }

  findDetailsByEmailAddressOnKeyPress(keyCode: any) {
    if (keyCode == 13) {
      this.findDetailsByEmailAddress();
    }
  }

  findDetailsByEmailAddress(): void {
    this.resetFormValues();
    this.trimAndValidateEmail();
    if (!this.isvalidEmailAddressEntered) {
      this.setErrorMessage('Please Enter Email Address');
      return;
    }
    this.apiLoading = true;
    this.fetchVendorCompanies();
  }

  private trimAndValidateEmail(): void {
    let emailId = this.accountDetailsDto.emailId;
    this.accountDetailsDto.emailId = this.referenceService.getTrimmedData(emailId);
    this.isvalidEmailAddressEntered = !!emailId && emailId.trim().length > 0;
  }

  private setErrorMessage(message: string): void {
    this.errorOrSuccessResponse = new CustomResponse('ERROR', message, true);
  }

  private fetchVendorCompanies(): void {
    this.superAdminService.findVendorCompanies(this.accountDetailsDto).subscribe(
      response => this.handleVendorCompaniesResponse(response),
      error => this.handleApiError(error),()=>{
        if(this.vendorCompanies.length==1){
          this.partnerCompaniesApiLoading = true;
          this.partnerCompanyIdForTransfer = 0;
          this.partnerCompanies = [];
          let vendorCompany = this.vendorCompanies[0];
          this.vendorCompanyName = vendorCompany['name'];
          this.selectedVendorCompanyId = vendorCompany['id'];
          this.findPartnerCompanies();
          this.findPartnerCompanyMetrics();
        }
      });
  }

  private findPartnerCompanyMetrics() {
    if (this.partnerCompanyId != undefined && this.partnerCompanyId > 0) {
      this.partnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
      this.partnerCompanyMetricsDto.apiLoading = true;
      this.superAdminService.findPartnerCompanyMetrics(this.selectedVendorCompanyId, this.partnerCompanyId).
        subscribe(
          response => {
            this.partnerCompanyMetricsDto = response.data;
            this.partnerCompanyMetricsDto.apiLoading = false;
            console.log(this.partnerCompanyMetricsDto);
          }, error => {
            this.partnerCompanyMetricsDto.apiLoading = false;
            this.partnerCompanyMetricsDto.error = true;
            this.partnerCompanyMetricsDto.errorMessage = "Unable To Load Partner Company Metrics.Please Try After Sometime.";
          });
    } else {
      this.partnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
    }
  }

  private handleVendorCompaniesResponse(response: any): void {
    this.statusCode = response.statusCode;
    if (this.statusCode === 200) {
      this.vendorCompanies = response.data;
      this.partnerCompanyName = response['map']['partnerCompanyName'];
      this.partnerCompanyId = response['map']['partnerCompanyId'];
      if (this.vendorCompanies.length > 1) {
        this.setErrorMessage("Merging is not applicable for the selected partner company as the partnership is established with multiple vendor");
      } 
    } else {
      this.setErrorMessage(response.message);
    }
    this.apiLoading = false;
  }


  private handleApiError(error: any): void {
    this.logger.errorPage(error);
    this.apiLoading = false;
  }


  findPartnerCompanies() {
    this.superAdminService.findPartnerCompanies(this.selectedVendorCompanyId).subscribe(
      response => {
        this.partnerCompanies = response.data;
        this.displayPartnerCompaniesDropdown();
        this.partnerCompaniesApiLoading = false;
      }, error => {
        this.logger.errorPage(error);
      });
  }

  private displayPartnerCompaniesDropdown(): void {
    this.isPartnerCompaniesSearchableDropdownDisplayed = true;
    this.partnerCompaniesSearchableDropdownDto.data = this.partnerCompanies;
    this.partnerCompaniesSearchableDropdownDto.placeHolder = "Please select partner company to transfer the data";
  }


  getSelectedVendorCompanyId(event: any) {
    if (event != null) {
      this.selectedVendorCompanyId = event['id'];
    } else {
      this.selectedVendorCompanyId = 0;
    }
    this.findPartnerCompanies();
  }

  getSelectedPartnerCompanyIdForTransfer(event: any) {
    if (event != null) {
      this.partnerCompanyIdForTransfer = event['id'];
    } else {
      this.partnerCompanyIdForTransfer = 0;
    }
   
    


  }



  private resetFormValues() {
    this.isvalidEmailAddressEntered = false;
    this.errorOrSuccessResponse = new CustomResponse();
    this.isVendorCompaniesSearchableDropdownDisplayed = false;
    this.vendorCompanies = [];
    this.partnerCompanyName = "";
    this.selectedVendorCompanyId = 0;
    this.partnerCompanyId = 0;
    this.partnerCompanyIdForTransfer = 0;
    this.partnerCompanies = [];
    this.partnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
  }
}

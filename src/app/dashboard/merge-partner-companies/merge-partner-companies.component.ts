import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SuperAdminService } from '../super-admin.service';
import { AccountDetailsDto } from '../models/account-details-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-merge-partner-companies',
  templateUrl: './merge-partner-companies.component.html',
  styleUrls: ['./merge-partner-companies.component.css'],
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
  isVendorCompaniesSearchableDropdownDisplayed = false;
  partnerCompanyName = "";
  partnerCompanyId = 0;
  partnerCompanies: Array<any> = new Array<any>();
  partnerCompaniesApiLoading = false;
  constructor(private referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public superAdminService: SuperAdminService, public logger: XtremandLogger) { }

  ngOnInit() {
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
      error => this.handleApiError(error));
  }

  private handleVendorCompaniesResponse(response: any): void {
    this.statusCode = response.statusCode;
    if (this.statusCode === 200) {
      this.vendorCompanies = response.data;
      this.partnerCompanyName = response['map']['partnerCompanyName'];
      this.partnerCompanyId = response['map']['partnerCompanyId'];
      this.displayVendorCompaniesDropdown();
    } else {
      this.setErrorMessage(response.message);
    }
    this.apiLoading = false;
  }




  private displayVendorCompaniesDropdown(): void {
    this.isVendorCompaniesSearchableDropdownDisplayed = true;
    this.vendorCompaniesSearchableDropdownDto.data = this.vendorCompanies;
    this.vendorCompaniesSearchableDropdownDto.placeHolder = "Select a vendor company to display all partner companies for data transfer";
  }

  private handleApiError(error: any): void {
    this.logger.errorPage(error);
    this.apiLoading = false;
  }


  findPartnerCompaniesExcluding() {
    this.partnerCompaniesApiLoading = true;
    this.partnerCompanyIdForTransfer = 0;
    this.partnerCompanies = [];
    this.superAdminService.findPartnerCompaniesExcluding(this.selectedVendorCompanyId, this.partnerCompanyId).subscribe(
      response => {
        this.partnerCompanies = response.data;
        this.partnerCompaniesApiLoading = false;
      }, error => {
        this.logger.errorPage(error);
      });
  }

  getSelectedVendorCompanyId(event: any) {
    if (event != null) {
      this.selectedVendorCompanyId = event['id'];
    } else {
      this.selectedVendorCompanyId = 0;
    }
    this.findPartnerCompaniesExcluding();
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
  }
}

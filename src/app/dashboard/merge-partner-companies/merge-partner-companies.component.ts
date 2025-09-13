import { Component, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SuperAdminService } from '../super-admin.service';
import { AccountDetailsDto } from '../models/account-details-dto';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { SearchableDropdownDto } from 'app/core/models/searchable-dropdown-dto';
import { PartnerCompanyMetricsDto } from '../models/partner-company-metrics-dto';
import { Properties } from 'app/common/models/properties';
import { ComponentCanDeactivate } from 'app/component-can-deactivate';
import { Observable } from 'rxjs';
import { SweetAlertParameterDto } from 'app/common/models/sweet-alert-parameter-dto';

@Component({
  selector: 'app-merge-partner-companies',
  templateUrl: './merge-partner-companies.component.html',
  styleUrls: ['./merge-partner-companies.component.css'],
  providers:[Properties]
})
export class MergePartnerCompaniesComponent implements OnInit,ComponentCanDeactivate {
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
  destinationPartnerCompanyId = 0;
  partnerCompanyNameForTransfer = "";
  isPartnerCompaniesSearchableDropdownDisplayed = false;
  isVendorCompaniesSearchableDropdownDisplayed = false;
  partnerCompanyName = "";
  sourcePartnerCompanyId = 0;
  partnerCompanies: Array<any> = new Array<any>();
  partnerCompaniesApiLoading = false;
  vendorCompanyName = "";
  partnerCompanyMetricsDto:PartnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
  isTransferOptionClicked = false;
  transferDataSweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
  transferDataApiLoading = false;
  constructor(private referenceService: ReferenceService, public authenticationService: AuthenticationService,
    public superAdminService: SuperAdminService, public logger: XtremandLogger,public properties:Properties) { }

  ngOnInit() {
    if(this.authenticationService.getUserId()!=1){
      this.referenceService.goToAccessDeniedPage();
    }else{
      this.transferDataSweetAlertParameterDto.confirmButtonText = "Yes, Transfer";
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
          this.destinationPartnerCompanyId = 0;
          this.partnerCompanyNameForTransfer = "";
          this.partnerCompanies = [];
          let vendorCompany = this.vendorCompanies[0];
          this.vendorCompanyName = vendorCompany['name'];
          this.selectedVendorCompanyId = vendorCompany['id'];
          this.findPartnerCompanies();
          this.findPartnerCompanyMetrics();
        }else if(this.vendorCompanies.length==0){
          this.statusCode = 404;
          this.setErrorMessage("Merging is not applicable for the entered partner email address as it has partnership with multiple vendors");
        }
      });
  }

  private findPartnerCompanyMetrics() {
    if (this.sourcePartnerCompanyId != undefined && this.sourcePartnerCompanyId > 0) {
      this.partnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
      this.partnerCompanyMetricsDto.apiLoading = true;
      this.superAdminService.findPartnerCompanyMetrics(this.selectedVendorCompanyId, this.sourcePartnerCompanyId).
        subscribe(
          response => {
            this.partnerCompanyMetricsDto = response.data;
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
      this.sourcePartnerCompanyId = response['map']['partnerCompanyId'];
      if (this.vendorCompanies.length > 1) {
        this.setErrorMessage("The entered partner email address cannot be merged as the partnership is established with multiple vendors");
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
    this.partnerCompaniesSearchableDropdownDto.placeHolder = "Please select the destination partner company to transfer the data";
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
      this.destinationPartnerCompanyId = event['id'];
      this.partnerCompanyNameForTransfer = event['name'];
    } else {
      this.destinationPartnerCompanyId = 0;
      this.partnerCompanyNameForTransfer = "";
    }

  }

  private resetFormValues() {
    this.isvalidEmailAddressEntered = false;
    this.errorOrSuccessResponse = new CustomResponse();
    this.isVendorCompaniesSearchableDropdownDisplayed = false;
    this.vendorCompanies = [];
    this.partnerCompanyName = "";
    this.selectedVendorCompanyId = 0;
    this.sourcePartnerCompanyId = 0;
    this.destinationPartnerCompanyId = 0;
    this.partnerCompanyNameForTransfer = "";
    this.partnerCompanies = [];
    this.partnerCompanyMetricsDto = new PartnerCompanyMetricsDto();
    this.statusCode = 0;
  }

  viewDetailedAnalytics(partnerCompanyMetricsDto:PartnerCompanyMetricsDto){
    this.referenceService.showSweetAlertInfoMessage();
  }

  confirmTransferringData(){
    this.errorOrSuccessResponse = new CustomResponse();
    let isValidPartnerCompanyIdSelected = this.destinationPartnerCompanyId != this.sourcePartnerCompanyId;
    if(this.destinationPartnerCompanyId>0){
      if(isValidPartnerCompanyIdSelected){
        this.isTransferOptionClicked = true;
        this.transferDataSweetAlertParameterDto.text = this.partnerCompanyName+"'s data will be transferred to the "+this.partnerCompanyNameForTransfer+" company, and this change is final and cannot be undone";
      }else{
        this.referenceService.goToTop();
        this.setErrorMessage("The source company and destination company must be different");
      }
    }else{
      this.setErrorMessage("Select the destination partner company for data transfer");
    }
  }

  transferDataSweetAlertEventEmitter(event:any){
    if(event){
      this.transferDataApiLoading = true;
      this.superAdminService.transferPartnerCompanyData(this.sourcePartnerCompanyId,this.destinationPartnerCompanyId).subscribe(
        response=>{
          this.resetFormValues();
          this.accountDetailsDto = new AccountDetailsDto();
          this.transferDataApiLoading = false;
          this.isTransferOptionClicked = false;
          this.referenceService.showSweetAlertSuccessMessage("Data transferred successfully");
        },error=>{
          this.transferDataApiLoading = false;
          this.isTransferOptionClicked = false;
          this.referenceService.showSweetAlertServerErrorMessage();
        }
      );
    }else{
      this.isTransferOptionClicked = false;
    }
  }

  @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        this.authenticationService.stopLoaders();
        if(this.authenticationService.module.logoutButtonClicked){
          return true;
        }else{
          return false;
        }
    }

}

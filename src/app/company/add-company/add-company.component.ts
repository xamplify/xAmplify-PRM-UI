import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/core/models/user';
import { CompanyService } from '../service/company.service';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { CustomResponse } from 'app/common/models/custom-response';
import { Company } from '../models/company';
import { CountryNames } from 'app/common/models/country-names';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $: any;
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
  providers: [CompanyService, RegularExpressions, CountryNames],
})
export class AddCompanyComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  @Input() public actionType : any;
  @Input() public companyId : any;
  validationResponse: CustomResponse = new CustomResponse();
  customResponse: CustomResponse = new CustomResponse();
  companies: Company[] = [];
  addCompany: Company = new Company();
  showModal: boolean;
  closeModalEvent: any;
  isCompanyDetails: boolean;
  validEmailPatternSuccess: boolean;
  emailNotValid: boolean;
  checkingForEmail: boolean;
  editingEmailId: string;
  totalUsers: boolean;
  isEmailExist: boolean;
  loggedInUserId: number;
  title: string;
  preview: boolean = false;
  edit: boolean = false;
  constructor(private companyService: CompanyService, public regularExpressions: RegularExpressions, public countryNames: CountryNames, public authenticationService: AuthenticationService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.addCompany.country = this.countryNames.countries[0];
    this.loadModalPopUp();
  }
  loadModalPopUp() {
    if (this.actionType === "add") {
      this.title = "Add Company"
    } else if (this.actionType === "edit") {
      this.title = "Edit Company"
      this.edit = true;
      if (this.companyId > 0) {
        this.getCompany(this.companyId);
      }
    } else if (this.actionType === "view") {
      this.title = "Company Details"
      this.preview = true;
      if (this.companyId > 0) {
        this.getCompany(this.companyId);
      }
    }
  }
  addCompanyModalClose() {
    $('#addCompanyModal').modal('hide');
    this.closeEvent.emit("0");
  }
  contactCompanyChecking(contactCompany: string) {
    if (contactCompany.trim() != '') {
      this.isCompanyDetails = true;
    } else {
      this.isCompanyDetails = false;
    }
  }
  validateEmail(emailId: string) {
    const lowerCaseEmail = emailId.toLowerCase();
    if (this.validateEmailAddress(emailId)) {
      this.checkingForEmail = true;
      this.validEmailPatternSuccess = true;
    }
    else {
      this.checkingForEmail = false;
    }
  }
  validateEmailAddress(emailId: string) {
    var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
    return EMAIL_ID_PATTERN.test(emailId);
  }
  checkingEmailPattern(emailId: string) {
    this.validEmailPatternSuccess = false;
    if (this.validateEmailAddress(emailId)) {
      this.validEmailPatternSuccess = true;
      this.emailNotValid = true;
    } else {
      this.validEmailPatternSuccess = false;
      this.emailNotValid = false;
    }
  }
  saveCompany() {
    this.addCompany.userId = this.loggedInUserId;
    this.companyService.saveCompany(this.addCompany).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.addCompanyModalClose();
        } else if (response.statusCode == 500) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        } else if (response.statusCode == 409) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      },
      error => {
        this.customResponse = new CustomResponse('ERROR', "failed to save", true);
      },
      () => { }
    );
  }
  getCompany(companyId: number) {
    this.companyService.getCompanyById(companyId, this.loggedInUserId)
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.addCompany = data.data;
            if(data.data.country == null || data.data.country == undefined || data.data.country == ''){
              this.addCompany.country = this.countryNames.countries[0];
            }
          }
        },
        error => {
        },
        () => { }
      );
  }
  editCompany(){
    this.addCompany.userId = this.loggedInUserId;
    this.companyService.editCompany(this.addCompany).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.addCompanyModalClose();
          if(response.data.country == null || response.data.country == undefined || response.data.country == ''){
            this.addCompany.country = this.countryNames.countries[0];
          }
        } else if (response.statusCode == 500) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        } else if (response.statusCode == 409) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      },
      error => {
        this.customResponse = new CustomResponse('ERROR', "failed to save", true);
      },
      () => { }
    );
  }

}

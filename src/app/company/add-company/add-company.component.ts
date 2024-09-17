import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/core/models/user';
import { CompanyService } from '../service/company.service';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { CustomResponse } from 'app/common/models/custom-response';
import { Company } from '../models/company';
import { CountryNames } from 'app/common/models/country-names';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $: any;
@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css'],
  providers: [CompanyService, RegularExpressions, CountryNames, HttpRequestLoader,],
})
export class AddCompanyComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  @Input() public actionType: any;
  @Input() public companyId: any;
  @Output() notifySubmitSuccess = new EventEmitter();
  customResponse: CustomResponse = new CustomResponse();
  companies: Company[] = [];
  addCompany: Company = new Company();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
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
  ngxloading: boolean = false;
  isCompanyNameValid: boolean = false;
  isCompanyEmailValid : boolean = true;
  @Input() public customFieldsRequestDto : any;
  constructor(private companyService: CompanyService, public regularExpressions: RegularExpressions, public countryNames: CountryNames, public authenticationService: AuthenticationService, public referenceService: ReferenceService,) {
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

  validteCompanyName(companyName: string) {
    if (companyName.trim().length > 0) {
      this.isCompanyNameValid = true;
    } else {
      this.isCompanyNameValid = false;
    }
  }

  validateEmail(companyEmail: string) {
    if (( this.validateEmailAddress(companyEmail) ||companyEmail.length==0)) {
        this.isCompanyEmailValid = true;
    }
    else {
      this.isCompanyEmailValid = false;
    }
  }

  validateEmailAddress(emaiId:string){
  var EMAIL_ID_PATTERN = this.regularExpressions.EMAIL_ID_PATTERN;
    return EMAIL_ID_PATTERN.test(emaiId);
  }

  saveCompany() {
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.addCompany.userId = this.loggedInUserId;
    this.addCompany.customFields = this.customFieldsRequestDto;
    this.companyService.saveCompany(this.addCompany).subscribe(
      (response: any) => {
        this.ngxloading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.notifySubmitSuccess.emit();
          this.addCompanyModalClose();
        } else if (response.statusCode == 500) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        } else if (response.statusCode == 409) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      },
      error => {
        this.ngxloading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', "failed to save", true);
      },
      () => { }
    );
  }
  getCompany(companyId: number) {
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.companyService.getCompanyById(companyId, this.loggedInUserId)
      .subscribe(
        (data: any) => {
          this.ngxloading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            this.addCompany = data.data;
            if (data.data.country == null || data.data.country == undefined || data.data.country == '') {
              this.addCompany.country = this.countryNames.countries[0];
            }
          }
        },
        error => {
          this.ngxloading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        () => { }
      );
  }
  editCompany() {
    this.ngxloading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.addCompany.userId = this.loggedInUserId;
    this.companyService.editCompany(this.addCompany).subscribe(
      (response: any) => {
        this.ngxloading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        if (response.statusCode == 200) {
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.notifySubmitSuccess.emit();
          this.addCompanyModalClose();
          if (response.data.country == null || response.data.country == undefined || response.data.country == '') {
            this.addCompany.country = this.countryNames.countries[0];
          }
        } else if (response.statusCode == 500) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        } else if (response.statusCode == 409) {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      },
      error => {
        this.ngxloading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', "failed to save", true);
      },
      () => { }
    );
  }

}

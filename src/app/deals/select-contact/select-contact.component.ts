import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { LeadsService } from 'app/leads/services/leads.service';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { PagerService } from 'app/core/services/pager.service';
import { UtilService } from 'app/core/services/util.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DealsService } from '../services/deals.service';
declare var $;

@Component({
  selector: 'app-select-contact',
  templateUrl: './select-contact.component.html',
  styleUrls: ['./select-contact.component.css'],
  providers: [SortOption]
})
export class SelectContactComponent implements OnInit {

  @Output() notifyClose = new EventEmitter();
  @Output() notifyContactSelected = new EventEmitter();
  @Input()  public attcahContact: any;

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  selectLeadModalResponse: CustomResponse = new CustomResponse();
  pagination: Pagination = new Pagination();
  loggedInUserId: number;
  showContactForm: boolean = false;
  contactId = 0;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  /*** XNFR-476 ***/
  disableCreatedForVendor: boolean = false;
  enableAddLeadButton: boolean = false;
  showSelectedContact: number = 0;
  isContactSelected = false;
  contactObj: any;
  constructor(public properties: Properties, public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    private leadsService: LeadsService, public sortOption: SortOption, public pagerService: PagerService, public utilService: UtilService, private dealsService: DealsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;

    }
  }

  ngOnInit() {
    $('#selectContactModel').modal('show');
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.sortOption.searchKey = "";
    this.contactId = this.attcahContact.contactId;
    this.showSelectedContact = this.attcahContact.contactId;
    this.getContactDetails(this.pagination);
  }

  closeModal() {
    this.notifyClose.emit();
    $('#selectContactModel').modal('hide');
  }

  getContactDetails(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.maxResults = 12;
    if (this.vanityLoginDto.vanityUrlFilter) {
      pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName
    }
    this.dealsService.getContactsForContactAttachment(pagination)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);
          let data = response.data;
          let contactList = data.list;
          this.sortOption.totalRecords = data.totalRecords;
          this.pagination.totalRecords = data.totalRecords;
          this.pagination = this.pagerService.getPagedItems(this.pagination, contactList);
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { }
      );
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.contactId = 0;
      this.search();
    }
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getContactDetails(this.pagination);
  }

  dropDownList(event) {
    this.pagination = event;
    this.getContactDetails(this.pagination);
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getContactDetails(this.pagination);
  }

  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  selectLeadOnCheckBoxClick(contact: any, index: number) {
    let isChecked = $('#contactCheckBox-' + index).is(':checked');
    if (isChecked) {
      this.contactId = contact.contactId;
      this.showSelectedContact = this.contactId;
      this.contactObj = contact;
      this.isContactSelected = true;
    } else {
      this.contactId = 0;
      this.showSelectedContact = 0;
      this.contactObj = "";
      this.isContactSelected = false;
    }
  }

  viewContact(contact: any) {
    this.showContactForm = true;
  }

  contactSelected() {
    $('#selectContactModel').modal('hide');
    const obj = {
      'showSelectedContact': this.showSelectedContact,
      'contact': this.contactObj
    }
    this.notifyContactSelected.emit(obj);
  }


}

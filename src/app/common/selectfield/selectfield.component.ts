import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocialPagerService } from 'app/contacts/services/social-pager.service';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { SelectedFieldsDto } from 'app/dashboard/models/selected-fields-dto';
import { SelectedFieldsResponseDto } from 'app/dashboard/models/selected-fields-response-dto';
import { CustomResponse } from '../models/custom-response';
import { DragulaService } from 'ng2-dragula';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { PaginationComponent } from 'app/common/pagination/pagination.component';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-selectfield',
  templateUrl: './selectfield.component.html',
  styleUrls: ['./selectfield.component.css'],
  providers: [PaginationComponent]
})
export class SelectfieldComponent implements OnInit {
  @Output() closeEmitter = new EventEmitter();
  @Input() isVendorVersion: boolean;
  @Input() customName: any;
  @Input() opportunityType: any;

  ngxloading: boolean = false;
  selectedFieldsResponseDto: SelectedFieldsResponseDto = new SelectedFieldsResponseDto();
  companyProfileName: string = "";
  pagination: Pagination = new Pagination();
  isHeaderCheckBoxChecked: boolean = true;
  isDefault: boolean = false;
  pager: any = {};
  fieldsPagedItems = new Array();
  pageSize: number = 12;
  fieldsCustomResponse: CustomResponse = new CustomResponse();
  allItems: any[] = [];
  unSelectedItems: any[] = [];
  selectedItems: any[] = [];
  excludedLabels = ["LastName", "Last_Name", "Company", "Email"];
  selectModalPopUp = "exportExcelModalPopup";
  orderModalPopup = "orderFieldPopup";
  isOrderDivOpen = false;
  isSelectDivOpen = false;
  selectFieldsDtos: Array<any> = new Array<any>();
  myPreferances: boolean = false;
  pageNumber: any;
  loggedInUserType: string = '';
  isMyprofile: boolean = false;
  defaultSelectedFieldsDtos: Array<any> = new Array<any>();
  customFieldsResponse: CustomResponse = new CustomResponse();
  formId:any;
  constructor(public dashboardService: DashboardService, public authenticationService: AuthenticationService, private pagerService: PagerService,
    public referenceService: ReferenceService, public socialPagerService: SocialPagerService, public dragulaService: DragulaService, public paginationComponent: PaginationComponent
    , public router: Router
  ) {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.companyProfileName = this.authenticationService.companyProfileName;
      this.selectedFieldsResponseDto['companyProfileName'] = this.companyProfileName;
    }
    this.isMyprofile = this.router.url.includes('dashboard/myprofile');

    if (!this.isMyprofile) {

      this.dragulaService.setOptions('fieldsDragula', {
        moves: (el, container, handle) => {
          // Check if the dragged element has the 'non-draggable' class
          return !el.classList.contains('non-draggable');
        },
        accepts: (el, target, source, sibling) => {
          if (!sibling) return true;
          const siblingIndex = Array.from(target.children).indexOf(sibling);
          if (siblingIndex < this.defaultFields.length) {
            return false;
          }
          return true;
        }
      });
    } else {
      this.dragulaService.setOptions('fieldsDragula', {});
    }
  }
  isDisabled(element: Element | null): boolean {
    if (!element) return false;
    const fieldName = element.querySelector('.FieldName').textContent.trim();
    return this.defaultFields.includes(fieldName || '');
  }
  ngOnInit() {
    this.ngxloading = true;
    if (this.opportunityType === 'LEAD') {
      this.excludedLabels = ["LastName", "Last_Name", "Company", "Email"];
    } else {
      this.excludedLabels = ["Name", "dealname", "name", "title", "symptom", "Account_Name", "Deal_Name", "CloseDate", "closedate", "expectedCloseDate", "expected_close_date", "FOppTargetDate", "Closing_Date", "Close_Date", "Amount", "amount", "AMOUNT", "value", "FOppValue", "CLOSE_DATE", "DEAL_NAME"];
    }
    this.referenceService.openModalPopup(this.selectModalPopUp);
    this.pageNumber = this.paginationComponent.numberPerPage[0];
    if (this.isVendorVersion) {
      this.loggedInUserType = 'v';
    } else {
      this.loggedInUserType = 'p';
    }
    this.getMyPreferances();
  }
  ngOnDestroy() {
    this.dragulaService.destroy('fieldsDragula');
    this.referenceService.closeModalPopup(this.selectModalPopUp);
  }
  ngOnChanges() {
    this.pageNumber = this.paginationComponent.numberPerPage[0];
  }
  resetPagination() {
    this.pagination.maxResults = 12;
    this.pagination = new Pagination;
  }
  getMyPreferances() {
    this.resetPagination();
    this.dashboardService.isMyPreferances(this.opportunityType)
      .subscribe(
        result => {
          this.formId = result.map.formId;
          this.myPreferances = this.isMyprofile ? false : result.data;
          this.isSelectDivOpen = this.myPreferances ? false : true;
          this.getExportExcelHeader(this.pagination);
        },
        error => console.log(error),
        () => console.log('finished '));
  }

  setFieldsPage(page: number) {
    try {
      if (page < 1 || (this.pager.totalPages > 0 && page > this.pager.totalPages)) {
        return;
      }
      this.referenceService.goToTop();
      if (this.searchKey !== undefined && this.searchKey !== '') {
        this.fieldsPagedItems = this.allItems.filter(field =>
          (field.labelName.toLowerCase().includes(this.searchKey.trim().toLowerCase()) || field.displayName.toLowerCase().includes(this.searchKey.trim().toLowerCase()))
        );
        this.pager = this.socialPagerService.getPager(this.fieldsPagedItems.length, page, this.pageSize);
        this.fieldsPagedItems = this.fieldsPagedItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      } else {
        this.pager = this.socialPagerService.getPager(this.allItems.length, page, this.pageSize);
        this.fieldsPagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      }
      this.updateHeaderCheckbox();
    } catch (error) {
    }
  }
  toggleSelection(event: any, field: any) {
    this.fieldsPagedItems.some(updatedItem => {
      if (updatedItem.labelId === field.labelId) {
        updatedItem.selectedColumn = event.target.checked;
        const index = this.allItems.findIndex(item => item.labelId === updatedItem.labelId);
        if (index !== -1) {
          this.allItems[index].selectedColumn = updatedItem.selectedColumn;
        }
        return true;
      }
      return false;
    });
    this.updateHeaderCheckbox();
  }
  toggleAllSelection(event: any) {
    this.isHeaderCheckBoxChecked = event.target.checked;
    this.fieldsPagedItems.forEach(updatedItem => {
      if (!this.excludedLabels.includes(updatedItem.labelId)) {
        updatedItem.selectedColumn = event.target.checked;
      }
      const index = this.allItems.findIndex(item => item.labelId === updatedItem.labelId);
      if (index !== -1 && !this.excludedLabels.includes(updatedItem.labelId)) {
        this.allItems[index].selectedColumn = updatedItem.selectedColumn;
      }
    });
    this.updateHeaderCheckbox();
  }
  isHeaderCheckBoxCheckedDisable: boolean
  updateHeaderCheckbox() {
    if (!(this.pager.pages && this.pager.pages.length)) {
      this.isHeaderCheckBoxChecked = false;
    } else {
      this.isHeaderCheckBoxChecked = this.fieldsPagedItems.every((item: any) => item.selectedColumn);
    }
    this.isHeaderCheckBoxCheckedDisable = this.fieldsPagedItems.every((item: any) => item.defaultColumn) && !this.isMyprofile;
  }
  isCheked(field: any): boolean {
    if (this.isMyprofile) {
      return this.fieldsPagedItems.some(item => item.defaultColumn === true && item.labelId === field.labelId);
    } else {
      return this.fieldsPagedItems.some(item => item.labelId === field.labelId);
    }
  }
  closeModalClose() {
    this.referenceService.closeModalPopup(this.selectModalPopUp);
    this.emitValues('close');
  }
  selectedPageNumber(event: any) {
    this.pageSize = event;
    this.setFieldsPage(1);
  }
  submit() {
    this.referenceService.closeModalPopup(this.selectModalPopUp);
    this.selectedItems = this.isSelectDivOpen ? this.allItems.filter(item => item.selectedColumn === true) : this.selectFieldsDtos;
    this.emitValues('submit');
  }
  setMyPreferances(event: any) {
    //const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedFieldsResponseDto['myPreferances'] = event.target.checked;
    this.isDefault = event.target.checked;
  }
  emitValues(value: string) {
    let input: any = { selectFields: this.selectedItems, myPreferances: this.isDefault };
    input['close'] = false;
    if (value === 'submit') {
      input[value] = value;
      if (this.isMyprofile) {
        input['defaultField'] = true;
        input['myPreferances'] = false;
      } else {
        input['myPreferances'] = this.isDefault;
        input['defaultField'] = false;

      }
    }
    this.closeEmitter.emit(input);
  }

  isFieldDisabled(field: any): boolean {
    return this.excludedLabels.includes(field.labelId) || (field.defaultColumn && !this.isMyprofile);
  }
  isDefaultFields(field: any): boolean {
    return this.excludedLabels.includes(field.formDefaultFieldType);
  }
  searchKey: string = '';
  searchFieldsKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.searchFields();
    }
  }
  searchFields() {
    this.setFieldsPage(1);
  }
  clearSearch() {
    this.searchKey = '';
    this.pageSize = 12;
    this.setFieldsPage(1);
  }
  defaultFields = [];
  updateExcludedLabels() {
    this.defaultFields = this.allItems
      .filter(item => item.defaultColumn === true)
      .map(item => item.labelId)
    this.excludedLabels = this.excludedLabels
      ? Array.from(new Set([...this.excludedLabels, ...this.defaultFields])) // Merge & remove duplicates
      : [...this.defaultFields];
  }
  goToOrderDiv() {
    this.isSelectDivOpen = false;
    this.showBackButton = true;
    this.selectFieldsDtos = this.allItems.filter(item => item.selectedColumn === true);
  }
  chooseYourFields() {
    this.showBackButton = true;
    this.isSelectDivOpen = true;
    this.allItems = [
      ...this.selectFieldsDtos,
      ...this.allItems.filter(item => !this.selectFieldsDtos.some(selected => selected.labelId === item.labelId))
    ];
    this.setFieldsPage(1);
  }
  showBackButton: boolean = false;
  backToPreviousPage() {
    this.showBackButton = false
    this.isSelectDivOpen = !this.myPreferances;
    if (this.myPreferances) {
      this.selectFieldsDtos = this.allItems.filter(item => item.selectedColumn === true);
    }
    this.allItems = [
      ...this.selectFieldsDtos,
      ...this.allItems.filter(item => !this.selectFieldsDtos.some(selected => selected.labelId === item.labelId))
    ];
    this.setFieldsPage(1);
  }
  isNonDraggable(fieldDto: any): boolean {
    return this.excludedLabels.includes(fieldDto.labelId) && fieldDto.defaultColumn && !this.isMyprofile;
  }
  getExportExcelHeader(pagination: Pagination) {
    this.ngxloading = true;
    let self = this;
    this.dashboardService.getExportExcelHeaders(this.companyProfileName, this.loggedInUserType, this.customName, this.opportunityType, this.isMyprofile)
      .subscribe(
        (response: any) => {
          if (response.statusCode == 200) {
            this.allItems = response.data;
            if (this.myPreferances) {
              this.selectFieldsDtos = this.allItems.filter(field => field.selectedColumn);
            }
            if (!this.isMyprofile) {
              this.allItems
              this.updateExcludedLabels()
            }
            pagination.totalRecords = this.allItems.length;
            pagination = this.pagerService.getPagedItems(pagination, this.allItems);
            this.updateHeaderCheckbox();
            this.setFieldsPage(1);
          }
          else if (response.statusCode === 401 && response.message === "Expired Refresh Token") {
            this.customFieldsResponse = new CustomResponse('ERROR', "Your Salesforce integration is not valid. Re-configure with valid credentials", true);
          } 
          this.ngxloading = false;
        },
        error => {
          console.log(error)
          let errorMessage = this.referenceService.getApiErrorMessage(error);
          this.customFieldsResponse = new CustomResponse('ERROR', errorMessage, true);
          this.ngxloading = false;
        },
        () => { });
  }

}

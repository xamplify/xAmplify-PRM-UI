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
declare var $: any;
@Component({
  selector: 'app-selectfield',
  templateUrl: './selectfield.component.html',
  styleUrls: ['./selectfield.component.css']
})
export class SelectfieldComponent implements OnInit {
  @Output() closeEmitter = new EventEmitter();
  @Input() selectedFields: any[] = [];
  @Input() userType: string = '';
  ngxloading: boolean = false;
  selectedFieldsResponseDto: SelectedFieldsResponseDto = new SelectedFieldsResponseDto();
  companyProfileName: string = "";
  pagination: Pagination = new Pagination();
  isHeaderCheckBoxChecked: boolean = true;
  isDefault: boolean = false;
  pager: any = {};
  fieldsCustomResponse: CustomResponse = new CustomResponse();
  allItems: any[] = [];
  unSelectedItems: any[] = [];
  selectedItems: any[] = [];
  excludedLabels = ["Last Name", "Company", "Email"];
  constructor(public dashboardService: DashboardService, public authenticationService: AuthenticationService, private pagerService: PagerService,
    public referenceService: ReferenceService, public socialPagerService: SocialPagerService
  ) {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.companyProfileName = this.authenticationService.companyProfileName;
      this.selectedFieldsResponseDto['companyProfileName'] = this.companyProfileName;
    }
  }
  ngOnInit() {
    //this.ngxloading = true;
    this.referenceService.openModalPopup('exportExcelModalPopup')
    this.getAllLeadFormColumns(this.pagination);
  }

  getAllLeadFormColumns(pagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.ngxloading = true;
    this.dashboardService.getAllLeadFormFields(this.companyProfileName, this.userType).subscribe(
      (response: any) => {
        let data = response.data;
        this.ngxloading = false;
        pagination.totalRecords = data.length;
        this.allItems.length = 0; // Clear existing data before adding new items
        if (this.selectedFields.length > 0) {
          this.allItems = [...data];
          this.combineArraysWithoutDuplicatesAndSort();
        } else {
          this.allItems = [...data];
        }
        this.updatePagination(pagination, this.allItems);
        this.updateHeaderCheckbox();
      },
      error => console.log(error),
      () => {
        this.ngxloading = false;
      }
    );
  }

  toggleSelection(field: any) {
    const isUnChecked = !field.selectedColumn;
    if (isUnChecked) {
      this.unSelectedItems.push(field);
    } else {
      this.unSelectedItems = this.unSelectedItems.filter(item => item.labelId !== field.labelId);
    }
    // Update `selectedColumn` dynamically for the matching item in `allItems`
    this.allItems.forEach(item => item.labelId === field.labelId && (item.selectedColumn = field.selectedColumn));
    this.updateHeaderCheckbox();
  }
  toggleAllSelection(event: any) {
    const isUncheckAll = this.isHeaderCheckBoxChecked;
    this.unSelectedItems = isUncheckAll
      ? []
      : this.allItems
        .filter(item => !this.excludedLabels.includes(item.labelName))
        .map(item => ({ ...item, selectedColumn: false }));
    // Update selectedColumn in allItems as well
    this.allItems.forEach(item => {
      if (!this.excludedLabels.includes(item.labelName)) {
        item.selectedColumn = isUncheckAll;
      }
    });

  }
  updateHeaderCheckbox() {
    this.isHeaderCheckBoxChecked = this.allItems.every((item: any) => item.selectedColumn);
  }
  updatePagination(pagination: Pagination, data: any[]) {
    this.pagination = this.pagerService.getPagedItems(this.pagination, data);
    this.pager = this.socialPagerService.getPager(pagination.totalRecords, pagination.pageIndex, pagination.maxResults);
    this.pagination.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  navigateBetweenPageNumbers(event: any) {
    this.pagination.pageIndex = event.page;
    this.updatePagination(this.pagination, this.allItems);
  }
  closeModalClose() {
    this.referenceService.closeModalPopup('exportExcelModalPopup');
    let valseString = this.selectedFields.length > 0 ? 'order' : 'close';
    this.emitValues(valseString);
  }

  submit() {
    this.referenceService.closeModalPopup('exportExcelModalPopup');
    this.selectedItems = this.allItems.filter(item =>
      !this.unSelectedItems.some(unselected => unselected.labelId === item.labelId)
    );
    this.emitValues('submit');
  }
  setMyPreferances(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedFieldsResponseDto['myPreferances'] = isChecked;
    this.isDefault = isChecked;
  }
  emitValues(value: string) {
    let input: any = { selectFields: this.selectedItems, myPreferances:this.isDefault};
    if (value === 'update' || value === 'order' || value === 'submit') {
      input[value] = value;
      input['myPreferances'] = this.isDefault;
      input['close'] = false;
    }
    this.closeEmitter.emit(input);
  }
  combinedItems: any[] = [];
  combineArraysWithoutDuplicatesAndSort() {
    let notCheckItems: any[] = [];
    notCheckItems = this.allItems.filter(item =>
      !this.selectedFields.some(unselected => unselected.labelId === item.labelId)
    );
    // Updating selectedColumn values
    notCheckItems.forEach(item => {
      item.selectedColumn = false; // Replace `newValue` with the desired value
    });
    this.combinedItems = [...this.selectedFields, ...notCheckItems];
    // Sort by `orderColumn`
    this.combinedItems.sort((a, b) => a.orderColumn - b.orderColumn);
    this.allItems = [];
    this.allItems = [...this.combinedItems];
    if (this.selectedFields.length > 0) {
      this.unSelectedItems = this.allItems.filter(item =>
        !this.selectedFields.some(unselected => unselected.labelId === item.labelId)
      );
    }
  }
  isFieldDisabled(labelName: string): boolean {
    return this.excludedLabels.includes(labelName);
  }
  openOrderComponnet() {
    this.referenceService.closeModalPopup('exportExcelModalPopup');
    this.selectedItems = this.allItems.filter(item =>
      !this.unSelectedItems.some(unselected => unselected.labelId === item.labelId)
    );
    this.emitValues('order');
  }
}

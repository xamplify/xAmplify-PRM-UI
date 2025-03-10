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
  excludedLabels = ["Last Name", "Company", "Email"];
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
          return !this.isDisabled(el);
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
    this.dashboardService.isMyPreferances()
      .subscribe(
        result => {
          let isMyPreferances = result.data;
          if (this.isMyprofile) {
            this.myPreferances = false;
          } else {
            this.myPreferances = result.data;
          }
          if (this.myPreferances) {
            this.isSelectDivOpen = false;
            this.fetchData(this.pagination);
          } else {
            this.isSelectDivOpen = true;
            this.fetchData(this.pagination);
          }
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
  toggleSelection(field: any) {
    const isUnChecked = !field.selectedColumn;
    if (isUnChecked) {
      if(this.isMyprofile) {
      field.defaultColumn = !field.selectedColumn
      }
      this.unSelectedItems.push(field);
    } else {
      if(this.isMyprofile) {
      field.defaultColumn = !field.selectedColumn;
      }
      this.unSelectedItems = this.unSelectedItems.filter(item => item.labelId !== field.labelId);
    }
    this.fieldsPagedItems.forEach(item => item.labelId === field.labelId && (item.selectedColumn = field.selectedColumn));
    this.updateHeaderCheckbox();
  }
  toggleAllSelection() {
    const isUncheckAll = this.isHeaderCheckBoxChecked;
    if (isUncheckAll) {
      this.unSelectedItems = this.unSelectedItems.filter(
        unItem => !this.fieldsPagedItems.some(pItem => pItem.labelName === unItem.labelName)
      );
    } else {
      this.fieldsPagedItems.forEach(item => {
        if (!this.excludedLabels.includes(item.labelName)) {
          item.selectedColumn = false;
          if (!this.unSelectedItems.some(unItem => unItem.labelName === item.labelName)) {
            this.unSelectedItems.push(item);
          }
        }
      });
    }
    this.fieldsPagedItems.forEach((item, index) => {
      if (!this.excludedLabels.includes(item.labelName)) {
        item.selectedColumn = isUncheckAll;
        if (isUncheckAll) {
          this.unSelectedItems = this.unSelectedItems.filter(unItem => unItem.labelName !== item.labelName);
        }
      }
    });
    this.updateHeaderCheckbox();
  }
  updateHeaderCheckbox() {
    if (!(this.pager.pages && this.pager.pages.length)) {
      this.isHeaderCheckBoxChecked = false;
    } else {
      this.isHeaderCheckBoxChecked = this.fieldsPagedItems.every((item: any) => item.selectedColumn);
    }
  }
  isCheked(labelId: any): boolean {
    if (this.isMyprofile) {
      return this.fieldsPagedItems.some(item => item.defaultColumn === true && item.labelId === labelId);
    } else {
      return this.fieldsPagedItems.some(item => item.labelId === labelId);
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
    let allItems = this.isMyprofile ? this.allItems.filter(item => item.selectedColumn === true) :this.selectFieldsDtos.length > 0 ? this.selectFieldsDtos : this.allItems;
    this.selectedItems = allItems.filter(item =>
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

  isFieldDisabled(labelName: string): boolean {
    return this.excludedLabels.includes(labelName) ;
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
  getUniqueColumns(selectFieldsDtos: any[], allItems: any[]) {
    if (!Array.isArray(allItems) || !Array.isArray(selectFieldsDtos)) {
      return;
    }
    const selectFieldPriority = selectFieldsDtos.reduce((acc, item, index) => {
      if (allItems.some(allItem => allItem.labelId === item.labelId)) {
        acc[item.labelId] = index;
      }
      return acc;
    }, {});
    // let totalFields = allItems.map(item => {
    //   let match = selectFieldsDtos.find(x => x.labelId === item.labelId);
    //   return {
    //     ...item,
    //     selectedColumn: match ? match.defaultColumn? match.selectedColumn:selectFieldsDtos.length > 0 ? match.defaultColumn:true : selectFieldsDtos.length > 0 ? false : true,
    //     id: match ? match.id : item.id,
    //     defaultColumn: match ? match.defaultColumn : false,
    //     columnOrder: match ? match.columnOrder : item.columnOrder,
    //   };
    // }
    // );
    let totalFields = allItems.map(item => {
      let match = selectFieldsDtos.find(x => x.labelId === item.labelId);
      if (this.isMyprofile) {
        let exist = selectFieldsDtos.length === 0 ? this.exstingDataDto.find(x => x.labelId === item.labelId) : [];
        return {
          ...item,
          selectedColumn: match ? match.defaultColumn ? match.selectedColumn : selectFieldsDtos.length > 0 ? match.selectedColumn : true : selectFieldsDtos.length > 0 ? false : true,
          id: match ? match.id : exist? exist.id: item.id,
          defaultColumn: match ? match.defaultColumn ? match.selectedColumn : selectFieldsDtos.length > 0 ? match.selectedColumn : true : selectFieldsDtos.length > 0 ? false : true,
          columnOrder: match ? match.columnOrder : item.columnOrder,
        };
      } else {
        return {
          ...item,
          selectedColumn: match ? true : selectFieldsDtos.length > 0 ? false : true, // Original logic when isMyprofile is false
          id: match ? match.id : item.id,
          defaultColumn: match ? match.defaultColumn : false,
          columnOrder: match ? match.columnOrder : item.columnOrder,
        };
      }
    });
    if (this.selectFieldsDtos.length > 0) {
      this.unSelectedItems = totalFields.filter(item =>
        !selectFieldsDtos.some(unselected => unselected.labelId === item.labelId)
      );
    }
    totalFields.sort((a, b) => {
      const priorityA = selectFieldPriority[a.labelId] !== undefined ? selectFieldPriority[a.labelId] : Number.MAX_VALUE;
      const priorityB = selectFieldPriority[b.labelId] !== undefined ? selectFieldPriority[b.labelId] : Number.MAX_VALUE;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.columnOrder - b.columnOrder;
    });
    this.allItems = totalFields;
    if (!this.isMyprofile) {
      this.updateExcludedLabels();
    }
    console.log("defaultFields :", this.defaultFields)
  }
  defaultFields = [];

  updateExcludedLabels() {
    this.defaultFields = this.allItems
      .filter(item => item.defaultColumn === true)
      .map(item => item.labelName)
    this.excludedLabels = this.excludedLabels
      ? Array.from(new Set([...this.excludedLabels, ...this.defaultFields])) // Merge & remove duplicates
      : [...this.defaultFields];
  }
  exstingDataDto:Array<any> = new Array<any>();
  fetchData(pagination: any) {
    this.ngxloading = true;
    let leadFormFields$ = this.dashboardService.getAllLeadFormFields(this.companyProfileName, this.loggedInUserType, this.customName);
    let userFields$ = this.selectFieldsDtos.length === 0
      ? this.dashboardService.getFieldsByUserId(this.customName) : of({ data: this.selectFieldsDtos })

    forkJoin([leadFormFields$, userFields$]).subscribe(
      ([usersData, ordersData]) => {
        this.ngxloading = false;
        if (!this.showBackButton) {
          ordersData.data = ordersData.data.filter(item =>
            usersData.data.some(unselected => unselected.labelId === item.labelId)
          );
        }
        this.exstingDataDto = ordersData.data;
        if (this.isMyprofile) {
          this.selectFieldsDtos = ordersData.data.filter(item => item.defaultColumn === true) || [];
        } else {
          this.selectFieldsDtos = ordersData.data || [];
        }
        this.processData(this.selectFieldsDtos, pagination, usersData.data || []);
      },
      (error) => {
        this.ngxloading = false;
        console.error('Error fetching data:', error);
      }
    );
  }

  private processData(selectFields: any[], pagination: any, usersData: any[] = []) {
    this.getUniqueColumns(selectFields, usersData);
    pagination.totalRecords = usersData.length;
    pagination = this.pagerService.getPagedItems(pagination, usersData);
    this.updateHeaderCheckbox();
    this.setFieldsPage(1);
  }
  goToOrderDiv() {
    this.isSelectDivOpen = false;
    this.showBackButton = true;
    this.selectFieldsDtos = this.allItems.filter(item =>
      !this.unSelectedItems.some(unselected => unselected.labelId === item.labelId)
    );
  }
  chooseYourFields() {
    this.showBackButton = true;
    this.isSelectDivOpen = true;
    this.fetchData(this.pagination);
  }
  showBackButton: boolean = false;
  backToPreviousPage() {
    this.showBackButton = false
    this.isSelectDivOpen = !this.myPreferances;
    if (this.myPreferances) {
      this.selectFieldsDtos = this.allItems.filter(item =>
        !this.unSelectedItems.some(unselected => unselected.labelId === item.labelId)
      );
    }
    this.fetchData(this.pagination);
  }
  isNonDraggable(fieldDto: any): boolean {
    return this.excludedLabels.includes(fieldDto.labelName) && fieldDto.defaultColumn && !this.isMyprofile;
  }
}

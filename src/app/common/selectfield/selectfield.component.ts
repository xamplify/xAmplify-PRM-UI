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

declare var $: any;
@Component({
  selector: 'app-selectfield',
  templateUrl: './selectfield.component.html',
  styleUrls: ['./selectfield.component.css'],
    providers: [PaginationComponent]
})
export class SelectfieldComponent implements OnInit {
  @Output() closeEmitter = new EventEmitter();
  @Input() userType: string = '';
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

  constructor(public dashboardService: DashboardService, public authenticationService: AuthenticationService, private pagerService: PagerService,
    public referenceService: ReferenceService, public socialPagerService: SocialPagerService, public dragulaService: DragulaService,  public paginationComponent: PaginationComponent

  ) {
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.companyProfileName = this.authenticationService.companyProfileName;
      this.selectedFieldsResponseDto['companyProfileName'] = this.companyProfileName;
    }
    this.dragulaService.setOptions('fieldsDragula', {});
    dragulaService.dropModel.subscribe((value) => {
    });
  }
  ngOnInit() {
    this.ngxloading = true;
    this.referenceService.openModalPopup(this.selectModalPopUp);
    this.pageNumber = this.paginationComponent.numberPerPage[0];
    this.getMyPreferances();
    //this.selectFieldValues();
  }
  ngOnDestroy() {
    this.dragulaService.destroy('fieldsDragula');
    this.referenceService.closeModalPopup(this.selectModalPopUp);
  }
  ngOnChanges() {
      this.pageNumber = this.paginationComponent.numberPerPage[0];
      this.getMyPreferances();
  }
  resetPagination() {
    this.pagination.maxResults = 12;
    this.pagination = new Pagination;
    //this.pagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex==1;
    //this.showFilterOption = false;
  }
  getMyPreferances() {
    this.resetPagination();
    this.dashboardService.isMyPreferances()
      .subscribe(
        result => {
          let isMyPreferances = result.data;
          this.myPreferances = result.data;
          this.isSelectDivOpen = true;
          if (isMyPreferances) {
            this.fetchData(this.pagination);
          } else {
            this.getAllLeadFormColumns(this.pagination);
          }
        },
        error => console.log(error),
        () => console.log('finished '));
  }

  getAllLeadFormColumns(pagination: Pagination) {
    this.ngxloading = true;
    this.dashboardService.getAllLeadFormFields(this.companyProfileName, this.userType).subscribe(
      (response: any) => {
        let data = response.data;
        this.ngxloading = false;
        this.allItems.length = 0; // Clear existing data before adding new items
        this.allItems = [...data]
        pagination.totalRecords = data.length;
        pagination = this.pagerService.getPagedItems(pagination, data);
        this.setFieldsPage(1);
        this.updateHeaderCheckbox();
      },
      error => console.log(error),
      () => {
        this.ngxloading = false;
      }
    );
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
      this.unSelectedItems.push(field);
    } else {
      this.unSelectedItems = this.unSelectedItems.filter(item => item.labelId !== field.labelId);

    }
    this.fieldsPagedItems.forEach(item => item.labelId === field.labelId && (item.selectedColumn = field.selectedColumn));
    this.updateHeaderCheckbox();
  }
  toggleAllSelection() {
    const isUncheckAll = this.isHeaderCheckBoxChecked;
    if (isUncheckAll) {
      // If checking all, clear unSelectedItems since everything is selected
      this.unSelectedItems = this.unSelectedItems.filter(
        unItem => !this.fieldsPagedItems.some(pItem => pItem.labelName === unItem.labelName)
      );
    } else {
      // If unchecking all, add items to unSelectedItems
      this.fieldsPagedItems.forEach(item => {
        if (!this.excludedLabels.includes(item.labelName)) {
          item.selectedColumn = false;
          // Add item to unSelectedItems if not already there
          if (!this.unSelectedItems.some(unItem => unItem.labelName === item.labelName)) {
            this.unSelectedItems.push(item);
          }
        }
      });
    }
    // Update selection in pagedItems
    this.fieldsPagedItems.forEach((item, index) => {
      if (!this.excludedLabels.includes(item.labelName)) {
        item.selectedColumn = isUncheckAll;
        // If the item is checked again, remove it from unSelectedItems
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
    return this.fieldsPagedItems.some(item => item.labelId === labelId);
  }

  // updatePagination(pagination: Pagination, data: any[]) {
  //   this.pagination = this.pagerService.getPagedItems(this.pagination, data);
  //   this.pager = this.socialPagerService.getPager(pagination.totalRecords, pagination.pageIndex, pagination.maxResults);
  //   this.fieldsPagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  //   this.updateHeaderCheckbox();
  // }
  // navigateBetweenPageNumbers(event: any) {
  //   this.pagination.pageIndex = event.page;
  //   this.updatePagination(this.pagination, this.allItems);
  // }
  closeModalClose() {
    this.referenceService.closeModalPopup(this.selectModalPopUp);
    this.emitValues('close');
  }
  selectedPageNumber(event:any) {
    this.pageSize = event;
    this.setFieldsPage(1);
  }
  submit() {
    this.referenceService.closeModalPopup(this.selectModalPopUp);
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
    let input: any = { selectFields: this.selectedItems, myPreferances: this.isDefault };
    input['close'] = false;
    if (value === 'submit') {
      input[value] = value;
      input['myPreferances'] = this.isDefault;
    }
    this.closeEmitter.emit(input);
  }

  isFieldDisabled(labelName: string): boolean {
    return this.excludedLabels.includes(labelName);
  }

  getFiledsByUserId() {
    this.isSelectDivOpen = true;
    this.dashboardService.getFieldsByUserId()
      .subscribe(
        result => {
          this.selectFieldsDtos = result.data;
          if (result.statusCode == 200) {
            console.log("this.selectFieldsDtos :", this.selectFieldsDtos);
          }
        },
        error => console.log(error),
        () => {
        });
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
    // const columnMap = new Map();
    // selectFieldsDtos.forEach(col => columnMap.set(col.labelId, col));
    // const allFields = [...allItems];
    // allFields.forEach(col => {
    //   if (!columnMap.has(col.labelId)) {
    //     columnMap.set(col.labelId, col);
    //     col.selectedColumn = false;
    //   }
    // });
    // this.allItems.length = 0;
    // let totalFields = Array.from(columnMap.values());
    // totalFields.sort((a, b) => a.orderColumn - b.orderColumn);
    this.allItems.length = 0;
    let totalFields = allItems.map((item, index) => {
      let match = selectFieldsDtos.find(x => x.labelId === item.labelId);
      return {
        ...item,
        selectedColumn: match ? true : false,
        id: match ? match.id : item.id
      };
    });
    totalFields.sort((a, b) => {
      if (a.selectedColumn === b.selectedColumn) {
        return a.columnOrder - b.columnOrder;
      }
      return a.selectedColumn ? -1 : 1;
    });
    if (this.selectFieldsDtos.length > 0) {
      this.unSelectedItems = totalFields.filter(item =>
        !selectFieldsDtos.some(unselected => unselected.labelId === item.labelId)
      );
    }
    this.allItems = totalFields;
  }

  fetchData(pagination: Pagination) {
    this.ngxloading = true;
    forkJoin([
      this.dashboardService.getAllLeadFormFields(this.companyProfileName, this.userType),
      this.dashboardService.getFieldsByUserId()
    ]).subscribe(
      ([usersData, ordersData]) => {
        this.ngxloading = false;
        const users = usersData;
        const orders = ordersData;
        this.selectFieldsDtos = orders.data;
        this.getUniqueColumns(orders.data, users.data);
        pagination.totalRecords = users.data.length;
        pagination = this.pagerService.getPagedItems(pagination, users.data);
        this.setFieldsPage(1);
      },
      error => {
        this.ngxloading = false;
        console.error('Error fetching data:', error);
      }
    );
  }
}

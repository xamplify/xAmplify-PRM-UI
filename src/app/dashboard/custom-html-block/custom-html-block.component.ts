import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MyProfileService } from '../my-profile.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import { PagerService } from 'app/core/services/pager.service';
import { UtilService } from 'app/core/services/util.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-custom-html-block',
  templateUrl: './custom-html-block.component.html',
  styleUrls: ['./custom-html-block.component.css'],
  providers: [SortOption]
})
export class CustomHtmlBlockComponent implements OnInit {

  selectedHtmlId = 0;
  isAdd: boolean = false;
  isLoading: boolean = false;
  listLoading: boolean = false;
  popupLoader: boolean = false;
  allSelected: boolean = false;
  leftHtmlBody: SafeHtml;
  rightHtmlBody: SafeHtml;
  sanitizedHtml: SafeHtml;
  customErrorMessage: string = '';
  isDeleteOptionClicked: boolean = false;
  ADD_CUSTOM_HTML_DIV = "add-custom-html";
  pagination: Pagination = new Pagination();
  MODAL_POPUP = "custom_html_block_modal_popup";
  MANAGE_CUSTOM_HTML_DIV = "manage-custom-html";
  @ViewChild('fullFileInput') fileInput1: ElementRef;
  @ViewChild('leftFileInput') fileInput2: ElementRef;
  @ViewChild('rightFileInput') fileInput3: ElementRef;
  customResponse: CustomResponse = new CustomResponse();
  customHtmlBlock: any = {
    id: 0, title: '', htmlBody: '', loggedInUserId: 0, leftHtmlBody: '',
    rightHtmlBody: '', selected: false, layoutSize: 'SINGLE_COLUMN_LAYOUT', titleVisible: false };

  constructor(private myProfileService: MyProfileService, public referenceService: ReferenceService,
    public sortOption: SortOption, public authenticationService: AuthenticationService, public pagerService: PagerService,
    public utilService: UtilService, public sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.findPaginatedCustomHtmlBlocks(this.pagination);
  }

  navigateBetweenPageNumbers(event: any) {
    this.pagination.pageIndex = event.page;
    this.findPaginatedCustomHtmlBlocks(this.pagination);
  }

  findPaginatedItems(event: any) {
    this.pagination.maxResults = event.maxResults;
    this.findPaginatedCustomHtmlBlocks(this.pagination);
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchOnKeyPress(keyCode: any) { if (keyCode === 13) { this.search(); } }

  sortBy(text: any) {
    this.sortOption.selectedCampaignEmailTemplateDropDownOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedCampaignEmailTemplateDropDownOption, pagination);
    this.findPaginatedCustomHtmlBlocks(pagination);
  }

  refreshList() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.findPaginatedCustomHtmlBlocks(this.pagination);
  }

  resetDeleteOptions() {
    this.isDeleteOptionClicked = false;
    this.selectedHtmlId = 0;
  }

  showConfirmSweetAlert(id: number) {
    this.isDeleteOptionClicked = true;
    this.selectedHtmlId = id;
  }

  isValid(): boolean {
    if (this.customHtmlBlock.layoutSize === 'TWO_COLUMN_LAYOUT') {
      if (this.customHtmlBlock.leftHtmlBody || this.customHtmlBlock.rightHtmlBody) {
        return !this.customHtmlBlock.title.trim();
      } else if (this.customHtmlBlock.title) {
        if (this.customHtmlBlock.leftHtmlBody || this.customHtmlBlock.rightHtmlBody) {
          return !this.customHtmlBlock.title.trim();
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return (!this.customHtmlBlock.title.trim() || !this.customHtmlBlock.htmlBody.trim());
    }
  }

  customUiSwitchEventReceiver(event: any) {
    this.customHtmlBlock.selected = event;
  }

  titleUiSwitchEventReceiver(event: any) {
    this.customHtmlBlock.titleVisible = event;
  }

  goToAddHtmlDiv() {
    this.isAdd = true;
    this.setUpCustomHtmlBlock();
    this.customResponse = new CustomResponse();
    this.referenceService.showDiv(this.ADD_CUSTOM_HTML_DIV);
    this.referenceService.hideDiv(this.MANAGE_CUSTOM_HTML_DIV);
  }

  goToManage() {
    this.setUpCustomHtmlBlock();
    this.referenceService.hideDiv(this.ADD_CUSTOM_HTML_DIV);
    this.referenceService.showDiv(this.MANAGE_CUSTOM_HTML_DIV);
    this.referenceService.scrollSmoothToTop();
    this.customResponse = new CustomResponse();
    if (this.fileInput1) {
      this.fileInput1.nativeElement.value = '';
    }
    if (this.fileInput2) {
      this.fileInput2.nativeElement.value = '';
    }
    if (this.fileInput3) {
      this.fileInput3.nativeElement.value = '';
    }
    this.customErrorMessage = '';
    this.sanitizedHtml = '';
    this.leftHtmlBody = '';
    this.rightHtmlBody = '';
    this.isAdd = false;
  }

  setUpCustomHtmlBlock() {
    this.customHtmlBlock = { id: 0, title: '', htmlBody: '', loggedInUserId: 0, leftHtmlBody: '',
      rightHtmlBody: '', selected: false, layoutSize: 'SINGLE_COLUMN_LAYOUT', titleVisible: false };
  }

  copyAndSave(id: number) {
    this.referenceService.openModalPopup(this.MODAL_POPUP);
    this.findById(id);
  }

  editCustomHtmlBlock(id: number) {
    this.findById(id);
    this.customResponse = new CustomResponse();
    this.referenceService.showDiv(this.ADD_CUSTOM_HTML_DIV);
    this.referenceService.hideDiv(this.MANAGE_CUSTOM_HTML_DIV);
  }

  updateHtmlBody() {
    if (this.customHtmlBlock.layoutSize === 'SINGLE_COLUMN_LAYOUT') {
      this.customHtmlBlock.rightHtmlBody = '';
      this.customHtmlBlock.leftHtmlBody = '';
    } else if (this.customHtmlBlock.layoutSize === 'TWO_COLUMN_LAYOUT') {
      this.customHtmlBlock.htmlBody = '';
    }
  }

  onFileSelected(event: any, side: string) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    $('[data-toggle="tooltip"]').tooltip('hide');
    if (file) {
      const reader = new FileReader();
      if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        reader.onload = (e: any) => {
          const html = e.target.result;
          this.updateSanitizedHtml(html, side);
          fileInput.value = '';
        };
        reader.readAsText(file);
      } else {
        console.error('Unsupported file type. Please upload an HTML/HTM file.');
        fileInput.value = '';
      }
    } else {
      console.error('No file selected.');
    }
  }

  findPaginatedCustomHtmlBlocks(pagination: Pagination) {
    this.listLoading = true;
    this.referenceService.scrollSmoothToTop();
    this.customResponse = new CustomResponse();
    this.myProfileService.findPaginatedCustomHtmlBlocks(pagination)
      .subscribe((response) => {
        if (response.statusCode === 200) {
          let data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
        } else {
          this.customResponse = new CustomResponse('ERROR', "Unable to get custom html blocks.", true);
        }
        this.listLoading = false;
      }, error => {
        this.listLoading = false;
        let message = this.referenceService.getApiErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', message, true);
      });
  }

  saveOrUpdateCustomblock() {
    this.isLoading = true;
    this.updateHtmlBody();
    this.customResponse = new CustomResponse();
    const serviceCall = this.isAdd
      ? this.myProfileService.saveCustomHtmlBlock(this.customHtmlBlock)
      : this.myProfileService.updateCustomHtmlBlock(this.customHtmlBlock);
    serviceCall.subscribe(
      response => {
        this.isLoading = false;
        if (response.statusCode === 200) {
          this.goToManage();
          this.refreshList();
          this.closeModalPopup();
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
        } else if (response.statusCode === 413) {
          this.customErrorMessage = response.message;
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      }, error => {
        this.isLoading = false;
        let message = this.referenceService.showHttpErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', message, true);
      }
    );
  }

  findById(id: number) {
    this.popupLoader = true;
    this.setUpCustomHtmlBlock();
    this.customResponse = new CustomResponse();
    this.myProfileService.findById(id).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.customHtmlBlock = response.data;
          if (this.isAdd) {
            this.customHtmlBlock.title = this.customHtmlBlock.title + '-copy';
          } else {
            if (this.customHtmlBlock.htmlBody) {
              this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
            } else {
              this.updateSanitizedHtml(this.customHtmlBlock.leftHtmlBody, 'left');
              this.updateSanitizedHtml(this.customHtmlBlock.rightHtmlBody, 'right');
            }
          }
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.popupLoader = false;
      }, error => {
        this.popupLoader = false;
        let message = this.referenceService.showHttpErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', message, true);
      });
  }

  delete(event: any) {
    this.customResponse = new CustomResponse();
    if (event) {
      this.listLoading = true;
      this.myProfileService.deleteCustomHtmlBlock(this.selectedHtmlId)
        .subscribe(response => {
          if (response.statusCode === 200) {
            this.refreshList();
            this.resetDeleteOptions();
            this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          } else {
            this.customResponse = new CustomResponse('ERROR', response.message, true);
          }
        }, error => {
          let message = this.referenceService.showHttpErrorMessage(error);
          this.customResponse = new CustomResponse('ERROR', message, true);
          this.resetDeleteOptions();
          this.listLoading = false;
        }
        );
    } else {
      this.resetDeleteOptions();
    }
  }

  updateDropDownHtmlBody(text: any) {
    if (text === 'SINGLE_COLUMN_LAYOUT') {
      if (this.customHtmlBlock.htmlBody) {
        this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
      } else if (this.customHtmlBlock.leftHtmlBody) {
        this.customHtmlBlock.htmlBody = this.customHtmlBlock.leftHtmlBody;
        this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
      } else if (this.customHtmlBlock.rightHtmlBody) {
        this.customHtmlBlock.htmlBody = this.customHtmlBlock.rightHtmlBody;
        this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
      }
    } else if (text === 'TWO_COLUMN_LAYOUT') {
      if (this.customHtmlBlock.leftHtmlBody) {
        this.updateSanitizedHtml(this.customHtmlBlock.leftHtmlBody, 'left');
      } else if (this.customHtmlBlock.htmlBody) {
        this.customHtmlBlock.leftHtmlBody = this.customHtmlBlock.htmlBody;
        this.updateSanitizedHtml(this.customHtmlBlock.leftHtmlBody, 'left');
      }
    }
  }

  closeModalPopup() {
    this.referenceService.closeModalPopup(this.MODAL_POPUP);
    this.goToManage();
  }

  toggleAllSelection() {
    this.pagination.pagedItems.forEach(item => {
      item.selected = this.allSelected;
    });
    this.updateSelectedHtmlBlock();
  }

  updateSelection() {
    this.isAllSelected();
    this.updateSelectedHtmlBlock();
  }

  isAllSelected() {
    this.allSelected = this.pagination.pagedItems.every(item => item.selected);
  }

  updateSelectedHtmlBlock() {
    let customHtmlBlocks = new Array<any>()
    this.pagination.pagedItems.forEach(item => {
      let customHtmlBlock = { 'id': item.id, 'selected': item.selected };
      customHtmlBlocks.push(customHtmlBlock);
    });
    this.customHtmlBlock['customHtmlBlockDtos'] = customHtmlBlocks;
    this.myProfileService.updateSelectedHtmlBlock(this.customHtmlBlock).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      }, error => {
        let message = this.referenceService.showHttpErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', message, true);
      });
  }

  updateSanitizedHtml(htmlbody: string, side: string) {
    if (side === 'left') {
      this.customHtmlBlock.leftHtmlBody = htmlbody;
      this.leftHtmlBody = this.sanitizer.bypassSecurityTrustHtml(htmlbody);
    } else if (side === 'right') {
      this.customHtmlBlock.rightHtmlBody = htmlbody
      this.rightHtmlBody = this.sanitizer.bypassSecurityTrustHtml(htmlbody);
    } else {
      this.customHtmlBlock.htmlBody = htmlbody
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlbody);
    }
    this.cdr.detectChanges();
  }

}

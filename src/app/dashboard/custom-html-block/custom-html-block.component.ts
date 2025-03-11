import { Component, OnInit } from '@angular/core';
import { MyProfileService } from '../my-profile.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FileUploader } from 'ng2-file-upload';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import * as JSZip from 'jszip';
import { PagerService } from 'app/core/services/pager.service';
import { UtilService } from 'app/core/services/util.service';

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
  customErrorMessage: string = '';
  hasBaseDropZoneOver: boolean = false;
  isDeleteOptionClicked: boolean = false;
  ADD_CUSTOM_HTML_DIV = "add-custom-html";
  pagination: Pagination = new Pagination();
  MODAL_POPUP = "custom_html_block_modal_popup";
  MANAGE_CUSTOM_HTML_DIV = "manage-custom-html";
  customResponse: CustomResponse = new CustomResponse();
  customHtmlBlock: any = { id: 0, title: '', htmlBody: '', loggedInUserId: 0 };
  emailTemplateUploader: FileUploader = new FileUploader({
    url: 'YOUR_UPLOAD_URL', allowedFileType: ['zip'], maxFileSize: 10 * 1024 * 1024
  });

  constructor(private myProfileService: MyProfileService, public referenceService: ReferenceService,
    public sortOption: SortOption, public authenticationService: AuthenticationService, public pagerService: PagerService,
    public utilService: UtilService) { }

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
    this.referenceService.scrollSmoothToTop();
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

  isValid() {
    return !this.customHtmlBlock.title.trim() || !this.customHtmlBlock.htmlBody.trim();
  }

  goToAddHtmlDiv() {
    this.customResponse = new CustomResponse();
    this.referenceService.showDiv(this.ADD_CUSTOM_HTML_DIV);
    this.referenceService.hideDiv(this.MANAGE_CUSTOM_HTML_DIV);
  }

  goToManage() {
    this.referenceService.hideDiv(this.ADD_CUSTOM_HTML_DIV);
    this.referenceService.showDiv(this.MANAGE_CUSTOM_HTML_DIV);
    this.customHtmlBlock = { id: 0, title: '', htmlBody: '', loggedInUserId: 0 };
    this.referenceService.scrollSmoothToTop();
    this.emailTemplateUploader.clearQueue();
    this.customResponse = new CustomResponse();
    this.customErrorMessage = '';
    this.isAdd = false;
  }

  fileOverBase(event: any): void {
    this.hasBaseDropZoneOver = event;
  }

  fileDropPreview(event: any): void {
    this.extractHtmlFromZip(event);
  }

  dropClick(): void {
    $('#file-upload').click();
  }

  changeLogo(event: any): void {
    this.extractHtmlFromZip(event.target.files);
  }

  async extractHtmlFromZip(files: FileList): Promise<void> {
    const zip = new JSZip();
    const file = files[0];
    try {
      const content = await zip.loadAsync(file);
      const htmlFiles: string[] = [];
      for (const filename in content.files) {
        if (content.files.hasOwnProperty(filename)) {
          const fileData = content.files[filename];
          if (fileData.name.endsWith('.html')) {
            const htmlContent = await fileData.async('text');
            htmlFiles.push(htmlContent);
          }
        }
      }
      if (htmlFiles.length > 0) {
        this.customHtmlBlock.htmlBody = htmlFiles[0];
        this.isAdd = true;
      } else {
        this.customResponse = new CustomResponse('ERROR', 'No HTML file found in the ZIP.', true);
        console.error('No HTML file found in the ZIP.');
      }
    } catch (error) {
      console.error('Error extracting ZIP file:', error);
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
    this.customResponse = new CustomResponse();
    this.referenceService.scrollSmoothToTop();
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
    this.customResponse = new CustomResponse();
    this.referenceService.showModalPopup(this.MODAL_POPUP);
    this.popupLoader = true;
    this.myProfileService.findById(id).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.customHtmlBlock = response.data;
          if (this.isAdd) {
            this.customHtmlBlock.title = this.customHtmlBlock.title + '-copy';
          }
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.popupLoader = false;
      }, error => {
        this.popupLoader = false;
        this.referenceService.closeModalPopup(this.MODAL_POPUP);
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

  updateSelection(customDto: any) {
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

}

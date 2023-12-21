import { Component, OnInit,Output,EventEmitter,Input } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Properties } from '../models/properties';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from '../models/custom-response';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { LmsService } from 'app/lms/services/lms.service';

declare var $:any;

@Component({
  selector: 'app-share-tracks-or-playbooks',
  templateUrl: './share-tracks-or-playbooks.component.html',
  styleUrls: ['./share-tracks-or-playbooks.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption,LmsService]
})
export class ShareTracksOrPlaybooksComponent implements OnInit {

 
  pagination:Pagination = new Pagination();
  sortOption:SortOption = new SortOption();
  customResponse:CustomResponse = new CustomResponse();
  @Output() shareTracksOrPlayBooksEventEmitter = new EventEmitter();
  @Input() selectedUserListId = 0;
  @Input() contact:any;
  @Input() type: string;
  selectedTrackOrPlayBookIds = [];
  isHeaderCheckBoxChecked = false;
  firstName = "";
  lastName = "";
  companyName = "";
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  constructor(private lmsService:LmsService,private authenticationService:AuthenticationService,
    private referenceService:ReferenceService,private pagerService:PagerService,
    private vanityUrlService:VanityURLService,private utilService:UtilService,
    private xtremandLogger:XtremandLogger) { }

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.pagination.userListId = this.selectedUserListId;
    let contact = this.contact;
    if(contact!=undefined){
      this.pagination.partnerOrContactEmailId = contact.emailId;
      this.pagination.partnerId = contact.id;
      this.firstName = contact.firstName;
      this.lastName = contact.lastName;
      this.companyName = contact.contactCompany;
    }else{
      this.pagination.partnerId = 0;
    }
    this.findTracksOrPlayBooks(this.pagination);
  }


  private findTracksOrPlayBooks(pagination:Pagination) {
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    this.referenceService.scrollToModalBodyTopByClass();
    this.lmsService.findUnPublishedTracksOrPlayBooks(this.pagination,this.type).subscribe(
      response => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        /*******Header checkbox will be chcked when navigating through page numbers*****/
        var assetIds = pagination.pagedItems.map(function(a) { return a.id; });
        var items = $.grep(this.selectedTrackOrPlayBookIds, function(element: any) {
            return $.inArray(element, assetIds) !== -1;
        });
        if (items.length == assetIds.length) {
            this.isHeaderCheckBoxChecked = true;
        } else {
            this.isHeaderCheckBoxChecked = false;
        }
       this.referenceService.stopLoader(this.httpRequestLoader);
      }, error => {
        this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
      });
  }

  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.damSortOption = text;
    this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  searchTracksOrPlayBooks() {
    this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
    this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
    this.customResponse = new CustomResponse();
    this.pagination.pageIndex = event.page;
    this.findTracksOrPlayBooks(this.pagination);
  }
  

  getAllFilteredResults(pagination: Pagination) {
    this.customResponse = new CustomResponse();
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.damSortOption, pagination);
    this.findTracksOrPlayBooks(pagination);
  }
  findUnPublishedTracksOrPlayBooksOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchTracksOrPlayBooks(); } }

  /*****CheckBox Code******/
  highlightSelectedRowOnRowClick(selectedAssetId: any, event: any) {
    this.referenceService.highlightRowOnRowCick('unPublished-tracks-or-playbooks-tr', 'unPublishedTracksOrPlayBooksTable', 'unPublishedTracksOrPlayBooksCheckBox', this.selectedTrackOrPlayBookIds, 'unPublished-tracks-or-playbooks-header-checkbox-id', selectedAssetId, event);
    this.sendEmitterValues();
  }

  highlightRowOnCheckBoxClick(selectedAssetId: any, event: any) {
    this.referenceService.highlightRowByCheckBox('unPublished-tracks-or-playbooks-tr', 'unPublishedTracksOrPlayBooksTable', 'unPublishedTracksOrPlayBooksCheckBox', this.selectedTrackOrPlayBookIds, 'unPublished-tracks-or-playbooks-header-checkbox-id', selectedAssetId, event);
    this.sendEmitterValues();
  }

  selectOrUnselectAllRowsOfTheCurrentPage(event: any) {
    this.selectedTrackOrPlayBookIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('unPublished-tracks-or-playbooks-tr', 'unPublishedTracksOrPlayBooksTable', 'unPublishedTracksOrPlayBooksCheckBox', this.selectedTrackOrPlayBookIds, this.pagination, event);
		this.sendEmitterValues();
  }

  sendEmitterValues(){
		let emitterObject = {};
		emitterObject['selectedRowIds'] = this.selectedTrackOrPlayBookIds;
    emitterObject['isPartnerInfoRequried'] = false;
    if(this.pagination.partnerId!=undefined && this.pagination.partnerId>0){
      let partnerDetails = { 
        'emailId': this.pagination.partnerOrContactEmailId,
        'firstName':this.firstName,
        'lastName':this.lastName,
        'companyName':this.companyName 
      };
      emitterObject['partnerDetails'] = partnerDetails;
      emitterObject['isPartnerInfoRequried'] = true;
      emitterObject['isPublishingToPartnerList'] = false;
    }else{
      emitterObject['isPublishingToPartnerList'] = true;
    }
		this.shareTracksOrPlayBooksEventEmitter.emit(emitterObject);
	}
}

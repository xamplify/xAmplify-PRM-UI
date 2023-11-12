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
import { DamService } from 'app/dam/services/dam.service';
declare var $:any;
@Component({
  selector: 'app-share-assets',
  templateUrl: './share-assets.component.html',
  styleUrls: ['./share-assets.component.css'],
  providers: [Pagination,DamService,HttpRequestLoader,Properties,SortOption]
})
export class ShareAssetsComponent implements OnInit {

  pagination:Pagination = new Pagination();
  sortOption:SortOption = new SortOption();
  customResponse:CustomResponse = new CustomResponse();
  @Output() shareAssetsEventEmitter = new EventEmitter();
  @Input() selectedUserListId = 0;
  selectedAssetIds = [];
  isHeaderCheckBoxChecked = false;
  firstName = "";
  lastName = "";
  companyName = "";
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  constructor(private damService:DamService,private authenticationService:AuthenticationService,
    private referenceService:ReferenceService,private pagerService:PagerService,
    private vanityUrlService:VanityURLService,private utilService:UtilService,private xtremandLogger:XtremandLogger) { }

  ngOnInit() {
    this.referenceService.startLoader(this.httpRequestLoader);
    this.pagination.userListId = this.selectedUserListId;
    this.findUnPublishedAssets(this.pagination);
  }


  private findUnPublishedAssets(pagination:Pagination) {
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    this.referenceService.scrollToModalBodyTopByClass();
    this.damService.findUnPublishedAssets(this.pagination).subscribe(
      response => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        /*******Header checkbox will be chcked when navigating through page numbers*****/
        var assetIds = pagination.pagedItems.map(function(a) { return a.id; });
        var items = $.grep(this.selectedAssetIds, function(element: any) {
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
  searchAssets() {
    this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
    this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
    this.customResponse = new CustomResponse();
    this.pagination.pageIndex = event.page;
    this.findUnPublishedAssets(this.pagination);
  }
  

  getAllFilteredResults(pagination: Pagination) {
    this.customResponse = new CustomResponse();
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.damSortOption, pagination);
    this.findUnPublishedAssets(pagination);
  }
  findUnPublishedAssetsOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchAssets(); } }

  /*****CheckBox Code******/
  highlightSelectedAssetOnRowClick(selectedAssetId: any, event: any) {
    this.referenceService.highlightRowOnRowCick('unPublished-assets-tr', 'unPublishedAssetsTable', 'unPublishedAssetsCheckBox', this.selectedAssetIds, 'unPublished-assets-header-checkbox-id', selectedAssetId, event);
    this.sendEmitterValues();
  }

  highlightAssetRowOnCheckBoxClick(selectedAssetId: any, event: any) {
    this.referenceService.highlightRowByCheckBox('unPublished-assets-tr', 'unPublishedAssetsTable', 'unPublishedAssetsCheckBox', this.selectedAssetIds, 'unPublished-assets-header-checkbox-id', selectedAssetId, event);
    this.sendEmitterValues();
  }

  selectOrUnselectAllRowsOfTheCurrentPage(event: any) {
    this.selectedAssetIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('unPublished-assets-tr', 'unPublishedAssetsTable', 'unPublishedAssetsCheckBox', this.selectedAssetIds, this.pagination, event);
		this.sendEmitterValues();
  }

  sendEmitterValues(){
		let emitterObject = {};
		emitterObject['selectedRowIds'] = this.selectedAssetIds;
    emitterObject['isPartnerInfoRequried'] = false;
    if(this.pagination.partnerId>0){
      let partnerDetails = { 
        'emailId': this.pagination.partnerOrContactEmailId,
        'firstName':this.firstName,
        'lastName':this.lastName,
        'companyName':this.companyName 
      };
      emitterObject['partnerDetails'] = partnerDetails;
      emitterObject['isPartnerInfoRequried'] = true;
    }
		this.shareAssetsEventEmitter.emit(emitterObject);
	}
}

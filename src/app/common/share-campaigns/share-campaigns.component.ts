import { Component, OnInit,Output,EventEmitter } from '@angular/core';
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
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { UtilService } from 'app/core/services/util.service';



declare var $:any;

@Component({
  selector: 'app-share-campaigns',
  templateUrl: './share-campaigns.component.html',
  styleUrls: ['./share-campaigns.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class ShareCampaignsComponent implements OnInit {

  @Output() shareCampaignsEventEmitter = new EventEmitter();
  pagination:Pagination = new Pagination();
  firstName = "";
  lastName = "";
  companyName = "";
  type = "";
  newEmailIdsAreAdded = false;
  customResponse:CustomResponse = new CustomResponse();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  sortOption:SortOption = new SortOption();
  selectedCampaignIds = [];
  isHeaderCheckBoxChecked = false;

  constructor(public authenticationService:AuthenticationService,private referenceService:ReferenceService,
    private pagerService:PagerService,private vanityUrlService:VanityURLService,private xtremandLogger:XtremandLogger,
    private campaignService:CampaignService,public utilService:UtilService) { }

  ngOnInit() {
    
  }

  loadCampaigns(selectedPartnerListId:number,contact:any,type:string){
    this.pagination.partnerOrContactEmailId = contact.emailId;
    this.pagination.partnerId = contact.id;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.companyName = contact.contactCompany;
    this.pagination.userListId = selectedPartnerListId;
    this.type = type;
    this.newEmailIdsAreAdded = false;
    if(type=="Contact" && this.vanityUrlService.isVanityURLEnabled()){
      this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.pagination.vanityUrlFilter = true;
    }
    this.findCampaigns(this.pagination);

  }


  findCampaigns(pagination: Pagination) {
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    this.campaignService.listCampaignsByUserListIdAndUserId(pagination, this.type)
        .subscribe(
        response => {
            const data = response.data;
            pagination.totalRecords = data.totalRecords;
            this.sortOption.totalRecords = data.totalRecords;
            let campaigns = data.campaigns;
            $.each(campaigns, function(_index: number, campaign: any) {
                campaign.displayTime = new Date(campaign.launchTimeInString);
            });
            pagination = this.pagerService.getPagedItems(pagination, campaigns);
            /*******Header checkbox will be chcked when navigating through page numbers*****/
            var campaignIds = this.pagination.pagedItems.map(function(a) { return a.id; });
            var items = $.grep(this.selectedCampaignIds, function(element: any) {
                return $.inArray(element, campaignIds) !== -1;
            });
            if (items.length == campaignIds.length) {
                this.isHeaderCheckBoxChecked = true;
            } else {
                this.isHeaderCheckBoxChecked = false;
            }
           this.referenceService.stopLoader(this.httpRequestLoader);
        },
        (_error: any) => {
            this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
        });
}

/********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.selectedShareCampaignDropDownOption = text;
    this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  searchCampaigns() {
    this.getAllFilteredResults(this.pagination);
  }

  paginationDropdown(items: any) {
    this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
    this.customResponse = new CustomResponse();
    this.pagination.pageIndex = event.page;
    this.findCampaigns(this.pagination);
  }
  

  getAllFilteredResults(pagination: Pagination) {
    this.customResponse = new CustomResponse();
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedShareCampaignDropDownOption, pagination);
    this.findCampaigns(pagination);
  }
  findCampaignsOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchCampaigns(); } }


}

import { Component, OnInit, Input } from '@angular/core';
import { Campaign } from '../../campaigns/models/campaign';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { ContactService } from '../../contacts/services/contact.service';

declare var  $: any;
@Component({
  selector: 'app-send-campaigns',
  templateUrl: './send-campaigns.component.html',
  styleUrls: ['./send-campaigns.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class SendCampaignsComponent implements OnInit {

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: number;
  sortOption: SortOption = new SortOption();
  isHeaderCheckBoxChecked = false;
  selectedCampaignIds: any[] = [];
  isCampaignSelected: boolean;
  ngxLoading: boolean;
  sendSuccess = false;
  responseMessage = "";
  responseImage = "";
  responseClass = "event-success";
  statusCode = 0;
  constructor(private campaignService: CampaignService, private router: Router, private xtremandLogger: XtremandLogger,
    public pagination: Pagination, private pagerService: PagerService, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService, public contactService: ContactService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }


  ngOnInit() {


  }

  openPopUp(partnerListId: number, emailId: string,partnerId:number,type:string) {
    $('#sendCampaignsPopup').modal('show');
    this.pagination.partnerOrContactEmailId = emailId;
    this.pagination.partnerId = partnerId;
    this.pagination.userListId = partnerListId;
    this.listCampaigns(this.pagination);

  }

  listCampaigns(pagination: Pagination) {
    this.customResponse = new CustomResponse();
    this.referenceService.startLoader(this.httpRequestLoader);
    pagination.userId = this.loggedInUserId;
    this.campaignService.listCampaignsByUserListIdAndUserId(pagination)
      .subscribe(
        response => {
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          this.sortOption.totalRecords = data.totalRecords;
          let campaigns = data.campaigns;
          $.each(campaigns, function (_index: number, campaign: any) {
            campaign.displayTime = new Date(campaign.launchTimeInString);
          });
          pagination = this.pagerService.getPagedItems(pagination, campaigns);
          /*******Header checkbox will be chcked when navigating through page numbers*****/
          var campaignIds = this.pagination.pagedItems.map(function (a) { return a.id; });
          var items = $.grep(this.selectedCampaignIds, function (element) {
            return $.inArray(element, campaignIds) !== -1;
          });
          if (items.length == campaignIds.length) {
            this.isHeaderCheckBoxChecked = true;
          } else {
            this.isHeaderCheckBoxChecked = false;
          }
          this.referenceService.stopLoader(this.httpRequestLoader);
        },
        (error: any) => {
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
        },
        () => this.xtremandLogger.info('Finished listCampaignsByUserListIdAndUserId()')
      );
  }

  closePopup() {
    $('#sendCampaignsPopup').modal('hide');
    this.sendSuccess = false;
    this.responseMessage = "";
    this.responseImage = "";
    this.responseClass = "";
    this.resetFields();
  }

  resetFields(){
    this.pagination = new Pagination();
    this.sortOption = new SortOption();
    this.isHeaderCheckBoxChecked = false;
    this.selectedCampaignIds = [];
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
    this.listCampaigns(this.pagination);
  }
  

  getAllFilteredResults(pagination: Pagination) {
    this.customResponse = new CustomResponse();
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedShareCampaignDropDownOption, this.pagination);
    this.listCampaigns(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCampaigns(); } }

  /***********CheckBox Selection************ */
  checkAll(ev) {
    if (ev.target.checked) {
      $('[name="campaignCheckBoxName[]"]').prop('checked', true);
      this.isCampaignSelected = true;
      let self = this;
      $('[name="campaignCheckBoxName[]"]:checked').each(function (index: number) {
        var id = $(this).val();
        self.selectedCampaignIds.push(parseInt(id));
        // self.userListDTOObj.push(self.contactsPagination.pagedItems[index]);
        console.log(self.selectedCampaignIds);
        $('#campaignTr_' + id).addClass('row-selected');
      });
      this.selectedCampaignIds = this.referenceService.removeDuplicates(this.selectedCampaignIds);
      if (this.selectedCampaignIds.length == 0) { this.isCampaignSelected = false; }
      // this.userListDTOObj = this.referenceService.removeDuplicates( this.userListDTOObj );
    } else {
      $('[name="campaignCheckBoxName[]"]').prop('checked', false);
      $('#campaign-list-table tr').removeClass("row-selected");
      if (this.pagination.maxResults > 30 || (this.pagination.maxResults == this.pagination.totalRecords)) {
        this.isCampaignSelected = false;
        this.selectedCampaignIds = [];
      } else {
        this.selectedCampaignIds = this.referenceService.removeDuplicates(this.selectedCampaignIds);
        let currentPageSelectedIds = this.pagination.pagedItems.map(function (a) { return a.id; });
        this.selectedCampaignIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedCampaignIds, currentPageSelectedIds);
        //  this.userListDTOObj =  this.referenceService.removeDuplicatesFromTwoArrays(this.userListDTOObj, this.pagination.pagedItems);
        if (this.selectedCampaignIds.length == 0) {
          this.isCampaignSelected = false;
          // this.userListDTOObj = [];
        }
      }

    }
    ev.stopPropagation();
  }

  highlightRowByCheckBox(campaign: any, event: any) {
    let campaignId = campaign.id;
    let isChecked = $('#' + campaignId).is(':checked');
    if (isChecked) {
      $('#campaignTr_' + campaignId).addClass('row-selected');
      this.selectedCampaignIds.push(campaignId);
      // this.userListDTOObj.push(contactList);
    } else {
      $('#campaignTr_' + campaignId).removeClass('row-selected');
      this.selectedCampaignIds.splice($.inArray(campaignId, this.selectedCampaignIds), 1);
      // this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
    }
    this.utility();
    event.stopPropagation();
  }

  utility() {
    var trLength = $('#campaign-list-table tbody tr').length;
    var selectedRowsLength = $('[name="campaignCheckBoxName[]"]:checked').length;
    if (selectedRowsLength > 0) {
      this.isCampaignSelected = true;
    } else {
      this.isCampaignSelected = false;
    }
    if (trLength != selectedRowsLength) {
      $('#checkAllCampaigns').prop("checked", false)
    } else if (trLength == selectedRowsLength) {
      $('#checkAllCampaigns').prop("checked", true);
    }
  }

  highlightSelectedCampaignRow(campaign: any, event: any) {
    let campaignId = campaign.id;
    let isChecked = $('#' + campaignId).is(':checked');
    if (isChecked) {
      //Removing Highlighted Row
      $('#' + campaignId).prop("checked", false);
      $('#campaignTr_' + campaignId).removeClass('row-selected');
      this.selectedCampaignIds.splice($.inArray(campaignId, this.selectedCampaignIds), 1);
      //this.userListDTOObj= this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
    } else {
      //Highlighting Row
      $('#' + campaignId).prop("checked", true);
      $('#campaignTr_' + campaignId).addClass('row-selected');
      this.selectedCampaignIds.push(campaignId);
      //  this.userListDTOObj.push(contactList);
    }
    //this.userListDTOObj= this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
    this.utility();
    event.stopPropagation();
  }

  /***********Send Campaigns************ */
  sendCampaigns() {
    this.customResponse = new CustomResponse();
    if(this.selectedCampaignIds.length>0){
    this.ngxLoading = true;
    let users = [];
    let user = { 'emailId': this.pagination.partnerOrContactEmailId };
    users.push(user);
    let campaignDetails = {
      "campaignIds": this.selectedCampaignIds,
      "users": users,
      "contactListId": this.pagination.userListId
    }
    this.contactService.sendCampaignEmails(campaignDetails)
      .subscribe(
        data => {
            if (data.access) {
                this.sendSuccess = true;
                this.statusCode = data.statusCode;
                if (data.statusCode == 200) {
                    this.responseMessage = "Campaign(s) Shared Successfully";
                } else {
                    this.responseMessage = data.message;
                }
                this.ngxLoading = false;
                this.resetFields();
            } else {
                this.authenticationService.forceToLogout();
            }
        },
        error => {
          this.ngxLoading = false;
          this.sendSuccess = false;
          this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
        }, () => {
        }
      );
    }else{
      this.referenceService.goToTop();
      this.customResponse = new CustomResponse('ERROR','Please select atleast one campaign',true);
    }
    
  }
}

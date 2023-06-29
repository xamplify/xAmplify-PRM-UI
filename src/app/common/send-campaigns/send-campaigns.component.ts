import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { ContactService } from '../../contacts/services/contact.service';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { CampaignService } from '../../campaigns/services/campaign.service';

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
  firstName = "";
  lastName = "";
  companyName = "";
  type = "";
  newEmailIdsAreAdded = false;
  isLoggedInThroughVanityUrl = false;
  /******When a new partner is added in list******* */
  newlyAddedPartners:any[] = [];
  isPartnersRouter = false;
  constructor(private campaignService: CampaignService,private xtremandLogger: XtremandLogger,
    public pagination: Pagination, private pagerService: PagerService, public authenticationService: AuthenticationService, 
    public referenceService: ReferenceService, public properties: Properties, public utilService: UtilService, public contactService: ContactService,
    private vanityUrlService:VanityURLService,private router: Router
    ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.isLoggedInThroughVanityUrl =  this.vanityUrlService.isVanityURLEnabled();
  }


  ngOnInit() {
   this.isPartnersRouter =  this.router.url.includes("/partners/");
  }


  openPopUp(partnerListId: number, contact:any,type:string) {
    
    if(type=="Contact" &&this.isLoggedInThroughVanityUrl){
      this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.pagination.vanityUrlFilter = true;
    }
      $('#sendCampaignsPopup').modal('show');
      this.pagination.partnerOrContactEmailId = contact.emailId;
      this.pagination.partnerId = contact.id;
      this.firstName = contact.firstName;
      this.lastName = contact.lastName;
      this.companyName = contact.contactCompany;
      this.pagination.userListId = partnerListId;
      this.type = type;
      this.newEmailIdsAreAdded = false;
      this.listCampaigns(this.pagination);
  }

  openPopUpForNewlyAddedPartnersOrContacts(partnerOrContactListId:number, type:string){
    let notPrmCompany = !this.authenticationService.module.isPrm && !this.authenticationService.module.isPrmTeamMember
                        && !this.authenticationService.module.isPrmAndPartner && !this.authenticationService.module.isPrmAndPartnerTeamMember;
    if(notPrmCompany){
      if(type=="Contact" && this.isLoggedInThroughVanityUrl){
        this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.pagination.vanityUrlFilter = true;
      }
      $('#sendCampaignsPopup').modal('show');
        this.pagination.partnerId = 0;
        this.pagination.userListId = partnerOrContactListId;
        this.type = type;
        this.newEmailIdsAreAdded = true;
        this.listCampaigns(this.pagination);
    }
    
    
  }

  listCampaigns(pagination: Pagination) {
      this.customResponse = new CustomResponse();
      this.referenceService.startLoader(this.httpRequestLoader);
      pagination.userId = this.loggedInUserId;
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
    this.firstName = "";
    this.lastName = "";
    this.companyName = "";
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
  checkAll(ev:any) {
    if (ev.target.checked) {
      $('[name="campaignCheckBoxName[]"]').prop('checked', true);
      this.isCampaignSelected = true;
      let self = this;
      $('[name="campaignCheckBoxName[]"]:checked').each(function (_index: number) {
        var id = $(this).val();
        self.selectedCampaignIds.push(parseInt(id));
        $('#campaignTr_' + id).addClass('row-selected');
      });
      this.selectedCampaignIds = this.referenceService.removeDuplicates(this.selectedCampaignIds);
      if (this.selectedCampaignIds.length == 0) { this.isCampaignSelected = false; }
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
        if (this.selectedCampaignIds.length == 0) {
          this.isCampaignSelected = false;
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
    } else {
      $('#campaignTr_' + campaignId).removeClass('row-selected');
      this.selectedCampaignIds.splice($.inArray(campaignId, this.selectedCampaignIds), 1);
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
    } else {
      //Highlighting Row
      $('#' + campaignId).prop("checked", true);
      $('#campaignTr_' + campaignId).addClass('row-selected');
      this.selectedCampaignIds.push(campaignId);
    }
    this.utility();
    event.stopPropagation();
  }

  /***********Send Campaigns************ */
  sendCampaigns() {
    this.customResponse = new CustomResponse();
    if(this.selectedCampaignIds.length>0){
    this.ngxLoading = true;
     let users = [];
    if(this.pagination.partnerId>0){
      let user = { 
        'emailId': this.pagination.partnerOrContactEmailId,
        'firstName':this.firstName,
        'lastName':this.lastName,
        'companyName':this.companyName 
      };
      users.push(user);
    }
    let campaignDetails = {
      "campaignIds": this.selectedCampaignIds,
      "partnersOrContactDtos": users,
      "userListId": this.pagination.userListId,
      "loggedInUserId":this.loggedInUserId,
      "type":this.type
    }
    this.campaignService.shareOrSendCampaigns(campaignDetails)
      .subscribe(
        data => {
          this.ngxLoading = false;
            if (data.access) {
                this.sendSuccess = true;
                this.statusCode = data.statusCode;
                if (data.statusCode == 200) {
                  this.responseMessage = data.message;
                } else {
                    this.responseMessage = data.message;
                }
                this.resetFields();
            } else {
                this.authenticationService.forceToLogout();
            }
        },
        _error => {
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

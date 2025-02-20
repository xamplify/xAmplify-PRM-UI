import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pagination } from 'app/core/models/pagination';
import { CampaignService } from '../services/campaign.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

declare var $: any;

@Component({
  selector: 'app-company-campaigns-list',
  templateUrl: './company-campaigns-list.component.html',
  styleUrls: ['./company-campaigns-list.component.css'],
  providers: [SortOption]
})
export class CompanyCampaignsListComponent implements OnInit {

  @Input() companyListId: any;
  @Input() selectedCompany: any;
  @Output() notifyClose = new EventEmitter();

  pagination: Pagination = new Pagination();
  ngxLoading: boolean = false;
  campaignAnalytics: Array<any> = new Array<any>();
  showFilterOption: boolean = false;
  selectedFilterIndex: number = 1;
  selectedCampaignTypeIndex = 0;
  companyRouter = RouterUrlConstants.home + RouterUrlConstants.company + RouterUrlConstants.manage;
  countsLoader:boolean = false;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  totalCampaignsCount: any = 0;
  activeCampaignsCount: any = 0;

  constructor(public campaignService: CampaignService, public referenceService: ReferenceService, private pagerService: PagerService, public authenticationService: AuthenticationService,
    public sortOption: SortOption, public utilService: UtilService) { 
      if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
        this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.vanityLoginDto.vanityUrlFilter = true;
      } else {
        this.vanityLoginDto.vanityUrlFilter = false;
      }
    }

  ngOnInit() {
    this.showAllCampaignAnalytics();
    this.fetchTotalAndActiveCampaignsCount();
  }

  resetTaskActivityPagination() {
    this.pagination.maxResults = 12;
    this.pagination = new Pagination;
    this.pagination.partnerTeamMemberGroupFilter = this.selectedFilterIndex == 1;
    this.showFilterOption = false;
  }

  listCampaignAnalytics(pagination: Pagination) {
    this.referenceService.goToTop();
    this.ngxLoading = true;
    if (this.vanityLoginDto.vanityUrlFilter) {
      this.pagination.vanityUrlFilter = this.vanityLoginDto.vanityUrlFilter;
      this.pagination.vendorCompanyProfileName = this.vanityLoginDto.vendorCompanyProfileName;
    }
    this.campaignService.fetchCampaignAnalyticsOfCompanyContacts(this.selectedCompany.id, pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let data = result.data;
        pagination.totalRecords = data.totalRecords;
        this.campaignAnalytics = data.list;
        $.each(data.list, function (index: number, campaign: any) {
          campaign.launchedDisplayTime = new Date(campaign.launchTimeInUTCString);
          if (campaign.latestViewInUTCString != "") {
            campaign.latestViewDisplayTime = new Date(campaign.latestViewInUTCString);
          } else {
            campaign.latestViewDisplayTime = "-";
          }
        });
        pagination = this.pagerService.getPagedItems(pagination, data.list);
      }
      this.ngxLoading = false;
    }, error => {
      this.ngxLoading = false;
    });
  }

  showAllCampaignAnalytics() {
    this.resetTaskActivityPagination();
    this.getAllFilteredResults();
  }

  closeCampaignsList() {
    this.notifyClose.emit();
  }

  filterCampaigns(type: string, index: number) {
    this.selectedCampaignTypeIndex = index;
    this.pagination.pageIndex = 1;
    this.pagination.campaignType = type;
    this.listCampaignAnalytics(this.pagination);
  }

  searchCampaigns() {
    this.getAllFilteredResults();
  }

  getAllFilteredResults() {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.userLevelCampaignAnalyticsSortOption, this.pagination);
    this.listCampaignAnalytics(this.pagination);
  }

  eventHandler(keyCode: any) {
    if (keyCode === 13) {
      this.searchCampaigns();
    }
  }

  sortBy(text: any) {
    this.sortOption.userLevelCampaignAnalyticsSortOption = text;
    this.getAllFilteredResults();
  }

  goToCampaignAnalytics(campaignId: any, campaignTitle: any) {
    let encodedCampaignId = this.referenceService.encodePathVariableInNewTab(campaignId);
    let encodedTitle = this.referenceService.getEncodedUri(campaignTitle);
    this.referenceService.openWindowInNewTab("/home/campaigns/" + encodedCampaignId + "/" + encodedTitle + "/details");
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listCampaignAnalytics(this.pagination);
  }

  fetchTotalAndActiveCampaignsCount() {
    this.countsLoader = true;
    this.campaignService.fetchTotalAndActiveCampaignsCountForCompanyJourney(this.companyListId, this.vanityLoginDto.vanityUrlFilter, this.vanityLoginDto.vendorCompanyProfileName).subscribe(
      response => {
        if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
          this.totalCampaignsCount = response.data.totalCampaignsCount;
          this.activeCampaignsCount = response.data.activeCampaignsCount;
        }
        this.countsLoader = false;
      }, error => {
        this.countsLoader = false;
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { DashboardService } from '../dashboard.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

@Component({
  selector: 'app-universal-search',
  templateUrl: './universal-search.component.html',
  styleUrls: ['./universal-search.component.css'],
  providers: [Properties]
})
export class UniversalSearchComponent implements OnInit {
  selectedFilterIndex = 0;
  universalSearch: Array<any> = new Array<any>();
  isPartnerLoggedInThroughVanityUrl = false;
  universalSearchApiLoading = true;
  universalSearchPagination: Pagination = new Pagination();
  companyId = 0;
  customResponse: CustomResponse = new CustomResponse();
  searchKey: string;
  applyFilter = true;
  constructor(public referenceService: ReferenceService, public properties: Properties, public authenticationService: AuthenticationService, public pagerService: PagerService,
    public dashboardService: DashboardService) {
    if (!this.authenticationService.isTeamMember()) {
      this.applyFilter = false;
    }
  }

  ngOnInit() {
    this.universalSearchPagination.filterBy = "All";
    this.universalSearchPagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.universalSearchPagination.maxResults = 12;
    if (this.referenceService.universalSearchKey != "" && this.referenceService.universalSearchKey != null) {
      this.searchUniversally();
    } else {
      this.findUniversalSearch(this.universalSearchPagination);
    }
  }
  findUniversalSearch(universalSearchPagination: Pagination) {
    this.customResponse = new CustomResponse();
    this.referenceService.scrollSmoothToTop();
    this.universalSearchApiLoading = true;
    this.dashboardService.findUniversalSearch(universalSearchPagination).subscribe(
      response => {
        let data = response.data;
        this.universalSearch = data.list;
        let map = response.map;
        this.companyId = map['companyId'];
        this.isPartnerLoggedInThroughVanityUrl = map['isPartnerLoggedInThroughVanityUrl'];
        universalSearchPagination.totalRecords = data.totalRecords;
        universalSearchPagination = this.pagerService.getPagedItems(universalSearchPagination, this.universalSearch);
        this.universalSearchApiLoading = false;
      }, error => {
        this.universalSearchApiLoading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      });
  }
  navigateBetweenPageNumbers(event: any) {
    this.universalSearchPagination.pageIndex = event.page;
    this.findUniversalSearch(this.universalSearchPagination);
  }
  searchUniversally() {
    this.universalSearchPagination.pageIndex = 1;
    this.universalSearchPagination.maxResults = 12;
    this.universalSearchPagination.searchKey = this.referenceService.universalSearchKey;
    this.findUniversalSearch(this.universalSearchPagination);
  }
  filterUniversalSearch(type: string, index: number) {
    this.selectedFilterIndex = index;
    this.universalSearchPagination = new Pagination();
    if(type === 'Lead' || type === 'Deal') {
    this.universalSearchPagination.partnerTeamMemberGroupFilter = this.applyFilter;
    }
    this.universalSearchPagination.searchKey = this.referenceService.universalSearchKey;
    this.universalSearchPagination.filterBy = type;
    this.findUniversalSearch(this.universalSearchPagination);
  }
  preview(quickLink: any) {
    if (quickLink.type === 'Lead') {
      this.referenceService.universalId = quickLink.id;
      this.referenceService.goToRouter("/home/leads/manage");
    } else if (quickLink.type === 'Deal') {
      this.referenceService.universalId = quickLink.id
      this.referenceService.goToRouter('/home/deal/manage');
    } else if (quickLink.type === 'Asset') {
      if (this.isPartnerLoggedInThroughVanityUrl) {
        this.navigateToDamPartnerView(quickLink);
      } else {
        this.handleAssetPreview(quickLink);
      }
    } else {
      this.referenceService.handleQuickLinkPreview(quickLink, this.isPartnerLoggedInThroughVanityUrl, this.companyId);
    }
  }
  handleAssetPreview(quickLink: any) {
    if (this.referenceService.isVideo(quickLink.slug)) {
      const videoUrl = `/home/dam/previewVideo/${quickLink.videoId}/${quickLink.id}`;
      this.referenceService.navigateToRouterByViewTypes(videoUrl, 0, undefined, undefined, undefined);
    } else if (quickLink.beeTemplate) {
      this.referenceService.previewAssetPdfInNewTab(quickLink.id);
    } else {
      this.referenceService.preivewAssetOnNewHost(quickLink.id);
    }
  }
  navigateToDamPartnerView(quickLink: any) {
    const viewType = this.referenceService.getListOrGridViewType();
    let router = '';
    let id = quickLink.id;
    if (this.isPartnerLoggedInThroughVanityUrl) {
      id = quickLink.damPartnerId;
    }
    router = `${RouterUrlConstants.home}${RouterUrlConstants.dam}${RouterUrlConstants.damPartnerView}${RouterUrlConstants.view}${id}${viewType}`;
    if (router) {
      this.referenceService.goToRouter(router);
    }
  }
  navigateToManage(quickLink: any) {
    if (quickLink.type === 'Asset') {
      let router = this.isPartnerLoggedInThroughVanityUrl ? '/home/dam/shared' : '/home/dam/manage';
      this.referenceService.goToRouter(router);
    } else if (quickLink.type === 'Track') {
      let router = this.isPartnerLoggedInThroughVanityUrl ? 'home/tracks/shared' : '/home/tracks/manage';
      this.referenceService.goToRouter(router);
    } else if (quickLink.type === 'Play Book') {
      let router = this.isPartnerLoggedInThroughVanityUrl ? '/homeplaybook/shared' : '/home/playbook/manage';
      this.referenceService.goToRouter(router);
    } else if (quickLink.type === 'Lead') {
      this.referenceService.goToRouter("/home/leads/manage");
    } else if (quickLink.type === 'Deal') {
      this.referenceService.goToRouter('/home/deal/manage');
    }
  }
}

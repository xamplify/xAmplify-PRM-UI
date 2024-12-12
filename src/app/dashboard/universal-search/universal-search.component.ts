import { Component, Input, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { DashboardService } from '../dashboard.service';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { Router } from '@angular/router';
import { UtilService } from 'app/core/services/util.service';

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
  companyId: number = 0;
  customResponse: CustomResponse = new CustomResponse();
  searchKey: string;
  applyFilter = true;
  defaultDisplayType: string = 'l';
  isWelcomePageEnabled: boolean;
  isTeamMember: boolean;
  constructor(public referenceService: ReferenceService, public properties: Properties, public authenticationService: AuthenticationService, public pagerService: PagerService,
    public dashboardService: DashboardService, public router: Router, public utilService: UtilService) {
    let currentUser = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.currentUser);
    this.isWelcomePageEnabled = currentUser[XAMPLIFY_CONSTANTS.welcomePageEnabledKey];
    if (this.isWelcomePageEnabled) {
      this.referenceService.universalSearchKey = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.universalSearchKey);
      this.referenceService.universalSearchFilterType = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.universalSearchFilterBy);
    }
  }

  ngOnInit() {
    this.searchUniversally();
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
    if (!this.utilService.isLoggedAsTeamMember()) {
      this.applyFilter = false;
    }
    console.log(this.utilService.isLoggedAsTeamMember() + "  loginAsTeammember")
    this.universalSearchPagination.pageIndex = 1;
    this.universalSearchPagination.maxResults = 12;
    this.universalSearchPagination.searchKey = this.referenceService.universalSearchKey;
    this.universalSearchPagination.filterBy = this.referenceService.universalSearchFilterType;
    this.universalSearchPagination.partnerTeamMemberGroupFilter = this.applyFilter;
    this.findUniversalSearch(this.universalSearchPagination);
  }
  preview(quickLink: any) {
    this.referenceService.universalModuleType = "";
    if (quickLink.type === 'Lead') {
      this.referenceService.universalId = quickLink.id;
      this.referenceService.goToRouter("/home/leads/manage");
    } else if (quickLink.type === 'Deal') {
      this.referenceService.universalId = quickLink.id
      this.referenceService.goToRouter('/home/deal/manage');
    } else if (quickLink.type === 'Asset') {
      if (quickLink.navigate === 'Shared') {
        this.navigateToDamPartnerView(quickLink);
      } else {
        this.handleAssetPreview(quickLink);
      }
    } else {
      this.handleTrackOrPlaybookePreviwe(quickLink);
    }

  }
  handleTrackOrPlaybookePreviwe(quickLink: any) {
    const viewType = `/${this.defaultDisplayType}`;
    let router = '';
    let companyId = quickLink.createdByCompanyId
    if (this.authenticationService.vanityURLEnabled || quickLink.createdByCompanyId == null) {
      companyId = this.companyId;
    }
    switch (quickLink.type) {
      case 'Track':
        router = `home/tracks/tb/${companyId}/${quickLink.slug}${viewType}`;
        break;
      case 'Play Book':
        router = `home/playbook/pb/${companyId}/${quickLink.slug}${viewType}`;
        break;
    }
    if (router) {
      this.referenceService.goToRouter(router);
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
    const viewType = `/${this.defaultDisplayType}`;
    let router = '';
    let id = quickLink.id;
    if (quickLink.navigate === 'Shared') {
      id = quickLink.damPartnerId;
    }
    router = `${RouterUrlConstants.home}${RouterUrlConstants.dam}${RouterUrlConstants.damPartnerView}${RouterUrlConstants.view}${id}${viewType}`;
    if (router) {
      this.referenceService.goToRouter(router);
    }
  }

  navigateToManage(quickLink: any) {
    this.referenceService.universalModuleType = quickLink.type;
    this.defaultDisplayType = this.referenceService.getDefaultViewType();
    if (this.defaultDisplayType === "fl" || this.defaultDisplayType === "fg") {
      this.defaultDisplayType = "l";
    }
    if (quickLink.type === 'Asset') {
      let router = quickLink.navigate === 'Shared' ? '/home/dam/shared' : '/home/dam/manage';
      this.referenceService.goToRouter(router + `/${this.defaultDisplayType}`);
    } else if (quickLink.type === 'Track') {
      let router = quickLink.navigate === 'Shared' ? 'home/tracks/shared' : '/home/tracks/manage';
      this.referenceService.goToRouter(router + `/${this.defaultDisplayType}`);
    } else if (quickLink.type === 'Play Book') {
      let router = quickLink.navigate === 'Shared' ? '/home/playbook/shared' : '/home/playbook/manage';
      this.referenceService.goToRouter(router + `/${this.defaultDisplayType}`);
    } else if (quickLink.type === 'Lead') {
      this.referenceService.universalSearchVendorOrPartnerView = quickLink.navigate;
      this.referenceService.goToRouter("/home/leads/manage");
    } else if (quickLink.type === 'Deal') {
      this.referenceService.universalSearchVendorOrPartnerView = quickLink.navigate;
      this.referenceService.goToRouter('/home/deal/manage');
    }
  }

  getTooltipTitle(field: string): string {
    return field || '';
  }

  /**
   * Determines the image source based on quickLink type.
   */
  getImageSrc(quickLink): string {
    switch (quickLink.type) {
      case 'Track':
        return 'assets/images/universal-search-images/universal-track.webp';
      case 'Play Book':
        return 'assets/images/universal-search-images/universal-playbook.webp';
      case 'Asset':
        return 'assets/images/universal-search-images/universal-asset.webp';
      default:
        return 'assets/admin/pages/media/works/contacts2.png';
    }
  }

  /**
   * Determines the label class based on quickLink type.
   */
  getLabelClass(quickLink): string {
    switch (quickLink.type) {
      case 'Track':
        return 'view-banner orange-lable-cu1 mr5';
      case 'Play Book':
        return 'view-banner published mr5';
      case 'Lead':
      case 'Deal':
        return 'view-banner orange-lable-cu1 mr5';
      case 'Asset':
        return 'view-banner banner-top mr5';
      default:
        return '';
    }
  }
  homeButton() {
    if (this.isWelcomePageEnabled) {
      this.referenceService.universalSearchKey = "";
      this.referenceService.universalSearchFilterType = 'All';
      this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.universalSearchKey, this.referenceService.universalSearchKey);
      this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.universalSearchFilterBy, this.referenceService.universalSearchFilterType);
    }
  }
  // filterUniversalSearch(type: string, index: number) {
  //   if (!this.isTeamMember) {
  //     this.applyFilter = false;
  //   }
  //   this.selectedFilterIndex = index;
  //   this.universalSearchPagination = new Pagination();
  //   this.universalSearchPagination.partnerTeamMemberGroupFilter = this.applyFilter;
  //   this.universalSearchPagination.searchKey = this.referenceService.universalSearchKey;
  //   this.universalSearchPagination.filterBy = type;
  //   this.findUniversalSearch(this.universalSearchPagination);
  // }
}

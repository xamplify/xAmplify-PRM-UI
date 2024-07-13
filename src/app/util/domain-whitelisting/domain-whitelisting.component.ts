import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { RegularExpressions } from 'app/common/models/regular-expressions';
import { FileUtil } from 'app/core/models/file-util';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';
import { DomainRequestDto } from 'app/dashboard/models/domain-request-dto';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

declare var $: any, Papa: any, swal: any;
@Component({
  selector: 'app-domain-whitelisting',
  templateUrl: './domain-whitelisting.component.html',
  styleUrls: ['./domain-whitelisting.component.css'],
  providers: [HttpRequestLoader, Properties, SortOption]
})
export class DomainWhitelistingComponent implements OnInit, OnDestroy {
  @Input() isPartnerDomains: boolean;
  @Input() isTeamMemberDomains: boolean;
  @Input() isMyProfileAndDomainWhitelisting: boolean;
  customResponse: CustomResponse = new CustomResponse();
  headerText = "";
  domain = "";
  descriptionText = "";
  isDomainExist: boolean = false;
  validDomainFormat: boolean = true;
  validDomainPattern: boolean = false;
  pagination: Pagination = new Pagination();
  addedDomains: string[] = [];
  domainRequestDto: DomainRequestDto = new DomainRequestDto();
  ngxloading = false;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  isDeleteOptionClicked: boolean;
  selectedDomainId = 0;
  signUpUrl = "";
  isTeamMemberDomainsTabSelected = false;
  isPartnerDomainsTabSelected = false;
  domainWhitelistingDescription = "";
  domainWhitelistingUrlDescription = "";
  selectedTab = 1;
  isTabDisplayed = false;
  isCollapsed: boolean = false;
  moduleName = "";
  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService,
    public properties: Properties, public fileUtil: FileUtil, public sortOption: SortOption,
    public utilService: UtilService, public regularExpressions: RegularExpressions, public dashboardService: DashboardService,
    public xtremandLogger: XtremandLogger) { }

  ngOnInit() {
    this.referenceService.loading(this.httpRequestLoader, true);
    let isPartnerLoggedInThroughVendorVanityUrl = this.authenticationService.module.loggedInThroughVendorVanityUrl;
    let isMarketingCompany = this.authenticationService.module.isMarketingCompany;
    let isPartnerCompany = this.authenticationService.module.isOnlyPartnerCompany;
    this.isTabDisplayed = !isPartnerLoggedInThroughVendorVanityUrl && !isMarketingCompany && !isPartnerCompany;
    if (this.isPartnerDomains) {
      this.moduleName = "Partner";
      this.activatePartnersDomainsTab();
    } else if (this.isTeamMemberDomains) {
      this.moduleName = "Team Member";
      this.activateTeamMemberDomainsTab();
    } else if (this.isMyProfileAndDomainWhitelisting) {
      this.activateTeamMemberDomainsTab();
    }
  }

  resetValues() {
    this.customResponse = new CustomResponse();
    this.headerText = "";
    this.domain = "";
    this.descriptionText = "";
    this.isDomainExist = false;
    this.validDomainFormat = true;
    this.validDomainPattern = false;
    this.pagination = new Pagination();
    this.addedDomains = [];
    this.domainRequestDto = new DomainRequestDto();
    this.ngxloading = false;
    this.httpRequestLoader = new HttpRequestLoader();
    this.isDeleteOptionClicked = false;
    this.selectedDomainId = 0;
    this.signUpUrl = "";
    this.isTeamMemberDomainsTabSelected = false;
    this.isPartnerDomainsTabSelected = false;
    this.domainWhitelistingDescription = "";
    this.domainWhitelistingUrlDescription = "";
  }

  public activateTeamMemberDomainsTab() {
    this.resetValues();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.selectedTab = 1;
    $('#team-member-domains-li').addClass('active');
    $('#partner-domains-li').removeClass('active');
    $('#teamMemberDomains').addClass('tab-pane fade in active');
    this.isTeamMemberDomainsTabSelected = true;
    this.isPartnerDomainsTabSelected = false;
    this.pagination.filterKey = "teamMember";
    this.descriptionText = "Added domain users will be allowed to sign up as team members.";
    this.domainWhitelistingDescription = this.properties.domainWhitelistingDescription.replace("{{moduleName}}", "team members");
    this.domainWhitelistingUrlDescription = this.properties.domainWhitelistingUrlDescription.replace("{{moduleName}}", "team members");
    this.findTeamMemberOrPartnerSignUpUrl();
    this.findTeamMemberOrPartnerDomains(this.pagination);
  }

  public activatePartnersDomainsTab() {
    this.resetValues();
    this.selectedTab = 2;
    this.referenceService.loading(this.httpRequestLoader, true);
    $('#partner-domains-li').addClass('active');
    $('#team-member-domains-li').removeClass('active');
    $('#partnerDomains').addClass('tab-pane fade in active');
    this.isPartnerDomainsTabSelected = true;
    this.isTeamMemberDomainsTabSelected = false;
    let partnerModuleCustomName = this.authenticationService.getPartnerModuleCustomName();
    this.descriptionText = "Added domain users will be allowed to sign up as " + partnerModuleCustomName + ".";
    this.domainWhitelistingDescription = this.properties.domainWhitelistingDescription.replace("{{moduleName}}", partnerModuleCustomName);
    this.domainWhitelistingUrlDescription = this.properties.domainWhitelistingUrlDescription.replace("{{moduleName}}", partnerModuleCustomName);
    this.findTeamMemberOrPartnerSignUpUrl();
    this.findTeamMemberOrPartnerDomains(this.pagination);
  }

  findTeamMemberOrPartnerSignUpUrl() {
    this.dashboardService.findCompanySignUpUrl(this.selectedTab).subscribe(
      response => {
        this.signUpUrl = response.data;
      }, error => {
        this.xtremandLogger.error(error);
      });
  }

  ngOnDestroy(): void {
    this.referenceService.closeSweetAlert();
  }

  addDomainModalOpen() {
    this.domain = "";
    this.referenceService.openModalPopup("domainModal");
  }

  closeAddDomainModal() {
    this.referenceService.closeModalPopup("domainModal");
    this.domain = "";
    this.isDomainExist = false;
    this.validDomainFormat = true;
    this.validDomainPattern = false;
    this.domainRequestDto = new DomainRequestDto();
  }

  /********Pagination & Search Code***********/
  paginateDomains(event: any) {
    this.pagination.pageIndex = event.page;
    this.findTeamMemberOrPartnerDomains(this.pagination);
  }

  searchDomains() {
    this.getAllFilteredResults(this.pagination);
  }

  searchDomainsOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchDomains(); } }

  sortBy(text: any) {
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedDomainDropDownOption, pagination);
    this.findTeamMemberOrPartnerDomains(pagination);
  }

  findTeamMemberOrPartnerDomains(pagination: Pagination) {
    this.referenceService.scrollSmoothToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.dashboardService.findDomains(pagination, this.selectedTab).subscribe(
      response => {
        pagination = this.utilService.setPaginatedRows(response, pagination);
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.xtremandLogger.errorPage(error);
      });
  }

  validateDomain(domain: string) {
    this.isDomainExist = false;
    this.validDomainFormat = false;
    const lowerCaseDomain = this.referenceService.getTrimmedData(domain.toLowerCase());
    if (lowerCaseDomain.length > 0) {
      let isValidDomainName = this.validateDomainName(lowerCaseDomain);
      this.validDomainFormat = isValidDomainName;
      this.validDomainPattern = isValidDomainName;
    } else {
      this.validDomainFormat = true;
    }

  }

  validateDomainName(domain: string) {
    var DOMAIN_NAME_PATTERN = new RegExp(this.regularExpressions.DOMAIN_PATTERN);
    var matchedPattrenString: string[] = domain.match(DOMAIN_NAME_PATTERN);
    if (matchedPattrenString == null || (matchedPattrenString != null && matchedPattrenString.length == 0))
      return false;
    else
      return matchedPattrenString[0] == domain;
  }

  confirmAndsaveExcludedDomain(domain: string) {
    this.saveDomains();
  }

  saveDomains() {
    this.ngxloading = true;
    this.isDomainExist = false;
    this.validDomainFormat = true;
    this.customResponse = new CustomResponse();
    this.domainRequestDto = new DomainRequestDto();
    this.domainRequestDto.domainNames.push(this.domain);
    this.dashboardService.saveDomains(this.domainRequestDto, this.selectedTab).subscribe(
      response => {
        this.customResponse = new CustomResponse('SUCCESS', response.message, true);
        this.closeAddDomainModal();
        this.pagination.pageIndex = 1;
        this.findTeamMemberOrPartnerDomains(this.pagination);
        this.ngxloading = false;
      }, (error: any) => {
        let errorMessage = this.referenceService.showHttpErrorMessage(error);
        if ("Already Exists" == this.referenceService.getTrimmedData(errorMessage)) {
          this.isDomainExist = true;
        } else {
          this.isDomainExist = false;
          this.referenceService.showSweetAlertErrorMessage(errorMessage);
        }
        this.ngxloading = false;
      }
    );
  }

  confirmDeleteDomain(id: number) {
    this.isDeleteOptionClicked = true;
    this.selectedDomainId = id;
  }

  deleteDomain(event: any) {
    this.customResponse = new CustomResponse();
    if (event) {
      this.referenceService.loading(this.httpRequestLoader, true);
      this.dashboardService.deleteDomain(this.selectedDomainId).subscribe(
        response => {
          this.resetDeleteOptions();
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.referenceService.loading(this.httpRequestLoader, false);
          this.refreshList();
        }, error => {
          this.referenceService.loading(this.httpRequestLoader, false);
          let message = this.referenceService.showHttpErrorMessage(error);
          this.customResponse = new CustomResponse('ERROR', message, true);
          this.resetDeleteOptions();
        }
      );
    } else {
      this.resetDeleteOptions();
    }

  }

  resetDeleteOptions() {
    this.isDeleteOptionClicked = false;
    this.selectedDomainId = 0;
  }

  refreshList() {
    this.referenceService.scrollSmoothToTop();
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.findTeamMemberOrPartnerDomains(this.pagination);
  }

  /*********Copy The Link/Iframe Link */
  copySignUpUrl(inputElement: any) {
    $(".success").hide();
    $('#copied-signup-url').hide();
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    $('#copied-signup-url').show(500);
    $('#tick-mark').css('display', 'inline-block');
  }

  toggleCollapse(event: Event) {
    event.preventDefault();
    this.isCollapsed = !this.isCollapsed;
  }

}

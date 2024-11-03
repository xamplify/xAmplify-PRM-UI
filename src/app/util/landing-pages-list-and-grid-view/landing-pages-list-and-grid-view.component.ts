import { Component, OnInit, OnDestroy, ViewChild,Renderer,Input,Output,EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { UtilService } from '../../core/services/util.service';
import { SortOption } from '../../core/models/sort-option';
import { Roles } from 'app/core/models/roles';
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { LandingPage } from 'app/landing-pages/models/landing-page';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { PreviewLandingPageComponent } from 'app/landing-pages/preview-landing-page/preview-landing-page.component';
import { CopyModalPopupComponent } from 'app/util/copy-modal-popup/copy-modal-popup.component';
import { CopyDto } from '../models/copy-dto';
import { Properties } from 'app/common/models/properties';
import { LandingPageShareDto } from 'app/dashboard/user-profile/models/LandingPageShareDto';
import { PartnerCompanyAndGroupsComponent } from '../partner-company-and-groups/partner-company-and-groups.component';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { Location } from '@angular/common';
declare var swal: any, $: any;
@Component({
  selector: 'app-landing-pages-list-and-grid-view',
  templateUrl: './landing-pages-list-and-grid-view.component.html',
  styleUrls: ['./landing-pages-list-and-grid-view.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription, SortOption,Properties],
})
export class LandingPagesListAndGridViewComponent implements OnInit,OnDestroy {

  landingPage: LandingPage = new LandingPage();
  ngxloading = false;
  pagination: Pagination = new Pagination();
  loggedInUserId = 0;
  customResponse: CustomResponse = new CustomResponse();
  copiedLinkCustomResponse: CustomResponse = new CustomResponse();
  isListView = false;
  private dom: Document;
  message = "";
  campaignId = 0;
  statusCode = 200;
  isPartnerLandingPage = false;
  landingPageAliasUrl: string = "";
  selectedLandingPageTypeIndex = 0;
  iframeEmbedUrl: string = "";
  deleteAndEditAccess = false;
  categoryId: number = 0;
  isGridView = false;
  isFolderGridView = false;
  exportObject:any = {};
  mergeTagForGuide:any;
  @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
  dashboardAnalyticsDto: DashboardAnalyticsDto = new DashboardAnalyticsDto();
  modulesDisplayType = new ModulesDisplayType();
  @Input() folderListViewCategoryId:any;
  @Input() folderListViewExpanded = false;
  @Input() vendorJourney = false;
  folderListView = false;
  viewType: string;
  showUpArrowButton = false;
  folderViewType = "";
  roles:Roles = new Roles();
  /*  XNFR-432 */
  @ViewChild("copyModalPopupComponent") copyModalPopupComponent:CopyModalPopupComponent;
  @Output() updatedItemsCountEmitter = new EventEmitter();
  @Output() vendorLandingPage = new EventEmitter();
  showShareListPopup:boolean = false;
  @Input() loggedInUserCompanyId = 0;
  @Input() isLandingPages =  false;
  selectedLandingPageId:any;
  landingPageSharedDetails:LandingPageShareDto = new LandingPageShareDto();
  @Output() viewAnalytics = new EventEmitter();
  @Output() viewVendorPageAnalytics = new EventEmitter();
  @Input() isMasterLandingPages =  false;
  @Output() isFormAnalytics = new EventEmitter();
  @Input() welcomePages = false;
  @ViewChild("partnerCompanyAndGroupsComponent") partnerCompanyAndGroupsComponent:PartnerCompanyAndGroupsComponent;
  /*  XNFR-712 */
  @Input()isPartnerJourneyPages = false;
  showSharePartnerPagePopup= false;
  selectedVendorCompanyIds=[];
  selectedVendorCompanyIdAndStatuses=[];
  @Input() isVendorPartnerJourneyPages = false;
  @Input() isVendorMarketplacePages = false;
  constructor(public referenceService: ReferenceService,public httpRequestLoader: HttpRequestLoader, public pagerService:PagerService, public authenticationService: AuthenticationService,
      public router: Router, public landingPageService: LandingPageService, public logger: XtremandLogger,
      public actionsDescription: ActionsDescription, public sortOption: SortOption,
      private utilService: UtilService, private route: ActivatedRoute,public renderer:Renderer,
      private vanityUrlService:VanityURLService,public properties:Properties, private changeDetectorRef: ChangeDetectorRef,public location: Location) {
        this.pagination.vanityUrlFilter =this.vanityUrlService.isVanityURLEnabled();
        this.loggedInUserId = this.authenticationService.getUserId();
        this.referenceService.renderer = this.renderer;
        this.pagination.userId = this.loggedInUserId;
        this.deleteAndEditAccess = this.referenceService.deleteAndEditAccess();
  }

  ngOnInit() {
    if (this.router.url.includes('home/pages/partner')) {
        this.isPartnerLandingPage = true;
    } else {
        this.selectedLandingPageTypeIndex = 0;
        this.pagination.filterKey = "All";
        this.isPartnerLandingPage = false;
    }
    /******** user guides ************/
    this.mergeTagForGuide = this.isPartnerLandingPage ? 'accessing_shared_pages':'manage_pages';
    this.sefDefaultViewType();
    if(this.isLandingPages){
        this.findPartnerVendorJourneyLandingPages(this.pagination);
    }else if(this.isVendorPartnerJourneyPages){
        this.findVendorPartnerJourneyLandingPages(this.pagination);
    }else{
        this.listLandingPages(this.pagination);
    }
    this.showMessageOnTop();
}

  private sefDefaultViewType() {
    if(this.vendorJourney || this.isLandingPages || this.isMasterLandingPages || this.welcomePages
        ||this.isPartnerJourneyPages || this.isVendorPartnerJourneyPages || this.isVendorMarketplacePages
    ){
        this.viewType = 'g';
    }else if (this.folderListViewCategoryId != undefined) {
        this.categoryId = this.folderListViewCategoryId;
        this.folderListView = true;
    } else {
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
        this.showUpArrowButton = this.categoryId != undefined && this.categoryId != 0;
    }
    if (this.viewType != undefined) {
        this.modulesDisplayType = this.referenceService.setDisplayType(this.modulesDisplayType, this.viewType);
    } else {
        if (this.categoryId == undefined || this.categoryId == 0) {
        this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
        this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ? 'g' : '';
        if (this.modulesDisplayType.isFolderListView) {
            this.viewType = "fl";
            this.referenceService.goToManageLandingPages(this.viewType);
        } else if (this.modulesDisplayType.isFolderGridView) {
            this.viewType = "fg";
            this.referenceService.goToManageLandingPages(this.viewType);
        }
        }
    }
    
  }


  

  showAllLandingPages(type: string, index: number) {
      this.selectedLandingPageTypeIndex = index;
      this.pagination.filterKey = type;
      this.pagination.pageIndex = 1;
      this.listLandingPages(this.pagination);
  }



  listLandingPages(pagination: Pagination) {
      this.referenceService.loading(this.httpRequestLoader, true);
      if(!this.folderListView){
        this.referenceService.goToTop();
      }
      if(this.categoryId!=undefined && this.categoryId>0){
        pagination.categoryId = this.categoryId;
        this.pagination.categoryType = this.referenceService.getCategoryType(this.roles.landingPageId);
      }
      /**********Vanity Url Filter**************** */
      if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
          this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
          this.pagination.vanityUrlFilter = true;
      }
      if(this.vendorJourney){
        this.pagination.source = "VENDOR_JOURNEY";
        this.pagination.defaultLandingPage = false;
        this.pagination.loginAsUserId = this.loggedInUserId;
        this.pagination.companyId = this.loggedInUserCompanyId;
      }else if(this.isMasterLandingPages){
        this.pagination.source = "MASTER_PARTNER_PAGE";
        this.pagination.defaultLandingPage = false;
        this.pagination.loginAsUserId = this.loggedInUserId;
        this.pagination.companyId = this.loggedInUserCompanyId;
        this.pagination.masterLandingPage = true;
      }else if(this.welcomePages){
        this.pagination.source = "WELCOME_PAGE";
        this.pagination.defaultLandingPage = false;
        this.pagination.loginAsUserId = this.loggedInUserId;
        this.pagination.companyId = this.loggedInUserCompanyId;
        this.pagination.welcomePages = true;

      }else if(this.isPartnerJourneyPages){
        this.pagination.source = "PARTNER_JOURNEY_PAGE";
        this.pagination.defaultLandingPage = false;
        this.pagination.loginAsUserId = this.loggedInUserId;
        this.pagination.companyId = this.loggedInUserCompanyId;
        this.pagination.partnerJourneyPage = true;
      }else if(this.isVendorMarketplacePages){
        this.pagination.source = "VENDOR_MARKETPLACE_PAGE";
        this.pagination.defaultLandingPage = false;
        this.pagination.loginAsUserId = this.loggedInUserId;
        this.pagination.companyId = this.loggedInUserCompanyId;
        this.pagination.vendorMarketplacePage = true;
      }else{
        this.pagination.source = "MANUAL";
      }
      if((this.vendorJourney || this.isPartnerJourneyPages) && !this.isLandingPages){
        this.pagination.vendorJourneyOnly = true;
      }
      this.landingPageService.list(pagination, this.isPartnerLandingPage).subscribe(
          (response: any) => {
              if(response.access){
                  const data = response.data;
                  this.statusCode = response.statusCode;
                  if (this.statusCode == 200) {
                      pagination.totalRecords = data.totalRecords;
                      this.sortOption.totalRecords = data.totalRecords;
                      $.each(data.landingPages, function (index, landingPage) {
                          landingPage.displayTime = new Date(landingPage.createdDateInString);
                      });
                      $.each(data.landingPages, function (index, landingPage) {
                          landingPage.updatedTime = new Date(landingPage.updatedDateInString);
                      });
                      pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
                  }
                  this.referenceService.loading(this.httpRequestLoader, false);
              }else{
                  this.authenticationService.forceToLogout();
              }
              this.referenceService.loading(this.httpRequestLoader, false);
          },
          (error: any) => { 
            this.logger.errorPage(error); 
        },()=>{
            this.callFolderListViewEmitter();
        });
  }


  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
    sortBy(text: any) {
        const sortedValue = text.value;
        if (sortedValue !== '') {
            const options: string[] = sortedValue.split('-');
            this.pagination.sortcolumn = options[0];
            this.pagination.sortingOrder = options[1];
        } else {
            this.pagination.sortcolumn = null;
            this.pagination.sortingOrder = null;
        }
        if (this.isLandingPages) {
            this.findPartnerVendorJourneyLandingPages(this.pagination)
        } else if(this.isVendorPartnerJourneyPages){
            this.findVendorPartnerJourneyLandingPages(this.pagination);
        }else {
            this.getAllFilteredResults(this.pagination);
        }
    }


  /*************************Search********************** */
  searchLandingPages() {
    if(this.isLandingPages){
        this.findPartnerVendorJourneyLandingPages(this.pagination);
    }else if(this.isVendorPartnerJourneyPages){
        this.findVendorPartnerJourneyLandingPages(this.pagination);
    }else{
        this.getAllFilteredResults(this.pagination);
    }
  }

  paginationDropdown(items: any) {
      this.sortOption.itemsSize = items;
      this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage(event: any) {
      this.pagination.pageIndex = event.page;
      this.listLandingPages(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
     this.customResponse = new CustomResponse();
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.sortOption.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
      this.listLandingPages(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchLandingPages(); } }
  /********************Pagaination&Search Code*****************/
  showMessageOnTop() {
    let message = this.referenceService.createdOrUpdatedSuccessMessage;
    if (message.length > 0 && !this.folderListViewExpanded) {
      $(window).scrollTop(0);
      this.customResponse = new CustomResponse("SUCCESS", message, true);
    }
    
  }

  /***********Preview Page*********************/
  showPreview(landingPage: LandingPage) {
    if(this.isPartnerLandingPage){
        /**XBI-2420***/
        this.referenceService.openWindowInNewTab(landingPage.aliasUrl);
    }else if(this.isLandingPages){
        this.referenceService.previewVendorJourneyPartnerPageInNewTab(landingPage.vendorJourneyId);
    }else if(this.isMasterLandingPages){
        this.referenceService.previewMasterPartnerPageInNewTab(landingPage.id);
    }else if(this.isVendorPartnerJourneyPages){
        this.referenceService.previewPartnerJourneyVendorPageInNewTab(landingPage.vendorJourneyId)
    }else if(this.isVendorMarketplacePages){
        this.referenceService.previewVendorMarketplacePageInNewTab(landingPage.id);
    }
    else{
        this.referenceService.previewPageInNewTab(landingPage.id);
    }
  }


  /***********Delete**************/
  confirmDelete(landingPage: LandingPage) {
      try {
          let self = this;
          swal({
              title: 'Are you sure?',
              text: "You won't be able to undo this action!",
              type: 'warning',
              showCancelButton: true,
              swalConfirmButtonColor: '#54a7e9',
              swalCancelButtonColor: '#999',
              confirmButtonText: 'Yes, delete it!'

          }).then(function () {
            if(self.welcomePages){
                self.welcomePageDelete(landingPage);
            }else{
                self.deleteById(landingPage);
            }
          }, function (dismiss: any) {
              console.log('you clicked on option' + dismiss);
          });
      } catch (error) {
          this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
          this.referenceService.showServerError(this.httpRequestLoader);
      }
  }


  editLandingPage(id: number) {
    if(this.vendorJourney || this.isLandingPages || this.isMasterLandingPages || this.welcomePages
        || this.isPartnerJourneyPages || this.isVendorMarketplacePages
    ){
        this.landingPageService.getById(id).subscribe(
            (data: any) => {
                this.vendorLandingPage.emit(data.data);
            },
            error => {
              this.logger.errorPage(error);
            });
    }else{
        this.landingPageService.id = id;
        let viewType = this.route.snapshot.params['viewType'];
        let categoryId = this.route.snapshot.params['categoryId'];
        let folderViewType = this.route.snapshot.params['folderViewType'];
        this.referenceService.navigateToEditLandingPageByViewType(folderViewType,viewType,categoryId);
    }
  }


  deleteById(landingPage: LandingPage) {
      this.customResponse = new CustomResponse();
      this.referenceService.loading(this.httpRequestLoader, true);
      this.referenceService.goToTop();
      this.landingPageService.deletebById(landingPage.id,(this.vendorJourney || this.isMasterLandingPages ||this.isPartnerJourneyPages
        || this.isVendorMarketplacePages
      ))
          .subscribe(
              (response: any) => {
                  if(response.access){
                      if (response.statusCode == 200) {
                          let message = landingPage.name + " deleted successfully";
                          this.customResponse = new CustomResponse('SUCCESS', message, true);
                          this.findLandingPagesWithPageIndexOne();
                      } else {
                          let pageNames = "";
                          $.each(response.data, function (index:number, value:any) {
                              pageNames += (index + 1) + ". " + value + "\n\n";
                          });
                          let message = response.message + "\n\n" + pageNames;
                          this.customResponse = new CustomResponse('ERROR', message, true);
                          this.referenceService.loading(this.httpRequestLoader, false);
                      }
                  }else{
                      this.authenticationService.forceToLogout();
                  }
                 

              },
              (error: string) => {
                  this.referenceService.showServerErrorMessage(this.httpRequestLoader);
                  this.customResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
              }
          );
  }

    private findLandingPagesWithPageIndexOne() {
        this.pagination.pageIndex = 1;
        this.listLandingPages(this.pagination);
    }

  /*****Show Landing Page Embed Link/Preview Page */
  showPageLinkPopup(landingPage: LandingPage) {
      this.landingPage = landingPage;
      this.copiedLinkCustomResponse = new CustomResponse();
      this.landingPageAliasUrl = landingPage.aliasUrl;
      this.iframeEmbedUrl = '<iframe width="1000" height="720" src="' + this.landingPageAliasUrl + '"  frameborder="0" allowfullscreen ></iframe>';
      $('#landing-page-url-modal').modal('show');
  }

  /*********Copy The Link/Iframe Link */
  copyInputMessage(inputElement: any, type: string) {
      this.referenceService.goToTop();
      this.copiedLinkCustomResponse = new CustomResponse();
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
      let message = type + ' copied to clipboard successfully.';
      if (type === "Page link") {
          $("#copy-link").select();
      } else {
          $("#text-area").select();
      }
      this.copiedLinkCustomResponse = new CustomResponse('SUCCESS', message, true);
  }

  goToFormAnalytics(id: number) {
    if(this.isMasterLandingPages || this.vendorJourney || this.welcomePages || this.isPartnerJourneyPages
        || this.isVendorMarketplacePages
    ){
        this.isFormAnalytics.emit(id);
    }else{
      if(this.categoryId>0){
          this.router.navigate(['/home/forms/category/'+this.categoryId+'/lf/' + id]);
      }else{
      this.router.navigate(['/home/forms/lf/' + id]);

      }
    }
  }
  goToPartnerLandingPageFormAnalytics(alias: string) {
      this.router.navigate(['/home/forms/partner/lf/' + alias]);
  }
  goToLandingPageAnalytics(id: number) {
    if(this.vendorJourney || this.isMasterLandingPages || this.welcomePages || this.isPartnerJourneyPages
        ||this.isVendorMarketplacePages
    ){
        this.viewAnalytics.emit(id);
    }else{
      if(this.categoryId>0){
          this.router.navigate(['/home/pages/' + id + '/category/'+this.categoryId+'/analytics']);
      }else{
      this.router.navigate(['/home/pages/' + id + '/analytics']);
      }
  }
     
  }
  goToPartnerLandingPageAnalytics(alias: string) {
    if(this.isLandingPages){
        this.viewVendorPageAnalytics.emit(alias);
    }else{
        this.router.navigate(['/home/pages/partner/' + alias + '/analytics']);
    }
  }


  callFolderListViewEmitter(){
    if(this.folderListView){
        this.exportObject['categoryId'] = this.categoryId;
        this.exportObject['itemsCount'] = this.pagination.totalRecords;	
        this.updatedItemsCountEmitter.emit(this.exportObject);
    }
  }



  ngOnDestroy() {
      this.referenceService.createdOrUpdatedSuccessMessage = "";
      this.message = "";
      this.landingPage = new LandingPage();
      $('#landing-page-url-modal').modal('hide');
      swal.close();
  }


  setViewType(viewType: string) {
    if(this.viewType!=viewType){
        if (this.folderListView) {
            let gridView = "g" == viewType;
            this.modulesDisplayType.isGridView = gridView;
            this.modulesDisplayType.isListView = !gridView;
        } else {
            if (this.folderViewType != undefined && viewType != "fg") {
                this.referenceService.goToManageLandingPagesByCategoryId("fg", viewType, this.categoryId);
            } else {
                this.referenceService.goToManageLandingPages(viewType);
            }
        }
    }
}
/*  XNFR-432 */
copy(landingPage:any){
    this.findExistingPageNames(landingPage);
 }

  findExistingPageNames(landingPage:any){
    this.ngxloading = true;
    this.landingPageService.getAvailableNames(this.loggedInUserId, this.welcomePages).subscribe(
      (data: any) => {
          let pageNames = data;
          this.copyModalPopupComponent.openModalPopup(landingPage.id,landingPage.name,"Page",pageNames);
          this.ngxloading = false;
      },
      error => {
        this.ngxloading = false;
        this.logger.errorPage(error);
      });
  }
  
  /*  XNFR-432 */
  copyModalPopupOutputReceiver(copyDto:CopyDto){
    let landingPage = new LandingPage();
    landingPage.id = copyDto.id;
    landingPage.name = copyDto.copiedName;
    landingPage.copyPage = true;
    landingPage.vanityUrlFilter = this.vanityUrlService.isVanityURLEnabled();
    landingPage.companyProfileName = this.authenticationService.companyProfileName;
    this.landingPageService.copy(landingPage).subscribe(
      data=>{
        if (data.access) {
            this.copyModalPopupComponent.showSweetAlertSuccessMessage(data.message);
            this.findLandingPagesWithPageIndexOne();
        }else{
          this.referenceService.closeModalPopup("copy-modal-popup");
          this.authenticationService.forceToLogout();
        }
      },error=>{
        this.copyModalPopupComponent.showErrorMessage(this.properties.serverErrorMessage);
      }
    );
  }
    
    openShareListPopup(landingPageId:any) {
        this.customResponse = new CustomResponse();
        this.selectedLandingPageId = landingPageId;
            this.ngxloading = true;
            let self = this;
            if(this.isPartnerJourneyPages){
                this.openSharePartnerPagePopup(landingPageId);
            }else{
            this.landingPageService.getLandingPageSharedDetails(landingPageId).subscribe(
              (response) => {
                self.landingPageSharedDetails = response.data;
                    if (self.landingPageSharedDetails == null) {
                        self.landingPageSharedDetails = new LandingPageShareDto();
                    }
                  self.ngxloading = false;
                  self.showShareListPopup = true;
                  $("#shareVendorDetailsPopup").modal("show");
                  setTimeout(() => $('#partnerCompaniesPopup').modal('show'), 0);          
              },
              error => {
                this.ngxloading = false;
                this.logger.errorPage(error);
              });
            }
    }
    closeShareListPopup(event:any) {
        this.showShareListPopup = false;
        $("#shareVendorDetailsPopup").modal("hide");
        this.ngxloading = false;
        $('#partnerCompaniesPopup').modal('hide');
        this.partnerCompanyAndGroupsComponent.resetFields();
        this.listLandingPages(this.pagination);
        if(event != undefined && event != null && event != ""){
            this.customResponse = new CustomResponse('SUCCESS', event, true);
        }

    }

    findPartnerVendorJourneyLandingPages(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        if(!this.folderListView){
          this.referenceService.goToTop();
        }
        if(this.categoryId!=undefined && this.categoryId>0){
          pagination.categoryId = this.categoryId;
          this.pagination.categoryType = this.referenceService.getCategoryType(this.roles.landingPageId);
        }
        /**********Vanity Url Filter**************** */
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            this.pagination.vanityUrlFilter = true;
        }
          this.pagination.source = "VENDOR_JOURNEY";
          this.pagination.defaultLandingPage = false;
          this.pagination.companyId = this.loggedInUserCompanyId;
          this.pagination.searchKey = this.sortOption.searchKey;
          let self = this;

        this.landingPageService.findPartnerVendorJourneyLandingPages(pagination).subscribe(
            (response: any) => {
                if(response.access){
                    const data = response.data;
                    self.statusCode = response.statusCode;
                    if (self.statusCode == 200) {
                        pagination.totalRecords = data.totalRecords;
                        this.sortOption.totalRecords = data.totalRecords;
                        $.each(data.landingPages, function (index, landingPage) {
                            landingPage.displayTime = new Date(landingPage.createdDateInString);
                        });
                        pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                }else{
                    this.authenticationService.forceToLogout();
                }
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            (error: any) => { 
              this.logger.errorPage(error); 
          },()=>{
              this.callFolderListViewEmitter();
          });
    }

    publishVendorJourney(){
        this.partnerCompanyAndGroupsComponent.publish();
    }

    publishWelcomePage(landingPageId:number){
        this.customResponse = new CustomResponse();
        this.selectedLandingPageId = landingPageId;
        let landingPage = new LandingPage();
        landingPage.id = landingPageId;
            this.ngxloading = true;
            this.landingPageService.updateWelcomePage(landingPage).subscribe(
              (response) => {
                this.customResponse = new CustomResponse('SUCCESS', response.message, true);
                  this.ngxloading = false;
              },
              error => {
                this.ngxloading = false;
                this.logger.errorPage(error);
              }, ()=>{
                this.updateWelcomePageActiveKeyValueOrFinsLandingPages(true);
              });
    }



    unPublishWelcomePage(landingPageId:number){
        this.customResponse = new CustomResponse();
        this.selectedLandingPageId = landingPageId;
        let landingPage = new LandingPage();
        landingPage.id = landingPageId;
            this.ngxloading = true;
            let self = this;
            this.landingPageService.unPublishWelcomePage(landingPage).subscribe(
              (response) => {
                this.customResponse = new CustomResponse('SUCCESS', response.message, true);
                self.ngxloading = false;
              },
              error => {
                this.ngxloading = false;
                this.logger.errorPage(error);
              }, ()=>{
                this.updateWelcomePageActiveKeyValueOrFinsLandingPages(false);

              });
    }

    private updateWelcomePageActiveKeyValueOrFinsLandingPages(isWelcomePageActivated:boolean) {
        if (this.authenticationService.vanityURLEnabled) {
            this.updateWelcomePageActiveKeyAndReload(isWelcomePageActivated);
        } else {
            this.findLandingPagesWithPageIndexOne();
        }
    }
    updateWelcomePageActiveKeyAndReload(isWelcomePageActivated:boolean){
        let currentUser = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.currentUser);
        currentUser[XAMPLIFY_CONSTANTS.welcomePageEnabledKey] = isWelcomePageActivated;
        //try to set only the welcomePageEnabledKey value insted of the whole 'currentUser'
        localStorage.setItem('currentUser',JSON.stringify(currentUser)) ;

        this.ngxloading = true;
        if(currentUser[XAMPLIFY_CONSTANTS.welcomePageEnabledKey]){
            this.location.replaceState('/welcome-page');
        }else{
            this.location.replaceState('/home/dashboard');
        }  
        window.location.reload();       
        this.ngxloading = false;
    }

    welcomePageDelete(landingPage: LandingPage) {
        this.customResponse = new CustomResponse();
        this.referenceService.loading(this.httpRequestLoader, true);
        this.referenceService.goToTop();
        this.landingPageService.welcomePageDeletebById(landingPage.id)
            .subscribe(
                (response: any) => {
                    if(response.access){
                        if (response.statusCode == 200) {
                            let message = landingPage.name + " deleted successfully";
                            this.customResponse = new CustomResponse('SUCCESS', message, true);
                            this.findLandingPagesWithPageIndexOne();
                        } else {
                            let pageNames = "";
                            $.each(response.data, function (index:number, value:any) {
                                pageNames += (index + 1) + ". " + value + "\n\n";
                            });
                            let message = response.message + "\n\n" + pageNames;
                            this.customResponse = new CustomResponse('ERROR', message, true);
                            this.referenceService.loading(this.httpRequestLoader, false);
                        }
                    }else{
                        this.authenticationService.forceToLogout();
                    }
                   
  
                },
                (error: string) => {
                    this.referenceService.showServerErrorMessage(this.httpRequestLoader);
                    this.customResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
                }
            );
    }

    openSharePartnerPagePopup(landingPageId: any) {
        this.customResponse = new CustomResponse();
        this.selectedLandingPageId = landingPageId;
        let self = this;

        this.landingPageService.getPartnerJourneyPageSharedDetails(landingPageId).subscribe(
            (response) => {
                self.selectedVendorCompanyIdAndStatuses = response.data;
                self.selectedVendorCompanyIdAndStatuses = self.selectedVendorCompanyIdAndStatuses && self.selectedVendorCompanyIdAndStatuses.length > 0 
                ? self.selectedVendorCompanyIdAndStatuses:[];
                self.selectedVendorCompanyIds = self.selectedVendorCompanyIdAndStatuses && self.selectedVendorCompanyIdAndStatuses.length > 0 
                ? self.selectedVendorCompanyIdAndStatuses.map(id=>id.vendorCompanyId) 
                : [];
                this.ngxloading = false;
                this.showSharePartnerPagePopup = true;
                $("#sharePartnerPagePopup").modal("show");
            },
            error => {
                this.ngxloading = false;
                this.logger.errorPage(error);
            });

    }

    closeSharePartnerPagePopup(event:any) {
        this.showSharePartnerPagePopup = false;
        $("#sharePartnerPagePopup").modal("hide");
        this.ngxloading = false;
        this.listLandingPages(this.pagination);
        if(event != undefined && event != null && event != ""){
            this.customResponse = new CustomResponse('SUCCESS', event, true);
        }

    }

    findVendorPartnerJourneyLandingPages(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        if(!this.folderListView){
          this.referenceService.goToTop();
        }
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            this.pagination.vanityUrlFilter = true;
        }
          this.pagination.source = "PARTNER_JOURNEY_PAGE";
          this.pagination.defaultLandingPage = false;
          this.pagination.companyId = this.loggedInUserCompanyId;
          this.pagination.searchKey = this.sortOption.searchKey;
          let self = this;
          this.pagination.vendorPartnerJourneyPage = true;

        this.landingPageService.findVendorPartnerJourneyLandingPages(pagination).subscribe(
            (response: any) => {
                if(response.access){
                    const data = response.data;
                    self.statusCode = response.statusCode;
                    if (self.statusCode == 200) {
                        pagination.totalRecords = data.totalRecords;
                        this.sortOption.totalRecords = data.totalRecords;
                        $.each(data.landingPages, function (index, landingPage) {
                            landingPage.displayTime = new Date(landingPage.createdDateInString);
                        });
                        pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                }else{
                    this.authenticationService.forceToLogout();
                }
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            (error: any) => { 
              this.logger.errorPage(error); 
          },()=>{
              this.callFolderListViewEmitter();
          });
    }
    
}


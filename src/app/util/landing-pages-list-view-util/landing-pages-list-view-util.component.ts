import { Component, OnInit, OnDestroy, ViewChild, Renderer,Input,Output,EventEmitter } from '@angular/core';
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
import { LandingPage } from 'app/landing-pages/models/landing-page';
import { UtilService } from '../../core/services/util.service';
import { SortOption } from '../../core/models/sort-option';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
import { PreviewLandingPageComponent } from 'app/landing-pages/preview-landing-page/preview-landing-page.component';
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';

declare var swal: any, $: any;

@Component({
  selector: 'app-landing-pages-list-view-util',
  templateUrl: './landing-pages-list-view-util.component.html',
  styleUrls: ['./landing-pages-list-view-util.component.css','../../landing-pages/manage-landing-page/manage-landing-page.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription, SortOption],

})
export class LandingPagesListViewUtilComponent implements OnInit, OnDestroy {

 
  landingPage: LandingPage = new LandingPage();
  ngxloading = false;
  pagination: Pagination = new Pagination();
  loggedInUserId = 0;
  customResponse: CustomResponse = new CustomResponse();
  copiedLinkCustomResponse: CustomResponse = new CustomResponse();
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
  isListView = false;
  isGridView = false;
  isFolderGridView = false;
  exportObject:any = {};
  @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
  modulesDisplayType = new ModulesDisplayType();
  @Input() folderListViewInput:any;
  @Output() updatedItemsCount = new EventEmitter();
  constructor(public referenceService: ReferenceService,
      public httpRequestLoader: HttpRequestLoader, public pagerService:
          PagerService, public authenticationService: AuthenticationService,
      public router: Router, public landingPageService: LandingPageService, public logger: XtremandLogger,
      public actionsDescription: ActionsDescription, public sortOption: SortOption, 
      private utilService: UtilService, private route: ActivatedRoute, public renderer: Renderer, private vanityUrlService:VanityURLService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.referenceService.renderer = this.renderer;
      this.pagination.userId = this.loggedInUserId;
      this.modulesDisplayType.isListView = true;
      this.deleteAndEditAccess = this.referenceService.deleteAndEditAccess();
  }

  

  showAllLandingPages(type: string, index: number) {
      this.selectedLandingPageTypeIndex = index;
      this.pagination.filterKey = type;
      this.pagination.pageIndex = 1;
      this.listLandingPages(this.pagination);
  }



  listLandingPages(pagination: Pagination) {
      this.referenceService.loading(this.httpRequestLoader, true);
      if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
        this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.pagination.vanityUrlFilter = true;
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
                    pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
                }
                this.referenceService.loading(this.httpRequestLoader, false);
            }else{
                this.authenticationService.forceToLogout();
            }
         
          },
          (error: any) => { this.logger.errorPage(error); });
  }


  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy(text: any) {
      this.sortOption.formsSortOption = text;
      this.getAllFilteredResults(this.pagination);
  }


  /*************************Search********************** */
  searchLandingPages() {
      this.getAllFilteredResults(this.pagination);
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
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.sortOption.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
      this.listLandingPages(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchLandingPages(); } }
  /********************Pagaination&Search Code*****************/
  showMessageOnTop(message) {
      $(window).scrollTop(0);
      this.customResponse = new CustomResponse('SUCCESS', message, true);
  }

  /***********Preview Email Template*********************/
  showPreview(landingPage: LandingPage) {
      if (this.isPartnerLandingPage) {
          landingPage.showPartnerCompanyLogo = true;
          landingPage.partnerId = this.loggedInUserId;
          landingPage.partnerLandingPage = true;
      } else {
          landingPage.showYourPartnersLogo = true;
      }
      this.previewLandingPageComponent.showPreview(landingPage);
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
              self.deleteById(landingPage);
          }, function (dismiss: any) {
              console.log('you clicked on option' + dismiss);
          });
      } catch (error) {
          this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
          this.referenceService.showServerError(this.httpRequestLoader);
      }
  }


  editLandingPage(id: number) {
      this.landingPageService.id = id;
      if(this.categoryId>0){
          this.router.navigate( ["/home/pages/add/"+this.categoryId] );
      }else{
          this.router.navigate(["/home/pages/add"]);
      }
      
  }

  deleteById(landingPage: LandingPage) {
      this.referenceService.loading(this.httpRequestLoader, true);
      this.referenceService.goToTop();
      this.landingPageService.deletebById(landingPage.id)
          .subscribe(
              (response: any) => {
                  if(response.access){
                    if (response.statusCode == 200) {
                        let message = landingPage.name + " deleted successfully";
                        this.customResponse = new CustomResponse('SUCCESS', message, true);
                        this.pagination.pageIndex = 1;
                        this.listLandingPages(this.pagination);
                        this.exportObject['categoryId'] = this.categoryId;
                        this.exportObject['itemsCount'] = this.pagination.totalRecords;	
                        this.updatedItemsCount.emit(this.exportObject);
                    } else {
                        let campaignNames = "";
                        $.each(response.data, function (index, value) {
                            campaignNames += (index + 1) + ". " + value + "\n\n";
                        });
                        let message = response.message + "\n\n" + campaignNames;
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
      if(this.categoryId>0){
          this.router.navigate(['/home/forms/category/'+this.categoryId+'/lf/' + id]);
      }else{
          this.router.navigate(['/home/forms/lf/' + id]);

      }
  }
  goToPartnerLandingPageFormAnalytics(alias: string) {
      this.router.navigate(['/home/forms/partner/lf/' + alias]);
  }
  goToLandingPageAnalytics(id: number) {
      if(this.categoryId>0){
          this.router.navigate(['/home/pages/' + id + '/category/'+this.categoryId+'/analytics']);
      }else{
          this.router.navigate(['/home/pages/' + id + '/analytics']);
      }
     
  }
  goToPartnerLandingPageAnalytics(alias: string) {
      this.router.navigate(['/home/pages/partner/' + alias + '/analytics']);
  }


  ngOnInit() {

      if (this.router.url.includes('home/pages/partner')) {
          this.isPartnerLandingPage = true;
      } else {
          this.selectedLandingPageTypeIndex = 0;
          this.pagination.filterKey = "All";
          this.isPartnerLandingPage = false;
      }
      if(this.folderListViewInput!=undefined){
				this.categoryId = this.folderListViewInput['categoryId'];
		   }
      if (this.categoryId != undefined) {
          this.pagination.categoryId = this.categoryId;
          this.pagination.categoryType = 'l';
      }
      this.listLandingPages(this.pagination);
      
  }


  ngOnDestroy() {
      this.referenceService.isCreated = false;
      this.referenceService.isUpdated = false;
      this.message = "";
      this.landingPage = new LandingPage();
      $('#landing-page-url-modal').modal('hide');
      swal.close();
  }


  setViewType(viewType: string) {
      if ("List" == viewType) {
          this.modulesDisplayType.isListView = true;
          this.modulesDisplayType.isGridView = false;
          this.modulesDisplayType.isFolderGridView = false;
          this.modulesDisplayType.isFolderListView  = false;
      } else if ("Grid" == viewType) {
          this.modulesDisplayType.isListView = false;
          this.modulesDisplayType.isGridView = true;
          this.modulesDisplayType.isFolderGridView = false;
          this.modulesDisplayType.isFolderListView  = false;
      } 
  }

}

import { Component, OnInit, OnDestroy, ViewChild,Renderer } from '@angular/core';
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
import { LandingPage } from '../models/landing-page';
import { UtilService } from '../../core/services/util.service';
import { environment } from '../../../environments/environment';
import { SortOption } from '../../core/models/sort-option';
import { LandingPageService } from '../services/landing-page.service';
import { PreviewLandingPageComponent } from '../preview-landing-page/preview-landing-page.component';
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';

declare var swal: any, $: any;
@Component({
    selector: 'app-manage-landing-page',
    templateUrl: './manage-landing-page.component.html',
    styleUrls: ['./manage-landing-page.component.css'],
    providers: [Pagination, HttpRequestLoader, ActionsDescription, SortOption],
})
export class ManageLandingPageComponent implements OnInit, OnDestroy {

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
    constructor(public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public landingPageService: LandingPageService, public logger: XtremandLogger,
        public actionsDescription: ActionsDescription, public sortOption: SortOption,
         private utilService: UtilService, private route: ActivatedRoute,public renderer:Renderer,
         private vanityUrlService:VanityURLService
         ) {
        this.pagination.vanityUrlFilter =this.vanityUrlService.isVanityURLEnabled();
        this.loggedInUserId = this.authenticationService.getUserId();
        this.referenceService.renderer = this.renderer;
        this.pagination.userId = this.loggedInUserId;
        if (this.referenceService.isCreated) {
            this.message = "Page created successfully";
            this.showMessageOnTop(this.message);
        } else if (this.referenceService.isUpdated) {
            this.message = "Page updated successfully";
            this.showMessageOnTop(this.message);
        }
        this.deleteAndEditAccess = this.referenceService.deleteAndEditAccess();
        this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
    }

    

    showAllLandingPages(type: string, index: number) {
        this.selectedLandingPageTypeIndex = index;
        this.pagination.filterKey = type;
        this.pagination.pageIndex = 1;
        this.listLandingPages(this.pagination);
    }



    listLandingPages(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        /**********Vanity Url Filter**************** */
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
                this.referenceService.loading(this.httpRequestLoader, false);
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

    /***********Preview Page*********************/
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
        /******** user guides ************/
        this.mergeTagForGuide = this.isPartnerLandingPage ? 'accessing_shared_pages':'manage_pages';
        
        if(this.router.url.endsWith('manage/') || this.router.url.endsWith('partner/')){
            this.setViewType('Folder-Grid');
        }else{
            this.categoryId = this.route.snapshot.params['categoryId'];
            if (this.categoryId != undefined) {
                this.pagination.categoryId = this.categoryId;
                this.pagination.categoryType = 'l';
            }
            let showList = this.modulesDisplayType.isListView || this.modulesDisplayType.isGridView || this.categoryId!=undefined;
            if(showList){
                if(!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView){
                    this.modulesDisplayType.isListView = true;
                    this.modulesDisplayType.isGridView = false;
                }
                this.modulesDisplayType.isFolderListView = false;
                this.modulesDisplayType.isFolderGridView = false;
                this.listLandingPages(this.pagination);
            }else if(this.modulesDisplayType.isFolderGridView){
                this.setViewType('Folder-Grid');
            }else if(this.modulesDisplayType.isFolderListView){
                this.setViewType('Folder-List');
            }
        }
        
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
            this.navigateToManageSection(viewType);
        } else if ("Grid" == viewType) {
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView  = false;
            this.navigateToManageSection(viewType);
        } else if ("Folder-Grid" == viewType) {
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = true;
            this.modulesDisplayType.isFolderListView  = false;
            this.exportObject['type'] = 3;
            this.exportObject['folderType'] = viewType;
            if(this.isPartnerLandingPage){
                this.exportObject['partnerCompanyId'] = this.referenceService.companyId;
            }
            this.exportObject['partnerLandingPage'] = this.isPartnerLandingPage;
            if (this.categoryId > 0) {
                if(this.isPartnerLandingPage){
                    this.router.navigateByUrl('/home/pages/partner/');
                }else{
                    this.router.navigateByUrl('/home/pages/manage/');
                }
            }
        }else if("Folder-List"==viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = true;
			this.exportObject['folderType'] = viewType;
            this.exportObject['type'] = 3;
            if(this.isPartnerLandingPage){
                this.exportObject['partnerCompanyId'] = this.referenceService.companyId;
            }
            this.exportObject['partnerLandingPage'] = this.isPartnerLandingPage;
        }
    }


    navigateToManageSection(viewType:string){
        if("List"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isListView = true;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.listLandingPages(this.pagination);
        }else if("Grid"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.modulesDisplayType.isListView = false;
            this.listLandingPages(this.pagination);
        }else if(this.modulesDisplayType.defaultDisplayType=="FOLDER_GRID" || this.modulesDisplayType.defaultDisplayType=="FOLDER_LIST"
                 &&  (this.categoryId==undefined || this.categoryId==0)){
           this.modulesDisplayType.isFolderGridView = false;
           this.modulesDisplayType.isFolderListView = false;
           if("List"==viewType){
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isListView = true;
           }else{
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isListView = false;
           }
           this.listLandingPages(this.pagination);
        }else if (this.router.url.endsWith('manage/')) {
            this.router.navigateByUrl('/home/pages/manage');
        }else if(this.router.url.endsWith('partner/')){
            this.router.navigateByUrl('/home/pages/partner');
        }
    }


    getUpdatedValue(event: any) {
        let viewType = event.viewType;
        if (viewType != undefined) {
            this.setViewType(viewType);
        }

    }

}


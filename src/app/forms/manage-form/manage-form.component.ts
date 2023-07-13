import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Input, Renderer } from '@angular/core';
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
import { Form } from '../models/form';
import { UtilService } from '../../core/services/util.service';
import { SortOption } from '../../core/models/sort-option';
import { FormService } from '../services/form.service';
import { PreviewPopupComponent } from '../preview-popup/preview-popup.component';
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { FormSubType } from '../models/form-sub-type.enum';

declare var swal, $: any;

@Component({
    selector: 'app-manage-form',
    templateUrl: './manage-form.component.html',
    styleUrls: ['./manage-form.component.css', '../add-form/add-form.component.css', '../preview/form-preview.component.css'],
    providers: [Pagination, HttpRequestLoader, ActionsDescription, SortOption],
})
export class ManageFormComponent implements OnInit, OnDestroy {
    landingPagesRouterLink: string;
    onlyForms = false;
    form: Form = new Form();
    ngxloading = false;
    pagination: Pagination = new Pagination();
    loggedInUserId = 0;
    customResponse: CustomResponse = new CustomResponse();
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    
    private dom: Document;
    message = "";
    campaignId = 0;
    landingPageId = 0;
    landingPageCampaignId = 0;
    partnerLandingPageAlias = "";
    partnerId = 0;
    statusCode = 200;
    deleteAndEditAccess = false;

    categoryId: number = 0;
    showFolderView = true;

    formAliasUrl:string="";
    iframeEmbedUrl: string = "";

    @ViewChild('previewPopUpComponent') previewPopUpComponent: PreviewPopupComponent;
    exportObject:any = {};
    modulesDisplayType = new ModulesDisplayType();
    selectedFormTypeIndex = 0;

    surveyCampaignId = 0;
    selectedFormSubmitId = 0;
    detailedResponse: boolean = false;
    mergeTagForGuide:any;
    constructor(public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public formService: FormService, public logger: XtremandLogger,
        public actionsDescription: ActionsDescription, public sortOption: SortOption, private utilService: UtilService, private route: ActivatedRoute, 
        public renderer: Renderer,private vanityUrlService:VanityURLService) {
        this.referenceService.renderer = this.renderer;
        this.pagination.vanityUrlFilter =this.vanityUrlService.isVanityURLEnabled();
        this.categoryId = this.route.snapshot.params['categoryId'];
        if(this.router.url.indexOf('/manage')>-1){
            this.showFolderView = true;
        }else{
            this.showFolderView = false;
        }
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
        if (this.referenceService.isCreated) {
            this.message = "Form created successfully";
            this.showMessageOnTop(this.message);
        } else if (this.referenceService.isUpdated) {
            this.message = "Form updated successfully";
            this.showMessageOnTop(this.message);
        }
        this.deleteAndEditAccess = this.referenceService.deleteAndEditAccess();
        this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
    }

    ngOnInit() {
        this.selectedFormTypeIndex = 0;
        this.mergeTagForGuide = 'manage_forms'
        this.pagination.filterKey = "All";
        if (this.router.url.endsWith('manage/')) {
            this.onlyForms = this.router.url.indexOf('/lf')<0;
            this.setViewType('Folder-Grid');
        } else {
            this.campaignId = this.route.snapshot.params['alias'];
            this.landingPageId = this.route.snapshot.params['landingPageId'];
            this.landingPageCampaignId = this.route.snapshot.params['landingPageCampaignId'];
            this.partnerLandingPageAlias = this.route.snapshot.params['partnerLandingPageAlias'];
            this.partnerId = this.route.snapshot.params['partnerId'];
            this.surveyCampaignId = this.route.snapshot.params['surveyCampaignId'];
            if (this.categoryId>0 && (this.landingPageId==undefined||this.landingPageId==0)) {
                this.pagination.categoryId = this.categoryId;
                this.pagination.categoryType = 'f';
            }
            if (this.campaignId != undefined) {
                this.pagination.campaignId = this.campaignId;
                this.pagination.campaignForm = true;
            } else if (this.landingPageId > 0) {
                this.pagination.landingPageId = this.landingPageId;
                this.pagination.landingPageForm = true;
                if(this.categoryId>0){
                    this.landingPagesRouterLink = "/home/pages/manage/"+this.categoryId;
                }else{
                    this.landingPagesRouterLink = "/home/pages/manage";
                }
                
            } else if (this.landingPageCampaignId > 0) {
                this.pagination.campaignId = this.landingPageCampaignId;
                this.pagination.landingPageCampaignForm = true;
                this.pagination.partnerId = this.partnerId;
            } else if (this.partnerLandingPageAlias != undefined) {
                this.pagination.landingPageAlias = this.partnerLandingPageAlias;
                this.pagination.partnerLandingPageForm = true;
                this.landingPagesRouterLink = "/home/pages/partner";
            } else if (this.surveyCampaignId > 0) {
                this.pagination.campaignId = this.surveyCampaignId;
                this.pagination.surveyCampaignForm = true;
                this.pagination.partnerId = this.partnerId;
            } else {
                this.onlyForms = true;
            }
            let showManageFormsList = this.modulesDisplayType.isListView || this.modulesDisplayType.isGridView || this.categoryId!=undefined || !this.onlyForms;
            if(showManageFormsList){
                if(!this.modulesDisplayType.isListView && !this.modulesDisplayType.isGridView){
                    this.modulesDisplayType.isListView = true;
                    this.modulesDisplayType.isGridView = false;
                }
                this.modulesDisplayType.isFolderListView = false;
                this.modulesDisplayType.isFolderGridView = false;
                this.listForms(this.pagination);
            }else if(this.modulesDisplayType.isFolderGridView){
                this.setViewType('Folder-Grid');
            }else if(this.modulesDisplayType.isFolderListView){
                this.setViewType('Folder-List');
            }
            
        }



    }


    listForms(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
		/**********Vanity Url Filter**************** */
        if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
            this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
            this.pagination.vanityUrlFilter = true;
        }
        this.formService.list(pagination).subscribe(
            (response: any) => {
                const data = response.data;
                this.statusCode = response.statusCode;
                if (this.statusCode == 200) {
                    pagination.totalRecords = data.totalRecords;
                    this.sortOption.totalRecords = data.totalRecords;
                    $.each(data.forms, function (_index, form:any) {
                        form.createdDateString = new Date(form.createdDateString);
                        if(form.updatedString!=undefined && $.trim(form.updatedString).length>0){
                            form.updatedDateString = new Date(form.updatedDateString);
                        }
                    });
                    pagination = this.pagerService.getPagedItems(pagination, data.forms);
                }
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            (error: any) => {
                this.logger.errorPage(error);
            });
    }
    /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy(text: any) {
        this.sortOption.formsSortOption = text;
        this.getAllFilteredResults(this.pagination);
    }


    /*************************Search********************** */
    searchForms() {
        this.getAllFilteredResults(this.pagination);
    }

    paginationDropdown(items: any) {
        this.sortOption.itemsSize = items;
        this.getAllFilteredResults(this.pagination);
    }

    /************Page************** */
    setPage(event: any) {
        this.pagination.pageIndex = event.page;
        this.listForms(this.pagination);
    }

    getAllFilteredResults(pagination: Pagination) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.sortOption.searchKey;
        this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
        this.listForms(this.pagination);
    }
    eventHandler(keyCode: any) { if (keyCode === 13) { this.searchForms(); } }
    /********************Pagaination&Search Code*****************/

    showMessageOnTop(message) {
        $(window).scrollTop(0);
        this.customResponse = new CustomResponse('SUCCESS', message, true);
    }

    /***********Delete**************/
    confirmDelete(form: Form) {
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
                self.deleteById(form);
            }, function (dismiss: any) {
                console.log('you clicked on option' + dismiss);
            });
        } catch (error) {
            this.logger.error(this.referenceService.errorPrepender + " confirmDelete():" + error);
            this.referenceService.showServerError(this.httpRequestLoader);
        }
    }

    deleteById(form: Form) {
        this.customResponse = new CustomResponse();
        this.referenceService.loading(this.httpRequestLoader, true);
        this.referenceService.goToTop();
        this.formService.delete(form.id)
            .subscribe(
                (response: any) => {
                    if(response.access){
                        if (response.statusCode == 200) {
                            this.referenceService.showInfo("Form Deleted Successfully", "");
                            const message = response.message;
                            this.customResponse = new CustomResponse('SUCCESS', message, true);
                            this.pagination.pageIndex = 1;
                            this.listForms(this.pagination);
                        } else {
                            let emailTemplateNames = "";
                            $.each(response.data, function (index, value) {
                                emailTemplateNames += (index + 1) + "." + value + "<br><br>";
                            });
                            let message = response.message + "<br><br>" + emailTemplateNames;
                            this.customResponse = new CustomResponse('ERROR', message, true);
                            this.referenceService.loading(this.httpRequestLoader, false);
                        }
                    }else{
                        this.authenticationService.forceToLogout();
                    }
                    

                },
                (error: string) => {
                    let message = JSON.parse(error['_body']).message;
                    let statusCode = JSON.parse(error['_body']).statusCode;
                    if(statusCode == 400){
                        this.customResponse = new CustomResponse('ERROR', message, true);
                        this.referenceService.loading(this.httpRequestLoader, false);
                    } else {
                        this.referenceService.showServerErrorMessage(this.httpRequestLoader);
                        this.customResponse = new CustomResponse('ERROR', this.httpRequestLoader.message, true);
                    }
                }
            );
    }

    /*****************Preview Form*******************/
    preview(id: number) {
        this.previewPopUpComponent.previewForm(id);
    }


    edit(id: number) {
        let formInput: Form = new Form();
        formInput.id = id;
        formInput.userId = this.authenticationService.getUserId();
        let companyProfileName = this.authenticationService.companyProfileName;
        if (companyProfileName !== undefined && companyProfileName !== "") {
            formInput.vendorCompanyProfileName = companyProfileName;
            formInput.vanityUrlFilter = true;
        }
        this.formService.getById(formInput)
            .subscribe(
                (data: any) => {
                    this.ngxloading = false;
                    if (data.statusCode === 200) {
                        this.formService.form = data.data;
                        let categoryId = this.route.snapshot.params['categoryId'];
                        if (categoryId > 0) {
                            this.router.navigate(["/home/forms/edit/" + categoryId]);
                        } else {
                            this.router.navigate(["/home/forms/edit"]);
                        }
                    } else {
                        swal("Please Contact Admin!", data.message, "error");
                    }
                },
                (error: string) => {
                    this.logger.errorPage(error);
                    this.referenceService.showServerError(this.httpRequestLoader);
                }
            );
    }

    /*********Copy The Link */
    copyInputMessage(inputElement: any, type: string) {
        this.referenceService.goToTop();
        this.copiedLinkCustomResponse = new CustomResponse();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        let message = type + ' copied to clipboard successfully.';
        if (type === "Form link") {
            $("#copy-link").select();
        } else {
            $("#text-area").select();
        }
        this.copiedLinkCustomResponse = new CustomResponse('SUCCESS', message, true);
    }

      showFormUrl(form:Form){
          this.form = form;         
          this.copiedLinkCustomResponse = new CustomResponse();
          this.formAliasUrl = form.ailasUrl;
          this.iframeEmbedUrl = '<iframe width="1000" height="720" src="' + this.formAliasUrl + '"  frameborder="0" allowfullscreen ></iframe>';   
          $('#form-url-modal').modal('show');
      }


    /**************Destroy***********/
    ngOnDestroy() {
        this.referenceService.isCreated = false;
        this.referenceService.isUpdated = false;
        this.message = "";
        this.form = new Form();
        $('#form-preview-modal').modal('hide');
        $('#form-url-modal').modal('hide');
        swal.close();
    }

    goToAnalytics(form: Form) {
        if (this.pagination.campaignForm) {
            this.router.navigate(['/home/forms/' + form.alias + '/' + this.campaignId + '/analytics']);
        } else if (this.pagination.landingPageCampaignForm) {
            if (this.partnerId > 0) {
                this.router.navigate(['/home/forms/' + form.alias + '/' + this.landingPageCampaignId + '/' + this.partnerId + '/analytics/cfa']);
            } else {
                this.router.navigate(['/home/forms/' + form.alias + '/' + this.landingPageCampaignId + '/analytics']);
            }
        } else if (this.pagination.landingPageForm) {
            if(this.categoryId>0){
                this.router.navigate(['/home/forms/category/'+this.categoryId+'/lf/' + form.alias + '/' + this.landingPageId + '/analytics']);
            }else{
                this.router.navigate(['/home/forms/lf/' + form.alias + '/' + this.landingPageId + '/analytics']);

            }
        } else if (this.pagination.partnerLandingPageForm) {
            this.router.navigate(['/home/forms/partner/f/' + form.id + '/' + this.partnerLandingPageAlias + '/analytics']);
        }  else if (this.pagination.surveyCampaignForm) {
            if (this.partnerId > 0) {
                this.router.navigate(['/home/forms/' + form.alias + '/' + this.surveyCampaignId + '/' + this.partnerId + '/survey/analytics']);
            } else {
                this.router.navigate(['/home/forms/' + form.alias + '/' + this.surveyCampaignId + '/survey/analytics']);
            }
        }else {
            if (form.formSubType.toString() === FormSubType[FormSubType.SURVEY]) {
                this.router.navigate(['/home/forms/' + form.alias + '/survey/analytics']);
            } else {
                if(this.categoryId>0){
                    this.router.navigate(['/home/forms/category/' + form.alias +'/'+this.categoryId+ '/analytics']);
                }else{
                    this.router.navigate(['/home/forms/' + form.alias + '/analytics']);
                }
            }    

            
        }
    }
    goToCampaignAnalytics() {
        let campaignId = this.landingPageCampaignId;
        if (this.pagination.surveyCampaignForm) {
            campaignId = this.surveyCampaignId;
        }
        this.router.navigate(['home/campaigns/' + campaignId + '/details']);
    }

    ngAfterViewInit() {
    }


    setViewType(viewType: string) {
        if ("List" == viewType) {
            this.modulesDisplayType.isListView = true;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.navigateToManageSection(viewType);
        } else if ("Grid" == viewType) {
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.navigateToManageSection(viewType);
        } else if ("Folder-Grid" == viewType) {
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.modulesDisplayType.isFolderGridView = true;
            this.exportObject['type'] = 2;
            this.exportObject['folderType'] = viewType;
            if (this.categoryId > 0) {
                this.router.navigateByUrl('/home/forms/manage/');
            }
        }else if("Folder-List" == viewType){
            this.modulesDisplayType.isListView = false;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = true;
			this.exportObject['folderType'] = viewType;
            this.exportObject['type'] = 2;

        }
    }

    navigateToManageSection(viewType:string) {
       if("List"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isListView = true;
            this.modulesDisplayType.isGridView = false;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.listForms(this.pagination);
        }else if("Grid"==viewType && (this.categoryId==undefined || this.categoryId==0)){
            this.modulesDisplayType.isGridView = true;
            this.modulesDisplayType.isFolderGridView = false;
            this.modulesDisplayType.isFolderListView = false;
            this.modulesDisplayType.isListView = false;
            this.listForms(this.pagination);
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
           this.listForms(this.pagination);
        }
        else if(this.router.url.endsWith('manage/')){
            this.router.navigateByUrl('/home/forms/manage');
        }
    }

    


    getUpdatedValue(event: any) {
        let viewType = event.viewType;
        if (viewType != undefined) {
            this.setViewType(viewType);
        }

    }

    refreshPage() {
        this.listForms(this.pagination);
      }

      showAllForms(type: string, index: number) {
        this.selectedFormTypeIndex = index;
        this.pagination.filterKey = type;
        this.pagination.pageIndex = 1;
        this.listForms(this.pagination);
    }

    showDetailedResponse(formSubmitId: any) {
        this.selectedFormSubmitId = formSubmitId;
        this.detailedResponse = true;
    }
}

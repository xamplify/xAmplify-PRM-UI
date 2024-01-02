import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Input, Renderer,Output,EventEmitter } from '@angular/core';
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
import { Form } from 'app/forms/models/form';
import { UtilService } from '../../core/services/util.service';
import { SortOption } from '../../core/models/sort-option';
import { FormService } from '../../forms/services/form.service';
import { PreviewPopupComponent } from 'app/forms/preview-popup/preview-popup.component';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { FormSubType } from 'app/forms/models/form-sub-type.enum';

declare var swal, $: any;

@Component({
  selector: 'app-forms-list-view-util',
  templateUrl: './forms-list-view-util.component.html',
  styleUrls: ['./forms-list-view-util.component.css','../../forms/add-form/add-form.component.css', '../../forms/preview/form-preview.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription, SortOption],

})
export class FormsListViewUtilComponent implements OnInit,OnDestroy {
    landingPagesRouterLink: string;
    onlyForms = false;
    form: Form = new Form();
    ngxloading = false;
    pagination: Pagination = new Pagination();
    loggedInUserId = 0;
    customResponse: CustomResponse = new CustomResponse();
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    
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
    isListView = false;
    isGridView: boolean = false;
    @Input()folderListViewInput:any;
    @Output() updatedItemsCount = new EventEmitter();
    selectedFormTypeIndex = 0;

    constructor(public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public formService: FormService, public logger: XtremandLogger,
        public actionsDescription: ActionsDescription, public sortOption: SortOption, 
        private utilService: UtilService, private route: ActivatedRoute, public renderer: Renderer,private vanityUrlService:VanityURLService) {
        this.referenceService.renderer = this.renderer;
        this.pagination.vanityUrlFilter =this.vanityUrlService.isVanityURLEnabled();
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
        this.deleteAndEditAccess = this.referenceService.deleteAndEditAccess();

    }

    ngOnInit() {
        this.selectedFormTypeIndex = 0;
        this.pagination.filterKey = "All";
        this.isListView = true;
        this.isGridView = false;
		if(this.folderListViewInput!=undefined){
			this.categoryId = this.folderListViewInput['categoryId'];
		}
        	this.campaignId = this.route.snapshot.params['alias'];
            this.landingPageId = this.route.snapshot.params['landingPageId'];
            this.landingPageCampaignId = this.route.snapshot.params['landingPageCampaignId'];
            this.partnerLandingPageAlias = this.route.snapshot.params['partnerLandingPageAlias'];
            this.partnerId = this.route.snapshot.params['partnerId'];
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
            } else {
                this.onlyForms = true;
            }
            
            this.listForms(this.pagination);
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
                            this.exportObject['categoryId'] = this.categoryId;
                            this.exportObject['itemsCount'] = this.pagination.totalRecords;	
                            this.updatedItemsCount.emit(this.exportObject);
                        } else {
                            let emailTemplateNames = "";
                            $.each(response.data, function (index, value) {
                                emailTemplateNames += (index + 1) + ". " + value + "\n\n";
                            });
                            let message = response.message + "\n\n" + emailTemplateNames;
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

    /*****************Preview Form*******************/
    preview(id: number) {
        this.previewPopUpComponent.previewForm(id);
    }


    edit(id: number) {
    	let formInput:Form = new Form();
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



    /**************Edit Form***********/
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
                this.router.navigate(['/home/forms/' + form.alias + '/' + this.landingPageCampaignId + '/' + this.partnerId + '/analytics']);
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
        } else {
            if(this.categoryId>0){                
                if (form.formSubType.toString() === FormSubType[FormSubType.SURVEY]) {
                    this.router.navigate(['/home/forms/' + form.alias + '/survey/analytics']);
                } else {
                    this.router.navigate(['/home/forms/category/' + form.alias +'/'+this.categoryId+ '/analytics']);
                }
            }else{                
                if (form.formSubType.toString() === FormSubType[FormSubType.SURVEY]) {
                    this.router.navigate(['/home/forms/' + form.alias + '/survey/analytics']);
                } else {
                    this.router.navigate(['/home/forms/' + form.alias + '/analytics']);
                }
            }
        }

    }
    goToCampaignAnalytics() {
        this.router.navigate(['home/campaigns/' + this.landingPageCampaignId + '/details']);
    }

    ngAfterViewInit() {
    }


    setViewType(type:string){
        if("List"==type){
            this.isListView = true;
            this.isGridView = false;
        }else if("Grid"==type){
            this.isListView = false;
            this.isGridView = true;
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
}

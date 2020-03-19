import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';

declare var $: any;
@Component({
    selector: 'app-category-folder-view-util',
    templateUrl: './category-folder-view-util.component.html',
    styleUrls: ['./category-folder-view-util.component.css'],
    providers: [Pagination, HttpRequestLoader, SortOption]
})
export class CategoryFolderViewUtilComponent implements OnInit {


    @Input() moduleType: number;
    @Output() valueUpdate = new EventEmitter();
    inputObject:any;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    categorySortOption: SortOption = new SortOption();

    constructor(private router: Router,
        private pagerService: PagerService, public referenceService: ReferenceService,
        public pagination: Pagination, public authenticationService: AuthenticationService, private logger: XtremandLogger,
        public userService: UserService, public utilService: UtilService) {

    }

    setViewType(type: string) {
        this.inputObject['viewType'] = type;
        this.valueUpdate.emit(this.inputObject);
    }

    ngOnInit() {
        this.inputObject = {};
        this.listCategories(this.pagination);
    }

    listCategories(pagination: Pagination) {
        if (this.referenceService.companyId > 0) {
            pagination.companyId = this.referenceService.companyId;
            if (this.moduleType == 1) {
                pagination.categoryType = 'e';
            }else if(this.moduleType==2){
                pagination.categoryType = 'f';
            }else if(this.moduleType==3){
                pagination.categoryType = 'l';
            }else if(this.moduleType==4){
                pagination.categoryType = 'c';
            }
            this.referenceService.startLoader(this.httpRequestLoader);
            this.userService.getCategories(this.pagination)
                .subscribe(
                    response => {
                        const data = response.data;
                        pagination.totalRecords = data.totalRecords;
                        this.categorySortOption.totalRecords = data.totalRecords;
                        $.each(data.categories, function (_index: number, category: any) {
                            category.displayTime = new Date(category.createdTimeInString);
                        });
                        pagination = this.pagerService.getPagedItems(pagination, data.categories);
                        this.referenceService.stopLoader(this.httpRequestLoader);
                    },
                    (error: any) => {
                        this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
                    },
                    () => this.logger.info('Finished listEmailTemplateCategories()')
                );
        } else {
            this.referenceService.showSweetAlertErrorMessage("Unable to get companyId");
        }
    }


    /********************Pagaination&Search Code*****************/

    /*************************Sort********************** */
    sortBy(text: any) {
        this.categorySortOption.formsSortOption = text;
        this.getAllCategoryFilteredResults(this.pagination);
    }


    /*************************Search********************** */
    searchCategories() {
        this.getAllCategoryFilteredResults(this.pagination);
    }

    paginationDropdown(items: any) {
        this.categorySortOption.itemsSize = items;
        this.getAllCategoryFilteredResults(this.pagination);
    }

    /************Page************** */
    setPage(event: any) {
        this.pagination.pageIndex = event.page;
        this.listCategories(this.pagination);
    }

    getAllCategoryFilteredResults(pagination: Pagination) {
        pagination.pageIndex = 1;
        pagination.searchKey = this.categorySortOption.searchKey;
        pagination = this.utilService.sortOptionValues(this.categorySortOption.selectedCategoryDropDownOption, pagination);
        this.listCategories(pagination);
    }
    eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCategories(); } }

    viewItemsByCategoryId(categoryId:number) {
        if(this.moduleType==1){
            this.router.navigate( ['home/emailtemplates/manage/' + categoryId] );
        }else if(this.moduleType==2){
            this.router.navigate( ['home/forms/manage/' + categoryId] );
        }else if(this.moduleType==3){
            this.router.navigate( ['home/pages/manage/' + categoryId] );
        }else if(this.moduleType==4){
            this.router.navigate( ['home/campaigns/manage/' + categoryId] );
        }
        
    }


}

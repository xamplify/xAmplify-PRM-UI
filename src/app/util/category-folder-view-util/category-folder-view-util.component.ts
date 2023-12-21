import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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
    @Input() moduleType: any;
    @Output() valueUpdate = new EventEmitter();
    @Output() navigatingToRelatedComponent = new EventEmitter();
    inputObject:any;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    categorySortOption: SortOption = new SortOption();
    isFromCampaignModule = false;
	isFromRedistributedCampaignSection = false;
    folderViewType = "List";
	folderListViewInput = {};
	selectedModuleType = "";
    archived: any = false;
    titleHeader ="";
    moduleName = "";
    constructor(private router: Router,
        private pagerService: PagerService, public referenceService: ReferenceService,
        public pagination: Pagination, public authenticationService: AuthenticationService, private logger: XtremandLogger,
        public userService: UserService, public utilService: UtilService,private route: ActivatedRoute) {
        this.isFromCampaignModule = this.router.url.indexOf("campaigns")>-1; 
 		this.isFromRedistributedCampaignSection = this.router.url.indexOf("campaigns/partner")>-1; 
         
    }

    setViewType(type: string) {
        this.inputObject['viewType'] = type;
        this.inputObject['archived'] = this.archived;
        this.valueUpdate.emit(this.inputObject);
    }
   

    ngOnInit() {
        this.customResponse = new CustomResponse();
        this.inputObject = {};
        this.folderListViewInput = {};
        this.folderViewType = this.moduleType['folderType'];
        this.selectedModuleType = this.moduleType['type'];
        this.archived = this.moduleType['archived'];
        this.pagination.archived = this.archived;
        this.listCategories(this.pagination);
    }

    listCategories(pagination: Pagination) {
        pagination.companyId = this.referenceService.companyId;
        pagination.userId = this.authenticationService.getUserId();
        let type = this.moduleType['type'];
		this.selectedModuleType = type;
        if (type == 1) {
            pagination.categoryType = 'e';
            this.titleHeader = "Manage Templates";
            this.moduleName = "Email Templates";
        }else if(type==2){
            pagination.categoryType = 'f';
            this.titleHeader ="Manage Forms";
            this.moduleName = "Forms";
        }else if(type==3){
            pagination.categoryType = 'l';
            this.titleHeader = "Manage Pages";
            this.moduleName = "Pages";
			pagination.partnerView = false;
			if(this.router.url.indexOf("/partner")>-1){
				pagination.partnerView = true;
                this.titleHeader = 'Pages Shared By Vendors';
                this.moduleName = "Pages";
			}
        }else if(type==4 || type==5){
            pagination.categoryType = 'c';
            this.titleHeader = type==5 ? "Campaigns shared by Vendors": "Manage Campaigns";
            this.moduleName = "Campaigns";
			if(this.router.url.indexOf("/partner")>-1){
				pagination.partnerView = true;

			}
        }
        let teamMemberId = this.moduleType['teamMemberId'];
        if(teamMemberId!=undefined){
            pagination.teamMemberId = teamMemberId;
        }
        let partnerCompanyId = this.moduleType['partnerCompanyId'];
        if(partnerCompanyId!=undefined){
            pagination.partnerCompanyId = partnerCompanyId;
        }
        this.referenceService.startLoader(this.httpRequestLoader);
        this.authenticationService.setVanityUrlFilter(this.pagination);
        this.userService.getCategories(this.pagination)
            .subscribe(
                response => {
                    this.customResponse = new CustomResponse();
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
                () => this.logger.info('Finished listCategories()')
            );
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
        this.navigatingToRelatedComponent.emit();
        let type = this.moduleType['type'];
        if(type==1){
            this.router.navigate( ['home/emailtemplates/manage/' + categoryId] );
            this.titleHeader = "Manage Templates";
        }else if(type==2){
            this.titleHeader = "Manage Forms";
            this.router.navigate( ['home/forms/manage/' + categoryId] );
        }else if(type==3){
			let partnerLandingPage = this.moduleType['partnerLandingPage'];
			if(partnerLandingPage){
				 this.router.navigate( ['home/pages/partner/' + categoryId] );
                 this.titleHeader = "Pages Shared By Vendors";
			}else{
				 this.router.navigate( ['home/pages/manage/' + categoryId] );
                 this.titleHeader = "Manage Pages";
			}
           
        }else if(type==4){
            let teamMemberId = this.moduleType['teamMemberId'];
            if(teamMemberId!=undefined && teamMemberId>0){
                this.titleHeader ="Manage Campaigns";
                this.router.navigate( ['home/campaigns/manage/' + categoryId+"/"+teamMemberId] );
                
            }else{
                this.titleHeader ="Manage Campaigns";
                this.router.navigate( ['home/campaigns/manage/' + categoryId] );
                
            }
        }else if(type==5){
            this.router.navigate( ['home/campaigns/partner/f/' + categoryId] );
            this.titleHeader ="Campaigns shared by Vendors";
        }
        
    }

    goToCalendarView(){
        this.navigatingToRelatedComponent.emit();
        let teamMemberId = this.route.snapshot.params['teamMemberId'];
        if(teamMemberId!=undefined && teamMemberId>0){
            this.router.navigate(['/home/campaigns/calendar/' + teamMemberId]);
        }else{
            this.router.navigate(['/home/campaigns/calendar']);
        }
     
    }

    viewFolderItems(category:any,selectedIndex:number){
        $.each(this.pagination.pagedItems, function (index:number, row:any) {
            if (selectedIndex != index) {
              row.expanded = false;
            }
          });
          category.expanded = !category.expanded;  
          $('.child-row-list-view').css("background-color", "#fff");          
        if (category.expanded) {
            this.folderListViewInput['categoryId'] = category.id;
            $('#folder-row-' + selectedIndex).css("background-color", "#f1f5f9");
        } else {
            $('#folder-row-' + selectedIndex).css("background-color", "#fff");
        }
    }

getUpdatedItemsCount(event:any){
    let categoryId = event['categoryId'];
    let itemsCount = event['itemsCount'];
    let updated = event['updated'];
    if(itemsCount>0){
        itemsCount = itemsCount-1;
    }
    $('#count-'+this.selectedModuleType+"-"+categoryId).text(itemsCount);
    if(updated){
        this.searchCategories();
    }
}

}

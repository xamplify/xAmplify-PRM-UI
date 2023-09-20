import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
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
import { ModulesDisplayType } from '../models/modules-display-type';
import { Roles } from 'app/core/models/roles';
import { Angular2Csv } from 'angular2-csv';
declare var $: any;
@Component({
  selector: 'app-folder-type-view-util',
  templateUrl: './folder-type-view-util.component.html',
  styleUrls: ['./folder-type-view-util.component.css'],
  providers: [Pagination, HttpRequestLoader, SortOption]
})
export class FolderTypeViewUtilComponent implements OnInit {

  @Input() moduleId:number;
  @Input()modulesDisplayType:ModulesDisplayType;
  @Output() folderViewTypeEventEmitter = new EventEmitter();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  customResponse:CustomResponse = new CustomResponse();
  categorySortOption: SortOption = new SortOption();
  folderViewType = "";
  roles:Roles = new Roles();
  isPartnerView = false;
  type:string = "";
  titleHeader:string = "";
  suffixHeader:string = "";
  constructor(private router: Router,
    private pagerService: PagerService, public referenceService: ReferenceService,
    public pagination: Pagination, public authenticationService: AuthenticationService, private logger: XtremandLogger,
    public userService: UserService, public utilService: UtilService,private route: ActivatedRoute) { 
      this.isPartnerView = this.router.url.indexOf("/shared")>-1; 

    }

  ngOnInit() {
    this.folderViewType = this.route.snapshot.params['viewType'];
    this.pagination.categoryType = this.referenceService.getCategoryType(this.moduleId);
    this.type = this.referenceService.getLearningTrackOrPlayBookType(this.moduleId);
    this.findAllCategories(this.pagination);
  }

  findAllCategories(pagination:Pagination){
    this.referenceService.startLoader(this.httpRequestLoader);
    pagination.companyId = this.referenceService.companyId;
    if(this.isPartnerView){
      pagination.partnerCompanyId = pagination.companyId;
      pagination.partnerView  = this.isPartnerView;
    }
    this.suffixHeader = this.isPartnerView ? "Shared " : "Manage ";
    if(this.pagination.categoryType == "DAM"){
      this.titleHeader = " Digital Assets";
    } else if (this.pagination.categoryType == "LEARNING_TRACK") {
      this.titleHeader = "Tracks";
    } else if (this.pagination.categoryType == "PLAY_BOOK") {
      this.titleHeader = "Play Books";
    }else if(this.pagination.categoryType == "CAMPAIGN"){
      this.titleHeader = "Campaigns";
    }else if(this.pagination.categoryType == "EMAIL_TEMPLATE"){
      this.titleHeader = "Email Templates";
    }

    pagination.userId = this.authenticationService.getUserId();
    this.authenticationService.setVanityUrlFilter(pagination);
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
                    this.logger.errorPage(error);
                });
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
      this.findAllCategories(this.pagination);
  }

  getAllCategoryFilteredResults(pagination: Pagination) {
      pagination.pageIndex = 1;
      pagination.searchKey = this.categorySortOption.searchKey;
      pagination = this.utilService.sortOptionValues(this.categorySortOption.selectedTeamMemberGroupSortDropDown, pagination);
      this.findAllCategories(pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCategories(); } }

  viewItemsByCategoryId(categoryId:number) {
    if(this.moduleId==this.roles.damId){
      this.referenceService.goToManageAssetsByCategoryId("fg","l",categoryId,this.isPartnerView);
    }else if(this.moduleId==this.roles.learningTrackId){
      this.referenceService.goToManageTracksOrPlayBooksByCategoryId("fg","l",categoryId,this.isPartnerView,true);
    }else if(this.moduleId==this.roles.playbookId){
      this.referenceService.goToManageTracksOrPlayBooksByCategoryId("fg","l",categoryId,this.isPartnerView,false);
    }else if(this.moduleId==this.roles.campaignId){
      this.referenceService.goToManageCampaignsByCategoryId("fg","l",categoryId);
    }else if(this.moduleId==this.roles.emailTemplateId){
      this.referenceService.goToManageEmailTemplatesByCategoryId("fg","l",categoryId);
    }
  }

  setViewType(viewType:string){
    if(this.folderViewType!=viewType){
      if(this.moduleId==this.roles.damId){
        this.referenceService.goToManageAssets(viewType,this.isPartnerView);
      }else if(this.moduleId==this.roles.learningTrackId){
        this.referenceService.goToManageTracksOrPlayBooks(viewType,this.isPartnerView,true);
      }else if(this.moduleId==this.roles.playbookId){
        this.referenceService.goToManageTracksOrPlayBooks(viewType,this.isPartnerView,false);
      }else if(this.moduleId==this.roles.campaignId){
        this.referenceService.goToManageCampaigns(viewType);
      }else if(this.moduleId==this.roles.emailTemplateId){
        this.referenceService.goToManageEmailTemplates(viewType);
      }
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
        this.referenceService.isCreated = false;
        this.referenceService.isUpdated = false;
        $('#folder-row-' + selectedIndex).css("background-color", "#f1f5f9");
    } else {
        $('#folder-row-' + selectedIndex).css("background-color", "#fff");
    }
}

getUpdatedItemsCount(event:any){
  let categoryId = event['categoryId'];
  let itemsCount = event['itemsCount'];
  if(itemsCount>0){
      itemsCount = itemsCount-1;
  }
  $('#count-'+this.moduleId+"-"+categoryId).text(itemsCount);
}

}

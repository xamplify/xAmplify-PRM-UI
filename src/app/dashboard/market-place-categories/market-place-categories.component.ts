import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from 'app/core/services/util.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from '../../core/models/sort-option';
import { PagerService } from '../../core/services/pager.service';
import { MarketPlaceCategory } from '../models/market-place-category'
import { LandingPageService } from '../../landing-pages/services/landing-page.service';

declare var swal, $: any;

@Component({
  selector: 'app-market-place-categories',
  templateUrl: './market-place-categories.component.html',
  styleUrls: ['./market-place-categories.component.css']
})
export class MarketPlaceCategoriesComponent implements OnInit {

   marketPlaceCategory: MarketPlaceCategory = new MarketPlaceCategory();
   selectedMarketPlaceCategory : MarketPlaceCategory = new MarketPlaceCategory();
   loggedInUserId = 0;
   categoryPagination: Pagination = new Pagination();
   categorySortOption: SortOption = new SortOption();
   marketPlaceCategoryResponse: CustomResponse = new CustomResponse();
   customResponse: CustomResponse = new CustomResponse();
   isAddCategory = false;
   categoryNameErrorMessage = "";
   addCategoryLoader: HttpRequestLoader = new HttpRequestLoader();
   categoryModalTitle = "";
   categoyButtonSubmitText = "";

  constructor(public referenceService: ReferenceService, public httpRequestLoader: HttpRequestLoader,
    public utilService: UtilService, public authenticationService: AuthenticationService, public logger: XtremandLogger,
    public pagerService: PagerService, public landingPageService : LandingPageService)
    {
    this.loggedInUserId = this.authenticationService.getUserId();
    }

   ngOnInit() {
    this.categoryPagination = new Pagination();
    this.listMasterPlaceCategories(this.categoryPagination);
  }
 
   /***************Categories*************** */
  listMasterPlaceCategories(pagination: Pagination) {
      pagination.userId = this.loggedInUserId;
      this.referenceService.startLoader(this.httpRequestLoader);
      this.landingPageService.listMarketPlaceCategories(pagination)
        .subscribe(
          response => {
            this.referenceService.stopLoader(this.httpRequestLoader);
            const data = response.data;
            pagination.totalRecords = data.totalRecords;
            this.categorySortOption.totalRecords = data.totalRecords;
            $.each(data.categories, function (_index: number, marketPlaceCategory: any) {
              marketPlaceCategory.displayTime = new Date(marketPlaceCategory.createdDateInUTCString);
            });
            pagination = this.pagerService.getPagedItems(pagination, data.categories);
          },
          (error: any) => {
            this.customResponse = this.referenceService.showServerErrorResponse(this.httpRequestLoader);
          },
          () => this.logger.info('Finished listMasterLandingPageCategories()')
        );
  }
 
 getCategoryById(selectedCategory : MarketPlaceCategory){
    this.selectedMarketPlaceCategory = new MarketPlaceCategory();
    this.isAddCategory = false;
   // this.selectedMarketPlaceCategory = selectedCategory;
    this.marketPlaceCategory = new MarketPlaceCategory();
    this.marketPlaceCategory.id = selectedCategory.id;
    this.marketPlaceCategory.name = selectedCategory.name
    this.marketPlaceCategory.description = selectedCategory.description;
    this.categoryModalTitle = 'Update Category Details';
	this.categoyButtonSubmitText = "Update";
	$('#addCategoryModalPopup').modal('show');
 
 }
 
 confirmDeleteCategory(id:number){
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
        self.deleteCategoryById(id);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.logger.error(this.referenceService.errorPrepender + " confirmDeleteCategory():" + error);
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }
  
  deleteCategoryById(id: number){
  		this.landingPageService.deleteMarketPlaceCategory(id)
			.subscribe(
				(result: any) => {
					if (result.statusCode==200) {
						this.marketPlaceCategoryResponse = new CustomResponse('SUCCESS', result.message, true);
              			this.categoryPagination.pageIndex = 1;
              			 this.listMasterPlaceCategories(this.categoryPagination);
					}else if(result.statusCode == 400){
						this.marketPlaceCategoryResponse = new CustomResponse('ERROR', result.message, true);
          }
				},
				(error: string) => {
					this.referenceService.stopLoader(this.httpRequestLoader);
				});
  }
  
  
  setCategoryPage(event: any) {
    this.marketPlaceCategoryResponse = new CustomResponse();
    this.customResponse = new CustomResponse();
    this.categoryPagination.pageIndex = event.page;
    this.listMasterPlaceCategories(this.categoryPagination);
  }
  
  addCategory() {
		this.isAddCategory = true;
		this.marketPlaceCategory = new MarketPlaceCategory();
		this.categoryModalTitle = 'Enter Category Details';
		this.categoyButtonSubmitText = "Save";
		$('#addCategoryModalPopup').modal('show');
	}
	closeCategoryModal() {
	   this.referenceService.stopLoader(this.addCategoryLoader);
		$('#addCategoryModalPopup').modal('hide');
		this.marketPlaceCategory = new MarketPlaceCategory();
		this.marketPlaceCategoryResponse = new CustomResponse();
		this.isAddCategory = false;
	}

	saveOrUpdateCategory() {
	if(this.marketPlaceCategory.name && this.marketPlaceCategory.name.trim()){
		this.referenceService.startLoader(this.addCategoryLoader);
		this.marketPlaceCategory.loggedInUserId = this.loggedInUserId;
		this.landingPageService.saveOrUpdateCategory(this.marketPlaceCategory)
			.subscribe(
				(result: any) => {
					if (result.statusCode==200) {
						this.closeCategoryModal();
						this.marketPlaceCategoryResponse = new CustomResponse('SUCCESS', result.message, true);
						 this.categoryPagination = new Pagination();
                         this.listMasterPlaceCategories(this.categoryPagination);
					}else if (result.statusCode==401) {
					  this.referenceService.stopLoader(this.addCategoryLoader);
					  this.marketPlaceCategory.isValid = false;
					  this.categoryNameErrorMessage = result.message;
					}					
				},
				(error: string) => {
					this.referenceService.stopLoader(this.httpRequestLoader);
				});
		}else{
		        this.marketPlaceCategory.isValid = false;
				this.categoryNameErrorMessage = "category name is required";
	}
 }
  
  
  

}

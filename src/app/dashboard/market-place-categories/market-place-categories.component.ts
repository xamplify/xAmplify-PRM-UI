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
    public pagerService: PagerService)
    {
    this.loggedInUserId = this.authenticationService.getUserId();
    }

   ngOnInit() {
    this.categoryPagination = new Pagination();
    this.listMasterPlaceCategories(this.categoryPagination);
  }
 
   /***************Categories*************** */
  listMasterPlaceCategories(pagination: Pagination) {
      
  }
 
  getCategoryById(selectedCategory: MarketPlaceCategory, actionType: string) {
    this.selectedMarketPlaceCategory = new MarketPlaceCategory();
    // this.selectedMarketPlaceCategory = selectedCategory;
    this.marketPlaceCategory = new MarketPlaceCategory();
    this.marketPlaceCategory.name = selectedCategory.name
    this.marketPlaceCategory.description = selectedCategory.description;
    if (actionType == 'copy') {
      this.marketPlaceCategory.name += "_copy";
      this.isAddCategory = true;
      this.categoryModalTitle = 'Copy Category Details';
      this.categoyButtonSubmitText = "Save";
    } else {
      this.isAddCategory = false;
      this.categoryModalTitle = 'Update Category Details';
      this.categoyButtonSubmitText = "Update";
      this.marketPlaceCategory.id = selectedCategory.id;
    }
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
	
 }
  
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchMarketplaceCategories(); } }

  searchMarketplaceCategories() { this.listMasterPlaceCategories(this.categoryPagination); }

  sortBy(text: any) {
    const sortedValue = text.value;
    if (sortedValue !== '') {
      const options: string[] = sortedValue.split('-');
      this.categoryPagination.sortcolumn = options[0];
      this.categoryPagination.sortingOrder = options[1];
    } else {
      this.categoryPagination.sortcolumn = null;
      this.categoryPagination.sortingOrder = null;
    }
    this.listMasterPlaceCategories(this.categoryPagination)
  }

}

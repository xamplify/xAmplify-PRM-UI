import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from 'app/dashboard/models/category';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { UserService } from 'app/core/services/user.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $: any;

@Component({
  selector: 'app-add-folder-modal-popup',
  templateUrl: './add-folder-modal-popup.component.html',
  styleUrls: ['./add-folder-modal-popup.component.css'],
  providers:[HttpRequestLoader]
})
export class AddFolderModalPopupComponent implements OnInit {
  categoryNameErrorMessage = "";
  requiredMessage = "Required";
  duplicateLabelMessage = "Already exists";
  loader: HttpRequestLoader = new HttpRequestLoader();
  category: Category = new Category();
  existingCategoryNames: any;
  formErrorClass = "form-group form-error";
  defaultFormClass = "form-group";
  loggedInUserId: number;
  existingCategoryName: any;
  @Output() notifyChild = new EventEmitter();
  constructor(public userService: UserService, public authenticationService: AuthenticationService,
    public logger: XtremandLogger, public referenceService: ReferenceService) { }

  ngOnInit() {
    
  }

  openPopup(){
    this.loggedInUserId = this.authenticationService.getUserId();
    this.listExistingCategoryNames();
  }



  listExistingCategoryNames() {
    this.userService.listExistingCategoryNames(this.referenceService.companyId)
        .subscribe(
            data => {
                 this.existingCategoryNames = data.data.map((a: { name: any; }) => a.name);
                 $('#createFolderPopup').modal('show');
                 this.category.isValid = false;
            },
            error => {
                this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
                $('#createFolderPopup').modal('hide');
            },
            () => {
                this.logger.info("Finished listExistingCategoryNames()");
            }
        );
}


validateCategoryNames(name: string) {
  if ($.trim(name).length > 0) {
      if (this.existingCategoryNames.indexOf($.trim(name).toLowerCase()) > -1 && 
      $.trim(name).toLowerCase() != this.existingCategoryName) {
          this.addCategoryNameErrorMessage(this.duplicateLabelMessage);
      } else {
          this.removeCategoryNameErrorClass();
      }
  } else {
      this.addCategoryNameErrorMessage(this.requiredMessage);
  }
}

addCategoryNameErrorMessage(errorMessage: string) {
  this.category.isValid = false;
  $('#categoryNameDiv').addClass(this.formErrorClass);
  this.categoryNameErrorMessage = errorMessage;
}

removeCategoryNameErrorClass() {
  $('#categoryNameDiv').removeClass(this.formErrorClass);
  $('#categoryNameDiv').addClass(this.defaultFormClass);
  this.category.isValid = true;
  this.categoryNameErrorMessage = "";

}

sumbitOnEnter(event: any) {
  if (event.keyCode == 13 && this.category.isValid) {
      this.saveOrUpdateCategory();
  }
}

saveOrUpdateCategory() {
  this.referenceService.startLoader(this.loader);
  this.category.createdUserId = this.loggedInUserId;
  this.userService.saveOrUpdateCategory(this.category)
      .subscribe(
          (result: any) => {
              this.referenceService.stopLoader(this.loader);
              this.closePopup();
              this.notifyChild.emit(result.message);
          },
          (error: string) => {
              this.referenceService.stopLoader(this.loader);
              let statusCode = JSON.parse(error['status']);
              if (statusCode == 409) {
                  this.addCategoryNameErrorMessage(this.duplicateLabelMessage);
              } else {
                  this.referenceService.showSweetAlertErrorMessage(this.referenceService.serverErrorMessage);
              }
          });

}

closePopup() {
  $('#createFolderPopup').modal('hide');
  this.referenceService.stopLoader(this.loader);
  this.category = new Category();
  this.removeCategoryNameErrorClass();
}




}

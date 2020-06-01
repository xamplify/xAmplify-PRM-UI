import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';
import {AddFolderModalPopupComponent} from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { CustomResponse } from 'app/common/models/custom-response';
@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css']
})
export class DesignComponent implements OnInit {
    isLoading:boolean = true;
    emailTemplate:boolean = false;
    form:boolean = false;
    landingPage:boolean = false;
    landingPageDescription:string = "";
    @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
    customResponse:CustomResponse = new CustomResponse();
  constructor(public logger: XtremandLogger,public authenticationService: AuthenticationService) {
   }

  ngOnInit() {
      this.landingPageDescription = "Create custom  pages with xAmplify that convert more visitors than any other website.";
      this.getModuleAccess();
  }
  
  getModuleAccess(){
      this.authenticationService.getModulesByUserId()
      .subscribe(
          data => {
              let response = data.data;
              let statusCode = data.statusCode;
              if(statusCode==200){
                  this.emailTemplate = response.emailTemplate;
                  this.form = response.form;
                  this.landingPage = response.landingPage;
                  if(!this.emailTemplate && !this.form && !this.landingPage){
                      this.authenticationService.forceToLogout();
                  }
              }
              this.isLoading = false;
          },
          error => {
              this.logger.errorPage(error);
          },
          () => this.logger.info("Finished getModuleAccess()")
      );
  }
  openCreateFolderPopup(){
      this.addFolderModalPopupComponent.openPopup();
  }

  showSuccessMessage(message:any){
    this.customResponse = new CustomResponse('SUCCESS',message, true);
  }
}

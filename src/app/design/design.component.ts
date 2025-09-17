import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';
import {AddFolderModalPopupComponent} from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { LmsService } from 'app/lms/services/lms.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.css'],
  providers: [ LmsService]
})
export class DesignComponent implements OnInit {
    isLoading:boolean = false;
    emailTemplate:boolean = false;
    form:boolean = false;
    landingPage:boolean = false;
    landingPageDescription:string = "";
    searchWithModuleName:any;
    @ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
    customResponse:CustomResponse = new CustomResponse();
    constructor(public logger: XtremandLogger,public authenticationService: AuthenticationService,
      public referenceService:ReferenceService, public lmsService: LmsService) {
     }

    ngOnInit() {
      this.searchWithModuleName = 6;
      this.landingPageDescription = "Create custom pages with xAmplify that convert more visitors than any other website.";
      this.getModuleAccess();
      this.checkAWSCredentials();
    }
  
  getModuleAccess(){
      this.isLoading = true;
      this.authenticationService.getModulesByUserId()
      .subscribe(
          data => {
              let response = data.data;
              let statusCode = data.statusCode;
              if(statusCode==200){
                  this.emailTemplate = response.emailTemplate;
                  this.form = response.form || this.authenticationService.module.isPrmTeamMember;
                  this.landingPage = response.landingPage;
              }
              this.isLoading = false;
          },
          error => {
            this.isLoading = false;
            this.logger.errorPage(error);
          });
  }
  openCreateFolderPopup(){
      this.addFolderModalPopupComponent.openPopup();
  }

  showSuccessMessage(message:any){
    this.customResponse = new CustomResponse('SUCCESS',message, true);
  }

 
  checkAWSCredentials() {
      this.isLoading = true;
      this.lmsService.checkAWSCredentials().subscribe(
        (response: any) => {
          this.isLoading = false;
          if (response.statusCode == 200 && response.data == false) {
            this.referenceService.showAlertForAWSAccess();
          }
        },
        (_error: any) => {
          this.isLoading = false;
        }, () => {
          this.isLoading = false;
        }
      );
    }
}

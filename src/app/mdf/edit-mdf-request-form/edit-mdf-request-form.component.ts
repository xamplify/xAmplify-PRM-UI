import { Component, OnInit } from '@angular/core';
import { ReferenceService } from "app/core/services/reference.service";
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { MdfService } from '../services/mdf.service';
import { AuthenticationService } from '../../core/services/authentication.service';
@Component({
  selector: 'app-edit-mdf-request-form',
  templateUrl: './edit-mdf-request-form.component.html',
  styleUrls: ['./edit-mdf-request-form.component.css']
})
export class EditMdfRequestFormComponent implements OnInit {
  loading = false;
  loggedInUserId: number=0;
  loggedInUserCompanyId: number = 0;
  formLoaded = false;
  selectedForm:any;
  constructor(public authenticationService: AuthenticationService,public referenceService:ReferenceService,public xtremandLogger:XtremandLogger,private mdfService:MdfService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.loading = true;
    this.getCompanyId();
  }

  getCompanyId() {
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        if (result !== "") { 
          this.loggedInUserCompanyId = result;
        }else{
          this.loading = false;
          this.referenceService.showSweetAlertErrorMessage('Company Id Not Found');
          this.referenceService.goToRouter("/home/dashboard");
        }
      }, (error: any) => {
         this.loading = false;
         this.xtremandLogger.log(error);
         this.xtremandLogger.errorPage(error);
         },
      () => {
        if(this.loggedInUserCompanyId!=undefined && this.loggedInUserCompanyId>0){
          this.getMdfFormByCompanyId();
        }
      }
    );
  }

  getMdfFormByCompanyId(){
    this.mdfService.getMdfRequestForm(this.loggedInUserCompanyId).
    subscribe((result: any) => {
      this.loading = false;
      if(result.statusCode==200){
        this.formLoaded = true;
        this.selectedForm = result.data;
      }else{
        this.goToManageMdfDetails();
        this.referenceService.showSweetAlertErrorMessage('MDF Form Not Found.Please Contact Admin');
      }
    }, error => {
      this.loading = true;
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    },
    () => {
    }
    );
  }

  goToManageMdfDetails(){
    this.loading = true;
    this.referenceService.goToRouter("/home/mdf/details");
  }

  goToSelectMdfPage(){
    this.loading = true;
    this.referenceService.goToRouter('/home/mdf/select');
  }


}

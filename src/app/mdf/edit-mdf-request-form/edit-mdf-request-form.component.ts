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
  loggedInUserId: number = 0;
  loggedInUserCompanyId: number = 0;
  formLoaded = false;
  selectedForm: any;
  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger, private mdfService: MdfService) {
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
        } else {
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
        if (this.loggedInUserCompanyId != undefined && this.loggedInUserCompanyId > 0) {
          this.getMdfFormByCompanyId();
        }
      }
    );
  }

  getMdfFormByCompanyId() {
    let isMdfFoundExists = false;
    this.mdfService.getMdfRequestForm(this.loggedInUserCompanyId).
      subscribe((result: any) => {
        isMdfFoundExists = result.statusCode == 200;
        if (isMdfFoundExists) {
          this.formLoaded = true;
          this.selectedForm = result.data;
          this.loading = false;
        }
      }, error => {
        this.loading = true;
        this.xtremandLogger.log(error);
        this.xtremandLogger.errorPage(error);
      },
        () => {
          if (!isMdfFoundExists) {
             this.loading = true;
            this.mdfService.saveMdfRequestForm(this.authenticationService.getUserName(), this.authenticationService.companyProfileName).subscribe((result: any) => {
              if (result.access) {
                if (result.statusCode === 100) {
                  console.log("Mdf Form already exists");
                }else{
                  this.referenceService.showSweetAlertSuccessMessage('MDF Request Form Created Successfully');
                   this.loading = false;
                  this.referenceService.goToRouter("/home/mdf/form");
                }
              }
            }, (error: string) => {
              this.loading = false;
              this.goToManageMdfDetails();
              this.referenceService.showSweetAlertErrorMessage('MDF Form Not Found.Please Contact Admin');
            });
          }

        }
      );
  }

  goToManageMdfDetails() {
    this.loading = true;
    this.referenceService.goToRouter("/home/mdf/details");
  }

  goToSelectMdfPage() {
    this.loading = true;
    this.referenceService.goToRouter('/home/mdf/select');
  }


}

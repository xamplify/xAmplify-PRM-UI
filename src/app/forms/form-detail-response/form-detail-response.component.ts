import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { FormService } from '../services/form.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';

@Component({
  selector: 'app-form-detail-response',
  templateUrl: './form-detail-response.component.html',
  styleUrls: ['./form-detail-response.component.css'],
  providers: [HttpRequestLoader, FormService]
})
export class FormDetailResponseComponent implements OnInit {

  @Input() formSubmitId: any;
  geoLocationDetails: any;
  questionAndAnswers: any;
  @Output() notifyClose = new EventEmitter();
  loggedInUser: number;

  constructor(public referenceService: ReferenceService,
    public authenticationService: AuthenticationService, public formService: FormService,
    public httpRequestLoader: HttpRequestLoader, public logger: XtremandLogger) { }

  ngOnInit() {
    this.getDetailedResponse();
  }

  getDetailedResponse() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.formService.getDetailedResponse(this.formSubmitId).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          this.geoLocationDetails = data.geoLocationAnalytics;
          this.questionAndAnswers = data.questionAndAnswers;
        } else {
          this.referenceService.goToPageNotFound();
        }
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => { this.logger.errorPage(error); });
  }

  closeDetailedResponse() {
    this.notifyClose.emit(); 
  }
  
  /***** XNFR-467 *****/
  downloadCsv(){
    this.loggedInUser = this.authenticationService.getUserId();
    this.formService.downloadCsv(this.formSubmitId)
    .subscribe(
      response => {
          this.downloadFile(response, "Survey-Data", this.loggedInUser);
        },
      (error: any) => { this.logger.errorPage(error); 
      });
  }

  downloadFile(data: any, selectedleadType: any, name: any) {
    let parsedResponse = data.text();
    let blob = new Blob([parsedResponse], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, 'UserList.csv');
    } else {
      let a = document.createElement('a');
      a.href = url;
      a.download = selectedleadType + "_" + name + ' List.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }
     
}

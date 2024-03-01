import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { FormService } from '../services/form.service';
declare var Highcharts: any, $;



@Component({
  selector: 'app-survey-analytics',
  templateUrl: './survey-analytics.component.html',
  styleUrls: ['./survey-analytics.component.css'],
  providers: [HttpRequestLoader, FormService]
})
export class SurveyAnalyticsComponent implements OnInit {

  alias: string = "";
  surveyAnalytics: any;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>Response Percentage: <b>{point.percentage:.2f}%</b><br/>Response Count: <b>{point.z}</b><br/>';
  showTab = "question-summarries";
  selectedFormSubmitId: number;
  detailedResponse = false;
  campaignId: any;
  partnerId: any;
  routerLink: string;
  campaignAlias: string;  
  loggedInUser: any;

  constructor(public referenceService: ReferenceService, private route: ActivatedRoute,
    public authenticationService: AuthenticationService, public router: Router,
    public formService: FormService, public logger: XtremandLogger) { }

  ngOnInit() {
    this.alias = this.route.snapshot.params['alias'];
    this.campaignId = this.route.snapshot.params['campaignId'];
    this.partnerId = this.route.snapshot.params['partnerId'];
    if(this.campaignId != undefined && this.campaignId > 0){      
      if(this.partnerId != undefined && this.partnerId > 0){
          this.routerLink = "/home/forms/csf/" + this.campaignId+"/"+this.partnerId;
      }else{
          this.routerLink = "/home/forms/csf/" + this.campaignId;
      }
    } else{
      this.routerLink = "/home/forms/manage";
    }

    this.getSurveyAnalytics();
  }

  getSurveyAnalytics() {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.formService.getSurveyAnalytics(this.alias, this.campaignId, this.partnerId).subscribe(
      (response: any) => {
          const data = response.data;          
          if (response.statusCode == 200) {
            this.surveyAnalytics = data;  
            let self = this;           
            let questionSummaries = this.surveyAnalytics.questionSummaries;
            questionSummaries.forEach(function(questionSummary: any){  
              if (questionSummary.choiceSummaries != undefined && questionSummary.choiceSummaries != null 
                && questionSummary.choiceSummaries.length > 0) {
                  let pieChartInputMap = new Map();
              pieChartInputMap.set("pointFormat", self.pointFormat);
              pieChartInputMap.set("title", '');

              let pieChartData = new Array;
              let choiceSummaries = questionSummary.choiceSummaries;  
              choiceSummaries.forEach(function(choiceSummary: any){
                let dataEntry = {name: choiceSummary.choice, y: choiceSummary.responsePercentage, z: choiceSummary.responseCount}
                pieChartData.push(dataEntry);
              });
              pieChartInputMap.set("data", pieChartData);
              questionSummary.pieChartInputMap = pieChartInputMap;
              }              
            });     
          } else {
              this.referenceService.goToPageNotFound();
          }
          this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => { this.logger.errorPage(error); });
  }

  toggleCollapse(questionSummary: any) {
    questionSummary.collapse = !questionSummary.collapse;
  }

  showIndividualResponses() {
    this.showTab = "individual-responses";
    this.detailedResponse = false;
  }

  showQuestionSummaries() {
    this.showTab = "question-summarries";
    this.detailedResponse = false;
  }

  viewDetailedResponse(formSubmitId: any) {
    this.selectedFormSubmitId = formSubmitId;
    this.detailedResponse = true;
  }
  
/***** XNFR-467 *****/
downloadCsv(){
  this.loggedInUser = this.authenticationService.getUserId();
  this.formService.downloadCsvFile(this.alias)
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

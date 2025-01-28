import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';

@Component({
  selector: 'app-campaign-mdf-analytics',
  templateUrl: './campaign-mdf-analytics.component.html',
  styleUrls: ['./campaign-mdf-analytics.component.css'],
  providers: [Processor,Properties]
})
export class CampaignMdfAnalyticsComponent implements OnInit {
  alias: any;
  statusCode = 404;
  customResponse: CustomResponse = new CustomResponse();
  success = false;
  apiResponseFinished = false;
  campaignDetails:any;
  campaignReport:any;
  isOpportunitiesModuleEnabled = false;
  requestAccountButtonClicked = false;
  requestAccountButtonText = "Request an Account";
  constructor(private route: ActivatedRoute,private authenticationService:AuthenticationService,
    private referenceService:ReferenceService,private logger:XtremandLogger,
    public processor:Processor,public properties:Properties) { }

  ngOnInit() {
    this.processor.set(this.processor);
    this.alias = this.route.snapshot.params['mdfAlias'];
    this.getCampaignDetails();
  }


  private getCampaignDetails() {
    this.authenticationService.getMdfCampaignDetails(this.alias).subscribe(
      response => {
        this.statusCode = response.statusCode;
        if(this.statusCode==200){
          this.success = true;
          this.campaignReport = response.data;
          let map = response.map['campaignMdfDetails'];
          this.campaignDetails = map;
          this.isOpportunitiesModuleEnabled = response.map['opportunitiesAccessEnabled'];
        }else{
          if(this.statusCode==403){
            this.statusCode = 404;
          }
          this.customResponse = new CustomResponse('ERROR',this.properties.pageNotFound,true);
        }
        this.apiResponseFinished = true;
        this.processor.remove(this.processor);
      }, error => {
        this.statusCode = JSON.parse(error["status"]);
        let message = this.properties.serverErrorMessage;
        if (this.statusCode == 403) {
          this.statusCode = 404;
          let errorResponse = JSON.parse(error['_body']);
          message = errorResponse['message'];
        }
        this.customResponse = new CustomResponse('ERROR', message, true);
        this.apiResponseFinished = true;
        this.processor.remove(this.processor);
      });
  }

  previewTemplate(){
   this.referenceService.openWindowInNewTab("/funding-request/"+this.alias+"/preview");
  }

  requestAccount(){
    this.requestAccountButtonClicked = true;
    this.requestAccountButtonText = "Please Wait...";
    let campaignMdfRequestAccountDto= {};
    campaignMdfRequestAccountDto['mdfAlias'] = this.alias;
    this.authenticationService.requestAccount(campaignMdfRequestAccountDto).subscribe(
      response => {
        this.referenceService.showSweetAlertSuccessMessage("Your account request has been submitted successfully");
        this.requestAccountButtonClicked = false;
        this.requestAccountButtonText = "Request an Account";
      }, error => {
        this.requestAccountButtonClicked = false;
        this.requestAccountButtonText = "Request an Account";
       this.referenceService.showSweetAlertServerErrorMessage();
      });
  }
}

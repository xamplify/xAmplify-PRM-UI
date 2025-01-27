import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Processor } from '../../core/models/processor';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';

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
        console.log(response);
        this.success = true;
        let map = response.map['campaignMdfDetails'];
        this.campaignDetails = map;
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
}

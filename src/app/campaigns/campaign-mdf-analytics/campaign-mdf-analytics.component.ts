import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Processor } from '../../core/models/processor';
import { Properties } from 'app/common/models/properties';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';

@Component({
  selector: 'app-campaign-mdf-analytics',
  templateUrl: './campaign-mdf-analytics.component.html',
  styleUrls: ['./campaign-mdf-analytics.component.css'],
  providers: [Processor,Properties]
})
export class CampaignMdfAnalyticsComponent implements OnInit {
  alias: any;
  statusCode = 404;
  success = false;
  apiResponseFinished = false;
  campaignDetails:any;
  campaignReport:any;
  isOpportunitiesModuleEnabled = false;
  requestAccountButtonClicked = false;
  requestAccountButtonText = "Request an Account";
  companyLogoPath = "";
  emailAddress = "";
  videoFile: SaveVideoFile = new SaveVideoFile();
  constructor(private route: ActivatedRoute,private authenticationService:AuthenticationService,
    private referenceService:ReferenceService,private logger:XtremandLogger,
    public processor:Processor,public properties:Properties,public vanityURLService:VanityURLService) { }

  ngOnInit() {
    this.processor.set(this.processor);
    
    this.alias = this.route.snapshot.params['mdfAlias'];
    if(this.vanityURLService.isVanityURLEnabled()){
      this.vanityURLService.checkVanityURLDetails();
    }
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
          this.companyLogoPath = this.authenticationService.MEDIA_URL+response.map['companyLogoPath'];
          this.emailAddress = this.campaignDetails.emailAddress;
          this.videoFile = response.map['campaignVideoFile'];
        }else{
          if(this.statusCode==403){
            this.statusCode = 404;
          }
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
        this.apiResponseFinished = true;
        this.processor.remove(this.processor);
      });
  }

  previewTemplate(){
   this.referenceService.openWindowInNewTab("/funding-request/"+this.alias+"/preview");
  }

  
}

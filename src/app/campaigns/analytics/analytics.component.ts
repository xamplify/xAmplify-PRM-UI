import { ReferenceService } from './../../core/services/reference.service';
import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CampaignService } from '../services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css', './timeline.css'],
  providers: [HttpRequestLoader]
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  @Input() campaignId:any;
  @Input() campaignTitle:any;
  campaignName:string = "";
  notifyPartners = false;
  loader:HttpRequestLoader = new HttpRequestLoader();
  oneClickLaunchChannelCampaign = false;
  constructor(private route: ActivatedRoute,public campaignService:CampaignService,public authenticationService:AuthenticationService,
    public xtremandLogger:XtremandLogger,public referenceService:ReferenceService){

  }

  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    this.referenceService.loading(this.loader, true);
    this.campaignId = this.referenceService.decodePathVariable(this.route.snapshot.params['campaignId']);
    this.campaignTitle = this.route.snapshot.params['campaignTitle'];
    this.campaignService.isOneClickLaunchChannelCampaign(this.campaignId).
    subscribe(
        response=>{
          this.oneClickLaunchChannelCampaign = response.data;
          let map = response.map;
          this.campaignName = map['campaignName'];
          this.notifyPartners = map['notifyPartners'];
          this.referenceService.loading(this.loader, false);
        },error=>{
          this.xtremandLogger.errorPage(error);
        }
    );

   
  }
  

}

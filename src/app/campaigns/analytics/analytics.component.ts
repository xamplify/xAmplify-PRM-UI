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
  statusCode = 0;
  constructor(private route: ActivatedRoute,public campaignService:CampaignService,public authenticationService:AuthenticationService,
    public xtremandLogger:XtremandLogger,public referenceService:ReferenceService){

  }

  ngOnDestroy(): void {
    
  }
  ngOnInit(): void {
    this.referenceService.loading(this.loader, true);
    this.campaignId = this.referenceService.decodePathVariable(this.route.snapshot.params['campaignId']);
    this.campaignTitle = this.route.snapshot.params['campaignTitle'];
    if(this.campaignTitle!=undefined && this.campaignTitle.length>0){
      this.campaignService.validateCampaignIdAndCampaignTitle(this.campaignId,this.campaignTitle).subscribe(
        response=>{
            this.statusCode = response.statusCode;
        },error=>{
          this.xtremandLogger.errorPage(error);
        },()=>{
          if(this.statusCode==200){
            this.isOneClickLaunchCampaign();
          }else{
            this.referenceService.goToPageNotFound();
          }
        }
      );
    }else{
      this.isOneClickLaunchCampaign();
    }
 
   
  }

  isOneClickLaunchCampaign(){
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

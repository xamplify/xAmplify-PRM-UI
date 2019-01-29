import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { UtilService } from '../../core/services/util.service';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { DealRegistrationService } from '../services/deal-registration.service';
import { Campaign } from '../../campaigns/models/campaign';
import { DealRegistration } from '../models/deal-registraton';
import { User } from '../../core/models/user';
declare var $, Highcharts: any;
@Component({
  selector: 'app-deal-analytics',
  templateUrl: './deal-analytics.component.html',
  styleUrls: ['../../campaigns/analytics/analytics.component.css']
})
export class DealAnalyticsComponent implements OnInit {
  
  isTimeLineView: boolean;
  selectedRow: any;

campaign: Campaign;

campaignViewsPagination: Pagination = new Pagination();


campaignType: string;
campaignId: number;
maxViewsValue: number;
barChartCliked = false;


paginationType:string;

loading =false;
mainLoader = false;

sortByDropDown = [
                  { 'name': 'Sort By', 'value': '' },
                  { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
                  { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
                  { 'name': 'Time(ASC)', 'value': 'time-ASC' },
                  { 'name': 'Time(DESC)', 'value': 'time-DESC' }
              ];
public selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length-1];
dealButtonText="View Deal";
isDealRegistration = false;
  @Input()
  dealId: any;
  deal: DealRegistration;
  user: User;
  @Output() isDealAnalytics = new EventEmitter<any>();
  dealStatus: any;
  lead: User;
constructor(private route: ActivatedRoute, private campaignService: CampaignService, private utilService: UtilService, 
  public authenticationService: AuthenticationService,
  public referenceService: ReferenceService,  public xtremandLogger:XtremandLogger,private dealRegService:DealRegistrationService) {
     
}
showTimeline() {
  this.isTimeLineView = !this.isTimeLineView;
}
  ngOnInit() {
    //this.dealId = this.route.snapshot.params['id'];
    this.dealRegService.getDealById(this.dealId).subscribe(deal => {
      this.deal = deal.data;
      const obj = { 'campaignId': this.deal.campaignId };
      this.campaignService.getCampaignById(obj).subscribe(campaign=>{
        this.campaign = campaign;
        this.campaignType =  this.campaign.campaignType.toLocaleString();
        this.campaignId = this.campaign.campaignId;
        console.log(this.campaign)
      })
      this.dealRegService.getDealCreatedBy(this.deal.createdBy).subscribe(user=>{
        this.user = user;
        
      })
      this.dealRegService.getDealCreatedBy(this.deal.leadId).subscribe(lead=>{
        this.lead = lead;
        console.log(this.lead)
        
      })
      this.dealRegService.getDealStatus(this.deal.id).subscribe(dealStatus=>{
        this.dealStatus = dealStatus;
       
      })
    
    })
    
  }

 
  showDealRegistrationForm(){
    this.isDealRegistration = !this.isDealRegistration;
}

showTimeLineView(){
    this.isDealRegistration = false;
    this.isTimeLineView = true;
    //this.getDealState(this.selectedRow);
}

resetTopNavBarValue(isDealAnalytics){
  this.isDealAnalytics.emit(isDealAnalytics);
}
  getDealState(selectedRow: any): any
  {
    throw new Error("Method not implemented.");
  }

}

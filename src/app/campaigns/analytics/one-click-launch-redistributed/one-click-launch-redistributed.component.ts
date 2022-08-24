import { Component, OnInit,Input } from '@angular/core';
import { HttpRequestLoader } from './../../../core/models/http-request-loader';
import { ReferenceService } from './../../../core/services/reference.service';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { PagerService } from './../../../core/services/pager.service';

@Component({
  selector: 'app-one-click-launch-redistributed',
  templateUrl: './one-click-launch-redistributed.component.html',
  styleUrls: ['./one-click-launch-redistributed.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties, SortOption]
})
export class OneClickLaunchRedistributedComponent implements OnInit {

  @Input() campaignId = 0;
  @Input() hideDiv = false;
  redistributedCount = 0;
  redistributedCampaignId = 0;
  loader = false;
  pagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  constructor(public referenceService:ReferenceService,public authenticationService:AuthenticationService,public campaignService:CampaignService,
    public xtremandLogger:XtremandLogger,public pagerService:PagerService,public sortOption: SortOption) { }

  ngOnInit() {
    this.loader = true;
    this.pagination.campaignId = this.campaignId;
    this.getRedistributedCount();
  }

  getRedistributedCount(){
    this.campaignService.getRedistributedCount(this.campaignId).subscribe(
      (response) => {
        let map = response.data;
        this.redistributedCount = map['redistributedCount'];
        this.redistributedCampaignId = map['redistributedCampaignId'];
        this.loader = false;
      },
      (error) => {
        this.xtremandLogger.errorPage(error);
      },()=>{
        if(this.redistributedCount>1){
          this.findRedistributedCampaigns(this.pagination);
          
        }
      }
    );
  }

  findRedistributedCampaigns(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.campaignService
      .findOneClickLaunchRedistributedCampaigns(this.pagination)
      .subscribe(
        (response) => {
          const data = response.data;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        (error) => {
          this.xtremandLogger.errorPage(error);
        }
      );
  }

  setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.findRedistributedCampaigns(this.pagination);
	}

  search() {
		this.pagination.pageIndex = 1;
		this.findRedistributedCampaigns(this.pagination);
	}

	eventHandler(keyCode: any) { if (keyCode === 13) { this.search(); } }
  
  showCampaignAnalytics(campaign:any){
		this.pagination.pagedItems.forEach((element) => {
			let campaignId = element.campaignId;
			let selectedCampaignId = campaign.campaignId;
			if (selectedCampaignId != campaignId) {
				element.expand = false;
			}
		});
		campaign.expand = !campaign.expand;
	}
}



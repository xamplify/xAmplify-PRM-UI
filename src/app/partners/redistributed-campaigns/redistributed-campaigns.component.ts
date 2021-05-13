import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { UtilService } from '../../core/services/util.service';
declare var $:any;
@Component({
  selector: 'app-redistributed-campaigns',
  templateUrl: './redistributed-campaigns.component.html',
  styleUrls: ['./redistributed-campaigns.component.css'],
  providers: [Pagination,HttpRequestLoader,SortOption]
})
export class RedistributedCampaignsComponent implements OnInit {

  @Input()selectedIndex:number;
  channelCampaignsPagination:Pagination = new Pagination();
  redistributedCampaignsPagination:Pagination = new Pagination();
  channelCampaignsLoader:HttpRequestLoader = new HttpRequestLoader();
  redistributedCampaignsLoader:HttpRequestLoader = new HttpRequestLoader();
  constructor(public router: Router, public authenticationService: AuthenticationService,
    public referenceService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
    public homeComponent: HomeComponent,public xtremandLogger:XtremandLogger,public campaignService:CampaignService,
    public channelCampaignsSortOption:SortOption,public redistributedSortOption:SortOption,
    public utilService: UtilService) { }

  ngOnInit() {
    this.findChannelCampaigns(this.channelCampaignsPagination);
  }

  findChannelCampaigns(pagination:Pagination){
    this.referenceService.goToTop();
    this.referenceService.loading( this.channelCampaignsLoader, true );
    this.parterService.findChannelCampaigns(pagination ).subscribe(
      ( response: any ) => {
          let data  = response.data;
          $.each(data.list,function(_index:number,campaign:any){
              campaign.launchedOn = new Date(campaign.launchTimeInUTCString);
          });
          this.channelCampaignsSortOption.totalRecords = data.totalRecords;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.referenceService.loading( this.channelCampaignsLoader, false );
      },
      (error: any ) => { 
        this.xtremandLogger.error(error);
        
       });
  }

  searchInCampaignsOnKeyPress(keyCode: any,type:string) { 
    if (keyCode === 13) { 
        this.searchCampaigns(type);
     }
    
  }

  searchCampaigns(type:string){
    if(type=="channel-campaigns"){
      this.getAllFilteredResults(type, this.channelCampaignsPagination, this.channelCampaignsSortOption);
    }else{
      this.getAllFilteredResults("partnerCompanies", this.redistributedCampaignsPagination, this.redistributedSortOption);
    }
  }

  sortChannelCampaigns(text:any){
    this.channelCampaignsSortOption.selectedChannelCampaignSortDropDownOption = text;
    this.getAllFilteredResults("channel-campaigns", this.channelCampaignsPagination, this.channelCampaignsSortOption);
  }

  getAllFilteredResults(type: string, pagination: Pagination, sortOption: SortOption) {
		pagination.pageIndex = 1;
		pagination.searchKey = sortOption.searchKey;
		if (type == "channel-campaigns") {
			pagination = this.utilService.sortOptionValues(sortOption.selectedChannelCampaignSortDropDownOption, pagination);
			this.findChannelCampaigns(pagination);
		} else{
			this.findRedistributedCampaigns(pagination);
		}
	}


  navigateBetweenPageNumbers(event:any,type:string){
    if(type=="channel-campaigns"){
      this.channelCampaignsPagination.pageIndex = event.page;
      this.findChannelCampaigns(this.channelCampaignsPagination);
    }
    
  }

  showRedistributedCampaings(campaign:any){
    this.referenceService.loading(this.redistributedCampaignsLoader, false);
    this.redistributedCampaignsPagination = new Pagination();
    this.channelCampaignsPagination.pagedItems.forEach((element) => {
      let campaignId = element.campaignId;
      let clickedCampaignId = campaign.campaignId;
      if(clickedCampaignId!=campaignId){
          element.expand =false;
      }
  });
  campaign.expand = !campaign.expand;
  if(campaign.expand){
    this.referenceService.loading(this.redistributedCampaignsLoader, true);
    this.redistributedCampaignsPagination.campaignId = campaign.campaignId;
    this.findRedistributedCampaigns(this.redistributedCampaignsPagination);
  }

  }

  findRedistributedCampaigns(pagination:Pagination){
    this.parterService.findRedistributedCampaigns(pagination).subscribe(
      ( response: any ) => {
          let data  = response.data;
          $.each(data.list,function(_index:number,campaign:any){
              campaign.launchedOn = new Date(campaign.launchTimeInUTCString);
          });
          this.redistributedSortOption.totalRecords = data.totalRecords;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          this.referenceService.loading(this.redistributedCampaignsLoader, false);
      },
      (error: any ) => { 
        this.xtremandLogger.error(error);
       });
  }

}

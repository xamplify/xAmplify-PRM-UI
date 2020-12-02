import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { ParterService } from '../../../partners/services/parter.service';
import { Pagination } from '../../../core/models/pagination';
import { PagerService } from '../../../core/services/pager.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';
import { SortOption } from '../../../core/models/sort-option';
import { ReferenceService } from '../../../core/services/reference.service';
declare var $:any;
@Component({
  selector: 'app-re-distributed',
  templateUrl: './re-distributed.component.html',
  styleUrls: ['./re-distributed.component.css'],
  providers: [Pagination,HttpRequestLoader,SortOption]
})
export class ReDistributedComponent implements OnInit {

   campaignId:number = 0;
    pagination: Pagination = new Pagination();
    searchKey:string = "";
   constructor(public route: ActivatedRoute,public partnerService:ParterService,public referenceService:ReferenceService,
          public httpRequestLoader:HttpRequestLoader,public pagerService:PagerService,public authenticationService:AuthenticationService,public router: Router) { }

  ngOnInit() {
      this.campaignId = this.route.snapshot.params['campaignId'];
      this.listRedistributedCampaigns();
  }

  listRedistributedCampaigns(){
      this.referenceService.loading(this.httpRequestLoader, true );
      this.partnerService.listRedistributedCampaigns(this.campaignId,this.pagination).subscribe(
          ( response: any ) => {
              let data  = response.data;
              this.pagination.totalRecords = data.totalRecords;
              $.each(data.redistributedCampaigns, function (_index:number, campaign) {
                campaign.displayTime = new Date(campaign.redistributedUtcString);
            });
              this.pagination = this.pagerService.getPagedItems( this.pagination, data.redistributedCampaigns);
              this.referenceService.loading(this.httpRequestLoader, false );
          },
          ( error: any ) => { console.log( 'error got here' ) });
  }

  paginationDropdown(event) {
      this.listRedistributedCampaigns();
    }

  setPage(event) {
      this.pagination.pageIndex = event.page;
      this.listRedistributedCampaigns();


  }

  searchInListRedistributedThroughPartnerCampaign(){
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.searchKey;
      this.listRedistributedCampaigns();
  }
  goToCampaignAnalytics(campaign){
      this.referenceService.campaignType = campaign.campaignType;
      this.router.navigate(["/home/campaigns/"+campaign.campaignId+"/details"]);
  }

  partnerCampaignUISearch(keyCode: any) {  if (keyCode === 13) {  this.searchInListRedistributedThroughPartnerCampaign(); } }
}

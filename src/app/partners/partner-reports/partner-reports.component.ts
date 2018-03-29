import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
declare var $:any;

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partner-reports.component.html',
  styleUrls: ['./partner-reports.component.css'],
  providers: [Pagination]
})
export class PartnerReportsComponent implements OnInit {
  worldMapdataReport: any;
  companyId: number;
  paginationType: string;
  campaignId:number;
  campaignsCount: number;
  regularCampaign:number;
  socialCampaign:number;
  videoCampaign:number;
  noOfCampaignsLaunchedByPartner = [];
  partnerUserInteraction = [];
  campaignInteractionPagination: Pagination = new Pagination();
  constructor(public router: Router, public authenticationService: AuthenticationService, public pagination: Pagination,
    public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService) {
    }

  gotoMange() {
    this.router.navigateByUrl('/home/partners/manage');
  }
  clickWorldMapReports(event) {
    console.log(event);
  }
  partnerReportData() {
    this.parterService.partnerReports(this.referenseService.companyId).subscribe(
      (data: any) => {
        console.log(data);
        this.worldMapdataReport = data.countrywisePartnersCount.countrywisepartners;
        this.campaignsCount = data.partnersLaunchedCampaignsCount;
        this.regularCampaign = data.partnersLaunchedCampaignsByCampaignType.REGULAR;
        this.socialCampaign = data.partnersLaunchedCampaignsByCampaignType.SOCIAL;
        this.videoCampaign = data.partnersLaunchedCampaignsByCampaignType.VIDEO;
        this.noOfCampaignsLaunchedByPartner = data.noOfCampaignsLaunchedByPartner.data;
      },
      (error: any) => { console.log('error got here') });
  }
  partnerUserInteractionReports() {
    this.paginationType = 'UserInteraction';
    this.parterService.partnerUserInteractionReports(this.referenseService.companyId, this.pagination).subscribe(
      (data: any) => {
        console.log(data);
        this.pagination.totalRecords = data.totalRecords;
        this.partnerUserInteraction = data.data;
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.data);
      },
      (error: any) => { console.log('error got here') });
  }
  partnerCampaignInteraction(campaignId:number) {
    this.campaignId = campaignId;
    this.paginationType = 'partnerInteraction';
    this.parterService.partnerCampaignInteraction(this.campaignId, this.campaignInteractionPagination).subscribe(
      (data: any) => {
        console.log(data);
        this.campaignInteractionPagination.totalRecords = data.message.totalRecords;
        this.campaignInteractionPagination = this.pagerService.getPagedItems(this.campaignInteractionPagination, data.message.data);
        $('#campaignInteractionModal').modal('show');
      },
      (error: any) => { console.log('error got here') });
  }

  setPage(event) {
    if (this.paginationType === 'UserInteraction') {
      this.pagination.pageIndex = event.page;
      this.partnerUserInteractionReports();
    } else if (this.paginationType === 'partnerInteraction') {
      this.campaignInteractionPagination.pageIndex = event.page;
      this.partnerCampaignInteraction(this.campaignId);
    }
  }
  closeModalPopUp(){
    this.campaignInteractionPagination.pageIndex =1;
    this.campaignInteractionPagination.maxResults = 10;
  }
  paginationDropdown(event){
    if (this.paginationType === 'UserInteraction') {
      this.pagination = event;
      this.partnerUserInteractionReports();
    } else if (this.paginationType === 'partnerInteraction') {
      this.campaignInteractionPagination = event;
      this.partnerCampaignInteraction(this.campaignId);
    }
  }
  ngOnInit() {
    if(!this.referenseService.companyId){
     this.router.navigate(['home/dashboard']);
    }
    this.pagination.maxResults = 6;
    this.campaignInteractionPagination.maxResults = 10;
    this.partnerReportData();
    this.partnerUserInteractionReports();
  }

}

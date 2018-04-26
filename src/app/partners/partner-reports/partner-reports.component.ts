import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
declare var $, Highcharts: any;

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partner-reports.component.html',
  styleUrls: ['./partner-reports.component.css'],
  providers: [Pagination, HomeComponent]
})
export class PartnerReportsComponent implements OnInit {
  worldMapdataReport: any;
  companyId: number;
  paginationType: string;
  campaignId: number;
  campaignsCount: number;
  regularCampaign: number;
  socialCampaign: number;
  videoCampaign: number;
  noOfCampaignsLaunchedByPartner = [];
  partnerUserInteraction = [];
  campaignInteractionPagination: Pagination = new Pagination();
  constructor(public router: Router, public authenticationService: AuthenticationService, public pagination: Pagination,
    public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
    public homeComponent: HomeComponent) {
  }

  gotoMange() {
    this.router.navigateByUrl('/home/partners/manage');
  }
  clickWorldMapReports(event) {
    console.log(event);
  }
  campaignTypeChart(data:any) {
    Highcharts.chart('campaign-type-chart', {
      chart: { type: 'bar' },
      xAxis: {
        categories: ['VIDEO', 'SOCIAL', 'REGULAR'],
        lineWidth: 0,
        minorTickLength: 0,
        tickLength: 0,
      },
      title:{ text:'' },
      yAxis: {
        min: 0,
        visible: false,
        gridLineWidth: 0,
      },
      colors: ['#00a6e8', '#3faba4', '#8877a9'],
      tooltip: {
        formatter: function () {
            return 'Campaign Type: <b>' + this.point.category + '</b><br>Campaigns Count: <b>' + this.point.y;
        }
    }, 
      plotOptions: { bar: { minPointLength: 3, dataLabels: { enabled: true }, colorByPoint: true } },
      exporting: { enabled: false },
      credits: { enabled: false },
      series: [{  showInLegend: false, data:data }]
    });
  }
  partnerReportData() {
    this.parterService.partnerReports(this.referenseService.companyId).subscribe(
      (data: any) => {
        console.log(data);
        this.worldMapdataReport = data.countrywisePartnersCount.countrywisepartners;
        this.campaignsCount = data.partnersLaunchedCampaignsCount;
        this.noOfCampaignsLaunchedByPartner = data.noOfCampaignsLaunchedByPartner.data;
        const campaignData = [];
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.VIDEO);
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.SOCIAL);
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.REGULAR);
        this.campaignTypeChart(campaignData);
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
  partnerCampaignInteraction(campaignId: number) {
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
  closeModalPopUp() {
    this.paginationType = 'UserInteraction';
    this.campaignInteractionPagination =  new Pagination();
  }
  paginationDropdown(event) {
    if (this.paginationType === 'UserInteraction') {
      this.pagination = event;
      this.partnerUserInteractionReports();
    } else if (this.paginationType === 'partnerInteraction') {
      this.campaignInteractionPagination = event;
      this.partnerCampaignInteraction(this.campaignId);
    }
  }
  ngOnInit() {
    this.paginationType = 'userInteraction';
    this.homeComponent.getVideoDefaultSettings();
    if (!this.referenseService.companyId) {
      this.router.navigate(['home/dashboard']);
    }
    this.pagination.maxResults = 12;
    this.campaignInteractionPagination.maxResults = 10;
    this.partnerReportData();
    this.partnerUserInteractionReports();
  }

}

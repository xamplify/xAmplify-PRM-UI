import { Component, OnInit } from '@angular/core';
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
declare var $, Highcharts: any;

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partner-reports.component.html',
  styleUrls: ['./partner-reports.component.css'],
  providers: [Pagination, HomeComponent,HttpRequestLoader,SortOption]
})
export class PartnerReportsComponent implements OnInit {
  worldMapdataReport: any;
  companyId: number;
  paginationType: string;
  campaignId: number;
  campaignsCount: number;
  throughPartnerCampaignsCount:number = 0;
  regularCampaign: number;
  socialCampaign: number;
  videoCampaign: number;
  noOfCampaignsLaunchedByPartner = [];
  partnerUserInteraction = [];
  campaignInteractionPagination: Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  throughPartnerCampaignPagination:Pagination = new Pagination();
  selectedTabIndex:number = 0;
  loggedInUserId:number = 0;
  constructor(public router: Router, public authenticationService: AuthenticationService, public pagination: Pagination,
    public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
    public homeComponent: HomeComponent,public xtremandLogger:XtremandLogger,public campaignService:CampaignService,public sortOption:SortOption) {
      this.loggedInUserId = this.authenticationService.getUserId();
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
        categories: ['VIDEO CAMPAIGN', 'SOCIAL CAMPAIGN', 'EMAIL CAMPAIGN'],
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
        this.worldMapdataReport = data.countrywisePartnersCount.countrywisepartners;
        this.campaignsCount = data.partnersLaunchedCampaignsCount;
        this.throughPartnerCampaignsCount = data.throughPartnerCampaignsCount;
        this.noOfCampaignsLaunchedByPartner = data.noOfCampaignsLaunchedByPartner.data;
        for(var i in this.noOfCampaignsLaunchedByPartner){
            this.noOfCampaignsLaunchedByPartner[i].contactCompany = this.noOfCampaignsLaunchedByPartner[i].partnerCompanyName;
        }
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
        this.pagination.totalRecords = data.totalRecords;
        this.partnerUserInteraction = data.data;
        for(var i in this.partnerUserInteraction){
            this.partnerUserInteraction[i].contactCompany = this.partnerUserInteraction[i].companyName;
        }
        console.log(this.partnerUserInteraction);
        this.pagination = this.pagerService.getPagedItems(this.pagination, data.data);
      },
      (error: any) => { console.log('error got here') });
  }
  partnerCampaignInteraction(campaignId: number) {
    this.campaignId = campaignId;
    this.paginationType = 'partnerInteraction';
    this.parterService.partnerCampaignInteraction(this.campaignId, this.campaignInteractionPagination).subscribe(
      (data: any) => {
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

  
  
  goToActivePartnersDiv(){
      this.sortOption = new SortOption();
      this.selectedTabIndex = 0;
      $('#through-partner-div').hide();
      $('#active-partner-div').show();
  }
  
  /****************************Through Partner Analytics**************************/
  goToThroughPartnersDiv(){
      this.throughPartnerCampaignPagination = new Pagination();
      this.sortOption = new SortOption();
      this.selectedTabIndex = 3;
      $('#active-partner-div').hide();
      $("#through-partner-div").show();
      this.throughPartnerCampaignPagination.userId = 0;
      this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
  }
  
  goToReDistributedPartnersDiv(){
      this.throughPartnerCampaignPagination = new Pagination();
      this.sortOption = new SortOption();
      this.selectedTabIndex = 2;
      $('#active-partner-div').hide();
      $("#through-partner-div").show();
      this.throughPartnerCampaignPagination.userId = this.loggedInUserId;
      this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
  }
  
  listThroughPartnerCampaigns(pagination: Pagination) {
      this.referenseService.loading(this.httpRequestLoader, true);
      pagination.partnerAnalytics = true;
      pagination.companyId = this.referenseService.companyId;
      this.campaignService.listCampaign(pagination,pagination.userId)
          .subscribe(
              data => {
                  this.sortOption.totalRecords = data.totalRecords;
                  pagination.totalRecords = data.totalRecords;
                  pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                  this.referenseService.loading(this.httpRequestLoader, false);
              },
              error => {
                  this.xtremandLogger.errorPage(error);
              },
              () => this.xtremandLogger.info("Finished listThroughPartnerCampaigns()")
          );
  }
  
  filterCampaigns(type: string, index: number) {
      this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab
      this.throughPartnerCampaignPagination.pageIndex = 1;
      this.throughPartnerCampaignPagination.campaignType = type;
      this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);

  }
  
  setPartnerCampaignsPageByType(event:any,type:string) {
      if("through-partner"==type){
          this.throughPartnerCampaignPagination.pageIndex = event.page;
          this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
      }
     
  }

  searchPartnerCampaigns(type:string) {
      if("through-partner"==type){
          this.getAllFilteredResults(this.throughPartnerCampaignPagination,type);
      }
      
  }

  getSortedResultForPartnerCampaigns(text: any,type:string) {
      this.sortOption.selectedSortedOption = text;
      if("through-partner"==type){
          this.getAllFilteredResults(this.throughPartnerCampaignPagination,type);
      }
     
  }

  getNumberOfItemsPerPageByType(items: any,type:any) {
      this.sortOption.itemsSize = items;
      if("through-partner"==type){
          this.getAllFilteredResults(this.throughPartnerCampaignPagination,type);
      }else{
          
      }
     
  }

  getAllFilteredResults(pagination: Pagination,type:string) {
      pagination.pageIndex = 1;
      pagination.searchKey = this.sortOption.searchKey;
      let sortedValue = this.sortOption.selectedSortedOption.value;
      if (sortedValue != "") {
          let options: string[] = sortedValue.split("-");
          pagination.sortcolumn = options[0];
          pagination.sortingOrder = options[1];
      }

      if (this.sortOption.itemsSize.value == 0) {
          pagination.maxResults = pagination.totalRecords;
      } else {
          pagination.maxResults = this.sortOption.itemsSize.value;
      }
      if("through-partner"==type){
          this.listThroughPartnerCampaigns(pagination);
      }
      
  }
  
}

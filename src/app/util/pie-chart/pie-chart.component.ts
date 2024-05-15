import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ParterService } from '../../partners/services/parter.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { PartnerJourneyRequest } from '../../partners/models/partner-journey-request';
import { TeamMemberAnalyticsRequest } from 'app/team/models/team-member-analytics-request';

declare var Highcharts: any;
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit {
  @Input() partnerCompanyId: number;
  @Input() chartId: any;
  @Input() teamMemberId: any;
  @Input() applyFilter: boolean;
  @Input() isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Output() notifySelectSlice = new EventEmitter();
  @Output() notifyUnSelectSlice = new EventEmitter();
  @Input() isTeamMemberAnalytics: boolean = false;
  @Input() selectedVendorCompanyIds: any[] = [];
  @Input() selectedTeamMemberIds: any[] = [];
  @Input() isVendorVersion: boolean = false;
  @Input() vanityUrlFilter: boolean = false;
  @Input() vendorCompanyProfileName: string = '';


  headerText: string;
  loader = false;
  statusCode = 200;
  pieChartData: Array<any> = [];
  constructor(public parterService: ParterService, public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger) { }

  constructPieChart(pieChartData: any) {
    if (this.chartId == "redistributedCampaignDetailsPieChart") {
      var chartId = this.chartId;
    } else {
      chartId = 'pie' + this.partnerCompanyId;
    }
    let self = this;
    Highcharts.chart(chartId, {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
      },
      title: {
        text: ''
      },
      tooltip: {
        backgroundColor: 'black',
        style: {
          color: '#fff'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: this.chartId === 'redistributedCampaignDetailsPieChart' ? true : false,
            style: {
              color: this.chartId === 'redistributedCampaignDetailsPieChart'
                ? (this.authenticationService.isDarkForCharts ? "#fff" : "#696666")
                : undefined
            }
          },
          showInLegend: false
        }, series: {
          allowPointSelect: true,
          marker: {
            states: {
              select: {
                radius: 1,
                fillColor: '#666'
              }
            }
          },
          point: {
            events: {
              select: function (event) {
                self.notifySelectSlice.emit(this.name);
              },

              unselect: function (event) {
                self.notifyUnSelectSlice.emit(this.name);
              }
            }
          }
        }
      },
      exporting: { enabled: false },
      credits: { enabled: false },
      colors: this.isVendorVersion ? ['#ffb600', '#ff3879', '#be72d3', '#357ebd', '#00ffc8','#f5415f'] : ['#ffb600', '#ff3879', '#be72d3', '#357ebd', '#00ffc8'] ,
      series: [{
        name: 'Count',
        colorByPoint: true,
        data: pieChartData
      }]
    });
  }

  launchedCampaignsCountGroupByCampaignType() {
    var pieChartData;
    this.parterService.launchedCampaignsCountGroupByCampaignType(this.partnerCompanyId, this.authenticationService.user.id).subscribe(
      (data: any) => {
        if(this.isVendorVersion){
          pieChartData = [{ name: 'VIDEO', y: data.VIDEO }, { name: 'Email', y: data.REGULAR }, { name: 'SOCIAL', y: data.SOCIAL }, { name: 'EVENT', y: data.EVENT }, { name: 'SURVEY', y: data.SURVEY },{ name: 'PAGE', y: data.PAGE }];
        }else{
          pieChartData = [{ name: 'VIDEO', y: data.VIDEO }, { name: 'Email', y: data.REGULAR }, { name: 'SOCIAL', y: data.SOCIAL }, { name: 'EVENT', y: data.EVENT }, { name: 'SURVEY', y: data.SURVEY }];
        }
      },
      (error: any) => {
        this.xtremandLogger.error(error);

      },
      () => this.constructPieChart(pieChartData)
    );
  }

  ngOnInit() {

  }
  foundPieChart() {
    if (this.chartId == "redistributedCampaignDetailsPieChart") {
      if (!this.isTeamMemberAnalytics) {
        this.redistributedCampaignDetailsPieChart();
      } else {
        this.redistributedCampaignDetailsPieChartForTeamMember();
      }
      if (this.isTeamMemberAnalytics && this.isVendorVersion) {
        this.headerText = 'Launched Campaigns';
      } else {
        this.headerText = 'Redistributed Campaigns';
      }
    } else {
      this.launchedCampaignsCountGroupByCampaignType();
    }
  }

  ngOnChanges() {
    this.foundPieChart();
  }

  redistributedCampaignDetailsPieChart() {
    let partnerJourneyRequest = new PartnerJourneyRequest();
    partnerJourneyRequest.loggedInUserId = this.authenticationService.getUserId();
    partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
    partnerJourneyRequest.teamMemberUserId = this.teamMemberId;
    partnerJourneyRequest.detailedAnalytics = this.isDetailedAnalytics;
    partnerJourneyRequest.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    partnerJourneyRequest.partnerTeamMemberGroupFilter = this.applyFilter;
    this.parterService.redistributedCampaignDetailsPieChart(partnerJourneyRequest).subscribe(
      response => {
        this.processResponse(response);
      }, error => {
        this.setErrorResponse(error);
      }
    );
  }
  setErrorResponse(error: any) {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 500;
  }


  redistributedCampaignDetailsPieChartForTeamMember() {
    let teamMemberAnalyticsRequest = new TeamMemberAnalyticsRequest();
    teamMemberAnalyticsRequest.loggedInUserId = this.authenticationService.getUserId();
    teamMemberAnalyticsRequest.selectedTeamMemberIds = this.selectedTeamMemberIds;
    teamMemberAnalyticsRequest.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
    if (!this.isVendorVersion) {
      teamMemberAnalyticsRequest.vanityUrlFilter = this.vanityUrlFilter;
      teamMemberAnalyticsRequest.vendorCompanyProfileName = this.vendorCompanyProfileName;
    }
    this.parterService.redistributedCampaignDetailsPieChartForTeamMember(teamMemberAnalyticsRequest, this.isVendorVersion).subscribe(
      response => {
        this.processResponse(response);
      }, error => {
        this.setErrorResponse(error);
      }
    );
  }

  processResponse(response: any) {
    this.statusCode = response.statusCode;
    this.pieChartData = response.data;
    if (this.statusCode == 200) {
      this.constructPieChart(this.pieChartData);
    }
    this.loader = false;
  }

}

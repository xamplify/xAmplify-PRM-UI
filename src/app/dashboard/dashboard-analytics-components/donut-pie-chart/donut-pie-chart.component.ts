import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Properties } from "app/common/models/properties";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DashboardService } from "app/dashboard/dashboard.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { PartnerJourneyRequest } from "app/partners/models/partner-journey-request";
import { ParterService } from "app/partners/services/parter.service";
import { TeamMemberAnalyticsRequest } from "app/team/models/team-member-analytics-request";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";
declare var Highcharts: any;

@Component({
  selector: "app-donut-pie-chart",
  templateUrl: "./donut-pie-chart.component.html",
  styleUrls: ["./donut-pie-chart.component.css"],
  providers: [Properties],
})
export class DonutPieChartComponent implements OnInit {
  loader = false;
  statusCode = 200;
  donutData: Array<any> = [];
  @Input() applyFilter: boolean;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  val: any;
  vanityLogin = false;

  //XNFR-316
  @Input() partnerCompanyId: any;
  @Input() teamMemberId: any;
  @Input() chartId: any;
  @Input() trackType: any = "";
  @Output() notifySelectSlice = new EventEmitter();
  @Output() notifyUnSelectSlice = new EventEmitter();
  @Input()  isDetailedAnalytics: boolean;
  @Input() selectedPartnerCompanyIds: any = [];
  @Input() isTeamMemberAnalytics : boolean = false;
  headerText: string;
  chartColors: string[];
  colClass:string;
  portletLightClass:string;
  constructor(
    public authenticationService: AuthenticationService,
    public properties: Properties,
    public dashboardService: DashboardService,
    public xtremandLogger: XtremandLogger,
    public router: Router,
    public partnerService: ParterService
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.vanityLoginDto.userId = this.loggedInUserId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
      this.vanityLogin = true;
    }
  }
  ngOnInit() {
    //this.vanityLoginDto.applyFilter = this.applyFilter;
    //this.findDonutChart();
  }

  ngOnChanges() {      
    this.vanityLoginDto.applyFilter = this.applyFilter;
    this.findDonutChart();
  }
 
  findDonutChart() {
    this.loader = true;
    if (this.chartId == "interactedAndNotInteractedTracksDonut") {
      this.headerText = 'Interacted & Not Interacted Tracks';
      this.chartColors = ['#5C9BD1', '#E87E04', '#2bc2b5', '#90ed7d'];
      // this.colClass = "col-sm-5 col-lg-5";
      this.colClass = "col-sm-6 col-md-5 col-xs-12 col-lg-5";
      this.portletLightClass = "portlet light active-donut-pie-chart";
      if(!this.isTeamMemberAnalytics){
        this.loadDonutChartForInteractedAndNotInteractedTracks();
      }else{
        this.loadDonutChartForInteractedAndNotInteractedTracksForTeamMember();
      }
    } else if (this.chartId == "typewiseTrackContentDonut") {
      this.headerText = 'Status Wise Track Assets';
      this.chartColors = ['#3598dc', '#3480b5', '#8e5fa2', '#e87e04', '#26a69a'];
      this.colClass = "col-sm-6 col-md-5 col-xs-12 col-lg-4";
      this.portletLightClass = "portlet light active-donut-pie-chart";
      if(!this.isTeamMemberAnalytics){
       this.loadDonutChartForTypewiseTrackContents();;
      }else{
        this.loadDonutChartForTypewiseTrackContentsForTeamMember();
      }
    } else {
      this.headerText = "";
      this.chartId = 'activeInActivePartnersDonut';
      this.chartColors = ['#e87e04','#8a8282c4'];
      this.colClass = "col-sm-12 col-lg-12";
      this.portletLightClass = "";
      this.loadDonutChartForActiveAndInActivePartners();
    }
  }

  loadDonutChartForTypewiseTrackContents() {
    let partnerJourneyRequest = new PartnerJourneyRequest();
    partnerJourneyRequest.loggedInUserId = this.authenticationService.getUserId();
    partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
    partnerJourneyRequest.teamMemberUserId = this.teamMemberId;
    partnerJourneyRequest.trackTypeFilter = this.trackType;
    partnerJourneyRequest.detailedAnalytics = this.isDetailedAnalytics;
    partnerJourneyRequest.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    partnerJourneyRequest.partnerTeamMemberGroupFilter = this.applyFilter;
    this.partnerService.getPartnerJourneyTypewiseTrackCounts(partnerJourneyRequest).subscribe(
      response => {
        this.processResponse(response);
      }, error => {
        this.setErrorResponse(error);
      }
    );
  }

  loadDonutChartForActiveAndInActivePartners() {
    this.dashboardService
      .findActivePartnersAndInActivePartnersForDonutChart(this.vanityLoginDto)
      .subscribe(
        (response) => {
          this.processResponse(response);
        },
        (error) => {
          this.setErrorResponse(error);
        }
      );
  }

  loadDonutChartForInteractedAndNotInteractedTracks() {
    let partnerJourneyRequest = new PartnerJourneyRequest();
    partnerJourneyRequest.loggedInUserId = this.authenticationService.getUserId();
    partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
    partnerJourneyRequest.teamMemberUserId = this.teamMemberId;
    partnerJourneyRequest.detailedAnalytics = this.isDetailedAnalytics;
    partnerJourneyRequest.selectedPartnerCompanyIds = this.selectedPartnerCompanyIds;
    partnerJourneyRequest.partnerTeamMemberGroupFilter = this.applyFilter;
    this.partnerService.getPartnerJourneyInteractedAndNotInteractedCounts(partnerJourneyRequest).subscribe(
      response => {
        this.processResponse(response);
      }, error => {
        this.setErrorResponse(error);
      }
    );
  }
  loadDonutChartForInteractedAndNotInteractedTracksForTeamMember(){
    let teamMemberAnalyticsRequest = new TeamMemberAnalyticsRequest();
    teamMemberAnalyticsRequest.loggedInUserId = this.loggedInUserId;
    this.partnerService.getTeamMemberAnalyticsInteractedAndNotInteractedCounts(teamMemberAnalyticsRequest).subscribe(
      response => {
        this.processResponse(response);
      }, error => {
        this.setErrorResponse(error);
      }
    );
  }

  loadDonutChartForTypewiseTrackContentsForTeamMember(){
    let teamMemberAnalyticsRequest = new TeamMemberAnalyticsRequest();
    teamMemberAnalyticsRequest.loggedInUserId = this.loggedInUserId;
    teamMemberAnalyticsRequest.trackTypeFilter = this.trackType;
    this.partnerService.getTeamMemberTypewiseTrackCounts(teamMemberAnalyticsRequest).subscribe(
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

  processResponse(response: any) {
    this.statusCode = response.statusCode;
    this.donutData = response.data;
    if (this.statusCode == 200) {
      this.loadDonutChart(this.donutData);
    }
    this.loader = false;
  }

  loadDonutChart(donutData: any) {
    let chartId = this.chartId;
    let headerText = this.headerText;
    let self = this;
    Highcharts.chart(chartId, {
      chart: {
        type: "pie",
        backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
        options3d: {
          enabled: false,
        },
      },
      title: {
        text: "",
      },
      tooltip: {
        backgroundColor: 'black',
        style: {
          color: '#fff'
        }
      },

      subtitle: {
        text: "",
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        pie: {
          innerSize: 70,
          depth: 10,
          dataLabels: {
            style: {
              color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
            }
          }
        },
        series: {
          allowPointSelect: true,
          marker: {
            states: {
              select: {
                radius: 1,
                fillColor: '#666'
              }
            }
          },
          point:{
            events:{
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
      credits: {
        enabled: false,
      },
      colors: this.chartColors,
      series: [
        {
          name: "Count",
          data: this.donutData,          
        },
      ],
    });
  }
}

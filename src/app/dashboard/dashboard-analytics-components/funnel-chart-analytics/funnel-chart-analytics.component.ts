import { Component, OnInit, Input } from "@angular/core";
import { DashboardService } from "app/dashboard/dashboard.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Properties } from "app/common/models/properties";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/core/services/authentication.service";
import { VanityLoginDto } from "app/util/models/vanity-login-dto";

declare var Highcharts: any;

@Component({
  selector: "app-funnel-chart-analytics",
  templateUrl: "./funnel-chart-analytics.component.html",
  styleUrls: ["./funnel-chart-analytics.component.css"],
  providers: [Properties],
})
export class FunnelChartAnalyticsComponent implements OnInit {
  funnelChartData: Array<any> = new Array<any>();
  loader = false;
  statusCode = 200;
  @Input() applyFilter: boolean;
  leadCount:any;
  dealCount: any;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  val:any=[];
  vanityLogin = false;
  constructor(
    public authenticationService: AuthenticationService,
    public properties: Properties,
    public dashboardService: DashboardService,
    public xtremandLogger: XtremandLogger,
    public router: Router
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
    this.vanityLoginDto.applyFilter = this.applyFilter;
    this.findData();
  }

  findData() {
    this.loader = true;
    this.dashboardService
      .getFunnelChartsAnalyticsData(this.vanityLoginDto)
      .subscribe(
        (response) => {
          this.funnelChartData = response.data;
          this.val=this.funnelChartData.map(t=>t[1]);
            let sum = this.val.reduce(function (a, b) {
            return a + b;
            }, 0);
            if(sum === 0){
              this.funnelChartData.length = 0;
              this.loader =false;
            }
            else{
          this.statusCode=200;
          this.loader = false;
          this.loadChart(this.funnelChartData);
            }
    
        },
        (error) => {
          this.xtremandLogger.error(error);
          this.loader = false;
          this.statusCode = 0;
        }
      );
  }

  loadChart(funnelChartData: any) {
    let self = this;
    Highcharts.chart("funnel-chart-container", {
      credits: {
        enabled: false,
      },
      chart: {
        type: "funnel3d",
        backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
        options3d: {
          enabled: true,
          alpha: 10,
          depth: 50,
          viewDistance: 50,
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
      plotOptions: {
        funnel3d: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          }
      },
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function (event:any) {
               let name = event['point']['name'];
                if ("Recipients"==name) {
                  //self.router.navigate(["/home/contacts/manage"]);
                } else if ("Leads"==name) {
                // self.router.navigate(["/home/leads/manage"]);
                } else if ("Deals"==name) {
                 // self.router.navigate(["/home/deal/manage"]);
                } else if ("Won Deals"==name) {
                 // self.router.navigate(["/home/deal/manage"]);
                }
              },
            },
          },

          dataLabels: {
            enabled: true,
            format: '<b style="text-color:blue;">{point.name}</b> ({point.y})',
            allowOverlap: false,
            y: 10,
            style: {
              color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}
          },
          center: ["50%", "50%"],
          neckWidth: "30%",
          neckHeight: "25%",
          width: "80%",
          height: "80%",
        },
      },
      colors: [
        "#5C9BD1",
        "#8b76a8",
        " #a49c9e",
        "#3faba4",
        "#1aadce",
        "#492970",
        "#f28f43",
        "#77a1e5",
        "#c42525",
        "#a6c96a",
      ],
      series: [
        {
          name: "Count",
          data: funnelChartData,
        },
      ],
    });
  }
}

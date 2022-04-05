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
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
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
          this.loader = false;
          this.loadChart(this.funnelChartData);
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
        options3d: {
          enabled: true,
          alpha: 10,
          depth: 50,
          viewDistance: 20,
        },
      },
      title: {
        text: "",
      },

      plotOptions: {
        //     colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
        // '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function () {
                if (this.category === 0) {
                  self.router.navigate(["/home/contacts/manage"]);
                } else if (this.category === 1) {
                  self.router.navigate(["/home/leads/manage"]);
                } else if (this.category === 2) {
                  self.router.navigate(["/home/deal/manage"]);
                } else if (this.category === 3) {
                  self.router.navigate(["/home/deal/manage"]);
                }
              },
            },
          },

          dataLabels: {
            enabled: true,
            format: '<b style="text-color:blue;">{point.name}</b> ({point.y})',
            allowOverlap: false,
            y: 10,
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
          data: this.funnelChartData,
        },
      ],
    });
  }
}

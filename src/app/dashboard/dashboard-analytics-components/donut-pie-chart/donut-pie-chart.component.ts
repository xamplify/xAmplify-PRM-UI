import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Properties } from "app/common/models/properties";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DashboardService } from "app/dashboard/dashboard.service";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
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
    this.findDonutChart();
  }

  findDonutChart() {
    this.loader = true;
    this.dashboardService
      .findActivePartnersAndInActivePartnersForDonutChart(this.vanityLoginDto)
      .subscribe(
        (response) => {
          this.statusCode = response.statusCode;
          this.donutData = response.data;
          if (this.statusCode == 200) {
            this.loadDonutChart(this.donutData);
          }
          this.loader = false;
        },
        (error) => {
          this.xtremandLogger.error(error);
          this.loader = false;
          this.statusCode = 500;
        }
      );
  }

  loadDonutChart(donutData: any) {
    Highcharts.chart("donut-chart-container", {
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
          dataLabels:{
            style:{
              color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
            }
          }
        },
      },
      credits: {
        enabled: false,
      },
      colors: ["#E87E04", "#5C9BD1"],
      series: [
        {
          name: "Count",
          data: this.donutData,
        },
      ],
    });
  }
}

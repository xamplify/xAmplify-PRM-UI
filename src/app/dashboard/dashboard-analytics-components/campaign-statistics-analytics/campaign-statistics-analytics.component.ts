import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { UtilService } from 'app/core/services/util.service';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardAnalyticsDto } from 'app/dashboard/models/dashboard-analytics-dto';
import { AuthenticationService } from 'app/core/services/authentication.service';

declare var Highcharts: any;

@Component({
  selector: 'app-campaign-statistics-analytics',
  templateUrl: './campaign-statistics-analytics.component.html',
  styleUrls: ['./campaign-statistics-analytics.component.css'],
  providers: [HttpRequestLoader]
})
export class CampaignStatisticsAnalyticsComponent implements OnInit {

  heatMap: any;
  sortDates: any;
  daySort: any;
  sortHeatMapValues: any;
  heatMapSort: any;
  heatMapData: any;
  loading = false;
  isFullscreenToggle=false;
  heatMapTooltip = 'Current Year';
  heatMapLoader: HttpRequestLoader = new HttpRequestLoader();
  dashboardAnalyticsDto:DashboardAnalyticsDto = new DashboardAnalyticsDto();
  constructor(public authenticationService:AuthenticationService,public dashboardService: DashboardService, public xtremandLogger: XtremandLogger, public router: Router, public referenceService: ReferenceService,public utilService:UtilService,private vanityUrlService: VanityURLService) {
    this.sortDates = this.dashboardService.sortDates;
    this.sortHeatMapValues = this.sortDates.concat([{ 'name': 'Year', 'value': 'year' }]);
    this.heatMapSort = this.sortHeatMapValues[4];
  }

  ngOnInit() {
    this.dashboardAnalyticsDto = this.vanityUrlService.addVanityUrlFilterDTO(this.dashboardAnalyticsDto);
    this.getCampaignsHeatMapData();    
  }

  getCampaignsHeatMapData() {
    try {
      this.referenceService.loading(this.heatMapLoader,true);
      this.dashboardService.getCampaignsHeatMapDetailsForVanityURL(this.heatMapSort.value,this.dashboardAnalyticsDto).
        subscribe(result => {
          if (result) {
            this.heatMapData = result.heatMapData;
            this.heatMapData.forEach(element => {
              element.name = element.name.length > 25 ? element.name.substring(0, 25) + "..." : element.name;
              if (element.launchTime) { element.launchTime = this.convertDateFormat(element.launchTime); }
            });
            if (!this.isFullscreenToggle) {
              this.generatHeatMap(this.heatMapData, 'dashboard-heat-map');
            } else { this.generatHeatMap(this.heatMapData, 'heat-map-data'); }
          } else { this.heatMapData = []; }
        },
          (error: any) => {
            this.xtremandLogger.error(error);
          });
    } catch (error) {
      this.xtremandLogger.error(error);
    }
  }

  generatHeatMap(heatMapData:any, heatMapId:any) {
    this.referenceService.loading(this.heatMapLoader,true);
    const self = this;
    if (true) {
      const data = heatMapData;
      Highcharts.chart(heatMapId, {
        colorAxis: {
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0]
        },
        credits: {
          enabled: false
        },
        chart: {
          backgroundColor   : this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
        },
        
        exporting: { enabled: false },
        tooltip: {
          formatter: function () {
            return 'Campaign Name: <b>' + this.point.name + '</b><br> Email Open Count: <b>' + this.point.value + '</b>' +
              '<br> Interaction : <b>' + this.point.interactionPercentage + '%</b><br>Launch Date:<b>' + this.point.launchTime + '</b>';
          },
          backgroundColor: 'black', 
          style: {
            color: '#fff' 
          }
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              style: {
                fontWeight: 'normal',
                fontSize: '13px',
                color: 'block',
              }
            },
            events: {
              click: function (event:any) {
                self.loading = true;
                self.referenceService.campaignType = event.point.campaignType;
                let campaign = {};
                campaign['campaignId'] = event.point.campaignId;
                campaign['campaignTitle'] = event.point.campaignTitle;
                self.referenceService.goToCampaignAnalytics(campaign);
              }
            }
          }
        },
        series: [{
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          showInLegend: false,
          data: data
        }],
        title: {
          text: ' '
        },
        legend: {
          enabled: false
        }
      }
      );
      self.referenceService.loading(this.heatMapLoader,false);
    }
  }

  convertDateFormat(time) {
    let ntime = new Date(time);
    let timeDate = ntime.toString().split(" ");
    let timeHours = this.tConv24(timeDate[4]);
    return timeDate[1] + " " + timeDate[2] + " " + timeDate[3] + ", " + timeHours;
  }

  tConv24(time24) {
    let ts = time24;
    let H = +ts.substr(0, 2);
    let h: any = (H % 12) || 12;
    h = (h < 10) ? ("0" + h) : h;  // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  };

  selectedheatMapSortByValue(event: any) {
    this.heatMapSort.value = event;
    this.heatMapTooltip = this.utilService.setTooltipMessage(event);
    this.getCampaignsHeatMapData();
}

isFullscreenHeatMap() {
  this.isFullscreenToggle = !this.isFullscreenToggle;
  if (this.isFullscreenToggle) {
      this.generatHeatMap(this.heatMapData, 'heat-map-data');
  }else{
    this.generatHeatMap(this.heatMapData, 'dashboard-heat-map');
  }

}

}

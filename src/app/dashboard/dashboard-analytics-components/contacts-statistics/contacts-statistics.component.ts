import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { UtilService } from 'app/core/services/util.service';
declare var Highcharts: any;

@Component({
  selector: 'app-contacts-statistics',
  templateUrl: './contacts-statistics.component.html',
  styleUrls: ['./contacts-statistics.component.css'],
  providers: [HttpRequestLoader]

})
export class ContactsStatisticsComponent implements OnInit {

  heatMap: any;
  sortDates: any;
  daySort: any;
  sortHeatMapValues: any;
  heatMapSort: any;
  treeMapData: any;
  loading = false;
  isFullscreenToggle=false;
  heatMapTooltip = 'Current Year';
  treeMapLoader: HttpRequestLoader = new HttpRequestLoader();
  constructor(public dashboardService: DashboardService, public xtremandLogger: XtremandLogger, public router: Router, public referenceService: ReferenceService,public utilService:UtilService) {
  }
  ngOnInit() {
    this.getContactsStatistics();
  }

  getContactsStatistics(){
    this.referenceService.loading(this.treeMapLoader,true);
    this.dashboardService.getContactsStatistics().
    subscribe((response)=>{
      this.treeMapData = response;
      this.showTreeMap(this.treeMapData,"minimized-contacts-treemap")

    },(error:any)=>{
      this.xtremandLogger.error(error);
    });

  }

  showTreeMap(treeMapData, treeMapId) {
    this.referenceService.loading(this.treeMapLoader,true);
    const self = this;
    if (true) {
      const data = treeMapData;
      Highcharts.chart(treeMapId, {
        colorAxis: {
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[1]
        },
        credits: {
          enabled: false
        },
        exporting: { enabled: false },
        tooltip: {
          formatter: function () {
            return 'Partner Company Name: <b>' + this.point.name + '</b><br>Contacts<b>' + this.point.value + '</b>';
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
              click: function (event) {
               
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
      self.referenceService.loading(this.treeMapLoader,false);
    }
  }

}

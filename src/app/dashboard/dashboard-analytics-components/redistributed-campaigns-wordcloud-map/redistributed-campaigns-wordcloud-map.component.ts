import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var Highcharts: any;
@Component({
    selector: 'app-redistributed-campaigns-wordcloud-map',
    templateUrl: './redistributed-campaigns-wordcloud-map.component.html',
    styleUrls: ['./redistributed-campaigns-wordcloud-map.component.css'],
    providers: [Properties]
})
export class RedistributedCampaignsWordcloudMapComponent implements OnInit {
    wordCloudData: any;
    loader = false;
    statusCode = 200;
    @Input()applyFilter:boolean;
    constructor(public authenticationService: AuthenticationService, public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger) { }

    ngOnInit() {
        this.findCloudDataAndRenderChart();
    }

    findCloudDataAndRenderChart() {
        this.loader = true;
        this.dashboardService.getWordCloudDataForRedistributedCampaigns(this.applyFilter).subscribe(
            data => {
                this.loader = false;
                this.wordCloudData = data;
                this.statusCode = 200;
                this.loadChart(data);
            }, error => {
                this.xtremandLogger.error(error);
                this.loader = false;
                this.statusCode = 0;
            }
        );
    }

    loadChart(data:any) {
        Highcharts.chart('partner-redistributed-wordcolud-map', {
            chart: {
                backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
              },
              tooltip: {
                backgroundColor: 'black', 
                style: {
                  color: '#fff' 
                }
              },
            credits: {
                enabled: false
            },
            accessibility: {
                screenReaderSection: {
                    beforeChartFormat: '<h5>{chartTitle}</h5>' +
                        '<div>{chartSubtitle}</div>' +
                        '<div>{chartLongdesc}</div>' +
                        '<div>{viewTableButton}</div>'
                }
            },
            series: [{
                type: 'wordcloud',
                data: data,
                name: 'Redistributed Campaigns'
            }],
            title: {
                text: ''
            }
        });
    }
   
}

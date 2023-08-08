import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var Highcharts: any;
import {AuthenticationService} from 'app/core/services/authentication.service';

@Component({
    selector: 'app-chart-variable-pie',
    templateUrl: './chart-variable-pie.component.html',
    styleUrls: ['./chart-variable-pie.component.css']
})
export class ChartVariablePieComponent implements OnInit {

    @Input() public chartId: any = "";  
    @Input() public pieChartInputMap = new Map(); 

    public title: any = "";
    //pointFormat is the text with data which is shown on hover of a item in pie chart.
    public pointFormat: any; 
    public data: any;
    
    constructor(public authenticationService:AuthenticationService) { }

    ngOnInit() {  
        this.pointFormat = this.pieChartInputMap.get("pointFormat");
        if (this.pointFormat == undefined || this.pointFormat == null || this.pointFormat == "") {
            this.pointFormat = '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                'y-axis <b>{point.y}</b><br/>' +
                'z-axis: <b>{point.z}</b><br/>';
        }
        this.title = this.pieChartInputMap.get("title");
        this.data = this.pieChartInputMap.get("data");
        if (this.data == undefined || this.data == null || this.data.length == 0) {
            this.setDefaultData();            
        }
    }

    ngAfterViewInit() {
        this.showChart();
    }

    setDefaultData() {
        this.data = [{
            name: 'Spain',
            y: 505370,
            z: 92.9
        }, {
            name: 'France',
            y: 551500,
            z: 118.7
        }, {
            name: 'Poland',
            y: 312685,
            z: 124.6
        }, {
            name: 'Czech Republic',
            y: 78867,
            z: 137.5
        }, {
            name: 'Italy',
            y: 301340,
            z: 201.8
        }, {
            name: 'Switzerland',
            y: 41277,
            z: 214.5
        }, {
            name: 'Germany',
            y: 357022,
            z: 235.6
        }, {
            name: 'India',
            y: 41277,
            z: 100
        }];
    }

    showChart() {
        let id = 'vpie-chart'+ this.chartId;
        alert(id);
        let self = this;
        Highcharts.chart(id, {
            chart: {
                type: 'variablepie',
                backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
            },
            title: {
                text: self.title
            },            
            tooltip: {
                headerFormat: '',
                pointFormat: self.pointFormat
            },
            credits: {
                enabled: false
              },
            series: [{
                minPointSize: 10,
                innerSize: '20%',
                zMin: 0,
                name: '',
                data: self.data
            }]
        });
    }



}

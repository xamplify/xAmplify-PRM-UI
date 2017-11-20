import { Component, OnInit, Input } from '@angular/core';
declare var $, Index: any;
@Component({
  selector: 'app-avarage-chart',
  templateUrl: './average-chart.component.html',
  styleUrls: ['./average-chart.component.css'],
  styles: [`
    .chart {
      display: block;
    }
  `],
})

export class AvarageChartComponent implements OnInit {
  @Input() videoFileId: number;
  constructor() { }
  averageSparklineData() {
    const myvalues = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
    $('#' + this.videoFileId).sparkline(myvalues, {
      type: 'line',
      width: '100',
      barWidth: 5,
      height: '55',
      barColor: '#35aa47',
      negBarColor: '#e02222'
    });
  }
     
  ngOnInit() {
     Index.initChat();
     Index.initMiniCharts();
    this.averageSparklineData();
  }

}

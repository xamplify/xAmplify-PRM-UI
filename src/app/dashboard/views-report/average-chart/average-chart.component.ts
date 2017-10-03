import { Component, OnInit, Input } from '@angular/core';
declare var $: any;
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

  circles = [ { id: 'oyut1' }, { id: 'oyut2' }, { id: 'oyut3' }, { id: 'oyut4' }, { id: 'oyut5' } ];

  constructor() { }
  private datasets = [
    {
      label: "Views",
      data: [12, 19, 3, 5, 2, 3,8]
    }
  ];

  private labels = ['1day', '2day', '3day', '4day', '5day', '6day','7day'];

  private options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  averageSparklineData() {
    const myvalues = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
    //  for(let i = 0; i < this.circles.length; i++){
    $('#' + this.videoFileId).sparkline(myvalues, {
      type: 'line',
      width: '100',
      barWidth: 5,
      height: '55',
      barColor: '#35aa47',
      negBarColor: '#e02222'
    });
    //  }
  }
     
  ngOnInit() {
  //  this.averageSparklineData();
  }

}

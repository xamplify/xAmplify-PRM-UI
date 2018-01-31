import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {
 
  @Input() percentageValue: any;
  @Input() totalValue: any;
  constructor() { }

  ngOnInit() {
    console.log(this.percentageValue+'and'+this.totalValue);
  }
}


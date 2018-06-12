import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-analytics-loader',
  templateUrl: './analytics-loader.component.html',
  styleUrls: ['./analytics-loader.component.css','../list-loader/list-loader.component.css']
})
export class AnalyticsLoaderComponent implements OnInit {
 @Input() campaignType:any;
  constructor() { }

  ngOnInit() {
  }

}

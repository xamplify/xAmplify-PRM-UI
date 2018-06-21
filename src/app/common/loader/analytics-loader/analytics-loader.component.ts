import { Component, OnInit,Input } from '@angular/core';
import { ReferenceService } from '../../../core/services/reference.service';


@Component({
  selector: 'app-analytics-loader',
  templateUrl: './analytics-loader.component.html',
  styleUrls: ['./analytics-loader.component.css','../list-loader/list-loader.component.css']
})
export class AnalyticsLoaderComponent implements OnInit {
  campaignType:any;
  constructor(private referenceService:ReferenceService) {
  }

  ngOnInit() {
    if( this.referenceService.campaignType === 'REGULAR'){
      this.campaignType = 'REGULAR';
    } else { this.campaignType = 'VIDEO';}
  }

}

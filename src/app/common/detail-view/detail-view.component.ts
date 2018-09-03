import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsComponent } from "../../campaigns/analytics/analytics.component";

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css']
})
export class DetailViewComponent implements OnInit {
    @Input() detailType: any;
    @Input() details: any;
    
  constructor(public analyticsComponent: AnalyticsComponent) { }

  ngOnInit() {
  }

}

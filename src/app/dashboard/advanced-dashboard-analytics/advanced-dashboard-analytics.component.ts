import { Component, OnInit,Input } from '@angular/core';
import {AuthenticationService} from 'app/core/services/authentication.service';
@Component({
  selector: 'app-advanced-dashboard-analytics',
  templateUrl: './advanced-dashboard-analytics.component.html',
  styleUrls: ['./advanced-dashboard-analytics.component.css']
})
export class AdvancedDashboardAnalyticsComponent implements OnInit {
  @Input() applyFilter:boolean;
  ngxLoading = false;
  constructor(public authenticationService:AuthenticationService) { 
  }

  ngOnInit() {
  }

}

import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Router } from '@angular/router';
import { UtilService } from 'app/core/services/util.service';
import { Properties } from 'app/common/models/properties';
@Component({
  selector: 'app-leads-statistics',
  templateUrl: './leads-statistics.component.html',
  styleUrls: ['./leads-statistics.component.css'],
  providers: [Properties]
})
export class LeadsStatisticsComponent implements OnInit {
  leadsData: any;
	leadsLoader = false;
  leadsStatusCode = 200;
  @Input()applyFilter:boolean;
  loadChart = false;
  constructor(public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger, public router: Router, public referenceService: ReferenceService, public utilService: UtilService) {
	}

  ngOnInit() {
    this.getLeadsData();
  }

  getLeadsData(){
    this.leadsLoader = true;
    this.dashboardService.getLeadsCount(this.applyFilter).subscribe(
      data=>{
        this.leadsData = data;
        this.leadsStatusCode = 200;
        this.leadsLoader = false;
        this.loadChart = true;
      },error=>{
        this.xtremandLogger.error(error);
        this.leadsStatusCode = 0;
        this.leadsLoader = false;
        this.loadChart = true;
      }
    );
  }


}

import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Router } from '@angular/router';
import { UtilService } from 'app/core/services/util.service';
import { Properties } from 'app/common/models/properties';
@Component({
  selector: 'app-deals-statistics',
  templateUrl: './deals-statistics.component.html',
  styleUrls: ['./deals-statistics.component.css'],
  providers: [Properties]

})
export class DealsStatisticsComponent implements OnInit {
  dealsData: any;
	dealsLoader = false;
  dealsStatusCode = 200;
  @Input()applyFilter:boolean;
  loadChart = false;
  constructor(public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger, public router: Router, public referenceService: ReferenceService, public utilService: UtilService) {
	}


  ngOnInit() {
    this.getDealsData();
  }

  getDealsData(){
    this.dealsLoader = true;
    this.dashboardService.getDealsCount(this.applyFilter).subscribe(
      data=>{
        this.dealsData = data;
        this.dealsStatusCode = 200;
        this.dealsLoader = false;
        this.loadChart = true;
      },error=>{
        this.xtremandLogger.error(error);
        this.dealsStatusCode = 0;
        this.dealsLoader = false;
        this.loadChart = true;
      }
    );
  }

 

}

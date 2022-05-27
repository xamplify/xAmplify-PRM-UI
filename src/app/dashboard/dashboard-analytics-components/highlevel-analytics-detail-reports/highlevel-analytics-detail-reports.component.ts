import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';

@Component({
  selector: 'app-highlevel-analytics-detail-reports',
  templateUrl: './highlevel-analytics-detail-reports.component.html',
  styleUrls: ['./highlevel-analytics-detail-reports.component.css']
})
export class HighlevelAnalyticsDetailReportsComponent implements OnInit {

  loader = false;
  statusCode = 200;
  detailReports:any;
  @Input() applyFilter: boolean;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  loggedInUserId: number = 0;
  vanityLogin = false;
  constructor(
    public authenticationService: AuthenticationService,
    public properties: Properties,
    public dashboardService: DashboardService,
    public xtremandLogger: XtremandLogger,
    public router: Router
  ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.vanityLoginDto.userId = this.loggedInUserId;
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName !== undefined && companyProfileName !== "") {
      this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
      this.vanityLoginDto.vanityUrlFilter = true;
      this.vanityLogin = true;
    }
  }
  ngOnInit() {
    this.vanityLoginDto.applyFilter = this.applyFilter;
    this.findHighLevelDetailReports();
  }

  findHighLevelDetailReports(){
    this.loader = true;
    this.dashboardService.findHighLevelAnalyticsOfDetailReports(this.vanityLoginDto)
    .subscribe(
      (response) => {
    this.detailReports =response.data;
    this.loader =false;
    this.statusCode =200;
  },
  (error) => {
    this.xtremandLogger.error(error);
    this.loader = false;
    this.statusCode = 0;
  }
  );
}


}

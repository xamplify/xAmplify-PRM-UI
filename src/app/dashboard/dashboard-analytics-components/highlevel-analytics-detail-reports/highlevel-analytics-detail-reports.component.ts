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
  styleUrls: ['./highlevel-analytics-detail-reports.component.css'],
  providers: [Properties]
})
export class HighlevelAnalyticsDetailReportsComponent implements OnInit {

  loader = false;
  statusCode = 200;
  detailReportsForOnboardPartners:any;
  detailReportsForActivePartners:any;
  detailReportsForInActivePartners: any;
  detailReportsForTotalPartners: any;
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
    this.findHighLevelDetailReportsForOnboardPartners()
    this.findHighLevelDetailReportsForActivePartners();
    this.findHighLevelDetailReportsForTotalPartners();
    this.findHighLevelDetailReportsForInActivePartners();
  }

  findHighLevelDetailReportsForOnboardPartners(){
    this.loader = true;
    this.dashboardService.findHighLevelAnalyticsOfDetailReportsForOnboardPartners(this.vanityLoginDto)
    .subscribe(
      (response) => {
    this.detailReportsForOnboardPartners =response.data;
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

//For Active Partners
findHighLevelDetailReportsForActivePartners(){
  this.loader = true;
  this.dashboardService.findHighLevelAnalyticsOfDetailReportsForActivePartners(this.vanityLoginDto)
  .subscribe(
    (response) => {
  this.detailReportsForActivePartners =response.data;
  this.loader =false;
  this.statusCode =200;
},
(error) => {
  this.xtremandLogger.error(error);
  this.loader = false;
  this.statusCode = 0;
});};
/************ For InActive Partner ************/
findHighLevelDetailReportsForInActivePartners(){
  this.loader = true;
  this.dashboardService.findHighLevelAnalyticsOfDetailReportsForInActivePartners(this.vanityLoginDto)
  .subscribe(
    (response) => {
  this.detailReportsForInActivePartners =response.data;
  this.loader =false;
  this.statusCode =200;
},
(error) => {
  this.xtremandLogger.error(error);
  this.loader = false;
  this.statusCode = 0;
});};
/******** For Total Partners **************/
findHighLevelDetailReportsForTotalPartners(){
  this.loader = true;
  this.dashboardService.findHighLevelAnalyticsOfDetailReportsForTotalPartners(this.vanityLoginDto)
  .subscribe(
    (response) => {
  this.detailReportsForTotalPartners =response.data;
  this.loader =false;
  this.statusCode =200;
},
(error) => {
  this.xtremandLogger.error(error);
  this.loader = false;
  this.statusCode = 0;
});};
}

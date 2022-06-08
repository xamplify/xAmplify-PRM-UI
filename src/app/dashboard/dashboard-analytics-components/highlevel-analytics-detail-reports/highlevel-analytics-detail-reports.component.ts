import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { DashboardModuleAnalyticsViewDto } from 'app/dashboard/models/dashboard-module-analytics-view-dto';
import { HighLevelAnalyticsDetailReportDTO } from 'app/dashboard/models/highlevel-analytics-detail-report';
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
 
  detailReportsForTotalUsers: Array<HighLevelAnalyticsDetailReportDTO> = new Array<HighLevelAnalyticsDetailReportDTO>();;
  
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
   
    this.findHighLevelDetailReportsForTotalUsers();
  }
  

/****** For Total Users *******/
findHighLevelDetailReportsForTotalUsers(){
  this.loader = true;
  this.dashboardService.findHighLevelAnalyticsOfDetailReportsForTotalUsersTile(this.vanityLoginDto)
  .subscribe(
    (response) => {
  this.detailReportsForTotalUsers =response.data;

  this.loader =false;
  this.statusCode =200;
},
(error) => {
  this.xtremandLogger.error(error);
  this.loader = false;
  this.statusCode = 0;
});};
goToManage(dto:HighLevelAnalyticsDetailReportDTO){
  if(dto.hasAccess){
    this.loader = true;
    let moduleId = dto.moduleId;
    if(moduleId==1){
      /************* Total Partners **********/
      this.router.navigate(["/home/dashboard"]);
    }else if(moduleId==2){
      /************* Onboard Partners *********/
      this.router.navigate(["/home/dashboard"]);
    }else if(moduleId==3 ){
      /***** Active Partners ,InActive Partners **********/
      this.router.navigate(["/home/partners/analytics"]);
    }else if( moduleId == 4 ){
      /***** InActive Partners **********/
      this.router.navigate(["/home/partners/analytics/"+1]);
    }else if(moduleId==5){
      /****** Launched Campaigns **********/
      this.router.navigate(["/home/campaigns/manage"]);
    }else if (moduleId == 6){
      /***** Redistributed Campaigns *****/
      this.router.navigate(["/home/dashboard"])
    }else if(moduleId==7){
       /********** Share Leads **********/
      this.router.navigate(["/home/assignleads/manage"]);
    }else if(moduleId == 8){
      /*******Total Contacts ********/
      this.router.navigate(["/home/dashboard"]);
    }else if(moduleId==9){
        /****** Total Users *********/
      this.router.navigate(["/home/team/add-team"]);
    }
  }

}

getPatnerDiv(moduleId: number){
  this.selectedTabIndex = moduleId;
}
}

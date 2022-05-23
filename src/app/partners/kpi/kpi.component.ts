import { Component, OnInit, Input } from '@angular/core';
import { MdfService } from 'app/mdf/services/mdf.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import  {ParterService} from '../services/parter.service';
import {KpiDto} from 'app/common/models/kpi-dto';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DashboardService } from 'app/dashboard/dashboard.service';
@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
  providers: [Properties,MdfService]
})
export class KpiComponent implements OnInit {
  loggedInUserCompanyId:number = 0;
  loggedInUserId:number = 0;
  leadsToDealsConversionDto:KpiDto = new KpiDto();
  opportunityAmountDto:KpiDto = new KpiDto();
  mdfDto:KpiDto = new KpiDto();
  companyIdError = false;
  leadsToDealsConversionInPercentage = "-";
  opportunityAmount: any;
  mdfTotalBalance: any;
  mdfUsedBalance: any;
  mdfTotalBalanceInString:any;
  mdfUsedBalanceInString:any;
  hasLeadsAndDealsAccess = false;
  mdfAccess = false;
  headerText = "";
  loader = false;
  @Input() applyTeamMemberFilter:boolean;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  vanityLogin: boolean;

  constructor(public dashboardService:DashboardService,public mdfService:MdfService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,public referenceService:ReferenceService,public partnerService:ParterService
    ) { 
      this.loggedInUserId = this.authenticationService.getUserId();
      this.vanityLoginDto.userId = this.loggedInUserId;
      let companyProfileName = this.authenticationService.companyProfileName;
      if (companyProfileName !== undefined && companyProfileName !== "") {
        this.vanityLoginDto.vendorCompanyProfileName = companyProfileName;
        this.vanityLoginDto.vanityUrlFilter = true;
      }
    }

  ngOnInit() {
    this.refreshKpis();
  }

  refreshKpis(){
    this.loader = true;
    this.getModuleDetails();
  }

  getModuleDetails(){
    this.authenticationService.getModuleAccessByLoggedInUserId().subscribe(
      response=>{
          this.hasLeadsAndDealsAccess = response.enableLeads;
          this.mdfAccess = response.mdf;
      },error=>{
        this.setErrorResponse(error);
      },()=>{
          this.getCompanyId();
      }
    );
}

  getCompanyId() {
    this.startAllLoaders();
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        this.loggedInUserCompanyId = result;
        this.companyIdError = false;
      }, (error: any) => {
        this.setErrorResponse(error);
      },
      () => {
       this.setHeaderText();
        if(this.hasLeadsAndDealsAccess){
          this.findOpportunityAmountAndLeadToDealConversionPercentage();
        }
        if(this.mdfAccess){
          this.getMdfKpis();
        }
        if(!this.hasLeadsAndDealsAccess){
          this.leadsToDealsConversionDto.loader = false;
          this.opportunityAmountDto.loader = false;
        } 
        if(!this.mdfAccess){
          this.mdfDto.loader = false;
        }
      }
    );
  }

  findOpportunityAmountAndLeadToDealConversionPercentage(){
    this.vanityLoginDto.applyFilter = this.applyTeamMemberFilter;
    this.dashboardService.getPieChartStatisticsDealData(this.vanityLoginDto).subscribe(
      (response) =>{
        let statisticsData = response.data;
        if(statisticsData.length!=null && statisticsData.length>0){
          this.opportunityAmount = statisticsData[0]['weightOfPie'];
          this.leadsToDealsConversionInPercentage  = statisticsData[1]['weightOfPie'];
        }else{
          this.opportunityAmount = "-";
          this.leadsToDealsConversionInPercentage  = "-";
        }
       
        this.leadsToDealsConversionDto.loader = false;
        this.opportunityAmountDto.loader = false;
      },
      (error) => {
        this.xtremandLogger.log(error);
        this.leadsToDealsConversionDto.loader = false;
        this.leadsToDealsConversionInPercentage = 'Error';
        this.opportunityAmountDto.loader = false;
        this.opportunityAmount = "-";
      }
    );
  }

  setHeaderText(){
    if(this.hasLeadsAndDealsAccess && this.mdfAccess){
      this.headerText = "Deals | Opportunities | MDF";
    }else if(this.hasLeadsAndDealsAccess && !this.mdfAccess){
      this.headerText = "Deals | Opportunities";
    }else if(!this.hasLeadsAndDealsAccess && this.mdfAccess){
      this.headerText = "MDF";
    }
    this.loader = false;
  }

  setErrorResponse(error){
    this.xtremandLogger.log(error);
    this.stopAllLoaders();
    this.companyIdError = true;
    this.loader = false;
  }
  getMdfKpis() {
    this.mdfDto.loader = true;
    this.mdfService.getVendorMdfAmountTilesInfo(this.loggedInUserCompanyId,this.applyTeamMemberFilter).subscribe((result: any) => {
      this.mdfTotalBalance = result.data.totalBalance;
      this.mdfUsedBalance = result.data.usedBalance;
      this.mdfTotalBalanceInString = result.data.totalBalanceInString;
      this.mdfUsedBalanceInString = result.data.usedBalanceInString;
      this.mdfDto.loader = false;
    }, error => {
      this.xtremandLogger.log(error);
      this.mdfDto.loader = false;
      this.mdfTotalBalance = 0;
      this.mdfUsedBalance = 0;
    });
  }
  startAllLoaders(){
    this.leadsToDealsConversionDto.loader = true;
    this.opportunityAmountDto.loader = true;
    this.mdfDto.loader = true;
  }
  stopAllLoaders(){
    this.leadsToDealsConversionDto.loader = false;
    this.opportunityAmountDto.loader = false;
    this.mdfDto.loader = false;
  }

}

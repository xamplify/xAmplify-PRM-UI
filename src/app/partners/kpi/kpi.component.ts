import { Component, OnInit } from '@angular/core';
import { MdfService } from 'app/mdf/services/mdf.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import  {ParterService} from '../services/parter.service';
import {KpiDto} from 'app/common/models/kpi-dto';
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
  constructor(public mdfService:MdfService,public authenticationService:AuthenticationService,public xtremandLogger:XtremandLogger,public referenceService:ReferenceService,public partnerService:ParterService
    ) { 
      this.loggedInUserId = this.authenticationService.getUserId();
    }

  ngOnInit() {
    this.getCompanyId();
  }
  getCompanyId() {
    this.startAllLoaders();
    this.referenceService.getCompanyIdByUserId(this.loggedInUserId).subscribe(
      (result: any) => {
        this.loggedInUserCompanyId = result;
        this.companyIdError = false;
      }, (error: any) => {
        this.xtremandLogger.log(error);
        this.stopAllLoaders();
        this.companyIdError = true;
      },
      () => {
        this.findLeadsToDealsConversionPercentage();
        this.findLeadsOpportunityAmount();
        this.getMdfKpis();
      }
    );
  }

  findLeadsToDealsConversionPercentage(){
    this.partnerService.findLeadsToDealsConversionPercentage(this.loggedInUserCompanyId).subscribe(
      response=>{
        this.leadsToDealsConversionInPercentage = response.data;
        this.leadsToDealsConversionDto.loader = false;
      },error=>{
        this.xtremandLogger.log(error);
        this.leadsToDealsConversionDto.loader = false;
        this.leadsToDealsConversionInPercentage = 'Error';
      }
    );
  }

  findLeadsOpportunityAmount(){
    this.partnerService.findLeadsOpportunityAmount(this.loggedInUserCompanyId).subscribe(
      response=>{
        this.opportunityAmount = response.data;
        this.opportunityAmountDto.loader = false;
      },error=>{
        this.xtremandLogger.log(error);
        this.opportunityAmountDto.loader = false;
        this.opportunityAmount = "-";
      }
    );
  }

  getMdfKpis() {
    this.mdfDto.loader = true;
    this.mdfService.getVendorMdfAmountTilesInfo(this.loggedInUserCompanyId).subscribe((result: any) => {
      this.mdfTotalBalance = result.data.totalBalance;
      this.mdfUsedBalance = result.data.usedBalance;
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

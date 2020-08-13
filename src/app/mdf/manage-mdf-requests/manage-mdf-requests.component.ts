import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { MdfRequest } from '../models/mdf.request';
import { MdfRequestAnalytics } from '../models/mdf.request.analytics';
import { MdfRequestStatusAndBalanceInfo } from '../models/mdf.request.status.balance.info';
import { MdfRequestOwnerAndPartnerInfo } from '../models/mdf.request.owner.partner';

@Component({
  selector: 'app-manage-mdf-requests',
  templateUrl: './manage-mdf-requests.component.html',
  styleUrls: ['./manage-mdf-requests.component.css']
})
export class ManageMdfRequestsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  mdfRequest:MdfRequest = new MdfRequest();
  mdfRequestsPartnersInfoList: Array<MdfRequest> = new Array<MdfRequest>();
  mdfRequestAnalytics: MdfRequestAnalytics = new MdfRequestAnalytics();
  mdfRequestStatusAndBalance: MdfRequestStatusAndBalanceInfo = new MdfRequestStatusAndBalanceInfo();
  mdfRequestOwnerAndPartner: MdfRequestOwnerAndPartnerInfo = new MdfRequestOwnerAndPartnerInfo();
  vendorCompanyId: number;
  workflowStepsFilePath: string;
  partnerCompanyId: number;
  wfStepsList:any = [];

  constructor(private mdfService: MdfService, private pagerService: PagerService) {
    this.workflowStepsFilePath = 'assets/config-files/mdf.workflow.steps.json';
    this.mdfService.getMdfWorkflowSteps(this.workflowStepsFilePath).subscribe(result => {
      this.wfStepsList = result.workflow_steps;
    }, error => {
      console.log(error);
    });
   }

  ngOnInit() {
    this.getTilesInfo();
  }

  getTilesInfo() {
    this.mdfService.getMdfRequestsAnalyticsForTiles(this.vendorCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.mdfRequestAnalytics = result.data;
        this.getAllMdfRequests(this.pagination);
      }
    }, error => {
      console.log(error);
    });
  }

  getAllMdfRequests(pagination: Pagination) {
    this.mdfService.getMdfRequestsAnalyticsForPagination(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        pagination.totalRecords = result.totalRecords;
        this.mdfRequestsPartnersInfoList = result.data;
        pagination = this.pagerService.getPagedItems(pagination, this.mdfRequestsPartnersInfoList);
      }
    }, error => {
      console.log(error);
    });
  }

  getMdfRequestStatusAndBalanceDetails() {
    this.mdfService.getMdfRequestStatusAndBalanceDetails(this.vendorCompanyId, this.partnerCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.mdfRequestStatusAndBalance = result.data;
      }
    }, error => {
      console.log(error);
    });
  }

  getMdfRequestOwnerAndPartnerManagerDetails() {
    this.mdfService.getMdfRequestOwnerAndPartnerManagerDetails(this.partnerCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.mdfRequestOwnerAndPartner = result.data;
      }
    }, error => {
      console.log(error);
    });
  }

  saveMdfRequest(){
    this.mdfService.saveMdfRequest(this.mdfRequest).subscribe((result:any) => {
      if (result.statusCode === 200) {
        this.mdfRequest = result;
      }
    }, error => {
      console.log(error);
    });
  }

  updateMdfRequest(){
    this.mdfService.updateMdfRequest(this.mdfRequest).subscribe((result:any) => {
      if (result.statusCode === 200) {
        this.mdfRequest = result;
      }
    }, error => {
      console.log(error);
    });
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllMdfRequests(this.pagination);
  }
}

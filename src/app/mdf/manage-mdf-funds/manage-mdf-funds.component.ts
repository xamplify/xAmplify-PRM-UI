import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import { MdfFunds } from '../models/mdf.funds';
import { MdfCreditTransaction } from '../models/mdf.credit.history';

@Component({
  selector: 'app-manage-mdf-funds',
  templateUrl: './manage-mdf-funds.component.html',
  styleUrls: ['./manage-mdf-funds.component.css']
})
export class ManageMdfFundsComponent implements OnInit {

  pagination: Pagination = new Pagination();
  mdfCreditTransaction: MdfCreditTransaction = new MdfCreditTransaction();
  mdfFundsPartnersInfoList: Array<MdfFunds> = new Array<MdfFunds>();
  vendorCompanyId: number;
  constructor(private mdfService: MdfService, private pagerService: PagerService) { }

  ngOnInit() {
    this.getTilesInfo();
  }

  getTilesInfo() {
    this.mdfService.getMdfFundsAnalyticsForTiles(this.vendorCompanyId).subscribe((result: any) => {
      if (result.statusCode === 200) {
        this.getAllMdfFunds(this.pagination);
      }
    }, error => {
      console.log(error);
    });
  }

  getAllMdfFunds(pagination: Pagination) {
    this.mdfService.getMdfFundsAnalyticsForPagination(pagination).subscribe((result: any) => {
      if (result.statusCode === 200) {
        pagination.totalRecords = result.totalRecords;
        this.mdfFundsPartnersInfoList = result.data;
        pagination = this.pagerService.getPagedItems(pagination, this.mdfFundsPartnersInfoList);
      }
    }, error => {
      console.log(error);
    });
  }

  addCreditTransaction() {
    this.mdfService.addCreditTransaction(this.mdfCreditTransaction).subscribe((result: any) => {
      if (result.statusCode === 200) {
      }
    }, error => {
      console.log(error);
    });
  }

  /************Page************** */
  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.getAllMdfFunds(this.pagination);
  }
}

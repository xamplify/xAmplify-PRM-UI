import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partner-reports.component.html',
  styleUrls: ['./partner-reports.component.css']
})
export class PartnerReportsComponent implements OnInit {
  worldMapdataReport: any;
  companyId: number;

  constructor(public router: Router, public authenticationService: AuthenticationService,
    public referenseService: ReferenceService, public parterService: ParterService) {
  }

  gotoMange() {
    this.router.navigateByUrl('/home/partners/manage');
  }
  clickWorldMapReports(event) {
    console.log(event);
  }
  partnerReportData() {
    this.parterService.partnerReports(this.referenseService.companyId).subscribe(
      (data: any) => {
        console.log(data);
        this.worldMapdataReport = data.countrywisePartnersCount.countrywisepartners;
      },
      (error: any) => { console.log('error got here') });
  }
  ngOnInit() {
    this.worldMapdataReport = [];
    this.partnerReportData();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partner-reports.component.html',
  styleUrls: ['./partner-reports.component.css']
})
export class PartnerReportsComponent implements OnInit {
  worldMapdataReport: any;

  constructor(public router: Router, public authenticationService: AuthenticationService) { }

  gotoMange(){
    this.router.navigateByUrl('/home/partners/manage');
  }
  clickWorldMapReports(event){
    console.log(event);
  }
  ngOnInit() {
    this.worldMapdataReport = [];
  }

}

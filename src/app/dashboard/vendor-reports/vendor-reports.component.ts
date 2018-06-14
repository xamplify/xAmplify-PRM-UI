import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';

@Component({
  selector: 'app-vendor-reports',
  templateUrl: './vendor-reports.component.html',
  styleUrls: ['./vendor-reports.component.css']
})
export class VendorReportsComponent implements OnInit {

  constructor(public referenseService:ReferenceService) { }

  ngOnInit() {
  }

}

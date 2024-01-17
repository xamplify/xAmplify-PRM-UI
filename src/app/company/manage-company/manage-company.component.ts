import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from 'app/core/home/home.component';
import { ReferenceService } from 'app/core/services/reference.service';
import { CompanyService } from '../service/company.service';

@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.css'],
  providers: [HomeComponent,CompanyService],
})
export class ManageCompanyComponent implements OnInit {
companyRouter = "/home/company/manage";
  constructor(public referenceService: ReferenceService, private router: Router, private companyService: CompanyService
    ) { }

  ngOnInit() {
  }
  addCompanyModalOpen(){
    this.companyService.isCompanyModalPopUp = true;
  }
  closeCompanyModal (event: any) {
		if (event === "0") {
			this.companyService.isCompanyModalPopUp = false;
		}	
  }
}

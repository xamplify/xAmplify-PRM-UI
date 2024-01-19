import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from 'app/core/home/home.component';
import { ReferenceService } from 'app/core/services/reference.service';
import { CompanyService } from '../service/company.service';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagerService } from 'app/core/services/pager.service';
import { Properties } from 'app/common/models/properties';
import { Company } from '../models/company';

@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.css'],
  providers: [HomeComponent,CompanyService,Properties],
})
export class ManageCompanyComponent implements OnInit {
companyRouter = "/home/company/manage";
pagination: Pagination = new Pagination();
  loggedInUserId: number;
  selectedContactListId: number;
  selectedContactListName: string;
  showEdit: boolean = false;
  actionType= "add";
  companyId = 0;
  constructor(public referenceService: ReferenceService, private router: Router, private companyService: CompanyService, public authenticationService: AuthenticationService,  public pagerService: PagerService, public properties: Properties,
    ) { this.loggedInUserId = this.authenticationService.getUserId();}

  ngOnInit() {
    this.getCompanyList(this.pagination);
  }
  addCompanyModalOpen(){
    this.companyService.isCompanyModalPopUp = true;
    this.actionType = "add";
    this.companyId = 0;
  }
  closeCompanyModal (event: any) {
		if (event === "0") {
			this.companyService.isCompanyModalPopUp = false;
		}	
  }
  getCompanyList(pagination: Pagination) {
    this.pagination.userId = this.loggedInUserId;
    this.companyService.getCompaniesList(this.pagination).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          pagination.totalRecords = response.data.totalRecords;
          this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
        }
      },
      error => {
      },
      () => { }
    );
  }
  setCompanyPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.listCompanies(this.pagination);
  }
  listCompanies(pagination: Pagination) {
    this.getCompanyList(pagination);
  } 
  editCompany(company: Company){
    this.companyService.isCompanyModalPopUp = true;
    this.actionType = "edit";
    this.companyId = company.id;
  }
  viewCompany(company: Company){
    this.companyService.isCompanyModalPopUp = true;
    this.actionType = "view";
    this.companyId = company.id;
  }
  // editCompanyList(contactSelectedListId: number, contactListName: string,){
  //   this.selectedContactListId = contactSelectedListId;
	// 	this.selectedContactListName = contactListName;
  //   this.showEdit = true;
  // }
  }


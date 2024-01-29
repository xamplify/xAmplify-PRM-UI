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
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { ListLoaderValue } from 'app/common/models/list-loader-value';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { SortOption } from 'app/core/models/sort-option';
import { CustomResponse } from 'app/common/models/custom-response';

declare var  $:any, swal: any;
@Component({
  selector: 'app-manage-company',
  templateUrl: './manage-company.component.html',
  styleUrls: ['./manage-company.component.css'],
  providers: [HomeComponent,CompanyService,HttpRequestLoader,Properties,ListLoaderValue,SortOption],
})
export class ManageCompanyComponent implements OnInit {
companyRouter = "/home/company/manage";
pagination: Pagination = new Pagination();
httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
countsRequestLoader: HttpRequestLoader = new HttpRequestLoader();
customResponse: CustomResponse = new CustomResponse();
  loggedInUserId: number;
  selectedContactListId: number;
  selectedContactListName: string;
  showEdit: boolean = false;
  actionType= "add";
  companyId = 0;
  contactCount: number;
  companyCount: number;
  constructor(public referenceService: ReferenceService, private router: Router, public companyService: CompanyService, public authenticationService: AuthenticationService,  public pagerService: PagerService, public properties: Properties,public listLoaderValue: ListLoaderValue,public xtremandLogger: XtremandLogger, public utilService: UtilService, public sortOption: SortOption
    ) { this.loggedInUserId = this.authenticationService.getUserId();}

  ngOnInit() {
    this.showCompanies();
  } 

  showCompanies (){
    this.getCompanyList(this.pagination);
    this.getCounts();
  }
  navigateToAddContactsPage(id:number){
    this.referenceService.goToRouter("/home/contacts/company/"+id);
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
  searchKeyPress(keyCode: any) {
    if (keyCode === 13) { 
      this.search(); 
    } 
  } 
  search() {		
    this.getAllFilteredResults(this.pagination);
	}

  getAllFilteredResults(pagination: Pagination) {
    pagination.pageIndex = 1;
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedSortedOption, pagination);
    this.getCompanyList(this.pagination);
  }
  getSortedResults(text: any) {
    this.sortOption.selectedSortedOption = text;
    this.getAllFilteredResults(this.pagination);
  }
  getCompanyList(pagination: Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.pagination.userId = this.loggedInUserId;
    this.companyService.getCompaniesList(this.pagination).subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.sortOption.totalRecords = response.data.totalRecords;
          pagination.totalRecords = response.data.totalRecords;
          this.pagination = this.pagerService.getPagedItems(this.pagination, response.data.list);
          this.referenceService.loading(this.httpRequestLoader, false);
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
  showAlert(companyId: number) {
		try {
			this.xtremandLogger.info("companyId in sweetAlert() " + companyId);
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#54a7e9',
				cancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function(myData: any) {
				self.deleteCompany(companyId);
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.xtremandLogger.error(error, "ManageCompanyComponent", "deleteCompanyListAlert()");
		}
	}
  deleteCompany(companyId: number){
    this.companyService.deleteCompany(companyId, this.loggedInUserId)
      .subscribe(
        (data: any) => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (data.statusCode == 200) {
            this.showCompanies();
            this.customResponse = new CustomResponse('SUCCESS', "Company Deleted Successfully" , true);
          }
        },
        error => {
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        () => { }
      );
  }

  getCounts(){
    this.referenceService.loading(this.countsRequestLoader, true);
    this.companyService.getCounts(this.loggedInUserId)
    .subscribe(
      (data: any) => {
        this.referenceService.loading(this.countsRequestLoader, false);
        if (data.statusCode == 200) {
          this.companyCount = data.data.companyCount;
          this.contactCount =  data.data.contactCounts;
        }
      },
      error => {
        this.countsRequestLoader.isServerError = true;
      },
      () => { }
    );
  }

  showSubmitCompanySuccess() {
    if( this.actionType === "edit"){
      this.customResponse = new CustomResponse('SUCCESS', "Company Updated Successfully", true);
    } else if (this.actionType === "add") {
      this.customResponse = new CustomResponse('SUCCESS', "Company Added Successfully", true);
    }  else {
      this.customResponse = new CustomResponse('SUCCESS', "Company Submitted Successfully", true);
    }
    this.companyService.isCompanyModalPopUp = false;
    this.showCompanies();
  }

  }


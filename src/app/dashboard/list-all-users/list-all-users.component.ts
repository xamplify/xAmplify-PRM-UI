import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { Router } from '@angular/router';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
declare var  $: any;


@Component({
  selector: 'app-list-all-users',
  templateUrl: './list-all-users.component.html',
  styleUrls: ['./list-all-users.component.css'],
  providers: [Pagination, HttpRequestLoader, Properties,SortOption]

})
export class ListAllUsersComponent implements OnInit {
  loading = false;
  hasError: boolean;
  statusCode: any;
  pagination: Pagination = new Pagination();
  
  constructor(public dashboardService:DashboardService,public referenceService: ReferenceService,
    public httpRequestLoader: HttpRequestLoader,
    public pagerService: PagerService, public authenticationService: AuthenticationService, public router: Router, 
    public logger: XtremandLogger, public sortOption: SortOption,private utilService:UtilService ) {
      if(this.authenticationService.getUserId()!=1){
          this.router.navigate(['/access-denied']);
      }
     }

  ngOnInit() {
    this.listAllApprovedUsers(this.pagination);
  }

  listAllApprovedUsers(pagination:Pagination){
    this.hasError = false;
    this.referenceService.loading( this.httpRequestLoader, true );
    this.dashboardService.listAllApprovedUsers( pagination ).subscribe(
        ( response: any ) => {
            this.statusCode = response.statusCode;
            if(this.statusCode==200){
                const data = response.data;
                pagination.totalRecords = data.totalRecords;
                this.sortOption.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.list);
            }
            this.referenceService.loading( this.httpRequestLoader, false );
        },
        ( error: any ) => { this.hasError = true; this.referenceService.loading( this.httpRequestLoader, false );} );
  }


    /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy( text: any ) {
    this.sortOption.selectedActiveUsersSortOption = text;
    this.getAllFilteredResults( this.pagination );
}


/*************************Search********************** */
search() {
    this.getAllFilteredResults( this.pagination );
}

paginationDropdown(items:any){
    this.sortOption.itemsSize = items;
    this.getAllFilteredResults(this.pagination);
}

/************Page************** */
setPage( event: any ) {
    this.pagination.pageIndex = event.page;
    this.listAllApprovedUsers( this.pagination);
}

getAllFilteredResults( pagination: Pagination ) {
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = this.sortOption.searchKey;
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedActiveUsersSortOption, this.pagination);
    this.listAllApprovedUsers( this.pagination);
}
eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.search(); } }
refreshList(){
    this.pagination.pageIndex = 1;
    this.sortOption.searchKey = "";
    this.pagination.searchKey = "";
    this.sortOption.selectedActiveUsersSortOption = this.sortOption.activeUsersSortDropDownOptions[4];
    this.pagination = this.utilService.sortOptionValues(this.sortOption.selectedActiveUsersSortOption, this.pagination);
    this.listAllApprovedUsers(this.pagination);
}

loginAs(result: any) {
  this.loginAsTeamMember(result.emailId, false,result.userId);

}

loginAsTeamMember(emailId: string, isLoggedInAsAdmin: boolean,userId:number) {
  this.loading = true;
  this.referenceService.loaderFromAdmin = true;
  this.authenticationService.getUserByUserName(emailId)
    .subscribe(
      response => {
        if (isLoggedInAsAdmin) {
          localStorage.removeItem('loginAsUserId');
          localStorage.removeItem('loginAsUserEmailId');
        } else {
          let loginAsUserId = JSON.parse(localStorage.getItem('loginAsUserId'));
          if (loginAsUserId == null) {
            localStorage.loginAsUserId = JSON.stringify(userId);
            localStorage.loginAsUserEmailId = JSON.stringify(this.authenticationService.user.emailId);
          }
        }
        this.utilService.setUserInfoIntoLocalStorage(emailId, response);
        let self = this;
        setTimeout(function () {
          self.router.navigate(['home/dashboard/'])
            .then(() => {
              window.location.reload();
            })
        }, 500);
      },
      (error: any) => {
        this.referenceService.showSweetAlertErrorMessage("Unable to Login as.Please try after sometime");
        this.loading = false;
      },
      () => this.logger.info('Finished loginAsTeamMember()')
    );
}

logoutAsTeamMember() {
  let adminEmailId = JSON.parse(localStorage.getItem('adminEmailId'));
  this.loginAsTeamMember(adminEmailId, true,1);
}

}

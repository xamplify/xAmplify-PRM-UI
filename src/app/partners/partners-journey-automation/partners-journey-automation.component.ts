import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Pagination } from '../../core/models/pagination';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { UtilService } from '../../core/services/util.service';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ParterService } from '../services/parter.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { SortOption } from 'app/core/models/sort-option';


@Component({
  selector: 'app-partners-journey-automation',
  templateUrl: './partners-journey-automation.component.html',
  styleUrls: ['./partners-journey-automation.component.css'],
  providers:[Properties,SortOption]
})
export class PartnersJourneyAutomationComponent implements OnInit {
  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loading = false;
  sortOption:SortOption = new SortOption();
  constructor(private router: Router, public userService: UserService, public authenticationService: AuthenticationService,
    public referenceService:ReferenceService,public utilService: UtilService,
     public pagerService:PagerService,private partnerService:ParterService,
     private xtremandLogger:XtremandLogger) { }

  ngOnInit() {
    this.findWorkflows(this.pagination);
  }

  goToWorkflow(){this.router.navigate(["/home/partners/partner-workflow"]);}

  findWorkflows(pagination:Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.partnerService.findAllWorkflows(pagination).subscribe(
      response=>{
        if(response.statusCode==200){
          pagination = this.utilService.setPaginatedRows(response,pagination);
          console.log(pagination.pagedItems);
          this.referenceService.stopLoader(this.httpRequestLoader);
        }else{
          let error = {};
          error['status'] = 400;
          this.xtremandLogger.errorPage(error);
        }
      },error=>{
        this.xtremandLogger.errorPage(error);
      });
  }

  findWorkflowsOnEnterKeyPress(eventKeyCode:number){
    if(eventKeyCode==13){
        this.searchWorkflows();
    }
}

  paginateEmailTempaltes(event:any){
    this.pagination.pageIndex = event.page;
    this.findWorkflows(this.pagination);
  }

  sortWorkflows(text: any) {
    this.sortOption.selectedWorkflowDropDownOption = text;
    this.setSearchAndSortOptionsForWorkflows(this.pagination, this.sortOption);
  }

  searchWorkflows(){
      this.setSearchAndSortOptionsForWorkflows(this.pagination,this.sortOption);
  }

  setSearchAndSortOptionsForWorkflows(pagination: Pagination, sortOption: SortOption){
    pagination.pageIndex = 1;
    pagination.searchKey = sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(sortOption.selectedWorkflowDropDownOption, pagination);
    this.findWorkflows(pagination);
  }





}

import { Component, OnDestroy, OnInit,Renderer } from '@angular/core';
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
import { CustomResponse } from 'app/common/models/custom-response';
declare var $:any;

@Component({
  selector: 'app-partners-journey-automation',
  templateUrl: './partners-journey-automation.component.html',
  styleUrls: ['./partners-journey-automation.component.css'],
  providers:[Properties,SortOption]
})
export class PartnersJourneyAutomationComponent implements OnInit,OnDestroy {
  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  loading = false;
  sortOption:SortOption = new SortOption();
  customResponse = new CustomResponse();
  message = "";
  isDeleteOptionClicked = false;
  selectedWorkflowId = 0;
  constructor(private router: Router, public userService: UserService, public authenticationService: AuthenticationService,
    public referenceService:ReferenceService,public utilService: UtilService,
     public pagerService:PagerService,private partnerService:ParterService,
     private xtremandLogger:XtremandLogger,private render: Renderer) {
      this.referenceService.renderer = this.render;
      }


  ngOnInit() {
    if (this.referenceService.isCreated) {
      this.message = "Workflow created successfully";
      this.showMessageOnTop(this.message);
    } else if (this.referenceService.isUpdated) {
      this.message = "Workflow updated successfully";
      this.showMessageOnTop(this.message);
    }
    this.findWorkflows(this.pagination);
  }

  showMessageOnTop(message: string) {
    $(window).scrollTop(0);
    this.customResponse = new CustomResponse("SUCCESS", message, true);
  }

  goToWorkflow(){this.router.navigate(["/home/partners/partner-workflow"]);}

  findWorkflows(pagination:Pagination) {
    this.referenceService.loading(this.httpRequestLoader, true);
    this.partnerService.findAllWorkflows(pagination).subscribe(
      response=>{
        if(response.statusCode==200){
          pagination = this.utilService.setPaginatedRows(response,pagination);
          this.referenceService.loading(this.httpRequestLoader, false);
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

  paginateWorkflows(event:any){
    this.pagination.pageIndex = event.page;
    this.findWorkflows(this.pagination);
  }

  sortWorkflows(text: any) {
    this.sortOption.selectedPartnerJourneyWorkflowDropDownOption = text;
    this.setSearchAndSortOptionsForWorkflows(this.pagination, this.sortOption);
  }

  searchWorkflows(){
      this.setSearchAndSortOptionsForWorkflows(this.pagination,this.sortOption);
  }

  setSearchAndSortOptionsForWorkflows(pagination: Pagination, sortOption: SortOption){
    pagination.pageIndex = 1;
    pagination.searchKey = sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(sortOption.selectedPartnerJourneyWorkflowDropDownOption, pagination);
    this.findWorkflows(pagination);
  }

 

  confirmDeleteWorkflow(id:number){
    this.isDeleteOptionClicked = true;
    this.selectedWorkflowId = id;
  }

  deleteWorkflow(event:any){
    this.customResponse = new CustomResponse();
    if(event){
      this.referenceService.loading(this.httpRequestLoader, true);
      this.partnerService.deleteWorkflow(this.selectedWorkflowId).subscribe(
        response=>{
          this.resetDeleteOptions();
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
          this.referenceService.loading(this.httpRequestLoader, false);
          this.refreshList();
        },error=>{
          this.referenceService.loading(this.httpRequestLoader, false);
          let message = this.referenceService.showHttpErrorMessage(error);
          this.customResponse = new CustomResponse('ERROR', message, true);
          this.resetDeleteOptions();
        }
      );
    }else{
      this.resetDeleteOptions();
    }
   
  }

  resetDeleteOptions(){
    this.isDeleteOptionClicked = false;
    this.selectedWorkflowId = 0;
  }

  refreshList() {
    this.referenceService.scrollSmoothToTop();
    this.pagination.pageIndex = 1;
    this.pagination.searchKey = "";
    this.findWorkflows(this.pagination);
  }

  ngOnDestroy(): void {
    this.referenceService.isCreated = false;
    this.referenceService.isUpdated = false;
  }




}

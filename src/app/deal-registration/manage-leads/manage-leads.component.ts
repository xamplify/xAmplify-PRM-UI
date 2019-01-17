import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { DealRegistrationService } from '../services/deal-registration.service';


@Component({
  selector: 'app-manage-leads',
  templateUrl: './manage-leads.component.html',
  styleUrls: ['./manage-leads.component.css'],
  providers: [Pagination, HomeComponent,HttpRequestLoader,SortOption, ListLoaderValue]
})
export class ManageLeadsComponent implements OnInit {

    @Input() partner: any;
    @Input() campaignId: any;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    pagination:Pagination = new Pagination();
    
  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService, 
          public utilService: UtilService,public referenceService: ReferenceService,
          private dealRegistrationService:DealRegistrationService,public homeComponent: HomeComponent,public xtremandLogger:XtremandLogger,
          public sortOption:SortOption,public pagerService: PagerService) { }

  ngOnInit() {
      this.listLeads(this.pagination);
  }

  
  
  listLeads(pagination:Pagination){
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.userId = this.partner.partnerId;
      pagination.campaignId = this.campaignId;
      this.dealRegistrationService.listLeads(pagination)
          .subscribe(
              data => {
                  this.sortOption.totalRecords = data.totalRecords;
                  pagination.totalRecords = data.totalRecords;
                  pagination = this.pagerService.getPagedItems(pagination, data.leads);
                  this.referenceService.loading(this.httpRequestLoader, false);
              },
              ( error: any ) => {
                  this.httpRequestLoader.isServerError = true;
              }
          );
  
  }
  
  
  
  /********Pages Navigation***********/
  navigatePages( event: any ) {
     this.pagination.pageIndex = event.page;
     this.listLeads(this.pagination);
    }
  /*****Dropdown**********/
  changeSize(items: any,type:any) {
      this.sortOption.itemsSize = items;
      this.getAllFilteredResults(this.pagination);

  }
  
  
  sortLeads(text:any){
      this.sortOption.selectedSortedOption = text;
      this.getAllFilteredResults(this.pagination);
  }
  
  searchLeadsKeyPress(keyCode:any){if (keyCode === 13) {   this.getAllFilteredResults(this.pagination); }}
  
  searchLeads(){
      this.getAllFilteredResults(this.pagination);
  }
  
  getAllFilteredResults(pagination:Pagination){
      pagination.pageIndex = 1;
      pagination.searchKey = this.sortOption.searchKey;
      if (this.sortOption.itemsSize.value == 0) {
          pagination.maxResults = pagination.totalRecords;
      } else {
          pagination.maxResults = this.sortOption.itemsSize.value;
      }
      let sortedValue = this.sortOption.selectedSortedOption.value;
      this.setSortColumns(pagination, sortedValue);
      this.listLeads(pagination);
  
  }
  
  setSortColumns(pagination:Pagination,sortedValue:any){
      if (sortedValue != "") {
          let options: string[] = sortedValue.split("-");
          pagination.sortcolumn = options[0];
          pagination.sortingOrder = options[1];
      }
  }
  
  
  showComments(dealId:number){
      alert("Welcome To Comment Section for the deal "+dealId);
  }
  
  
  
  
  
  
}

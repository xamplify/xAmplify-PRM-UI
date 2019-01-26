import { Component, OnInit,Input, OnChanges, SimpleChanges, SimpleChange, Output } from '@angular/core';
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
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { EventEmitter } from '@angular/core';
declare var swal: any;



@Component({
  selector: 'app-manage-leads',
  templateUrl: './manage-leads.component.html',
  styleUrls: ['./manage-leads.component.css'],
  providers: [Pagination, HomeComponent,HttpRequestLoader,SortOption, ListLoaderValue,CallActionSwitch]
})
export class ManageLeadsComponent implements OnInit,OnChanges {

    @Input() partner: any;
    @Input() campaignId: any;
    @Input() filter:string;
    @Output() dealObj = new EventEmitter<any>();
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    pagination:Pagination = new Pagination();
    selectedDealId: any;
    isDealAnalytics: boolean = false;

   
    
  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService, 
          public utilService: UtilService,public referenceService: ReferenceService,
          private dealRegistrationService:DealRegistrationService,public homeComponent: HomeComponent,public xtremandLogger:XtremandLogger,
          public sortOption:SortOption,public pagerService: PagerService, public callActionSwitch: CallActionSwitch) { }

  ngOnInit() {
    this.listLeadsBasedOnFilters();
   
  }
  ngOnChanges(changes: SimpleChanges) {
    const filter: SimpleChange = changes.filter;
    console.log('prev value: ', filter.previousValue);
    console.log('got name: ', filter.currentValue);
    this.filter = filter.currentValue;
    console.log(this.filter);
    this.listLeadsBasedOnFilters();
  }
  listLeadsBasedOnFilters(){
      switch(this.filter){
        case "TOTAL":{ 
          
            this.listAllLeads(this.pagination);
        break;
        }
        case "OPENED": {
            
            this.listOpenedLeads(this.pagination);
            break;
        }
        case "CLOSED": {
          
            this.listClosedLeads(this.pagination);
            break;
        }
        default:{
          
            this.listLeads(this.pagination);
            break;
        }
      }
       
  }
  listAllLeads(pagination:Pagination){
      
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.userId = this.authenticationService.getUserId();
   
    this.dealRegistrationService.listAllLeads(pagination)
        .subscribe(
            data => {
               
                this.sortOption.totalRecords = data.totalRecords;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.leads);
                this.referenceService.loading(this.httpRequestLoader, false);
                console.log(pagination);
            },
            ( error: any ) => {
                this.httpRequestLoader.isServerError = true;
            }
        );

}
listOpenedLeads(pagination:Pagination){
    
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.userId = this.authenticationService.getUserId();
   
    this.dealRegistrationService.listOpenedLeads(pagination)
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
listClosedLeads(pagination:Pagination){
      
    this.referenceService.loading(this.httpRequestLoader, true);
    pagination.userId = this.authenticationService.getUserId();
   
    this.dealRegistrationService.listClosedLeads(pagination)
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
  
  listLeads(pagination:Pagination){
      
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.userId = this.partner.partnerId;
      pagination.campaignId = this.campaignId;
      this.dealRegistrationService.listLeads(pagination)
          .subscribe(
              data => {
                  console.log(data)
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
      this.listLeadsBasedOnFilters();
  
  }
  
  setSortColumns(pagination:Pagination,sortedValue:any){
      if (sortedValue != "") {
          let options: string[] = sortedValue.split("-");
          pagination.sortcolumn = options[0];
          pagination.sortingOrder = options[1];
      }
  }
  setDealStatus(dealId:number,event:any){
    try {
        let self = this;
        if(event)
        self.dealRegistrationService.acceptDeal(dealId).subscribe(data =>{
           console.log(data); 
        });
        else
        self.dealRegistrationService.rejectDeal(dealId).subscribe(data =>{
            console.log(data); 
         });
       
        // swal( {
        //     title: 'Are you sure?',
        //     text: event ?'You want to Accept this deal':'You want to Reject this deal' ,
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#54a7e9',
        //     cancelButtonColor: '#999',
        //     confirmButtonText: event?'Accept':'Reject'

        // }).then( function( myData: any ) {
        //     if(event)
        //         self.dealRegistrationService.acceptDeal(dealId).subscribe(data =>{
        //            console.log(data); 
        //         });
        //     else
        //         self.dealRegistrationService.rejectDeal(dealId).subscribe(data =>{
        //             console.log(data); 
        //          });
        // }, function( dismiss: any ) {
        //     event = false;
        //     console.log( 'you clicked on option' + dismiss );
        // });
    } catch ( error ) {
        this.xtremandLogger.error( error, "ManageContactsComponent", "deleteContactListAlert()" );
    }
  }
  dealRouter(deal:any,event:any){
     this.selectedDealId = deal.dealId;
     this.isDealAnalytics = true;
     this.dealObj.emit(deal);
    //this.router.navigate(['home/deals/'+deal.dealId+'/details']);
  }
  showComments(dealId:number){
      alert("Welcome To Comment Section for the deal "+dealId);
  }
  

}

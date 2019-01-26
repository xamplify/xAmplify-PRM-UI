import { Component, OnInit,ViewChild } from '@angular/core';
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
import { ManagePartnersComponent } from 'app/deal-registration/manage-partners/manage-partners.component';
import { ManageLeadsComponent } from '../manage-leads/manage-leads.component';
@Component({
  selector: 'app-manage-deals',
  templateUrl: './manage-deals.component.html',
  styleUrls: ['./manage-deals.component.css'],
  providers: [Pagination, HomeComponent,HttpRequestLoader,SortOption, ListLoaderValue],
  
})
export class ManageDealsComponent implements OnInit {

    loggedInUserId:number = 0;
    isListView = false;
    componentName = "manage-deals.component.ts"
    hasClientErrors:boolean = false;
    totalDealsError:boolean = false;
    openedDealsError:boolean = false;
    closedDealsError:boolean = false;
    totalDeals:number = 0;
    openedDeals:number = 0;
    closedDeals:number = 0;
    totalDealsLoader:boolean = false;
    openedDealsLoader:boolean = false;
    closedDealsLoader:boolean = false;
    campaingnList:boolean = false;
    partnerList:boolean = false;
    selectedCampaignId:number = 0;
    filterDeals:string ="";
   
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    campaignsPagination:Pagination = new Pagination();
   
    
    leadList: boolean;
    selectedLeadId: any;
    selectedDealId:any;
    partner: number;
    isDealAnalytics: boolean;

    @ViewChild(ManagePartnersComponent)
    set leadId(partner: ManagePartnersComponent) {
        this.selectedLeadId = partner;
    };
  
   

     
    constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService, 
             public utilService: UtilService,public referenceService: ReferenceService,
              private dealRegistrationService:DealRegistrationService,public homeComponent: HomeComponent,public xtremandLogger:XtremandLogger,
              public sortOption:SortOption,public pagerService: PagerService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.isListView = ! this.referenceService.isGridView;
     
    }

  ngOnInit() {
      try{
          this.campaingnList = true;
          this.getTotalDeals();
          this.getOpenedDeals();
          this.getClosedDeals();
          this.listCampaigns(this.campaignsPagination);
      }catch(error){
          this.catchError(error, "ngOnInit()");
      }
      
  }

  showCampaigns(){
    this.campaignsPagination.pagedItems.forEach(element => {
        element.expand = false;
      });
      this.campaingnList = true;
      this.leadList = false;
      
  }
  /******************Total Deals************************/
  getTotalDeals() {
      try {
          this.totalDealsLoader = true;
          this.dealRegistrationService.getTotalDeals( this.loggedInUserId ).subscribe(
              ( data: any ) => {
                  this.totalDeals = data.data;
                  this.totalDealsLoader = false;
              },
              ( error: any ) => {
                  this.totalDealsError = true;
                  this.totalDealsLoader = false;
              }

          );
      } catch ( error ) {
          this.catchError( error, "getTotalDeals()" );
      }
  }
  /*************Opened Deals****************************/
  getOpenedDeals() {
      try {
          this.openedDealsLoader = true;
          this.dealRegistrationService.getOpenedDeals( this.loggedInUserId ).subscribe(
              ( data: any ) => {
                  this.openedDeals = data.data;
                  this.openedDealsLoader = false;
              },
              ( error: any ) => {
                  this.openedDealsError = true;
                  this.openedDealsLoader = false;
              }

          );
      } catch ( error ) {
          this.catchError( error, "getOpenedDeals()" );
      }
  }
  
  /*************Closed Deals****************************/
  getClosedDeals() {
      try {
          this.closedDealsLoader = true;
          this.dealRegistrationService.getClosedDeals( this.loggedInUserId ).subscribe(
              ( data: any ) => {
                  this.closedDeals = data.data;
                  this.closedDealsLoader = false;
              },
              ( error: any ) => {
                  this.closedDealsError = true;
                  this.closedDealsLoader = false;
              }

          );
      } catch ( error ) {
          this.catchError( error, "getClosedDeals()" );
      }
  }
  
  
  /*********************List Campaigns*****************/
  listCampaigns(pagination: Pagination) {
      this.referenceService.loading(this.httpRequestLoader, true);
      pagination.userId = this.loggedInUserId;
      
      this.dealRegistrationService.listCampaigns(pagination)
          .subscribe(
              data => {
                  
                  this.sortOption.totalRecords = data.totalRecords;
                  pagination.totalRecords = data.totalRecords;
                  pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                  pagination.pagedItems.forEach(element => {
                    element.expand = false;
                  });
                 
                  this.referenceService.loading(this.httpRequestLoader, false);
              },
              ( error: any ) => {
                  this.httpRequestLoader.isServerError = true;
              }
          );
  }
  sortCampaigns(text:any){
      this.sortOption.selectedSortedOption = text;
      this.getAllFilteredResults(this.campaignsPagination);
  }
  
  searchCampaignsKeyPress(keyCode:any){if (keyCode === 13) {   this.getAllFilteredResults(this.campaignsPagination); }}
  
  searchCampaigns(){
      this.getAllFilteredResults(this.campaignsPagination);
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
      this.listCampaigns(pagination);
  
  }
  
  setSortColumns(pagination:Pagination,sortedValue:any){
      if (sortedValue != "") {
          let options: string[] = sortedValue.split("-");
          pagination.sortcolumn = options[0];
          pagination.sortingOrder = options[1];
      }
  }
  
  filterCampaigns(type: string, index: number) {
      this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab
      this.campaignsPagination.pageIndex = 1;
      this.campaignsPagination.campaignType = type;
      this.listCampaigns(this.campaignsPagination);
  }
  
  /********Pages Navigation***********/
   navigatePages( event: any ) {
      this.campaignsPagination.pageIndex = event.page;
      this.listCampaigns( this.campaignsPagination );
     }
   /*****Dropdown**********/
   changeSize(items: any,type:any) {
       this.sortOption.itemsSize = items;
       this.getAllFilteredResults(this.campaignsPagination);

   }
   
   /*********Show Partners***************/
   showPartners(campaign:any){
       console.log(this.selectedLeadId)
       this.selectedCampaignId = campaign.id;
    //    this.campaingnList = false;
        campaign.expand =  !campaign.expand;
       this.partnerList = true;
   }
   showLeads(partner:any){
   this.leadList = true;
   this.campaingnList = false;
   this.partner = partner;
   this.filterDeals = "";
   
    }

   goToReDistributedPartnersDiv(){
        this.filterDeals = "TOTAL";
        this.leadList = true;
        this.campaingnList = false;
       
   }
   showOpenedLeads(){
    this.filterDeals = "OPENED";
    this.leadList = true;
    this.campaingnList = false;
    
   }
   showClosedLeads(){
        this.filterDeals = "CLOSED";
        this.leadList = true;
        this.campaingnList = false;
        
   }

   dealAnalytics(deal:any){
    this.selectedDealId = deal.dealId;
    this.isDealAnalytics = true;
       
      
   }
   dealAnalyticsDisable(){
    this.isDealAnalytics = !this.isDealAnalytics;
   }
  

  
  catchError(error:any,methodName:string){
      this.hasClientErrors = true;
      this.xtremandLogger.showClientErrors(this.componentName, methodName, error);
  }
  
}

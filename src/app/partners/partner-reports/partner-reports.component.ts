import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { ParterService } from '../services/parter.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { SortOption } from '../../core/models/sort-option';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignService } from '../../campaigns/services/campaign.service';
import { User } from '../../core/models/user';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { ListLoaderValue } from '../../common/models/list-loader-value';
import { VendorInvitation } from '../../dashboard/models/vendor-invitation';

declare var $,swal, Highcharts, CKEDITOR: any;

@Component({
  selector: 'app-partner-reports',
  templateUrl: './partner-reports.component.html',
  styleUrls: ['./partner-reports.component.css'],
  providers: [Pagination, HomeComponent,HttpRequestLoader,SortOption, ListLoaderValue]
})
export class PartnerReportsComponent implements OnInit, OnDestroy {
    landingPage: any;
  worldMapdataReport: any;
  companyId: number;
  paginationType: string;
  campaignId: number;
  campaignsCount: number;
  throughPartnerCampaignsCount:number = 0;
  regularCampaign: number;
  socialCampaign: number;
  videoCampaign: number;
  noOfCampaignsLaunchedByPartner = [];
  partnerUserInteraction = [];
  campaignInteractionPagination: Pagination = new Pagination();
  activePartnersPagination:Pagination = new Pagination();
  inActivePartnersPagination:Pagination = new Pagination();
  approvePartnersPagination:Pagination = new Pagination();
  httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  activeParnterHttpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  campaignUserInteractionHttpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
  throughPartnerCampaignPagination:Pagination = new Pagination();
  selectedTabIndex:number = 0;
  loggedInUserId:number = 0;
  activePartnersSearchKey:string = "";
  inActivePartnersSearchKey:string = "";
  partnerCampaignUISearchKey:string = "";
  inActivePartnersCount:number = 0;
  activePartnersCount:number = 0;
  approvePartnersCount:number = 0;
  isListView = false;
  isShowCKeditor = false;
  partnerId: number;
  isValidRequest = false;
  requestText: string;
  isError = false;
  customResponse: CustomResponse = new CustomResponse();
  vendoorInvitation: VendorInvitation = new VendorInvitation();
  worldMapLoader = false;
  constructor(public listLoaderValue: ListLoaderValue, public router: Router, public authenticationService: AuthenticationService, public pagination: Pagination,
    public referenseService: ReferenceService, public parterService: ParterService, public pagerService: PagerService,
    public homeComponent: HomeComponent,public xtremandLogger:XtremandLogger,public campaignService:CampaignService,public sortOption:SortOption,
    public utilService: UtilService) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.utilService.setRouterLocalStorage('partnerAnalytics');
      this.isListView = ! this.referenseService.isGridView;
      this.getModuleAccess();
  }

  gotoMange() {
    this.router.navigateByUrl('/home/partners/manage');
  }
  clickWorldMapReports(event) {
    console.log(event);
  }
  campaignTypeChart(data:any) {
    Highcharts.chart('campaign-type-chart', {
      chart: { type: 'bar' },
      xAxis: {
        categories: ['VIDEO CAMPAIGN', 'SOCIAL CAMPAIGN', 'EMAIL CAMPAIGN', 'EVENT CAMPAIGN'],
        lineWidth: 0,
        minorTickLength: 0,
        tickLength: 0,
      },
      title:{ text:'' },
      yAxis: {
        min: 0,
        visible: false,
        gridLineWidth: 0,
      },
      colors: ['#ffb600', '#be72d3', '#ff3879', '#357ebd'],
      tooltip: {
        formatter: function () {
            return 'Campaign Type: <b>' + this.point.category + '</b><br>Campaigns Count: <b>' + this.point.y;
        }
    },
      plotOptions: { bar: { minPointLength: 3, dataLabels: { enabled: true }, colorByPoint: true } },
      exporting: { enabled: false },
      credits: { enabled: false },
      series: [{  showInLegend: false, data:data }]
    });
    this.worldMapLoader = false;
  }
  partnerReportData() {
    this.worldMapLoader = true;
    this.parterService.partnerReports(this.loggedInUserId).subscribe(
      (data: any) => {
        this.worldMapdataReport = data.countrywisePartnersCount.countrywisepartners;
        this.campaignsCount = data.partnersLaunchedCampaignsCount;
        this.throughPartnerCampaignsCount = data.throughPartnerCampaignsCount;
        this.inActivePartnersCount = data.inActivePartnersCount;
        this.activePartnersCount = data.activePartnersCount;
        this.approvePartnersCount = data.approvePartnersCount;
        const campaignData = [];
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.VIDEO);
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.SOCIAL);
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.REGULAR);
        campaignData.push(data.partnersLaunchedCampaignsByCampaignType.EVENT);
        this.campaignTypeChart(campaignData);
      },
      (error: any) => {
          this.xtremandLogger.error(error);
          this.worldMapLoader = false;
         });
  }
  /*********Active Partner  Analytics***********/
  getActivePartnerReports(){
      this.referenseService.loading(this.activeParnterHttpRequestLoader, true);
      this.activePartnersPagination.userId = this.loggedInUserId;
      if(this.authenticationService.isSuperAdmin()){
          this.activePartnersPagination.userId = this.authenticationService.checkLoggedInUserId(this.activePartnersPagination.userId);
      }
      this.paginationType = 'ActivePartnerPagination';
      this.activePartnersPagination.maxResults = 3;
      this.parterService.getActivePartnersAnalytics(this.activePartnersPagination).subscribe(
              (response: any) => {
               console.log(response);
                for(var i in response.activePartnesList){
                    response.activePartnesList[i].contactCompany = response.activePartnesList[i].partnerCompanyName;
                }
                this.activePartnersPagination.totalRecords = response.totalRecords;
                this.activePartnersPagination = this.pagerService.getPagedItems(this.activePartnersPagination, response.activePartnesList);
               this.referenseService.loading(this.activeParnterHttpRequestLoader, false);
              },
              (error: any) => { console.log("error")});
  }

  searchActivePartnerAnalytics(){
      this.activePartnersPagination.pageIndex = 1;
      this.activePartnersPagination.searchKey = this.activePartnersSearchKey;
      this.getActivePartnerReports();
  }


  partnerUserInteractionReports() {
      this.referenseService.loading( this.campaignUserInteractionHttpRequestLoader, true );
      this.paginationType = 'userInteraction';
      this.parterService.partnerUserInteractionReports( this.loggedInUserId, this.pagination ).subscribe(
          ( data: any ) => {
              this.pagination.totalRecords = data.totalRecords;
              this.partnerUserInteraction = data.data;
              for ( var i in this.partnerUserInteraction ) {
                  this.partnerUserInteraction[i].contactCompany = this.partnerUserInteraction[i].companyName;
              }
              console.log( this.partnerUserInteraction );
              this.pagination = this.pagerService.getPagedItems( this.pagination, data.data );
              this.referenseService.loading( this.campaignUserInteractionHttpRequestLoader, false );
          },
          ( error: any ) => { console.log( 'error got here' ) });
  }
  searchInPartnerCampaignsUI(){
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.partnerCampaignUISearchKey;
      this.partnerUserInteractionReports();


  }

  partnerCampaignInteraction(campaignId: number) {
    this.campaignId = campaignId;
    this.paginationType = 'partnerInteraction';
    this.parterService.partnerCampaignInteraction(this.campaignId, this.campaignInteractionPagination).subscribe(
      (data: any) => {
        this.campaignInteractionPagination.totalRecords = data.message.totalRecords;
        this.campaignInteractionPagination = this.pagerService.getPagedItems(this.campaignInteractionPagination, data.message.data);
        $('#campaignInteractionModal').modal('show');
      },
      (error: any) => { console.log('error got here') });
  }

  setPage(event) {
   if (event.type === 'userInteraction') {
      this.pagination.pageIndex = event.page;
      this.listRedistributedThroughPartnerCampaigns(this.pagination);
    } else if (event.type === 'partnerInteraction') {
      this.campaignInteractionPagination.pageIndex = event.page;
      this.partnerCampaignInteraction(this.campaignId);
    }
    else if (event.type === 'ActivePartnerPagination') {
        this.activePartnersPagination.pageIndex = event.page;
        this.getActivePartnerReports();
      }
  }
  closeModalPopUp() {
    this.paginationType = 'userInteraction';
    this.campaignInteractionPagination =  new Pagination();
  }
  totalActivePartners(event){
    this.activePartnersPagination = event;
    this.getActivePartnerReports();
  }
  paginationDropdown(event) {
    if (this.paginationType == 'userInteraction') {
      this.pagination = event;
      this.listRedistributedThroughPartnerCampaigns(this.pagination);
    } else if (this.paginationType === 'partnerInteraction') {
      this.campaignInteractionPagination = event;
      this.partnerCampaignInteraction(this.campaignId);
    }
  }
  activePartnerSearch(keyCode: any) {  if (keyCode === 13) {  this.searchActivePartnerAnalytics(); } }
  inActivePartnersSearch(keyCode:any){if (keyCode === 13) {  this.searchInActivePartnerAnalytics(); }}
  searchPartnerCampaignKeyPress(keyCode:any,value:string){if (keyCode === 13) {  this.searchPartnerCampaigns(value); }}


  goToActivePartnersDiv(){
      this.sortOption = new SortOption();
      this.selectedTabIndex = 0;
      this.campaignUserInteractionHttpRequestLoader = new HttpRequestLoader();
      this.pagination = new Pagination();
      $('#through-partner-div').hide();
      $('#inactive-partners-div').hide();
      $('#active-partner-div').show();
      $("#redistribute-partners-div").hide();
      $('#approve-partners-div').hide();
      this.getActivePartnerReports();
  }

  /****************************Through Partner Analytics**************************/
  goToThroughPartnersDiv(){
      this.throughPartnerCampaignPagination = new Pagination();
      this.sortOption = new SortOption();
      this.selectedTabIndex = 3;
      $('#active-partner-div').hide();
      $('#inactive-partners-div').hide()
      $("#through-partner-div").show();
      $("#redistribute-partners-div").hide();
      $('#approve-partners-div').hide();
      this.throughPartnerCampaignPagination.throughPartnerAnalytics = true;
      this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
  }

  /***************************Re Distributed**************************/
  goToReDistributedPartnersDiv(){
    // this.throughPartnerCampaignPagination = new Pagination();
      this.sortOption = new SortOption();
      this.selectedTabIndex = 2;
      this.pagination.maxResults = 12;
      $('#active-partner-div').hide();
      $('#inactive-partners-div').hide()
      $("#through-partner-div").hide();
      $("#redistribute-partners-div").show();
      $('#approve-partners-div').hide();
      this.listRedistributedThroughPartnerCampaigns(this.pagination);
      // this.throughPartnerCampaignPagination.reDistributedPartnerAnalytics = true;
      // this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
  }


  listThroughPartnerCampaigns(pagination: Pagination) {
      this.referenseService.loading(this.httpRequestLoader, true);
      this.campaignService.listCampaign(pagination,this.loggedInUserId)
          .subscribe(
              data => {
                $.each(data.campaigns,function(index,campaign){
                    campaign.displayTime = new Date(campaign.utcTimeInString);
                    campaign.createdDate = new Date(campaign.createdDate);
                });
                  this.sortOption.totalRecords = data.totalRecords;
                  pagination.totalRecords = data.totalRecords;
                  pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                  this.referenseService.loading(this.httpRequestLoader, false);
              },
              error => {
                  this.xtremandLogger.errorPage(error);
              },
              () => this.xtremandLogger.info("Finished listThroughPartnerCampaigns()")
          );
  }


  filterCampaigns(type: string, index: number) {
      this.sortOption.selectedCampaignTypeIndex = index;//This is to highlight the tab
      this.throughPartnerCampaignPagination.pageIndex = 1;
      this.throughPartnerCampaignPagination.campaignType = type;
      this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);

  }

  setPartnerCampaignsPageByType(event:any,type:string) {
      if("through-partner"==type){
          this.throughPartnerCampaignPagination.pageIndex = event.page;
          this.listThroughPartnerCampaigns(this.throughPartnerCampaignPagination);
      }else if("partner-campaign-details"==type){
          this.pagination.pageIndex = event.page;
          this.listRedistributedThroughPartnerCampaigns(this.pagination);
      }

  }

  searchPartnerCampaigns(type:string) {
      if("through-partner"==type){
          this.getAllFilteredResults(this.throughPartnerCampaignPagination,type);
      }else if("partner-campaign-details"==type){
          this.getAllFilteredResults(this.pagination,type);
      }

  }

  getSortedResultForPartnerCampaigns(text: any,type:string) {
      this.sortOption.selectedSortedOption = text;
      if("through-partner"==type){
          this.getAllFilteredResults(this.throughPartnerCampaignPagination,type);
      }else if("partner-campaign-details"==type){
          this.getAllFilteredResults(this.pagination,type);
      }

  }

  getNumberOfItemsPerPageByType(items: any,type:any) {
      this.sortOption.itemsSize = items;
      if("through-partner"==type){
          this.getAllFilteredResults(this.throughPartnerCampaignPagination,type);
      }else if("partner-campaign-details"==type){
          this.getAllFilteredResults(this.pagination,type);
      }

  }

  getAllFilteredResults(pagination: Pagination,type:string) {
      pagination.pageIndex = 1;
      pagination.searchKey = this.sortOption.searchKey;
      if (this.sortOption.itemsSize.value == 0) {
          pagination.maxResults = pagination.totalRecords;
      } else {
          pagination.maxResults = this.sortOption.itemsSize.value;
      }
      if("through-partner"==type){
          let sortedValue = this.sortOption.selectedSortedOption.value;
          this.setSortColumns(pagination, sortedValue);
          this.listThroughPartnerCampaigns(pagination);
      }else if("partner-campaign-details"==type){
          let sortedValue = this.sortOption.defaultSortOption.value;
          this.setSortColumns(pagination, sortedValue);
          this.listRedistributedThroughPartnerCampaigns(pagination);
      }
  }

  setSortColumns(pagination:Pagination,sortedValue:any){
      if (sortedValue != "") {
          let options: string[] = sortedValue.split("-");
          pagination.sortcolumn = options[0];
          pagination.sortingOrder = options[1];
      }
  }

  /************************InActive Partners Tab********************/
  goToInActivePartnersDiv(){
      this.sortOption = new SortOption();
      this.selectedTabIndex = 1;
      this.httpRequestLoader = new HttpRequestLoader();
      $('#through-partner-div').hide();
      $('#active-partner-div').hide();
      $('#inactive-partners-div').show();
      $("#redistribute-partners-div").hide();
      $('#approve-partners-div').hide();
      this.inActivePartnersPagination.maxResults = 12;
      this.getInActivePartnerReports(this.inActivePartnersPagination);
  }
  
  goToApprovePartnersDiv(){
      this.sortOption = new SortOption();
      this.selectedTabIndex = 5;
      this.httpRequestLoader = new HttpRequestLoader();
      $('#through-partner-div').hide();
      $('#active-partner-div').hide();
      $('#inactive-partners-div').hide();
      $("#redistribute-partners-div").hide();
      $('#approve-partners-div').show();
      this.approvePartnersPagination.maxResults = 12;
      this.getApprovePartnerReports(this.approvePartnersPagination);
  }
  
  getApprovePartnerReports(pagination:Pagination){
      this.referenseService.loading(this.httpRequestLoader, true);
      pagination.userId =this.loggedInUserId;
      if(this.authenticationService.isSuperAdmin()){
          pagination.userId = this.authenticationService.checkLoggedInUserId(pagination.userId);
      }
      console.log(pagination);
      this.parterService.getApprovePartnersAnalytics(pagination).subscribe(
              (response: any) => {
               pagination.totalRecords = response.totalRecords;
               console.log(response);
               if(response.approvePartnerList.length === 0){
                   this.customResponse = new CustomResponse( 'INFO','No Partner(s) found', true );
               }
               for ( var i in response.approvePartnerList) {
                   response.approvePartnerList[i].contactCompany = response.approvePartnerList[i].partnerCompanyName;
               }
               pagination = this.pagerService.getPagedItems(pagination, response.approvePartnerList);
               this.referenseService.loading(this.httpRequestLoader, false);
              },
              (error: any) => {
                  this.xtremandLogger.errorPage(error)
              });
  }

  getInActivePartnerReports(pagination:Pagination){
      this.referenseService.loading(this.httpRequestLoader, true);
      pagination.userId =this.loggedInUserId;
      if(this.authenticationService.isSuperAdmin()){
          pagination.userId = this.authenticationService.checkLoggedInUserId(pagination.userId);
      }
      console.log(pagination);
      this.parterService.getInActivePartnersAnalytics(pagination).subscribe(
              (response: any) => {
               pagination.totalRecords = response.totalRecords;
               console.log(response);
               if(response.inactivePartnerList.length === 0){
                   this.customResponse = new CustomResponse( 'INFO','No Partner(s) found', true );
               }else {
                   this.customResponse = new CustomResponse();
               }
               for ( var i in response.inactivePartnerList) {
                   response.inactivePartnerList[i].contactCompany = response.inactivePartnerList[i].partnerCompanyName;
               }
               pagination = this.pagerService.getPagedItems(pagination, response.inactivePartnerList);
               this.referenseService.loading(this.httpRequestLoader, false);
              },
              (error: any) => {
                  this.xtremandLogger.errorPage(error)
              });
  }

  setInActivePartnesPage( event:any) {
      try {
          this.inActivePartnersPagination.pageIndex = event.page;
          this.getInActivePartnerReports(this.inActivePartnersPagination);
      } catch ( error ) {
          this.referenseService.showError( error, "setInActivePartnesPage", "partner-reports.component.ts" )
      }
  }
  
  setApprovePartnesPage( event:any) {
      try {
          this.approvePartnersPagination.pageIndex = event.page;
          this.getApprovePartnerReports(this.approvePartnersPagination);
      } catch ( error ) {
          this.referenseService.showError( error, "setApprovePartnesPage", "partner-reports.component.ts" )
      }
  }


  searchInActivePartnerAnalytics(){
      this.inActivePartnersPagination.pageIndex = 1;
      this.inActivePartnersPagination.searchKey = this.inActivePartnersSearchKey;
      this.getInActivePartnerReports(this.inActivePartnersPagination);
  }
  inActivePartnerDropDownList(event){
      this.inActivePartnersPagination = event;
      this.getInActivePartnerReports(this.inActivePartnersPagination);
  }
  
  approvePartnerDropDownList(event){
      this.approvePartnersPagination = event;
      this.getApprovePartnerReports(this.approvePartnersPagination);
  }

  sendPartnerReminder(item:any){
     console.log(item);
     let user = new User();
     user.emailId = item.emailId;
     user.firstName = item.firstName;
     user.lastName = item.lastName;
     user.id = item.partnerId;
      this.referenseService.loading(this.httpRequestLoader, true);
      this.parterService.sendPartnerReminderEmail(user, this.loggedInUserId).subscribe(
              (response: any) => {
                if(response.statusCode==2017){
                    this.customResponse = new CustomResponse( 'SUCCESS','Email sent successfully.', true );
                }
               this.referenseService.loading(this.httpRequestLoader, false);
              },
              (error: any) => {
                  this.referenseService.loading(this.httpRequestLoader, false);
                  this.xtremandLogger.showClientErrors("partner-reports", "sendPartnerReminder()",error.error.message);
                  this.customResponse = new CustomResponse( 'ERROR','Something went wrong in sending an email.', true );
              });

  }


  goToCampaignAnalytics(campaign){
      this.referenseService.campaignType = campaign.campaignType;
      this.router.navigate(["/home/campaigns/"+campaign.campaignId+"/details"]);
  }



  /*************List Redistributed Through Partner Campaigns************/
  listRedistributedThroughPartnerCampaigns(pagination:Pagination) {
      this.paginationType = 'userInteraction';
      this.referenseService.loading( this.campaignUserInteractionHttpRequestLoader, true );
      this.parterService.listRedistributedThroughPartnerCampaign( this.loggedInUserId, pagination ).subscribe(
          ( response: any ) => {
              console.log(response);
              let data  = response.data;
              $.each(data.redistributedCampaigns,function(index,campaign){
                  campaign.redistributedOn = new Date(campaign.redistributedUtcString);
              });
              this.sortOption.totalRecords = data.totalRecords;
              pagination.totalRecords = data.totalRecords;
              pagination = this.pagerService.getPagedItems(pagination, data.redistributedCampaigns);
              this.referenseService.loading( this.campaignUserInteractionHttpRequestLoader, false );
          },
          ( error: any ) => { console.log( 'error got here' ) });
  }
  showRedistributedCampaings(item:any){
      this.pagination.pagedItems.forEach((element) => {
          let campaignId = element.campaignId;
          let clickedCampaignId = item.campaignId;
          if(clickedCampaignId!=campaignId){
              element.expand =false;
          }
		let redistributedCampaigns = item.redistributedCampaigns;
		 $.each(redistributedCampaigns,function(index,campaign){
                  campaign.displayTime = new Date(campaign.redistributedUtcString);
           });
        });
      item.expand = !item.expand;
  }
  
  /*showApprovePartnerSweetAlert( partnerId: number ) {
      try {
          this.xtremandLogger.info( "PartnerId in sweetAlert() " + partnerId );
          let self = this;
          swal( {
              title: 'Are you sure?',
              text: "You won't be able to undo this action!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#54a7e9',
              cancelButtonColor: '#999',
              confirmButtonText: 'Yes, approve it!'

          }).then( function( myData: any ) {
              console.log( "Partner ReportPage showAlert then()" + myData );
              self.approvePartnerRequest( partnerId );
          }, function( dismiss: any ) {
              console.log( 'you clicked on option' + dismiss );
          });
      } catch ( error ) {
          this.xtremandLogger.error( error, "PartnerReport Page", "ApprovePartnerAlert()" );
      }
  }*/

  
  approvePartnerRequest() {
      try {
          this.isError = false;
          this.xtremandLogger.info( this.partnerId );
          if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ")){
          this.referenseService.loading(this.httpRequestLoader, true);
          this.parterService.approveVendorRequest( this.partnerId, this.vendoorInvitation )
              .subscribe(
              ( data: any ) => {
                  data = data;
                  this.closeRequestModal();
                  if(data.statusCode == 200){
                      this.customResponse = new CustomResponse( 'SUCCESS', data.message, true );
                  }else{
                      this.customResponse = new CustomResponse( 'ERROR', "Something went wrong, Please try after some time.", true );
                  }
                      this.getApprovePartnerReports(this.approvePartnersPagination );
                      this.referenseService.loading(this.httpRequestLoader, false);
              },
              ( error: any ) => {
                  console.log( error );
                  this.referenseService.loading(this.httpRequestLoader, false);
              },
              () => this.xtremandLogger.info( "Approved successfully." )
              );
          }else{
              this.isError = true;
          }
      } catch ( error ) {
          this.xtremandLogger.error( error, "partner-report-component.", "approve parter()" );
      }
  }
  
  /*showDeclinePartnerSweetAlert( partnerId: number ) {
      try {
          this.xtremandLogger.info( "PartnerId decline partner in sweetAlert() " + partnerId );
          let self = this;
          swal( {
              title: 'Are you sure?',
              text: "You won't be able to undo this action!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#54a7e9',
              cancelButtonColor: '#999',
              confirmButtonText: 'Yes, approve it!'

          }).then( function( myData: any ) {
              console.log( "Partner ReportPage showAlert then()" + myData );
              self.declinePartnerRequest( partnerId );
          }, function( dismiss: any ) {
              console.log( 'you clicked on option' + dismiss );
          });
      } catch ( error ) {
          this.xtremandLogger.error( error, "PartnerReport Page", "DeclinePartnerAlert()" );
      }
  }*/
  
  declinePartnerRequest(){
      try {
          this.isError = false;
          this.xtremandLogger.info( this.partnerId );
          if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ")){
          this.referenseService.loading(this.httpRequestLoader, true);
          this.parterService.declineVendorRequest( this.partnerId, this.vendoorInvitation )
              .subscribe(
              ( data: any ) => {
                  data = data;
                  this.closeRequestModal();
                  if(data.statusCode == 200){
                      this.customResponse = new CustomResponse( 'SUCCESS', data.message, true );
                  }else{
                      this.customResponse = new CustomResponse( 'ERROR', "Something went wrong, Please try after some time.", true );
                  }
                      this.getApprovePartnerReports(this.approvePartnersPagination );
                      this.referenseService.loading(this.httpRequestLoader, false);
              },
              ( error: any ) => {
                  console.log( error );
                  this.referenseService.loading(this.httpRequestLoader, false);
              },
              () => this.xtremandLogger.info( "Declined successfully." )
              );
          }else{
              this.isError = true;
          }
      } catch ( error ) {
          this.xtremandLogger.error( error, "partner-report-component.", "Decline Parter()" );
      } 
  }
  
  approveAndDeclineRequest(partnerId: number, partnerFirstName: any){
      this.partnerId = partnerId;
      this.isShowCKeditor = true;
      CKEDITOR.config.height = '300px';
      CKEDITOR.config.baseFloatZIndex = 1E5;
      if(this.requestText == 'Approve'){
          this.vendoorInvitation.subject = "Welcome to my xAmplify Network"; 
          this.vendoorInvitation.message = "Hi " + partnerFirstName + ",<br><br>" + "You are approved as a partner Now you can add contacts and redistribute the campaigns."

          + "<br><br>" + "Be sure to keep an eye out for future campaigns. And if you have any questions or would like to discuss this partnership in more detail, please feel free to contact me."
          + "<br><br>"
          + "Looking forward to working with you," + "<br><br>"

          + this.authenticationService.user.firstName

          + "<br>" + this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName

          + "<br>" + this.authenticationService.user.companyName
      }else{
          this.vendoorInvitation.subject = "Your xAmplify request has been declined"
          
              this.vendoorInvitation.message = "Hi " + partnerFirstName + ",<br><br>" + "While I appreciate your request to join our xAmplify network, I regret to inform you that we have opted to decline your request at this time"
              + "I apologize for the inconvenience, but perhaps we will have the opportunity to work together in the near future."

              + "<br><br>" + "Best regards," + "<br><br>"

              + this.authenticationService.user.firstName

              + "<br>" + this.authenticationService.user.firstName + " " + this.authenticationService.user.lastName

              + "<br>" + this.authenticationService.user.companyName
      }
          $( '#approve-decline-modal' ).modal( 'show' );
  }
  
  validateRequest(){
      if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ")){
          this.isValidRequest = true;
      }else{
          this.isValidRequest = false;
      }
  }
  
  closeRequestModal(){
      this.isShowCKeditor = false;
      $('#approve-decline-modal').modal('hide');
  }


  ngOnInit() {
      if(this.loggedInUserId>0){
        this.partnerReportData();
        this.goToActivePartnersDiv();
    }else{
        this.router.navigate(['home/dashboard']);
    }

  }
  
  ngOnDestroy(){
      this.isShowCKeditor = false;
      $('#approve-decline-modal').modal('hide');
    }
  
  getModuleAccess(){
      this.authenticationService.getModulesByUserId()
      .subscribe(
          data => {
              let response = data.data;
              let statusCode = data.statusCode;
              if(statusCode==200){
                  this.landingPage = response.landingPage;
              }
          },
          error => {
             console.log("error in fetching module")
          },
          () => this.xtremandLogger.info("Finished getModuleAccess()")
      );
  }

 

}

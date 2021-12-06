import { Component, OnInit, OnDestroy,ViewChild,Renderer,Input,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from 'app/campaigns/models/campaign';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { EventCampaign } from 'app/campaigns/models/event-campaign';
import { ActionsDescription } from '../../common/models/actions-description';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import {AddMoreReceiversComponent} from 'app/campaigns/add-more-receivers/add-more-receivers.component';
import {PublicEventEmailPopupComponent} from 'app/campaigns/public-event-email-popup/public-event-email-popup.component';
import { UserService } from '../../core/services/user.service';
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';

declare var swal, $: any;

@Component({
  selector: 'app-campaigns-list-view-util',
  templateUrl: './campaigns-list-view-util.component.html',
  styleUrls: ['./campaigns-list-view-util.component.css','../../campaigns/manage-publish/manage-publish.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription, CampaignAccess, CallActionSwitch]
})
export class CampaignsListViewUtilComponent implements OnInit, OnDestroy {
  campaigns: Campaign[];
  isCampaignDeleted = false;
  hasCampaignRole = false;
  hasStatsRole = false;
  campaignSuccessMessage = "";
  isScheduledCampaignLaunched = false;
  loggedInUserId = 0;
  hasAllAccess = false;
  selectedCampaignTypeIndex = 0;
  pager: any = {};
  pagedItems: any[];
  totalRecords = 1;
  searchKey = "";
  isLastElement = false;
  campaignType: string;
  sortByDropDown = [
      { 'name': 'Sort By', 'value': 'createdTime-DESC' },
      { 'name': 'Name (A-Z)', 'value': 'campaign-ASC' },
      { 'name': 'Name (Z-A)', 'value': 'campaign-DESC' },
      { 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
      { 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' }
  ];

  numberOfItemsPerPage = [
      { 'name': '12', 'value': '12' },
      { 'name': '24', 'value': '24' },
      { 'name': '48', 'value': '48' },
      { 'name': 'All', 'value': '0' },
  ]
  itemsSize: any;
  selectedSortedOption: any = this.sortByDropDown[0];
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  campaignPartnerLoader: HttpRequestLoader = new HttpRequestLoader();
  isError = false;
  saveAsCampaignId = 0;
  saveAsCampaignName = '';
  isOnlyPartner = false;
  customResponse: CustomResponse = new CustomResponse();
  saveAsCampaignInfo: any;
  partnerActionResponse: CustomResponse = new CustomResponse();
  partnersPagination: Pagination = new Pagination();

  cancelEventMessage = "";
  selectedCancelEventId: number;
  selectedCancelEventChannelCampaign = false;
  selectedCancelEventNurtureCampaign=false;
  selectedCancelEventToPartnerCampaign=false;
  eventCampaign: EventCampaign = new EventCampaign();
  cancelEventSubjectLine = "";
  cancelEventButton = false;
  isloading: boolean;
  previewCampaign: any;
  copiedLinkCustomResponse: CustomResponse = new CustomResponse();
  publicEventAlias:string = "";
  @ViewChild('addMoreReceivers') adddMoreReceiversComponent: AddMoreReceiversComponent;
  @ViewChild('publiEventEmailPopup') publicEventEmailPopupComponent: PublicEventEmailPopupComponent;
  addWorkflows = false;
  selectedCampaign:any;
  teamMemberId: number;
  categoryId:number = 0;
  modulesDisplayType = new ModulesDisplayType();
  exportObject:any = {};
  @Input() folderListViewInput:any;
  @Output() updatedItemsCount = new EventEmitter();
  templateEmailOpenedAnalyticsAccess = false;
  modalPopupLoader = false;
  showFilterOption: boolean = false;
  fromDateFilter: any = "";
  toDateFilter: any = "";
  filterResponse: CustomResponse = new CustomResponse(); 
  filterMode: boolean = false;

  constructor(public userService: UserService, public callActionSwitch: CallActionSwitch, private campaignService: CampaignService, private router: Router, private logger: XtremandLogger,
      public pagination: Pagination, private pagerService: PagerService, public utilService: UtilService, public actionsDescription: ActionsDescription,
      public refService: ReferenceService, public campaignAccess: CampaignAccess, public authenticationService: AuthenticationService,private route: ActivatedRoute,public renderer:Renderer,
      private vanityUrlService:VanityURLService) {
      this.refService.renderer = this.renderer;    
      this.loggedInUserId = this.authenticationService.getUserId();
      this.utilService.setRouterLocalStorage('managecampaigns');
      this.itemsSize = this.numberOfItemsPerPage[0];
      this.hasCampaignRole = this.refService.hasSelectedRole(this.refService.roles.campaignRole);
      this.hasStatsRole = this.refService.hasSelectedRole(this.refService.roles.statsRole);
      this.hasAllAccess = this.refService.hasAllAccess();
      this.isOnlyPartner = this.authenticationService.isOnlyPartner();
      this.modulesDisplayType.isListView = true;
  }


  receiveNotificationFromWorkflows(event:string) {
      if(event.length>0){
          this.customResponse = new CustomResponse('SUCCESS',event, true);
      }
      this.addWorkflows = false;
  }

  showMessageOnTop() {
      $(window).scrollTop(0);
      this.customResponse = new CustomResponse('SUCCESS', 'Copy campaign saved successfully', true);
      // setTimeout(function() { $("#lanchSuccess").slideUp(500); }, 5000);
  }

  listCampaign(pagination: Pagination) {
      this.isloading = true;
      this.refService.loading(this.httpRequestLoader, true);
      pagination.searchKey = this.searchKey;
      if(this.pagination.teamMemberAnalytics){
          this.pagination.teamMemberId = this.teamMemberId;
      }
       //Added by Vivek for Vanity URL
       if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
        this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.pagination.vanityUrlFilter = true;
    }
      this.campaignService.listCampaign(pagination, this.loggedInUserId)
          .subscribe(
          data => {
            this.isloading = false;
              if(data.access){
                this.campaigns = data.campaigns;
				this.templateEmailOpenedAnalyticsAccess = data.templateEmailOpenedAnalyticsAccess;
                $.each(this.campaigns, function (_index:number, campaign) {
                    campaign.displayTime = new Date(campaign.utcTimeInString);
                    campaign.createdDate = new Date(campaign.createdDate);
                });
                this.totalRecords = data.totalRecords;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, data.campaigns);
                this.refService.loading(this.httpRequestLoader, false);
              }else{
                this.authenticationService.forceToLogout();
              }
          },
          error => {
              this.isloading = false;
              this.logger.errorPage(error);
          },
          () => this.logger.info("Finished listCampaign()", this.campaigns)
          );
  }

  setPage(event) {
      this.pagination.pageIndex = event.page;
      this.listCampaign(this.pagination);
  }

  searchCampaigns() {
      this.getAllFilteredResults(this.pagination);
  }

  getSortedResult(text: any) {
      this.selectedSortedOption = text;
      this.getAllFilteredResults(this.pagination);
  }

  getNumberOfItemsPerPage(items: any) {
      this.itemsSize = items;
      this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
      this.pagination = pagination;
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.selectedSortedOption, this.pagination);
      this.pagination.maxResults = pagination.maxResults;
      if (this.itemsSize.value === "0") {
          this.pagination.maxResults = this.pagination.totalRecords;
      } else {
          this.pagination.maxResults = this.itemsSize.value;
      }
      this.listCampaign(this.pagination);
  }
  eventHandler(keyCode: any) { if (keyCode === 13) { this.searchCampaigns(); } }
  checkLastElement(i: any) {
      if (this.pagination.pagedItems.length > 2 && (i === (this.pagination.pagedItems.length - 1) || i === this.pagination.pagedItems.length - 2)) { this.isLastElement = true; } else { this.isLastElement = false; }
  }
 
  
  ngOnInit() {
      try {
            this.getCampaignTypes();
      } catch (error) {
          this.logger.error("error in manage-publish-component init() ", error);
      }
  }

  getCampaignTypes(){
    this.isloading = true;
    this.refService.loading(this.httpRequestLoader, true);
      this.campaignService.getCampaignTypes().subscribe(
          response=>{
            let campaignAccess = response.data;
            this.campaignAccess.emailCampaign = campaignAccess.regular;
            this.campaignAccess.videoCampaign = campaignAccess.video;
            this.campaignAccess.socialCampaign = campaignAccess.social;
            this.campaignAccess.eventCampaign = campaignAccess.event;
            this.campaignAccess.landingPageCampaign = campaignAccess.page;
            this.campaignAccess.formBuilder = campaignAccess.form;
            this.campaignAccess.survey = campaignAccess.survey;
          },_error=>{
            this.refService.showSweetAlertErrorMessage("Unable to fetch campaign types");
            this.isloading = false;
            this.refService.loading(this.httpRequestLoader, false);
          },()=>{
            this.isloading = false;
            this.refService.loading(this.httpRequestLoader, false);
            this.teamMemberId = this.route.snapshot.params['teamMemberId'];
            if(this.teamMemberId!=undefined){
                this.pagination.teamMemberAnalytics = true;
            }else{
                this.pagination.teamMemberAnalytics = false;
            }
            this.refService.manageRouter = true;
            this.pagination.maxResults = 12;
            if(this.folderListViewInput!=undefined){
              this.categoryId = this.folderListViewInput['categoryId'];
              }
            if(this.categoryId!=undefined){
                this.pagination.categoryId = this.categoryId;
                this.pagination.categoryType = 'c';
            }
            this.listCampaign(this.pagination);
          }
      );
  }

  updateEvent(campaign: any) {
      this.router.navigate(['/home/campaigns/event-update/' + campaign.campaignId])
  }

  editCampaign(campaign: any) {
    this.isloading = true;
    this.customResponse = new CustomResponse();
      if (campaign.campaignType.indexOf('EVENT') > -1) {
          if (campaign.launched) {
              this.isScheduledCampaignLaunched = true;
              //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
          } else {
              if (campaign.nurtureCampaign) {
                  this.campaignService.reDistributeEvent = false;
                  this.router.navigate(['/home/campaigns/re-distribute-manage/' + campaign.campaignId]);
              } else { this.router.navigate(['/home/campaigns/event-edit/' + campaign.campaignId]); }
          }
      }
      else {
          let obj = { 'campaignId': campaign.campaignId }
          this.campaignService.getCampaignById(obj)
              .subscribe(
              data => {

                  if (data.campaignType === 'SOCIAL') {
                      this.router.navigate(["/home/campaigns/social"]);
                  } else {
                      this.campaignService.campaign = data;
                      let isLaunched = this.campaignService.campaign.launched;
                      let isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
                      if (isLaunched) {
                          this.isScheduledCampaignLaunched = true;
                          //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
                      } else {
                          if (isNurtureCampaign) {
                              this.campaignService.reDistributeCampaign = data;
                              this.campaignService.isExistingRedistributedCampaignName = true;
                              this.isPartnerGroupSelected(campaign.campaignId);
                          }
                          else {
                              this.refService.isEditNurtureCampaign = false;
                              this.router.navigate(["/home/campaigns/edit"]);
                          }
                      }
                  }
              },
              error => { this.logger.errorPage(error) },
              () => console.log())
          this.isScheduledCampaignLaunched = false;
      }
  }

  isPartnerGroupSelected(campaignId:number){
    this.pagination.campaignId = campaignId;
    this.pagination.userId = this.loggedInUserId;
    this.campaignService.isPartnerGroupSelected(this.pagination).
    subscribe(
        response=>{
           if(response.data){
               let message = "This campaign cannot be edited as partner group has been selected.";
               this.customResponse = new CustomResponse('ERROR',message,true); 
               this.isloading = false;
               this.refService.goToTop();
           }else{
            this.router.navigate(['/home/campaigns/re-distribute-campaign']);
           }

    },error=>{
        this.logger.errorPage(error)
    });
}

  confirmDeleteCampaign(id: number, position: number, name: string) {
      let self = this;
      swal({
          title: 'Are you sure?',
          text: "You won't be able to undo this action",
          type: 'warning',
          showCancelButton: true,
          swalConfirmButtonColor: '#54a7e9',
          swalCancelButtonColor: '#999',
          confirmButtonText: 'Yes, delete it!'

      }).then(function () {
          self.deleteCampaign(id, position, name);
      }, function (dismiss: any) {
          console.log('you clicked on option' + dismiss);
      });
  }

  deleteCampaign(id: number, position: number, campaignName: string) {
      this.refService.loading(this.httpRequestLoader, true);
      this.campaignService.delete(id)
          .subscribe(
          data => {
              if(data.access){
                this.refService.loading(this.httpRequestLoader, false);
                this.isCampaignDeleted = true;
                const deleteMessage = campaignName + ' deleted successfully';
                this.customResponse = new CustomResponse('SUCCESS', deleteMessage, true);
                this.pagination.pagedItems.splice(position, 1);
                this.pagination.pageIndex = 1;
                this.listCampaign(this.pagination);
                this.listNotifications();
                this.exportObject['categoryId'] = this.categoryId;
                this.exportObject['itemsCount'] = this.pagination.totalRecords;	
                this.updatedItemsCount.emit(this.exportObject);
              }else{
                    this.authenticationService.forceToLogout();
              }
            
          },
          error => { this.logger.errorPage(error) },
          () => console.log("Campaign Deleted Successfully")
          );
      this.isCampaignDeleted = false;
  }

  ngOnDestroy() {
      this.isCampaignDeleted = false;
      this.refService.campaignSuccessMessage = "";
      swal.close();
      $('#saveAsModal').modal('hide');
      $('#campaignFilterModal').modal('hide');
      $('#cancelEventModal').modal('hide');
      $('#public-event-url-modal').modal('hide');
  }
  openSaveAsModal(campaign: any) {
      $('#saveAsModal').modal('show');
      this.saveAsCampaignId = campaign.campaignId;
      this.saveAsCampaignName = campaign.campaignName + "_copy";
      this.saveAsCampaignInfo = campaign;
  }
  setCampaignData() {
      let campaignData: any;
      if (this.saveAsCampaignInfo.campaignType === 'EVENT') {
          const saveAsCampaignData = new EventCampaign();
          saveAsCampaignData.id = this.saveAsCampaignInfo.campaignId;
          saveAsCampaignData.campaign = this.saveAsCampaignName;
          campaignData = saveAsCampaignData;
          campaignData.campaignType = this.saveAsCampaignInfo.campaignType;
      }
      else {
          const campaign = new Campaign();
          campaign.campaignName = this.saveAsCampaignName;
          campaign.campaignId = this.saveAsCampaignId;
          campaign.scheduleCampaign = "SAVE";
          campaign.campaignType = this.saveAsCampaignInfo.campaignType;
          campaignData = campaign;
      }
      return campaignData;
  }
  saveAsCampaign() {
      $('#saveAsModal').modal('hide');
      this.refService.loading(this.httpRequestLoader, true);
      const campaignData = this.setCampaignData();
      campaignData.userId = this.authenticationService.getUserId();
      this.campaignService.saveAsCampaign(campaignData)
          .subscribe(data => {
              if(data.access){
                this.refService.loading(this.httpRequestLoader, false);
                this.campaignSuccessMessage = "Campaign copied successfully";
                $('#lanchSuccess').show(600);
                this.showMessageOnTop();
                this.listCampaign(this.pagination);
                console.log("saveAsCampaign Successfully");
              }else{
                this.authenticationService.forceToLogout();
              }
          },
          error => {
              $('#saveAsModal').modal('hide'); this.logger.errorPage(error)
              this.customResponse = new CustomResponse('ERROR', 'something went wrong in saving copy campaign', true);
          },
          () => console.log("saveAsCampaign Successfully")
          );
  }
  filterCampaigns(type: string, index: number) {
      this.selectedCampaignTypeIndex = index;//This is to highlight the tab
      this.pagination.pageIndex = 1;
      this.pagination.maxResults = 12;
      this.itemsSize = this.numberOfItemsPerPage[0];
      this.pagination.campaignType = type;
      this.listCampaign(this.pagination);
  }
  campaginRouter(campaign: any) {
      this.refService.campaignType = campaign.campaignType;
      this.router.navigate(['/home/campaigns/' + campaign.campaignId + '/details']);
  }
  showCampaignPreview(campaign: any) {
      this.refService.loadingPreview = true;
      if (campaign.campaignType.indexOf('EVENT') > -1) {
          this.campaignType = 'EVENT';
          // this.router.navigate(['/home/campaigns/event-preview/'+campaign.campaignId]);
          this.previewCampaign = campaign.campaignId;
      } else {
          this.campaignType = campaign.campaignType.toLocaleString();
          // this.router.navigate(['/home/campaigns/preview/'+campaign.campaignId]);
          this.previewCampaign = campaign.campaignId;
      }
  }
  goToRedistributedCampaigns(campaign: Campaign) {
      this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/re-distributed"]);
  }
  goToPreviewPartners(campaign: Campaign) {
      this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/plc"]);
  }

  goToTemplateDownloadPartners(campaign: Campaign) {
    this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/tda"]);
}
goToTemplateEmailOpenedAnalytics(campaign: Campaign) {
    this.isloading = true;
    this.router.navigate(['/home/campaigns/' + campaign.campaignId + "/teoa"]);
}

  getCancelEventDetails(campaignId: number, channelCampaign:boolean, nurtureCampaign:boolean, toPartner:boolean) {
      this.selectedCancelEventId = campaignId;
      this.selectedCancelEventChannelCampaign = channelCampaign;
      this.selectedCancelEventNurtureCampaign=nurtureCampaign;
      this.selectedCancelEventToPartnerCampaign=toPartner;
      this.campaignService.getEventCampaignById(campaignId).subscribe(
          (result) => {
              this.eventCampaign = result.data;
              $('#cancelEventModal').modal('show');
          });
  }
  cancelEvent() {
      var cancelEventData = {
          "id": this.selectedCancelEventId,
          "isCancelled": true,
          "message": this.cancelEventMessage,
          "subject": this.cancelEventSubjectLine
      }

      this.isloading = true;
      $('#cancelEventModal').modal('hide');
      this.campaignService.cancelEvent(cancelEventData, this.loggedInUserId, this.selectedCancelEventChannelCampaign,this.selectedCancelEventNurtureCampaign,
    		  this.selectedCancelEventToPartnerCampaign)
          .subscribe(data => {
        	  if(data.access){
              console.log(data);
              $(window).scrollTop(0);
              this.customResponse = new CustomResponse('SUCCESS', "Event has been cancelled successfully", true);
              console.log("Event Successfully cancelled");
              this.cancelEventMessage = "";
              this.listCampaign(this.pagination);
              this.isloading = false;
          }else{
        	  this.authenticationService.forceToLogout();
          }
          },
          error => { $('#cancelEventModal').modal('hide'); this.logger.errorPage(error) },
          () => console.log("cancelCampaign completed")
          );
  }

  closeCancelEventodal() {
      $('#cancelEventModal').modal('hide');
      this.cancelEventMessage = "";
  }

  validateCancelEventButton() {
      if (this.cancelEventMessage.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ") && this.cancelEventSubjectLine.replace(/\s\s+/g, '').replace(/\s+$/, "").replace(/\s+/g, " ")) {
          this.cancelEventButton = true;
      } else {
          this.cancelEventButton = false;
      }
  }
  closePreviewCampaign(event) {
      this.previewCampaign = undefined;
      if (event === 'copy campaign success') {
          this.showMessageOnTop();
          this.pagination.pageIndex = 1;
          this.listCampaign(this.pagination);
      }
      if (event.delete === 'deleted campaign success') {
          this.refService.loading(this.httpRequestLoader, false);
          this.isCampaignDeleted = true;
          const deleteMessage = event.campaignName + ' campaign deleted successfully';
          this.customResponse = new CustomResponse('SUCCESS', deleteMessage, true);
          this.pagination.pageIndex = 1;
          this.listCampaign(this.pagination);
      }
      if (event.delete === 'something went wrong in delete') {
          this.refService.loading(this.httpRequestLoader, false);
          const deleteMessage = 'something went wrong  when ' + event.campaignName + ' deleting. please try again';
          this.customResponse = new CustomResponse('ERROR', deleteMessage, true);
      }
      if (event === 'something went wrong') {
          this.customResponse = new CustomResponse('ERROR', 'something went wrong, please try again', true);
      }
  }
  
  goToFormAnalytics(id:number){
      this.router.navigate(['/home/forms/cf/'+id]);
  }
  
  openEventUrlModal(campaign:Campaign){
      this.modalPopupLoader = true;
      this.publicEventAlias = "";
        this.copiedLinkCustomResponse = new CustomResponse();
        $('#public-event-url-modal').modal('show');
        this.campaignService.getPublicEventCampaignAlias(campaign.campaignId).
        subscribe(
            data =>{
                if (this.authenticationService.vanityURLEnabled && this.authenticationService.vanityURLink) {           
                    this.publicEventAlias = this.authenticationService.vanityURLink + "rsvp/" + data +"?type=YES&utm_source=public";
                  }else{              
                    this.publicEventAlias = this.authenticationService.APP_URL + "rsvp/" + data+"?type=YES&utm_source=public";
                  }
                  this.modalPopupLoader = false;
            },_error =>{
                this.modalPopupLoader = false;
                this.copiedLinkCustomResponse = new CustomResponse('ERROR','Please try after sometime',true);
            });
  }
  copyUrl(inputElement){
      this.copiedLinkCustomResponse = new CustomResponse();
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
      this.copiedLinkCustomResponse = new CustomResponse('SUCCESS','Copied to clipboard successfully.',true );  
  }
  inviteMore(campaign:Campaign){
      this.adddMoreReceiversComponent.showPopup(campaign);
  }
  sendEventEmail(campaign:Campaign){
      this.publicEventEmailPopupComponent.showPopup(campaign);
  }
  
  listNotifications() {
      try{
        this.userService.listNotifications(this.authenticationService.getUserId())
            .subscribe(
            data => {
                console.log("list Notifications in manage publish page "+data);
                this.getUnreadNotificationsCount();
            },
            error => console.log(error),
            () => console.log('Finished')
            );
        }catch(error) {console.error('error'+error); }
    }
  getUnreadNotificationsCount() {
       try{
        this.userService.getUnreadNotificationsCount(this.authenticationService.getUserId())
          .subscribe(
          data => {
            this.userService.unreadNotificationsCount = data;
          },
          error => this.logger.log(error),
          () => this.logger.log('Finished')
          );
        }catch(error) {this.logger.error('error'+error); }
        }
      
        
        goToCalendarView(){
            if(this.teamMemberId>0){
              if(this.categoryId!=undefined && this.categoryId>0){
                  this.router.navigate(['/home/campaigns/calendar/' + this.teamMemberId+"/"+this.categoryId]);
              }else{
                  this.router.navigate(['/home/campaigns/calendar/' + this.teamMemberId]);
              }
              
            }else{
                if(this.categoryId!=undefined && this.categoryId>0){
                  this.router.navigate(['/home/campaigns/calendar/f/'+this.categoryId]);
                }else{
                  this.router.navigate(['/home/campaigns/calendar']);
                }
              
            }
        }     
        
  /************Adding Workflows**************** */
  addWorkFlows(campaign:Campaign){
      this.customResponse = new CustomResponse();
      this.addWorkflows = true;
      this.selectedCampaign = campaign;
      
  }

  setViewType(viewType:string){
      if("List"==viewType){
          this.modulesDisplayType.isListView = true;
          this.modulesDisplayType.isGridView = false;
          this.modulesDisplayType.isFolderGridView = false;
          this.modulesDisplayType.isFolderListView = false;
      }else if("Grid"==viewType){
          this.modulesDisplayType.isListView = false;
          this.modulesDisplayType.isGridView = true;
          this.modulesDisplayType.isFolderGridView = false;
          this.modulesDisplayType.isFolderListView = false;
      }
  }
  
  downloadCampaignHighLevelAnalytics() {
      let param = null;
      let campaignType = this.pagination.campaignType;
      let teamMemberId : number = 0;
      let teamMemberAnalytics = null;
      let categoryId : number = 0;
      let categoryType = '';
      let searchKey = this.pagination.searchKey;
      
      if(this.teamMemberId!=undefined){
          teamMemberId = this.teamMemberId;
          teamMemberAnalytics = true;
      }else{
          teamMemberAnalytics = false;
      }
      
      if(this.categoryId!=undefined){
          categoryId = this.categoryId;
          categoryType = 'c';
      }
       
       if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
           param = {
               'userId': this.loggedInUserId,
               'vendorCompanyProfileName': this.authenticationService.companyProfileName,
               'vanityUrlFilter': true,
               'campaignType' : campaignType,
               'teamMemberId' : teamMemberId,
               'teamMemberAnalytics' : teamMemberAnalytics,
               'categoryId' :categoryId,
               'categoryType' : categoryType,
               'searchKey' : searchKey,
               'fromDate' : this.pagination.fromDateFilterString,
               'toDate' : this.pagination.toDateFilterString               
           };
       } else {
           param = {
               'userId': this.loggedInUserId,
               'vanityUrlFilter': false,
               'vendorCompanyProfileName':null,
               'campaignType' : campaignType,
               'teamMemberId' :  teamMemberId,
               'teamMemberAnalytics' : teamMemberAnalytics,
               'categoryId' :categoryId,
               'categoryType' : categoryType,
               'searchKey' : searchKey,
               'fromDate' : this.pagination.fromDateFilterString,
               'toDate' : this.pagination.toDateFilterString
           };
       }
       let completeUrl = this.authenticationService.REST_URL + "campaign/download-campaign-highlevel-analytics?access_token=" + this.authenticationService.access_token;
       this.refService.post(param, completeUrl);
  }

  toggleFilterOption() {
    this.showFilterOption = !this.showFilterOption;    
    this.fromDateFilter = "";
    this.toDateFilter = "";
    if (!this.showFilterOption) {
      this.pagination.fromDateFilterString = "";
      this.pagination.toDateFilterString = "";
      if (this.filterMode) {
        this.pagination.pageIndex = 1;
        this.listCampaign(this.pagination);
        this.filterMode = false;
      }      
    } else {
      this.filterMode = false;
    }
}

  closeFilterOption() {
    this.showFilterOption = false;
    this.fromDateFilter = "";
    this.toDateFilter = ""; 
    this.pagination.fromDateFilterString = "";
    this.pagination.toDateFilterString = "";
    if (this.filterMode) {
      this.pagination.pageIndex = 1;
      this.listCampaign(this.pagination);
      this.filterMode = false;
    }    
  }

  validateDateFilters() {
    if (this.fromDateFilter != undefined && this.fromDateFilter != "") {
      var fromDate = Date.parse(this.fromDateFilter);
      if (this.toDateFilter != undefined && this.toDateFilter != "") {
        var toDate = Date.parse(this.toDateFilter);
        if (fromDate <= toDate) {
          this.pagination.fromDateFilterString = this.fromDateFilter;
          this.pagination.toDateFilterString = this.toDateFilter;
          this.filterMode = true;
          this.listCampaign(this.pagination);
        } else {
          this.filterResponse = new CustomResponse('ERROR', "From date should be less than To date", true);
        }
      } else {
        this.filterResponse = new CustomResponse('ERROR', "Please pick To Date", true);
      }
    } else {
      this.filterResponse = new CustomResponse('ERROR', "Please pick From Date", true);
    }    
  }


}

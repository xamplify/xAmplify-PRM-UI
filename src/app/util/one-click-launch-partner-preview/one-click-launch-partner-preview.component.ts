import { PagerService } from 'app/core/services/pager.service';
import { ContactService } from 'app/contacts/services/contact.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Component, OnInit,Input } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $:any;

@Component({
  selector: 'app-one-click-launch-partner-preview',
  templateUrl: './one-click-launch-partner-preview.component.html',
  styleUrls: ['./one-click-launch-partner-preview.component.css'],
  providers:[Properties]
})
export class OneClickLaunchPartnerPreviewComponent implements OnInit {
  @Input() campaignId:number;
  oneClickLaunchLoader = false;
  oneClickLaunchResponse:CustomResponse = new CustomResponse();
  emptyShareLeadsInfoMessage:CustomResponse = new CustomResponse();
  oneClickLaunchPartnerCompany:any;
  oneClickLaunchStatusCode = 0;
  showExpandButton = false;
  shareLeadsPagination: Pagination = new Pagination();
  shareLeadsErrorMessage: CustomResponse = new CustomResponse();
  shareLeadsLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedListId: number;
  selectedListName: string;
  showLeadsPreview: boolean;
  expandedUserList: any;
  campaign: any;
  @Input() viewType:string;
  showShareLeadsList = false;
  downloadCount = 0;
  openedCount = 0;
  historyPagination: Pagination = new Pagination();
  historyLoader:HttpRequestLoader = new HttpRequestLoader();
  historyList:Array<any> = new Array<any>();
  historyResponse: CustomResponse = new CustomResponse();
  campaignPartnerId = 0;
  @Input() redistributedCount = 0;
  colspanValue = 2;
  isTableLoaded: boolean = true;
  constructor(public authenticationService:AuthenticationService,public campaignService:CampaignService,public referenceService:ReferenceService,public properties:Properties,
    public contactService:ContactService,public pagerService:PagerService,public xtremandLogger:XtremandLogger) { }

  ngOnInit() {
    setTimeout(() =>{
      this.isTableLoaded = true;
    },2000);
    this.showShareLeadsList =  this.viewType == undefined;
    this.getOneClickLaunchCampaignPartnerCompany(this.campaignId);
  }

  /****XNFR-125****/
  getOneClickLaunchCampaignPartnerCompany(campaignId:number){
    this.oneClickLaunchResponse = new CustomResponse();
    this.oneClickLaunchLoader = true;
    this.campaignService.getOneClickLaunchCampaignPartnerCompany(campaignId).
    subscribe(
      response=>{
        this.oneClickLaunchStatusCode = response.statusCode;
        if(this.oneClickLaunchStatusCode==200){
            this.oneClickLaunchPartnerCompany = response.data;
            if(this.showShareLeadsList || this.viewType=="analytics"){
              this.expandList(this.oneClickLaunchPartnerCompany);
            }
        }else{
          let isCampaignLaunched = response.data;
          let message = isCampaignLaunched ? 'Partnership has been removed.':'No Data found.';
          this.oneClickLaunchResponse = new CustomResponse('INFO',message,true);
        }
        this.oneClickLaunchLoader = false;
      },error=>{
        this.oneClickLaunchLoader = false;
        this.oneClickLaunchResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
      },()=>{
        if (!this.showShareLeadsList) {
          this.oneClickLaunchLoader = true;
          if (this.viewType == "tda" || this.viewType == "teoa") {
            this.getDownloadOrOpenedEmailsCount();
          }else{
            this.oneClickLaunchLoader = false;
          }
        }
      }
      );
  }

  getDownloadOrOpenedEmailsCount(){
    this.campaignService
      .getDownloadOrOpenedCount(this.viewType, this.campaignId)
      .subscribe(
        (response) => {
          let map = response.data;
          this.downloadCount = map.count;
          this.openedCount = map.count;
          this.campaignPartnerId = map.campaignPartnerId;
          this.oneClickLaunchLoader = false;
          this.expandList(this.oneClickLaunchPartnerCompany);
        },
        (error) => {
          this.xtremandLogger.errorPage(error);
        }
      );
  }


/****XNFR-125****/
viewShareLeads(partner:any){
  this.shareLeadsPagination = new Pagination();
  this.shareLeadsErrorMessage = new CustomResponse();
    partner.expand = !partner.expand;
    if (partner.expand) {
			this.referenceService.loading(this.shareLeadsLoader, true);
			this.shareLeadsPagination.partnerCompanyId = partner.partnerCompanyId;
			this.shareLeadsPagination.partnershipId = partner.partnershipId;
			this.findShareLeads(this.shareLeadsPagination);
		}
  }

  findShareLeads(pagination:Pagination){
		this.referenceService.loading(this.shareLeadsLoader, true);
		pagination.channelCampaign = true;
    pagination.previewSelectedSharedLeads = true;
    pagination.parentCampaignId = this.campaignId;
		pagination.campaignId = this.campaignId;
		this.showExpandButton = $.trim(pagination.searchKey).length>0;
    if(this.showExpandButton){
			this.colspanValue= 3;
		}else{
			this.colspanValue = 2;
		}
		this.contactService.loadAssignedLeadsLists(pagination).
		subscribe(
			(data:any)=>{
				pagination.totalRecords = data.totalRecords;
				pagination = this.pagerService.getPagedItems(pagination, data.listOfUserLists);
        /* XBI-1988 */
        if(pagination.totalRecords==0){
          this.emptyShareLeadsInfoMessage = new CustomResponse('INFO','Share Leads associated with this campaign has been deleted',true);
        }else{
          this.emptyShareLeadsInfoMessage = new CustomResponse();
        }
        /* XBI-1988 */
				this.referenceService.loading(this.shareLeadsLoader, false);
			},error=>{
				this.xtremandLogger.error(error);
				this.referenceService.loading(this.shareLeadsLoader, false);
				this.shareLeadsErrorMessage = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		);
	}

	searchShareLeadsList() {
		this.getAllFilteredShareLeadsResults();
	}

	/************Page************** */
	navigateToShareLeadsListNextPage(event: any) {
		this.shareLeadsPagination.pageIndex = event.page;
		this.findShareLeads(this.shareLeadsPagination);
	}

	getAllFilteredShareLeadsResults() {
		this.shareLeadsPagination.pageIndex = 1;
		this.findShareLeads(this.shareLeadsPagination);
	}

	shareLeadsEventHandler(keyCode: any) { if (keyCode === 13) { this.searchShareLeadsList(); } }

  previewLeads(shareLead:any){
		this.selectedListId = shareLead.id;
		this.selectedListName = shareLead.name;
		this.showLeadsPreview = true;

	}
	resetShareLeadsPreviewValues(){
		this.selectedListId = 0;
		this.selectedListName = "";
		this.showLeadsPreview = false;
	}

  viewMatchedContacts(userList: any) {
		userList.expand = !userList.expand;		
		if (userList.expand) {
			if ((this.expandedUserList != undefined || this.expandedUserList != null)
			 && userList != this.expandedUserList) {				
				this.expandedUserList.expand = false;				
			}			
			this.expandedUserList = userList;		
		}
	} 

  expandList(partner:any){
    if(this.showShareLeadsList || this.viewType=="analytics"){
      this.viewShareLeads(partner);
    }else if(this.viewType=="tda" || this.viewType=="teoa"){
      partner.expand = !partner.expand;
      if(partner.expand){
        this.historyPagination.campaignId = this.campaignPartnerId;
        this.listDownloadHistory(this.historyPagination);
      }else{
        this.historyPagination.campaignId = 0;
      }
      
    }
  }

  listDownloadHistory(pagination: Pagination) {
		this.referenceService.loading(this.historyLoader, true);
		this.campaignService.listDownloadOrOpenedHistory(pagination,this.viewType).
    subscribe((result: any) => {
			if (result.statusCode === 200) {
				let data = result.data;
        pagination.totalRecords = data.totalRecords;
        let self = this;
        $.each(data.list, function (_index: number, history: any) {
            if(self.viewType=="tda"){
                history.displayTime = new Date(history.downloadedTimeInUTCString);
            }else{
                history.displayTime = new Date(history.trackedTimeInUTCString);
            }
        });
        this.historyList = data.list;
				pagination = this.pagerService.getPagedItems(pagination, data.list);
			}
			this.referenceService.loading(this.historyLoader, false);
		}, error => {
			this.historyResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
		});
	}
	/************Page************** */
	setHistoryPage(event: any) {
		this.historyPagination.pageIndex = event.page;
		this.listDownloadHistory(this.historyPagination);
    }

}

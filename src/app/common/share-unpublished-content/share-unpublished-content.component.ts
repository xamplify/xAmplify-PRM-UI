import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Properties } from '../models/properties';
import { ShareCampaignsComponent } from '../share-campaigns/share-campaigns.component';
import { CustomResponse } from '../../common/models/custom-response';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { setTimeout } from 'timers';
import { SweetAlertParameterDto } from '../models/sweet-alert-parameter-dto';
declare var $:any;
@Component({
  selector: 'app-share-unpublished-content',
  templateUrl: './share-unpublished-content.component.html',
  styleUrls: ['./share-unpublished-content.component.css'],
  providers:[Properties]
})
export class ShareUnpublishedContentComponent implements OnInit {

  /**XNFR-342****/
  selectedIndex = 0;
  headerText = "";
  @Input() hasCampaignAccess = false;
  @Input() hasDamAccess = false;
  @Input() hasLmsAccess =false;
  @Input() hasPlaybookAccess = false;
  showFilterOptions = false;
  modalPopUpId = "shareUnPublishedContentPopUp";
  modalHeaderText = "";
  filterOptions:Array<string> = new Array<string>();
  @ViewChild('shareCampaignsComponent') shareCampaignsComponent: ShareCampaignsComponent;
  selectedUserListId = 0;
  contact:any;
  type  = "";
  isCampaignChildComponentCalled = false;
  isAssetChildComponentCalled = false;
  isTrackChildComponentCalled = false;
  isPlayBookChildComponentCalled = false;
  isPartnersRouter = false;
  selectedIds =[];
  user:any;
  selectedModule = "";
  ngxLoading = false;
  customResponse:CustomResponse = new CustomResponse();
  isPublishedSuccessfully = false;
  statusCode = 0;
  responseMessage = "";
  isPartnerInfoRequried = false;
  isShareButtonClicked = false;
  isPublishingToPartnerList = false;
  trackOrPlayBooksSweetAlertParameterDto:SweetAlertParameterDto = new SweetAlertParameterDto();
  isTrackOrPlayBooksSweetAlertComponentCalled = false;
  isDashboardButtonsComponentCalled = false;
  partnerIds = [];
  dashboardButtonTitle = [];
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public properties:Properties,private router: Router,private campaignService:CampaignService) { }

  ngOnInit() {
    this.isPartnersRouter =  this.router.url.includes("/partners/");
    this.isPublishedSuccessfully = false;
  }

  openPopUp(userListId: number, contact:any,type:string,userListName:string){
    this.resetValues();
    this.isPublishedSuccessfully = false;
    let accessList = [];
    let isPrmAndPartnerCompany = this.authenticationService.module.isPrmAndPartner || this.authenticationService.module.isPrmAndPartnerTeamMember;
    if(isPrmAndPartnerCompany){
      this.hasCampaignAccess = !this.isPartnersRouter;
    }
    accessList.push(this.hasCampaignAccess);
    let isActiveMasterPartnerList = $.trim(userListName)==this.properties.activeMasterPartnerList;
    let isInActiveMasterPartnerList = $.trim(userListName)==this.properties.inActiveMasterPartnerList;
    let isActiveOrInActiveMasterPartnerList = isActiveMasterPartnerList || isInActiveMasterPartnerList;
    accessList.push(this.hasDamAccess && !isActiveOrInActiveMasterPartnerList);
    accessList.push(this.hasLmsAccess && !isActiveOrInActiveMasterPartnerList);
    accessList.push(this.hasPlaybookAccess && !isActiveOrInActiveMasterPartnerList);
    let filteredArrayList = this.referenceService.filterArrayList(accessList,false);
    this.showFilterOptions = filteredArrayList!=undefined && filteredArrayList.length>1;
    this.addFilterOptions();
    this.selectedModule = this.filterOptions[0];
    this.modalHeaderText = "Please Select "+this.selectedModule;
    this.contact = contact;
    this.type = type;
    this.selectedUserListId = userListId;
    this.referenceService.openModalPopup(this.modalPopUpId);
    this.isCampaignChildComponentCalled = this.hasCampaignAccess && this.selectedModule==this.properties.campaignsHeaderText;
    this.applyFilter(0,this.selectedModule);
  }

  

  private addFilterOptions() {
    if(this.hasCampaignAccess) {
      this.filterOptions.push(this.properties.campaignsHeaderText);
    }
    if(this.hasDamAccess) {
      this.filterOptions.push(this.properties.assetsHeaderText);
    }
    if(this.hasLmsAccess) {
      this.filterOptions.push(this.properties.tracksHeaderText);
    }
    if(this.hasPlaybookAccess) {
      this.filterOptions.push(this.properties.playBooksHeaderText);
    }
    if(this.authenticationService.isLocalHost()){
      this.filterOptions.push(this.properties.dashboardButtons);
    }
  }

  private resetValues() {
    this.filterOptions = [];
    this.modalHeaderText = "";
    this.showFilterOptions = false;
    this.selectedUserListId = 0;
    this.contact = {};
    this.type = "";
    this.selectedModule = "";
    this.isCampaignChildComponentCalled = false;
    this.selectedIds = [];
    this.isShareButtonClicked = false;
    this.customResponse = new CustomResponse();
    this.isPublishingToPartnerList = false;

  }

  closePopup(){
    this.resetValues();
    this.referenceService.closeModalPopup(this.modalPopUpId);

  }

  applyFilter(index:number,filterOption:string){
    this.ngxLoading =true;
    this.selectedIndex = index;
    this.isShareButtonClicked = false; 
    this.selectedIds = [];
    this.modalHeaderText = "Please Select "+filterOption;
    this.selectedModule = filterOption;
    this.isCampaignChildComponentCalled = false;
    this.isAssetChildComponentCalled = false;
    this.isTrackChildComponentCalled = false;
    this.isPlayBookChildComponentCalled = false;
    setTimeout(() => {
      this.isCampaignChildComponentCalled = this.hasCampaignAccess && filterOption==this.properties.campaignsHeaderText;
      this.isAssetChildComponentCalled = this.hasDamAccess && filterOption==this.properties.assetsHeaderText;
      this.isTrackChildComponentCalled = this.hasLmsAccess && filterOption==this.properties.tracksHeaderText;
      this.isPlayBookChildComponentCalled = this.hasPlaybookAccess && filterOption==this.properties.playBooksHeaderText;
      this.isDashboardButtonsComponentCalled = filterOption==this.properties.dashboardButtons;
      this.ngxLoading = false;
    }, 500);
   
  }

  shareUnPublishedContentEventReceiver(event:any){
    this.selectedIds = event['selectedRowIds'];
    this.user = event['partnerDetails'];
    this.isPartnerInfoRequried = event['isPartnerInfoRequried'];
    this.isPublishingToPartnerList = event['isPublishingToPartnerList'];
    this.partnerIds = event['partnerIds'];
    this.dashboardButtonTitle = event['buttonTitle']
  }

  

  share(){
    if(this.selectedIds!=undefined && this.selectedIds.length>0){
      let campaignDetails = this.addPartnerDtos();
      if(this.selectedModule==this.properties.campaignsHeaderText){
        this.ngxLoading = true;
        campaignDetails["campaignIds"] = this.selectedIds;
        campaignDetails["type"] = this.type;
        this.shareCampaigns(campaignDetails);
      }else if(this.selectedModule==this.properties.assetsHeaderText){
        this.ngxLoading = true;
        this.shareAssets(campaignDetails);
      }else if(this.selectedModule==this.properties.tracksHeaderText
         || this.selectedModule==this.properties.playBooksHeaderText){
          this.addLoaderAndShareTracksOrPlayBooks();
      }else if(this.selectedModule==this.properties.dashboardButtons){
        this.ngxLoading = true;
        let dashboardButtons = {};
        dashboardButtons["ids"] = this.selectedIds;
        dashboardButtons['partnerIds'] = this.partnerIds
        dashboardButtons['vendorId'] = this.authenticationService.getUserId();
        dashboardButtons['titles'] =  this.dashboardButtonTitle;
        dashboardButtons['userListId'] = this.selectedUserListId;
        this.shareDashboardbuttons(dashboardButtons);
      }
    }else{
      this.referenceService.goToTop();
      this.customResponse = new CustomResponse('ERROR','Please select atleast one row',true);
    }
  }

  trackOrPlayBooksSweetAlertEventReceiver(event:boolean){
    if(event){
      this.addLoaderAndShareTracksOrPlayBooks();
    }else{
      this.isTrackOrPlayBooksSweetAlertComponentCalled = false;
      this.isShareButtonClicked = false;
    }
  }


  private addLoaderAndShareTracksOrPlayBooks() {
    this.ngxLoading = true;
    let campaignDetails = this.addPartnerDtos();
    this.shareTracksOrPlayBooks(campaignDetails);
  }

  shareTracksOrPlayBooks(campaignDetails: {}) {
    campaignDetails["trackOrPlaybookIds"] = this.selectedIds;
    this.authenticationService.shareSelectedTracksOrPlayBooks(campaignDetails,this.selectedModule).
    subscribe(
      response=>{
        this.showPublishedSuccessMessage(response);
      },error=>{
        this.showPublishError();
      }
    );
  }


  private addPartnerDtos() {
    let campaignDetails = {};
    let users = [];
    if (this.isPartnerInfoRequried) {
      users.push(this.user);
    }
    campaignDetails['partnersOrContactDtos'] = users;
    campaignDetails['userListId'] = this.selectedUserListId;
    campaignDetails['loggedInUserId'] = this.authenticationService.getUserId();
    campaignDetails['publishingToPartnerList'] = this.isPublishingToPartnerList;
    if(this.contact!=undefined){
      campaignDetails['partnershipId'] = this.contact.partnershipId;
    }
    return campaignDetails;
  }

  private shareCampaigns(campaignDetails:any) {
    this.campaignService.shareOrSendCampaigns(campaignDetails)
      .subscribe(
        data => {
          this.showPublishedSuccessMessage(data);
        },
        _error => {
          this.showPublishError();
        }, () => {
        }
      );
  }

  private showPublishedSuccessMessage(data: any) {
    this.ngxLoading = false;
    if (data.access) {
      this.isPublishedSuccessfully = true;
      this.statusCode = data.statusCode;
      if (data.statusCode == 200) {
        this.responseMessage = data.message;
        this.modalHeaderText = "";
      } else {
        this.responseMessage = data.message;
      }
    } else {
      this.authenticationService.forceToLogout();
    }
  }

  private showPublishError() {
    this.ngxLoading = false;
    this.isPublishedSuccessfully = false;
    this.customResponse = new CustomResponse("ERROR", this.properties.serverErrorMessage, true);
  }

  shareAssets(campaignDetails:any){
    campaignDetails["damIds"] = this.selectedIds;
    this.authenticationService.shareSelectedAssets(campaignDetails).
    subscribe(
      response=>{
        this.showPublishedSuccessMessage(response);
      },error=>{
        this.showPublishError();
      }
    );
  }

  private shareDashboardbuttons(campaignDetails:any) {
    this.authenticationService.shareSelectedDashboardButtons(campaignDetails)
      .subscribe(
        data => {
          this.showPublishedSuccessMessage(data);
        },
        _error => {
          this.showPublishError();
        }, () => {
        }
      );
  }

}

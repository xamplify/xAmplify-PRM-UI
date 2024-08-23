import { Component, OnInit,OnDestroy, EventEmitter, Output, Input,ViewChild,Renderer} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EmailTemplate } from '../../email-template/models/email-template';
import { CustomResponse } from '../../common/models/custom-response';

import { ReferenceService } from '../../core/services/reference.service';
import { PagerService } from '../../core/services/pager.service';
import { CampaignService } from '../services/campaign.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { ContactService } from '../../contacts/services/contact.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';

import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { CampaignEmailTemplate } from '../models/campaign-email-template';
import { Campaign } from '../models/campaign';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { Pagination } from '../../core/models/pagination';
import { Country } from '../../core/models/country';
import { Timezone } from '../../core/models/timezone';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CampaignContact } from '../models/campaign-contact';
import { Properties } from '../../common/models/properties';
import { Roles } from '../../core/models/roles';
import { CampaignReport } from '../models/campaign-report';
import { SocialService } from 'app/social/services/social.service';
import { SocialCampaign } from 'app/social/models/social-campaign';
import { UtilService } from 'app/core/services/util.service';
import { EventCampaign } from '../models/event-campaign';
import { Router } from '@angular/router';
import { EmailLog } from '../models/email-log';
import { CountryNames } from 'app/common/models/country-names';
import {PreviewLandingPageComponent} from '../../landing-pages/preview-landing-page/preview-landing-page.component';
import { LandingPageService } from '../../landing-pages/services/landing-page.service';
import { SenderMergeTag } from '../../core/models/sender-merge-tag';
import { utc } from 'moment';
declare var $,swal:any;

@Component({
  selector: 'app-preview-campaign',
  templateUrl: './preview-campaign.component.html',
  styleUrls: ['./preview-campaign.component.css', '../../../assets/css/content.css'],
  providers:[CallActionSwitch,Properties, CountryNames,LandingPageService]
})
export class PreviewCampaignComponent implements OnInit,OnDestroy {
	isCampaignLaunched : boolean;
    ngxloading:boolean;
    campaignType = "";
    selectedEmailTemplateId: number = 0;
    campaign: any;
    emailTemplate: EmailTemplate;
    userLists: any;
    videoFile: any;
    campaignLaunchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
    campaignLaunchForm: FormGroup;
    buttonName = "Launch";
    customResponse: CustomResponse = new CustomResponse();
    campaignErrorResponse:CustomResponse = new CustomResponse();
    campaignReport: CampaignReport = new CampaignReport();
    socialCampaign:SocialCampaign = new SocialCampaign();
    isListView = false;
    countries: Country[];
    timezones: Timezone[];
    replies: Array<Reply> = new Array<Reply>();
    urls: Array<Url> = new Array<Url>();
    date: Date;
    reply: Reply = new Reply();
    url: Url = new Url();
    allItems = [];
    campaignEmailTemplate: CampaignEmailTemplate = new CampaignEmailTemplate();
    dataError = false;
    emailTemplateHrefLinks: any[] = [];
    enableWorkFlow = true;
    channelCampaignFieldName:string = "";
    /***************Contact List************************/
    isContactList:boolean = false;
    contactListBorderColor:string = "silver";
    isCampaignDraftContactList:boolean = false;
    selectedRowClass:string = "";
    isHeaderCheckBoxChecked:boolean = false;
    emptyContactsMessage:string = "";
    contactSearchInput:string = "";
    contactListPagination: Pagination = new Pagination();
    campaignContact:CampaignContact=new CampaignContact();
    emailLogPagination: Pagination = new Pagination();
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    contactsPagination: Pagination = new Pagination();
    selectedUserlistIds = [];
    previewContactListId : number;
    contactsUsersPagination:Pagination = new Pagination();
    previewText:string = "Select";
    tableHeader = "";
    /************Add Reply/Add OnClick**************/
    emailNotOpenedReplyDaysSum:number = 0;
    emailOpenedReplyDaysSum:number = 0;
    onClickScheduledDaysSum:number = 0;

    invalidScheduleTime:boolean = false;
    hasInternalError:boolean =false;
    invalidScheduleTimeError:string = "";
    loggedInUserId:number = 0;
    contactType:string = "";
    listName:string;
    roleName: Roles= new Roles();
    showContactType = false;
    paginationType: string;
    deleteCampaignAlert =  false;
    @Output() closeNotifyParent: EventEmitter<any>;
    @Input() previewCampaignId: number;
    @Input() previewCampaignType: any;
    modalTitle: string;
    timezonesCampaignEventTime:any;
    pagination: Pagination =  new Pagination();
    sortByDropDown = [
      { 'name': 'Sort By', 'value': '' },
      { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
      { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
      { 'name': 'Time(ASC)', 'value': 'time-ASC' },
      { 'name': 'Time(DESC)', 'value': 'time-DESC' }
    ];
    selectedSortedOption:any = this.sortByDropDown[this.sortByDropDown.length-1];
    loading = false;
    totalViewsPatination:Pagination = new Pagination();
    totalEmailActionListPagination:Pagination = new Pagination();
    totalUserWatchedListPagination:Pagination = new Pagination();
    editCampaignPagination: Pagination = new Pagination();
    isChannelCampaign:boolean;
    campaignViews: any;
    totalCampaignViews:any;
    hasCampaignRole: any;
    hasStatsRole: any;
    hasAllAccess: any;
    isOnlyPartner:any;
    saveAsCampaignId: any;
    saveAsCampaignName: string;
    saveAsCampaignInfo: any;
    isScheduledCampaignLaunched: boolean;
    isContactListLoader = false;
    @ViewChild('previewLandingPageComponent') previewLandingPageComponent: PreviewLandingPageComponent;
    downloadEmailLogList: any;
    downloadDataList = [];
    logListName = "";
    isLoadingDownloadList = false;
    downloadTypeName = "";
    senderMergeTag:SenderMergeTag = new SenderMergeTag();
    categoryNames: any;
    folderPreviewLoader = true;
    campaignPartnersOrContactsPagination:Pagination = new Pagination();
    campaignPartnersOrContactsPreviewError = false;
    socialAccountsLoader = false;
    buttonClicked = false;
    editButtonClicked = false;
    selectedCampaignId = 0;
    /***XNFR-118****/
    @Input() viewType:string;
    @Input() categoryId:number;
    /****XNFR-125**/
    callOneClickLaunchPreviewComponent = false;
    constructor(
            private campaignService: CampaignService, private utilService:UtilService,
            public authenticationService: AuthenticationService,
            private contactService: ContactService, public countryNames: CountryNames,
            public referenceService: ReferenceService,
            private pagerService: PagerService, public router:Router,
            private emailTemplateService: EmailTemplateService,
            public callActionSwitch: CallActionSwitch,
            public properties:Properties,public socialService:SocialService,
            private xtremandLogger: XtremandLogger,private renderer: Renderer) {
            this.referenceService.renderer = this.renderer;
            this.countries = this.referenceService.getCountries();
            this.contactListPagination = new Pagination();
            this.contactListPagination.filterKey = 'isPartnerUserList';
            this.contactListPagination.filterValue = false;
            this.loggedInUserId = this.authenticationService.getUserId();
            this.hasCampaignRole = this.referenceService.hasSelectedRole(this.referenceService.roles.campaignRole);
            this.hasStatsRole = this.referenceService.hasSelectedRole(this.referenceService.roles.statsRole);
            this.hasAllAccess = this.referenceService.hasAllAccess();
            this.isOnlyPartner = this.authenticationService.isOnlyPartner();
            this.closeNotifyParent = new EventEmitter<any>();
        } 
     getCampaignById() {
        const obj = { 'campaignId': this.previewCampaignId };
        if(this.previewCampaignId>0){
          this.campaignService.getPreviewCampaignById( obj, this.previewCampaignType)
          .subscribe(
            data => {
                if(this.previewCampaignType === 'EVENT') { this.setEventCampaignData(data.data); }
                else { this.setCampaignData(data);}
            },
            error => {
              $('#myModal').modal('hide');
              let statusCode = JSON.parse(error["status"]);
              if (statusCode == 400) {
                let errorResponse = JSON.parse(error["_body"]);
                let message = errorResponse["message"];
                this.referenceService.showSweetAlertErrorMessage(message);
                this.referenceService.loadingPreview = false;
                this.ngxloading = false;
                this.closeNotifyParent.emit({'updated':true});
              } else {
                  this.xtremandLogger.errorPage(error);
              }
              },
          () => {
          let campaignType:any;
           if(this.previewCampaignType !== 'EVENT') {  campaignType = this.campaign.campaignType.toLocaleString(); }
           else { campaignType = this.previewCampaignType; }
            this.campaignType = campaignType;
            if (campaignType.includes('VIDEO')) {
              this.campaignType = 'VIDEO';
            } else if (campaignType.includes('SOCIAL')) {
              this.campaignType = 'SOCIAL';
              this.getSocialCampaignByCampaignId(this.previewCampaignId);
            } else if (campaignType.includes('EVENT')) {
              this.campaignType = 'EVENT';

            }else if(campaignType.includes('LANDINGPAGE')){
                this.campaignType = 'LANDINGPAGE';
            }else {
              this.campaignType = 'REGULAR';
            } 
            this.getEmailSentCount(this.previewCampaignId);
            this.getCampaignWatchedUsersCount(this.previewCampaignId);
            this.referenceService.loadingPreview = false;
            this.ngxloading = false;
            $('#myModal').modal('show');
          });
        }else{
            this.referenceService.showSweetAlertErrorMessage("Something went wrong.Please try after sometime");
        }
        
    }
    setCampaignData(result:any){
        this.campaign = result;
        if(this.campaign.oneClickLaunchCondition){
          this.callOneClickLaunchPreviewComponent = true;
        }else{
          this.listCampaignPartnersOrContacts(this.campaignPartnersOrContactsPagination);
        }
        this.selectedEmailTemplateId = this.campaign.selectedEmailTemplateId;
        this.selectedUserlistIds = this.campaign.userListIds;
        this.isChannelCampaign = this.campaign.channelCampaign;
        this.isCampaignLaunched = this.campaign.launched;
        if(this.campaign.scheduleTime!=null && this.campaign.scheduleTime!="null" && this.campaign.campaignScheduleType!="NOW"){
            this.campaign.scheduleCampaign  = this.campaignLaunchOptions[1];
        }else{
            this.campaign.scheduleCampaign  = this.campaignLaunchOptions[2];
        }
        if(this.campaign.timeZoneId==undefined){
            this.campaign.countryId = this.countries[0].id;
            this.onSelect(this.campaign.countryId);
        }else{
            let countryNames = this.referenceService.getCountries().map(function(a) {return a.name;});
            let countryIndex = countryNames.indexOf(this.campaign.country);
            if(countryIndex>-1){
                this.campaign.countryId = this.countries[countryIndex].id;
                this.onSelect(this.campaign.countryId);
            }else{
                this.campaign.countryId = this.countries[0].id;
                this.onSelect(this.campaign.countryId);
            }
        }
        this.referenceService.stopLoader(this.httpRequestLoader);
        this.getCampaignReplies(this.campaign);
        this.getCampaignUrls(this.campaign);
        this.showSelectedListType();
    }

    
    setEventCampaignData(result:EventCampaign){
      this.campaign = result;
      this.isCampaignLaunched = this.campaign.launched;
      this.campaign.emailTemplate = result.emailTemplateDTO;
      this.campaign.launchTimeInString = new Date(result.launchTimeInString);
      if(!this.campaign.emailTemplate) { this.campaign.emailTemplate = new EmailTemplate(); }
      else { this.selectedEmailTemplateId = this.campaign.emailTemplateDTO.id;}
      this.isChannelCampaign = this.campaign.channelCampaign;
      this.campaign.eventCancellation    = result.eventCancellation;
      
      this.campaign.campaignEventTimes = result.campaignEventTimes;
      if(!this.campaign.campaignEventTimes[0]){
        this.campaign.campaignEventTimes = [];
        this.campaign.campaignEventTimes[0].startTimeString = new Date().toDateString();
        if(!this.campaign.campaignEventTimes[0].allDay){
          this.campaign.campaignEventTimes[0].endTimeString =  new Date().toDateString();
        }
      }
      for(let i=0; i< result.userListDTOs.length;i++){
        this.selectedUserlistIds.push(result.userListDTOs[i].id);
      }
      if(this.campaign.country === undefined || this.campaign.country === ""  ){ this.campaign.countryId = 0; }
      else { this.campaign.countryId = this.countries.find(x => x.name == result.country).id; }
       if( this.campaign.campaignEventTimes[0].countryId===undefined) { this.campaign.campaignEventTimes[0].countryId=0; }
       for(let i=0; i< this.countries.length;i++){
         if(this.countries[i].name=== result.campaignEventTimes[0].country){
           this.campaign.campaignEventTimes[0].countryId = this.countries[i].id;
           break;
         }
       }
       if ( !this.campaign.campaignLocation.country ) {
           this.campaign.campaignLocation.country = ( this.countryNames.countries[0] );
       }
       this.listCampaignPartnersOrContacts(this.campaignPartnersOrContactsPagination);
      this.onChangeCountryCampaignEventTime(this.campaign.campaignEventTimes[0].countryId);
    for(let i=0; i< this.timezonesCampaignEventTime.length; i++){
      if(this.timezonesCampaignEventTime[i].timezoneId === this.campaign.campaignEventTimes[0].timeZone){
        console.log(this.timezonesCampaignEventTime[i].timezoneId);
      }
    }
      if(this.campaign.timeZone==undefined){
          this.campaign.countryId = this.countries[0].id;
          this.onSelect(this.campaign.countryId);
      }else{
          let countryNames = this.referenceService.getCountries().map(function(a) {return a.name;});
          let countryIndex = countryNames.indexOf(this.campaign.country);
          if(countryIndex>-1){
              this.campaign.countryId = this.countries[countryIndex].id;
              this.onSelect(this.campaign.countryId);
          }else{
              this.campaign.countryId = this.countries[0].id;
              this.onSelect(this.campaign.countryId);
          }
      }
      this.referenceService.stopLoader(this.httpRequestLoader);
      this.getCampaignReplies(this.campaign);
      this.getCampaignUrls(this.campaign);
      this.showSelectedListType();
    }
    onChangeCountryCampaignEventTime(countryId){ this.timezonesCampaignEventTime = this.referenceService.getTimeZonesByCountryId(countryId); }
    openSaveAsModal(campaign: any) {
      $('#saveAsModalcalendar').modal('show');
      this.saveAsCampaignId = campaign.campaignId;
      const campaignName = campaign.campaignName? campaign.campaignName: campaign.campaign;
      this.saveAsCampaignName = campaignName + "_copy";
      this.saveAsCampaignInfo = campaign;
    }
    setSaveCampaignData(){
    let campaignData:any;
    if(this.previewCampaignType === 'EVENT') {
      const saveAsCampaignData = new EventCampaign();
      saveAsCampaignData.id = this.saveAsCampaignInfo.id;
      saveAsCampaignData.campaign = this.saveAsCampaignName;
      campaignData = saveAsCampaignData;
      campaignData.campaignType = this.previewCampaignType;
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
      const campaignData = this.setSaveCampaignData();
      campaignData.userId = this.loggedInUserId;
      this.campaignService.saveAsCampaign(campaignData)
        .subscribe(data => {
        	if(data.access){
              $(window).scrollTop(0);
            let statusCode = data.statusCode;
            if(statusCode==404){
              $('#myModal').modal('hide');
              this.closeNotifyParent.emit('copy campaign error');
            }else{
              this.customResponse =  new CustomResponse('SUCCESS', 'Copy campaign saved successfully', true);
              $('#myModal').modal('hide');
              this.closeNotifyParent.emit('copy campaign success');
            }
              
        }else{
        	this.authenticationService.forceToLogout();
        }
        this.buttonClicked = false;
          },
          error => { 
            $('#saveAsModalcalendar').modal('hide'); 
            $('#myModal').modal('hide');
            this.customResponse =  new CustomResponse('ERROR', 'something went wrong in saving copy campaign', true);
            this.closeNotifyParent.emit('something went wrong');
            this.buttonClicked = false;
        },
          () => {
          $('#saveAsModalcalendar').modal('hide');
          this.buttonClicked = false;
          }
        );
    }

    confirmDeleteCampaign(campaign: number) {
      let self = this;
      this.ngxloading = true;
      swal({
          title: 'Are you sure?',
          text: "You won't be able to undo this action",
          type: 'warning',
          showCancelButton: true,
          swalConfirmButtonColor: '#54a7e9',
          swalCancelButtonColor: '#999',
          confirmButtonText: 'Yes, delete it!'

      }).then(function () {
          self.deleteCampaign(campaign);
      }, function (dismiss: any) {
        self.ngxloading = false;
          console.log('you clicked on option' + dismiss);
      });
    }
    deleteCampaign(campaign: any) {
      const campaignName = this.previewCampaignType ==='EVENT' ? campaign.campaign : campaign.campaignName;
      this.campaignService.delete(this.previewCampaignId)
        .subscribe(
        data => {
          this.ngxloading = false;
          $('#myModal').modal('hide');
          if(data.access){
            this.closeNotifyParent.emit({ 'delete': 'deleted campaign success', 'id': this.previewCampaignId,'campaignName': campaignName });
          }else{
            this.authenticationService.forceToLogout();
          }
       },
        error => { console.error(error);
          $('#myModal').modal('hide');
          this.ngxloading = false;
          this.closeNotifyParent.emit({ 'delete': 'something went wrong in delete', 'id': this.previewCampaignId,'campaignName': campaignName });
        }, ()=>{
          // this.ngxloading = false;
        }
        );
    }

    emailActionTotalList(campaignId: number, actionType: string, totalRecords: number) {
      try{
      this.loading = true;
       this.emailLogPagination.maxResults = totalRecords;
      // this.downloadTypeName = 'emailAction';
      this.campaignService.emailActionList(campaignId, actionType, this.emailLogPagination)
        .subscribe(
        data => {
          this.campaignReport.totalEmailActionList = data;
          this.campaignReport.emailActionType = actionType;
          this.loading =false;
        },
        error => console.log(error),
        () => console.log()
        )
      } catch(error){ this.xtremandLogger.error('error'+error);}
    }
    getSortedResult(campaignId: number,event:any){
      
      if(this.campaignType == 'EVENT'){
          campaignId = this.campaign.id;
      }
        
      this.pagination = this.utilService.sortOptionValues(event,this.pagination);
      this.emailActionList(campaignId, this.campaignReport.emailActionType, this.pagination);
    }
    emailActionList(campaignId: number, actionType: string, pagination: Pagination) {
      try{
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      this.campaignService.emailActionList(campaignId, actionType, pagination)
       .subscribe(data => {
        this.campaignReport.emailLogs = data;
        this.campaignReport.emailActionType = actionType;
        if (actionType === 'open') {
            if ( this.sortByDropDown.length === 5 ) {
                this.sortByDropDown.push( { 'name': 'Subject(ASC)', 'value': 'subject-ASC' });
                this.sortByDropDown.push( { 'name': 'Subject(DESC)', 'value': 'subject-DESC' });
            }
              this.pagination.totalRecords = this.campaignReport.emailOpenCount;
        } else if (actionType === 'click') {
            this.sortByDropDown = this.sortByDropDown.filter(function(el) { return el.name != "Subject(ASC)"; });
            this.sortByDropDown = this.sortByDropDown.filter(function(el) { return el.name != "Subject(DESC)"; });
            this.pagination.totalRecords = this.campaignReport.emailClickedCount;
        }
        this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignReport.emailLogs);
        this.emailActionTotalList(campaignId, actionType, this.pagination.totalRecords);
        this.loading = false;
        this.referenceService.loading(this.httpRequestLoader, false);
       // this.totalEmailActionList(campaignId, actionType, this.pagination.totalRecords );
      },
      error => console.log(error),
      () => console.log('emailActionList() completed')  )
    }catch(error) {this.xtremandLogger.error('Error in analytics page emails sent'+error); }
  }
    
  totalEmailActionList(campaignId: number, actionType: string, totalRecords: number) {
    try{
     this.totalEmailActionListPagination.maxResults = totalRecords;
     this.campaignService.emailActionList(campaignId, actionType, this.totalEmailActionListPagination)
     .subscribe(data => {
      this.campaignReport.totalEmailLogs = data;
      this.downloadEmailLogs();
    },
    error => console.log(error),
    () => console.log('emailActionList() completed')  )
  }catch(error) {this.xtremandLogger.error('Error in analytics page emails sent'+error); }
 }
    getEmailSentCount(campaignId: number) {
      try {
          this.campaignService.getCampaignHighLevelAnalytics(campaignId, this.loggedInUserId)
          .subscribe(
            response => {
              if(response.data!=undefined){
                  this.campaignReport.emailSentCount = response.data.totalEmailsSent;
                  this.campaignReport.totalRecipients = response.data.totalRecipients;
                  this.campaignReport.delivered = response.data.delivered;
                  this.campaignReport.unsubscribed = response.data.unsubscribed;
                  this.campaignReport.softBounce = response.data.softBounce;
                  this.campaignReport.hardBounce = response.data.hardBounce;
                  this.campaignReport.clickthroughRate = response.data.clickthroughRate;
                  this.campaignReport.emailClickedCount = response.data.emailClicked;
                  this.campaignReport.openRate = response.data.openRate;
                  this.campaignReport.activeRecipients = response.data.activeRecipients;
                  this.campaignReport.unsubscribed = response.data.unsubscribed;
                  this.campaignReport.pagesClicked = response.data.pagesClicked;
                  this.campaignReport.deliveredCount = parseInt(response.data.deliveredCount);
                  this.campaignReport.emailOpenCount = parseInt(response.data.opened);
              }
              this.loading = false;
            },
            error => console.log(error),
            () => console.log()
          )
      } catch (error) { console.error('error' + error); }
    }
    
    getSocialCampaignByCampaignId(campaignId: number) {
      this.socialAccountsLoader = true;
      try {
        this.socialService.getSocialCampaignByCampaignId(campaignId)
          .subscribe(
          data => {
            this.socialCampaign = data;
            this.socialAccountsLoader = false;
          },
          error => console.error(error),
          () => {this.socialAccountsLoader = false;this.xtremandLogger.log('get Social campaign api finished');});
      } catch (error) {
        console.error('error' + error)
      }
    }
    getEmailLogCountByCampaign(campaignId: number) {
      try{
      // this.loading = true;
        this.campaignService.getEmailLogCountByCampaign(campaignId)
        .subscribe(
        data => {
          this.campaignReport.emailOpenCount = data["email_opened_count"];
          this.campaignReport.emailClickedCount = data["email_url_clicked_count"];
          // this.loading = false;
        },
        error => console.log(error),
        () => console.log()
        )
      }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    getCampaignWatchedUsersCount(campaignId: number) {
      try{
      // this.loading = true;
        this.campaignService.getCampaignTotalViewsCount(campaignId)
        .subscribe(
        data => {
          this.campaignReport.usersWatchCount = data.total_views_count;
          // this.loading = false;
        },
        error => console.log(error),
        () => console.log()
        )
      }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    onSelect(countryId) {
        this.timezones  = this.referenceService.getTimeZonesByCountryId(countryId);
        this.timezones = this.referenceService.getTimeZoneByTimeZonId(this.campaign.timeZoneId);
    }

    getCampaignPartnerByCampaignIdAndUserId(campaignId: number, userId: number) {
        this.campaignService.getCampaignPartnerByCampaignIdAndUserId(campaignId, userId)
            .subscribe(
            result => {
                this.selectedEmailTemplateId = result.emailTemplateId;
            },
            error => console.log(error),
            () => { });
    }
    showAnalyticsModal(paginationType:any){
      this.downloadTypeName = paginationType;
       this.paginationType = paginationType;
       this.pagination = new Pagination();
       if(paginationType === 'Total Recipients' && this.campaignReport.emailSentCount>0){
          this.modalTitle = 'Total Recipients';
          this.listCampaignViews(this.previewCampaignId, this.pagination);
          this.openCalendarModal();
       } else if(paginationType === 'Active Recipients' && this.campaignReport.emailOpenCount>0){
          this.modalTitle = 'Emails opened by recipients';
          this.emailActionList(this.previewCampaignId, 'open', this.pagination);
          this.openCalendarModal();
       } else if(paginationType === 'Clicked URL'  && this.campaignReport.emailClickedCount>0){
          this.modalTitle = 'Recipients who clicked a URL';
          this.emailActionList(this.previewCampaignId, 'click', this.pagination);
          this.openCalendarModal();
       } else if(paginationType === 'Views'  && this.campaignReport.usersWatchCount>0){
          this.modalTitle = 'Recipients who have watched the campaign';
          this.usersWatchList(this.previewCampaignId, this.pagination);
          this.openCalendarModal();
       }
     }
    openCalendarModal(){  $('#calendarModal').modal(); }
    clearPaginationValues(){
    this.pagination =  new Pagination();
    }
    previewVideo(videoFile: any) {
        this.videoFile = videoFile;
    }

    closePreviewVideoModal(event: any) {
        this.videoFile = undefined;
    }
    previewEmailTemplate(emailTemplate: EmailTemplate){
        this.referenceService.previewEmailTemplate(emailTemplate, this.campaign);
    }
    
    
    downloadFuctionality(){
        this.isLoadingDownloadList = true;
        if(this.downloadTypeName === 'Total Recipients' && this.campaignReport.emailSentCount>0){
            this.totalListOfCampaignViews(this.previewCampaignId, this.pagination.totalRecords);
         } else if(this.downloadTypeName === 'Active Recipients' && this.campaignReport.emailOpenCount>0){
            this.totalEmailActionList(this.previewCampaignId, 'open', this.pagination.totalRecords);
         } else if(this.downloadTypeName === 'Clicked URL'  && this.campaignReport.emailClickedCount>0){
            this.totalEmailActionList(this.previewCampaignId, 'click', this.pagination.totalRecords);
         } else if(this.downloadTypeName === 'Views'  && this.campaignReport.usersWatchCount>0){
            this.usersWatchTotalList(this.previewCampaignId, this.pagination.totalRecords);
         }
    }
    

       downloadEmailLogs() {
           if (this.downloadTypeName === 'Total Recipients') {
               this.logListName = 'Total_Recipients_Logs.csv';
               this.downloadEmailLogList = this.totalCampaignViews;
           }else if(this.downloadTypeName === 'Active Recipients' || this.downloadTypeName === 'Clicked URL'){
              if(this.downloadTypeName === 'Active Recipients'){
                this.logListName = 'Active_Recipients_Logs.csv';
              }else {
                  this.logListName = 'Clicked_URL_Logs.csv';
              }
               this.downloadEmailLogList = this.campaignReport.totalEmailLogs;
           }else if(this.downloadTypeName === 'Views'){
               this.logListName = 'Total_Views_Logs.csv';
               this.downloadEmailLogList = this.campaignReport.totalWatchedList;
           }

           this.downloadDataList.length = 0;
           if(this.previewCampaignType === 'EVENT'){
            var sentTime = new Date(this.campaign.launchTimeInString);
           }else{
            var sentTime = new Date(this.campaign.launchTime);
           }
           for (let i = 0; i < this.downloadEmailLogList.length; i++) {
               let date = new Date(this.downloadEmailLogList[i].time);
               let startTime = new Date(this.downloadEmailLogList[i].startTime);
               let endTime = new Date(this.downloadEmailLogList[i].endTime);
               var object = {
                   "Email Id": this.downloadEmailLogList[i].emailId,
                   "First Name": this.downloadEmailLogList[i].firstName,
                   "Last Name": this.downloadEmailLogList[i].lastName,
               }
               
               if (this.downloadTypeName === 'Total Recipients') {
                   object["Campaign Name"] = this.downloadEmailLogList[i].campaignName;
                   let campaignSentTime = this.referenceService.formatAMPM(sentTime);
                   object["Sent Time"] =  sentTime.toDateString().split(' ').slice(1).join(' ') + ' ' + campaignSentTime;
               }
               if (this.downloadTypeName === 'Active Recipients' || this.downloadTypeName === 'Clicked URL') {
                   let hours = this.referenceService.formatAMPM(date);
                   object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                   
                   if (this.downloadTypeName === 'Active Recipients'){
                       object["Subject"] = this.downloadEmailLogList[i].subject;
                   }
                   
                   if (this.downloadTypeName === 'Clicked URL'){
                       if(this.downloadEmailLogList[i].url == null){
                           object["Subject"] = 'Clicked on the video thumbnail';
                       }else{
                           object["URL"] = this.downloadEmailLogList[i].url;
                       }
                   }
               }
               
               if (this.downloadTypeName === 'Views') {
                   let hours1 = this.referenceService.formatAMPM(startTime);
                   object["Start Duration"] = startTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours1;
                   let hours2 = this.referenceService.formatAMPM(endTime);
                   object["Stop Duration"] = endTime.toDateString().split(' ').slice(1).join(' ') + ' ' + hours2;
                   object["Platform"] = this.downloadEmailLogList[i].os;
                   object["City"] = this.downloadEmailLogList[i].city;
                   object["State"] = this.downloadEmailLogList[i].state;
                   object["Country"] = this.downloadEmailLogList[i].country;
               }

               this.downloadDataList.push(object);
           }
           this.referenceService.isDownloadCsvFile = true;
           this.isLoadingDownloadList = false;
       }
    
    

  listEmailLogsByCampaignIdUserIdActionType(emailLog: EmailLog, actionType: string) {
    this.campaignReport.emailLogs.forEach((element) => {
      if(element.userId !== emailLog.userId) {  element.isExpand = false; }
    });
    emailLog.isExpand = !emailLog.isExpand;
    if (emailLog.emailLogHistory === undefined) {
      try {
        this.loading = true;
        this.campaignService.listEmailLogsByCampaignIdUserIdActionType(emailLog.campaignId, emailLog.userId, actionType)
          .subscribe(
          data => {
            emailLog.emailLogHistory = data;
            this.loading = false;
          },
          error => console.log(error),
          () => { }
          )
      } catch (error) {
        this.xtremandLogger.error('Error in listEmailLogsByCampaignIdUserIdActionType: ' + error);
      }
    }
  }


    usersWatchList(campaignId: number, pagination: Pagination) {
      try{
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      // this.downloadTypeName = 'usersWatchedList';
      this.campaignService.usersWatchList(campaignId, pagination)
        .subscribe(
        data => {
          this.pagination.totalRecords = this.campaignReport.usersWatchCount;
          this.campaignReport.usersWatchList = data.data;
          this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignReport.usersWatchList);
          //this.usersWatchTotalList(campaignId, this.pagination.totalRecords);
          this.loading = false;
          this.referenceService.loading(this.httpRequestLoader, false);
        },
        error => console.log(error),
        () => console.log()
        )
      }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    usersWatchTotalList(campaignId: number, totalRecords: number) {
      try{
       this.totalUserWatchedListPagination.maxResults = totalRecords;
       this.campaignService.usersWatchList(campaignId, this.totalUserWatchedListPagination)
        .subscribe(
        data => {
          this.campaignReport.totalWatchedList = data.data;
          this.downloadEmailLogs();
        },
        error => this.xtremandLogger.error(error),
        () => this.xtremandLogger.log('usersWatchTotalList method finished')
        )
      }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    listCampaignViews(campaignId: number, pagination: Pagination) {
      try{
      this.loading = true;
      this.referenceService.loading(this.httpRequestLoader, true);
      if(!this.campaign.detailedAnalyticsShared && this.campaign.dataShare){
          pagination.campaignId = campaignId;
          pagination.campaignType = "VIDEO";
          this.campaignService.listCampaignInteractiveViews(pagination,false)
           .subscribe(data => {
               this.listCampaignInteractiveViewsDataInsert(data.data, campaignId);
               },
           error => console.log(error),
           () => console.log('listCampaignInteractiveViews(): called') )
      } else{
         this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign,false)
           .subscribe(data => { 
             this.listCampaignViewsDataInsert(data.data, data.totalRecords);
             },
            error => console.log(error),
            () => console.log('listCampaignViews(); called') )
         }
      }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    
  listCampaignInteractiveViewsDataInsert(campaignviews: any, campaignId: number) {
    this.campaignViews = campaignviews;
    this.pagination.totalRecords = this.campaignReport.emailSentCount;
    this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignViews);
    this.loading = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }

  listCampaignViewsDataInsert(campaignviews: any, totalRecords: number) {
    this.campaignViews = campaignviews;
    this.pagination.totalRecords = totalRecords;
    this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignViews);
    this.loading = false;
    this.referenceService.loading(this.httpRequestLoader, false);
  }
    
  totalListOfCampaignViews(campaignId: number, totalRecords: number) {
    try{
        this.totalViewsPatination.maxResults = totalRecords;
        if(!this.campaign.detailedAnalyticsShared && this.campaign.dataShare){
        this.campaignService.listCampaignInteractiveViews(this.totalViewsPatination,false)
         .subscribe(data => {
             this.totalCampaignViews = data;
             this.downloadEmailLogs();
             },
         error => console.log(error),
         () => console.log('listCampaignInteractiveViews(): called') )
    } else{
       this.campaignService.listCampaignViews(campaignId, this.totalViewsPatination, this.isChannelCampaign,false)
         .subscribe(data => {
             this.totalCampaignViews = data.data;
             this.downloadEmailLogs();
             },
          error => console.log(error),
          () => console.log('listCampaignViews(); called') )
       }
    }catch(error){ this.xtremandLogger.error('error'+error);}
   }
    setContactListError(){
        if(this.selectedUserlistIds.length>0){
            this.contactListBorderColor = "silver";
            this.referenceService.goToDiv("campaign-options-div");
        }else{
            $('#contact-list-error').show(600);
            this.contactListBorderColor = "red";
            this.referenceService.goToTop();
        }
    }

    editCampaign(campaign: any) {
      this.ngxloading = true;
      this.campaignErrorResponse = new CustomResponse();
      if(campaign.launched || campaign.campaignType.indexOf('SOCIAL') > -1){
        this.editButtonClicked = true;
        this.selectedCampaignId = this.previewCampaignId;
        this.ngxloading = false;
    }else{
        if(campaign.campaignType.indexOf('SOCIAL') > -1){
            this.ngxloading = false;
            this.customResponse = new CustomResponse();
            this.referenceService.showSweetAlertErrorMessage('Please try after sometime to edit this campaign');
        }else{
            this.editCampaignsToLaunch(campaign);
        }
    }
    }

    editCampaignsToLaunch(campaign:any){
      if(this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== ''){
        this.editCampaignPagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.editCampaignPagination.vanityUrlFilter = true;
    }
      if(this.previewCampaignType === 'EVENT'){
        if (campaign.nurtureCampaign) {
          this.campaignService.reDistributeEvent = false;
          this.isPartnerGroupSelected(this.previewCampaignId,true);
        } else {
          $('#myModal').modal('hide');
          this.router.navigate(['/home/campaigns/event-edit/' + this.previewCampaignId]);
        }
      }
      else if (campaign.campaignType.indexOf('EVENT') > -1) {
        if (campaign.launched) {
          this.isScheduledCampaignLaunched = true;
        } else {
          if (campaign.nurtureCampaign) {
            this.campaignService.reDistributeEvent = false;
            this.isPartnerGroupSelected(this.previewCampaignId,true);
          } else {
            $('#myModal').modal('hide');
            this.router.navigate(['/home/campaigns/event-edit/' + this.previewCampaignId]);
          }
        }
      }
      else {
        var obj = { 'campaignId': this.previewCampaignId }
        this.campaignService.editCampaign(obj)
          .subscribe(
          data => {
            this.campaignService.campaign = data;
            let endDate = this.campaignService.campaign.endDate;
            if (endDate != undefined && endDate != null) {
                this.campaignService.campaign.endDate = utc(endDate).local().format("YYYY-MM-DD HH:mm");
            }
            const isLaunched = this.campaignService.campaign.launched;
            const isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
            if (isLaunched || data.campaignProcessing) {
              this.isScheduledCampaignLaunched = true;
              this.ngxloading = false;
            } else {
              if (isNurtureCampaign) {
                 /*********XNFR-125*********/
                 if(campaign.oneClickLaunch){
                  this.checkOneClickLaunchRedistributeEditAccess(data,campaign);
                  }else{
                    this.navigateToRedistributeCampaign(data,campaign);
                  }
              }
              else {
                /********XNFR-125*******/
                this.checkOneClickLaunchAccess(campaign.campaignId,data.campaignType);
               
              }
            }
          },
          error => {
            this.showErrorResponse(error);
           });
        this.isScheduledCampaignLaunched = false;
      }
    }

    private showErrorResponse(error: any) {
        let statusCode = JSON.parse(error["status"]);
        if (statusCode == 400) {
            this.referenceService.scrollSmoothToTop();
            this.isScheduledCampaignLaunched = true;
            this.ngxloading = false;
        } else {
            this.xtremandLogger.errorPage(error);
        }
    }


     /*****XNFR-125*****/
     checkOneClickLaunchAccess(campaignId:number,campaignType:string){
      this.ngxloading = true;
      this.campaignErrorResponse = new CustomResponse();
      this.campaignService.checkOneClickLaunchAccess(campaignId).
      subscribe(
          response=>{
              let access = response.data;
              if(access){
                  $('#myModal').modal('hide');
                  this.referenceService.isEditNurtureCampaign = false;
                  if("REGULAR"==campaignType || "SURVEY"==campaignType || "VIDEO"==campaignType || "LANDINGPAGE"==campaignType){
                        let urlSuffix = "";
                        if("REGULAR"==campaignType){
                            urlSuffix="email";
                        }else if("SURVEY"==campaignType){
                            urlSuffix = "survey";
                        }else if("VIDEO"==campaignType){
                            urlSuffix = "video";
                        }else if("LANDINGPAGE"==campaignType){
                            urlSuffix = "page";
                        }
                        this.router.navigate(["/home/campaigns/edit/"+urlSuffix]);
                    }else{
                        this.router.navigate(["/home/campaigns/edit"]);
                    }
              }else{
                  this.referenceService.scrollToModalBodyTopByClass();
                  this.campaignErrorResponse = new CustomResponse('ERROR',this.properties.oneClickLaunchAccessErrorMessage,true);
              }
              this.ngxloading = false;
          },error=>{
              this.ngxloading = false;
              this.campaignErrorResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
          });
  }


    /**********XNFR-125***********/
    checkOneClickLaunchRedistributeEditAccess(data:any,campaign:any){
      this.campaignErrorResponse = new CustomResponse();
      this.campaignService.checkOneClickLaunchRedistributeEditAccess(campaign.campaignId).
      subscribe(
          response=>{
              if(response.data){
                  this.navigateToRedistributeCampaign(data,campaign);
              }else{
                  this.referenceService.scrollToModalBodyTopByClass();
                  let statusCode = response.statusCode;
                  let message = statusCode==400 ? this.properties.emptyShareListErrorMessage : this.properties.oneClickLaunchRedistributeAccessRemovedErrorMessage;
                  this.campaignErrorResponse = new CustomResponse("ERROR",message,true);
                  this.ngxloading = false;
              }
          },_error=>{
              this.ngxloading = false;
              this.campaignErrorResponse = new CustomResponse("ERROR",this.properties.serverErrorMessage,true);
          }
      );
  }

  navigateToRedistributeCampaign(data:any,campaign:any){
    this.campaignService.reDistributeCampaign = data;
    this.campaignService.isExistingRedistributedCampaignName = true;
    this.isPartnerGroupSelected(campaign.campaignId,false);
  }

    isPartnerGroupSelected(campaignId:number,eventCamaign:boolean){
      this.editCampaignPagination.campaignId = campaignId;
      this.editCampaignPagination.userId = this.loggedInUserId;
      this.campaignService.isPartnerGroupSelected(this.editCampaignPagination).
      subscribe(
          response=>{
             if(response.data){
                 let message = "This campaign cannot be edited as "+this.authenticationService.partnerModule.customName+" group has been selected.";
                 this.campaignErrorResponse = new CustomResponse('ERROR',message,true); 
                 this.referenceService.scrollToModalBodyTop("previewCampaignModalBody");
                 this.ngxloading = false;
             }else{
              $('#myModal').modal('hide');
              if(eventCamaign){
                this.router.navigate(['/home/campaigns/re-distribute-manage/' + this.previewCampaignId]);
              }else{
                this.router.navigate(['/home/campaigns/re-distribute-campaign']);
              }
             }

      },error=>{
          this.ngxloading = false;
          this.xtremandLogger.errorPage(error);
      });
  }

    getCampaignReplies(campaign: Campaign) {
        if(campaign.campaignReplies!=undefined){
            this.replies = campaign.campaignReplies;
            for(var i=0;i< this.replies.length;i++){
                let reply = this.replies[i];
                if(reply.defaultTemplate){
                    reply.selectedEmailTemplateIdForEdit = reply.selectedEmailTemplateId;
                }
                reply.emailTemplatesPagination = new Pagination();
                reply.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(reply.replyTimeInHoursAndMinutes);
                if($.trim(reply.subject).length==0){
                    reply.subject = campaign.subjectLine;
                }
                let length = this.allItems.length;
                length = length+1;
                var id = 'reply-'+length;
                reply.divId = id;
                this.allItems.push(id);
                this.loadEmailTemplatesForAddReply(reply);
            }
        }

     }

    getCampaignUrls(campaign:Campaign){
        if(campaign.campaignUrls!=undefined){
            this.urls = campaign.campaignUrls;
            for(var i=0;i<this.urls.length;i++){
                let url = this.urls[i];
                if(url.replyInDays==null){
                    url.replyInDays = 0;
                }
                if(url.defaultTemplate){
                    url.selectedEmailTemplateIdForEdit = url.selectedEmailTemplateId;
                }
                url.emailTemplatesPagination = new Pagination();
                if(url.scheduled){
                    url.replyTime = this.campaignService.setHoursAndMinutesToAutoReponseReplyTimes(url.replyTimeInHoursAndMinutes);
                }
                let length = this.allItems.length;
                length = length+1;
                var id = 'click-'+length;
                url.divId = id;
                this.allItems.push(id);
                this.loadEmailTemplatesForAddOnClick(url);
            }
        }

    }

    loadEmailTemplatesForAddReply(reply: Reply) {
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss = true;
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        reply.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        if (reply.emailTemplatesPagination.searchKey == null || reply.emailTemplatesPagination.searchKey == "") {
            reply.emailTemplatesPagination.campaignDefaultTemplate = true;
        } else {
            reply.emailTemplatesPagination.campaignDefaultTemplate = false;
            reply.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
        }
        reply.emailTemplatesPagination.maxResults = 12;
        this.emailTemplateService.listTemplates(reply.emailTemplatesPagination, this.loggedInUserId)
            .subscribe(
            (data: any) => {
                reply.emailTemplatesPagination.totalRecords = data.totalRecords;
                reply.emailTemplatesPagination = this.pagerService.getPagedItems(reply.emailTemplatesPagination, data.emailTemplates);
                this.filterReplyrEmailTemplateForEditCampaign(reply);
                this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error: string) => {
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished loadEmailTemplatesForAddReply()", reply.emailTemplatesPagination)
            )
    }

    loadEmailTemplatesForAddOnClick(url: Url) {
        this.campaignEmailTemplate.httpRequestLoader.isHorizontalCss = true;
        this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        url.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        if (url.emailTemplatesPagination.searchKey == null || url.emailTemplatesPagination.searchKey == "") {
            url.emailTemplatesPagination.campaignDefaultTemplate = true;
        } else {
            url.emailTemplatesPagination.campaignDefaultTemplate = false;
            url.emailTemplatesPagination.isEmailTemplateSearchedFromCampaign = true;
        }
        url.emailTemplatesPagination.maxResults = 12;
        this.emailTemplateService.listTemplates(url.emailTemplatesPagination, this.loggedInUserId)
            .subscribe(
            (data: any) => {
                url.emailTemplatesPagination.totalRecords = data.totalRecords;
                url.emailTemplatesPagination = this.pagerService.getPagedItems(url.emailTemplatesPagination, data.emailTemplates);
                this.filterClickEmailTemplateForEditCampaign(url);
                this.referenceService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error: string) => {
                this.xtremandLogger.errorPage(error);
            },
            () => this.xtremandLogger.info("Finished loadEmailTemplatesForAddOnClick()", url.emailTemplatesPagination)
            )
    }

    filterReplyrEmailTemplateForEditCampaign(reply: Reply) {
        if (reply.emailTemplatesPagination.emailTemplateType == 0 && reply.emailTemplatesPagination.searchKey == null) {
            if (reply.emailTemplatesPagination.pageIndex == 1) {
                reply.showSelectedEmailTemplate = true;
            } else {
                reply.showSelectedEmailTemplate = false;
            }
        } else {
            let emailTemplateIds = reply.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
            if (emailTemplateIds.indexOf(reply.selectedEmailTemplateIdForEdit) > -1) {
                reply.showSelectedEmailTemplate = true;
            } else {
                reply.showSelectedEmailTemplate = false;
            }
        }
    }

    filterClickEmailTemplateForEditCampaign(url: Url) {
        if (url.emailTemplatesPagination.emailTemplateType == 0 && url.emailTemplatesPagination.searchKey == null) {
            if (url.emailTemplatesPagination.pageIndex == 1) {
                url.showSelectedEmailTemplate = true;
            } else {
                url.showSelectedEmailTemplate = false;
            }
        } else {
            let emailTemplateIds = url.emailTemplatesPagination.pagedItems.map(function (a) { return a.id; });
            if (emailTemplateIds.indexOf(url.selectedEmailTemplateIdForEdit) > -1) {
                url.showSelectedEmailTemplate = true;
            } else {
                url.showSelectedEmailTemplate = false;
            }
        }
    }

    getEmailTemplatePreview(campaign: Campaign) {
        let emailTemplate = campaign.emailTemplate;
       this.showEmailTemplate(campaign,emailTemplate);
      
    }

    showEmailTemplate(campaign:Campaign,emailTemplate:EmailTemplate){
      this.ngxloading = true;
      let userId = 0;
      if(this.campaign.nurtureCampaign){
          userId = this.campaign.parentCampaignUserId;
      }else{
          if(this.previewCampaignType ==='EVENT'){
              userId =  this.campaign.userDTO.id;
          }else{
              userId =  this.campaign.userId;
          }
      }
      if(userId!=undefined){
          this.emailTemplateService.getAllCompanyProfileImages(userId).subscribe(
                  ( data: any ) => {
                      let body = emailTemplate.body;
                      let self  =this;
                      if(this.campaign.nurtureCampaign){
                          body = body.replace(this.senderMergeTag.aboutUsGlobal,this.campaign.myMergeTagsInfo.aboutUs);
                          $.each( data, function( index, value ) {
                              body = body.replace( value, self.authenticationService.MEDIA_URL + self.campaign.companyLogo );
                          } );
                          body = body.replace( "https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.campaign.companyLogo );
                      }else{
                          $.each(data,function(index,value){
                              body = body.replace(value,self.authenticationService.MEDIA_URL + self.referenceService.companyProfileImage);
                          });
                          body = body.replace("https://xamp.io/vod/replace-company-logo.png", this.authenticationService.MEDIA_URL + this.referenceService.companyProfileImage);
                      }
                      /*if(!this.campaign.channelCampaign && !this.campaign.nurtureCampaign){
                          body = body.replace(this.senderMergeTag.aboutUsGlobal,"");
                      }*/
                      if(!this.campaign.channelCampaign && !this.campaign.nurtureCampaign){
                          body = body.replace(this.senderMergeTag.aboutUsGlobal,"");
                      }
                      let emailTemplateName = emailTemplate.name;
                      if (emailTemplateName.length > 50) {
                          emailTemplateName = emailTemplateName.substring(0, 50) + "...";
                      }
                      $("#email-template-content").empty();
                      $("#email-template-title").empty();
                      $("#email-template-title").append(emailTemplateName);
                      $('#email-template-title').prop('title', emailTemplate.name);
                      let gifPath = "";
                      if(this.campaignType.includes('VIDEO')){
                          gifPath = this.campaign.campaignVideoFile.gifImagePath;
                      }
                      
                      if(this.campaignType.includes('EVENT')){
                          this.referenceService.campaignType = "EVENT";
                          this.referenceService.eventCampaignId = this.campaign.userDTO.id;
                      }
                      
                      let updatedBody = this.referenceService.showEmailTemplatePreview(this.campaign, this.campaignType, gifPath, body);
                      $("#email-template-content").append(updatedBody);
                      $('.modal .modal-body').css('overflow-y', 'auto');
                      $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
                      $("#email_template_preivew").modal('show');
                      this.ngxloading = false;
                  },
                  error => { this.ngxloading = false;this.xtremandLogger.error("error in getAllCompanyProfileImages("+userId+")", error); },
                  () =>  this.xtremandLogger.info("Finished getAllCompanyProfileImages()"));
      }else{
          let body = emailTemplate.body;
          let emailTemplateName = emailTemplate.name;
          if (emailTemplateName.length > 50) {
              emailTemplateName = emailTemplateName.substring(0, 50) + "...";
          }
          $("#email-template-content").empty();
          $("#email-template-title").empty();
          $("#email-template-title").append(emailTemplateName);
          $('#email-template-title').prop('title', emailTemplate.name);
          let gifPath = "";
          if(this.campaignType.includes('VIDEO')){
              gifPath = this.campaign.campaignVideoFile.gifImagePath;
          }
          let updatedBody = this.referenceService.showEmailTemplatePreview(this.campaign, this.campaignType, gifPath, body);
          $("#email-template-content").append(updatedBody);
          $('.modal .modal-body').css('overflow-y', 'auto');
          $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
          $("#email_template_preivew").modal('show');
          this.ngxloading = false;
      }
    }

    

    ngOnDestroy(){
      $('#usersModal').modal('hide');
      $("#email_template_preivew").modal('hide');
      $("#myModal").modal('hide');
      $("#contactlist-preivew").modal('hide');
      $("#calendarModal").modal('hide');
      $("#saveAsModalcalendar").modal('hide');
      $("#show-campaign-popup").modal('hide');
      
    }

    /*************************************************************Contact List***************************************************************************************/
    loadContactList(contactsPagination: Pagination) {
        this.paginationType = 'contactslists';
        this.isContactListLoader = true;
        this.campaignContact.httpRequestLoader.isHorizontalCss=true;
        this.referenceService.loading(this.campaignContact.httpRequestLoader, true);
        this.contactService.loadCampaignContactsList(contactsPagination)
            .subscribe(
            (data: any) => {
                this.userLists = data.listOfUserLists;
                contactsPagination.totalRecords = data.totalRecords;
                this.contactListPagination = this.pagerService.getPagedItems(contactsPagination,this.userLists);
                this.referenceService.loading(this.campaignContact.httpRequestLoader, false);
                this.isContactListLoader = false;
            },
            (error: string) => {this.xtremandLogger.errorPage(error);
            this.isContactListLoader = false;
            });
    }
    showContacts(){
        if($('#campaign-contact-list').css('display') == 'none'){
            this.previewText = "Hide";
        }else{
            this.previewText = "Select";
        }
        $('#campaign-contact-list').toggle(500);
    }
    searchContactList(){
        this.contactListPagination.pageIndex = 1;
        this.contactListPagination.searchKey = this.contactSearchInput;
        this.loadContactList(this.contactListPagination);
    }

    /*******************************Preview*************************************/
    contactListItems:any[];
      loadUsers(id:number,pagination:Pagination, name){
        this.paginationType='contacts';
        this.listName = name;
           if(id==undefined || id==0){
              id=this.previewContactListId;
          }else{
              this.previewContactListId = id;
          }
           
          let previewCampaignId: number;
          
          if(this.previewCampaignType === 'EVENT'){
              previewCampaignId = this.campaign.id; 
          }else{
              previewCampaignId = this.campaign.campaignId; 
          }
          this.contactService.loadPreviewCampaignUsersOfContactList( id, previewCampaignId,this.contactsUsersPagination).subscribe(
                  (data:any) => {
                      console.log(data);
                      console.log(pagination);
                      this.contactListItems = data.data;
                      console.log(this.contactListItems);
                      pagination.totalRecords = data.totalRecords;
                      this.contactsUsersPagination = this.pagerService.getPagedItems(pagination, this.contactListItems);
                      $('#usersModal').modal();
                  },
                  error =>
                  () => console.log( "MangeContactsComponent loadUsersOfContactList() finished" )
              )
      }

      closeModelPopup(){
          this.paginationType ='contactslists';
          this.contactsUsersPagination = new Pagination();
      }
      showContactsAlert(count:number){
          this.emptyContactsMessage = "";
          if(count==0){
              this.emptyContactsMessage = "No Contacts Found For This Contact List";
          }
      }

  ngOnInit() {
    this.getCampaignById();
    this.isListView = !this.referenceService.isGridView;
  }


  setPage(event:any){
      if(event.type==='contacts'){
      this.contactsUsersPagination.pageIndex = event.page;
      this.loadUsers(this.previewContactListId,this.contactsUsersPagination,this.listName);}
      else if(event.type==='contactslists'){
        this.contactListPagination.pageIndex = event.page;
        this.loadContactList(this.contactListPagination);
      } else if(event.type==='Total Recipients'){
        this.pagination.pageIndex = event.page;
        this.listCampaignViews(this.previewCampaignId, this.pagination);
      } else if(event.type === 'Views'){
        this.pagination.pageIndex = event.page;
         this.usersWatchList(this.previewCampaignId, this.pagination);
      }else if(event.type === 'Active Recipients'){
        this.emailActionList(this.previewCampaignId, 'open', this.pagination);
      }else if(event.type === 'Clicked URL'){
        this.emailActionList(this.previewCampaignId, 'click', this.pagination);
      }else if(event.type==='contactsOrPartners'){
        this.campaignPartnersOrContactsPagination.pageIndex = event.page;
        this.listCampaignPartnersOrContacts(this.campaignPartnersOrContactsPagination);
      }
  }
  paginationDropdown(pagination:Pagination){
    if(this.paginationType==='contacts'){
      this.loadUsers(this.previewContactListId,pagination,this.listName);
    }else if (this.paginationType==='contactslists') {
      this.loadContactList(pagination);
    } else if(this.paginationType==='Total Recipients'){
      this.listCampaignViews(this.previewCampaignId, pagination);
    } else if(this.paginationType === 'Views'){
       this.usersWatchList(this.previewCampaignId, pagination);
    } else if(this.paginationType === 'Active Recipients'){
      this.emailActionList(this.previewCampaignId, 'open', pagination);
    }else if(this.paginationType === 'Clicked URL'){
      this.emailActionList(this.previewCampaignId, 'click', pagination);
    }else if(this.paginationType=='contactsOrPartners'){
      this.listCampaignPartnersOrContacts(this.campaignPartnersOrContactsPagination);
    }
  }
  closeModalpreview(){
    this.closeNotifyParent.emit(true);
    this.referenceService.campaignType = "";
    this.referenceService.eventCampaignId = null;
  }

  navigateCampaignAnalytics(campaign: any) {
    $('#myModal').modal('hide');
    this.referenceService.campaignType = this.previewCampaignType;
    let campaignRouterParams = {};
    campaignRouterParams['campaignId'] = this.previewCampaignId;
    campaignRouterParams['campaignTitle'] = campaign.campaignTitle;
    this.referenceService.goToCampaignAnalytics(campaignRouterParams);
  }
  navigateRedistributedCampaigns(campaign: any) {
    $('#myModal').modal('hide');
    this.router.navigate(['/home/campaigns/' + this.previewCampaignId + "/re-distributed"]);
  }
  navigatePreviewPartners(campaign: any) {
    $('#myModal').modal('hide');
    this.router.navigate(['/home/campaigns/' + this.previewCampaignId + "/plc"]);
  }
  
  showLandingPagePreview(campaign:Campaign){
      if(campaign.nurtureCampaign){
          campaign.landingPage.showPartnerCompanyLogo = true;
          campaign.landingPage.partnerId = this.loggedInUserId;
      }else{
          if(campaign.enableCoBrandingLogo){
              campaign.landingPage.showYourPartnersLogo = true;
          }else{
              campaign.landingPage.showYourPartnersLogo = false;
          }
          
      }
      this.previewLandingPageComponent.showPreview(campaign.landingPage);
  }
  
  showSelectedListType(){
      const roles = this.authenticationService.getRoles();
      let marketing = this.authenticationService.module.isMarketingCompany;
      let isVendor = roles.indexOf(this.roleName.vendorRole)>-1 || roles.indexOf(this.roleName.vendorTierRole)>-1 || roles.indexOf(this.roleName.prmRole)>-1 ;
      let isOrgAdmin = this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor && !marketing);
      if(isOrgAdmin){
          this.channelCampaignFieldName = "To Recipient";
      }else{
          this.channelCampaignFieldName = "To Partner";
      }
      if(isOrgAdmin){
          if(this.campaign.channelCampaign){
              this.contactType = this.authenticationService.partnerModule.customName;
              this.tableHeader = this.authenticationService.partnerModule.customName+" Details";
              this.showContactType = false;
          }else{
              if(this.campaign.nurtureCampaign){
                  this.contactType = " Recipient(s)";
                  this.tableHeader = "Recipients Details";
              }else{
                  this.contactType = this.authenticationService.partnerModule.customName+" / Recipients";
                  this.tableHeader =  this.authenticationService.partnerModule.customName+" / Recipients Details";

              }
              this.showContactType = true;
          }

      }else if(this.authenticationService.module.isMarketingCompany){
        this.contactType = " Recipient(s)";
        this.tableHeader = "Recipients Details";
      } else if(isVendor|| this.authenticationService.isAddedByVendor){
        if(this.campaign.nurtureCampaign){
          this.contactType = " Recipient(s)";
          this.tableHeader = "Recipients Details";
        }else{
          this.contactType = this.authenticationService.partnerModule.customName;
          this.tableHeader = this.authenticationService.partnerModule.customName+" Details";
          this.showContactType = false;
        }
         
      }
  }

  changeTheFolder(){
    this.folderPreviewLoader = true;
    $('#show-campaign-popup').modal('show');
    this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
      ( data: any ) => {
          this.categoryNames = data.data;
          this.folderPreviewLoader = false;
      },
      error => {
        this.callErrorResponse();
        },
      () => this.xtremandLogger.info( "Finished listCategories()" ) );


  }

  updateFolder(){
   this.folderPreviewLoader = true;
   let campaignId;
   let categoryId;
   if(this.campaign.campaignType=='EVENT'){
    campaignId = this.campaign.id;
   }else{
    campaignId = this.campaign.campaignId;
   }
   categoryId = this.campaign.categoryId;
   if(campaignId!=undefined && categoryId!=undefined && campaignId>0 && categoryId>0){
    this.campaignService.updateFolder(campaignId,categoryId,this.loggedInUserId).subscribe(
      ( data: any ) => {
        let message = "Folder updated successfully.Please wait...";
          this.customResponse = new CustomResponse('SUCCESS',message,true);
          let self = this;
          setTimeout(function(){ 
            $('#myModal').modal('hide');
            $('#show-campaign-popup').modal('hide');
            self.folderPreviewLoader = false;
            self.router.navigate([self.router.url] );
           }, 500);
  
      },
      error => { 
          this.callErrorResponse();
        },
      () => this.xtremandLogger.info( "Finished updateFolder()" ) );
   }else{
    this.folderPreviewLoader = false;
    this.customResponse = new CustomResponse('ERROR','CampaignId/FolderId cannot be null',true);
   }
   

  }

  callErrorResponse(){
    this.folderPreviewLoader = false; 
    $('#show-campaign-popup').modal('hide');
    $('#myModal').modal('hide');
     this.referenceService.showSweetAlertServerErrorMessage();
  }

  changeWorkFlowStatus(workflowId:number,statusInString:string,workflowType:number,reply:Reply,url:Url){
    this.ngxloading = true;
    this.campaignService.changeWorkflowStatus(workflowId,statusInString,workflowType).subscribe(
      ( data: any ) => {
        if(workflowType==1){
          reply.statusInString = statusInString;
        }else if(workflowType==2){
          url.statusInString = statusInString;
        }
          this.referenceService.showSweetAlertSuccessMessage(data.message);
          this.ngxloading = false;
      },
      error => {
        this.ngxloading = false;
        this.referenceService.showSweetAlertServerErrorMessage();
        },
      () => this.xtremandLogger.info( "Finished changeWorkflowStatus()" ) );
  }

pauseOrResume(status:string,type:number,reply:Reply,url:Url){
  let self = this;
  swal({
      title: 'Are you sure to '+status+'?',
      text:'This will '+status+' the workflow',
      type: 'warning',
      showCancelButton: true,
      swalConfirmButtonColor: '#54a7e9',
      swalCancelButtonColor: '#999',
      confirmButtonText: 'Yes, '+status+' it!',
      allowOutsideClick: false
  }).then(function () {
    if(type==1){
      self.changeWorkFlowStatus(reply.id,'ACTIVE',1,reply,new Url());
    }else if(type==2){
      self.changeWorkFlowStatus(reply.id,'INACTIVE',1,reply,new Url());
    }else if(type==3){
      self.changeWorkFlowStatus(url.id,'ACTIVE',2,new Reply(),url);
    }else if(type==4){
      self.changeWorkFlowStatus(url.id,'INACTIVE',2,new Reply(),url);
    }
    
  }, function (dismiss: any) {
      console.log('you clicked on option' + dismiss);
  });
}

  resumeAutoReplyWorkflow(reply:Reply){
    this.pauseOrResume('Resume',1,reply,new Url());
  }

  pauseAutoReplyWorkflow(reply:Reply){
    this.pauseOrResume('Pause',2,reply,new Url());
  }
  resumeClickedUrlsWorkflow(url:Url){
    this.pauseOrResume('Resume',3,new Reply(),url);
   }
 
   pauseClickedUrlsWorkflow(url:Url){
    this.pauseOrResume('Pause',4,new Reply(),url);
   }

   listCampaignPartnersOrContacts(campaignPartnersOrContactsPagination:Pagination){
     this.isContactListLoader = true;
     this.paginationType = 'contactsOrPartners';
     this.campaignPartnersOrContactsPreviewError = false;
     if(this.campaign.campaignId!=undefined && this.campaign.campaignId>0){
      campaignPartnersOrContactsPagination.campaignId = this.campaign.campaignId;
     }else{
      campaignPartnersOrContactsPagination.campaignId = this.campaign.id;
     }
     this.campaignService.getCampaignContactsOrPartners(campaignPartnersOrContactsPagination).
     subscribe(
      ( data: any ) => {
        let response = data.data;
        campaignPartnersOrContactsPagination.totalRecords = response.totalRecords;
        campaignPartnersOrContactsPagination = this.pagerService.getPagedItems(campaignPartnersOrContactsPagination, response.list);
        this.isContactListLoader = false;
      },
      error => {
        this.campaignPartnersOrContactsPreviewError = true;
        this.isContactListLoader = false;
        
        },
      () => this.xtremandLogger.info( "Finished listCampaignPartnersOrContacts()" ) );
     
   }


   searchCampaignUsers(){
    this.campaignPartnersOrContactsPagination.pageIndex = 1;
    this.campaignPartnersOrContactsPagination.searchKey = this.contactSearchInput;
    this.listCampaignPartnersOrContacts(this.campaignPartnersOrContactsPagination);
   }

   eventHandlerForSearchUsers(keyCode: any) { if (keyCode === 13) { this.searchCampaignUsers(); } }


   changeCampaignUserStatus(campaignUser:any,status:string){
     console.log(campaignUser);
     campaignUser.status = status;
     campaignUser.loggedInUserId = this.loggedInUserId;
     let self = this;
     swal({
         title: 'Are you sure to '+status+'?',
         text:'This will '+status+' the workflow',
         type: 'warning',
         showCancelButton: true,
         swalConfirmButtonColor: '#54a7e9',
         swalCancelButtonColor: '#999',
         confirmButtonText: 'Yes, '+status+' it!',
         allowOutsideClick: false
     }).then(function () {
        self.changeUserWorkFlowStatus(campaignUser);
       
     }, function (dismiss: any) {
         console.log('you clicked on option' + dismiss);
     });
   }

   changeUserWorkFlowStatus(campaignUser:any){
    this.ngxloading = true;
    this.campaignService.changeUserWorkFlowStatus(campaignUser).subscribe(
      ( data: any ) => {
        if(campaignUser.status=="Pause"){
          campaignUser.statusInString = "INACTIVE";
        }else if(campaignUser.status=="Resume"){
          campaignUser.statusInString = "ACTIVE";
        }
          this.referenceService.showSweetAlertSuccessMessage(data.message);
          this.ngxloading = false;
      },
      error => {
        this.ngxloading = false;
        this.referenceService.showSweetAlertServerErrorMessage();
        },
      () => this.xtremandLogger.info( "Finished changeUserWorkFlowStatus()" ) );
  }

  viewCampaigns(user:any,campaign:any){
    $('#myModal').modal('hide');
    this.ngxloading = true;
    let prefixUrl = "/home/campaigns/user-campaigns/";
    let suffixUrl =  this.referenceService.encodePathVariable(user.userId)+"/a";
    if(campaign.nurtureCampaign){
      this.referenceService.goToRouter(prefixUrl + "/c/" +suffixUrl);
    }else{
      this.referenceService.goToRouter(prefixUrl + "/p/" + suffixUrl);
    }
  }

  /*****XNFR-118********/
  resetValues(event:any){
    this.ngxloading = true;
    if("updated"==event){
      this.getCampaignById();
      if("folderList"==this.viewType || this.categoryId!=undefined && this.categoryId>0){
        this.closeNotifyParent.emit({'updated':true});
      }
    }else{
      this.ngxloading = false;
    }
    this.selectedCampaignId = 0;
    this.editButtonClicked = false;
    let currentUrl = this.router.url;
    if(currentUrl.includes('campaigns/calendar/')){
      this.router.navigate([currentUrl]);
    }
   
}

previewEmailTemplateInNewTab(campaign:any){
  let campaignId = campaign['campaignType']=='EVENT' ? campaign.id : campaign.campaignId;
  this.referenceService.previewCampaignEmailTemplateInNewTab(campaignId);
}

previewAutoReplyEmailTemplateInNewTab(campaign:any,reply:any){
  this.referenceService.previewSharedCampaignAutoReplyEmailTemplateInNewTab(reply.id);
}

previewAutoReplyWebsiteLinkTemplateInNewTab(campaign:any,url:any){
  this.referenceService.previewVendorCampaignAutoReplyWebsiteLinkTemplateInNewTab(url.id);
}

openPageInNewTab(id:number){
  this.referenceService.previewPageInNewTab(id);
}



}

import { Component, OnInit,OnDestroy, EventEmitter, Output, Input} from '@angular/core';
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
import { CampaignType } from '../models/campaign-type';
declare var $:any;

@Component({
  selector: 'app-preview-campaign',
  templateUrl: './preview-campaign.component.html',
  styleUrls: ['./preview-campaign.component.css', '../../../assets/css/content.css'],
  providers:[CallActionSwitch,Properties, CountryNames]
})
export class PreviewCampaignComponent implements OnInit,OnDestroy {
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

    constructor(
            private campaignService: CampaignService, private utilService:UtilService,
            public authenticationService: AuthenticationService,
            private contactService: ContactService, public countryNames: CountryNames,
            public referenceService: ReferenceService,
            private pagerService: PagerService, public router:Router,
            private emailTemplateService: EmailTemplateService,
            public callActionSwitch: CallActionSwitch,
            public properties:Properties,public socialService:SocialService,
            private xtremandLogger: XtremandLogger) {
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
      // if(this.previewCampaignType === 'EVENT'){ this.campaign = new EventCampaign();}
      // else { this.campaign = new Campaign(); }
        const obj = { 'campaignId': this.previewCampaignId } // , this.previewCampaignType
        this.campaignService.getPreviewCampaignById( obj, this.previewCampaignType)
          .subscribe(
            data => {
                if(this.previewCampaignType === 'EVENT') { this.setEventCampaignData(data.data); }
                else { this.setCampaignData(data);}
            },
            error => { this.xtremandLogger.errorPage( error ) },
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
            } else {
              this.campaignType = 'REGULAR';
            }
            this.getEmailSentCount(this.previewCampaignId);
            this.getEmailLogCountByCampaign(this.previewCampaignId);
            this.getCampaignWatchedUsersCount(this.previewCampaignId);
            this.referenceService.loadingPreview = false;
            $('#myModal').modal('show');
          });
    }
    setCampaignData(result){
        this.campaign = result;
        console.log(this.campaign);
        this.contactListPagination.campaignUserListIds = this.campaign.userListIds;
        if(this.campaign.userListIds.length>0){ this.loadContactList(this.contactListPagination);}
        this.selectedEmailTemplateId = this.campaign.selectedEmailTemplateId;
        this.selectedUserlistIds = this.campaign.userListIds;
        this.isChannelCampaign = this.campaign.channelCampaign;
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
        const roles = this.authenticationService.getRoles();
        let isVendor = roles.indexOf(this.roleName.vendorRole)>-1;
        let isOrgAdmin = this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor);
        if(isOrgAdmin){
            this.channelCampaignFieldName = "To Recipient";
        }else{
            this.channelCampaignFieldName = "To Partner";
        }
        if(isOrgAdmin){
            if(this.campaign.channelCampaign){
                this.contactType = "partner list(s)";
                this.showContactType = false;
            }else{
                this.contactType = " partner / recepient list(s)";
                this.showContactType = true;
            }

        }else if(isVendor|| this.authenticationService.isAddedByVendor){
            this.contactType = "partner list(s)";
            this.showContactType = false;
        }
    }

    setEventCampaignData(result:EventCampaign){
      this.campaign = result;
      console.log(this.campaign);
      this.campaign.emailTemplate = result.emailTemplateDTO;
      if(!this.campaign.emailTemplate) { this.campaign.emailTemplate = new EmailTemplate(); }
      else { this.selectedEmailTemplateId = this.campaign.emailTemplateDTO.id;}
      this.isChannelCampaign = this.campaign.channelCampaign;
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
       this.contactListPagination.campaignUserListIds = this.selectedUserlistIds;
       if(this.selectedUserlistIds.length>0) { this.loadContactList(this.contactListPagination); }

      if ( this.campaign.campaignScheduleType === 'SAVE' ) {
    } else if( this.campaign.campaignScheduleType === 'SCHEDULE' ){
    }
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
      const roles = this.authenticationService.getRoles();
      let isVendor = roles.indexOf(this.roleName.vendorRole)>-1;
      let isOrgAdmin = this.authenticationService.isOrgAdmin() || (!this.authenticationService.isAddedByVendor && !isVendor);
      if(isOrgAdmin){
          this.channelCampaignFieldName = "To Recipient";
      }else{
          this.channelCampaignFieldName = "To Partner";
      }
      if(isOrgAdmin){
          if(this.campaign.channelCampaign){
              this.contactType = "partner(s)";
              this.showContactType = false;
          }else{
              this.contactType = " partner(s) / recepient(s) ";
              this.showContactType = true;
          }

      }else if(isVendor|| this.authenticationService.isAddedByVendor){
          this.contactType = "partner(s)";
          this.showContactType = false;
      }
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
      this.campaignService.saveAsCampaign(campaignData)
        .subscribe(data => {
          $(window).scrollTop(0);
          this.customResponse =  new CustomResponse('SUCCESS', 'Copy campaign saved successfully', true);
          $('#myModal').modal('hide');
          this.closeNotifyParent.emit('copy campaign success');
          },
          error => { $('#saveAsModalcalendar').modal('hide'); $('#myModal').modal('hide');
          this.customResponse =  new CustomResponse('ERROR', 'something went wrong in saving copy campaign', true);
          this.closeNotifyParent.emit('something went wrong');
        },
          () => {
          $('#saveAsModalcalendar').modal('hide');
          // this.getCampaignCalendarView();
          }
        );
    }

    confirmDeleteCampaign(campaign: number) {
      this.deleteCampaignAlert = true;
    }
    deleteCampaign(campaign: any) {
      // this.ngxloading = true;
      const campaignName = this.previewCampaignType ==='EVENT' ? campaign.campaign : campaign.campaignName;
      this.campaignService.delete(this.previewCampaignId)
        .subscribe(
        data => {
          $('#myModal').modal('hide');
          this.closeNotifyParent.emit({ 'delete': 'deleted campaign success', 'id': this.previewCampaignId,'campaignName': campaignName });
       },
        error => { console.error(error);
          $('#myModal').modal('hide');
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
        this.totalEmailActionList(campaignId, actionType, this.pagination.totalRecords );
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
      //this.emailActionTotalList(campaignId, actionType, this.pagination.totalRecords);
    },
    error => console.log(error),
    () => console.log('emailActionList() completed')  )
  }catch(error) {this.xtremandLogger.error('Error in analytics page emails sent'+error); }
 }
    getEmailSentCount(campaignId: number) {
      try {
        this.campaignService.getEmailSentCount(campaignId)
          .subscribe(
          data => {
            this.campaignReport.emailSentCount = data.emails_sent_count;
          },
          error => console.log(error),
          () => {
            // this.listCampaignViews(campaignId, this.campaignViewsPagination);
          }
          )
      } catch (error) { console.error('error' + error); }
    }
    getSocialCampaignByCampaignId(campaignId: number) {
      try {
        this.socialService.getSocialCampaignByCampaignId(campaignId)
          .subscribe(
          data => {
            this.socialCampaign = data;
          },
          error => console.error(error),
          () => { this.xtremandLogger.log('get Social campaign api finished');});
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
      // this.downloadTypeName = 'campaignViews';
       this.paginationType = paginationType;
       this.pagination = new Pagination();
       if(paginationType === 'Total Recipients' && this.campaignReport.emailSentCount>0){
          this.modalTitle = 'Sent Email Details';
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
          this.usersWatchTotalList(campaignId, this.pagination.totalRecords);
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
          this.campaignService.listCampaignInteractiveViews(pagination)
           .subscribe(data => {  this.listCampaignViewsDataInsert(data, campaignId); },
           error => console.log(error),
           () => console.log('listCampaignInteractiveViews(): called') )
      } else{
         this.campaignService.listCampaignViews(campaignId, pagination, this.isChannelCampaign)
           .subscribe(data => { this.listCampaignViewsDataInsert(data.campaignviews, campaignId); },
            error => console.log(error),
            () => console.log('listCampaignViews(); called') )
         }
      }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    listCampaignViewsDataInsert(campaignviews: any, campaignId: number){
      this.campaignViews = campaignviews;
      this.pagination.totalRecords = this.campaignReport.emailSentCount;
      this.pagination = this.pagerService.getPagedItems(this.pagination, this.campaignViews);
      this.loading = false;
      this.referenceService.loading(this.httpRequestLoader, false);
      this.totalListOfCampaignViews(campaignId, this.pagination.totalRecords);
  }
  totalListOfCampaignViews(campaignId: number, totalRecords: number) {
    try{
        this.totalViewsPatination.maxResults = totalRecords;
        if(!this.campaign.detailedAnalyticsShared && this.campaign.dataShare){
        this.campaignService.listCampaignInteractiveViews(this.totalViewsPatination)
         .subscribe(data => {
             this.totalCampaignViews = data;
             },
         error => console.log(error),
         () => console.log('listCampaignInteractiveViews(): called') )
    } else{
       this.campaignService.listCampaignViews(campaignId, this.totalViewsPatination, this.isChannelCampaign)
         .subscribe(data => {
             this.totalCampaignViews = data.campaignviews;
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
      if(this.previewCampaignType === 'EVENT'){
        $('#myModal').modal('hide');
        if (campaign.nurtureCampaign) {
          this.campaignService.reDistributeEvent = false;
          this.router.navigate(['/home/campaigns/re-distribute-manage/' + this.previewCampaignId]);
        } else {
          this.router.navigate(['/home/campaigns/event-edit/' + this.previewCampaignId]);
        }
      }
      else if (campaign.campaignType.indexOf('EVENT') > -1) {
        if (campaign.launched) {
          this.isScheduledCampaignLaunched = true;
          //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
        } else {
          $('#myModal').modal('hide');
          if (campaign.nurtureCampaign) {
            this.campaignService.reDistributeEvent = false;
            this.router.navigate(['/home/campaigns/re-distribute-manage/' + this.previewCampaignId]);
          } else {
            this.router.navigate(['/home/campaigns/event-edit/' + this.previewCampaignId]);
          }
        }
      }
      else {
        var obj = { 'campaignId': this.previewCampaignId }
        this.campaignService.getCampaignById(obj)
          .subscribe(
          data => {
            $('#myModal').modal('hide');
            this.campaignService.campaign = data;
            const isLaunched = this.campaignService.campaign.launched;
            const isNurtureCampaign = this.campaignService.campaign.nurtureCampaign;
            if (isLaunched) {
              this.isScheduledCampaignLaunched = true;
              //  setTimeout(function() { $("#scheduleCompleted").slideUp(1000); }, 5000);
            } else {
              if (isNurtureCampaign) {
                this.campaignService.reDistributeCampaign = data;
                this.campaignService.isExistingRedistributedCampaignName = true;
                this.router.navigate(['/home/campaigns/re-distribute-campaign']);
              }
              else {
                this.referenceService.isEditNurtureCampaign = false;
                this.router.navigate(["/home/campaigns/edit"]);
              }
            }
          },
          error => { console.error(error) },
          () => console.log()
          )
        this.isScheduledCampaignLaunched = false;
      }
    }
    getCampaignReplies(campaign: Campaign) {
        if(campaign.campaignReplies!=undefined){
            this.replies = campaign.campaignReplies;
            for(var i=0;i<this.replies.length;i++){
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

    getEmailTemplatePreview(emailTemplate: EmailTemplate) {
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
                        console.log(data);
                        let body = emailTemplate.body;
                        let self  =this;
                        if(this.campaign.nurtureCampaign){
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
            },
            () => this.xtremandLogger.info("Finished loadContactList()", this.contactListPagination)
            )
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
          this.contactService.loadUsersOfContactList( id,this.contactsUsersPagination).subscribe(
                  (data:any) => {
                      console.log(data);
                      console.log(pagination);
                      this.contactListItems = data.listOfUsers;
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
    }
  }
  closeModalpreview(){
    this.closeNotifyParent.emit(true);
  }

  navigateCampaignAnalytics(campaign: any) {
    $('#myModal').modal('hide');
    this.referenceService.campaignType = this.previewCampaignType;
    this.router.navigate(['/home/campaigns/' + this.previewCampaignId + '/details']);
  }
  navigateRedistributedCampaigns(campaign: any) {
    $('#myModal').modal('hide');
    this.router.navigate(['/home/campaigns/' + this.previewCampaignId + "/re-distributed"]);
  }
  navigatePreviewPartners(campaign: any) {
    $('#myModal').modal('hide');
    this.router.navigate(['/home/campaigns/' + this.previewCampaignId + "/remove-access"]);
  }
}

import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
declare var $,CKEDITOR:any;

@Component({
  selector: 'app-preview-campaign',
  templateUrl: './preview-campaign.component.html',
  styleUrls: ['./preview-campaign.component.css'],
  providers:[CallActionSwitch,Properties]
})
export class PreviewCampaignComponent implements OnInit,OnDestroy {
    campaignType:string = "";
    selectedEmailTemplateId: number = 0;
    campaign: Campaign=new Campaign();
    emailTemplate: EmailTemplate;
    userLists: any;
    videoFile: any;
    public campaignLaunchOptions = ['NOW', 'SCHEDULE', 'SAVE'];
    campaignLaunchForm: FormGroup;
    buttonName = "Launch";
    customResponse: CustomResponse = new CustomResponse();
    isListView: boolean = false;
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
    numberOfContactsPerPage = [
                               {'name':'10','value':'10'},
                               {'name':'20','value':'20'},
                               {'name':'30','value':'30'},
                               {'name':'---All---','value':'0'},
                               ]
    contactItemsSize:any = this.numberOfContactsPerPage[0];
    isCampaignDraftContactList:boolean = false;
    selectedRowClass:string = "";
    isHeaderCheckBoxChecked:boolean = false;
    emptyContactsMessage:string = "";
    contactSearchInput:string = "";
    contactListPagination: Pagination = new Pagination();
    campaignContact:CampaignContact=new CampaignContact();
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
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    loggedInUserId:number = 0;
    contactType:string = "";
    listName:string;
    roleName: Roles= new Roles();
    showContactType:boolean = false;
    constructor(
            private route: ActivatedRoute,
            private campaignService: CampaignService,
            private authenticationService: AuthenticationService,
            private contactService: ContactService,
            public referenceService: ReferenceService,
            private pagerService: PagerService,
            private emailTemplateService: EmailTemplateService,
            public callActionSwitch: CallActionSwitch,
            public properties:Properties,
            private xtremandLogger: XtremandLogger) {
            this.countries = this.referenceService.getCountries();
            this.contactListPagination = new Pagination();
            this.contactListPagination.filterKey = 'isPartnerUserList';
            this.contactListPagination.filterValue = false;
            this.loggedInUserId = this.authenticationService.getUserId();
            CKEDITOR.config.height = '100';
           this.getCampaignById();
           CKEDITOR.config.readOnly = true;
        }
    selectReplyEmailBody(i,e){}
    selectClickEmailBody(i,r,e){}
    setUrlScheduleType(i,e){}
    shareAnalytics(e){}
    setContactPage(e){}
    getCampaignById() {
        var obj = { 'campaignId': this.route.snapshot.params['id'] }
        this.campaignService.getCampaignById( obj )
            .subscribe(
            data => {
                this.setCampaignData(data);
            },
            error => { this.xtremandLogger.errorPage( error ) },
            () => console.log()
            )
    }
    setCampaignData(result){
        this.campaign = result;
        console.log(this.campaign);
        /*if(this.campaign.channelCampaign || this.campaign.launchedByVendor){
            this.contactType = "partner";
        }else{
            this.contactType ="contact";
        }*/
        if(this.campaign.userListIds.length>0){
            this.loadContactList(this.contactListPagination);
        }
        this.selectedEmailTemplateId = this.campaign.selectedEmailTemplateId;
        this.selectedUserlistIds = this.campaign.userListIds;
        this.campaignType = this.campaign.campaignType.toLocaleString();
        if(this.campaignType.includes('VIDEO')){
            this.campaignType=="VIDEO";
        }else if(this.campaignType.includes('REGULAR')){
            this.campaignType=="REGULAR";
        }
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


    previewVideo(videoFile: any) {
        this.videoFile = videoFile;
    }

    closePreviewVideoModal(event: any) {
        this.videoFile = undefined;
    }
    previewEmailTemplate(emailTemplate: EmailTemplate){
        this.referenceService.previewEmailTemplate(emailTemplate, this.campaign);
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

    extractTimeFromDate(replyTime){
        //let dt = new Date(replyTime);
        let dt = replyTime;
        let hours = dt.getHours() > 9 ? dt.getHours() : '0' + dt.getHours();
        let minutes = dt.getMinutes() > 9 ? dt.getMinutes() : '0' + dt.getMinutes();
        return hours+":"+minutes;
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
        let body = emailTemplate.body;
        let emailTemplateName = emailTemplate.name;
        if (emailTemplateName.length > 50) {
            emailTemplateName = emailTemplateName.substring(0, 50) + "...";
        }
        $("#email-template-content").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title', emailTemplate.name);
        if (this.campaignType == 'video') {
            let selectedVideoGifPath = this.campaign.campaignVideoFile.gifImagePath;
            let updatedBody = emailTemplate.body.replace("<SocialUbuntuImgURL>", selectedVideoGifPath);
            updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
            updatedBody = updatedBody.replace("<SocialUbuntuURL>", "javascript:void(0)");
            updatedBody = updatedBody.replace("https://dummyurl.com", "javascript:void(0)");
            updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif", selectedVideoGifPath);
            updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", selectedVideoGifPath);
            $("#email-template-content").append(updatedBody);
        } else {
            let updatedBody = emailTemplate.body.replace("<div id=\"video-tag\">", "<div id=\"video-tag\" style=\"display:none\">");
            $("#email-template-content").append(updatedBody);
        }
        $('.modal .modal-body').css('overflow-y', 'auto');
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#email_template_preivew").modal('show');
    }
    isEven(n) {
      if(n % 2 === 0){ return true;}
        return false;
    }
    ngOnDestroy(){
      CKEDITOR.config.readOnly = false;
      $('#usersModal').modal('hide');
      $("#email_template_preivew").modal('hide');
    }

    /*************************************************************Contact List***************************************************************************************/
    loadContactList(contactsPagination: Pagination) {
        this.campaignContact.httpRequestLoader.isHorizontalCss=true;
        this.referenceService.loading(this.campaignContact.httpRequestLoader, true);
        contactsPagination.campaignUserListIds = this.campaign.userListIds;
        this.contactService.loadCampaignContactsList(contactsPagination)
            .subscribe(
            (data: any) => {
                this.userLists = data.listOfUserLists;
                contactsPagination.totalRecords = data.totalRecords;
                this.contactListPagination = this.pagerService.getPagedItems(contactsPagination,this.userLists);
                this.referenceService.loading(this.campaignContact.httpRequestLoader, false);
            },
            (error: string) => this.xtremandLogger.errorPage(error),
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
                      $('#users-modal-body').html('');
                      var html = "";
                      html+= '<table style="margin:0" class="table table-striped table-hover table-bordered" id="sample_editable_1">'+
                              '<thead>'+
                                  '<tr>'+
                                      '<th>EMAIL ID</th>'+
                                      '<th>FIRST NAME</th>'+
                                      '<th>LAST NAME</th>'+
                                  '</tr>'+
                              '</thead>'+
                               '<tbody>';
                      $.each(this.contactsUsersPagination.pagedItems,function(index,value){
                          var firstName = value.firstName;
                          var lastName = value.lastName;
                          if(firstName==null || firstName=="null"){
                              firstName="";
                          }
                         if(lastName==null || lastName=="null"){
                             lastName = "";
                         }
                          html+= '<tr>'+
                                      '<td>'+value.emailId+'</td>'+
                                      '<td>'+firstName+'</td>'+
                                      '<td>'+lastName+'</td>'+
                                  '</tr>';
                      });
                       html+='</tbody>';
                       html+='</table>';
                      $('#users-modal-body').append(html);
                      $('#usersModal').modal({backdrop: 'static', keyboard: false});
                  },
                  error =>
                  () => console.log( "MangeContactsComponent loadUsersOfContactList() finished" )
              )
      }

      closeModelPopup(){
          this.contactsUsersPagination = new Pagination();
      }
      showContactsAlert(count:number){
          this.emptyContactsMessage = "";
          if(count==0){
              this.emptyContactsMessage = "No Contacts Found For This Contact List";
          }
      }

  ngOnInit() {
      this.isListView = !this.referenceService.isGridView;
  }


  setPage(pageIndex:number){
      this.contactsUsersPagination.pageIndex = pageIndex;
      this.loadUsers(0,this.contactsUsersPagination,this.listName);
  }

  setReplyEmailTemplate(emailTemplateId:number,reply:Reply,index:number){
      reply.selectedEmailTemplateId = emailTemplateId;
      $('#reply-'+index+emailTemplateId).prop("checked",true);
  }
  setClickEmailTemplate(emailTemplateId:number,url:Url,index:number){
      url.selectedEmailTemplateId = emailTemplateId;
      $('#url-'+index+emailTemplateId).prop("checked",true);
  }
}

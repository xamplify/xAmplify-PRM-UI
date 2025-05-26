import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Campaign } from '../models/campaign';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UtilService } from '../../core/services/util.service';
import { Properties } from '../../common/models/properties';
import { CampaignService } from '../services/campaign.service';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { CampaignWorkflowPostDto } from '../models/campaign-workflow-post-dto';
import { TracksPlayBook } from 'app/tracks-play-book-util/models/tracks-play-book';
import { ParterService } from 'app/partners/services/parter.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { CustomAnimation } from 'app/core/models/custom-animation';
declare var $: any;
@Component({
  selector: 'app-campaign-work-flows-util',
  templateUrl: './campaign-work-flows-util.component.html',
  styleUrls: ['./campaign-work-flows-util.component.css'],
  providers: [HttpRequestLoader, Properties, CallActionSwitch],
  animations:[CustomAnimation]
})
export class CampaignWorkFlowsUtilComponent implements OnInit {

  loader: HttpRequestLoader = new HttpRequestLoader();
  urlLinks = [];
  reply: Reply = new Reply();
  url: Url = new Url();
  replies: Array<Reply> = new Array<Reply>();
  urls: Array<Url> = new Array<Url>();
  workflowOptions = [];
  allItems = [];
  campaign: Campaign = new Campaign();
  campaignWorkflowsPostDto: CampaignWorkflowPostDto = new CampaignWorkflowPostDto();

  dataError = false;
  workflowsMap: Map<string, any[]> = new Map<string, any[]>();
  @Input() campaignOutPut: Campaign;
  workFlowAddedNotificationMessage: string = "Workflow(s) added successfully";
  @Output() messageEvent = new EventEmitter<string>();
  hasError = false;
  customResponse: CustomResponse = new CustomResponse();
//XNFR-921  
  @Input() isPlaybookWorkflow: boolean = false;
  @Input() tracksPlayBook: TracksPlayBook;

  fromEmailUsers:Array<any> = new Array<any>();
  subjects:Array<any> = new Array<any>();
  actions:Array<any> = new Array<any>();
  timePhrases:Array<any> = new Array<any>();
  triggerTitles:Array<any> = new Array<any>();
  @Input() playbookReplies: Array<Reply> = new Array<Reply>();
  @Output() updateReplies = new EventEmitter<{ replies: Reply[]; ids: number[] }>();
  loggedInUserId:number = 0;
  responseType:string = 'e-mail';
  @Input() deletedWorkflowIds:number[]=[];
  mergeTagsInput: any = {};
  selectedReply: Reply = new Reply();
  @Input() expiryDateTime:any;
  errorCustomResponse: CustomResponse = new CustomResponse();
  InfoCustomResponse: CustomResponse = new CustomResponse();

  constructor(public referenceService: ReferenceService, public utilService: UtilService, public authenticationService: AuthenticationService, public properties: Properties, private logger: XtremandLogger, private campaignService: CampaignService, private router: Router,
    public parterService:ParterService,private callActionSwitch:CallActionSwitch,
  ) {
  }
  

  ngOnInit() {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.showContent();
  }

  showContent() {
    if(this.isPlaybookWorkflow){
        this.responseType = 'playbook';
      this.replies = this.playbookReplies;
      this.findAllUsers();
      this.findTriggerTitles()
      this.loadPromptAndNotificationTabsData();
      for(let reply of this.replies){
        if(reply.divId == null || reply.divId == ''){
            var id = 'reply-' + (this.replies.indexOf(reply) +1);
            reply.divId = id;
        }
        reply.previouslySelectedTemplateId = reply.templateId
        reply.timePhraseId = 20;
      }
    }else{
      this.campaign = this.campaignOutPut;
      this.referenceService.loading(this.loader, true);
      this.listWebsiteUrlsByCampaignId(this.campaign.campaignId);
    this.listWorkflowsOptions();
    }
  }

  ngOnChanges() {
  if (this.isPlaybookWorkflow) {
    setTimeout(() => {
      this.updateReplies.emit({
        replies: this.replies,
        ids: this.deletedWorkflowIds
      });
    });
  }
}
  listWebsiteUrlsByCampaignId(campaignId: number) {
    this.campaignService.listCampaignEmailTemplateUrls(campaignId)
      .subscribe(
        data => {
          this.urlLinks = data;
        },
        error => {
          this.urlLinks = [];
          this.logger.error(error);
        }
      );
  }

  listWorkflowsOptions() {
    this.campaignService.listCampaignWorkflowsOptions()
      .subscribe(
        data => {
          this.workflowsMap = data.map;
          console.log(this.workflowsMap);
          this.referenceService.loading(this.loader, false);
        },
        error => {
          this.logger.error(error);
          this.referenceService.loading(this.loader, false);
        }
      );
  }

  isEven(n:number) {
    if (n % 2 === 0) { return true; }
    return false;
  }

  /*********Add Reply********** */
  addReplyRows() {
    this.reply = new Reply();
    let length = this.allItems.length;
    let subject  = this.isPlaybookWorkflow? this.tracksPlayBook.title: this.campaign.subjectLine;
    length = length + 1;
    var id = 'reply-' + length;
    this.reply.divId = id;
    this.reply.actionId = 0;
    this.reply.subject = this.referenceService.replaceMultipleSpacesWithSingleSpace(subject);
    if (this.isPlaybookWorkflow) {
      this.reply.subjectId = this.subjects[0].id;
      this.reply.actionId = this.actions[0].id;
      this.reply.timePhraseId = this.timePhrases[this.timePhrases.length -1].id;
      let teamMember = this.fromEmailUsers.filter((teamMember) => teamMember.id == this.loggedInUserId)[0];
          this.reply.fromEmailUserId = teamMember.id;
          this.reply.fromName = $.trim(teamMember.firstName + " " + teamMember.lastName);
    }
    this.replies.push(this.reply);
    this.allItems.push(id);
    // this.loadEmailTemplatesForWorkFlows(this.reply);
  }

  remove(divId: string, type: string,reply:any) {
    if(this.isPlaybookWorkflow && reply.id != null && reply.id !=0){
      this.deletedWorkflowIds.push(reply.id);
    }
    if (type === "replies") {
      this.replies = this.referenceService.spliceArray(this.replies, divId);
    } else {
      this.urls = this.referenceService.spliceArray(this.urls, divId);
    }
    $('#' + divId).remove();
    let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
    if (errorLength === 0) {
      this.hasError = false;
      this.errorCustomResponse = new CustomResponse();
    }
  }

  getRepliesData() {
    for (var i = 0; i < this.replies.length; i++) {
      let reply = this.replies[i];
      $('#' + reply.divId).removeClass('portlet light dashboard-stat2 border-error');
      this.removeStyleAttrByDivId('reply-days-' + reply.divId);
      this.removeStyleAttrByDivId('reply-subject-' + reply.divId);
      this.removeStyleAttrByDivId('email-template-' + reply.divId);
      this.removeStyleAttrByDivId('reply-message-' + reply.divId);
      this.removeStyleAttrByDivId('reply-fromEmail-' + reply.divId);
      this.removeStyleAttrByDivId('reply-preHeader-' + reply.divId);
      $('#' + reply.divId).addClass('portlet light dashboard-stat2');
      this.validateReplySubject(reply);
    
      if ( !this.isPlaybookWorkflow && reply.actionId !== 16 && reply.actionId !== 17 && reply.actionId !==25 && reply.actionId !==26 && reply.actionId !==27 && reply.actionId !==28 ) {
        this.validateReplyInDays(reply);
        this.validateEmailTemplateForAddReply(reply);
      } else {
        this.validateReplyInDays(reply);
        this.validateEmailTemplateForAddReply(reply);
      }

      
      let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
     
    }
  }

  validateReplyInDays(reply: Reply) {
    this.removeStyleAttrByDivId('reply-days-' + reply.divId);
    if(this.isPlaybookWorkflow && (reply.customDays == null || reply.customDays === 0)){
      this.addReplyDaysErrorDiv(reply);
    }else if (!this.isPlaybookWorkflow && (reply.replyInDays == null || reply.replyInDays === 0)){
      this.addReplyDaysErrorDiv(reply);
    }else{
      this.validateTriggerDate(reply);
    }
  }

  addReplyDaysErrorDiv(reply: Reply) {
    this.addReplyDivError(reply.divId);
    $('#reply-days-' + reply.divId).css('color', 'red');
  }


  validateReplySubject(reply: Reply) {
    if (reply.subject == null || reply.subject === undefined || $.trim(reply.subject).length === 0) {
      this.addReplyDivError(reply.divId);
      console.log("Added Reply Subject Eror");
      $('#reply-subject-' + reply.divId).css('color', 'red');
    }
  }

  validateEmailTemplateForAddReply(reply: Reply) {
    if (( reply.customTemplateSelected) && reply.templateId === 0) {
      $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
      $('#email-template-' + reply.divId).css('color', 'red');
    } else if ( !( reply.customTemplateSelected) && (reply.body == null || reply.body == undefined || $.trim(reply.body).length == 0)) {
      $('#' + reply.divId).addClass('portlet light dashboard-stat2 border-error');
      $('#reply-message-' + reply.divId).css('color', 'red');
    }
  }

  addReplyDivError(divId: string) {
    $('#' + divId).addClass('portlet light dashboard-stat2 border-error');
  }
  removeStyleAttrByDivId(divId: string) {
    $('#' + divId).removeAttr("style");
  }


  /**************Add website visit workflows****** */
  addClickRows(){
    
  }


  saveWorkflows() {
    this.customResponse = new CustomResponse();
    this.errorCustomResponse = new CustomResponse();

    this.getRepliesData();
    let errorLength = $('div.portlet.light.dashboard-stat2.border-error').length;
    if(errorLength===0){
    this.referenceService.goToTop();
      this.hasError = false;
      console.log(this.replies);
      if(this.isPlaybookWorkflow){
        this.playbookReplies = this.replies;
      }else{
       this.addAllWorkflows();
      }
    }else{
      this.hasError = true;
      this.errorCustomResponse = new CustomResponse('ERROR', "Please complete the required fields", true);
      this.referenceService.goToDiv('campaign-work-flow');
    }

  }

  addAllWorkflows() {
    this.referenceService.loading(this.loader, true);
    this.campaignWorkflowsPostDto.campaignId = this.campaign.campaignId;
    this.campaignWorkflowsPostDto.campaignReplies = this.replies;
    this.campaignService.saveWorkflows(this.campaignWorkflowsPostDto)
      .subscribe(
        data => {
          this.messageEvent.emit(this.workFlowAddedNotificationMessage);
        },
        error => {
          this.referenceService.loading(this.loader, false);
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          this.logger.error(error);
        }
      );
  }

  goToManageCampaigns(){
    this.messageEvent.emit("");
  }

    //XNFR-921
    findAllUsers() {
    this.authenticationService.findAllUsers().subscribe(
      response=>{
        this.fromEmailUsers = response.data;
      },error=>{
      });
  }

  
  findTriggerTitles(){
    this.parterService.findTriggerTitles().subscribe(
      response=>{
        this.triggerTitles = response.data;
        
      },error=>{
      });
  }

    loadPromptAndNotificationTabsData(){
    this.parterService.findDefaultTriggerOptions().subscribe(
      response=>{
        let data = response.data;
        this.subjects = data.subjects
        this.actions = data.actions.filter(subj=>subj.value.toLowerCase().includes('playbook'));
        this.timePhrases = data.timePhrases;
      }
    );
  }

    getSelectedEmailTemplateReceiver(event:any, replay:any){
    replay.templateId = event;
    this.validateEmailTemplateForAddReply(replay);
  }

  selectEmailTemplateForEmailAutoResponseWorkflow(event: any, index: number, reply: Reply) {
    reply.customTemplateSelected = event;
  }

    openMergeTagsPopup(type: string, autoResponseSubject: any) {
      this.selectedReply = autoResponseSubject;
    this.mergeTagsInput['isEvent'] = false;
    this.mergeTagsInput['isCampaign'] = false;
    this.mergeTagsInput['hideButton'] = true;
    this.mergeTagsInput['type'] = type;
    this.mergeTagsInput['autoResponseSubject'] = autoResponseSubject;
  }

  clearHiddenClick() {
    this.mergeTagsInput['hideButton'] = false;
  }

  appendValueToSubjectLine(event: any) {
    if (event != undefined) {
      let type = event['type'];
      let copiedValue = event['copiedValue'];
      if (type == "subject") {
        let subjectLine = $.trim(this.selectedReply.subject);
        let updatedValue = subjectLine + " " + copiedValue;
        $('#notificationSubject').val(updatedValue);
        const index = this.replies.indexOf(this.selectedReply);
        if (index !== -1) {
          this.replies[index].subject = updatedValue;
          this.validateReplySubject(this.replies[index]);
        }
      }
    }
    this.mergeTagsInput['hideButton'] = false;
  }

  validateTriggerDate(reply:any) {
  this.InfoCustomResponse = new CustomResponse();

  // Don't show warning if 'Partner Has' and 'Completed Playbook' combination
  if (reply.subjectId == 21 && reply.actionId == 34) {
    reply.showExpiryWarning = false;
    return; 
  }

  if (!this.expiryDateTime || !reply.customDays) {
    reply.showExpiryWarning = false;
    return;
  }

  const now = new Date();
  const triggerDate = new Date(now.getTime() + reply.customDays * 24 * 60 * 60 * 1000);
  const expiry = new Date(this.expiryDateTime);

  reply.showExpiryWarning = triggerDate > expiry;
  if(reply.showExpiryWarning){
    this.InfoCustomResponse = new CustomResponse('INFO', "The auto-response may not trigger because the scheduled send date ('Send in X days') is beyond the playbook expiry date. Please update it to fall within the expiry period.", true);
  }
}

}



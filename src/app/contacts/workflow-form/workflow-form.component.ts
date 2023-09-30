import { Component, ElementRef, OnInit, Renderer} from '@angular/core';
import { ContactService } from '../services/contact.service';
import { Properties } from '../../common/models/properties';
import { ActionsDescription } from '../../common/models/actions-description';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from '../../core/services/authentication.service';
import { SocialContact } from '../models/social-contact';
import { PagerService } from '../../core/services/pager.service';
import { Pagination } from '../../core/models/pagination';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UserService } from '../../core/services/user.service';
import { ParterService } from 'app/partners/services/parter.service';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { CustomResponse } from '../../common/models/custom-response';
import { QueryBuilderConfig } from 'angular2-query-builder';
import { QueryBuilderClassNames } from 'angular2-query-builder';
import { WorkflowDto } from '../models/workflow-dto';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { CustomAnimation } from 'app/core/models/custom-animation';
declare var  $:any, CKEDITOR:any, swal: any;
@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.css'],
  providers: [SocialContact, Pagination, Properties, ActionsDescription,SortOption],
  animations:[CustomAnimation]
})
export class WorkflowFormComponent implements OnInit{

  isAdd = false;
  triggerTitles:Array<any> = new Array<any>();
  triggerTitlesLoader = true;
  divs: number[] = [];
  newDivs: number[] = [];
  clickOr = true;
  loadQueryBuilder = true;
  config:QueryBuilderConfig  = {
    fields:{}
  }
  query  = {};
  showQueryBuilder = false;
  queryBuilderCustomResponse:CustomResponse = new CustomResponse();
  triggerLoader = true;
  subjects:Array<any> = new Array<any>();
  actions:Array<any> = new Array<any>();
  timePhrases:Array<any> = new Array<any>();
  classNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    //arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  }
  workflowDto:WorkflowDto = new WorkflowDto();
  errorClass = "form-group has-error has-feedback";
  successClass = "form-group has-success has-feedback";
  defaultTabClass = "col-block";
  activeTabClass = "col-block col-block-active width";
  completedTabClass = "col-block col-block-complete";
  disableTabClass = "col-block col-block-disable";
  triggersTabClass = this.activeTabClass;
  notificationsTabClass = this.disableTabClass;
  formGroupClass = "form-group";
  titleDivClass:string = this.formGroupClass;
  customDaysDivClass:string = this.formGroupClass;
  notificationSubjectDivClass:string = this.formGroupClass;
  notificationMessageDivClass:string = this.formGroupClass;
  /***Send To******/
  partnerListsLoader = false;
  partnerListsPagination:Pagination = new Pagination();
  partnerListsSortOption: SortOption = new SortOption();
  showPartnerListSearchResultExpandButton = false;
  partnerList: Array<any>;
  isHeaderCheckBoxChecked: boolean;
  selectedListName: any;
  selectedListId: any;
  expandedUserList: any;
  emptyContactsMessage: string;
  selectedPartnerListIds = [];
  showUsersPreview =false;
  userListDTOObj = [];
  isPartnerListSelected = false;
  ngxLoading = false;
  emailReceiversCountError: boolean;
  validUsersCount: any;
  allUsersCount: any;
  isValidTitle = false;
  editedTriggerTitle = "";
  isValidTriggerTab = false;
  isValidPartnerListIds = false;
  isValidNotificationSubject = false;
  isValidNotificationMessage = false;
  isCustomOptionSelected = false;
  isValidCustomDays = true;
  /****Send To*******/
  
  constructor(public userService: UserService, public contactService: ContactService, public authenticationService: AuthenticationService, private router: Router, public properties: Properties,
    public pagination: Pagination, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,
		public actionsDescription: ActionsDescription,public route: ActivatedRoute,public parterService: ParterService,public logger: XtremandLogger,public dealRegSevice: DealRegistrationService,
    private pagerService:PagerService,private utilService:UtilService,private render: Renderer){
      this.referenceService.renderer = this.render;
    }

  ngOnInit() {
    this.referenceService.goToTop();
    this.findTriggerTitles();
    this.getQueryBuilder();
    this.showTriggersTab();
  }

  findTriggerTitles(){
    this.parterService.findTriggerTitles().subscribe(
      response=>{
        this.triggerTitles = response.data;
        this.triggerTitlesLoader = false;
      },error=>{
        this.triggerTitlesLoader = false;
      });
  }

  

  getQueryBuilder(){
    this.parterService.findDefaultTriggerOptions().subscribe(
      response=>{
        this.queryBuilderCustomResponse = new CustomResponse();
        let data = response.data;
        this.subjects = data.subjects;
        if(this.subjects.length>0){
          this.workflowDto.subjectId = this.subjects[0].id;
        }
        this.actions = data.actions;
        if(this.actions.length>0){
          this.workflowDto.actionId = this.actions[0].id;
        }
        this.timePhrases = data.timePhrases;
        if(this.timePhrases.length>0){
          this.workflowDto.timePhraseId = this.timePhrases[0].id;
        }
        let queryBuilderJsonInput  = data.queryBuilderJson;
        let fieldsLength = Object.keys(queryBuilderJsonInput.fields).length;
        this.showQueryBuilder = fieldsLength>0;
        if(this.showQueryBuilder){
          this.config = queryBuilderJsonInput;
          let query = {
            condition: 'and',
            rules: [
              
            ]
          };
          this.workflowDto.filterQueryJson = query;
        }else{
        this.queryBuilderCustomResponse = new CustomResponse('INFO','No Filters Found',true);
        }
        this.partnerListsPagination.maxResults = 4;
        this.findPartnerLists(this.partnerListsPagination);
        this.loadQueryBuilder = false;
        this.triggerLoader = false;
      },error=>{
        this.xtremandLogger.errorPage(error);
      }
    );
  }

  
  validateTitle(){
    this.workflowDto.title = $.trim(this.workflowDto.title);
    let trimmedTitle = this.workflowDto.title.toLowerCase();//Remove all spaces
    var list = this.triggerTitles;
    if (this.isAdd) {
        if ($.inArray(trimmedTitle, list) > -1) {
            this.isValidTitle = false;
        } else {
            this.isValidTitle = true;
        }
    } else {
        if ($.inArray(trimmedTitle, list) > -1 && this.editedTriggerTitle.toLowerCase() != trimmedTitle) {
            this.isValidTitle = false;
        } else {
            this.isValidTitle = true;
        }
    }
    this.validateForm();
  }

  validateCustomDays(){
    this.isValidCustomDays = this.workflowDto.customDays>=1;
    this.validateForm();
    
  }

  validateForm(){
    let errorClass = this.errorClass;
    let successClass = this.successClass;
    /*******Title Name*****/
    let trimmedTitle = $.trim(this.workflowDto.title)
    let isValidTitle = trimmedTitle.length>0 &&  this.isValidTitle;
    this.titleDivClass =  isValidTitle ? successClass :errorClass;
    /***Custom Days****/
    if(this.isCustomOptionSelected){
      this.customDaysDivClass =  this.isValidCustomDays ? successClass :errorClass;
      this.isValidTriggerTab = isValidTitle && this.isValidCustomDays;
    }else{
      this.isValidTriggerTab = isValidTitle;
    }
    if(this.isValidTriggerTab){
      this.notificationsTabClass = this.activeTabClass;
    }else{
      this.disableNotificationTab();
    }

  }

  disableNotificationTab(){
    this.notificationsTabClass = this.disableTabClass;
    this.triggersTabClass = this.activeTabClass;
  }

  showTriggersTab(){
    this.triggersTabClass = this.activeTabClass;
    if(this.isPartnerListSelected && this.isValidTriggerTab){
        this.notificationsTabClass = this.completedTabClass;
    }
    $('#step-2').hide(600);
    $('#step-1').show(600);
    this.referenceService.goToTop();
  }

  showNotificationTab(){
    if(this.isValidTriggerTab){
        this.referenceService.goToTop();
        this.triggersTabClass = this.completedTabClass;
        this.notificationsTabClass = this.activeTabClass;
        $('#step-1').hide(600);
        $('#step-2').show(600);
    }
  }


  addCustomDaysTextBox(){
    this.findCustomOption();
  }

  findCustomOption(){
    this.isCustomOptionSelected = "Custom-In the past custom days"==$.trim($('#time-phrase option:selected').text());
  }

  /*************Partner Lists********/

  findPartnerLists(pagination: Pagination) {
    this.referenceService.goToDiv('step-2');
    this.partnerListsLoader = true;
    if (!this.isAdd) {
        //campaignRecipientsPagination.campaignId = this.campaign.campaignId;
    }
    this.contactService.findContactsAndPartnersForCampaign(pagination)
        .subscribe(
            (response: any) => {
                let data = response.data;
                this.partnerList = data.list;
                pagination.totalRecords = data.totalRecords;
                this.partnerListsSortOption.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems(pagination, this.partnerList);
                var partnerIds = pagination.pagedItems.map(function (a) { return a.id; });
                var items = $.grep(this.selectedPartnerListIds, function (element:any) {
                    return $.inArray(element, partnerIds) !== -1;
                });
                if (items.length == partnerIds.length) {
                    this.isHeaderCheckBoxChecked = true;
                } else {
                    this.isHeaderCheckBoxChecked = false;
                }
                this.partnerListsLoader = false;
            },
            (error: string) => {
                this.xtremandLogger.errorPage(error);
            })
  }

  /******Search/Sort/Pagination******/
  findPartnerListsOnEnterKeyPress(eventKeyCode:number){
    if(eventKeyCode==13){
        this.searchPartnerLists();
    }
  }
  searchPartnerLists(){
    this.setSearchAndSortOptionsForRecipients(this.partnerListsPagination);
  }
  sortPartnerLists(text:any){
    this.partnerListsSortOption.selectedCampaignRecipientsDropDownOption = text;
    this.setSearchAndSortOptionsForRecipients(this.partnerListsPagination);
  }
  setSearchAndSortOptionsForRecipients(partnerListsPagination: Pagination){
  partnerListsPagination.pageIndex = 1;
    partnerListsPagination.searchKey = this.partnerListsSortOption.searchKey.trim();
    if (partnerListsPagination.searchKey != undefined && partnerListsPagination.searchKey != null 
        && partnerListsPagination.searchKey.trim() != "") {
        this.showPartnerListSearchResultExpandButton = true;
    } else {
        this.showPartnerListSearchResultExpandButton = false;
    }
    this.partnerListsPagination = this.utilService.sortOptionValues(this.partnerListsSortOption.selectedCampaignRecipientsDropDownOption, this.partnerListsPagination);
    this.findPartnerLists(partnerListsPagination);
  }

  paginatePartnerLists(event:any){
    this.partnerListsPagination.pageIndex = event.page;
    this.findPartnerLists(this.partnerListsPagination);
  }

  findPartnerListsOnLimitChange(campaignRecipientsPagination:Pagination){
    this.referenceService.goToDiv("user-list-div");
    this.findPartnerLists(campaignRecipientsPagination);
  }


  previewUsers(contactList: any) {
    this.showUsersPreview = true;
    this.selectedListName = contactList.name;
    this.selectedListId = contactList.id;
  }

  resetValues() {
    this.showUsersPreview = false;
    this.selectedListName = "";
    this.selectedListId = 0;
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

  highlightRow(contactList: any, event: any) {
    let contactId = contactList.id;
    let isChecked = $('#' + contactId).is(':checked');
    if (isChecked) {
        $('#partnerJouneyPartnerListTable_' + contactId).addClass('contact-list-selected');
        this.selectedPartnerListIds.push(contactId);
        this.userListDTOObj.push(contactList);
    } else {
        $('#partnerJouneyPartnerListTable_' + contactId).removeClass('contact-list-selected');
        this.selectedPartnerListIds.splice($.inArray(contactId, this.selectedPartnerListIds), 1);
        this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
    }
    this.contactsUtility();
    event.stopPropagation();
    
    
  }
  highlightContactRow(contactList: any, event: any, count: number, isValid: boolean) {
    let contactId = contactList.id;
    if (isValid) {
        this.emptyContactsMessage = "";
        if (count > 0) {
            let isChecked = $('#' + contactId).is(':checked');
            if (isChecked) {
                //Removing Highlighted Row
                $('#' + contactId).prop("checked", false);
                $('#partnerJouneyPartnerListTable_' + contactId).removeClass('contact-list-selected');
                this.selectedPartnerListIds.splice($.inArray(contactId, this.selectedPartnerListIds), 1);
                this.userListDTOObj = this.referenceService.removeSelectedObjectFromList(this.userListDTOObj, contactId);
            } else {
                //Highlighting Row
                $('#' + contactId).prop("checked", true);
                $('#partnerJouneyPartnerListTable_' + contactId).addClass('contact-list-selected');
                this.selectedPartnerListIds.push(contactId);
                this.userListDTOObj.push(contactList);
            }
            this.contactsUtility();
            event.stopPropagation();
        } else {
            this.emptyContactsMessage = "Users are in progress";
        }

    }

  }
  contactsUtility() {
    var trLength = $('#partnerListsTable tbody tr').length;
    var selectedRowsLength = $('[name="partnerListCheckBoxName[]"]:checked').length;
    if (selectedRowsLength > 0 || this.selectedPartnerListIds.length > 0) {
        this.isPartnerListSelected = true;
    } else {
        this.isPartnerListSelected = false;
    }
    if (trLength != selectedRowsLength) {
        $('#partnerJouneyPartnerListHeaderCheckBox').prop("checked", false)
    } else if (trLength == selectedRowsLength) {
        $('#partnerJouneyPartnerListHeaderCheckBox').prop("checked", true);
    }
    this.getValidUsersCount();


  }

  getValidUsersCount() {
    if (this.selectedPartnerListIds.length > 0) {
        this.ngxLoading = true;
        this.emailReceiversCountError = false;
        this.contactService.findAllAndValidUserCounts(this.selectedPartnerListIds)
            .subscribe(
                data => {
                    this.validUsersCount = data['validUsersCount'];
                    this.allUsersCount = data['allUsersCount'];
                    this.emailReceiversCountError = false;
                    this.ngxLoading = false;
                },
                (error: any) => {
                    this.ngxLoading = false;
                    this.emailReceiversCountError = true;
                });
    }
  }

  checkAll(ev: any) {
    if (ev.target.checked) {
        $('[name="partnerListCheckBoxName[]"]').prop('checked', true);
        this.isPartnerListSelected = true;
        let self = this;
        $('[name="partnerListCheckBoxName[]"]:checked').each(function (index) {
            var id = $(this).val();
            self.selectedPartnerListIds.push(parseInt(id));
            self.userListDTOObj.push(self.partnerListsPagination.pagedItems[index]);
            $('#partnerJouneyPartnerListTable_' + id).addClass('contact-list-selected');
        });
        this.selectedPartnerListIds = this.referenceService.removeDuplicates(this.selectedPartnerListIds);
        if (this.selectedPartnerListIds.length == 0) { this.isPartnerListSelected = false; }
        this.userListDTOObj = this.referenceService.removeDuplicates(this.userListDTOObj);
        this.getValidUsersCount();
    } else {
        $('[name="partnerListCheckBoxName[]"]').prop('checked', false);
        $('#partnerListsTable tr').removeClass("contact-list-selected");
        if (this.partnerListsPagination.maxResults > 30 || (this.partnerListsPagination.maxResults == this.partnerListsPagination.totalRecords)) {
            this.isPartnerListSelected = false;
            this.selectedPartnerListIds = [];
        } else {
            this.selectedPartnerListIds = this.referenceService.removeDuplicates(this.selectedPartnerListIds);
            let currentPageContactIds = this.partnerListsPagination.pagedItems.map(function (a) { return a.id; });
            this.selectedPartnerListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.selectedPartnerListIds, currentPageContactIds);
            this.userListDTOObj = this.referenceService.removeDuplicatesFromTwoArrays(this.userListDTOObj, this.partnerListsPagination.pagedItems);
            if (this.selectedPartnerListIds.length == 0) {
                this.isPartnerListSelected = false;
                this.userListDTOObj = [];
            }
        }

    }
    ev.stopPropagation();
  }
  

  ngOnDestroy() { }

  goToAnalytics(){
      this.router.navigate(["/home/partners/individual-partner"]);
    }

  goToWorkflow(){this.router.navigate(["/home/contacts/partner-workflow"]);}

  navigateToPartnerJourneyAutomationSection(){
    this.referenceService.goToRouter("/home/partners/journey-automation");
  }

  getSelectedEmailTemplateReceiver(event:any){
    this.workflowDto.templateId = event;
    this.validateNotificationMessage();
  }
  customUiSwitchEventReceiver(event:any){
    this.workflowDto.customTemplateSelected = event;
    this.validateNotificationMessage();
  }

  
  submitForm(){ 
    this.validateNotificationSubject();
    this.validateNotificationMessage();
    if(this.isValidNotificationMessage && this.isValidNotificationSubject && this.selectedPartnerListIds.length>0){
     this.triggerLoader = true;
     this.workflowDto.selectedPartnerListIds = this.selectedPartnerListIds;
        this.parterService.saveWorkflow(this.workflowDto).subscribe(
            response=>{
              this.triggerLoader = false;
              this.navigateToPartnerJourneyAutomationSection();
            },error=>{
             this.xtremandLogger.errorPage(error);
           }
        );
    }
  
 }
  

  private validateNotificationSubject(){
      this.workflowDto.notificationSubject = $.trim(this.workflowDto.notificationSubject);
      let trimmedNotificationSubject = $.trim(this.workflowDto.notificationSubject.toLowerCase());
      this.isValidNotificationSubject = trimmedNotificationSubject.length>0;
      let isValidNotificationSubject = trimmedNotificationSubject.length>0 &&  this.isValidNotificationSubject;
      this.notificationSubjectDivClass =  isValidNotificationSubject ? this.successClass :this.errorClass;
    }


  private validateNotificationMessage() {
    if(this.workflowDto.customTemplateSelected){
      this.isValidNotificationMessage = this.workflowDto.templateId > 0;
      this.notificationMessageDivClass =  this.isValidNotificationMessage ? this.successClass :this.errorClass;
    }else{
      let notificationMessage = this.referenceService.getCkEditorPlainDescription(this.workflowDto.notificationMessage);
      this.isValidNotificationMessage = notificationMessage.length > 0;
      this.notificationMessageDivClass =  this.isValidNotificationMessage ? this.successClass :this.errorClass;
    }
  }

  

 
}

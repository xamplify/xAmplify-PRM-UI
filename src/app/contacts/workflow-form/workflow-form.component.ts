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
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { ParterService } from 'app/partners/services/parter.service';
import { DealQuestions } from '../../deal-registration/models/deal-questions';
import { DealType } from '../../deal-registration/models/deal-type';
import { DealRegistrationService } from '../../deal-registration/services/deal-registration.service';
import { CustomResponse } from '../../common/models/custom-response';
import { Pipeline } from '../../dashboard/models/pipeline';
import { PipelineStage } from '../../dashboard/models/pipeline-stage';
import { QueryBuilderConfig } from 'angular2-query-builder';
import { QueryBuilderClassNames } from 'angular2-query-builder';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { WorkflowDto } from '../models/workflow-dto';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';



declare var  $:any, CKEDITOR:any, swal: any;

@Component({
  selector: 'app-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.css'],
  providers: [SocialContact, Pagination, Properties, ActionsDescription, CallActionSwitch,SortOption]
})
export class WorkflowFormComponent implements OnInit{

  isAdd = false;
  activeClass: boolean;
  activeClass1:boolean= true;
  activeClass2:boolean;
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
  /****Send To*******/
  
  constructor(public userService: UserService, public contactService: ContactService, public authenticationService: AuthenticationService, private router: Router, public properties: Properties,
    public pagination: Pagination, public referenceService: ReferenceService, public xtremandLogger: XtremandLogger,
		public actionsDescription: ActionsDescription, public callActionSwitch: CallActionSwitch,
		public route: ActivatedRoute,public parterService: ParterService,public logger: XtremandLogger,public dealRegSevice: DealRegistrationService,
    private pagerService:PagerService,private utilService:UtilService,private render: Renderer){
      this.referenceService.renderer = this.render;
    }

  ngOnInit() {
        this.getQueryBuilder();
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
        this.workflowDto.query = query;
      }else{
      this.queryBuilderCustomResponse = new CustomResponse('INFO','No Filters Found',true);
      }
     // this.partnerListsPagination.maxResults = 4;
      this.findPartnerLists(this.partnerListsPagination);
      this.loadQueryBuilder = false;
      this.triggerLoader = false;
    },error=>{
      this.xtremandLogger.errorPage(error);
    }
  );
}

/*************Partner Lists********/

findPartnerLists(pagination: Pagination) {
  this.referenceService.goToTop();
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



validateTitle(){
  let trimmedTitle = $.trim(this.workflowDto.title);
}

getData(){
}

loadEmailTemplates(customTemplateTemplated:boolean){
  if(customTemplateTemplated){
    
  }
}

getSelectedEmailTemplateReceiver(event:any){
  alert("Event Received");
}



  ngOnDestroy() { }

  goToAnalytics(){
      this.router.navigate(["/home/partners/individual-partner"]);
    }

  goToWorkflow(){this.router.navigate(["/home/contacts/partner-workflow"]);}

  

  showAndHideDivs(){
    $('#step-1').hide();
    $('#step-2').show();
    this.activeClass2 = true;
    this.activeClass1 = false;
  }

  goToPrevious(){
    $('#step-1').show();
    $('#step-2').hide();
    this.activeClass1 = true;
    this.activeClass2 = false;
  }


  hideSteps() {
    $("div").each(function () {
        if ($(this).hasClass("activeStepInfo")) {
            $(this).removeClass("activeStepInfo");
            $(this).addClass("hiddenStepInfo");
        }
    });
}

 
  submitForm(){ 
    this.parterService.saveWorkflow(this.workflowDto).subscribe(
        response=>{
        },error=>{
          alert("Error");
        }
    );
  }
  
  addDiv() {
    this.divs.push(this.divs.length + 1);
  }
  deleteDiv(index: number) {
    this.divs.splice(index, 1);
  }



}

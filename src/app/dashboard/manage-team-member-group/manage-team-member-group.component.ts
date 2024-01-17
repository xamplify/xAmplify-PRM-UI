import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { TeamMemberService } from 'app/team/services/team-member.service';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { TeamMember } from 'app/team/models/team-member';


declare var $: any;
@Component({
  selector: 'app-manage-team-member-group',
  templateUrl: './manage-team-member-group.component.html',
  styleUrls: ['./manage-team-member-group.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties, TeamMemberService, CallActionSwitch]
})
export class ManageTeamMemberGroupComponent implements OnInit {

  customResponse: CustomResponse = new CustomResponse();
  updateGroupResponse: CustomResponse = new CustomResponse();
  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  addGroupLoader: HttpRequestLoader = new HttpRequestLoader();
  sortOption: SortOption = new SortOption();
  groupDto: any = {};
  groupSubmitButtonText = "Save";
  groupModalTitle = "Enter Group Details";
  isAdd = true;
  defaultModules: Array<any> = new Array<any>();
  teamMember: TeamMember = new TeamMember();
  modulesStatus: Array<boolean> = new Array<boolean>();
  loading: boolean;
  isDelete: boolean;
  idToDelete: number = 0;
  previewGroup = false;
  selectedGroupId: number = 0;
  selectedGroup: any = {};
  groupEditedFromPreviewSection = false;
  constructor(public xtremandLogger: XtremandLogger, private pagerService: PagerService, public authenticationService: AuthenticationService,
    public referenceService: ReferenceService, public properties: Properties,
    public utilService: UtilService, public teamMemberService: TeamMemberService, public callActionSwitch: CallActionSwitch) {
  }

  ngOnInit() {
    this.findGroups(this.pagination);
  }

  findGroups(pagination: Pagination) {
    this.referenceService.goToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.teamMemberService.findTeamMemberGroups(pagination).subscribe(
      (response: any) => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        $.each(data.list, function (_index: number, list: any) {
          list.displayTime = new Date(list.createdTime);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.referenceService.loading(this.httpRequestLoader, false);
      },
      (error: any) => {
        this.xtremandLogger.error(error);
        this.loading = false;
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        this.referenceService.loading(this.httpRequestLoader, false);
      });
  }

  navigateBetweenPageNumbers(event: any) {
    this.pagination.pageIndex = event.page;
    this.findGroups(this.pagination);
  }

  searchGroups() {
    this.getAllFilteredResults(this.pagination);
  }

  searchGroupsOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchGroups(); } }

  sortBy(text: any) {
    this.sortOption.selectedTeamMemberGroupSortDropDown = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedTeamMemberGroupSortDropDown, pagination);
    this.findGroups(pagination);
  }


  /********************Add/Edit/Delete*********** */
  openCreateDiv() {
    this.isAdd = true;
    this.groupDto = {};
    this.customResponse = new CustomResponse();
    $('#manage-team-member-groups').hide(500);
    $('#add-team-member-group').show(500);
    this.groupSubmitButtonText = "Save";
    this.groupDto.isValidForm = false;
    this.groupDto.defaultGroup = false;
    this.groupDto.saveAs = false;
    this.groupDto.previewGroup = false;
    this.findDefaultModules();

  }

  findDefaultModules() {
    this.defaultModules = [];
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.addGroupLoader, true);
    this.teamMemberService.findDefaultModules().
      subscribe(
        response => {
          this.defaultModules = response.data.modules;
          this.referenceService.loading(this.addGroupLoader, false);
        }, error => {
          this.referenceService.loading(this.addGroupLoader, false);
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
          this.xtremandLogger.errorPage(error);
        }
      );
  }
  goToManage() {
    this.groupDto = {};
    this.referenceService.stopLoader(this.addGroupLoader);
    this.referenceService.stopLoader(this.httpRequestLoader);
    this.customResponse = new CustomResponse();
    $('#add-team-member-group').hide(500);
    $('#manage-team-member-groups').show(500);
    this.referenceService.goToTop();
    this.findGroups(this.pagination);
  }

  changeStatus(event: any, module: any) {
    if (module.moduleName == "All") {
      this.enableOrDisableAllModules(event);
    } else {
      module.enabled = event;
      let modulesWithoutAll = this.defaultModules.filter((item) => item.moduleName != "All");
      let enabledModulesLength = modulesWithoutAll.filter((item) => item.enabled).length;
      let allModule = this.defaultModules.filter((item) => item.moduleName == "All")[0];
      allModule.enabled = (modulesWithoutAll.length == enabledModulesLength);
    }
    this.validateForm();
    let enabledModules = this.defaultModules.filter((item) => item.enabled);
    let roleIds = enabledModules.map(function (a) { return a.roleId; });
    this.groupDto.roleIds = roleIds;
  }

  enableOrDisableAllModules(event: any) {
    let self = this;
    $.each(self.defaultModules, function (_index: number, defaultModule: any) {
      defaultModule.enabled = event;
    });
  }

  validateForm() {
    let validName = $.trim(this.groupDto.name).length > 0;
    let enabledModulesCount = this.defaultModules.filter((item) => item.enabled).length;
    this.groupDto.isValidForm = validName && enabledModulesCount > 0;
  }

  saveOrUpdate() {
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.groupDto.dupliateNameErrorMessage = "";
    this.loading = true;
    this.teamMemberService.saveOrUpdateGroup(this.groupDto, this.isAdd).subscribe(
      response => {
        if (response.statusCode == 200) {
          if(this.groupEditedFromPreviewSection && !this.isAdd){
             this.showPreview(this.groupDto.id,true);
          }else{
            this.pagination = new Pagination();
            this.sortOption = new SortOption();
            this.goToManage();
			let message = this.isAdd ? 'created' : 'updated';
            this.customResponse = new CustomResponse('SUCCESS', 'Group ' + message + ' successfully', true);
          }
        } else {
          this.customResponse = new CustomResponse('ERROR', 'Please select atleast one module', true);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        let statusCode = JSON.parse(error['status']);
        if (statusCode == 409) {
          this.groupDto.dupliateNameErrorMessage = "Already exists";
        }else if(statusCode==400){
          let errorResponse = JSON.parse(error['_body']);
          let message = errorResponse['message'];
          this.customResponse = new CustomResponse('ERROR', message, true);
        }else {
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
      }
    );
  }

 

  confirmAlert(teamMemberGroup:any) {
    if(!teamMemberGroup.defaultGroup){
      this.isDelete = true;
      this.idToDelete = teamMemberGroup.id;
    }
  }

  deleteGroup(event: any) {
    if (event) {
      this.customResponse = new CustomResponse();
      this.referenceService.loading(this.httpRequestLoader, true);
      this.referenceService.goToTop();
      this.teamMemberService.deleteTeamMemberGroups(this.idToDelete)
        .subscribe(
          (response: any) => {
            if (response.statusCode == 200) {
              this.idToDelete = 0;
              this.customResponse = new CustomResponse('SUCCESS', "Group Deleted Successfully", true);
              this.pagination.pageIndex = 1;
              this.findGroups(this.pagination);
            }else if (response.statusCode == 400) {
             this.idToDelete = 0;
            this.referenceService.loading(this.httpRequestLoader, false);
            this.customResponse = new CustomResponse('ERROR',response.message, true);
            }
          },
          (error: any) => {
            this.idToDelete = 0;
            this.referenceService.loading(this.httpRequestLoader, false);
            let statusCode = JSON.parse(error['status']);
            let message = this.properties.serverErrorMessage;
            if (statusCode == 409) {
             let errorResponse = JSON.parse(error['_body']);
             message = errorResponse['message'];
            } 
            this.customResponse = new CustomResponse('ERROR', message, true);
          }
        );
    }
    this.isDelete = false;
  }

  showPreview(id:number,showHeaderMessage:boolean){
    this.referenceService.goToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.teamMemberService.previewTeamMemberGroup(id).subscribe(
      response=>{
        if(showHeaderMessage){
          this.updateGroupResponse = new CustomResponse('SUCCESS', 'Group updated successfully', true);
        }
        this.selectedGroupId = id;
        this.selectedGroup = response.data;
        this.previewGroup = true;
        $('#manage-team-member-groups').hide(500);
        $('#add-team-member-group').hide(500);
        $('#preview-group').show(500);
        this.referenceService.loading(this.httpRequestLoader, false);
      },error=>{
        this.referenceService.loading(this.httpRequestLoader, false);
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
    
  }

  clearPreviewDataAndGoToManage(){
    this.referenceService.goToTop();
    this.previewGroup = false;
    $('#preview-group').hide(600);
    this.groupEditedFromPreviewSection = false;
    this.selectedGroupId = 0;
    this.selectedGroup = {};
    this.updateGroupResponse = new CustomResponse();
    this.goToManage();
  }
  
  editGroupFromPreviewSection(group:any){
    $('#preview-group').hide(500);
     this.groupEditedFromPreviewSection = true;
     this.getTeamMemberGroupDetailsById(group,false);
  }

  findGroupDetailsById(group:any) {
    if(!group.defaultGroup){
      this.getTeamMemberGroupDetailsById(group,false);
    }
  }



  getTeamMemberGroupDetailsById(group:any,saveAs:boolean){
    let id = group.id;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.groupDto = {};
    this.referenceService.goToTop();
    this.defaultModules = [];
    this.customResponse = new CustomResponse();
    this.teamMemberService.findTeamMemberGroupById(id).subscribe(
      response => {
        let map = response.data;
        this.groupDto.id = id;
        this.groupDto = map['teamMemberGroupDTO'];
        this.groupDto.saveAs = saveAs;
        this.groupDto.previewGroup = group.defaultGroup && !saveAs;
        this.defaultModules = map['modules'];
        this.isAdd = saveAs;
        if(saveAs){
          this.groupSubmitButtonText = "Save As";
          this.groupDto.name = this.groupDto.name+"_copy";
        }else{
          this.groupSubmitButtonText = "Update";
        }
        this.groupDto.isValidForm = map['validForm'];
        $('#manage-team-member-groups').hide(500);
        $('#add-team-member-group').show(500);
      }, error => {
        this.xtremandLogger.log(error);
        this.referenceService.loading(this.httpRequestLoader, false);
        this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
      }
    );
  }

  goToManageOrPreview(){
    this.updateGroupResponse = new CustomResponse();
    if(this.groupEditedFromPreviewSection){
        if(this.groupDto.id!=undefined){
          this.showPreview(this.groupDto.id,false);
        }else{
          this.goToManage();
        }
    }else{
      this.goToManage();
    }
  }

  saveAs(group){
    this.getTeamMemberGroupDetailsById(group,true);
  }
  
}

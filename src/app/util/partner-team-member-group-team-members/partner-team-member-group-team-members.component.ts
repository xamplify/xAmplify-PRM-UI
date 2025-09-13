import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { PagerService } from '../../core/services/pager.service';

declare var $: any;
@Component({
  selector: 'app-partner-team-member-group-team-members',
  templateUrl: './partner-team-member-group-team-members.component.html',
  styleUrls: ['./partner-team-member-group-team-members.component.css'],
  providers: [Pagination]
})
export class PartnerTeamMemberGroupTeamMembersComponent implements OnInit {

  public teamMembersLoader: HttpRequestLoader = new HttpRequestLoader();
  teamMembersPagination: Pagination = new Pagination();
  partnerGroupTeamMemberheaderCheckBoxId = "parnterModuleTeamMembersHeaderCheckBox";
  partnerModuleTeamMembersTrId = "partner-module-teamMember-tr";
  partnerModuleTeamMembersTableId = "partner-module-team-members-table";
  partnerModuleTeamMemberCheckBoxName = "partnerModuleTeamMembersCheckBox";
  processingPartnersLoader = false;
  isPartnerPopup:boolean = false ;
  teamMembers: Array<any> = new Array<any>();
  @Input() currentPartner: any;
  @Output() partnerTeamMemberGroupTeamMemberEventEmitter = new EventEmitter();
  @Input() openInModalPopup:boolean = false;
  constructor(public xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public pagerService: PagerService) { }

  ngOnInit() {
    this.teamMembersPagination = new Pagination();
    this.referenceService.startLoader(this.teamMembersLoader);
    if(this.openInModalPopup){
      $('#teamMembersPreviewPopup').modal('show');
      this.isPartnerPopup = true
    }
    this.teamMembersPagination.categoryId = this.currentPartner.teamMemberGroupId;
    this.findPartnerModuleTeamMembers(this.teamMembersPagination, this.currentPartner);
  }

  ngOnDestroy(){
    $('#teamMembersPreviewPopup').modal('hide');
  }

  addContactModalClose() {
    $('#teamMembersPreviewPopup').modal('hide');
    this.teamMembers = new Array<any>();
    this.teamMembersPagination = new Pagination();
    this.partnerTeamMemberGroupTeamMemberEventEmitter.emit(this.currentPartner);
  }
  highlightTeamMemberOnRowClick(teamMemberId: any, event: any, partner: any) {
    this.referenceService.highlightRowOnRowCick(this.partnerModuleTeamMembersTrId + "-" + partner.index, this.partnerModuleTeamMembersTableId + "-" + partner.index,
      this.partnerModuleTeamMemberCheckBoxName + "-" + partner.index, partner.selectedTeamMemberIds, this.partnerGroupTeamMemberheaderCheckBoxId + "-" + partner.index,
      teamMemberId, event);
      this.callEmitterForExpandAndCollpaseFunctionality();
      
  }

  highlightTeamMemberRowOnCheckBoxClick(teamMemberId: any, event: any, partner: any) {
    this.referenceService.highlightRowByCheckBox(this.partnerModuleTeamMembersTrId + "-" + partner.index, this.partnerModuleTeamMembersTableId + "-" + partner.index,
      this.partnerModuleTeamMemberCheckBoxName + "-" + partner.index, partner.selectedTeamMemberIds, this.partnerGroupTeamMemberheaderCheckBoxId + "-" + partner.index,
      teamMemberId, event);
      this.callEmitterForExpandAndCollpaseFunctionality();
  }

  selectOrUnselectAllTeamMembersOfTheCurrentPage(event: any, partner: any) {
    partner.selectedTeamMemberIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage(this.partnerModuleTeamMembersTrId + "-" + partner.index,
      this.partnerModuleTeamMembersTableId + "-" + partner.index, this.partnerModuleTeamMemberCheckBoxName + "-" + partner.index, partner.selectedTeamMemberIds,
      this.teamMembersPagination, event);
      this.callEmitterForExpandAndCollpaseFunctionality();
  }

  

  findPartnerModuleTeamMembers(pagination: Pagination, partner: any) {
    this.referenceService.startLoader(this.teamMembersLoader);
    this.authenticationService.findAllTeamMembersByGroupId(pagination).
      subscribe(
        response => {
          let data = response.data;
          pagination.totalRecords = data.totalRecords;
          pagination = this.pagerService.getPagedItems(pagination, data.list);
          /*******Header checkbox will be chcked when navigating through page numbers*****/
          let teamMemberIds = pagination.pagedItems.map(function (a) { return a.id; });
          let items = $.grep(partner.selectedTeamMemberIds, function (element: any) {
            return $.inArray(element, teamMemberIds) !== -1;
          });
          partner['isTeamMemberHeaderCheckBoxChecked'] = (items.length == teamMemberIds.length && teamMemberIds.length > 0);
          this.referenceService.stopLoader(this.teamMembersLoader);
          let divId = "partner-module-team-members-table-"+this.currentPartner.index;
          this.referenceService.goToDiv(divId);
        }, _error => {
          this.referenceService.stopLoader(this.teamMembersLoader);
          this.referenceService.showSweetAlertServerErrorMessage();
          this.closeTeamMembersPreviewPopup();
        }
      );
  }

  navigatePartnerModuleTeamMembers(event: any, partner: any) {
    this.teamMembersPagination.pageIndex = event.page;
    this.findPartnerModuleTeamMembers(this.teamMembersPagination, partner);
  }

  callEmitterForExpandAndCollpaseFunctionality(){
    if(!this.openInModalPopup){
      /******Notify Other Component***/
      this.partnerTeamMemberGroupTeamMemberEventEmitter.emit(this.currentPartner);
    }
  }

  closeTeamMembersPreviewPopup() {
    $('#teamMembersPreviewPopup').modal('hide');
    this.teamMembers = new Array<any>();
    this.teamMembersPagination = new Pagination();
    this.partnerTeamMemberGroupTeamMemberEventEmitter.emit(this.currentPartner);
  }

  removeAllSelectedTeamMembers(){
    this.referenceService.scrollToModalBodyTopByClass();
    this.currentPartner.selectedTeamMemberIds =  [];
    this.currentPartner['isTeamMemberHeaderCheckBoxChecked'] = false;
    $('#'+this.partnerGroupTeamMemberheaderCheckBoxId+"-"+this.currentPartner['index']).prop('checked', false);
  }

  /** XNFR-938 **/
  searchKeyPress(keyCode: any) {
    if (keyCode === 13) {
      this.searchTeamMembers();
    }
  }
  searchTeamMembers() {
    this.referenceService.setTeamMemberFilterForPagination(this.teamMembersPagination, 0);
    this.findPartnerModuleTeamMembers(this.teamMembersPagination, this.currentPartner);

  }
  /**** XNFR-938 */
  
}

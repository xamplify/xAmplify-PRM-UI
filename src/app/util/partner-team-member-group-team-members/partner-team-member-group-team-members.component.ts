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
  teamMembers: Array<any> = new Array<any>();
  @Input() currentPartner: any;
  @Output() partnerTeamMemberGroupTeamMemberEventEmitter = new EventEmitter();
  constructor(public xtremandLogger: XtremandLogger, public authenticationService: AuthenticationService, public referenceService: ReferenceService, public pagerService: PagerService) { }

  ngOnInit() {
    this.teamMembersPagination = new Pagination();
    this.referenceService.startLoader(this.teamMembersLoader);
    $('#teamMembersPreviewPopup').modal('show');
    this.teamMembersPagination.categoryId = this.currentPartner.teamMemberGroupId;
    this.findPartnerModuleTeamMembers(this.teamMembersPagination, this.currentPartner);
  }



  highlightTeamMemberOnRowClick(teamMemberId: any, event: any, partner: any) {
    this.referenceService.highlightRowOnRowCick(this.partnerModuleTeamMembersTrId + "-" + partner.index, this.partnerModuleTeamMembersTableId + "-" + partner.index,
      this.partnerModuleTeamMemberCheckBoxName + "-" + partner.index, partner.selectedTeamMemberIds, this.partnerGroupTeamMemberheaderCheckBoxId + "-" + partner.index,
      teamMemberId, event);

  }

  highlightTeamMemberRowOnCheckBoxClick(teamMemberId: any, event: any, partner: any) {
    this.referenceService.highlightRowByCheckBox(this.partnerModuleTeamMembersTrId + "-" + partner.index, this.partnerModuleTeamMembersTableId + "-" + partner.index,
      this.partnerModuleTeamMemberCheckBoxName + "-" + partner.index, partner.selectedTeamMemberIds, this.partnerGroupTeamMemberheaderCheckBoxId + "-" + partner.index,
      teamMemberId, event);
  }

  selectOrUnselectAllTeamMembersOfTheCurrentPage(event: any, partner: any) {
    partner.selectedTeamMemberIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage(this.partnerModuleTeamMembersTrId + "-" + partner.index,
      this.partnerModuleTeamMembersTableId + "-" + partner.index, this.partnerModuleTeamMemberCheckBoxName + "-" + partner.index, partner.selectedTeamMemberIds,
      this.teamMembersPagination, event);
  }

  

  findPartnerModuleTeamMembers(pagination: Pagination, partner: any) {
    this.referenceService.scrollToModalBodyTopByClass();
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
        }, _error => {
          this.referenceService.stopLoader(this.teamMembersLoader);
          this.referenceService.showSweetAlertServerErrorMessage();
          this.closeTeamMembersPreviewPopup();
        }
      );
  }

  navigatePartnerModuleTeamMembers(event: any, partner: any) {
    this.referenceService.goToTop();
    this.teamMembersPagination.pageIndex = event.page;
    this.findPartnerModuleTeamMembers(this.teamMembersPagination, partner);
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
  }

}

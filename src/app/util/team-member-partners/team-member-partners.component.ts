import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { SortOption } from 'app/core/models/sort-option';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { PagerService } from 'app/core/services/pager.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { UtilService } from 'app/core/services/util.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { DeleteTeamMemberPartnerRequestDto } from '../models/delete-team-member-partner-request-dto';

declare var $: any, swal: any;
@Component({
  selector: 'app-team-member-partners',
  templateUrl: './team-member-partners.component.html',
  styleUrls: ['./team-member-partners.component.css'],
  providers: [SortOption, HttpRequestLoader, Pagination,Properties]
})
export class TeamMemberPartnersComponent implements OnInit,OnDestroy {

  partnersLoader: HttpRequestLoader = new HttpRequestLoader();
  selectedPartnerTeamMemberGroupMappingIds = [];
  partnersPagination: Pagination = new Pagination();
  isHeaderCheckBoxChecked = false;
  sortOption: SortOption = new SortOption();
  @Input() selectedTeamMemberId: number;
  @Output() teamMemberPartnersPopupEventEmitter = new EventEmitter();
  apiError = false;
  statusCode: number;
  isModalPopupshow = false;
  errorMessage: string;
  isDelete = false;
  customResponse:CustomResponse = new CustomResponse();
  deleteTeamMemberPartnerRequestDto :DeleteTeamMemberPartnerRequestDto = new DeleteTeamMemberPartnerRequestDto();
  refershTeamMemberList = false;
  learingTrackIds = [];
  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService, public teamMemberService: TeamMemberService,
    public xtremandLogger: XtremandLogger, public pagerService: PagerService, public utilService: UtilService,public properties:Properties) { }
  

  ngOnInit() {
    this.openPopup();
  }

  ngOnDestroy(): void {
    swal.close();
    this.closePartnersPreviewPopup();
  }

  openPopup() {
    $('#teamMemberPartnersPreviewPopup').modal('show');
    this.isModalPopupshow = true ;
    this.findPartners(this.partnersPagination);
  }

  findPartners(pagination: Pagination) {
    this.referenceService.scrollToModalBodyTopByClass();
    this.apiError = false;
    this.referenceService.startLoader(this.partnersLoader);
    pagination.userId = this.selectedTeamMemberId;
    this.teamMemberService.findPartners(pagination).subscribe(
      response => {
        let data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        /*******Header checkbox will be chcked when navigating through page numbers*****/
				let partnerTeamGroupMappingIds = pagination.pagedItems.map(function (a) { return a.id; });
				let items = $.grep(this.selectedPartnerTeamMemberGroupMappingIds, function (element: any) {
					return $.inArray(element, partnerTeamGroupMappingIds) !== -1;
				});
				this.isHeaderCheckBoxChecked = (items.length == partnerTeamGroupMappingIds.length && partnerTeamGroupMappingIds.length > 0);
        this.referenceService.stopLoader(this.partnersLoader);
      }, error => {
        this.referenceService.stopLoader(this.partnersLoader);
        this.xtremandLogger.error(error);
        this.statusCode = error.status;
        this.errorMessage = JSON.parse(error['_body']).message;
        this.apiError = true;
      }
    );
  }


  /*************************Sort********************** */
  sortBy(text: any) {
    this.sortOption.selectedActiveUsersSortOption = text;
    this.getAllFilteredResults(this.partnersPagination, this.sortOption);
  }
  /*************************Search********************** */
  partnersSearchOnKeyEvent(keyCode: any) { if (keyCode === 13) { this.searchPartners(); } }

  searchPartners() {
    this.getAllFilteredResults(this.partnersPagination, this.sortOption);
  }

  getAllFilteredResults(pagination: Pagination, sortOption: SortOption) {
    pagination.pageIndex = 1;
    pagination.searchKey = sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(sortOption.selectedActiveUsersSortOption, pagination);
    this.findPartners(pagination);
  }

  navigateBetweenPageNumbers(event: any) {
    this.partnersPagination.pageIndex = event.page;
    this.findPartners(this.partnersPagination);
  }

  findPartnersBySelectingDropDown(pagination: Pagination){
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedActiveUsersSortOption, pagination);
    this.findPartners(pagination);
  }

  highlightSelectedPartnerOnRowClick(partnerTeamGroupMappingId: any, event: any) {
    this.referenceService.highlightRowOnRowCick('team-member-partners-tr', 'teamMemberPartnersTable', 'teamMemberPartnersCheckBox', this.selectedPartnerTeamMemberGroupMappingIds, 'team-member-partners-header-checkbox-id', partnerTeamGroupMappingId, event);
  }

  highlightPartnerRowOnCheckBoxClick(partnerTeamGroupMappingId: any, event: any) {
    this.referenceService.highlightRowByCheckBox('team-member-partners-tr', 'teamMemberPartnersTable', 'teamMemberPartnersCheckBox', this.selectedPartnerTeamMemberGroupMappingIds, 'team-member-partners-header-checkbox-id', partnerTeamGroupMappingId, event);
  }

  selectOrUnselectAllRowsOfTheCurrentPage(event: any) {
    this.selectedPartnerTeamMemberGroupMappingIds = this.referenceService.selectOrUnselectAllOfTheCurrentPage('team-member-partners-tr', 'teamMemberPartnersTable', 'teamMemberPartnersCheckBox', this.selectedPartnerTeamMemberGroupMappingIds, this.partnersPagination, event);
  }

  removeAllSelectedPartners() {
    this.selectedPartnerTeamMemberGroupMappingIds = [];
    this.isHeaderCheckBoxChecked = false;
    $('#team-member-partners-header-checkbox-id').prop('checked',false);
  }

  closePartnersPreviewPopup() {
    $('#teamMemberPartnersPreviewPopup').modal('hide');
    this.teamMemberPartnersPopupEventEmitter.emit(this.refershTeamMemberList);
  }

  openSweetAlert(id:number){
    this.isDelete = true;
  }

  deletePartners(event:any){
    if (event) {
      this.customResponse = new CustomResponse();
      this.referenceService.loading(this.partnersLoader, true);
      this.deleteTeamMemberPartnerRequestDto.partnerTeamGroupMappingIds = this.selectedPartnerTeamMemberGroupMappingIds;
      this.teamMemberService.deletePartners(this.deleteTeamMemberPartnerRequestDto)
        .subscribe(
          (response: any) => {
            if (response.statusCode == 200) {
              this.showPartnerDeletedSuccessMessage();
            }
          },
          (error: any) => {
            this.removeAllSelectedPartners();
            this.deleteTeamMemberPartnerRequestDto = new DeleteTeamMemberPartnerRequestDto();
            this.referenceService.loading(this.partnersLoader, false);
            let statusCode = JSON.parse(error['status']);
            let message = this.properties.serverErrorMessage;
            if (statusCode == 409) {
             let errorResponse = JSON.parse(error['_body']);
             message = errorResponse['message'];
            } 
            this.customResponse = new CustomResponse('ERROR', message, true);
          },()=>{});
    }
    this.isDelete = false;
  }


  private showPartnerDeletedSuccessMessage() {
    this.removeAllSelectedPartners();
    this.refershTeamMemberList = true;
    this.deleteTeamMemberPartnerRequestDto = new DeleteTeamMemberPartnerRequestDto();
    let partnersModuleName = this.authenticationService.partnerModule.customName;
    let message = partnersModuleName + " Deleted Successfully";
    this.customResponse = new CustomResponse('SUCCESS', message, true);
    this.partnersPagination.pageIndex = 1;
    this.partnersPagination.maxResults = 12;
    this.findPartners(this.partnersPagination);
  }
}

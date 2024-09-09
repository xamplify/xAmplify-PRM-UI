import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Lead } from '../models/lead';
import { CustomResponse } from 'app/common/models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { LeadsService } from '../services/leads.service';

declare var swal:any, $:any, videojs: any;

@Component({
  selector: 'app-custom-manage-leads',
  templateUrl: './custom-manage-leads.component.html',
  styleUrls: ['./custom-manage-leads.component.css'],
  providers: [LeadsService, ReferenceService]
})
export class CustomManageLeadsComponent implements OnInit {
  @Input() listView:boolean = false;
  @Input() leadsSortOption: SortOption = new SortOption();
  @Input() httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  @Input() leadsPagination: Pagination = new Pagination();
  @Input() isPartnerVersion: boolean;
  @Input() isVendorVersion: boolean;
  @Input() isOrgAdmin: boolean = false;
  @Input() isVendor: boolean = false;
  @Input() actionType: string;
  @Output() notifySubmitSuccess = new EventEmitter();
  @Output() closeCustomLeadAndDealForm = new EventEmitter();
  @Output() viewCustomLeadForm = new EventEmitter();
  @Output() editCustomLeadForm = new EventEmitter();
  @Output() notifyListLeads = new EventEmitter();
  @Output() notifySetLeadsPage = new EventEmitter();
  showDealForm: boolean;
  leadId: number;
  leadApprovalStatusType: string;
  selectedLead: Lead;
  updateCurrentStage: boolean;
  showLeadForm: boolean;
  leadsResponse: CustomResponse;
  loggedInUserId: number;
  showFilterOption: boolean;
  isCommentSection: boolean;

  constructor(public authenticationService: AuthenticationService, public referenceService: ReferenceService, public leadsService: LeadsService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
  }

  showRegisterDealButton(lead):boolean {
    let showRegisterDeal = false;
    if (lead.selfLead && lead.dealBySelfLead && (this.isOrgAdmin || this.authenticationService.module.isMarketingCompany) && lead.associatedDealId == undefined) {
      showRegisterDeal = true;
    } else if (((((lead.dealByVendor && this.isVendor || lead.canRegisterDeal && lead.dealByPartner) && !lead.selfLead)) && lead.associatedDealId == undefined) 
      && ((lead.enableRegisterDealButton && !lead.leadApprovalOrRejection && !this.authenticationService.module.deletedPartner && lead.leadApprovalStatusType !== 'REJECTED'))) {
      showRegisterDeal = true;
    }
    return showRegisterDeal;
  }

  showDealRegistrationForm(lead: Lead) {
    this.showDealForm = true;
    this.actionType = "add";
    this.leadId = lead.id;
  }

  addApprovalStatusModelPopup(lead:Lead , leadApprovalStatusType:string){
    this.leadApprovalStatusType = leadApprovalStatusType;
    this.selectedLead = lead;
    this.updateCurrentStage = true;
  }

  closeApprovalStatusModelPopup(){
    this.leadApprovalStatusType = null;
    this.updateCurrentStage = false;
    // this.showLeads();
  }

  viewLead(lead: Lead) {  
    this.showLeadForm = true;
    this.actionType = "view";
    this.leadId = lead.id;    
    this.viewCustomLeadForm.emit(lead);
  }


  editLead(lead: Lead) {
    this.showLeadForm = true;
    this.actionType = "edit";
    this.leadId = lead.id;
    this.editCustomLeadForm.emit(lead);
  }

  confirmDeleteLead(lead: Lead) {
    try {
      let self = this;
      swal({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        type: 'warning',
        showCancelButton: true,
        swalConfirmButtonColor: '#54a7e9',
        swalCancelButtonColor: '#999',
        confirmButtonText: 'Yes, delete it!'

      }).then(function () {
        self.deleteLead(lead);
      }, function (dismiss: any) {
        console.log('you clicked on option' + dismiss);
      });
    } catch (error) {
      this.referenceService.showServerError(this.httpRequestLoader);
    }
  }

  deleteLead(lead: Lead) {
    this.referenceService.loading(this.httpRequestLoader, true);
    lead.userId = this.loggedInUserId;
    this.leadsService.deleteLead(lead)
      .subscribe(
        response => {
          this.referenceService.loading(this.httpRequestLoader, false);
          if (response.statusCode == 200) {
            this.leadsResponse = new CustomResponse('SUCCESS', "Lead Deleted Successfully", true);
            //this.getCounts();  
            // this.showLeads();
          } else if (response.statusCode == 500) {
            this.leadsResponse = new CustomResponse('ERROR', response.message, true);
          }
        },
        error => {
          this.httpRequestLoader.isServerError = true;
        },
        () => { this.showFilterOption = false; }
      );

  }

  showComments(lead: any) {
    this.selectedLead = lead;
    this.isCommentSection = !this.isCommentSection;
  }

  closeDealForm() {
    this.showDealForm = false;
    // this.showLeads();
  }

  closeLeadForm(){
    this.showLeadForm = false;
    this.closeCustomLeadAndDealForm.emit();
    // this.showLeads();
  }

  addCommentModalClose(event: any) {
    this.selectedLead.unReadChatCount = 0;
    this.isCommentSection = !this.isCommentSection;
  }

  listLeads(event) {
    this.notifyListLeads.emit(event);
  }

  setLeadsPage(event) {
    this.notifySetLeadsPage.emit(event);
  }

}

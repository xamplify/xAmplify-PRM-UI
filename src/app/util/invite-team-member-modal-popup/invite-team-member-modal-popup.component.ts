import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TagInputComponent as SourceTagInput } from 'ngx-chips';
import { CustomResponse } from 'app/common/models/custom-response';
import { VendorInvitation } from 'app/dashboard/models/vendor-invitation';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Properties } from 'app/common/models/properties';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

declare var $: any, swal: any;

@Component({
  selector: 'app-invite-team-member-modal-popup',
  templateUrl: './invite-team-member-modal-popup.component.html',
  styleUrls: ['./invite-team-member-modal-popup.component.css'],
  providers: [Properties]
})
export class InviteTeamMemberModalPopupComponent implements OnInit {

  onAddedFunc = this.beforeAdd.bind(this);
  validators = [this.mustBeEmail.bind(this)];
  @ViewChild('tagInput') tagInput: SourceTagInput;
  errorMessages = { 'must_be_email': 'Please be sure to use a valid email format' };
  emailIds: any[] = [];
  teamMemberGroups: any;
  tableHeader: string = "";
  ngxLoading: boolean = false;
  isValidationMessage = false;
  addFirstAttemptFailed = false;
  isPopupLoading: boolean = false;
  showModulesPopup: boolean = false;
  inviteTeamMemberHtmlBody: any;
  teamMemberGroupId: number = 0;
  vendorCompanyProfileName: string = '';
  teamMemberGroupPartnersCount: number = 0;
  customResponse: CustomResponse = new CustomResponse();
  vendorInvitation: VendorInvitation = new VendorInvitation();
  @Output() notifyInviteTeamMember: EventEmitter<any> = new EventEmitter();

  constructor(private properties: Properties, private teamMemberService: TeamMemberService, private logger: XtremandLogger,
    private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private referenceService: ReferenceService) {
    this.vendorCompanyProfileName = this.authenticationService.companyProfileName;
  }

  ngOnInit() {
    this.openInviteTeamMemberModal();
    if (this.authenticationService.module.loggedInThroughOwnVanityUrl && this.authenticationService.module.ssoEnabled) {
      this.findAllGroupIdsAndNamesWithDefaultSSOFirst();
    } else {
       this.findAllTeamMemberGroupIdsAndNames();
    }
  }

  ngOnDestroy() {
    this.emailIds = [];
    this.teamMemberGroupId = 0;
    this.teamMemberGroups = [];
    this.showModulesPopup = false;
    this.isValidationMessage = false;
    this.addFirstAttemptFailed = false;
    this.vendorInvitation.emailIds = [];
    this.isPopupLoading = false;
    this.teamMemberGroupPartnersCount = 0
    this.customResponse = new CustomResponse();
  }

  /***** XNFR-805 *****/
  closeModalPopup() {
    $('#invite_team_member_modal').modal('hide');
    this.notifyInviteTeamMember.emit(this.isValidationMessage);
  }

  /***** XNFR-805 *****/
  openInviteTeamMemberModal() {
    this.emailIds = [];
    this.vendorInvitation.emailIds = [];
    this.isPopupLoading = true;
    $('#invite_team_member_modal').modal('show');
    this.tableHeader = this.properties.inviteATeamMemberToJoinxAmplify + (this.vendorCompanyProfileName ? this.vendorCompanyProfileName : 'xAmplify');
    let templateId = this.vendorCompanyProfileName === 'versa-networks' ? 28 : 1;
    this.teamMemberService.getHtmlBody(templateId).subscribe(
      response => {
        if (response.statusCode === 200) {
          let data = response.data;
          this.inviteTeamMemberHtmlBody = this.sanitizer.bypassSecurityTrustHtml(data.body);
          this.vendorInvitation.subject = data.subject;
          setTimeout(() => { const button = document.querySelector('div.button');
            if (button) { button.className = ''; } });
        } else {
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
        this.isPopupLoading = false;
      }, error => {
        this.addServerError(error);
      });
  }

  /***** XNFR-805 *****/
  extractStylesFromHtml(html: string): string {
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const matches = styleRegex.exec(html);
    return matches ? matches[1] : '';
  }

  /***** XNFR-805 *****/
  mustBeEmail(control: FormControl): { [key: string]: boolean } | null {
    if (this.addFirstAttemptFailed && !this.isValidEmail(control.value)) {
      return { "must_be_email": true };
    }
    return null;
  }

  /***** XNFR-805 *****/
  beforeAdd(tag: any): Observable<any> {
    const isPaste = !!tag['value'];
    const emailTag = isPaste ? tag.value : tag;
    if (!this.isValidEmail(emailTag)) {
      return this.handleInvalidEmail(emailTag, isPaste);
    }
    this.addFirstAttemptFailed = false;
    return Observable.of(emailTag);
  }

  /***** XNFR-805 *****/
  private handleInvalidEmail(tag: string, isPaste: boolean): Observable<any> {
    if (!this.addFirstAttemptFailed) {
      this.addFirstAttemptFailed = true;
      if (!isPaste) {
        this.tagInput.setInputValue(tag);
      }
    }
    return isPaste ? Observable.throw(this.errorMessages['must_be_email'])
      : Observable.of('').pipe(tap(() => setTimeout(() => this.tagInput.setInputValue(tag))));
  }

  /***** XNFR-805 *****/
  private isValidEmail(text: string): boolean {
    const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return text ? EMAIL_REGEXP.test(text) : false;
  }

  /***** XNFR-805 *****/
  sendTeamMemberInviteEmail() {
    this.isPopupLoading = true;
    this.isValidationMessage = true;
    this.customResponse = new CustomResponse();
    this.vendorInvitation.vanityURL = this.vendorCompanyProfileName;
    this.vendorInvitation.teamMemberGroupId = this.teamMemberGroupId;
    this.vendorInvitation.emailIds = this.emailIds.map(value => value.value);
    this.teamMemberService.sendTeamMemberInviteEmail(this.vendorInvitation)
      .subscribe(data => {
        if (data.statusCode == 200) {
          this.isValidationMessage = true;
          this.customResponse = new CustomResponse('SUCCESS', data.message, true);
        } else if (data.statusCode == 400 || data.statusCode == 401 || data.statusCode == 413) {
          this.isValidationMessage = false;
          this.vendorInvitation.emailIds = [];
          let duplicateEmailIds = data.data.map((value: string, index: number) => `${index + 1}. ${value}`).join(" ");
          let message = `${data.message} ${duplicateEmailIds}`;
          this.customResponse = new CustomResponse('ERROR', message, true);
        } else {
          this.isValidationMessage = false;
          this.vendorInvitation.emailIds = [];
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
        this.isPopupLoading = false;
      }, error => {
        this.addServerError(error);
        this.isValidationMessage = false;
        this.vendorInvitation.emailIds = [];
      });
  }

  /***** XNFR-1051 *****/
  findAllTeamMemberGroupIdsAndNames() {
    this.isPopupLoading = true;
    this.teamMemberService.findAllTeamMemberGroupIdsAndNames(true)
      .subscribe(
        response => {
          this.isPopupLoading = false;
          this.teamMemberGroups = response.data;
           if (this.teamMemberGroups && this.teamMemberGroups.length) {
        this.teamMemberGroupId = this.teamMemberGroups[0].id;
        this.getPartnersCount(this.teamMemberGroupId);          
      }
        }, error => {
          this.isPopupLoading = false;
          this.addServerError(error);
        });
  }

  findAllGroupIdsAndNamesWithDefaultSSOFirst() {
    this.isPopupLoading = true;
    this.teamMemberService.findAllGroupIdsAndNamesWithDefaultSSOFirst()
      .subscribe(
        response => {
          this.teamMemberGroups = response.data;
          if (this.teamMemberGroups && this.teamMemberGroups.length) {
        this.teamMemberGroupId = this.teamMemberGroups[0].id;   // pre-select
        this.getPartnersCount(this.teamMemberGroupId);          // << call here
      }
          this.isPopupLoading = false;
        },
        error => {
          this.logger.errorPage(error);
          this.isPopupLoading = false;
        });
  }

  /***** XNFR-1051 *****/
  addServerError(error: any) {
    this.logger.info(error);
    this.ngxLoading = false;
    this.isPopupLoading = false;
    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
  }

  /***** XNFR-1051 *****/
  getPartnersCount(teamMemberGroupId: number) {
    this.ngxLoading = true;
    this.teamMemberGroupId = teamMemberGroupId;
    this.teamMemberService.getPartnersCount(teamMemberGroupId).subscribe(
      response => {
        this.ngxLoading = false;
        this.teamMemberGroupPartnersCount = response.data;
      }, error => {
        this.addServerError(error);
      }
    );
  }

  /***** XNFR-1051 *****/
  previewModules(teamMemberGroupId: number) {
    this.showModulesPopup = true;
    this.teamMemberGroupId = teamMemberGroupId;
  }

  /***** XNFR-1051 *****/
  hideModulesPreviewPopUp() {
    this.showModulesPopup = false;
  }

}

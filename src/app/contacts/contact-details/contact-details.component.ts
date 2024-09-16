import { Component, Input, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { ContactService } from '../services/contact.service';
import { User } from 'app/core/models/user';
import { EditUser } from '../models/edit-user';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { LeadsService } from 'app/leads/services/leads.service';
import { PagerService } from 'app/core/services/pager.service';
import { DealsService } from 'app/deals/services/deals.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/core/services/user.service';
import { LegalBasisOption } from 'app/dashboard/models/legal-basis-option';
import { first } from 'rxjs/operator/first';
declare var $: any, swal: any;

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css'],
  providers: [LeadsService, DealsService, Properties, UserService]
})
export class ContactDetailsComponent implements OnInit {
  @Input() public selectedContact:any;
  @Input() public manageCompanies:boolean = false;
  @Input() public selectedCompanyId:number;
  @Input() isTeamMemberPartnerList: boolean;
  @Input() contacts: User[];
  // @Input() pagination: Pagination;
  @Input() selectedContactListId: any;

  highlightLetter:string = '';
  selectedCompanyContactId: any;
  isCompanyContact: boolean;
  contactAllDetails: any;
  isUpdateUser: boolean = false;
  updateContactUser: boolean = false;
  isLoading:boolean = false;
  editUser: EditUser = new EditUser();
  customResponse: CustomResponse = new CustomResponse();
  contactId:any;
  loggedInUserId:any;
  leadsPagination: Pagination = new Pagination();
  selectedTabIndex: number;
  selectedFilterIndex: number = 1;
  vanityLoginDto: VanityLoginDto = new VanityLoginDto();
  showLeadsTab: boolean;
  listView:boolean = true;
  showLeadForm: boolean;
  actionType: string;
  leadId: number;
  isConvertingContactToLead: boolean = true;

  showDealsTab: boolean = false;
  companyId: any;
  gdprInput:any;
  gdprSetting: any;
  gdprStatus:boolean = true;
  termsAndConditionStatus:boolean = true;
  fields: { text: string; value: string; };
  legalBasisOptions: Array<LegalBasisOption>;
  isLoadingList: boolean = false;
  pagination: Pagination = new Pagination();
  contactName: string = '';

  constructor(public referenceService: ReferenceService, public contactService: ContactService, public properties: Properties,
    public authenticationService: AuthenticationService, public leadsService: LeadsService, public pagerService: PagerService, 
    public dealsService: DealsService, public route:ActivatedRoute, public userService: UserService ) {
    this.loggedInUserId = this.authenticationService.getUserId();
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = true;
    } else {
      this.vanityLoginDto.userId = this.loggedInUserId;
      this.vanityLoginDto.vanityUrlFilter = false;
    }
    const currentUser = localStorage.getItem('currentUser');
		let campaginAccessDto = JSON.parse(currentUser)['campaignAccessDto'];
		this.companyId = campaginAccessDto.companyId;
    this.gdprInput = {};
   }

  ngOnInit() {
    this.selectedContactListId = this.referenceService.decodePathVariable(this.route.snapshot.params['userListId']);
    this.contactId = this.referenceService.decodePathVariable(this.route.snapshot.params['id']);
    this.getContact();
    this.referenceService.goToTop();
    this.checkTermsAndConditionStatus();
    this.getLegalBasisOptions();
  }
// plus& minus icon
  toggleClass(id: string) {
    $("i#" + id).toggleClass("fa-minus fa-plus");
  }

  setHighlightLetter() {
    const firstName = this.selectedContact.firstName;
    const emailId = this.selectedContact.emailId;
    if (this.referenceService.checkIsValidString(firstName)) {
      this.highlightLetter = this.referenceService.getFirstLetter(firstName);
    } else if (this.referenceService.checkIsValidString(emailId)) {
      this.highlightLetter = this.referenceService.getFirstLetter(emailId);
    }
  }

  editContactDetails(contactDetails) {
		this.updateContactUser = true;
		this.isUpdateUser = true;
		this.contactAllDetails = contactDetails;
		this.contactService.isContactModalPopup = true;
		this.isCompanyContact = this.manageCompanies;
		this.selectedCompanyContactId = this.selectedCompanyId;
	}

  updateContactListUser(event) {
    try {
      this.isLoading = true;
      this.editUser.pagination = this.pagination;
      this.editUser.pagination.partnerCompanyId = this.selectedContact.contactCompanyId;
      if (event.mobileNumber) {
        if (event.mobileNumber.length < 6) {
          event.mobileNumber = "";
        }
      }
      if (event.country === "Select Country") {
        event.country = null;
      }
      this.editUser.user = event;
      this.contactService.updateContactListUser(this.selectedContactListId, this.editUser).subscribe(
        data => {
          if (data.access) {
            this.customResponse = new CustomResponse('SUCCESS', this.properties.CONTACTS_UPDATE_SUCCESS, true);
            this.selectedContact = event;
            this.selectedContact.id = this.contactId;
            this.setContactNameToDisplay();
          }
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
        }
      )
    } catch (error) {
      console.log(error);
      this.isLoading = false;
    }
  }

  setActiveTab(tabName:string) {
    if (tabName === 'leads1') {
      
    } else if (tabName === 'deals1') {
      this.showDealsTab = true;
    }
  }

  closeLeadForm() {
    this.showLeadForm = false;
  }

  viewOrEditCustomLeadForm() {
    this.showLeadForm = true;
  }

  showSubmitSuccess() {
    this.customResponse = new CustomResponse('SUCCESS', this.properties.LEADS_UPDATE_SUCCESS, true);
  }

  getContact() {
    this.isLoading = true
    this.contactService.findContactByUserIdAndUserListId(this.contactId, this.selectedContactListId).subscribe(
      data => {
        this.selectedContact = data.data;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      },
      () => {
        this.setHighlightLetter();
        this.showLeadsTab = true;
        this.setContactNameToDisplay();
      }
    )
  }

  checkTermsAndConditionStatus() {
		if (this.companyId > 0) {
			this.isLoading = true;
			this.userService.getGdprSettingByCompanyId(this.companyId)
				.subscribe(
					response => {
						if (response.statusCode == 200) {
							this.gdprSetting = response.data;
							this.gdprStatus = this.gdprSetting.gdprStatus;
							this.termsAndConditionStatus = this.gdprSetting.termsAndConditionStatus;
						}
						this.gdprInput['termsAndConditionStatus'] = this.termsAndConditionStatus;
						this.gdprInput['gdprStatus'] = this.gdprStatus;
            this.isLoading = false;
					},
					(error: any) => {
						this.isLoading = false;
					}
					// () => this.xtremandLogger.info('Finished getGdprSettings()')
				);
		}

	}

  getLegalBasisOptions() {
		if (this.companyId > 0) {
			this.isLoading = true;
			this.fields = { text: 'name', value: 'id' };
			this.referenceService.getLegalBasisOptions(this.companyId)
				.subscribe(
					data => {
						this.legalBasisOptions = data.data;
						this.gdprInput['legalBasisOptions'] = this.legalBasisOptions;
						this.isLoading = false;
					},
					(error: any) => {
						this.isLoading = false;
					}
					// () => this.xtremandLogger.info('Finished getLegalBasisOptions()')
				);
		}

	}

  backToEditContacts() {
    let encodedURL = this.referenceService.encodePathVariable(this.selectedContactListId);
    this.referenceService.goToRouter("/home/contacts/edit/"+encodedURL);
  }

  backToManageContacts() {
    this.referenceService.goToRouter("/home/contacts/manage");
  }

  setContactNameToDisplay() {
    let firstName = this.selectedContact.firstName;
    let lastName = this.selectedContact.lastName;
    let isValidFirstName = this.referenceService.checkIsValidString(firstName);
    let isValidLastName = this.referenceService.checkIsValidString(lastName);
    if (isValidFirstName) {
      this.contactName = firstName;
    }
    if (isValidLastName) {
      this.contactName += isValidFirstName ? ` ${lastName}` : lastName;
    }
  }
  
}

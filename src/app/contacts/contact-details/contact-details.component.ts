import { Component, Input, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { ContactService } from '../services/contact.service';
import { User } from 'app/core/models/user';
import { EditUser } from '../models/edit-user';
import { Pagination } from 'app/core/models/pagination';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $: any, swal: any;

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  @Input() public selectedContact:any;
  @Input() public manageCompanies:boolean = false;
  @Input() public selectedCompanyId:number;
  @Input() public gdprInput:any;
  @Input() isTeamMemberPartnerList: boolean;
  @Input() contacts: User[];
  @Input() pagination: Pagination;
  @Input() selectedContactListId: number;

  highlightLetter:string = '';
  selectedCompanyContactId: any;
  isCompanyContact: boolean;
  contactAllDetails: any;
  isUpdateUser: boolean = false;
  updateContactUser: boolean = false;
  isLoading:boolean = false;
  editUser: EditUser = new EditUser();
  customResponse: CustomResponse = new CustomResponse();
  contactId:number;
  loggedInUserId:any;
  showLeads:boolean = false;

  constructor(public referenceService: ReferenceService, public contactService: ContactService, public properties: Properties,
    public authenticationService: AuthenticationService ) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
    this.contactId = this.selectedContact.id;
    this.referenceService.goToTop();
    this.setHighlightLetter();
  }
// plus& minus icon
  toggleClass(id: string) {
    $("i#" + id).toggleClass("fa-minus fa-plus");
  }

  setHighlightLetter() {
    if (this.selectedContact.firstName != undefined && this.selectedContact.firstName != null && this.selectedContact.firstName.trim().length > 0) {
      this.highlightLetter = this.selectedContact.firstName.slice(0, 1);
    } else if (this.selectedContact.emailId != undefined && this.selectedContact.emailId != null && this.selectedContact.emailId.trim().length > 0) {
      this.highlightLetter = this.selectedContact.emailId.slice(0, 1);
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
    this.isLoading = true;
    this.editUser.pagination = this.pagination;
    this.editUser.pagination.partnerCompanyId = this.contactAllDetails.companyId;
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
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    )
  }

  setActiveTab(tabName:string) {
    if (tabName === 'leads1') {
      
    } else if (tabName === 'deals1') {
      this.showLeads = true;
    }
  }
}

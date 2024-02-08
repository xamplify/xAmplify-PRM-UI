import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ManageContactsComponent } from '../manage-contacts/manage-contacts.component';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { ActionsDescription } from 'app/common/models/actions-description';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { ContactService } from '../services/contact.service';
import { CompanyService } from 'app/company/service/company.service';

@Component({
  selector: 'app-add-company-contacts',
  templateUrl: './add-company-contacts.component.html',
  styleUrls: ['./add-company-contacts.component.css'],
  providers:[ManageContactsComponent,Properties,ActionsDescription,Pagination,CallActionSwitch,CompanyService]
})
export class AddCompanyContactsComponent implements OnInit {

  selectedContactListId = 0;
  uploadedUserId: any;
  selectedContactListName: any;
  isDefaultPartnerList: any;
  isSynchronizationList: any;
  isTeamMemberPartnerList: any;
  showAll: boolean;
  showEdit: boolean;
  isFormList: any;
  loggedInUserId: number;
  selectedCompanyName: any;
  isManageCompanies: boolean = false;
  isBreadCrumb: boolean =  false;
  selectedCompanyId: number;
  
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public route:ActivatedRoute, private contactService: ContactService, private companyService: CompanyService) {
    this.loggedInUserId = this.authenticationService.getUserId();
   }

  ngOnInit() {
   this.selectedContactListId =  this.route.snapshot.params['id'];
   this.getContactListBySelectedContactListId(this.selectedContactListId);
  }
  getContactListBySelectedContactListId(selectedContactListId: number){
    this.contactService.getUserListByUserListId(selectedContactListId)
    .subscribe(
      (response: any) => {
        if (response.statusCode == 200) {
          this.selectedContactListName = response.data.name;
          this.isDefaultPartnerList = response.data.defaultPartnerList;
          this.isSynchronizationList = response.data.synchronisedList;
          this.isTeamMemberPartnerList = response.data.teamMemberPartnerList;
          this.showAll = false;
          this.showEdit = true;
          this.isBreadCrumb = true;
          this.isManageCompanies = true;
          this.selectedCompanyId = response.data.associatedCompanyId;
          this.getCompany(response.data.associatedCompanyId)
        }
      },
      error => {
      },
      () => { }
    );
  }

  getCompany(companyId: number) {
    this.companyService.getCompanyById(companyId, this.loggedInUserId)
      .subscribe(
        (data: any) => {
          if (data.statusCode == 200) {
            this.selectedCompanyName = data.data.name;
          }
        },
        error => {
        },
        () => { }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { ManageContactsComponent } from '../manage-contacts/manage-contacts.component';
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { ActionsDescription } from 'app/common/models/actions-description';
import { CallActionSwitch } from 'app/videos/models/call-action-switch';

@Component({
  selector: 'app-add-company-contacts',
  templateUrl: './add-company-contacts.component.html',
  styleUrls: ['./add-company-contacts.component.css'],
  providers:[ManageContactsComponent,Properties,ActionsDescription,Pagination,CallActionSwitch]
})
export class AddCompanyContactsComponent implements OnInit {

  selectedContactListId = 0;
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,public route:ActivatedRoute) {

   }

  ngOnInit() {
   this.selectedContactListId =  this.route.snapshot.params['id'];
  }

}

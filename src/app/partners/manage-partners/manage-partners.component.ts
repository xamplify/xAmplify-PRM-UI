import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../../core/models/user';
import { Pagination } from '../../core/models/pagination';

import { ContactService } from '../../contacts/services/contact.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';

@Component( {
    selector: 'app-manage-partners',
    templateUrl: './manage-partners.component.html',
    styleUrls: ['./manage-partners.component.css'],
    providers: [Pagination]
} )
export class ManagePartnersComponent implements OnInit {
    loggedInUserId: number;
    user: User;
    constructor( private authenticationService: AuthenticationService,
        private referenceService: ReferenceService,
        private contactService: ContactService,
        private pagination: Pagination ) {
        this.user = new User();
    }

    listPartners( userId: number ) {
        this.contactService.listContactsOfDefaultPartnerList( userId, this.pagination )
            .subscribe(
            ( data: any ) => {
                this.pagination.totalRecords = data.totalRecords;
            },
            error =>
                () => console.log( 'loadContacts() finished' )
            );
    }
    
    defaultPartnerList( userId: number ){
        this.contactService.defaultPartnerList( userId )
        .subscribe(
        ( data: any ) => {
            console.log(data);
        },
        error =>
            () => console.log( 'loadContacts() finished' )
        );
    }
    ngOnInit() {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.defaultPartnerList( this.loggedInUserId );
    }

}

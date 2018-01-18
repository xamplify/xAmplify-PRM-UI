import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../contacts/services/contact.service';
import { Pagination } from '../../core/models/pagination';
import { DashboardService } from '../dashboard.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { PagerService } from '../../core/services/pager.service';
import { ContactList } from '../../contacts/models/contact-list';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css'],
  providers: [DashboardService,Pagination]
})
export class SharedComponent implements OnInit {
    public totalRecords: number;
emptyContactsUsers: boolean;
public allFollowers: Array<ContactList>;
public searchKey: string;
sortingName: string = null;
sortcolumn: string = null;
sortingOrder: string = null;

sortContactUsers = [
                { 'name': 'Sort By', 'value': '' },
                { 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
                { 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
                { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
                { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
                { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
                { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
            ];
            public contactsUsersSort: any = this.sortContactUsers[0];

constructor(private dashboardService: DashboardService,public pagination: Pagination,private contactService: ContactService,
      private pagerService: PagerService,private logger: XtremandLogger) { 
  this.allFollowers = new Array<ContactList>();
}

setPage( page: number ) {
  this.pagination.pageIndex = page;
  this.sharedDetails( this.pagination )
}

userSelectedSortByValue( event: any ) {
  this.contactsUsersSort = event;
  const sortedValue = this.contactsUsersSort.value;
  if ( sortedValue !== '' ) {
      const options: string[] = sortedValue.split( '-' );
      this.sortcolumn = options[0];
      this.sortingOrder = options[1];
  } else {
      this.sortcolumn = null;
      this.sortingOrder = null;
  }
  this.pagination.pageIndex = 1;
  this.pagination.sortcolumn = this.sortcolumn;
  this.pagination.sortingOrder = this.sortingOrder;
      this.sharedDetails( this.pagination );
}

searchContactTitelName() {
  console.log( this.searchKey );
  this.pagination.searchKey = this.searchKey;
  this.pagination.pageIndex = 1;
      this.sharedDetails( this.pagination );
}

sharedDetails( pagination: Pagination ) {
  //this.pagination.maxResults = 12;
  this.logger.log( pagination );
  this.contactService.listContactsByType('all', pagination )
      .subscribe(
      ( data: any ) => {
          this.allFollowers = data.listOfUsers;
          this.totalRecords = data.totalRecords;
          if ( data.totalRecords.length == 0 ) {
              this.emptyContactsUsers = true;
          } else {
              pagination.totalRecords = this.totalRecords;
              this.logger.info( this.allFollowers );
              pagination = this.pagerService.getPagedItems( pagination, this.allFollowers );
              this.logger.log( data );
          }
          /*if (this.allFollowers.length == 0) {
              this.emptyContactsUsers = true;
              this.hidingContactUsers = false;
           }
           else {
               this.emptyContactsUsers = false;
               this.hidingContactUsers = true;
               this.pagedItems = null ;
           }*/
      },
      error => console.log( error ),
      () => console.log( "finished" )
      );
}

ngOnInit() {
  this.sharedDetails(this.pagination);
}

}

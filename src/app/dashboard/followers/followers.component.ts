import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../contacts/services/contact.service';
import { Pagination } from '../../core/models/pagination';
import { DashboardService } from '../dashboard.service';
import { Logger } from 'angular2-logger/core';
import { PagerService } from '../../core/services/pager.service';
import { ContactList } from '../../contacts/models/contact-list';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
  providers: [DashboardService,Pagination]
})
export class FollowersComponent implements OnInit {
    public totalRecords: number;
    emptyContactsUsers: boolean;
    public allFollowers: Array<ContactList>;
  constructor(private dashboardService: DashboardService,private pagination: Pagination,private contactService: ContactService,
          private pagerService: PagerService,private logger: Logger) { 
      this.allFollowers = new Array<ContactList>();
  }

  setPage( page: number, ) {
      this.pagination.pageIndex = page;
      this.followersData( this.pagination )
  }
  
  followersData( pagination: Pagination ) {
      //this.pagination.maxResults = 12;
      this.logger.log( pagination );
      this.contactService.loadAllContacts( pagination )
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
      this.followersData(this.pagination);
  }

}

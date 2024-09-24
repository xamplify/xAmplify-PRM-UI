import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../services/reference.service';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { UtilService } from '../services/util.service';
import { PagerService } from '../services/pager.service';
import { Pagination } from '../models/pagination';
import { HttpRequestLoader } from '../models/http-request-loader';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    providers: [ SocialPagerService, PaginationComponent, PagerService ]
})
export class NotificationsComponent implements OnInit {
    @Input('isTopNavBar') isTopNavBar = false;
    @Input('isWelcomePage') isWelcomePage = false;
    notifications = [];
    pager: any = {};
    pagedItems: any[];
    pageSize = 12;
    pageNumber: any;
    public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    constructor(private router: Router, public userService: UserService, public authenticationService: AuthenticationService,
    public referenceService:ReferenceService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent,
    public utilService: UtilService, public pagerService:PagerService) {

        // this.pageNumber = this.paginationComponent.numberPerPage[0];
    }
    pagination: Pagination = new Pagination();
    listNotifications(pagination:Pagination) {
      try{
        this.referenceService.loading(this.httpRequestLoader, true);
        this.userService.listNotifications(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.notifications = data;
                pagination.totalRecords = this.notifications.length;
                pagination =this.pagerService.getPagedItems(pagination, data);
                this.pager = this.socialPagerService.getPager( this.notifications.length, this.pagination.pageIndex, this.pagination.maxResults );
                this.pagination.pagedItems = this.notifications.slice( this.pager.startIndex, this.pager.endIndex + 1 );
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            error => console.log(error));
        }catch(error) {console.error('error'+error); }
    }
    
    markAllAsRead() {
      try{
        this.userService.markAllAsRead(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.userService.unreadNotificationsCount = 0;
                for(const notification of this.notifications) {
                    notification.read = true;
                }
            },
            error => console.log(error)
            );
        }catch(error) {console.error('error'+error); }
    }
    markAsRead(notification: any) {
      try{
        this.userService.markAsRead(notification)
            .subscribe(
            data => {
            },
            error => console.log(error)
            );
        }catch(error) {console.error('error'+error); }
    }

    navigate(notification: any) {
        if (!notification.read) {
            this.userService.unreadNotificationsCount--;
            this.markAsRead(notification);
        }
        this.referenceService.campaignType ='REGULAR'; // get the campaign type dynamically to show the analytics loader correctly
        this.router.navigate(['/home/' + notification.targetUrl]);
    }
    setPage(event: any) {
        this.pagination.pageIndex = event.page;
        this.listNotifications(this.pagination);
    }

    // setPage( page: number ) {
    //     try{
    //       if ( page < 1 || page > this.pager.totalPages ) {
    //           return;
    //       }
    //       this.pager = this.socialPagerService.getPager( this.notifications.length, page, this.pageSize );
    //       this.pagedItems = this.notifications.slice( this.pager.startIndex, this.pager.endIndex + 1 );
    //     }catch(error) {console.error('error'+error); }
    //   }
  
    // selectedPageNumber(event) {
    //     this.pageNumber.value = event;
    //     if (event === 0) { event = this.notifications.length; }
    //     this.pageSize = event;
    //     this.setPage(1);
    //   }

    ngOnInit() {
        if(this.router.url.includes('home/dashboard/notifications')){
        this.utilService.setRouterLocalStorage('notification');
        }
        this.listNotifications(this.pagination);
    }

}

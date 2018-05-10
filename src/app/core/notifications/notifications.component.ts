import { hasProperties } from 'codelyzer/util/astQuery';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../services/reference.service';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { PaginationComponent } from '../../common/pagination/pagination.component';


@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    providers: [ SocialPagerService, PaginationComponent ]
})
export class NotificationsComponent implements OnInit {
    @Input('isTopNavBar') isTopNavBar = false;
    notifications = [];
    pager: any = {};
    pagedItems: any[];
    pageSize: number = 12;
    pageNumber: any;
    constructor(private router: Router, public userService: UserService, public authenticationService: AuthenticationService,
    public referenceService:ReferenceService, public socialPagerService: SocialPagerService, public paginationComponent: PaginationComponent) {
        
        this.pageNumber = this.paginationComponent.numberPerPage[0];
    }

    listNotifications() {
        this.userService.listNotifications(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.notifications = data;
                this.setPage( 1 );
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }

    markAllAsRead() {
        this.userService.markAllAsRead(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.userService.unreadNotificationsCount = 0;
                for(const notification of this.notifications) {
                    notification.read = true;
                }
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }
    markAsRead(notification: any) {
        this.userService.markAsRead(notification)
            .subscribe(
            data => {
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }

    navigate(notification: any) {
        if (!notification.read) {
            this.userService.unreadNotificationsCount--;
            this.markAsRead(notification);
        }
        this.router.navigate(['/home/' + notification.targetUrl]);
    }
    
    setPage( page: number ) {
        if ( page < 1 || page > this.pager.totalPages ) {
            return;
        }
        this.pager = this.socialPagerService.getPager( this.notifications.length, page, this.pageSize );
        this.pagedItems = this.notifications.slice( this.pager.startIndex, this.pager.endIndex + 1 );
    }
    
    selectedPageNumber(event) {
        this.pageNumber.value = event;
        if (event === 0) { event = this.notifications.length; }
        this.pageSize = event;
        this.setPage(1);
      }
    
    ngOnInit() {
        this.listNotifications();
    }

}

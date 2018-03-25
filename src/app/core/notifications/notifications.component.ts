import { hasProperties } from 'codelyzer/util/astQuery';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
    @Input('isTopNavBar') isTopNavBar = false;
    notifications: any;
    constructor(private router: Router, public userService: UserService, public authenticationService: AuthenticationService) { }

    listNotifications() {
        this.userService.listNotifications(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.notifications = data;
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
    ngOnInit() {
        this.listNotifications();
    }

}

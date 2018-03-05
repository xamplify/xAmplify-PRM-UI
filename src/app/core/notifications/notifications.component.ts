import { Component, OnInit, Input } from '@angular/core';
import { TopnavbarComponent } from '../../core/topnavbar/topnavbar.component';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    providers: [TopnavbarComponent]
})
export class NotificationsComponent implements OnInit {
    @Input('isTopNavBar') isTopNavBar = false;
    notifications: any;
    totalNotificationsCount: number;
    notificationsCount = 0;
    constructor(public topnavbarComponent: TopnavbarComponent, public userService: UserService, public authenticationService: AuthenticationService) { }
    
    listNotifications() {
        this.userService.listNotifications(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.notifications =  data;
                let count = 0;
                for (const i in this.notifications) {
                    if (this.notifications[i].read === false) {
                        count = count + 1;
                    }
                }
                this.notificationsCount = count;
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }

    markAllAsRead() {
        this.userService.markAllAsRead(this.authenticationService.getUserId())
            .subscribe(
            data => {
                this.notificationsCount = 0;
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }
    ngOnInit() {
        this.listNotifications();
    }

}

import { Component, OnInit, Input } from '@angular/core';
import { TopnavbarComponent } from '../../../core/topnavbar/topnavbar.component';

@Component( {
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    providers: [TopnavbarComponent]
})
export class NotificationsComponent implements OnInit {

    constructor( public topnavbarComponent: TopnavbarComponent ) { }

    ngOnInit() {
        this.topnavbarComponent.listNotifications();
        this.topnavbarComponent.listCampaignEmailNotifications();
        this.topnavbarComponent.listCampaignVideoNotifications();
    }

}

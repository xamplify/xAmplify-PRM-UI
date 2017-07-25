import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../services/campaign.service';
import { Campaign } from '../models/campaign';

declare var $: any;
@Component( {
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css', './timeline.css']
})
export class AnalyticsComponent implements OnInit {
    isTimeLineView: boolean;
    campaign: Campaign;
    numbers: number[] = new Array(); 
    constructor( private campaignService: CampaignService, private route: ActivatedRoute ) {
        this.isTimeLineView = false;
        this.campaign = new Campaign();
        for ( let i = 0; i <= 100; i++ ) {
            this.numbers.push( i );
        }
    }
    showTimeline() {
        this.isTimeLineView = !this.isTimeLineView;
    }

    getCampaignById( campaignId: number ) {
        var obj = { 'campaignId': campaignId }
        this.campaignService.getCampaignById( obj )
            .subscribe(
            data => {
                this.campaign = data;
            },
            error => console.log( error ),
            () => console.log()
            )
    }

    ngOnInit() {
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
        let campaignId = this.route.snapshot.params['campaignId'];
        this.getCampaignById( campaignId );
    }

}

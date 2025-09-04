import { Component, OnInit, Input } from '@angular/core';

import { CampaignService } from '../services/campaign.service';
import { UtilService } from '../../core/services/util.service';

@Component( {
    selector: 'app-heat-map',
    templateUrl: './heat-map.component.html',
    styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent implements OnInit {
    @Input() sessionId: string;
    numbers: string[] = new Array();
    heatMapData: any;
    

    constructor( private campaignService: CampaignService, private utilService: UtilService ) { }
    getHeatMap() {
        this.heatMapData = "";
        this.numbers = [];

        this.campaignService.getHeatMapByUniqueSession(this.sessionId)
            .subscribe(
            data => {
                this.heatMapData = data;
                for ( let i = 0; i <= 100; i++ ) {
                    this.numbers.push( this.utilService.convertSecondsToHHMMSS( this.heatMapData.videoLength * i / 100 ) );
                }
            },
            error => console.log( error ),
            () => console.log()
            )
    }
    ngOnInit() {
        this.getHeatMap();
    }

}

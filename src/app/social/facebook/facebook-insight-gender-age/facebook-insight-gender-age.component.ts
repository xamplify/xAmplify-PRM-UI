import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacebookService } from '../../services/facebook.service';
import {FacebookFansGenderAge} from "../../models/facebook-fans-gender-age";
declare var Highcharts:any;
@Component( {
    selector: 'app-facebook-insight-gender-age',
    styles: [`chart {display: block; height: 70%; width: 60%;} `],
    template: `<div id="container1" style="min-width: 310px; max-width: 800px; height: 400px; margin: 0 auto"></div>`
})
export class FacebookInsightGenderAgeComponent implements OnInit {
    options: Object;
    @Input() facebookFansGenderAge: FacebookFansGenderAge;

    constructor( private route: ActivatedRoute, private facebookService: FacebookService ) { }
    
    ngAfterViewInit() {
        this.renderHighChart();
    }
    
    renderHighChart() {}
    ngOnInit() {
      //  this.renderHighChart();
    }

}

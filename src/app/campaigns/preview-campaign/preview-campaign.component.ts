import { Component, OnInit, OnDestroy, } from '@angular/core';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Campaign } from '../models/campaign';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
declare var swal, $, videojs, Metronic, Layout, Demo, TableManaged, Promise: any;
@Component({
  selector: 'app-preview-campaign',
  templateUrl: './preview-campaign.component.html',
  styleUrls: ['./preview-campaign.component.css'],
  providers:[CallActionSwitch]
})
export class PreviewCampaignComponent implements OnInit {

    campaign: Campaign = new Campaign();
    campaignType:string = "";
    
    constructor( public route: ActivatedRoute, public xtremandLogger: XtremandLogger, public userService: UserService,
        public referenceService: ReferenceService, public campaignService: CampaignService,public callActionSwitch: CallActionSwitch) {
    }

    ngOnInit() {
        this.getCampaignById();
    }

    getCampaignById() {
        var obj = { 'campaignId': this.route.snapshot.params['id'] }
        this.campaignService.getCampaignById( obj )
            .subscribe(
            data => {
                this.campaign = data;
                this.campaignType = this.campaign.campaignType.toLocaleString();
                if(this.campaignType.includes('VIDEO')){
                    this.campaignType=="VIDEO";
                }else if(this.campaignType.includes('REGULAR')){
                    this.campaignType=="REGULAR";
                }
                console.log(this.campaign);
            },
            error => { this.xtremandLogger.errorPage( error ) },
            () => console.log()
            )
    }

}

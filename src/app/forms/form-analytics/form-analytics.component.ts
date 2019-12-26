import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { Router } from '@angular/router';
declare var $: any, swal: any;
@Component( {
    selector: 'app-form-analytics',
    templateUrl: './form-analytics.component.html',
    styleUrls: ['./form-analytics.component.css'],
    providers: [Pagination]
} )
export class FormAnalyticsComponent implements OnInit {
    formId: any;
    partnerLandingPageAlias: any;
    loggedInUserId: number = 0;
    partnerId: number = 0;
    alias: string = "";
    campaignAlias: string = "";
    formName = "";
    pagination: Pagination = new Pagination();
    columns: Array<any> = new Array<any>();
    statusCode: number = 200;
    selectedSortedOption: any;
    searchKey = "";
    campaignForms = false;
    campaignPartnerAnalytics = false;
    routerLink = "/home/forms/manage";
    isPartnerNavigation = false;
    exportingObject: any = {};
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService, public router: Router
    ) { }

    ngOnInit() {
        this.alias = this.route.snapshot.params['alias'];
        this.campaignAlias = this.route.snapshot.params['campaignAlias'];
        this.partnerLandingPageAlias = this.route.snapshot.params['partnerLandingPageAlias'];
        this.partnerId = this.route.snapshot.params['partnerId'];
        this.formId = this.route.snapshot.params['formId'];
        this.exportingObject['formAlias'] = this.alias;
        this.exportingObject['campaignAlias'] = this.campaignAlias;
        this.exportingObject['partnerLandingPageAlias'] = this.partnerLandingPageAlias;
        this.exportingObject['formId'] = this.formId;
        this.exportingObject['isPublicEventLeads'] = false;
        this.exportingObject['partnerId'] = this.partnerId;
        if ( this.campaignAlias != undefined ) {
            this.campaignForms = true;
        }
        if(this.partnerId!=undefined){
            this.campaignPartnerAnalytics = true;
        }
        if ( this.router.url.includes( 'home/forms/partner' ) ) {
            this.isPartnerNavigation = true;
            this.routerLink = "/home/forms/partner/lf/" + this.partnerLandingPageAlias;
        }else if(this.campaignForms){
            if(this.campaignPartnerAnalytics){
                this.routerLink = "/home/forms/clpf/" + this.campaignAlias+"/"+this.partnerId;
            }else{
                this.routerLink = "/home/forms/clpf/" + this.campaignAlias;
            }
        }
        else {
            this.isPartnerNavigation = false;
            this.routerLink = "/home/forms/manage";
        }
    }



    goToCampaignAnalytics() { 
        this.router.navigate( ['home/campaigns/' + parseInt( this.campaignAlias ) + '/details'] );
        }

}

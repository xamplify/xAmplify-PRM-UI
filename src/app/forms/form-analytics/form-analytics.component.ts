import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { Router } from '@angular/router';
declare var $:any,swal:any ;
@Component({
  selector: 'app-form-analytics',
  templateUrl: './form-analytics.component.html',
  styleUrls: ['./form-analytics.component.css'],
  providers: [Pagination]
})
export class FormAnalyticsComponent implements OnInit {
    formId: any;
    partnerLandingPageAlias: any;
    loggedInUserId: number=0;
    alias:string="";
    campaignAlias:string = "";
    formName = "";
    pagination: Pagination = new Pagination();
    columns:Array<any> = new Array<any>();
    statusCode:number = 200;
    selectedSortedOption:any;
    searchKey = "";
    campaignForms = false;
    routerLink = "/home/forms/manage";
    exportingObject:any={};
    constructor( public referenceService: ReferenceService, private route: ActivatedRoute,
        public authenticationService: AuthenticationService,public router: Router
    ) {}

    ngOnInit() {
        this.alias = this.route.snapshot.params['alias'];
        this.campaignAlias = this.route.snapshot.params['campaignAlias'];
        this.partnerLandingPageAlias =this.route.snapshot.params['partnerLandingPageAlias'];
        this.formId =this.route.snapshot.params['formId'];
        if(this.campaignAlias!=undefined){
            this.pagination.campaignId = parseInt(this.campaignAlias);
            this.campaignForms = true;
            this.routerLink = "/home/forms/clpf/"+this.pagination.campaignId;
        }else if(this.partnerLandingPageAlias!=undefined){
            this.pagination.landingPageAlias = this.partnerLandingPageAlias;
            this.routerLink = "/home/forms/partner/lf/"+this.partnerLandingPageAlias;
            this.pagination.formId = this.formId;
            this.alias = "";
            this.pagination.partnerLandingPageForm = true;
        }
        this.exportingObject['formAlias'] = this.alias;
        this.exportingObject['campaignAlias'] = this.campaignAlias;
        this.exportingObject['partnerLandingPageAlias'] = this.partnerLandingPageAlias;
        this.exportingObject['formId'] = this.formId;
    }
    

    
    goToCampaignAnalytics(){
        this.router.navigate(['home/campaigns/'+parseInt(this.campaignAlias)+'/details']);
    }

}

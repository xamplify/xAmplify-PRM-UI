import { Component, OnInit, OnDestroy, ViewChild,Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { LandingPage } from '../models/landing-page';
import { UtilService } from '../../core/services/util.service';
import { SortOption } from '../../core/models/sort-option';
import { LandingPageService } from '../services/landing-page.service';
import { PreviewLandingPageComponent } from '../preview-landing-page/preview-landing-page.component';
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import {ModulesDisplayType } from 'app/util/models/modules-display-type';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';

declare var swal: any, $: any;
@Component({
    selector: 'app-manage-landing-page',
    templateUrl: './manage-landing-page.component.html',
    styleUrls: ['./manage-landing-page.component.css'],
    providers: [Pagination, HttpRequestLoader, ActionsDescription, SortOption],
})
export class ManageLandingPageComponent implements OnInit {

  viewType: string;
  categoryId: number;
  folderViewType: string;
	modulesDisplayType = new ModulesDisplayType();
  isPartnerLandingPage = false;
  mergeTagForGuide:any;
  constructor(public authenticationService:AuthenticationService,public xtremandLogger: XtremandLogger, 
    public referenceService: ReferenceService,private route: ActivatedRoute,private router:Router) {
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
		    this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
        if(this.viewType==undefined){
            this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ?'g':'';
        }
        this.isPartnerLandingPage = this.router.url.indexOf("/pages/partner")>-1; 
       this.getRoleByUserId();

	}
  /*** XNFR-512 ****/
  getRoleByUserId() {
    let roleName = "";
    this.authenticationService.getRoleByUserId().subscribe(
        (data) => {
            const role = data.data;
            roleName = role.role == 'Team Member' ? role.superiorRole : role.role;
            this.getuserGuideMergeTag(roleName);
        }, error => {
            this.xtremandLogger.errorPage(error);
        }
    )
}
  getuserGuideMergeTag(roleName: any) {
    const isMarketingCompany: boolean = roleName === 'Marketing' || roleName === 'Marketing & Partner';
    this.mergeTagForGuide = isMarketingCompany && !this.isPartnerLandingPage
      ? 'manage_pages_marketing'
      : this.isPartnerLandingPage
        ? 'accessing_shared_pages'
        : 'manage_pages';
  }
  /*** XNFR-512 ****/


  ngOnInit() {
    
  }



}


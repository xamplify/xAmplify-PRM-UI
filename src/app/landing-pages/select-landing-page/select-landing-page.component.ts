import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CustomResponse } from '../../common/models/custom-response';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
/*************Landing Page***************/
import { LandingPageService } from '../services/landing-page.service';
import { UtilService } from '../../core/services/util.service';

declare var swal, $: any;
@Component({
    selector: 'app-select-landing-page',
    templateUrl: './select-landing-page.component.html',
    styleUrls: ['./select-landing-page.component.css'],
    providers: [Pagination, HttpRequestLoader]
})
export class SelectLandingPageComponent implements OnInit, OnDestroy {
    ngxloading = false;
    pagination: Pagination = new Pagination();
    searchKey = "";
    selectedLandingPageTypeIndex = 0;
    loggedInAsSuperAdmin = false;
    constructor(public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public logger: XtremandLogger,
        private landingPageService: LandingPageService, public utilService: UtilService) {
        this.loggedInAsSuperAdmin = this.utilService.isLoggedInFromAdminPortal();
    }

    ngOnInit() {
        this.selectedLandingPageTypeIndex = 0;
        this.pagination.filterKey = "All";
        this.listLandingPages(this.pagination);
    }

    showAllLandingPages(type: string, index: number) {
        this.selectedLandingPageTypeIndex = index;
        this.pagination.filterKey = type;
        this.listLandingPages(this.pagination);
    }



    listLandingPages(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.landingPageService.listDefault(pagination).subscribe(
            (response: any) => {
                if (response.access) {
                    let data = response.data;
                    if (response.statusCode == 200) {
                        pagination.totalRecords = data.totalRecords;
                        pagination = this.pagerService.getPagedItems(pagination, data.landingPages);
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                } else {
                    this.authenticationService.forceToLogout();
                }

            },
            (error: any) => { this.logger.errorPage(error); });
    }
    eventHandler(keyCode: any) { if (keyCode === 13) { this.searchLandingPages(); } }

    searchLandingPages() {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.searchKey;
        this.listLandingPages(this.pagination);
    }

    showLandingPage(id: number) {
        this.landingPageService.id = id;
        this.router.navigate(["/home/pages/add"]);
    }
            

    goToCreatePage(id:number){
        this.landingPageService.id = id;
        this.router.navigate(["/home/pages/saveAsDefault"]);
    }


    ngOnDestroy() {
    }
}

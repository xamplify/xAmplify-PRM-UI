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
    mergeTagForGuide:any;
    roleName:string = "";
    constructor(public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public logger: XtremandLogger,
        private landingPageService: LandingPageService, public utilService: UtilService) {
        this.loggedInAsSuperAdmin = this.utilService.isLoggedInFromAdminPortal();
        this.pagination.userId = this.authenticationService.getUserId();
    }

    ngOnInit() {
        this.selectedLandingPageTypeIndex = 0;
        this.mergeTagForGuide = this.authenticationService.module.isMarketingCompany ? 'designing_pages_marketing' : 'designing_pages';
        this.pagination.filterKey = "All";
        this.listLandingPages(this.pagination);
        /*** XNFR-512 *****/
        this.getRoleByUserId();
        /**** XNFR-512 ****/

    }

    showAllLandingPages(type: string, index: number) {
        this.selectedLandingPageTypeIndex = index;
        this.pagination.pageIndex = 1;
        this.pagination.filterKey = type;
        this.listLandingPages(this.pagination);
    }

    navigateBetweenPageNumbers(event: any) {
        this.pagination.pageIndex = event.page;
        this.listLandingPages(this.pagination);
      }

    listLandingPages(pagination: Pagination) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.referenceService.goToTop();
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

    confirmDeleteLandingPage(template:any){
        let id = template['id'];
        if(id!=undefined && id>0){
            let name = template['name'];
            let self = this;
			swal({
				title: 'Are you sure?',
				text: "You won't be able to undo this action!",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete it!'

			}).then(function() {
				self.deleteDefaultPage(id, name);
			}, function(dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
        }
    }

    deleteDefaultPage(id:number,name:string){
        this.referenceService.goToTop();
        this.ngxloading = true;
        this.referenceService.loading(this.httpRequestLoader, true);
        this.landingPageService.deleteDefaultPage(id).subscribe(
            response=>{
                this.ngxloading = false;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.referenceService.showSweetAlertSuccessMessage(name+" deleted successfully");
                this.pagination.pageIndex = 1;
                this.listLandingPages(this.pagination);
            },error=>{
                this.ngxloading = false;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.referenceService.showSweetAlertServerErrorMessage();
            }
        );
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
                this.logger.errorPage(error);
            }
        )
    }
    getuserGuideMergeTag(roleName:any) {
        const isMarketingCompany = roleName === 'Marketing' || roleName === 'Marketing & Partner';
        this.mergeTagForGuide = isMarketingCompany ? 'designing_pages_marketing' : 'designing_pages';
    }
    /*** XNFR-512 ****/
    ngOnDestroy() {
    }
}

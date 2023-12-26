import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';

import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardService } from '../dashboard.service';
@Component({
    selector: 'app-default-page',
    templateUrl: './default-page.component.html',
    styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent implements OnInit {

    /* --XNFR-415--*/
    defaultPage: string;
    modulesDashboardTypeError=false;
	getAssignedDashboardTypeForPartner:any;
	public assignedDashboardType:any;
    vendorCompanyIdForPartnerVanity:any;
    loggedThroughVendorVanityUrl:any = true;

    constructor(private router: Router, private userService: UserService, private authenticationService: AuthenticationService,
        private referenceService: ReferenceService, private vanityurlService : VanityURLService,private dashBoardService: DashboardService) { }

    getDefaultPage(userId: number) {
      if(this.referenceService.userDefaultPage==='WELCOME'|| this.referenceService.userDefaultPage==='DASHBOARD'){
        this.checkDefaultPage(this.referenceService.userDefaultPage);
      }else {
      this.userService.getUserDefaultPage(userId)
            .subscribe(
            data => this.defaultPage = data.replace(/['"]+/g, ''),
            error => {this.goToWelcomePage();
                    this.referenceService.userDefaultPage = "WELCOME";
            },
            () => {
                console.log(this.defaultPage);
                this.checkDefaultPage(this.defaultPage);
            }
            );
       }
    }
   checkDefaultPage(defaultPage:string){
    if(!this.authenticationService.isOnlyUser()){
      if (defaultPage === 'welcome' || defaultPage==='WELCOME') {
        this.goToWelcomePage();
    } else { 
        this.goToDashBoard();  }
     }else{
         this.router.navigate(['/home/dashboard']);
     }
   }

    goToWelcomePage(){
        if(this.authenticationService.isSuperAdmin()){
            this.router.navigate(['/home/dashboard/admin-report']);
        }
        else if(this.authenticationService.user.hasCompany){
            this.router.navigate(['/home/dashboard/welcome']);
        }
        else if(this.authenticationService.isOnlyUser()){
            this.router.navigate(['/home/dashboard/welcome']);
        }else{
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }

    goToDashBoard(){
        if(this.authenticationService.isSuperAdmin()){
            this.router.navigate(['/home/dashboard/admin-report']);
        }
        else if(this.authenticationService.user.hasCompany){
            this.router.navigate(['/home/dashboard']);
        }
        else if(this.authenticationService.isOnlyUser()){
            this.router.navigate(['/home/dashboard/dashboard']);
        }else{
            this.router.navigate(['/home/dashboard/add-company-profile']);
        }
    }

    isGridView(userId: number) {
        this.userService.isGridView(userId)
            .subscribe(
            data => {this.referenceService.isGridView = data;},
            error => console.log(error),
            () => { }
            );
    }
    ngOnInit() {
        this.loadDashboard();

    }
    /* -- XNFR-415 -- */
    loadDashboard(){
        if(this.authenticationService.vanityURLEnabled){
            if( this.loggedThroughVendorVanityUrl   && (this.authenticationService.isPartner() || this.authenticationService.isOnlyPartner()  || this.authenticationService.isTeamMember())){
                this.loggedThroughVendorVanityUrl=this.authenticationService.module.loggedInThroughVendorVanityUrl;
                this.vanityurlService.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {        
                    this.vendorCompanyIdForPartnerVanity = result.companyId;     
                    this.getDefaultDashboardForPartner();
                }, error => {
                    console.log(error);
                });
            }
        }
        const userId = this.authenticationService.user.id;
        this.getDefaultPage(userId);
        if(!this.referenceService.isMobileScreenSize()){
        this.isGridView(userId); }
        else { this.referenceService.isGridView = true; }
    }

    /* -- XNFR-415 -- */
    getDefaultDashboardForPartner() {  
        if(this.authenticationService.module.loggedInThroughVendorVanityUrl || (this.authenticationService.isPartner() || this.authenticationService.isOnlyPartner())){
            this.modulesDashboardTypeError = false;
            this.dashBoardService.getDefaultDashboardForPartner(this.vendorCompanyIdForPartnerVanity)
                .subscribe(
                data => {
                    if (data.statusCode == 200) {
                    this.getAssignedDashboardTypeForPartner = data.data;
                    this.assignedDashboardType=this.getAssignedDashboardTypeForPartner;
                        if(this.getAssignedDashboardTypeForPartner === 'WELCOME'){
                            this.goToWelcomePage();
                        }
                        else if(this.getAssignedDashboardTypeForPartner === 'ASSIGNED_DASHBOARD'){
                            this.goToDashBoard();
                        }
                        else{
                            this.goToWelcomePage();
                        }
                    } else {
                    this.modulesDashboardTypeError = true;
                    }
                },
                error => {
                    this.modulesDashboardTypeError = true;
                },
                () => { }
            );
        }
    }
}

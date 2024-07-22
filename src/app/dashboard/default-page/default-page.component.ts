import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { UserService } from '../../core/services/user.service';

import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { DashboardService } from '../dashboard.service';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
declare var swal:any ,$:any;
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
    vanityLoginDto: VanityLoginDto = new VanityLoginDto();
    vendorCompanyIdForPartnerVanity:any;
    loggedThroughVendorVanityUrl:any = true;
    loggedInUserId: number;
    isPaymentOverDue = false;
    constructor(private router: Router, private userService: UserService, private authenticationService: AuthenticationService,
        private referenceService: ReferenceService, private vanityurlService : VanityURLService,private dashBoardService: DashboardService) {
            this.loggedInUserId = this.authenticationService.getUserId();
         }
    
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
        if (!this.referenceService.isMobileScreenSize()) {
            this.isGridView(this.loggedInUserId);
        }
        else { 
            this.referenceService.isGridView = true; 
        }
        this.loadDashboard();

    }
    /* -- XNFR-415 -- */
    loadDashboard(){   
        if (this.authenticationService.vanityURLEnabled) {
            this.CheckIsPaymentOverDue();
        } else {
            this.getDefaultPage(this.loggedInUserId);
        }
    }

    /* -- XNFR-415 -- */
    getDefaultDashboardForPartner() {
        this.vanityLoginDto.vendorCompanyProfileName = this.authenticationService.companyProfileName;
        this.vanityLoginDto.userId = this.loggedInUserId;
        this.vanityLoginDto.vanityUrlFilter = true;
        this.modulesDashboardTypeError = false;
        this.dashBoardService.getDefaultDashboardPageForPartner(this.vanityLoginDto)
            .subscribe(
                data => {
                    if (data.statusCode == 200 && data.data !== undefined) {
                        this.getAssignedDashboardTypeForPartner = data.data;
                        if (this.getAssignedDashboardTypeForPartner === 'WELCOME' || this.getAssignedDashboardTypeForPartner === 'welcome') {
                            this.goToWelcomePage();
                        }
                        else if (this.getAssignedDashboardTypeForPartner === 'ASSIGNED_DASHBOARD' || this.getAssignedDashboardTypeForPartner === 'DASHBOARD'
                            || this.getAssignedDashboardTypeForPartner === 'dashboard') {
                            this.goToDashBoard();
                        }
                        else {
                            this.getDefaultPage(this.loggedInUserId);
                        }
                    } else {
                        this.getDefaultPage(this.loggedInUserId);
                    }
                },
                error => {
                    this.modulesDashboardTypeError = true;
                },
                () => { }
            );
    }

    /*****XNFR-595****/
    CheckIsPaymentOverDue() {
        this.dashBoardService.isPaymentOverDue(this.authenticationService.companyProfileName).subscribe(
            response => {
                this.isPaymentOverDue = response.data;
                if (this.isPaymentOverDue && this.authenticationService.module.isPaymentOverDueModalPopUpDisplayed) {
                    let buttons = "Please settle your account as soon as possible to avoid any interruptions in service. Please reach out to our customer success team or contact support at <a href='mailto:support@xamplify.com'>support@xamplify.com</a>.";
                    swal({
                        title: "Your payment is overdue!!!",
                        type: "warning",
                        text: buttons,
                        allowOutsideClick: false,
                        confirmButtonText: "OK",
                        allowEscapeKey: false
                    });
                }
                this.authenticationService.module.isPaymentOverDueModalPopUpDisplayed = false;
                if (this.authenticationService.vanityURLEnabled) {
                    this.getDefaultDashboardForPartner();
                } else {
                    this.getDefaultPage(this.loggedInUserId);
                }
            }, error => {
                this.authenticationService.module.isPaymentOverDueModalPopUpDisplayed = false;
                if (this.authenticationService.vanityURLEnabled) {
                    this.getDefaultDashboardForPartner();
                } else {
                    this.getDefaultPage(this.loggedInUserId);
                }
            }
        )
    }

}

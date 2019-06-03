import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "../../core/services/authentication.service";
import { ReferenceService } from "../../core/services/reference.service";
import { Pagination } from "../../core/models/pagination";
import { DashboardService } from "../dashboard.service";
import { PagerService } from "../../core/services/pager.service";
import { PaginationComponent } from "../../common/pagination/pagination.component";
import { Router } from "@angular/router";
import { VendorInvitation } from '../models/vendor-invitation';
import { RegularExpressions } from '../../common/models/regular-expressions';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomResponse } from '../../common/models/custom-response';
declare var $, CKEDITOR: any;

@Component({
  selector: "app-vendor-reports",
  templateUrl: "./vendor-reports.component.html",
  styleUrls: ["./vendor-reports.component.css"],
  providers: [Pagination, PaginationComponent, VendorInvitation, RegularExpressions]
})
export class VendorReportsComponent implements OnInit {
  vendorDetails: any;
  loading = false;
  newEmailIds: string[] = [];
  emailIds = [];
  vendoorInvitation: VendorInvitation = new VendorInvitation();
  isValidVendorInvitation = false;
  isError = false;
  customResponse: CustomResponse = new CustomResponse();

  constructor(
    public referenseService: ReferenceService,
    public pagination: Pagination,
    public dashboardService: DashboardService,
    public authenticationService: AuthenticationService,
    public pagerService: PagerService,
    public paginationComponent: PaginationComponent,
    private router: Router,
    public regularExpressions: RegularExpressions
  ) {
      CKEDITOR.config.height = '250px';
      CKEDITOR.config.baseFloatZIndex = 1E5;
  }

  vendorReports() {
    this.loading = true;
    this.dashboardService
      .loadVendorDetails(
        this.authenticationService.getUserId(),
        this.pagination
      )
      .subscribe(
        data => {
          this.vendorDetails = data.data;
          this.pagination.totalRecords = data.totalRecords;
          this.pagination = this.pagerService.getPagedItems(
            this.pagination,
            this.vendorDetails
          );
          this.loading = false;
        },
        error => console.log(error),
        () => {
          console.log("vendor reports completed");
          this.loading = false;
        }
      );
  }

  setPage(event: any) {
    this.pagination.pageIndex = event.page;
    this.vendorReports();
  }

  onChangeAllVendors(event: Pagination) {
    this.pagination = event;
    this.vendorReports();
  }

  navigateToVendorCampaigns(venderReport: any) {
    this.loading = true;
    this.referenseService.vendorDetails = venderReport;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.router.navigateByUrl("/home/campaigns/vendor/all");
  }
  errorHandler(event){
   event.target.src = 'assets/images/default-company.png';
  }
  
  openRequestAsVendorModal(){
      this.vendoorInvitation.subject = "xAmplify - A great new marketing automation platform Referal"
      this.vendoorInvitation.message = "As one of your channel partners, I wanted to tell you about this great new marketing automation platform that has made redistributing campaigns so much more efficient and effective for me. It’s called xAmplify and I really think you should check it out."

          + "<br><br>" + "You see, once a vendor uses xAmplify to share an email, video, or social media campaign with me, I can log in and redistribute it in just a few clicks. I then get access to end-user metrics on every email and video campaign (opens, clicks, views, watch times) to easily prioritize who to follow up with. Plus, there are other useful features like automatic co-branding and deal registration all built into a single platform."

          + "<br><br>" + "It’d be great if I could redistribute your content via xAmplify. Like I said, it’s made a real impact on my other co-marketing efforts and it would be awesome for our partnership to experience the same success."

          + "<br><br>" + "Visit " + "<a href='www.xamplify.com'>" + "www.xamplify.com" + "</a>" + " to learn more, or feel free to ask me questions about how it works on my end."
      $( '#request-for-vendor' ).modal( 'show' );
     
  }
  
  validateVendoorInvitation(){
      if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.emailIds){
          this.isValidVendorInvitation = true;
      }else{
          this.isValidVendorInvitation = false;
      }
  }
  
  
  public validators = [ this.must_be_email ];
  public errorMessages = {
      'must_be_email': 'Enter valid email adress!'
  };
  private must_be_email(control: FormControl) {        
      var EMAIL_REGEXP = /^(([a-zA-Z0-9.!#$&'*+\/=?_`{|}~-]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (control.value != "" && (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))) {
          return { "must_be_email": true };
      }
      return null;
  }
  
  sendRequestForVendorEmail(){
      this.loading = true;
      this.isError = false;
      
      const tags = this.emailIds;
      for (let i = 0; i < tags.length; i++) {
              this.newEmailIds[i] = tags[i]['value'];
      }
      this.vendoorInvitation.emailIds = this.newEmailIds;
   
     if(this.vendoorInvitation.message.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.subject.replace( /\s\s+/g, '' ).replace(/\s+$/,"").replace(/\s+/g," ") && this.vendoorInvitation.emailIds.length != 0 ){
      this.dashboardService.sendVendorInvitation(this.authenticationService.getUserId(), this.vendoorInvitation)
        .subscribe(
          data => {
              data = data;
              console.log("success");
            
              if(data.statusCode === 200){
                this.customResponse = new CustomResponse( 'SUCCESS', "Request has been sent successfully.", true );
              }else{
                  this.customResponse = new CustomResponse( 'INFO', "Mail sending failed! something went wrong please try after some time.", true );
              }
            
            this.loading = false;
            this.closeInvitationModal();
          },
          error => {console.log(error)
            this.loading = false;
            this.closeInvitationModal();
          },
          () => {
            console.log("Mail Sending failed");
            this.loading = false;
            this.closeInvitationModal();
          }
        );
      }else{
          this.isError = true;
      }
  }
  
  closeInvitationModal() {
      $( '#request-for-vendor' ).modal( 'toggle' );
      $( "#request-for-vendor .close" ).click()
      $( '#request-for-vendor' ).modal( 'hide' );
      $( 'body' ).removeClass( 'modal-open' );
      $( '.modal-backdrop fade in' ).remove();
      $( ".modal-backdrop in" ).css( "display", "none" );
      this.vendoorInvitation.emailIds = [];
      this.emailIds = [];
  }
  
  ngOnInit() {
    this.vendorReports();
  }
}

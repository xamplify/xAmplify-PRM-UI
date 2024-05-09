import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PreviewPopupComponent } from 'app/forms/preview-popup/preview-popup.component';
import { LandingPage } from 'app/landing-pages/models/landing-page';
import { LandingPageService } from 'app/landing-pages/services/landing-page.service';
declare var swal, $, videojs: any, Papa: any;

@Component({
  selector: 'app-vendor-journey',
  templateUrl: './vendor-journey.component.html',
  styleUrls: ['./vendor-journey.component.css']
})
export class VendorJourneyComponent implements OnInit {
	editVendorPage:boolean =false;
	vendorDefaultTemplate:LandingPage = new LandingPage();
	openLinksInNewTabCheckBoxId = "openLinksInNewTab-page-links";
  @ViewChild('previewPopUpComponent') previewPopUpComponent: PreviewPopupComponent;
  mergeTagsInput: any = {};
  vendorLogoDetails:any[]=[];
  @Input()loggedInUserCompanyId = 0;
	vendorJourney:boolean = false;
	isLandingPages:boolean = false;
  isMasterLandingPages:boolean = false;
  @Input() moduleType: string = "";
  @Output() goBackToMyProfile: EventEmitter<any> = new EventEmitter();
  @Output() vendorJourneyEditOrViewAnalytics: EventEmitter<any> = new EventEmitter();
  selectedLandingPageId:any;
  isViewAnalytics:boolean = false;
  
  constructor(public landingPageService: LandingPageService, public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.resetVendorJourney();
    this.vendorJourney = this.moduleType == "Vendor Journey";
    this.isLandingPages = this.moduleType == "Landing Pages";
    this.isMasterLandingPages = this.moduleType == "Master Landing Pages";
    if(this.isMasterLandingPages){
      this.getVendorLogoDetailsByPartnerDetails();
    }
  }

  editVendorLandingPage(event){
    this.vendorDefaultTemplate = event;
    this.landingPageService.vendorJourney = this.vendorJourney;
    this.landingPageService.isMasterLandingPages = this.isMasterLandingPages;
    this.landingPageService.id = this.vendorDefaultTemplate.id;
    this.mergeTagsInput['page'] = true;
    this.editVendorPage = true;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }
  resetVendorJourney(){
    this.editVendorPage = false;
    this.vendorDefaultTemplate = new LandingPage() ;
    this.landingPageService.vendorJourney = false;
    this.landingPageService.id = 0;
    this.mergeTagsInput['page'] = false;
    this.vendorJourney = false;
    this.isLandingPages = false;
    this.isViewAnalytics = false;
    this.isMasterLandingPages = false;
  }
  
  checkOrUncheckOpenLinksInNewTabOption(){
    let isChecked = $('#'+this.openLinksInNewTabCheckBoxId).is(':checked');
    if(isChecked){
      $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", false);
      this.vendorDefaultTemplate.openLinksInNewTab = false;
    }else{
      $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", true);
      this.vendorDefaultTemplate.openLinksInNewTab = true;
    }
  }

  viewAnalytics(event){
    this.selectedLandingPageId = event;
    this.isViewAnalytics = true;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  goBack(){
    this.isViewAnalytics = false;
    this.editVendorPage = false;
    this.goBackToMyProfile.emit();
  }

  getVendorLogoDetailsByPartnerDetails() {
    let userId = this.authenticationService.getUserId();
    this.landingPageService.getVendorLogoDetailsByPartnerDetails(userId, this.loggedInUserCompanyId).subscribe(
    (data: any) => {
             if(data.statusCode==200){
              this.vendorLogoDetails = data.data;
            }
    }, (error: any) => {
      console.log(error);
    }
);
}
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PreviewPopupComponent } from 'app/forms/preview-popup/preview-popup.component';
import { FormService } from 'app/forms/services/form.service';
import { LandingPage } from 'app/landing-pages/models/landing-page';
import { VendorLogoDetails } from 'app/landing-pages/models/vendor-logo-details';
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
  vendorLogoDetails:VendorLogoDetails[]=[];
  sharedVendorLogoDetails:VendorLogoDetails[]=[];
  @Input()loggedInUserCompanyId = 0;
	vendorJourney:boolean = false;
	isLandingPages:boolean = false;
  isMasterLandingPages:boolean = false;
  @Input() moduleType: string = "";
  @Output() goBackToMyProfile: EventEmitter<any> = new EventEmitter();
  @Output() vendorJourneyEditOrViewAnalytics: EventEmitter<any> = new EventEmitter();
  selectedLandingPageId:any;
  isViewAnalytics:boolean = false;
  openInNewTabChecked: boolean = false;
  isFormAnalytics:boolean = false;
  isEditVendorOrMasterForm:boolean = false;
  selectedFrom:any;
  constructor(public landingPageService: LandingPageService, public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.resetVendorJourney();
    this.vendorJourney = this.moduleType == "Vendor Journey";
    this.isLandingPages = this.moduleType == "Landing Pages";
    this.isMasterLandingPages = this.moduleType == "Master Landing Pages";
  }

  editVendorLandingPage(event){
    this.vendorDefaultTemplate = event;
    this.landingPageService.vendorJourney = this.vendorJourney;
    this.landingPageService.isMasterLandingPages = this.isMasterLandingPages;
    this.landingPageService.id = this.vendorDefaultTemplate.id;
    this.mergeTagsInput['page'] = true;
    this.editVendorPage = true;
    this.getVendorLogoDetailsByPartnerDetails();
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
    this.vendorJourney = this.moduleType == "Vendor Journey";
    this.isLandingPages = this.moduleType == "Landing Pages";
    this.isMasterLandingPages = this.moduleType == "Master Landing Pages";
    this.isFormAnalytics = false;
    this.isEditVendorOrMasterForm = false;

    this.goBack();
  }
  
  checkOrUncheckOpenLinksInNewTabOption(){
    let isChecked = $('#'+this.openLinksInNewTabCheckBoxId).is(':checked');
    if(isChecked){
      $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", false);
      this.vendorDefaultTemplate.openLinksInNewTab = false;
      this.openInNewTabChecked = false
    }else{
      $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", true);
      this.vendorDefaultTemplate.openLinksInNewTab = true;
      this.openInNewTabChecked = true;
    }
  }

  viewAnalytics(event){
    this.selectedLandingPageId = event;
    this.isViewAnalytics = true;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  viewLandingPageForms(event){
    this.selectedLandingPageId = event;
    this.isFormAnalytics = true;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  editForm(event){
    this.selectedFrom = event;
    this.isEditVendorOrMasterForm = true;
    this.isFormAnalytics = false;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  goBack(){
    this.isViewAnalytics = false;
    this.editVendorPage = false;
    this.isFormAnalytics = false;
    this.isEditVendorOrMasterForm = false;
    this.goBackToMyProfile.emit();
  }

  goToManageForms(){
    this.isFormAnalytics = true;
    this.isEditVendorOrMasterForm = false;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }
  getVendorLogoDetailsByPartnerDetails() {
    let userId = this.authenticationService.getUserId();
    let landingPageId = this.landingPageService.id;
    this.landingPageService.getVendorLogoDetailsByPartnerDetails(userId, this.loggedInUserCompanyId, landingPageId).subscribe(
    (data: any) => {
             if(data.statusCode==200){
              var logoDetails:VendorLogoDetails[] = data.data;
              this.vendorLogoDetails = logoDetails;
              this.populateSharedVendorDetails(logoDetails);
            }
    }, (error: any) => {
      console.log(error);
    }
);
}

populateSharedVendorDetails(data:VendorLogoDetails[]){
  var companyIds:any[]=[];
  var details:any;
  this.sharedVendorLogoDetails = [];
  for(let logo of data){
    if(companyIds.length == 0 || !companyIds.some(id=>id == logo.companyId)){
      companyIds.push(logo.companyId)
      if(details != null ){
        this.sharedVendorLogoDetails.push(details);
      }
      details=[];
      details.companyId = logo.companyId;
      details.companyLogo = logo.companyLogo;
      details.companyName = logo.companyName;
      details.expand = false;
      details.teamMembers =[];  
    }
    details.teamMembers.push({'selected' :logo.selected,
    'partnerId' : logo.partnerId,
    'firstName' : logo.firstName,
    'lastName' : logo.lastName,
    'emailId' : logo.emailId});
  }
  if(details != null ){
    this.sharedVendorLogoDetails.push(details);
  }
}
landingPageOpenInNewTabChecked(){
  $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", this.openInNewTabChecked);
}
}

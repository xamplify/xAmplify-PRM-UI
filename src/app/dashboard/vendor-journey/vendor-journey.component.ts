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
  selectedVendorPageAlias:any;
  isViewAnalytics:boolean = false;
  openInNewTabChecked: boolean = false;
  isManageForms:boolean = false;
  isFormAnalytics:boolean = false;
  isEditVendorOrMasterForm:boolean = false;
  selectedFrom:any;
  importedObject:any={};
  categoryDropDownOptions=[];
  welcomePages:boolean = false;
  /**XNFR-712****/
  isPartnerJourneyPages:boolean = false;
  isVendorPartnerJourneyPages:boolean = false;
  isVendorMarketplacePages:boolean = false;

  constructor(public landingPageService: LandingPageService, public authenticationService:AuthenticationService) { }

  ngOnInit() {
    this.resetVendorJourney();
    this.vendorJourney = this.moduleType == "Vendor Showcase";
    this.isLandingPages = this.moduleType == "Vendor Shared Pages";
    this.isMasterLandingPages = this.moduleType == "Partner Landscape";
    this.welcomePages = this.moduleType == "Welcome Pages";
    this.isPartnerJourneyPages = this.moduleType == "Partner Showcase";
    this.isVendorPartnerJourneyPages = this.moduleType == "Partner Shared Pages";
    this.isVendorMarketplacePages = this.moduleType == "Vendor Landscape";
  }

  editVendorLandingPage(event){
    this.vendorDefaultTemplate = event;
    this.landingPageService.vendorJourney = this.vendorJourney;
    this.landingPageService.isMasterLandingPages = this.isMasterLandingPages;
    this.landingPageService.welcomePages = this.welcomePages;
    this.landingPageService.isPartnerJourneyPages = this.isPartnerJourneyPages;
    this.landingPageService.isVendorMarketplacePages = this.isVendorMarketplacePages;
    this.landingPageService.id = this.vendorDefaultTemplate.id;
    this.mergeTagsInput['page'] = true;
    this.editVendorPage = true;
    if(this.isMasterLandingPages){
      this.getVendorLogoDetailsByPartnerDetails();
    }else if(this.isVendorMarketplacePages){
      this.getPartnerDetailsByVendorCompany();
    }
    this.vendorJourneyEditOrViewAnalytics.emit();
  }
  resetVendorJourney(){
    this.editVendorPage = false;
    this.vendorDefaultTemplate = new LandingPage() ;
    this.landingPageService.vendorJourney = false;
    this.landingPageService.isPartnerJourneyPages = false;
    this.landingPageService.id = 0;
    this.mergeTagsInput['page'] = false;
    this.vendorJourney = false;
    this.isLandingPages = false;
    this.isViewAnalytics = false;
    this.isMasterLandingPages = false;
    this.welcomePages = false;
    this.isVendorPartnerJourneyPages =false;
    this.vendorJourney = this.moduleType == "Vendor Journey for Partners";
    this.isLandingPages = this.moduleType == "Vendor Shared Pages";
    this.isMasterLandingPages = this.moduleType == "Partner Landscape";
    this.welcomePages = this.moduleType == "Welcome Pages";
    this.isPartnerJourneyPages = this.moduleType == "Partner Journey for Vendors"
    this.isVendorPartnerJourneyPages = this.moduleType == "Partner Shared Pages";
    this.isVendorMarketplacePages = this.moduleType == "Vendor Landscape";
    this.isFormAnalytics = false;
    this.isManageForms = false;
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

  viewVendorPageAnalytics(event){
    this.selectedVendorPageAlias = event;
    this.isViewAnalytics = true;
    this.vendorJourneyEditOrViewAnalytics.emit();

  }
  viewLandingPageForms(event){
    this.selectedLandingPageId = event;
    this.isManageForms = true;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  editForm(event){
    this.selectedFrom = event;
    this.isEditVendorOrMasterForm = true;
    this.isFormAnalytics = false;
    this.isManageForms = false;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  goBack(){
    this.isViewAnalytics = false;
    this.editVendorPage = false;
    this.isFormAnalytics = false;
    this.isManageForms = false;
    this.isEditVendorOrMasterForm = false;
    this.goBackToMyProfile.emit();
  }

  goToManageForms(){
    this.isManageForms = true;
    this.isEditVendorOrMasterForm = false;
    this.vendorJourneyEditOrViewAnalytics.emit();
  }

  getVendorLogoDetailsByPartnerDetails() {
    let userId = this.authenticationService.getUserId();
    let landingPageId = this.landingPageService.id;
    let self = this;
    self.landingPageService.getVendorLogoDetailsByPartnerDetails(userId, this.loggedInUserCompanyId, landingPageId).subscribe(
    (data: any) => {
             if(data.statusCode==200){
              var logoDetails:VendorLogoDetails[] = data.data;
              self.vendorLogoDetails = logoDetails;
              let categoryDetails = data.map.categoryDetails
              if(categoryDetails != null ){
                self.categoryDropDownOptions = [];
                for(let category of categoryDetails){
                  self.categoryDropDownOptions.push({"id":category.marketPlaceCategoryId, "itemName":category.categoryName })
                }
              }
              this.populateSharedVendorDetails(logoDetails, self.categoryDropDownOptions);
              this.populateVendorDetailsForTeamMember(logoDetails, self.categoryDropDownOptions);
            }
    }, (error: any) => {
      console.log(error);
    }
);
}

  populateSharedVendorDetails(data: VendorLogoDetails[], categoryDropDownOptions) {
    var companyIds: any[] = [];
    var details: any;
    this.sharedVendorLogoDetails = [];
    
    if (data != undefined && data != null) {
      for (let logo of data) {
        var dropdownSettings = {
          text: "Please select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          classes: "myclass custom-class",
          disabled: !logo.selected,
        };
        if (companyIds.length == 0 || !companyIds.some(id => id == logo.companyId)) {
          companyIds.push(logo.companyId)
          if (details != null) {
            this.sharedVendorLogoDetails.push(details);
          }
          details = [];
          details.companyId = logo.companyId;
          details.companyLogo = logo.companyLogo;
          details.companyName = logo.companyName;
          details.expand = false;
          details.teamMembers = [];
          details.vendorJourneyId = logo.vendorJourneyId
          details.partnerJourneyPageId = logo.partnerJourneyPageId
          
        }
        let memberDetails = {
          'selected': logo.selected,
          'partnerId': logo.partnerId,
          'firstName': logo.firstName,
          'lastName': logo.lastName,
          'emailId': logo.emailId,
          'vendorJourneyId': logo.vendorJourneyId,
          'categoryIds': logo.categoryIds,
          'partnerJourneyPageId':logo.partnerJourneyPageId,
          'dropdownSettings': { ...dropdownSettings }
        }
        if (logo.categoryIds != null && logo.categoryIds.length > 0) {
          memberDetails['selectedCategories'] =[];
          for (let item of logo.categoryIds) {
            memberDetails['selectedCategories'].push({ 'id': item, 'itemName': categoryDropDownOptions.find(option => option.id == item).itemName })
          }
        }
        details.teamMembers.push(memberDetails);
      }
    }
    if (details != undefined && details != null) {
      this.sharedVendorLogoDetails.push(details);
    }
  }

  populateVendorDetailsForTeamMember(data: VendorLogoDetails[], categoryDropDownOptions){
    if ( (!this.authenticationService.module.isAnyAdminOrSupervisor || this.isVendorMarketplacePages) &&data != undefined && data != null) {
      for (let logo of data) {
        var dropdownSettings = {
          text: "Please select",
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          enableSearchFilter: true,
          classes: "myclass custom-class",
          disabled: !logo.selected,
        };
        logo.dropdownSettings=  { ...dropdownSettings };
        if (logo.categoryIds != null && logo.categoryIds.length > 0) {
          logo.selectedCategories = [];
          for (let item of logo.categoryIds) {
            logo.selectedCategories.push({ 'id': item, 'itemName': categoryDropDownOptions.find(option => option.id == item).itemName })
          }
        }
      }
    }
  }
landingPageOpenInNewTabChecked(){
  $('#' + this.openLinksInNewTabCheckBoxId).prop("checked", this.openInNewTabChecked);
}

  goToFormAnalytics(event) {
    let data = event;
    this.importedObject['formAlias'] = data.formAlias;
    this.importedObject['partnerLandingPageId'] = data.partnerLandingPageId;
    this.importedObject['selectedLandingPageId'] = this.selectedLandingPageId;
    this.isManageForms = false;
    this.isFormAnalytics = true;
  }

  getPartnerDetailsByVendorCompany() {
    let userId = this.authenticationService.getUserId();
    let landingPageId = this.landingPageService.id;
    let self = this;
    self.landingPageService.getPartnerDetailsByVendorCompany(this.loggedInUserCompanyId, landingPageId).subscribe(
    (data: any) => {
             if(data.statusCode==200){
              var logoDetails:VendorLogoDetails[] = data.data;
              self.vendorLogoDetails = logoDetails;
              let categoryDetails = data.map.categoryDetails
              if(categoryDetails != null ){
                self.categoryDropDownOptions = [];
                for(let category of categoryDetails){
                  self.categoryDropDownOptions.push({"id":category.marketPlaceCategoryId, "itemName":category.categoryName })
                }
              }
              this.populateSharedVendorDetails(logoDetails, self.categoryDropDownOptions);
              this.populateVendorDetailsForTeamMember(logoDetails, self.categoryDropDownOptions);
            }
    }, (error: any) => {
      console.log(error);
    }
);
}
}

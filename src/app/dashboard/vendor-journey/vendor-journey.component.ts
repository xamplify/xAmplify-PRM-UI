import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input()loggedInUserCompanyId = 0;
	vendorJourney:boolean = false;
	isLandingPages:boolean = false;
  @Input() moduleType: string = "";
  @Output() goBackToMyProfile: EventEmitter<any> = new EventEmitter();
  @Output() vendorJourneyEditOrViewAnalytics: EventEmitter<any> = new EventEmitter();
  selectedLandingPageId:any;
  isViewAnalytics:boolean = false;
  
  constructor(public landingPageService: LandingPageService) { }

  ngOnInit() {
    this.resetVendorJourney();
    this.vendorJourney = this.moduleType == "Vendor Journey";
    this.isLandingPages = this.moduleType == "Landing Pages"
  }

  editVendorLandingPage(event){
    this.vendorDefaultTemplate = event;
    this.landingPageService.vendorJourney = true;
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
}

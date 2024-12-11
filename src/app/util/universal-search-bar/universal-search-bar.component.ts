import { Location } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $: any;
@Component({
  selector: 'app-universal-search-bar',
  templateUrl: './universal-search-bar.component.html',
  styleUrls: ['./universal-search-bar.component.css']
})
export class UniversalSearchBarComponent implements OnInit {
  searchKey: string = "";
  isShowDropdown: boolean = false;
  selectedOption: string | null = "";
  isDropdownVisible: boolean = false;
  currentUser: any;
  isWelcomePageEnabled: boolean = false;
  isWelcomePageUrl: boolean;
  dropdownOptions: { label: string; condition: boolean; index: number }[] = [];
  constructor(private refService: ReferenceService, public authenticationService: AuthenticationService, public router: Router, public location: Location, private renderer: Renderer2) {
    this.currentUser = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.currentUser);
    this.isWelcomePageEnabled = this.currentUser[XAMPLIFY_CONSTANTS.welcomePageEnabledKey];
    this.isWelcomePageUrl = this.router.url.includes('/welcome-page');
    if (this.isWelcomePageEnabled) {
      this.refService.universalSearchKey = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.universalSearchKey);
      this.refService.universalSearchFilterType = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.universalSearchFilterBy);
    }
    let isStyleLoaded = false;
    if (!isStyleLoaded) {
      $("#xamplify-index-head").append("<link rel='stylesheet' href='/assets/js/indexjscss/universal-search-bar.css' type='text/css'>");
      isStyleLoaded = true;
    }
  }

  ngOnInit() {
    this.loadCssFile();
    this.searchKey = this.refService.universalSearchKey;
  }
  loadCssFile(): void {
    // Check if the CSS file is already loaded
    if (!document.querySelector("link[href='/assets/js/indexjscss/universal-search-bar.css']")) {
      // Dynamically create and append the <link> element to <head>
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/assets/js/indexjscss/universal-search-bar.css';
      link.type = 'text/css';
      const headElement = document.getElementById('xamplify-index-head');
      headElement.appendChild(link); // Append to <head>
      console.log('CSS file added successfully!');
    } else {
      console.log('CSS file is already loaded. Skipping.');
    }
  }

  universalSearch() {
    this.refService.universalSearchKey = this.searchKey ? this.searchKey.trim() : "";
    let routerNavigate = RouterUrlConstants.home + RouterUrlConstants.dashboard + RouterUrlConstants.universalSearch;
    if (this.isWelcomePageUrl || this.isWelcomePageEnabled) {
      if (this.refService.universalSearchKey != '') {
        this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.universalSearchKey, this.refService.universalSearchKey);
        this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.universalSearchFilterBy, this.refService.universalSearchFilterType);
        if (this.isWelcomePageUrl) {
          this.location.replaceState(routerNavigate);
          window.location.reload();
        } else {
          this.refService.goToRouter(routerNavigate);
        }
      } else {
        this.refService.isOpenUniversalSearch = false;
      }
    } else {
      this.refService.goToRouter(routerNavigate);
    }
  }
  universalSearchOnKeyPress(keyCode: any) {
    if (keyCode === 13 && (this.searchKey != '' && this.searchKey.trim().length > 0)) {
      this.universalSearch();
    }
  }
  goToDashBoard() {
    this.searchKey = "";
    this.refService.universalSearchKey = "";
    this.refService.universalSearchFilterType = 'All'
    this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.universalSearchKey, this.refService.universalSearchKey);
    this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.universalSearchFilterBy, this.refService.universalSearchFilterType);
    if (this.isWelcomePageEnabled) {
      if (!this.isWelcomePageUrl) {
        this.location.replaceState(this.refService.homeRouter);
        window.location.reload();
      }
    } else {
      this.refService.goToRouter(this.refService.homeRouter);
    }
  }
  isEmptyOrWhitespace(value: string | null | undefined | ''): boolean {
    return value != '' && value.trim().length > 0;
  }
  disabledButton(value: string | null | undefined) {
    return this.isWelcomePageEnabled ? true : this.isEmptyOrWhitespace(value);
  }
  // Filter function
  selectDropdownOption(label: string): void {
    this.refService.universalSearchFilterType = label;
    this.isDropdownVisible = false;
  }
  saveSearchKeyToLocalStorage(searchKey: string) {
    localStorage.setItem(XAMPLIFY_CONSTANTS.universalSearchKey, searchKey);
  }

  updateDropdownVisibility() {
    // this.dropdownOptions = [
    //   { label: 'All', index: 0, condition: true, },
    //   { label: 'Assets', index: 1, condition: this.authenticationService.module.damAccess || this.authenticationService.module.damAccessAsPartner, },
    //   { label: 'Tracks', index: 2, condition: this.authenticationService.module.lmsAccess || this.authenticationService.module.lmsAccessAsPartner, },
    //   { label: 'PlayBooks', index: 3, condition: this.authenticationService.module.playbookAccess || this.authenticationService.module.playbookAccessAsPartner, },
    //   { label: 'Lead', index: 4, condition: this.authenticationService.module.hasOpportunityRole || this.authenticationService.module.opportunitiesAccessAsPartner, },
    //   { label: 'Deal', index: 5, condition: this.authenticationService.module.hasOpportunityRole || this.authenticationService.module.opportunitiesAccessAsPartner, }
    // ];
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}

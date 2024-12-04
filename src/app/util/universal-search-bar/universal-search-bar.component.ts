import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $:any;
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
  modifiedValue: string = "";
  dropdownOptions: { label: string; condition: boolean; index: number }[] =[];
  constructor(private refService: ReferenceService, public authenticationService: AuthenticationService, public router: Router, public location: Location) { }

  ngOnInit() {
    this.modifiedValue = this.refService.universalSearchFilterType + ": " + this.refService.universalSearchKey;
    this.searchKey = this.refService.universalSearchKey;
  }
  universalSearch() {
    this.refService.universalSearchKey = this.searchKey.trim();
      let routerNavigate = RouterUrlConstants.home + RouterUrlConstants.dashboard + RouterUrlConstants.universalSearch;
      let isWelcomePage = this.router.url.includes('/welcome-page')
      if (this.refService.isHarizontalNavigationBar) {
        if (this.refService.universalSearchKey == '') {
          this.refService.isOpenUniversalSearch = false;
        } else {
          this.saveSearchKeyToLocalStorage(this.refService.universalSearchKey)
          this.location.replaceState(routerNavigate);
          window.location.reload();
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
  isEmptyOrWhitespace(): boolean {
      return this.searchKey != '' && this.searchKey.trim().length > 0;
  }
  goToDashBoard() {
    this.searchKey = "";
    this.refService.universalSearchKey = "";
    this.saveSearchKeyToLocalStorage( this.refService.universalSearchKey);
    this.refService.goToRouter(this.refService.homeRouter);
  }


  // Filter function
  selectDropdownOption(label: string, index: number): void {
    console.log(`Filtering by: ${label}`);
    this.refService.universalSearchFilterType = label;
    this.isDropdownVisible = false;
  }
  saveSearchKeyToLocalStorage(searchKey: string) {
    localStorage.setItem(XAMPLIFY_CONSTANTS.universalSearchKey, searchKey);
  }
  toggleDropdownVisibility() {
  this.isDropdownVisible = !this.isDropdownVisible;
  }

  updateDropdownVisibility() {
    this.dropdownOptions = [
      {
        label: 'All',
        index: 0,
        condition: true,
      },
      {
        label: 'Assets',
        index: 1,
        condition: this.authenticationService.module.damAccess || this.authenticationService.module.damAccessAsPartner,
      },
      {
        label: 'Tracks',
        index: 2,
        condition: this.authenticationService.module.lmsAccess || this.authenticationService.module.lmsAccessAsPartner,
      },
      {
        label: 'PlayBooks',
        index: 3,
        condition: this.authenticationService.module.playbookAccess || this.authenticationService.module.playbookAccessAsPartner,
      },
      {
        label: 'Lead',
        index: 4,
        condition: this.authenticationService.module.hasOpportunityRole || this.authenticationService.module.opportunitiesAccessAsPartner,
      },
      {
        label: 'Deal',
        index: 5,
        condition: this.authenticationService.module.hasOpportunityRole || this.authenticationService.module.opportunitiesAccessAsPartner,
      }
    ];
    this.isDropdownVisible = this.dropdownOptions.some(option => option.condition);
  }
  isShowUniversalSearch:boolean = false;
  showUniversalSearch(){
    this.isShowUniversalSearch = true;
  }
}

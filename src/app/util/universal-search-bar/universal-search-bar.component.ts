import { Component, OnInit } from '@angular/core';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

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
  dropdownOptions: { label: string; condition: boolean; index: number }[] = [];
  constructor(private refService: ReferenceService, public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.modifiedValue = this.refService.universalSearchFilterType + ": " + this.refService.universalSearchKey;
    this.searchKey = this.refService.universalSearchKey;
  }
  universalSearch() {
    this.refService.universalSearchKey = this.searchKey.trim();
    this.refService.goToRouter(RouterUrlConstants.home + RouterUrlConstants.dashboard + RouterUrlConstants.universalSearch);
  }
  universalSearchOnKeyPress(keyCode: any) {
    if (keyCode === 13 && (this.searchKey != '' && this.searchKey.trim().length > 0)) {
      this.universalSearch();
    }
  }
  isEmptyOrWhitespace(value: string | null | undefined): boolean {
    return this.searchKey != '' && this.searchKey.trim().length > 0;
  }
  goToDashBoard() {
    this.searchKey = "";
    this.refService.universalSearchKey = "";
    this.refService.goToRouter(this.refService.homeRouter)
  }

  showDropDown() {
    this.isShowDropdown = true;
  }

  // Filter function
  filterUniversalSearch(label: string, index: number): void {
    console.log(`Filtering by: ${label}`);
    this.refService.universalSearchFilterType = label;
    this.selectedOption = label;
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
}

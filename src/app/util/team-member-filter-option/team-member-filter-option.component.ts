import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Subject } from 'rxjs';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-team-member-filter-option',
  templateUrl: './team-member-filter-option.component.html',
  styleUrls: ['./team-member-filter-option.component.css']
})
export class TeamMemberFilterOptionComponent implements OnInit {

  showPartners = false;
  selectedFilterIndex = 1;
  loading = false;
  @Output() teamMemberFilterOptionEventEmitter = new EventEmitter();
  @Output() teamMemberFilterModalPopUpOptionEventEmitter = new EventEmitter();
  @Input() filterIcon = false;
  @Input() isAssetOrLms = false;
  showFilterPopup = false;
  @Input()  resetTMSelectedFilterIndex   : Subject<boolean> = new Subject<boolean>();
  @Input() customSelectedIndex: number;
  filterOption: boolean = false;
  @Input() isPartnerModule: boolean = false;
  constructor(public authenticationService: AuthenticationService,public referenceService: ReferenceService) { }

  ngOnInit() {
    this.showPartnersFilterOption();
    this.checkPartnerTeamMemberFilter();
    if (this.customSelectedIndex !== undefined && this.customSelectedIndex !== null) {
      this.selectedFilterIndex = this.customSelectedIndex;
    }
    this.resetTMSelectedFilterIndex.subscribe(response => {
        if (response) {
        	this.selectedFilterIndex = 1;
        }else{
          this.selectedFilterIndex = 0;
        }
      });
  }

  private checkPartnerTeamMemberFilter() {
    if (this.isPartnerModule || this.isAssetOrLms) {
      let filterPartner = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
      if (filterPartner !== null  && filterPartner !== undefined && (!filterPartner || filterPartner === 'false')) {
        this.selectedFilterIndex = (this.referenceService.universalModuleType === "Partners")? this.referenceService.universalSearchFilterValue:0;
      } else {
        this.selectedFilterIndex = (this.referenceService.universalModuleType === "Partners")? this.referenceService.universalSearchFilterValue:1;
      }
    }
  }

  showPartnersFilterOption() {
    this.loading = true;
    this.authenticationService.showPartnersFilter().subscribe(
      response => {
        this.showPartners = response.data;
        this.loading = false;
      }, _error => {
        this.showPartners = false;
        this.loading = false;
      }
    )
  }


  applyFilter(selectedIndex: number) {
    this.selectedFilterIndex = selectedIndex;
    this.referenceService.universalSearchFilterValue = selectedIndex; //XNFR-853
    this.teamMemberFilterOptionEventEmitter.emit(selectedIndex);
    this.loading = false;
  }

  openFilterPopup(){
    this.filterOption = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
    if(this.filterOption!=undefined && !this.filterOption){
      this.selectedFilterIndex = 0;
    }
    this.showFilterPopup = true;
  }

  getSelectedOption(input:any){
    let previousSelectedIndex = this.selectedFilterIndex;
    this.showFilterPopup = false;
    this.selectedFilterIndex = input['selectedOptionIndex'];
    if( this.selectedFilterIndex != previousSelectedIndex){
      this.saveSelectedOption();
    }
     this.teamMemberFilterModalPopUpOptionEventEmitter.emit(input);
  }
  saveSelectedOption() {
    this.authenticationService.savePartnerFilter(this.selectedFilterIndex).subscribe(
      response => {
        if (response.statusCode == 200) {
          console.log("updatedSucessfully");
          const filterPartner :boolean = (this.selectedFilterIndex == 0) ? false : true;
          localStorage.setItem(XAMPLIFY_CONSTANTS.filterPartners, JSON.stringify(filterPartner));
        }
      }, _error => {
        console.log("error");
      }
    )
  }

  closeFilterPopup(){
    this.showFilterPopup = false;
  }

}

import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Subject } from 'rxjs';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';

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
  showFilterPopup = false;
  @Input()  resetTMSelectedFilterIndex   : Subject<boolean> = new Subject<boolean>();
  @Input() customSelectedIndex: number;
  filterOption: boolean = false;
  @Input() isPartnerModule: boolean = false;
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.showPartnersFilterOption();
    if (this.isPartnerModule) {
    let filterPartner = this.authenticationService.getLocalStorageItemByKey(XAMPLIFY_CONSTANTS.filterPartners);
    if (filterPartner !== undefined && (!filterPartner || filterPartner === 'false')) {
      this.selectedFilterIndex = 0;
    }
  }
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
          (this.selectedFilterIndex == 0) ?  this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.filterPartners,'false'): this.authenticationService.setLocalStorageItemByKeyAndValue(XAMPLIFY_CONSTANTS.filterPartners,'true');
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

import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Subject } from 'rxjs';

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
  ischecked: boolean = false;
  filterOption: boolean = false;
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.showPartnersFilterOption();
    if (this.customSelectedIndex !== undefined && this.customSelectedIndex !== null) {
      this.selectedFilterIndex = this.customSelectedIndex;
    }
    this.resetTMSelectedFilterIndex.subscribe(response => {
        if (response) {
        	this.selectedFilterIndex = 1;
        }
      });
  }

  showPartnersFilterOption() {
    this.loading = true;
    this.authenticationService.showPartnersFilter().subscribe(
      response => {
        this.showPartners = response.data;
        this.ischecked = response.data;
        this.loading = false;
      }, _error => {
        this.showPartners = false;
        this.ischecked = false;
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
    this.getfilterOption();
  }

  getSelectedOption(input:any){
    this.showFilterPopup = false;
    this.selectedFilterIndex = input['selectedOptionIndex'];
    this.ischecked = input['ischecked'];
    this.teamMemberFilterModalPopUpOptionEventEmitter.emit(input);
    this.saveSelectedOption();

  }
  saveSelectedOption() {
    let filtertype: string;
    if (this.selectedFilterIndex === 0) {
      filtertype = 'All';
    }
    else {
      filtertype = 'MYPARTNER';
    }
    this.authenticationService.savePartnerFilter(filtertype).subscribe(
      response => {
        if (response.data == 200) {
          console.log("updatedSucessfully");
        }
      }, _error => {
        console.log("error");
      }
    )
  }
  getfilterOption(){
    this.loading = true;
    this.authenticationService.getPartnersFilter().subscribe(
      response => {
        this.filterOption =response.data;
        if(!this.filterOption){
          this.selectedFilterIndex = 0;
        }
        this.showFilterPopup = true;
        this.loading = false;
      }, _error => {
        this.filterOption = false;
        this.loading = false;
      }
    )
  }

}

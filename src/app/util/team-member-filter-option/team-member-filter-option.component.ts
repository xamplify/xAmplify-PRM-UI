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
  @Input() selectedIndex: number;
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.showPartnersFilterOption();
    if (this.customSelectedIndex !== undefined && this.customSelectedIndex !== null) {
      this.selectedFilterIndex = this.customSelectedIndex;
    }
    if (this.selectedIndex != null) {
      this.selectedFilterIndex = this.selectedIndex;
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
    this.showFilterPopup = true;
  }

  getSelectedOption(input:any){
    this.showFilterPopup = false;
    this.selectedFilterIndex = input['selectedOptionIndex'];
    this.teamMemberFilterModalPopUpOptionEventEmitter.emit(input);

  }

}

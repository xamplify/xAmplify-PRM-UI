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
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loading = true;
    this.showPartnersFilterOption();
  }

  showPartnersFilterOption() {
    this.authenticationService.showPartnersFilter().subscribe(
      response => {
        this.showPartners = response.data;
      }, _error => {
        this.showPartners = false;
        this.selectedFilterIndex = 0;
        this.loading = false;
      },()=>{
        if(this.showPartners){
          this.handleSelectedFilterIndex();
          this.applyFilter(this.selectedFilterIndex);
        }else{
          this.selectedFilterIndex = 0;
        }
        this.loading = false;
      });
  }


  private handleSelectedFilterIndex() {
    if (this.customSelectedIndex !== undefined && this.customSelectedIndex !== null) {
      this.selectedFilterIndex = this.customSelectedIndex;
    }
    this.resetTMSelectedFilterIndex.subscribe(response => {
      if (response) {
        this.selectedFilterIndex = 1;
      }
    });
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

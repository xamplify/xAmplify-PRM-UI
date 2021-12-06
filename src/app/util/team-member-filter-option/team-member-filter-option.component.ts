import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-team-member-filter-option',
  templateUrl: './team-member-filter-option.component.html',
  styleUrls: ['./team-member-filter-option.component.css']
})
export class TeamMemberFilterOptionComponent implements OnInit {

  showPartners = false;
  selectedFilterIndex = 0;
  loading = false;
  @Output() teamMemberFilterOptionEventEmitter = new EventEmitter();
  @Input() filterIcon = false;
  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.showPartnersFilterOption();
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
    alert("Work In Progress");
  }

}

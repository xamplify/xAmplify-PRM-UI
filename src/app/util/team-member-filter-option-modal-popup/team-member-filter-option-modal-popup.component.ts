import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var $;
@Component({
  selector: 'app-team-member-filter-option-modal-popup',
  templateUrl: './team-member-filter-option-modal-popup.component.html',
  styleUrls: ['./team-member-filter-option-modal-popup.component.css']
})
export class TeamMemberFilterOptionModalPopupComponent implements OnInit,OnDestroy {

  @Output() teamMemberFilterOptionModalPopupEmitter = new EventEmitter();
  selectedTeamMemberFilterOption = 0;
  @Input()selectedFilterIndex:number;
  constructor(public authenticationService:AuthenticationService) { }
  

  ngOnInit() {
    this.selectedTeamMemberFilterOption = this.selectedFilterIndex;
    $('#teamMemberFilterModalPopup').modal('show');
  }

  
  applyFilter(apply:boolean){
    let input = {};
    input['selectedOptionIndex'] = this.selectedTeamMemberFilterOption;
    input['applyFilter'] = apply;
    this.teamMemberFilterOptionModalPopupEmitter.emit(input);
    $('#teamMemberFilterModalPopup').modal('hide');
  }

  ngOnDestroy(): void {
   $('#teamMemberFilterModalPopup').modal('hide');
  }

}

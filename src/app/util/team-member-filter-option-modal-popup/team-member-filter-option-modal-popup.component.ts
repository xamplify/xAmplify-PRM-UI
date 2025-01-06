import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Properties } from 'app/common/models/properties';
declare var $;
@Component({
  selector: 'app-team-member-filter-option-modal-popup',
  templateUrl: './team-member-filter-option-modal-popup.component.html',
  styleUrls: ['./team-member-filter-option-modal-popup.component.css'],
  providers: [Properties] 
})
export class TeamMemberFilterOptionModalPopupComponent implements OnInit,OnDestroy {

  @Output() teamMemberFilterOptionModalPopupEmitter = new EventEmitter();
  @Output() teamMemberFilterOptionModalCloseEmitter = new EventEmitter();
  selectedTeamMemberFilterOption = 0;
  @Input()selectedFilterIndex:number;
  previousSelectedFilterIndex: number;
  constructor(public authenticationService:AuthenticationService,public properties: Properties) { }
  

  ngOnInit() {
    this.selectedTeamMemberFilterOption = this.selectedFilterIndex;
    this.previousSelectedFilterIndex = this.selectedFilterIndex;
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

  cancel(){
    this.teamMemberFilterOptionModalCloseEmitter.emit();
    $('#teamMemberFilterModalPopup').modal('hide');
  }
}

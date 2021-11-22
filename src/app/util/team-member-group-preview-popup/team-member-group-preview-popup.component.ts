import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
import { TeamMemberService } from 'app/team/services/team-member.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';

declare var $: any;
@Component({
  selector: 'app-team-member-group-preview-popup',
  templateUrl: './team-member-group-preview-popup.component.html',
  styleUrls: ['./team-member-group-preview-popup.component.css']
})
export class TeamMemberGroupPreviewPopupComponent implements OnInit {
  modulesLoader = false;
  defaultModules:Array<any> = new Array<any>();
  emptyModules = false;
  @Input() teamMemberGroupId:number;
  @Output() previewGroupPopupEventEmitter = new EventEmitter();
  constructor(public teamMemberService:TeamMemberService,public logger:XtremandLogger,public referenceService:ReferenceService) { }

  ngOnInit() {
    this.previewModules(this.teamMemberGroupId);
  }

  previewModules(teamMemberGroupId:number){
    this.modulesLoader = true;
    this.emptyModules = false;
    this.defaultModules = [];
    $('#preview-team-member-popup').modal('show');
    this.teamMemberService.previewTeamMemberGroup(teamMemberGroupId).subscribe(
      response => {
       this.defaultModules = response.data.teamMemberModuleDTOs;
       this.emptyModules = this.defaultModules.length==0;
       this.modulesLoader = false;
      }, error => {
        this.logger.log(error);
        this.modulesLoader = false;
        $('#preview-team-member-popup').modal('hide');
        this.referenceService.showSweetAlertServerErrorMessage();
      }
    );
  }

  hidePopup(){
    $('#preview-team-member-popup').modal('hide');
    this.previewGroupPopupEventEmitter.emit();
  }

}

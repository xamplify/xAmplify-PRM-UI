import { AuthenticationService } from 'app/core/services/authentication.service';
import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
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
  @Input() agencyId:number;
  constructor(public authenticationService:AuthenticationService,public logger:XtremandLogger,public referenceService:ReferenceService,
    public authencticationService:AuthenticationService) { }

  ngOnInit() {
    this.previewModules();
  }

  previewModules(){
    this.modulesLoader = true;
    this.emptyModules = false;
    this.defaultModules = [];
    $('#preview-team-member-popup').modal('show');
    if(this.teamMemberGroupId!=undefined && this.teamMemberGroupId>0){
      this.findTeamMemberGroupModules();
    }else{
      this.findAgencyModules();
    }
    
  }

  private findAgencyModules() {
    this.authenticationService.getAssigedAgencyModules(this.agencyId).
      subscribe(
        response => {
          this.defaultModules = response.data;
          this.emptyModules = this.defaultModules.length == 0;
          this.modulesLoader = false;
        }, error => {
          this.addHttpError(error);
        }
      );
  }

  private findTeamMemberGroupModules() {
    this.authenticationService.previewTeamMemberGroup(this.teamMemberGroupId).subscribe(
      response => {
        this.defaultModules = response.data.teamMemberModuleDTOs;
        this.emptyModules = this.defaultModules.length == 0;
        this.modulesLoader = false;
      }, error => {
        this.addHttpError(error);
      }
    );
  }

  private addHttpError(error: any) {
    this.logger.log(error);
    this.modulesLoader = false;
    $('#preview-team-member-popup').modal('hide');
    this.referenceService.showSweetAlertServerErrorMessage();
  }

  hidePopup(){
    $('#preview-team-member-popup').modal('hide');
    this.previewGroupPopupEventEmitter.emit();
  }

}

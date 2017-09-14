import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { Team } from '../models/team';
declare var $ :any ;
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
@Component({
  selector: 'app-table-editable',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
    team:Team;
    emptyTable: boolean = true;
    validEmailId: boolean = false;
    formGroupClass:string = "form-group";
    emaillIdDivClass:string = this.formGroupClass;
    errorClass:string = "form-group has-error has-feedback";
    successClass:string = "form-group has-success has-feedback";
    uiError:string = "";
    teamMembers: Array<Team> = new Array<Team>();
    constructor( public logger: XtremandLogger,public referenceService:ReferenceService) {
        this.team = new Team();
    }
    ngOnInit() {
        try {
            this.logger.debug( "Add Team Component ngOnInit() Loaded" );
        }
        catch ( error ) {
            this.uiError = 'Oops! Something went wrong';
            this.logger.error( error );
        }
    }
    
    
    
    validateForm(emailId:string){
        try{
            if(!this.referenceService.validateEmailId(emailId)){
                this.emaillIdDivClass = this.errorClass;
                this.validEmailId = false;
            }else{
                this.emaillIdDivClass = this.successClass;
                this.validEmailId = true;
            }
        }catch(error){
           this.uiError = 'Oops! Something went wrong';
           this.logger.error( error );
        }
        
    }
    
    addTeamMember(){
        this.emptyTable = false;
        this.teamMembers.push(this.team);
        this.team = new Team();
        this.validEmailId = false;
        this.emaillIdDivClass ="form-group";
        
    }
   

}

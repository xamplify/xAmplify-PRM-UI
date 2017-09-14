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
    duplicateEmailId:boolean = false;
    formGroupClass:string = "form-group";
    emaillIdDivClass:string = this.formGroupClass;
    errorClass:string = "form-group has-error has-feedback";
    successClass:string = "form-group has-success has-feedback";
    defaultClass:string = "form-group";
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
            if(this.validEmailId && !this.duplicateEmailId){
                this.emaillIdDivClass = this.successClass;
            }else{
                this.emaillIdDivClass = this.errorClass;
            }
        
        }catch(error){
            this.showUIError(error);
        }
        
    }
    
    validateEmailId(emailId:string){
        try{
            this.validEmailId = this.referenceService.validateEmailId(emailId);
        }catch(error){
            this.showUIError(error);
        }
    }
    
    checkDuplicateEmailIds(emailId:string){
        try{
            let addedEmailIds = this.teamMembers.map(function(a) {return a.emailId.toLowerCase();});
            if(addedEmailIds.indexOf(emailId.toLowerCase())>-1){
                this.duplicateEmailId = true;
            }else{
                this.duplicateEmailId = false;
            }
        }catch(error){
            this.showUIError(error);
        }
        
    
    }
    
    addTeamMember(){
        try{
            this.emptyTable = false;
            this.teamMembers.push(this.team);
            this.team = new Team();
            this.validEmailId = false;
            this.emaillIdDivClass = this.defaultClass;
        }catch(error){
            this.showUIError(error);
        }
        
        
    }
    
    deleteRow(index:number){
        try{
            $('#team-member-'+index).remove();
            let tableRows = $("#add-team-member-table > tbody > tr").length;
            if(tableRows==0){
                this.clearRows();
            }
        }catch(error){
            this.showUIError(error);
        }
        
    }
    
    clearRows(){
        try{
            $('#add-team-member-table tbody').remove();
            this.emptyTable = true;
            this.teamMembers = []; 
            $('#add-team-member-form')[0].reset();
            this.emaillIdDivClass = this.defaultClass;
            $('.form-group').find('span').remove()
        }catch(error){
            this.showUIError(error);
        }
       
    }
    addAllAuthorities(e,team:Team){
        try{
            var table= $(e.target).closest('tr');
            $('td input:checkbox',table).prop('checked',e.target.checked);
            console.log(this.teamMembers);
            if(e.target.checked){
               this.updateCheckBoxValues(team);
            }
        }catch(error){
            this.showUIError(error);
        }
       
      }
    
    updateCheckBoxValues(team:Team){
           team.isVideo = true;
           team.isCampaign = true;
           team.isEmail = true;
           team.isStats = true;
           team.isContact = true;
        
    }
    countCheckedCheckBoxesLength(){
        
    }
    
    save(){
        console.log(this.teamMembers);
    }
    showUIError(error){
        this.uiError = 'Oops! Something went wrong';
        this.logger.error( error );
    }

}

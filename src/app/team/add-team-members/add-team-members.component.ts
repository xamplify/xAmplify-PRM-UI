import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TeamMember } from '../models/team-member';
import { TeamMemberService } from '../services/team-member.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination} from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
declare var $,swal :any ;
@Component({
  selector: 'app-table-editable',
  templateUrl: './add-team-members.component.html',
  styleUrls: ['./add-team-members.component.css'],
  providers:[Pagination,HttpRequestLoader]
})
export class AddTeamMembersComponent implements OnInit {
   
    emptyTable: boolean = true;
    validEmailId: boolean = false;
    duplicateEmailId:boolean = false;
    existingEmailId:boolean  = false;
    emptyRolesLength:number;
    existingEmailIds:string[]=[];
    orgAdminsEmailIds:string[]=[];
    isOrgAdmin:boolean = false;
    successMessage:string = "";
    /**********Pagination&Loading***********/
    userId:number;
    public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    public pagination:Pagination = new Pagination();
    team:TeamMember;
    teamMembers: Array<TeamMember> = new Array<TeamMember>();
    teamMembersList: Array<TeamMember> = new Array<TeamMember>();
    isProcessing:boolean = false;
    /*****Form Related**************/
    formGroupClass:string = "form-group";
    emaillIdDivClass:string = this.formGroupClass;
    errorClass:string = "form-group has-error has-feedback";
    successClass:string = "form-group has-success has-feedback";
    defaultClass:string = "form-group";
    uiError:string = "";
    /**********Constructor**********/
    constructor( public logger: XtremandLogger,public referenceService:ReferenceService,private teamMemberService:TeamMemberService,
            public authenticationService:AuthenticationService,private pagerService:PagerService) {
        this.team = new TeamMember();
        this.userId = this.authenticationService.getUserId();
        
    }
    /**********On Init()**********/
    ngOnInit() {
        try {
            this.logger.debug( "Add Team Component ngOnInit() Loaded" );
            this.listTeamMembers();
            this.listEmailIds();
            this.listAllOrgAdminsEmailIds();
        }
        catch ( error ) {
            this.showUIError(error);
        }
    }
    
    /************List Members*****************/
    listTeamMembers(){
        this.referenceService.loading(this.httpRequestLoader, true);
        this.httpRequestLoader.isHorizontalCss = true;
        this.emptyRolesLength = 0;
        this.teamMemberService.list(this.pagination,this.userId)
        .subscribe(
            data => {
                console.log(data);
                this.teamMembersList = data.teamMembers;
                this.pagination.totalRecords = data.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination,this.teamMembersList);
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            error => {
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished listTeamMembers()")
        );
    }
    
    /***********List TeamMember EmailIds****************/
    listEmailIds(){
        this.teamMemberService.listTeamMemberEmailIds()
        .subscribe(
            data => {
                this.existingEmailIds = data;
            },
            error => {
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished listEmailIds()")
        );
    }
    
    listAllOrgAdminsEmailIds(){
        this.teamMemberService.listAllOrgAdminsEmailIds()
        .subscribe(
            data => {
                this.orgAdminsEmailIds = data;
                console.log(this.orgAdminsEmailIds);
            },
            error => {
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished listAllOrgAdminsEmailIds()")
        );
    }
    
    save(){
        this.referenceService.goToTop();
        this.emptyRolesLength = this.validateRoles('add-team-member-table','team-member-');
        if(this.emptyRolesLength==0){
            this.isProcessing = true;
            this.teamMemberService.save(this.teamMembers,this.userId)
            .subscribe(
            data => {
               this.isProcessing = false;
               this.successMessage = "Team Member(s) Added Successfully";
               $( "#team-member-success-div" ).show();
               setTimeout( function() { $( "#team-member-success-div" ).slideUp( 500 ); }, 5000 );
               this.listTeamMembers();
               this.listEmailIds();
               this.clearRows();
            },
            error => {
                this.logger.errorPage(error);
            },
            () => console.log(" Completed save()")
            );
        }
       
    }
    
    update(){
        this.referenceService.goToTop();
        this.emptyRolesLength = this.validateRoles('list-team-member-table','list-team-member-');
        if(this.emptyRolesLength==0){
            this.isProcessing = true;
            this.teamMemberService.update(this.teamMembersList)
            .subscribe(
            data => {
               this.isProcessing = false;
               this.successMessage = "Team Member(s) Updated Successfully";
               $( "#team-member-success-div" ).show();
               setTimeout( function() { $( "#team-member-success-div" ).slideUp( 500 ); }, 5000 );
               this.listTeamMembers();
               this.listEmailIds();
               this.clearRows();
            },
            error => {
                this.logger.errorPage(error);
            },
            () => console.log(" Completed save()")
            );
        }
    }
    /*********************Delete*********************/
    deleteText:string = "This will remove team member";
    deleteMessage:string = "";
    delete(teamMember:TeamMember){
       this.deleteMessage = teamMember.emailId+" Deleted Successfully";
       this.sweetAlertWarning(teamMember);
    }
    
    deleteAll(){
        this.deleteText = "This will remove all team members.";
        this.deleteMessage ="All Team Members Deleted Successfully";
        let teamMember = new TeamMember();
        teamMember.teamMemberId = 0;
        this.sweetAlertWarning(teamMember);
    }
    
    
    sweetAlertWarning(teamMember:TeamMember){
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "This will remove team member",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!'

        }).then(function() {
            teamMember.id =  self.userId;
            self.teamMemberService.delete(teamMember)
            .subscribe(
            data => {
                 $( "#team-member-delete-success" ).show();
                setTimeout( function() { $( "#team-member-delete-success" ).slideUp( 500 ); }, 5000 );
                self.listTeamMembers();
                self.listEmailIds();
            },
            error => {self.logger.errorPage(error)},
            () => console.log( "Team member Deleted Successfully" )
            );
        },function (dismiss) {
            if (dismiss === 'cancel') {
                
            }
        })
    }
    
    setPage(page: number) {
        this.pagination.pageIndex = page;
        this.listTeamMembers();
    }
    
    validateForm(emailId:string){
        try{
            if(this.validEmailId && !this.duplicateEmailId){
                this.removeErrorClass();
            }else{
                this.addErrorClass();
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
                this.addErrorClass();
            }else{
                this.duplicateEmailId = false;
                this.removeErrorClass();
            }
        }catch(error){
            this.showUIError(error);
        }
        
    
    }
    
    
    checkExisitingEmailIds( emailId: string ) {
        try {
            if ( this.existingEmailIds.indexOf( emailId.toLowerCase() ) > -1 ) {
                this.existingEmailId = true;
                this.addErrorClass();
            } else {
                this.existingEmailId = false;
                this.removeErrorClass();
            }

        } catch ( error ) {
            this.showUIError( error );
        }
    }
    
    
    checkIsLoggedInUserEmailId(emailId:string){
        try{
            if(this.authenticationService.getUserEmailId()==emailId.toLowerCase()){
                this.isOrgAdmin = true;
            }else{
                this.isOrgAdmin = false;
            }
            
        }catch(error){
            this.showUIError(error);
        }
    }
    
    addErrorClass(){
        return this.emaillIdDivClass = this.errorClass;
    }
    removeErrorClass(){
        return this.emaillIdDivClass = this.successClass;
    }
    
    addTeamMember(){
        try{
            this.emptyTable = false;
            this.teamMembers.push(this.team);
            this.team = new TeamMember();
            this.validEmailId = false;
            this.emaillIdDivClass = this.defaultClass;
        }catch(error){
            this.showUIError(error);
        }
        
    }
    
    deleteRow(index:number,emailId:string){
        try{
            $('#team-member-'+index).remove();
            emailId = emailId.toLowerCase();
            this.teamMembers = this.spliceArray(this.teamMembers,emailId);
            let tableRows = $("#add-team-member-table > tbody > tr").length;
            if(tableRows==0){
                this.clearRows();
            }
        }catch(error){
            this.showUIError(error);
        }
        
    }
    
    spliceArray(arr:any,emailId:string){
        arr = $.grep(arr, function(data, index) {
            return data.emailId != emailId
         });
        return arr;
    }
    
    clearRows(){
        try{
            $('#add-team-member-table tbody').remove();
            this.emptyTable = true;
            this.teamMembers = []; 
            this.team = new TeamMember();
            this.emaillIdDivClass = this.defaultClass;
            $(".col-md-12 span").text('');
            this.emptyRolesLength = 0;
        }catch(error){
          this.showUIError(error);
        }
       
    }
    addAllAuthorities(e,team:TeamMember){
        try{
            var table= $(e.target).closest('tr');
            $('td input:checkbox',table).prop('checked',e.target.checked);
            if(e.target.checked){
               this.setAllRoles(team);
            }else{
                this.removeAllRoles(team);
            }
        }catch(error){
            this.showUIError(error);
        }
       
      }
    
    setAllRoles( team: TeamMember ) {
        team.video = true;
        team.campaign = true;
        team.emailTemplate = true;
        team.stats = true;
        team.contact = true;

    }
    removeAllRoles(team:TeamMember){
        team.video = false;
        team.campaign = false;
        team.emailTemplate = false;
        team.stats = false;
        team.contact = false;
    }
    
    countCheckedCheckBoxesLength(team:TeamMember,index:number,tableId:string){
       try{
           let length = $('#'+tableId+' .module-checkbox-'+index+':checked').length;
           if(length==5){
               team.all = true;
           }else{
               team.all = false;
           }
       }catch(error){
           this.showUIError(error);
       }
    }
    
    
    
    validateRoles(tableId:string,trId:string){
        try{
            let tableRowsLength = $('#'+tableId+' tbody tr').length;
            for(var i=0;i<tableRowsLength;i++){
                let assignedRowsLength = $('#'+tableId+' .module-checkbox-'+i+':checked').length;
                if(assignedRowsLength>0){
                    $('#'+trId+i).css("background-color", "#C0C0C0");
                }else{
                    $('#'+trId+i).css("background-color", "#E00000");
                }
            }
            return $("#"+tableId).find("tr[style='background-color: rgb(224, 0, 0);']").length;
        }catch(error){
            this.showUIError(error);
        }
       
    }
    
    showUIError(error){
        this.uiError = 'Oops! Something went wrong';
        this.logger.error( error );
    }

}

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
declare var $ :any ;
@Component({
  selector: 'app-table-editable',
  templateUrl: './add-team-members.component.html',
  styleUrls: ['./add-team-members.component.css'],
  providers:[Pagination,HttpRequestLoader]
})
export class AddTeamMembersComponent implements OnInit {
   
    isProcessing:boolean = false;
    emptyTable: boolean = true;
    validEmailId: boolean = false;
    duplicateEmailId:boolean = false;
    formGroupClass:string = "form-group";
    emaillIdDivClass:string = this.formGroupClass;
    errorClass:string = "form-group has-error has-feedback";
    successClass:string = "form-group has-success has-feedback";
    defaultClass:string = "form-group";
    uiError:string = "";
    emptyRolesLength:number;

    /**********Pagination***********/
    userId:number;
    pager: any = {};
    pagedItems: any[];
    public totalRecords :number=1;
    public searchKey :string="";
    public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    public pagination:Pagination = new Pagination();
    
    team:TeamMember;
    teamMembers: Array<TeamMember> = new Array<TeamMember>();
    teamMembersList: Array<TeamMember> = new Array<TeamMember>();
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
        }
        catch ( error ) {
            this.showUIError(error);
        }
    }
    
    
    /************List Members*****************/
    listTeamMembers(){
        this.referenceService.loading(this.httpRequestLoader, true);
        this.httpRequestLoader.isHorizontalCss = true;
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
      
    
    save(){
        this.emptyRolesLength = this.validateRoles();
        if(this.emptyRolesLength==0){
             console.log(this.teamMembers);
            this.isProcessing = true;
            this.teamMemberService.save(this.teamMembers,this.userId)
            .subscribe(
            data => {
               this.isProcessing = false;
               
            },
            error => {
                this.logger.errorPage(error);
            },
            () => console.log(" Completed save()")
            );
        }
       
    }
    
    
    setPage(page: number) {
        this.pagination.pageIndex = page;
        this.listTeamMembers();
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
            $('#add-team-member-form')[0].reset();
            this.emaillIdDivClass = this.defaultClass;
            $('.form-group').find('span').remove()
        }catch(error){
            this.showUIError(error);
        }
       
    }
    addAllAuthorities(e,team:TeamMember){
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
    
    updateCheckBoxValues(team:TeamMember){
           team.video = true;
           team.campaign = true;
           team.emailTemplate = true;
           team.stats = true;
           team.contact = true;
        
    }
    countCheckedCheckBoxesLength(team:TeamMember,index:number){
       try{
           let length = $('#add-team-member-table .module-checkbox-'+index+':checked').length;
           if(length==5){
               team.all = true;
           }else{
               team.all = false;
           }
       }catch(error){
           this.showUIError(error);
       }
    }
    
    
    
    validateRoles(){
        try{
            let tableRowsLength = $('#add-team-member-table tbody tr').length;
            for(var i=0;i<tableRowsLength;i++){
                let assignedRowsLength = $('#add-team-member-table .module-checkbox-'+i+':checked').length;
                if(assignedRowsLength>0){
                    $('#team-member-'+i).css("background-color", "#C0C0C0");
                }else{
                    $('#team-member-'+i).css("background-color", "#E00000");
                }
            }
            return $("#add-team-member-table").find("tr[style='background-color: rgb(224, 0, 0);']").length;
        }catch(error){
            this.showUIError(error);
        }
       
    }
    
    showUIError(error){
        this.uiError = 'Oops! Something went wrong';
        this.logger.error( error );
    }

}

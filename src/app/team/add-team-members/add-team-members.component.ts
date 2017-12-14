import { Component, OnInit, OnDestroy,ViewChild} from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FileUtil } from '../../core/models/file-util';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TeamMember } from '../models/team-member';
import { TeamMemberUi } from '../models/team-member-ui';
import { TeamMemberService } from '../services/team-member.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination} from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
declare var $,swal :any ;
@Component({
  selector: 'app-table-editable',
  templateUrl: './add-team-members.component.html',
  styleUrls: ['./add-team-members.component.css'],
  providers:[Pagination,HttpRequestLoader,FileUtil]
})
export class AddTeamMembersComponent implements OnInit {
   
    successMessage: string = "";
    isAddTeamMember:boolean = false;
    isUploadCsv:boolean = false;
    errorMessage:string = "";
    deleteText:string = "This will remove team member";
    deleteMessage:string = "";
    orgAdminEmailIds:string[]=[];
    existingEmailIds:string[] = [];
    teamMemberUi:TeamMemberUi;
    team:TeamMember;
    teamMembers: Array<TeamMember> = new Array<TeamMember>();
    teamMembersList: Array<TeamMember> = new Array<TeamMember>();
    @ViewChild('fileImportInput')
    fileImportInput: any;
    csvRecords = [];
    /**********Pagination&Loading***********/
    userId:number;
    public httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
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
            public authenticationService:AuthenticationService,private pagerService:PagerService,private pagination:Pagination,private fileUtil:FileUtil) {
        this.team = new TeamMember();
        this.userId = this.authenticationService.getUserId();
        
    }
    
    downloadEmptyCsv(){
        window.location.href = this.authenticationService.MEDIA_URL + "team-member-list.csv";
    }
    
    /**********On Init()**********/
    ngOnInit() {
        try {
            this.logger.debug( "Add Team Component ngOnInit() Loaded" );
            this.listTeamMembers(this.pagination);
            this.listEmailIds();
            this.listAllOrgAdminsEmailIds();
        }
        catch ( error ) {
            this.showUIError(error);
        }
    }
    
    /************List Members*****************/
    listTeamMembers(pagination:Pagination){
        try{
            this.referenceService.loading(this.httpRequestLoader, true);
            this.httpRequestLoader.isHorizontalCss = true;
            this.teamMemberUi = new TeamMemberUi();
            this.clearRows();
            this.teamMemberService.list(pagination,this.userId)
            .subscribe(
                data => {
                    this.teamMembersList = data.teamMembers;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems(pagination,this.teamMembersList);
                    this.referenceService.loading(this.httpRequestLoader, false); 
                },
                error => {
                    this.logger.errorPage(error);
                },
                () => this.logger.info("Finished listTeamMembers()")
            );
        }catch(error){
            this.showUIError(error);
        }
       
    }
    
    /**************Search TeamMembers***************/
    searchTeamMembers(){
    this.pagination.pageIndex =1;
    this.listTeamMembers(this.pagination);
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
                this.orgAdminEmailIds = data;
                console.log(this.orgAdminEmailIds);
            },
            error => {
                this.logger.errorPage(error);
            },
            () => this.logger.info("Finished listAllOrgAdminsEmailIds()")
        );
    }
    
    save(){
        $( "#empty-roles-div" ).hide();
        this.referenceService.goToTop();
        this.teamMemberUi.emptyRolesLength = this.validateRoles('add-team-member-table','team-member-');
        if(this.teamMemberUi.emptyRolesLength==0){
            this.errorMessage = "";
            this.isProcessing = true;
            this.teamMemberService.save(this.teamMembers,this.userId)
            .subscribe(
            data => {
               this.isProcessing = false;
               this.successMessage = "Team Member(s) Added Successfully";
               $( "#team-member-success-div" ).show();
               setTimeout( function() { $( "#team-member-success-div" ).slideUp( 500 ); }, 7000 );
               this.pagination.pageIndex = 1;
               this.listTeamMembers(this.pagination);
               this.listEmailIds();
               this.clearRows();
            },
            error => {
                this.logger.errorPage(error);
            },
            () => console.log(" Completed save()")
            );
        }else{
            this.showErrorMessageDiv("Please assign atleast one role to team member");
        }
       
    }
    
    update(){
        $( "#empty-roles-div" ).hide();
        this.referenceService.goToTop();
        this.teamMemberUi.emptyRolesLength = this.validateRoles('list-team-member-table','list-team-member-');
        if(this.teamMemberUi.emptyRolesLength==0){
            this.errorMessage = "";
            this.isProcessing = true;
            this.teamMemberService.update(this.teamMembersList)
            .subscribe(
            data => {
               this.isProcessing = false;
               this.successMessage = "Team Member(s) Updated Successfully";
               $( "#team-member-success-div" ).show();
               setTimeout( function() { $( "#team-member-success-div" ).slideUp( 500 ); }, 7000 );
               this.pagination.pageIndex = 1;
               this.listTeamMembers(this.pagination);
               this.listEmailIds();
               this.clearRows();
            },
            error => {
                this.logger.errorPage(error);
            },
            () => console.log(" Completed save()")
            );
        }else{
            this.showErrorMessageDiv("Please assign atleast one role to team member");
        }
    }
    
    showErrorMessageDiv(message:string){
        this.errorMessage =message ;
        $( "#empty-roles-div" ).show(600);
        setTimeout( function() { $( "#empty-roles-div" ).slideUp( 500 ); }, 7000 );
    }
    /*********************Delete*********************/
    delete(teamMember:TeamMember){
        this.deleteText = "This will remove team member.";
        this.sweetAlertWarning(teamMember);
    }
    
    deleteAll(){
        this.deleteText = "This will remove all team members.";
        let teamMember = new TeamMember();
        teamMember.teamMemberId = 0;
        this.sweetAlertWarning(teamMember);
    }
    
    
    sweetAlertWarning(teamMember:TeamMember){
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: self.deleteText,
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
                if(teamMember.teamMemberId==0){
                    self.successMessage ="All Team Members Deleted Successfully";
                    self.pagination.pageIndex = 0;
                }else{
                    self.successMessage = teamMember.emailId+" Deleted Successfully";
                    self.pagination.pageIndex = self.pagination.pageIndex-1;
                }
                 $( "#team-member-success-div" ).show();
                setTimeout( function() { $( "#team-member-success-div" ).slideUp( 500 ); }, 7000 );
                self.listTeamMembers(self.pagination);
                self.listEmailIds();
                self.clearRows();
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
        this.listTeamMembers(this.pagination);
    }
    
  
    validateEmailId(emailId:string,isTabChangeEvent:boolean){
        try{
            this.teamMemberUi.validEmailId = this.referenceService.validateEmailId(emailId);
            if(!this.teamMemberUi.validEmailId){
                if(isTabChangeEvent){
                  this.showErrorMessage("Invalid Email Id");
                }else{
                    this.teamMemberUi.isValidForm = false;
                }
            }else{
                /**********Method To Check Whether Org Admin Or Not***********/
                console.log(this.orgAdminEmailIds);
                if(this.orgAdminEmailIds.indexOf(emailId.toLowerCase())>-1){
                    console.log(emailId.toLowerCase()+" is an org admin")
                    this.showErrorMessage("Org Admin Cannot be added as a team member");
                }else{
                 /********************Check Duplicate Email Ids*******************/
                    let addedEmailIds = this.teamMembers.map(function(a) {return a.emailId.toLowerCase();});
                    if(addedEmailIds.indexOf(emailId.toLowerCase())>-1){
                        this.showErrorMessage("Already Exists");
                    }else{
                  /*******************Check If Already Added As A Team Member***************************/
                        if( this.existingEmailIds.indexOf(emailId.toLowerCase())>-1){
                            this.showErrorMessage("Already Added ");
                        }else{
                            this.hideErrorMessage();
                        }
                        
                    }
                    
                }
                
            }
        }catch(error){
            this.showUIError(error);
        }
    }
    
    validateEmailIdOnBlur(emailId:string){
        alert("tab clikce");
    }
    
    
    showErrorMessage(message:string){
        this.teamMemberUi.isValidForm = false;
        this.teamMemberUi.errorMessage = message;
        this.addErrorClass();
    }
    hideErrorMessage(){
        this.teamMemberUi.isValidForm = true;
        this.teamMemberUi.errorMessage = '';
        $(".col-md-12 span").text('');
        this.removeErrorClass();
    }
    
    
    addErrorClass(){
        return this.emaillIdDivClass = this.errorClass;
    }
    removeErrorClass(){
        return this.emaillIdDivClass = this.successClass;
    }
    
    addTeamMember(){
        try{
            this.teamMemberUi.emptyTable = false;
            this.teamMembers.push(this.team);
            this.team = new TeamMember();
            this.teamMemberUi.validEmailId = false;
            this.emaillIdDivClass = this.defaultClass;
            this.teamMemberUi.isValidForm = false;
            this.closePopup();
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
            this.teamMembers = []; 
            this.team = new TeamMember();
            this.emaillIdDivClass = this.defaultClass;
            $(".col-md-12 span").text('');
            this.teamMemberUi = new TeamMemberUi();
            this.isUploadCsv = false;
            this.isAddTeamMember = false;
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
        team.socialShare = true;

    }
    removeAllRoles(team:TeamMember){
        team.video = false;
        team.campaign = false;
        team.emailTemplate = false;
        team.stats = false;
        team.contact = false;
        team.socialShare = false;
    }
    
    countCheckedCheckBoxesLength(team:TeamMember,index:number,tableId:string){
       try{
           let length = $('#'+tableId+' .module-checkbox-'+index+':checked').length;
           if(length==6){
               team.all = true;
               $('#'+tableId+' #role-checkbox-'+index).prop("disabled",true);
           }else{
               team.all = false;
               $('#'+tableId+' #role-checkbox-'+index).prop("disabled",false);
           }
       }catch(error){
           this.showUIError(error);
       }
    }
    addAllAuthorities(e,team:TeamMember,tableId:string,index:number){
        try{
            var table= $(e.target).closest('tr');
            $('td input:checkbox',table).prop('checked',e.target.checked);
            if(e.target.checked){
               this.setAllRoles(team);
               $('#'+tableId+' #role-checkbox-'+index).prop("disabled",true);
            }else{
                this.removeAllRoles(team);
                $('#'+tableId+' #role-checkbox-'+index).prop("disabled",false);
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

    
    refreshList(){
        this.pagination.pageIndex =1;
        this.pagination.searchKey = "";
        this.listTeamMembers(this.pagination);
    }
    csvErrors:string[] = [];
    
    fileChangeListener($event): void {
        this.csvErrors = [];
        var text = [];
        var files = $event.srcElement.files;
        if (this.fileUtil.isCSVFile(files[0])) {
            $( "#empty-roles-div" ).hide();
            $( "#csv-error-div" ).hide();
            var input = $event.target;
          var reader = new FileReader();
          reader.readAsText(input.files[0]);
          reader.onload = (data) => {
             this.isUploadCsv = true;
            let csvData = reader.result;
            let csvRecordsArray = csvData.split(/\r\n|\n/);
            let headersRow = this.fileUtil
                .getHeaderArray(csvRecordsArray);
            let headers = headersRow[0].split(',');
            if(headers.length==8){
                if(this.validateHeaders(headers)){
                    this.readCsvData(csvRecordsArray,headersRow.length);
                }else{
                    this.showCsvFileError('Invalid CSV');
                }
            }else{
                this.showCsvFileError('Invalid CSV');
            }
          }
          let self = this;
          reader.onerror = function () {
              self.showErrorMessageDiv('Unable to read the file');
              self.isUploadCsv = false;
              self.isAddTeamMember = false;
          };

        } else {
          this.showErrorMessageDiv('Please Import csv file only');
          this.fileReset();
        }
      };
      
         validateHeaders(headers){
          return (headers[0]=="EMAIL_ID" && headers[1]=="ALL" && headers[2]=="VIDEO" && headers[3]=="CONTACTS" && headers[4]=="CAMPAIGN" && headers[5]=="STATS" && headers[6]=="EMAIL" && headers[7]=="SOCIAL_SHARE");
         }
      
      readCsvData(csvRecordsArray,rowLength){
          this.csvRecords = this.fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,rowLength);
          if(this.csvRecords.length>1){
              this.processCSVData();
          }else{
              this.showCsvFileError('You Cannot Upload Empty File');
          }
      }
      
      
      processCSVData(){
          this.validateCsvData();
          if(this.csvErrors.length>0){
              $( "#csv-error-div" ).show();
              setTimeout( function() { $( "#csv-error-div" ).hide( 500 ); }, 7000 );
              this.fileReset();
              this.isUploadCsv = false;
              this.isAddTeamMember = false;
          }else{
              this.appendCsvDataToTable();
              this.fileReset();
          }
      }
      
      showCsvFileError(message:string){
          this.showErrorMessageDiv(message);
          this.fileReset();
          this.isUploadCsv = false;
          this.isAddTeamMember = false;
      
      }
      
      validateCsvData(){
          let names = this.csvRecords.map(function(a) {return a[0].split(',')[0]});
          let duplicateEmailIds = this.referenceService.returnDuplicates(names);
          this.teamMembers = [];
          if(duplicateEmailIds.length==0){
              for(var i=1;i<this.csvRecords.length;i++){
                  let rows = this.csvRecords[i];
                   let row = rows[0].split(',');
                   let emailId = row[0];
                   this.emaillIdDivClass = this.defaultClass;
                   if(!this.referenceService.validateEmailId(emailId)){
                       this.csvErrors.push(emailId+" at row "+(i+1)+" is invalid.");
                   }else{
                       console.log(duplicateEmailIds);
                       /**********Method To Check Whether Org Admin Or Not***********/
                       if(this.orgAdminEmailIds.indexOf(emailId.toLowerCase())>-1){
                           this.csvErrors.push(emailId+" at row "+(i+1)+" is an Org Admin.");
                       }else{
                           /*******************Check If Already Added As A Team Member***************************/
                           if(this.existingEmailIds.indexOf(emailId.toLowerCase())>-1){
                               this.csvErrors.push(emailId+" at row "+(i+1)+" is already added as team member.");
                           }
                       }
                   }
               }
          }else{
              for(var d=0;d<duplicateEmailIds.length;d++){
                  this.csvErrors.push(duplicateEmailIds[d]+" is duplicate row.");
                  this.isUploadCsv = false;
                  this.isAddTeamMember = false;
              }
              
          }
      }

      fileReset(){
        this.fileImportInput.nativeElement.value = "";
        this.csvRecords = [];
      }
      
      setDefaultValue(value:any){
          if(value==1){
              return true;
          }else{
              return false;
          }
      }
      
      appendCsvDataToTable(){
          for(var i=1;i<this.csvRecords.length;i++){
              let rows = this.csvRecords[i];
              let row = rows[0].split(',');
              this.teamMemberUi.emptyTable = false;
              let teamMember = new TeamMember();
              teamMember.emailId = row[0];
              teamMember.all = this.setDefaultValue(row[1]);
              if(teamMember.all){
                  this.setAllRoles(teamMember);
              }else{
                  teamMember.video = this.setDefaultValue(row[2]);
                  teamMember.contact = this.setDefaultValue(row[3]);
                  teamMember.campaign   =this.setDefaultValue(row[4]);
                  teamMember.stats = this.setDefaultValue(row[5]);
                  teamMember.emailTemplate = this.setDefaultValue(row[6]);
                  teamMember.socialShare = this.setDefaultValue(row[7]);
              }
              this.teamMembers.push(teamMember);
          }
      }
      
      showAddTeamMember(){
         // this.isAddTeamMember = true;
          $( "#csv-error-div" ).hide();
          $('#addTeamMember').show();
      }
      clearForm(){
          this.emaillIdDivClass = this.defaultClass;
          $(".text-danger").text('');
          this.isAddTeamMember = false;
         // this.clearRows();
          this.closePopup();
      }
      closePopup(){
          $('#addTeamMember').hide();
          $('#add-team-member-form')[0].reset();
      }
}

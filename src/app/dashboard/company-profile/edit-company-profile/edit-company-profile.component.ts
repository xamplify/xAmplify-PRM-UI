import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {CompanyProfile} from '../models/company-profile';
import {CompanyProfileService} from '../services/company-profile.service';
import {noWhiteSpaceValidator } from '../../../form-validator';
import { ReferenceService } from '../../../core/services/reference.service';
import { ActivatedRoute,Router } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css']
})
export class EditCompanyProfileComponent implements OnInit {
    loggedInUserId: number = 0;
    companyProfile:CompanyProfile = new CompanyProfile();
    message:string = "";
    companyNames:string[]=[];
    companyProfileNames:string[] = [];
    isProcessing:boolean = false;
    companyNameDivClass:string;
    companyProfileNameDivClass:string;
    companyNameError:boolean=false;
    companyProfileNameError:boolean=false;
    companyNameErrorMessage:string = "";
    companyProfileNameErrorMessage:string = "";
    existingCompanyName:string = "";
    constructor( private logger: XtremandLogger, private authenticationService: AuthenticationService, private companyProfileService: CompanyProfileService,
        private fb: FormBuilder,public refService:ReferenceService,private router:Router) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.companyNameDivClass = this.refService.formGroupClass;
        this.companyProfileNameDivClass = this.refService.formGroupClass;

    }
    ngOnInit() {
        this.getCompanyProfileByUserId();
        if(this.authenticationService.user.hasCompany){
            this.companyProfile.isAdd = false;
        }
        this.getAllCompanyNames();
        this.getAllCompanyProfileNames();
        
    }
  
   
    save() {
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        if(this.companyProfile.companyName.trim().length==0){
            this.setCompanyNameError("Please Enter Company Name");
        }
        if(this.companyProfile.companyProfileName.trim().length==0){
            this.setCompanyProfileNameError("Please Enter Company Profile Name");
        }
        if(this.companyProfile.companyName.trim().length>0 && this.companyProfile.companyProfileName.trim().length>0){
            this.validateNames(this.companyProfile.companyName);
            this.validateProfileNames(this.companyProfile.companyProfileName);
            let errorLength = $('div.form-group.has-error.has-feedback').length;
            if(errorLength==0){
                 this.companyProfileService.save(this.companyProfile,this.loggedInUserId)
                .subscribe(
                data => {
                    this.message = data.message;
                    $('#info').hide();
                    $('#edit-sucess' ).show( 600 );
                    let self = this;
                    setTimeout(function(){
                        $('#saveOrUpdateCompanyButton').prop('disabled',true);
                        self.authenticationService.user.hasCompany = true;
                        self.router.navigate(["/home/dashboard/welcome"]);
                      }, 3000);
                   
                },
                error => { this.logger.errorPage( error ) },
                () => { this.logger.info( "Completed saveOrUpdate()" ) }
                ); 
            }
        }
      
       
    }
    
    update(){
        $('#edit-sucess').hide();
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        this.validateNames(this.companyProfile.companyName);
        let errorLength = $('div.form-group.has-error.has-feedback').length;
        if(errorLength==0){
             this.companyProfileService.update(this.companyProfile,this.loggedInUserId)
            .subscribe(
            data => {
                this.message = data.message;
                $('#info').hide();
                $('#edit-sucess').show( 600 );
                setTimeout( function() { $( "#edit-sucess" ).slideUp( 500 ); }, 5000 );
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed saveOrUpdate()" ) }
            ); 
        }
       
    }
    
    
    getCompanyProfileByUserId() {
        this.companyProfileService.getByUserId( this.loggedInUserId )
            .subscribe(
            data => {
               if(data.data!=undefined){
                   this.companyProfile = data.data;
                   this.existingCompanyName = data.data.companyName;
               }
                
            },
            error => { this.logger.errorPage( error ) },
            () => { this.logger.info( "Completed getCompanyProfileByUserId()" ) }
            );

    }
    
    getAllCompanyNames(){
        this.companyProfileService.getAllCompanyNames()
        .subscribe(
        response => {
            this.companyNames = response.data;
        },
        error => { this.logger.errorPage( error ) },
        () => { this.logger.info( "Completed getAllCompanyNames()" ) }
        );
    }
    
    getAllCompanyProfileNames(){
        this.companyProfileService.getAllCompanyProfileNames()
        .subscribe(
        response => {
            this.companyProfileNames = response.data;
        },
        error => { this.logger.errorPage( error ) },
        () => { this.logger.info( "Completed getAllCompanyProfileNames()" ) }
        );
    }
    
    validateNames(value:any){
        if(value.trim().length>0){
            value = value.trim().toLowerCase().replace(/\s/g,'');
            if(this.companyNames.indexOf(value)>-1){
                if(this.companyProfile.isAdd){
                  this.setCompanyNameError("Company Name Already Exists");
                }else{
                    if(this.existingCompanyName.trim().toLowerCase().replace(/\s/g,'')!=value){
                        this.setCompanyNameError("Company Name Already Exists");
                    }else{
                        this.removeCompanyNameError();
                    }
                }
                
            }else{
                this.removeCompanyNameError();
            }
        }
       
    }
    
    setCompanyNameError(message:string){
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        this.companyNameError = true;
        this.companyNameErrorMessage = message;
        this.companyNameDivClass = this.refService.errorClass;
    }
    
    removeCompanyNameError(){
        $('#saveOrUpdateCompanyButton').prop('disabled',false);
        this.companyNameError = false;
        this.companyNameDivClass = this.refService.successClass;
    }
    
    
    validateProfileNames(value:any){
        if(value.trim().length>0){
            let valueWithSpace = value.trim().toLowerCase();
            let valueWithOutSpaces = value.trim().toLowerCase().replace(/\s/g,'');
            if (/\s/.test(value)) {
                this.setCompanyProfileNameError("Spaces are not allowed");
            }else if(valueWithOutSpaces.length<3){
                this.setCompanyProfileNameError("Minimum 3 letters required");
            }
            else if(this.companyProfileNames.indexOf(valueWithOutSpaces)>-1){
                this.setCompanyProfileNameError("Company Profile Name Already Exists");
            }else{
                $('#saveOrUpdateCompanyButton').prop('disabled',false);
                this.companyProfileNameError = false;
                this.companyProfileNameDivClass = this.refService.successClass;
            }
        }
       
    }
    setCompanyProfileNameError(errorMessage:string){
        $('#saveOrUpdateCompanyButton').prop('disabled',true);
        this.companyProfileNameError = true;
        this.companyProfileNameErrorMessage = errorMessage;
        this.companyProfileNameDivClass = this.refService.errorClass;
    }
    
    
    validateEmptySpace(columnName:string){
        let value = $('#'+columnName).val().trim();
        if(value.length==0){
            $('#saveOrUpdateCompanyButton').prop('disabled',true);
           if(columnName=="companyName"){
               this.companyNameError = true;
               this.companyNameDivClass = this.refService.errorClass;
           }else if(columnName=="companyProfileName"){
               this.companyProfileNameError = true;
               this.companyProfileNameDivClass = this.refService.errorClass;
           }
        }else if(value.length>0){
            $('#saveOrUpdateCompanyButton').prop('disabled',false);
            if(columnName=="companyName"){
                this.companyNameError = false;
                this.companyNameDivClass = this.refService.successClass;
            }else if(columnName=="companyProfileName"){
                this.companyProfileNameError = false;
                this.companyProfileNameDivClass = this.refService.successClass;
            }
        }
        
    }
    

}

import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';

import { Pagination } from '../../core/models/pagination';
import { EmailTemplate } from '../models/email-template';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
declare var Metronic,$, Layout, Demo, swal, TableManaged: any;

@Component( {
    selector: 'app-manage-template',
    templateUrl: './manage-template.component.html',
    styleUrls: ['./manage-template.component.css', '../../../assets/css/video-css/ribbons.css'],
    providers: [Pagination,HttpRequestLoader]
})
export class ManageTemplateComponent implements OnInit,OnDestroy {
    isPreview = false;
    emailTemplate: EmailTemplate;
    emailPreview: string;
    emailTemplates: any[];
    hasEmailTemplateRole:boolean = false;
    hasAllAccess:boolean = false;
    pager: any = {};
    pagedItems: any[];
    public searchKey: string = "";
    isEmailTemplateDeleted:boolean = false;
    isCampaignEmailTemplate:boolean  = false;
    selectedEmailTemplateName:string = "";
    selectedTemplateTypeIndex:number = 0;
    templatesDropDown = [
        { 'name': 'All Email Templates', 'value': '' },
        { 'name': 'Uploaded Regular Templates', 'value': 'regularTemplate' },
        { 'name': 'Uploaded Video Templates', 'value': 'videoTemplate' },
        { 'name': 'Regular Templates', 'value': 'beeRegularTemplate' },
        { 'name': 'Video Templates', 'value': 'beeVideoTemplate' }

    ];

    sortByDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name(A-Z)', 'value': 'name-ASC' },
        { 'name': 'Name(Z-A)', 'value': 'name-DESC' },
        { 'name': 'Created Date(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date(DESC)', 'value': 'createdTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '10', 'value': '10' },
        { 'name': '20', 'value': '20' },
        { 'name': '30', 'value': '30' },
        { 'name': '40', 'value': '40' },
        { 'name': '50', 'value': '50' },
        { 'name': '---All---', 'value': '0' },
    ]

    public selectedTemplate: any = this.templatesDropDown[0];
    public selectedSortedOption: any = this.sortByDropDown[0];
    public itemsSize: any = this.numberOfItemsPerPage[0];
    public message:string;   
    loggedInUserId:number = 0;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
        
    constructor( private emailTemplateService: EmailTemplateService, private userService: UserService, private router: Router,
        private pagerService: PagerService, private refService: ReferenceService, 
        public pagination: Pagination,private authenticationService:AuthenticationService,private logger:XtremandLogger) {
        this.loggedInUserId = this.authenticationService.getUserId();
        if(refService.isCreated){
           this.message = "Template Created Successfully";
           this.showMessageOnTop();
        }else if(refService.isUpdated){
            this.message = "Template Updated Successfully";
            this.showMessageOnTop();
        }
        this.hasAllAccess = this.refService.hasAllAccess();
        this.hasEmailTemplateRole = this.refService.hasSelectedRole(this.refService.roles.emailTemplateRole);
    }
    showMessageOnTop(){
        $(window).scrollTop(0);
        setTimeout(function() { $("#templateCreationSuccessDiv").slideUp(500); }, 5000);
    }
    

    listEmailTemplates( pagination: Pagination ) {
            this.refService.loading(this.httpRequestLoader, true);
            this.pagination.maxResults = 12;
            this.emailTemplateService.listTemplates( pagination, this.loggedInUserId)
                .subscribe(
                ( data: any ) => {
                    this.emailTemplates = data.emailTemplates;
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, data.emailTemplates );
                    this.refService.loading(this.httpRequestLoader, false);
                },
                ( error: string ) => {
                    this.logger.errorPage(error);
                    this.refService.showServerError(this.httpRequestLoader);
                }
                );
    }

    setPage( page: number ) {
        try {
            this.pagination.pageIndex = page;
            this.listEmailTemplates( this.pagination );
        } catch ( error ) {
            this.refService.showError( error, "setPage", "ManageTemplatesComponent" )
        }
    }



    searchTemplates() {
        try {
            this.getAllFilteredResults( this.pagination );

        } catch ( error ) {
            this.refService.showError( error, "searchTemplates", "ManageTemplatesComponent" )
        }

    }

    getSelectedEmailTemplate( text: any ) {
        try {
            this.selectedTemplate = text;
            this.getAllFilteredResults( this.pagination );
        } catch ( error ) {
            this.refService.showError( error, "getSelectedEmailTemplate", "ManageTemplatesComponent" );
        }

    }


    getAllFilteredResults( pagination: Pagination ) {
        try {
            this.pagination.pageIndex = 1;
            this.pagination.searchKey = this.searchKey;
            this.pagination.filterBy = this.selectedTemplate.value;
            let sortedValue = this.selectedSortedOption.value;
            if ( sortedValue != "" ) {
                let options: string[] = sortedValue.split( "-" );
                this.pagination.sortcolumn = options[0];
                this.pagination.sortingOrder = options[1];
            }

            if ( this.itemsSize.value == 0 ) {
                this.pagination.maxResults = this.pagination.totalRecords;
            } else {
                this.pagination.maxResults = this.itemsSize.value;
            }
            this.listEmailTemplates( this.pagination );
        } catch ( error ) {
            this.logger.error(this.refService.errorPrepender+" getAllFilteredResults():"+error);
            this.refService.showServerError(this.httpRequestLoader);
        }
    }


    getSortedResult( text: any ) {
        try {
            this.selectedSortedOption = text;
            this.getAllFilteredResults( this.pagination );
        } catch ( error ) {
            this.refService.showError( error, "getSortedResult", "ManageTemplatesComponent" );
        }

    }

    getNumberOfItemsPerPage( items: any ) {
        try {
            this.itemsSize = items;
            this.getAllFilteredResults( this.pagination );
        } catch ( error ) {
            this.refService.showError( error, "getNumberOfItemsPerPage", "ManageTemplatesComponent" );
        }
    }
    edit( id: number ) {
        this.emailTemplateService.getById( id )
            .subscribe(
            ( data: EmailTemplate ) => {
                this.emailTemplateService.emailTemplate = data;
                if ( data.regularTemplate || data.videoTemplate ) {
                    this.router.navigate( ["/home/emailtemplates/update"] );
                } else {
                    this.router.navigate( ["/home/emailtemplates/create"] );
                }

            },
            ( error: string ) => {
                this.logger.error(this.refService.errorPrepender+" edit():"+error);
                this.refService.showServerError(this.httpRequestLoader);
            }
            );

    }


    ngOnInit() {
        try {
            Metronic.init();
            Layout.init();
            Demo.init();
            // TableManaged.init();
            this.listEmailTemplates( this.pagination );
        } catch ( error ) {
            this.refService.showError( error, "ngOnInit", "ManageTemplatesComponent" );
        }

    }



    confirmDeleteEmailTemplate( id: number,name:string ) {
        try {
            let self = this;
            swal( {
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'

            }).then( function() {
                self.deleteEmailTemplate( id,name );
            })
        } catch ( error ) {
            this.logger.error(this.refService.errorPrepender+" confirmDeleteEmailTemplate():"+error);
            this.refService.showServerError(this.httpRequestLoader);
        }

    }

    deleteEmailTemplate( id: number,name:string ) {
       this.refService.goToTop();
        this.isEmailTemplateDeleted = false;
        this.isCampaignEmailTemplate = false;
        this.emailTemplateService.delete( id )
            .subscribe(
            ( data: string ) => {
                if(data=="Success"){
                    document.getElementById( 'emailTemplateListDiv_' + id ).remove();
                    this.refService.showInfo( "Email Template Deleted Successfully", "" );
                    this.selectedEmailTemplateName = name;
                    this.isEmailTemplateDeleted = true;
                    this.isCampaignEmailTemplate = false;
                    setTimeout( function() { $( "#emailTemplateDeleteId" ).slideUp( 500 ); }, 2000 );
                    this.pagination.pageIndex = this.pagination.pageIndex-1;
                    this.listEmailTemplates(this.pagination);
                }else{
                    this.isEmailTemplateDeleted = false;
                    this.isCampaignEmailTemplate = true;
                    setTimeout( function() { $( "#campaignEmailTemplateId" ).slideUp( 500 ); }, 2000 );
                }
                
            },
            ( error: string ) => { 
                this.logger.errorPage(error);
                this.refService.showServerError(this.httpRequestLoader); 
                }
            );
    }

    filterTemplates(type:string,isVideoTemplate:boolean,index:number){
        if(type=="BASIC"){
            this.pagination.emailTemplateType =EmailTemplateType.BASIC;
        }else if(type=="NONE"){
            this.pagination.emailTemplateType =EmailTemplateType.NONE;
        }else if(type=="RICH"){
            this.pagination.emailTemplateType =EmailTemplateType.RICH;
        }else if(type=="UPLOADED"){
            this.pagination.emailTemplateType =EmailTemplateType.UPLOADED;
        }else if(type=="PARTNER"){
            this.pagination.emailTemplateType = EmailTemplateType.PARTNER;
        }
       
        this.selectedTemplateTypeIndex = index;//This is to highlight the tab
        this.pagination.pageIndex = 1;
        if(isVideoTemplate){
            this.pagination.filterBy = "VideoEmail";
        }else{
            this.pagination.filterBy = "RegularEmail";
        }
        this.listEmailTemplates(this.pagination);
    }

    
    ngOnDestroy() {
        this.refService.isCreated = false;
        this.refService.isUpdated = false;
        this.message = "";
        swal.close();
        
    }
    showPreview(emailTemplate:EmailTemplate){
       console.log(emailTemplate);
        let body = emailTemplate.body;
        let emailTemplateName = emailTemplate.name;
        if(emailTemplateName.length>50){
            emailTemplateName = emailTemplateName.substring(0, 50)+"...";
        }
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplateName);
        $('#email-template-title').prop('title',emailTemplate.name);
        $("#htmlContent").append(body);
        $('.modal .modal-body').css('overflow-y', 'auto'); 
       // $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#show_email_template_preivew").modal('show');
    }
   
}

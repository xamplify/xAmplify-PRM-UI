import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { EmailTemplateService } from '../services/email-template.service';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService } from '../../core/services/reference.service';

import { Pagination } from '../../core/models/pagination';
import { EmailTemplate } from '../models/email-template';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { CampaignAccess } from 'app/campaigns/models/campaign-access';

declare var $, swal: any;

@Component( {
    selector: 'app-manage-template',
    templateUrl: './manage-template.component.html',
    styleUrls: ['./manage-template.component.css', '../../../assets/css/video-css/ribbons.css'],
    providers: [Pagination,HttpRequestLoader, ActionsDescription, CampaignAccess]
})
export class ManageTemplateComponent implements OnInit,OnDestroy {
    isPreview = false;
    emailTemplate: EmailTemplate;
    emailPreview: string;
    hasEmailTemplateRole = false;
    hasAllAccess = false;
    pager: any = {};
    pagedItems: any[];
    searchKey = "";
    isEmailTemplateDeleted = false;
    isCampaignEmailTemplate  = false;
    selectedEmailTemplateName = "";
    selectedTemplateTypeIndex = 0;
    isOnlyPartner = false;
    isPartnerToo = false;
    templatesDropDown = [
        { 'name': 'All Email Templates', 'value': '' },
        { 'name': 'Uploaded Regular Templates', 'value': 'regularTemplate' },
        { 'name': 'Uploaded Video Templates', 'value': 'videoTemplate' },
        { 'name': 'Regular Templates', 'value': 'beeRegularTemplate' },
        { 'name': 'Video Templates', 'value': 'beeVideoTemplate' }
    ];

    sortByDropDown = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Name (A-Z)', 'value': 'name-ASC' },
        { 'name': 'Name (Z-A)', 'value': 'name-DESC' },
        // { 'name': 'Company Name (A-Z)', 'value': 'company-ASC' },
        // { 'name': 'Company Name (Z-A)', 'value': 'company-DESC' },
        { 'name': 'Created Date (ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Date (DESC)', 'value': 'createdTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': 'All', 'value': '0' },
    ]

    selectedTemplate: any = this.templatesDropDown[0];
    selectedSortedOption: any = this.sortByDropDown[this.sortByDropDown.length-1];
    itemsSize: any = this.numberOfItemsPerPage[0];
    message:string;
    loggedInUserId:number = 0;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    isListView: boolean = false;
    constructor( private emailTemplateService: EmailTemplateService, private router: Router,
        private pagerService: PagerService, public refService: ReferenceService, public actionsDescription: ActionsDescription,
        public pagination: Pagination,public authenticationService:AuthenticationService,private logger:XtremandLogger, public campaignAccess:CampaignAccess) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.isPartnerToo = this.authenticationService.checkIsPartnerToo();
        if(refService.isCreated){
           this.message = "Template created successfully";
           this.showMessageOnTop(this.message);
        }else if(refService.isUpdated){
            this.message = "Template updated successfully";
            this.showMessageOnTop(this.message);
        }
        this.hasAllAccess = this.refService.hasAllAccess();
        this.hasEmailTemplateRole = this.refService.hasSelectedRole(this.refService.roles.emailTemplateRole);
        this.isOnlyPartner = this.authenticationService.isOnlyPartner()
    }
    showMessageOnTop(message){
        $(window).scrollTop(0);
        this.customResponse = new CustomResponse( 'SUCCESS', message, true );
    }


    listEmailTemplates( pagination: Pagination ) {
        this.refService.loading(this.httpRequestLoader, true);
        pagination.searchKey = this.searchKey;
            this.emailTemplateService.listTemplates( pagination, this.loggedInUserId)
                .subscribe(
                ( data: any ) => {
                    pagination.totalRecords = data.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, data.emailTemplates );
                    console.log(pagination)
                    this.refService.loading(this.httpRequestLoader, false);
                },
                ( error: string ) => {
                    this.logger.errorPage(error);
                }
                );
    }

    setPage( event:any ) {
        try {
            this.pagination.pageIndex = event.page;
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
                if(!data.marketoTemplate){
                    if ( data.regularTemplate || data.videoTemplate ) {
                        this.router.navigate( ["/home/emailtemplates/update"] );
                    } else {
                        this.router.navigate( ["/home/emailtemplates/create"] );
                    }
                }else {
                    this.router.navigate( ["/home/emailtemplates/marketo/update"] );
                }

            },
            ( error: string ) => {
                this.logger.error(this.refService.errorPrepender+" edit():"+error);
                this.refService.showServerError(this.httpRequestLoader);
            }
            );

    }

    eventHandler(keyCode: any) {  if (keyCode === 13) {  this.searchTemplates(); } }
    getOrgCampaignTypes(){
      this.refService.getOrgCampaignTypes( this.refService.companyId).subscribe(
      data=>{
        console.log(data);
        this.campaignAccess.videoCampaign = data.video;
        this.campaignAccess.emailCampaign = data.regular;
        this.campaignAccess.socialCampaign = data.social;
        this.campaignAccess.eventCampaign = data.event
      });
    }
    getCompanyIdByUserId(){
      try {
        this.refService.getCompanyIdByUserId(this.authenticationService.user.id).subscribe(
          (result: any) => {
            if (result !== "") {
              console.log(result);
              this.refService.companyId = result;
              this.getOrgCampaignTypes();
            }
          }, (error: any) => { console.log(error); }
        );
      } catch (error) { console.log(error);  }
     }
    ngOnInit() {
      this.selectedSortedOption =  this.sortByDropDown[0];
        try {
           if(!this.refService.companyId){ this.getCompanyIdByUserId()} else { this.getOrgCampaignTypes();}
            this.isListView = ! this.refService.isGridView;
            this.pagination.maxResults = 12;
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
                text: "You won’t be able to undo this action!",
                type: 'warning',
                showCancelButton: true,
                swalConfirmButtonColor: '#54a7e9',
                swalCancelButtonColor: '#999',
                confirmButtonText: 'Yes, delete it!'

            }).then( function() {
                self.deleteEmailTemplate( id,name );
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        } catch ( error ) {
            this.logger.error(this.refService.errorPrepender+" confirmDeleteEmailTemplate():"+error);
            this.refService.showServerError(this.httpRequestLoader);
        }

    }

    deleteEmailTemplate( id: number,name:string ) {
      this.refService.loading(this.httpRequestLoader, true);
       this.refService.goToTop();
        this.isEmailTemplateDeleted = false;
        this.isCampaignEmailTemplate = false;
        this.emailTemplateService.delete( id )
            .subscribe(
            ( data: string ) => {
                if(data=="Success"){
                    document.getElementById( 'emailTemplateListDiv_' + id ).remove();
                    this.refService.showInfo( "Email Template Deleted Successfully", "" );
                    this.selectedEmailTemplateName =  name+ ' deleted successfully';
                    this.customResponse = new CustomResponse('SUCCESS',this.selectedEmailTemplateName,true );
                    this.isEmailTemplateDeleted = true;
                    this.isCampaignEmailTemplate = false;
                    this.pagination.pageIndex = 1;
                    this.listEmailTemplates(this.pagination);
                }else{
                    this.isEmailTemplateDeleted = false;
                    this.isCampaignEmailTemplate = true;
                    let result = data.split(",");
                    let campaignNames = "";
                    $.each(result,function(index,value){
                        campaignNames+= (index+1)+"."+value+"<br><br>";
                    });
                    let message = "Please delete associated campaign(s)<br><br>"+campaignNames;
                    this.customResponse = new CustomResponse('ERROR',message,true );
                    this.refService.loading(this.httpRequestLoader, false);
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
        }else if(type=="REGULAR_CO_BRANDING"){
            this.pagination.emailTemplateType = EmailTemplateType.REGULAR_CO_BRANDING;
        }else if(type=="VIDEO_CO_BRANDING"){
            this.pagination.emailTemplateType = EmailTemplateType.VIDEO_CO_BRANDING;
        }else if(type=="EVENT_CO_BRANDING"){
        this.pagination.emailTemplateType = EmailTemplateType.EVENT_CO_BRANDING;
        }
        this.selectedTemplateTypeIndex = index;//This is to highlight the tab
        this.pagination.pageIndex = 1;
        if(isVideoTemplate){
            this.pagination.filterBy = "VideoEmail";
        }else if(!isVideoTemplate && this.selectedTemplateTypeIndex ==9) {
          this.pagination.filterBy = 'EventEmail';
        } else if(!isVideoTemplate){
            this.pagination.filterBy = "RegularEmail";
        }
        this.listEmailTemplates(this.pagination);
    }


    ngOnDestroy() {
        this.refService.isCreated = false;
        this.refService.isUpdated = false;
        this.message = "";
        $('#show_email_template_preivew').modal('hide');
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

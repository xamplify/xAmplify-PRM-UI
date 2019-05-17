import { Component, OnInit, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import {FormService} from '../services/form.service';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { Form } from '../models/form';
import { UtilService } from '../../core/services/util.service';
import {Inject} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
import { environment } from '../../../environments/environment';

declare var swal, $: any;

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.css','../add-form/add-form.component.css','../preview/form-preview.component.css'],
  providers: [Pagination, HttpRequestLoader,ActionsDescription]
})
export class ManageFormComponent implements OnInit, OnDestroy {
    form:Form = new Form();
    ngxloading = false;
    pagination: Pagination = new Pagination();
    searchKey = "";
    loggedInUserId = 0;
    customResponse: CustomResponse = new CustomResponse();
    copiedLinkCustomResponse: CustomResponse = new CustomResponse();
    isListView = false;
    private dom: Document;
    clientUrl = environment.CLIENT_URL;

    sortByDropDown = [
        { 'name': 'Name (A-Z)', 'value': 'name-ASC' },
        { 'name': 'Name (Z-A)', 'value': 'name-DESC' },
        { 'name': 'Created On (ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created On (DESC)', 'value': 'createdTime-DESC' },
        { 'name': 'Updated On (ASC)', 'value': 'updatedTime-ASC' },
        { 'name': 'Updated On (DESC)', 'value': 'updatedTime-DESC' }
    ];

    numberOfItemsPerPage = [
        { 'name': '12', 'value': '12' },
        { 'name': '24', 'value': '24' },
        { 'name': '48', 'value': '48' },
        { 'name': 'All', 'value': '0' },
    ]
    selectedSortedOption: any = this.sortByDropDown[3];
    itemsSize: any = this.numberOfItemsPerPage[0];
    message = "";

    constructor( public referenceService: ReferenceService,
        public httpRequestLoader: HttpRequestLoader, public pagerService:
            PagerService, public authenticationService: AuthenticationService,
        public router: Router, public formService: FormService, public logger: XtremandLogger,
        public actionsDescription: ActionsDescription ) {
        this.loggedInUserId = this.authenticationService.getUserId();
        this.pagination.userId = this.loggedInUserId;
          
        if ( this.referenceService.isCreated ) {
            this.message = "Form created successfully";
            this.showMessageOnTop( this.message );
        } else if ( this.referenceService.isUpdated ) {
            this.message = "Form updated successfully";
            this.showMessageOnTop( this.message );
        }

    }

    ngOnInit() {
        this.listForms( this.pagination );
    }


    listForms( pagination: Pagination ) {
        pagination.searchKey = this.searchKey;
        this.referenceService.loading( this.httpRequestLoader, true );
        this.formService.list( pagination ).subscribe(
            ( response: any ) => {
                const data = response.data;
                pagination.totalRecords = data.totalRecords;
                pagination = this.pagerService.getPagedItems( pagination, data.forms );
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: any ) => { this.logger.errorPage( error ); } );
    }


    /*************************Sort********************** */
    getSortedResult( text: any ) {
        this.selectedSortedOption = text;
        this.getAllFilteredResults( this.pagination );
    }


    /*************************Search********************** */
    searchForms() {
        this.getAllFilteredResults( this.pagination );
    }

    /************Page************** */
    setPage( event: any ) {
        this.pagination.pageIndex = event.page;
        this.listForms( this.pagination );
    }

    getAllFilteredResults( pagination: Pagination ) {
        this.pagination.pageIndex = 1;
        this.pagination.searchKey = this.searchKey;
        const sortedValue = this.selectedSortedOption.value;
        if ( sortedValue !== "" ) {
            const options: string[] = sortedValue.split( "-" );
            this.pagination.sortcolumn = options[0];
            this.pagination.sortingOrder = options[1];
        }

        if ( this.itemsSize.value == 0 ) {
            this.pagination.maxResults = this.pagination.totalRecords;
        } else {
            this.pagination.maxResults = this.itemsSize.value;
        }
        this.pagination.pagedItems.length = 0;
        this.listForms( this.pagination );
    }

    eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.searchForms(); } }


    showMessageOnTop( message ) {
        $( window ).scrollTop( 0 );
        this.customResponse = new CustomResponse( 'SUCCESS', message, true );
    }
    
    /***********Delete**************/
    confirmDelete(form:Form){
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
                self.deleteById(form);
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        } catch ( error ) {
            this.logger.error(this.referenceService.errorPrepender+" confirmDelete():"+error);
            this.referenceService.showServerError(this.httpRequestLoader);
        }
    }
    
    deleteById(form:Form){
        this.referenceService.loading(this.httpRequestLoader, true);
        this.referenceService.goToTop();
        this.formService.delete( form.id )
        .subscribe(
        ( data: any ) => {
            if(data.message=="success"){
                document.getElementById( 'formListDiv_' + form.id ).remove();
                this.referenceService.showInfo( "Form Deleted Successfully", "" );
                const message =  form.name+ ' deleted successfully';
                this.customResponse = new CustomResponse('SUCCESS',message,true );
                this.pagination.pageIndex = 1;
                this.listForms(this.pagination);
            }else{}

        },
        ( error: string ) => {
            this.logger.errorPage(error);
            this.referenceService.showServerError(this.httpRequestLoader);
            }
        );
    }

    /*****************Preview Form*******************/
    preview(id:number){
        this.ngxloading = true;
        this.formService.getById( id )
        .subscribe(
        ( data: any ) => {
            this.ngxloading = false;
            if(data.statusCode===200){
                this.form = data.data;
                $('#form-preview-modal').modal('show');
            }else{
                swal("Please Contact Admin!", data.message, "error");
            }
           
        },
        ( error: string ) => {
            this.logger.errorPage(error);
            this.referenceService.showServerError(this.httpRequestLoader);
            }
        );
    }
    
    
    edit(id:number){
        this.formService.getById( id )
        .subscribe(
        ( data: any ) => {
            this.ngxloading = false;
            if(data.statusCode===200){
                this.formService.form = data.data;
                this.router.navigate(["/home/forms/edit"]);
            }else{
                swal("Please Contact Admin!", data.message, "error");
            }
        },
        ( error: string ) => {
            this.logger.errorPage(error);
            this.referenceService.showServerError(this.httpRequestLoader);
            }
        );
    }
    
    /*********Copy The Link */
    copyInputMessage(inputElement){
        this.copiedLinkCustomResponse = new CustomResponse();
        inputElement.select();
        document.execCommand('copy');
        inputElement.setSelectionRange(0, 0);
        this.copiedLinkCustomResponse = new CustomResponse('SUCCESS','Copied to clipboard successfully.',true );  

      }

      showFormUrl(form:Form){
          this.form = form;
          this.copiedLinkCustomResponse = new CustomResponse();
          $('#form-url-modal').modal('show');
      }

    
    
    /**************Edit Form***********/
    ngOnDestroy() {
        this.referenceService.isCreated = false;
        this.referenceService.isUpdated = false;
        this.message = "";
        this.form = new Form();
        $( '#form-preview-modal' ).modal( 'hide' );
        swal.close();

    }

}

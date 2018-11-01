import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../core/services/reference.service';
import { Pagination } from '../core/models/pagination';
import { HttpRequestLoader } from '../core/models/http-request-loader';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';
import { CustomResponse } from '../common/models/custom-response';
import { ActionsDescription } from '../common/models/actions-description';
import { AuthenticationService } from '../core/services/authentication.service';
import { SocialPagerService } from '../contacts/services/social-pager.service';

import { EmailTemplateService } from '../email-template/services/email-template.service';
import { ContentManagement } from './model/content-management';

declare var Metronic, $, Layout, Demo, swal: any;

@Component( {
    selector: 'app-content-management',
    templateUrl: './content-management.component.html',
    styleUrls: ['../../assets/css/button.css','./content-management.component.css'],
    providers: [Pagination, HttpRequestLoader, ActionsDescription, ContentManagement, SocialPagerService]
})
export class ContentManagementComponent implements OnInit {
    loggedInUserId: number = 0;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    list: any[] = [];
    isPreviewed: boolean = false;
    filePath: string = "";
    previewFile: any = "";
    exisitingFileNames: string[] = [];
    existingFileName: string = "";
    awsFileKeys: string[] = [];
    pager: any = {};
    pagedItems: any[];
    pageSize: number = 12;
    selectedFiles = [];
    selectedFileIds = [];
    loader = false;
    loaderWidth: number = 30;
    searchTitle: any;
    searchList: any;
    sortList: any;
    paginatedList: any;

    sortOptions = [
                   { 'name': 'Sort By', 'value': ''},
                   { 'name': 'File Name(A-Z)', 'value': 'fileName'},
                   { 'name': 'File Name(Z-A)', 'value': 'fileName'},
                   { 'name': 'Upload Date(ASD)', 'value': 'lastModifiedDate'},
                   { 'name': 'Upload Date(DSD)', 'value': 'lastModifiedDate'},
    ];
    sortOption: any = this.sortOptions[0];

    constructor( private router: Router,public referenceService: ReferenceService,
        public actionsDescription: ActionsDescription, public pagination: Pagination, public socialPagerService: SocialPagerService,
        public authenticationService: AuthenticationService, private logger: XtremandLogger,
        private emailTemplateService: EmailTemplateService, private contentManagement: ContentManagement ) {
        this.loggedInUserId = this.authenticationService.getUserId();
        if(this.referenceService.contentManagementLoader){
           this.customResponse = new CustomResponse( 'SUCCESS', 'File(s) processed successfully.', true );
           this.referenceService.contentManagementLoader = false;
        }
    }

    sortByOption( event: any) {
        try {
            this.sortOption = event;
            if ( event.name == "Upload Date(ASD)" ) {
                this.sortList = this.list.sort(( a, b ) => new Date( b.lastModifiedDate ).getTime() - new Date( a.lastModifiedDate ).getTime() );
            } else if ( event.name == "Upload Date(DSD)" ) {
                this.sortList = this.list.sort(( a, b ) =>  new Date( a.lastModifiedDate ).getTime() - new Date( b.lastModifiedDate ).getTime() );
            }  else if ( event.name == "File Name(A-Z)" ) {
                this.sortList = this.list.sort((a,b)=> {return a.fileName.localeCompare(b.fileName)});
            } else if ( event.name == "File Name(Z-A)" ) {
                this.sortList = this.list.sort((a,b)=> {return b.fileName.localeCompare(a.fileName)});
            }

            this.paginatedList = this.sortList;
            this.setPage( 1 );

        } catch ( error ) {
            console.error( error, "contentManagement", "sorting()" );
        }
    }

    imageClick(){
        $('#uploadFile').click();
    }

    searchFile(){
        this.searchList = this.list.filter(o => o.fileName.includes(this.searchTitle));
        this.paginatedList = this.searchList;
        this.setPage( 1 );
    }


    setPage( page: number ) {
        try {
            if ( page < 1 || page > this.pager.totalPages ) {
                return;
            }
            this.pager = this.socialPagerService.getPager( this.paginatedList.length, page, this.pageSize );
            this.pagedItems = this.paginatedList.slice( this.pager.startIndex, this.pager.endIndex + 1 );

        } catch ( error ) {
            console.error( error, "content management setPage()." )
        }

    }

    getSelectedFiles( file: any, id: any, event: any ) {
        let isChecked = $( '#grid_' + id ).is( ':checked' );
        if ( isChecked ) {
            this.selectedFiles.push( file );
            this.selectedFileIds.push( id );
        } else {
            for ( let i = 0; i <= this.selectedFileIds.length; i++ ) {
                if ( id === this.selectedFileIds[i] ) {
                    this.selectedFiles.slice( file );
                    this.selectedFileIds.splice( $.inArray( id, this.selectedFileIds ), 1 );
                    this.selectedFiles.splice( $.inArray( id, this.selectedFiles ), 1 );
                }
            }
        }
    }

    getSelectedListViewFiles( file: any, id: any, event: any ) {
        let isChecked = $( '#list_' + id ).is( ':checked' );
        if ( isChecked ) {
            this.selectedFiles.push( file );
            this.selectedFileIds.push( id );
        } else {
            for ( let i = 0; i <= this.selectedFileIds.length; i++ ) {
                if ( id === this.selectedFileIds[i] ) {
                    this.selectedFiles.slice( file );
                    this.selectedFileIds.splice( $.inArray( id, this.selectedFileIds ), 1 );
                    this.selectedFiles.splice( $.inArray( id, this.selectedFiles ), 1 );
                }
            }
        }
    }

    checkListViewCheckboxes(){
        return null;
    }

    /**************List Items************************/
    listItems( pagination: Pagination ) {
        this.referenceService.loading( this.httpRequestLoader, true );
        this.emailTemplateService.listAwsFiles( pagination, this.loggedInUserId )
            .subscribe(
            ( data: any ) => {

                for(var i=0;i< data.length; i++){
                    data[i]["id"] = i;
                }


               this.list = data;
               this.searchList = data;
               this.sortList = data;
                if ( this.list.length > 0 ) {
                    this.exisitingFileNames = this.list.map( function( a ) { return a.fileName.toLowerCase(); });
                } else {
                    this.customResponse = new CustomResponse( 'INFO', "No records found", true );
                }
                this.referenceService.loading( this.httpRequestLoader, false );
                this.paginatedList = this.list;
                this.setPage( 1 );

            },
            ( error: string ) => {
                this.logger.errorPage( error );
            }
            );
    }

    /******Preview*****************/
    preview( file: any ) {
        this.isPreviewed = true;
        this.previewFile = file;
    }
    hidePreview() {
        this.isPreviewed = false;
    }
    /************Delete******/
    delete( file: ContentManagement ) {
        let self = this;
        swal( {
            title: 'Are you sure?',
            text: "You won't be able to undo this action",
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'
        }).then( function() {
            if ( self.selectedFileIds.length < 1 ) {
                self.contentManagement = file;
                self.deleteFile( self.contentManagement );
            } else {
                self.deleteFile( self.contentManagement );
            }
        }, function( dismiss: any ) {
            console.log( 'you clicked on option' + dismiss );
        });
    }


    deleteFile( file: ContentManagement ) {
        this.customResponse.isVisible = false;
        if ( this.selectedFileIds.length < 1 ) {
            this.awsFileKeys.push( file.fileName );
        } else {
            for ( let i = 0; i < this.selectedFileIds.length; i++ ) {
                if ( this.selectedFiles[i].fileName ) {
                    this.awsFileKeys.push( this.selectedFiles[i].fileName );
                }
            }

        }
        this.referenceService.loading( this.httpRequestLoader, true );
        file.userId = this.loggedInUserId;
        file.awsFileKeys = this.awsFileKeys;
        this.emailTemplateService.deleteFile( file )
            .subscribe(
            data => {
                const deleteMessage = file.fileName + ' deleted successfully';
                this.customResponse = new CustomResponse( 'SUCCESS', deleteMessage, true );
                this.listItems( this.pagination );
                if ( this.selectedFileIds ) {
                    this.selectedFileIds.length = 0;
                    this.selectedFiles.length = 0;
                }
            },
            ( error: string ) => {
                this.logger.errorPage( error );
            }
            );
    }

    /********Upload File******/
    upload( event: any ) {
        this.customResponse.isVisible = false;
        try {
            this.referenceService.loading( this.httpRequestLoader, true );
            //this.customResponse = new CustomResponse( 'INFO', "Uploading in progress.Please wait...", true );
            this.loader = true;
            this.loaderWidth = 60;
            let files: Array<File>;
            if ( event.target.files ) {
                files = event.target.files;
            }
            else if ( event.dataTransfer.files ) {
                files = event.dataTransfer.files;
            }
            const formData: FormData = new FormData();
            $.each( files, function( index, file ) {
                formData.append( 'files', file, file.name );
            });
            this.uploadToServer( formData );
            this.loaderWidth= 99;
        } catch ( error ) {
            this.referenceService.loading( this.httpRequestLoader, false );
            this.customResponse = new CustomResponse( 'ERROR', "Unable to upload file", true );
        }

    }


    uploadToServer( formData: FormData ) {
       this.loaderWidth = 91;
        this.emailTemplateService.uploadFile( this.loggedInUserId, formData )
            .subscribe(
            data => {
                if ( data.statusCode == 1020 ) {
                   this.loader = false;
                    const message = ' files uploaded successfully';
                    this.customResponse = new CustomResponse( 'SUCCESS', message, true );
                    this.listItems( this.pagination );
                } else {
                    let message = data.message;
                    this.customResponse = new CustomResponse( 'ERROR', message, true );
                }
                this.referenceService.loading( this.httpRequestLoader, false );
            },
            ( error: string ) => {
                this.logger.errorPage( error );
            }
            );
    }
    /*******Validate Existing filename**********/

    ngOnInit() {
        this.listItems( this.pagination );

    }

}

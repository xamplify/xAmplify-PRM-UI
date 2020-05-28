import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { CustomResponse } from '../../common/models/custom-response';
import { ActionsDescription } from '../../common/models/actions-description';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SocialPagerService } from '../../contacts/services/social-pager.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { ContentManagement } from '../models/content-management';
declare var $, swal:any;

@Component({
  selector: 'app-content-manage',
  templateUrl: './content-manage.component.html',
  styleUrls: ['../../../assets/css/button.css','./content-manage.component.css'],
  providers: [Pagination, HttpRequestLoader, ActionsDescription, ContentManagement, SocialPagerService]
})
export class ContentManageComponent implements OnInit {
  loggedInUserId = 0;
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  customResponse: CustomResponse = new CustomResponse();
  list: any[] = [];
  isPreviewed = false;
  filePath = "";
  previewFile: any = "";
  exisitingFileNames: string[] = [];
  existingFileName = "";
  awsFileKeys: string[] = [];
  pager: any = {};
  pagedItems: any[];
  pageSize = 12;
  selectedFiles = [];
  selectedFileIds = [];
  loader = false;
  loaderWidth = 30;
  searchTitle = '';
  searchList: any;
  sortList: any;
  paginatedList: any;
  isListView = false;
  sortOptions = [{ 'name': 'Sort By', 'value': ''},  { 'name': 'File Name (A-Z)', 'value': 'fileName'},
                 { 'name': 'File Name (Z-A)', 'value': 'fileName'},  { 'name': 'Upload Date (ASC)', 'value': 'lastModifiedDate'},
                 { 'name': 'Upload Date (DESC)', 'value': 'lastModifiedDate'},
    ];
  sortOption: any = this.sortOptions[0];
  pageNumber: any;
  numberPerPage = [{ 'name': '12', 'value': 12 }, { 'name': '24', 'value': 24 }, { 'name': '48', 'value': 48 },
  { 'name': 'All', 'value': 0 }];

  constructor(public referenceService: ReferenceService,
      public actionsDescription: ActionsDescription, public pagination: Pagination, public socialPagerService: SocialPagerService,
      public authenticationService: AuthenticationService, private logger: XtremandLogger,
      private emailTemplateService: EmailTemplateService, private contentManagement: ContentManagement ) {
      this.loggedInUserId = this.authenticationService.getUserId();
      this.isListView = "LIST" ==localStorage.getItem('defaultDisplayType');
      
      if(this.referenceService.contentManagementLoader){
         this.customResponse = new CustomResponse( 'SUCCESS', 'File(s) processed successfully.', true );
         this.referenceService.contentManagementLoader = false;
      }
      this.pageNumber = this.numberPerPage[0];
  }

  sortByOption( event: any) {
      this.referenceService.loading( this.httpRequestLoader, true );
      try {
          this.sortOption = event;
          if ( event.name.includes('DESC')) {
              this.sortList = this.list.sort(( a, b ) => new Date( b.lastModifiedDate ).getTime() - new Date( a.lastModifiedDate ).getTime() );
          } else if ( event.name.includes('ASC')) {
              this.sortList = this.list.sort(( a, b ) =>  new Date( a.lastModifiedDate ).getTime() - new Date( b.lastModifiedDate ).getTime() );
          }  else if ( event.name.includes('A-Z')) {
              this.sortList = this.list.sort((a,b)=> {return a.fileName.localeCompare(b.fileName)});
          } else if ( event.name.includes('Z-A')) {
              this.sortList = this.list.sort((a,b)=> {return b.fileName.localeCompare(a.fileName)});
          }
          this.referenceService.loading( this.httpRequestLoader, false );
          this.paginatedList = this.sortList;
          this.setPage( 1 );

      } catch ( error ) {
          console.error( error, "contentManagement", "sorting()" );
      }
  }
  addImage(filePath: any) {
        const parts = filePath.split('.');
        const ext = parts[parts.length - 1];
        switch (ext.toLowerCase()) {
            case 'csv': return 'assets/images/content/csv.png';
            case 'cvs': return 'assets/images/content/cvs.png';
            case 'gif': return 'assets/images/content/gif.png';
            case 'html':return 'assets/images/content/html.png';
            case 'doc':return 'assets/images/content/docs.png';
            case 'pdf':return 'assets/images/content/pdfs.png';
            case 'ppt':return 'assets/images/content/ppt.png';
            case 'pct':return 'assets/images/content/pct.png';
            case 'pptx':return 'assets/images/content/pptx.png';
            case 'txt':return 'assets/images/content/text.png';
            case 'xls':return 'assets/images/content/xls.png';
            case 'xlsx':return 'assets/images/content/xlsm.png';
            case 'xlsm':return 'assets/images/content/xlsm.png';
            case 'xml':return 'assets/images/content/xml.png';
            case 'zip':return 'assets/images/content/zip.png';
            case 'docx':return 'assets/images/content/docs.png';
            case 'docm':return 'assets/images/content/docs.png';
            case 'dotm':return 'assets/images/content/docs.png';
            case 'dotx':return 'assets/images/content/docs.png';
            case 'dot':return 'assets/images/content/docs.png';
            case 'xps':return 'assets/images/content/xps.jpg';
            case 'rtf':return 'assets/images/content/rtf.png';
            case 'odt':return 'assets/images/content/odt.png';
            case 'wps':return 'assets/images/content/wps.png';
            case 'htm':return 'assets/images/content/htm.png';
            case 'mht':return 'assets/images/content/mht.jpg';
            case 'log':return 'assets/images/content/log.png';
            case 'mp3':return 'assets/images/content/mp3.png';
            case 'mhtml':return 'assets/images/content/mhtml.png';
            case 'rar':return 'assets/images/content/rar.png';
            case 'apk':return 'assets/images/content/apk.png';
            default: return 'assets/images/content/error.png';
        }
}
  changeImage(id:number,path:string){
    let image = this.addImage(path);
    (<HTMLInputElement>document.getElementById('content_image_'+id)).src = image;
    (<HTMLInputElement>document.getElementById('content_image_grid_'+id)).src = image;
    $('#content_image_'+id).css('cssText', "max-height: 55%; max-width: 69px; position: relative; top: 16px;");
    $('#content_image_grid_'+id).css('cssText', "border: 0px solid #5a5a5a; max-height: 27% !important");
  }
  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.searchFile(); } }
  searchFile(){
      if(this.searchTitle.replace(/\s+/g, '')===""){
        this.referenceService.loading( this.httpRequestLoader, true );
        setTimeout(() => {this.referenceService.loading( this.httpRequestLoader, false ); }, 1000);
        const paginatedList = this.list;
        this.paginatedList = paginatedList;
        this.pager.totalPages = undefined;
        this.setPage(1);
       } else if(this.searchTitle){
        this.referenceService.loading( this.httpRequestLoader, true );
        setTimeout(() => {this.referenceService.loading( this.httpRequestLoader, false ); }, 1000);
         this.searchList = [];
        for(let i=0; i< this.list.length;i++){
          if(this.list[i].fileName.toLowerCase().includes(this.searchTitle.toLowerCase()) ){  this.searchList.push(this.list[i]);  }
        }
      this.paginatedList = this.searchList;
      this.pagination = new Pagination();
      this.pager.totalPages = undefined;
      this.setPage( 1 ); } else { }
  }
  setPage( page: number ) {
      try {
          if ( page < 1 || page > this.pager.totalPages ) { return; }
          this.pager = this.socialPagerService.getPager( this.paginatedList.length, page, this.pageSize );
          this.pagedItems = this.paginatedList.slice( this.pager.startIndex, this.pager.endIndex + 1 );
      } catch ( error ) {
          console.error( error, "content management setPage()." )
      }

  }
  setFileCheck(file: any, id: any, event: any){
    $('#grid_'+file.id).click();
  }

  selectedPageNumber(event){
    if(event === 0) { event = this.paginatedList.length;}
   // this.paginatedList = this.list.slice(0,event);
    this.referenceService.loading( this.httpRequestLoader, true );
    this.pageSize = event;
    this.setPage( 1 );
    this.referenceService.loading( this.httpRequestLoader, false );
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

  checkListViewCheckboxes(){  return null;  }

  /**************List Items************************/
  listItems( pagination: Pagination ) {
      this.referenceService.loading( this.httpRequestLoader, true );
      this.emailTemplateService.listAwsFiles( pagination, this.loggedInUserId )
          .subscribe(
          ( data: any ) => {
             data.forEach((element, index) => { element.time = new Date(element.utcTimeString);});
             for(var i=0;i< data.length; i++){ data[i]["id"] = i;}
             this.list = data;
             this.searchList = data;
             this.sortList = data;
              if ( this.list.length > 0 ) {
                  this.exisitingFileNames = this.list.map( function( a ) { return a.fileName.toLowerCase(); });
              } else {
                 // this.customResponse = new CustomResponse( 'INFO', "No records found", true );
              }
              this.referenceService.loading( this.httpRequestLoader, false );
              this.paginatedList = this.list;
              this.setPage( 1 );
           },
           ( error: string ) => {  this.logger.errorPage( error ); } );
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
  delete( file: ContentManagement, id:any ) {
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
            self.selectedFiles.push( file );
            self.selectedFileIds.push( id );
          }
          self.deleteFile( self.contentManagement );
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
              let deleteMessage ;
              if(this.selectedFileIds.length === 1){  deleteMessage = file.fileName + ' deleted successfully';}
              else { deleteMessage = 'File(s) deleted successfully'; }
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
  ngOnInit() {
      this.listItems( this.pagination );
  }

}

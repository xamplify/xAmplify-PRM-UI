import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '../core/services/pager.service';
import { ReferenceService } from '../core/services/reference.service';
import { Pagination } from '../core/models/pagination';
import { HttpRequestLoader } from '../core/models/http-request-loader';
import { XtremandLogger } from '../error-pages/xtremand-logger.service';
import { CustomResponse } from '../common/models/custom-response';
import { ActionsDescription } from '../common/models/actions-description';
import { AuthenticationService } from '../core/services/authentication.service';
import { SocialPagerService } from '../contacts/services/social-pager.service';

import { EmailTemplateService } from '../email-template/services/email-template.service';
import {ContentManagement} from './model/content-management';

declare var Metronic,$, Layout, Demo, swal: any;

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.css'],
  providers: [Pagination,HttpRequestLoader, ActionsDescription,ContentManagement, SocialPagerService]
})
export class ContentManagementComponent implements OnInit {
    loggedInUserId:number = 0;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    list:any[]=[];
    isPreviewed:boolean = false;
    filePath:string = "";
    previewFile:any = "";
    exisitingFileNames:string[] = [];
    existingFileName:string  = "";
    awsFileKeys:string[] = [];
    pager: any = {};
    pagedItems: any[];
    pageSize: number = 12;
  constructor(private router: Router, private pagerService: PagerService, public referenceService: ReferenceService, 
              public actionsDescription: ActionsDescription,public pagination: Pagination, public socialPagerService: SocialPagerService,
              public authenticationService:AuthenticationService,private logger:XtremandLogger,
              private emailTemplateService:EmailTemplateService,private contentManagement:ContentManagement) { 
              this.loggedInUserId = this.authenticationService.getUserId();
      
  }
  
  
  setPage( page: number ) {
      try {
          if ( page < 1 || page > this.pager.totalPages ) {
              return;
          }

          this.pager = this.socialPagerService.getPager( this.list.length, page, this.pageSize );
          this.pagedItems = this.list.slice( this.pager.startIndex, this.pager.endIndex + 1 );

      } catch ( error ) {
          console.error( error, "content management setPage()." )
      }

  }
  

  /**************List Items************************/
  listItems( pagination: Pagination ) {
      this.referenceService.loading(this.httpRequestLoader, true);
          this.emailTemplateService.listAwsFiles( pagination, this.loggedInUserId)
              .subscribe(
              ( data: any ) => {
                  this.list = data;
                  if(this.list.length>0){
                      this.exisitingFileNames = this.list.map(function(a) {return a.fileName.toLowerCase();});
                  }else{
                      this.customResponse = new CustomResponse( 'INFO', "No records found", true );
                  }
                  this.referenceService.loading(this.httpRequestLoader, false);
                  this.setPage( 1 );
              },
              ( error: string ) => {this.logger.errorPage(error);
              }
              );
  }
  
  /******Preview*****************/
  preview(file:any){
      this.isPreviewed = true;
      this.previewFile = file;
  }
  hidePreview(){
      this.isPreviewed = false;
  }
  /************Delete******/
  delete(file:ContentManagement){
      let self = this;
      swal({
          title: 'Are you sure?',
          text: "You won't be able to undo this action",
          type: 'warning',
          showCancelButton: true,
          swalConfirmButtonColor: '#54a7e9',
          swalCancelButtonColor: '#999',
          confirmButtonText: 'Yes, delete it!'
      }).then(function () {
          self.contentManagement = file;
          self.deleteFile(self.contentManagement);
      }, function (dismiss: any) {
          console.log('you clicked on option' + dismiss);
      });
  }
  
  
  deleteFile( file: ContentManagement ) {
      this.customResponse.isVisible = false;
      this.awsFileKeys.push(file.fileName);
      this.referenceService.loading(this.httpRequestLoader, true);
      file.userId = this.loggedInUserId; 
      file.awsFileKeys = this.awsFileKeys;
      this.emailTemplateService.deleteFile( file )
          .subscribe(
          data => {
              const deleteMessage = file.fileName + ' deleted successfully';
              this.customResponse = new CustomResponse( 'SUCCESS', deleteMessage, true );
              this.listItems(this.pagination);
          },
          ( error: string ) => {
              this.logger.errorPage( error );
          }
          );
  }
  
  /********Upload File******/
  upload( event: any ) {
      this.customResponse.isVisible = false;
      try{
          this.referenceService.loading(this.httpRequestLoader, true);
          this.customResponse = new CustomResponse( 'INFO', "Uploading in progress.Please wait...", true );
          let files: Array<File>;
          if ( event.target.files ) { 
              files = event.target.files;
           }
          else if ( event.dataTransfer.files ) {
              files = event.dataTransfer.files;
            }
          const formData: FormData = new FormData();
            $.each(files,function(index,file){
                formData.append('files', file, file.name);
            });
            this.uploadToServer(formData);
      }catch(error){
          this.referenceService.loading(this.httpRequestLoader, false);
          this.customResponse = new CustomResponse( 'ERROR', "Unable to upload file", true );
      }
     
  }
  
  
  uploadToServer(formData:FormData){
      this.emailTemplateService.uploadFile(this.loggedInUserId, formData)
      .subscribe(
      data => {
         if(data.statusCode==1020){
             const message = ' files uploaded successfully';
             this.customResponse = new CustomResponse( 'SUCCESS', message, true );
             this.listItems(this.pagination);
         }else{
             let message = data.message;
             this.customResponse = new CustomResponse( 'ERROR', message, true );
         }
         this.referenceService.loading(this.httpRequestLoader, false);
      },
      ( error: string ) => {
          this.logger.errorPage( error );
      }
      );
  }
  /*******Validate Existing filename**********/
  
  ngOnInit() {
      this.listItems(this.pagination);
      
  }

}

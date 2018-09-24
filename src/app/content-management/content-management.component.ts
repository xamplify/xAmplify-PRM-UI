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

import { EmailTemplateService } from '../email-template/services/email-template.service';
import {ContentManagement} from './model/content-management';

declare var Metronic,$, Layout, Demo, swal: any;

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.css'],
  providers: [Pagination,HttpRequestLoader, ActionsDescription]
})
export class ContentManagementComponent implements OnInit {
    loggedInUserId:number = 0;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    list:string[]=[];
    isPreviewed:boolean = false;
    filePath:string = "";
    previewFile:any = "";
  constructor(private router: Router, private pagerService: PagerService, public referenceService: ReferenceService, 
              public actionsDescription: ActionsDescription,public pagination: Pagination,
              public authenticationService:AuthenticationService,private logger:XtremandLogger,private emailTemplateService:EmailTemplateService) { 
              this.loggedInUserId = this.authenticationService.getUserId();
      
  }

  /**************List Items************************/
  listItems( pagination: Pagination ) {
      this.referenceService.loading(this.httpRequestLoader, true);
          this.emailTemplateService.listAwsFiles( pagination, this.loggedInUserId)
              .subscribe(
              ( data: any ) => {
                  console.log(data);
                  this.list = data;
                  /*pagination.totalRecords = data.totalRecords;
                  pagination = this.pagerService.getPagedItems( pagination, data.emailTemplates );*/
                  this.referenceService.loading(this.httpRequestLoader, false);
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
  delete(file:any){
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
          self.deleteFile(file);
      }, function (dismiss: any) {
          console.log('you clicked on option' + dismiss);
      });
  }
  
  
  deleteFile( file: ContentManagement ) {
      this.customResponse.isVisible = false;
      this.referenceService.loading(this.httpRequestLoader, true);
      file.userId = this.loggedInUserId;
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
          this.customResponse = new CustomResponse( 'INFO', "Uploading the file.Please wait...", true );
          let file: File;
          if ( event.target.files ) { file = event.target.files[0]; }
          else if ( event.dataTransfer.files ) { file = event.dataTransfer.files[0]; }
          const formData: FormData = new FormData();
          formData.append( 'file', file, file.name );
          this.emailTemplateService.uploadFile(this.loggedInUserId, formData)
          .subscribe(
          data => {
             if(data.statusCode==1020){
                 const message = file.name + ' uploaded successfully';
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
      }catch(error){
          this.referenceService.loading(this.httpRequestLoader, false);
          this.customResponse = new CustomResponse( 'ERROR', "Unable to upload file", true );
      }
     
      
  }
  
  ngOnInit() {
      this.listItems(this.pagination);
      
  }

}

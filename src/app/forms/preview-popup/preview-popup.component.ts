import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import {FormService} from '../services/form.service';
import { Form } from '../models/form';
import { ColumnInfo } from '../models/column-info';
import { CustomResponse } from '../../common/models/custom-response';

declare var swal, $: any;
@Component({
  selector: 'app-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.css'],
  providers: [HttpRequestLoader]
})
export class PreviewPopupComponent implements OnInit {
    form:Form = new Form();
    ngxloading = false;
    formError = false;
    customResponse:CustomResponse = new CustomResponse();
    columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();
   constructor(private formService:FormService,public logger:XtremandLogger) {
   }

  ngOnInit() {
  }
  
  
  /*****************Preview Form*******************/
  previewForm(id:number){
      this.customResponse = new CustomResponse();
      this.ngxloading = true;
      this.formService.getById( id)
      .subscribe(
      ( data: any ) => {
          if(data.statusCode===200){
              this.form = data.data;
              this.formError = false;
          }else{
              this.formError = true;
              this.customResponse = new CustomResponse('ERROR', 'Unable to load the form.Please Contact Admin', true);
          }
         this.ngxloading = false;
      },
      ( error: string ) => {
          this.ngxloading = false;
          this.customResponse = new CustomResponse('ERROR', 'Unable to load the form.Please Contact Admin', true);
          }
      );
      $('#form-preview-modal').modal('show');
  }
  
  formPreviewBeforeSave(columnInfos:Array<ColumnInfo>,form:Form){
      this.ngxloading = true;
      this.form = form;
      this.form.formLabelDTOs = columnInfos;
      this.formError = false;
      this.ngxloading =false;
      $('#form-preview-modal').modal('show');
  }

}

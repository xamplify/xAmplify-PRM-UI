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
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from '../../core/services/util.service';
import { environment } from 'environments/environment';
declare var swal, $: any;
@Component({
  selector: 'app-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.css'],
  providers: [HttpRequestLoader,Pagination,SortOption]
})
export class PreviewPopupComponent implements OnInit {
    form:Form = new Form();
    ngxloading = false;
    formError = false;
    customResponse:CustomResponse = new CustomResponse();
    columnInfos: Array<ColumnInfo> = new Array<ColumnInfo>();
    formsError:boolean = false;
    pagination:Pagination = new Pagination();
    formsLoader:HttpRequestLoader = new HttpRequestLoader();
    showButton = false;
    selectedFormData: Array<Form> = [];
    selectedFormId: number;
   constructor(private formService:FormService,public logger:XtremandLogger,public authenticationService:AuthenticationService,
           public referenceService:ReferenceService,public sortOption:SortOption,public pagerService:PagerService,public utilService:UtilService,public router: Router) {
   console.log("Is Show forms in preview popup: " + this.authenticationService.isShowForms);
   }

  ngOnInit() {
      if(    this.router.url.indexOf("/home/emailtemplates/create")>-1  || this.router.url.indexOf("/home/pages/add")>-1){
          this.showButton = true;
      }
      
      if(this.authenticationService.isShowForms){
          this.pagination.campaignType = 'EVENT';
      }
      
      console.log(this.pagination.campaignType);
  }
  
  
  
  
  
  
  /************List Available Forms******************/
  showForms(){
      this.formsError = false;
      this.customResponse = new CustomResponse();
      this.pagination.userId = this.authenticationService.getUserId();;
      this.listForms(this.pagination);
  }
  
  listForms( pagination: Pagination ) {
      this.referenceService.loading( this.formsLoader, true );
      this.formService.list( pagination ).subscribe(
          ( response: any ) => {
              const data = response.data;
              pagination.totalRecords = data.totalRecords;
              this.sortOption.totalRecords = data.totalRecords;
              pagination = this.pagerService.getPagedItems( pagination, data.forms );
              this.referenceService.loading( this.formsLoader, false );
              $('#forms-list').modal('show');
          },
          ( error: any ) => { 
              this.formsError = true;
              this.customResponse = new CustomResponse('ERROR','Unable to get forms.Please Contact Admin.',true );
          } );
      $('#forms-list').modal('show');
     
  }
  
  /********************Pagaination&Search Code*****************/

  /*************************Sort********************** */
  sortBy( text: any ) {
      this.sortOption.formsSortOption = text;
      this.getAllFilteredResults( this.pagination );
  }


  /*************************Search********************** */
  searchForms() {
      this.getAllFilteredResults( this.pagination );
  }
  
  paginationDropdown(items:any){
      this.sortOption.itemsSize = items;
      this.getAllFilteredResults(this.pagination);
  }

  /************Page************** */
  setPage( event: any ) {
      this.pagination.pageIndex = event.page;
      this.listForms( this.pagination );
  }

  getAllFilteredResults( pagination: Pagination ) {
      this.pagination.pageIndex = 1;
      this.pagination.searchKey = this.sortOption.searchKey;
      this.pagination = this.utilService.sortOptionValues(this.sortOption.formsSortOption, this.pagination);
      this.listForms( this.pagination );
  }
  
  eventHandler( keyCode: any ) { if ( keyCode === 13 ) { this.searchForms(); } }
  
  copyInputMessage(inputElement,index:number){
      $(".success").hide();
      $('#copied-message-'+index).hide();
      inputElement.select();
      document.execCommand('copy');
      inputElement.setSelectionRange(0, 0);
      $('#copied-message-'+index).show(500);
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
              console.log(data.data);
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
  
  selectedForm(form: any, event){
     if(event.target.checked){
       this.selectedFormId = form.id;
       this.selectedFormData = [];
       this.selectedFormData.push(form);
     }else{
         this.selectedFormId = null;
         this.selectedFormData = [];
     }
  }

}

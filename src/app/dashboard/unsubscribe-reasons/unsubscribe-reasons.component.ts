import { Component, OnInit,ViewChild, OnDestroy } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { CustomResponse } from '../../common/models/custom-response';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';
import { SortOption } from '../../core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { CallActionSwitch } from 'app/videos/models/call-action-switch';
import { UnsubscribeReason } from '../models/unsubscribe-reason';
import { UnsubscribePageDetails } from '../models/unsubscribe-page-details';
declare var $, swal,CKEDITOR: any;

@Component({
  selector: 'app-unsubscribe-reasons',
  templateUrl: './unsubscribe-reasons.component.html',
  styleUrls: ['./unsubscribe-reasons.component.css'],
  providers: [HttpRequestLoader, SortOption, Properties, CallActionSwitch]

})
export class UnsubscribeReasonsComponent implements OnInit,OnDestroy {
  
  unsubscribeReason: UnsubscribeReason = new UnsubscribeReason();
  unsubscribePageDetails:UnsubscribePageDetails = new UnsubscribePageDetails();
  customResponse: CustomResponse = new CustomResponse();
  pagination: Pagination = new Pagination();
  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  addLoader: HttpRequestLoader = new HttpRequestLoader();
  sortOption: SortOption = new SortOption();
  submitButtonText = "Save";
  modalTitle = "Enter Reason";
  isFullPopupShow = false ;
  isAdd = true;
  loading: boolean;
  isDelete: boolean;
  ckeConfig: any;
  modalPopupLoader = false;
  unsubscribePageContent:any = {};
  isOtherReason = false;
  invalidReason: boolean;
  reason: string;
  characterleft: number = 250;
  @ViewChild( "footerTextCkEditor" ) footerTextCkEditor: any;
  @ViewChild( "headerTextCkEditor" ) headerTextCkEditor: any;
  constructor(public xtremandLogger: XtremandLogger, private pagerService: PagerService, public authenticationService: AuthenticationService,
    public referenceService: ReferenceService, public properties: Properties,
    public utilService: UtilService, public callActionSwitch: CallActionSwitch) {
  }


  ngOnInit() {
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins:false
  };
    this.findAll(this.pagination);
  }

  ngOnDestroy(): void {
    $('#unsubscribePagePopup').modal('hide');
    swal.close();
  }

  findAll(pagination: Pagination) {
    this.referenceService.goToTop();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.authenticationService.findAll(pagination).subscribe(
      response => {
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        this.sortOption.totalRecords = data.totalRecords;
        $.each(data.list, function (_index: number, list: any) {
          list.displayTime = new Date(list.createdTime);
        });
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        this.referenceService.loading(this.httpRequestLoader, false);
      }, error => {
        this.showInternalServerErrorMessage(error);
      }
    )
  }

  navigateBetweenPageNumbers(event: any) {
    this.pagination.pageIndex = event.page;
    this.findAll(this.pagination);
  }

  search() {
    this.getAllFilteredResults(this.pagination);
  }

  searchOnKeyPress(keyCode: any) { if (keyCode === 13) { this.search(); } }

  sortBy(text: any) {
    this.sortOption.selectedUnsubscribeReasonSortDropDownOption = text;
    this.getAllFilteredResults(this.pagination);
  }

  getAllFilteredResults(pagination: Pagination) {
    pagination.searchKey = this.sortOption.searchKey;
    pagination = this.utilService.sortOptionValues(this.sortOption.selectedUnsubscribeReasonSortDropDownOption, pagination);
    this.findAll(pagination);
  }

  /********************Add************/
  openCreateDiv() {
    this.isAdd = true;
    this.unsubscribeReason = new UnsubscribeReason();
    this.customResponse = new CustomResponse();
    $('#manage-unsubscribe-reasons').hide(500);
    $('#edit-header-and-footer-text').hide(500);
    $('#add-unsubscribe-reason').show(500);
    this.submitButtonText = "Save";
  }

  goToManage() {
    this.unsubscribeReason = new UnsubscribeReason();
    this.unsubscribePageDetails = new UnsubscribePageDetails();
    this.referenceService.stopLoader(this.addLoader);
    this.referenceService.stopLoader(this.httpRequestLoader);
    this.customResponse = new CustomResponse();
    $('#add-unsubscribe-reason').hide(500); 
    $('#edit-header-and-footer-text').hide(500);
    $('#manage-unsubscribe-reasons').show(500);
    this.referenceService.goToTop();
  }

  validateForm() {
    let validName = $.trim(this.unsubscribeReason.reason).length > 0;
    this.unsubscribeReason.isValidForm = validName;
  }

  changeStatus(event:any,unsubscribeReason:UnsubscribeReason){
    unsubscribeReason.customReason = event;
  }

  saveOrUpdate() {
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.unsubscribeReason.dupliateNameErrorMessage = "";
    this.unsubscribeReason.customReasonClass = "black";
    this.loading = true;
    this.authenticationService.saveOrUpdateUnsubscribeReason(this.unsubscribeReason, this.isAdd).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.goToManage();
          let message = this.isAdd ? 'created' : 'updated';
          this.customResponse = new CustomResponse('SUCCESS', 'Reason is  ' + message + ' successfully', true);
          this.pagination = new Pagination();
          this.sortOption = new SortOption();
          this.findAll(this.pagination);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        let statusCode = JSON.parse(error['status']);
         if(statusCode==400 || statusCode == 409){
          let errorResponse = JSON.parse(error['_body']);
          let message = errorResponse['message'];
          if("Reason Already Exists"==message){
            this.unsubscribeReason.dupliateNameErrorMessage = "Already exists";
          }else{
            this.unsubscribeReason.customReasonClass = "red";
            this.customResponse = new CustomResponse('ERROR', message, true);
          }
        }else {
          this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
        }
      }
    );
  }
  findById(id: number) {
    this.unsubscribeReason = new UnsubscribeReason();
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.authenticationService.findUnsubscribeReasonById(id).subscribe(
      response => {
        this.unsubscribeReason = response.data;
        this.unsubscribeReason.isValidForm = true;
        this.isAdd = false;
        this.submitButtonText = "Update";
        $('#manage-unsubscribe-reasons').hide(500);
        $('#add-unsubscribe-reason').show(500);
      }, error => {
        this.showInternalServerErrorMessage(error);
      }
    );
  }

  confirmDeleteAlert(unsubscribeReason:UnsubscribeReason){
    let self = this;
    swal({
      title: 'Are you sure?',
      text: "You won't be able to undo this action!",
      type: 'warning',
      showCancelButton: true,
      swalConfirmButtonColor: '#54a7e9',
      swalCancelButtonColor: '#999',
      confirmButtonText: 'Yes, delete it!'

    }).then(function() {
      self.delete(unsubscribeReason);
    }, function(dismiss: any) {
      console.log('you clicked on option' + dismiss);
    });
  }

  delete(unsubscribeReason:UnsubscribeReason){
    this.customResponse = new CustomResponse();
    this.referenceService.loading(this.httpRequestLoader, true);
    this.authenticationService.deleteUnsubscribeReasonById(unsubscribeReason.id).subscribe(
      _response => {
        this.customResponse = new CustomResponse('SUCCESS',unsubscribeReason.reason+" is deleted successfully",true);
        this.referenceService.loading(this.httpRequestLoader, false);
        this.pagination.pageIndex = 1;
        this.findAll(this.pagination);
      }, error => {
        this.showInternalServerErrorMessage(error);
      }
    )
  }

  showInternalServerErrorMessage(error:any){
    this.customResponse = new CustomResponse();
    this.xtremandLogger.error(error);
    this.loading = false;
    this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
    this.referenceService.loading(this.httpRequestLoader, false);
    this.referenceService.goToTop();
    this.loading = false;
  }

  /********Edit Header/Footer Text ***********/
  openHeaderAndFooterText(){
    console.log(this.unsubscribePageDetails);
    this.findHeaderTextAndFooterText();
  }

  findHeaderTextAndFooterText(){
    this.loading = true;
    this.referenceService.loading(this.httpRequestLoader, true);
    this.authenticationService.findHeaderAndFooterText().subscribe(
      response=>{
        let self  = this;
        setTimeout(()=>{                         
				self.unsubscribePageDetails = response.data;
        $('#manage-unsubscribe-reasons').hide(500);
        $('#edit-header-and-footer-text').show(500);
        self.referenceService.loading(this.httpRequestLoader, false);
        self.loading = false;
 			}, 500);
      },error=>{
        this.showInternalServerErrorMessage(error);
      }
    )
  }

 
updateHeaderAndFooterText(){
  this.getCkEditorData();
  let headerText = $.trim(this.unsubscribePageDetails.headerText);
  let footerText = $.trim(this.unsubscribePageDetails.footerText);
  if(headerText.length>0 && footerText.length>0){
    this.unsubscribePageDetails.invalidHeaderText = false;
    this.unsubscribePageDetails.invalidFooterText = false;
    this.customResponse = new CustomResponse();
    this.loading = true;
    this.authenticationService.updateHeaderAndFooterText(this.unsubscribePageDetails).subscribe(
      response=>{
        this.referenceService.goToTop();
        this.customResponse = new CustomResponse('SUCCESS','Data is updated successfully',true);
        this.loading = false;
      },error=>{
        this.showInternalServerErrorMessage(error);
      }
    )
  }else{
    this.referenceService.goToTop();
    this.customResponse = new CustomResponse('ERROR','Please fill required fields',true);
    this.unsubscribePageDetails.invalidHeaderText = headerText.length==0;
    this.unsubscribePageDetails.invalidFooterText = footerText.length==0;
  }

}

changeHeaderTextStatus(event:any,unsubscribePageDetails:UnsubscribePageDetails){
  unsubscribePageDetails.hideHeaderText = !event;
}
changeFooterTextStatus(event:any,unsubscribePageDetails:UnsubscribePageDetails){
  unsubscribePageDetails.hideFooterText = !event;
}


openUnsubscribePagePopup(){
  this.unsubscribePageContent = {};
  $('#unsubscribePagePopup').modal('show');
  this.isFullPopupShow = true ;
  this.referenceService.scrollToModalBodyTopByClass();
  this.modalPopupLoader = true;
  this.authenticationService.findUnsusbcribePageContent().subscribe(
    response=>{
      this.unsubscribePageContent = response.data;
      this.modalPopupLoader = false;
    },_error=>{
      $('#unsubscribePagePopup').modal('hide');
      this.modalPopupLoader = false;
      this.referenceService.showSweetAlertServerErrorMessage();
    }
  )
}

addReason(unsubscribeReason:any){
  this.isOtherReason = unsubscribeReason.customReason;
  if(this.isOtherReason){
    this.reason = "";
    this.invalidReason = true;
  }else{
    this.invalidReason = false;
    this.reason = unsubscribeReason.reason;
  }
}    

characterSize(){
    let reasonLength = $.trim(this.reason).length;
    if(reasonLength>0){
      this.invalidReason = false;
      this.characterleft = 250 - reasonLength;
    }else{
      this.invalidReason = true;
    }
  } 

  
  getCkEditorData() {
    for ( var instanceName in CKEDITOR.instances ) {
      CKEDITOR.instances[instanceName].updateElement();
      let data = CKEDITOR.instances[instanceName].getData();
      if("editor1"==instanceName){
        this.unsubscribePageDetails.headerText = data;
      }else if("editor2"==instanceName){
        this.unsubscribePageDetails.footerText = data;
      }
    }
}
}

import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { CopyDto } from '../models/copy-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';


@Component({
  selector: 'app-copy-modal-popup',
  templateUrl: './copy-modal-popup.component.html',
  styleUrls: ['./copy-modal-popup.component.css'],
  providers:[Properties]
})
export class CopyModalPopupComponent implements OnInit {
  processing = false;
  isValidForm = false;
  buttonClicked = false;
  placeHolderSuffixText = "";
  modalPopupId="copy-modal-popup";
  copyDto:CopyDto = new CopyDto();
  @Output() copyModalPopupOutputEmitter = new EventEmitter();
  customResponse:CustomResponse = new CustomResponse();
  constructor(private referenceService:ReferenceService,public properties:Properties) { }

  ngOnInit() {
  }

  openModalPopup(id:number,copiedName:string,moduleName:string){
    this.customResponse = new CustomResponse();
    this.processing = true;
    this.buttonClicked = false;
    this.referenceService.openModalPopup(this.modalPopupId);
    this.copyDto.copiedName = copiedName+"-copy";
    this.copyDto.id = id;
    this.copyDto.moduleName = moduleName;
    this.validateForm();
    this.processing = false;
  }

  validateForm(){
    this.isValidForm = this.referenceService.getTrimmedData(this.copyDto.copiedName).length>0;
  }

  closeModalPopup(){
    this.referenceService.closeModalPopup(this.modalPopupId);
  }

  showSweetAlertSuccessMessage(message:string){
    this.referenceService.showSweetAlertSuccessMessage(message);
    this.closeModalPopup();
  }

  showServerErrorMessage(){
    this.processing = false;
    this.buttonClicked = false;
    this.customResponse = new CustomResponse('ERROR',this.properties.serverErrorMessage,true);
  }

  submit(){
    this.processing = true;
    this.copyModalPopupOutputEmitter.emit(this.copyDto);
  }

}

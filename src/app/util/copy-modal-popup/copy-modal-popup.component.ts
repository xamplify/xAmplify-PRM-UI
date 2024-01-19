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
  existingNames:Array<string> = new Array<string>();
  errorMessage = "";
  constructor(private referenceService:ReferenceService,public properties:Properties) { }

  ngOnInit() {
  }

  openModalPopup(id:number,copiedName:string,moduleName:string,existingNames:any){
    this.customResponse = new CustomResponse();
    this.errorMessage = "";
    this.existingNames = existingNames;
    this.processing = true;
    this.buttonClicked = false;
    this.referenceService.openModalPopup(this.modalPopupId);
    this.copyDto.copiedName = copiedName+"-copy";
    this.copyDto.id = id;
    this.copyDto.moduleName = moduleName;
    this.validateNames();
    this.processing = false;
  }

  validateNames(){
    this.errorMessage = "";
    let moduleName = this.copyDto.moduleName;
    let copiedName = this.copyDto.copiedName;
    let isNotEmptyName = this.referenceService.getTrimmedData(copiedName).length>0;
    if(!isNotEmptyName){
      this.isValidForm = false;
      this.errorMessage = "Please Enter "+moduleName+" Name";
    }else{
      let isDuplicateName = this.existingNames.indexOf(this.referenceService.convertToLowerCaseAndGetTrimmedData(copiedName))>-1;
      this.isValidForm = !isDuplicateName;
      if(isDuplicateName){
        this.errorMessage = moduleName+" Already Exists";
      }
    }
   
  }

  closeModalPopup(){
    this.referenceService.closeModalPopup(this.modalPopupId);
  }

  showSweetAlertSuccessMessage(message:string){
    this.referenceService.showSweetAlertSuccessMessage(message);
    this.closeModalPopup();
  }

  showErrorMessage(message:string){
    this.processing = false;
    this.buttonClicked = false;
    this.customResponse = new CustomResponse('ERROR',message,true);
  }

  submit(){
    this.processing = true;
    this.copyModalPopupOutputEmitter.emit(this.copyDto);
  }

}

import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';
import { CopyDto } from '../models/copy-dto';

@Component({
  selector: 'app-copy-modal-popup',
  templateUrl: './copy-modal-popup.component.html',
  styleUrls: ['./copy-modal-popup.component.css']
})
export class CopyModalPopupComponent implements OnInit {
  processing = false;
  isValidForm = false;
  buttonClicked = false;
  placeHolderSuffixText = "";
  modalPopupId="copy-modal-popup";
  copyDto:CopyDto = new CopyDto();
  @Output() copyModalPopupOutputEmitter = new EventEmitter();

  constructor(private referenceService:ReferenceService) { }

  ngOnInit() {
  }

  openModalPopup(id:number,copiedName:string,moduleName:string){
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

  callEventEmitter(){
    this.referenceService.closeModalPopup(this.modalPopupId);
  }

  submit(){
    this.processing = true;
    this.copyModalPopupOutputEmitter.emit(this.copyDto);
  }

}

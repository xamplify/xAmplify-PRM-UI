import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MyProfileService } from 'app/dashboard/my-profile.service';
import { CustomResponse } from '../models/custom-response';
import { ReferenceService } from 'app/core/services/reference.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-custom-blocks-modal-popup',
  templateUrl: './custom-blocks-modal-popup.component.html',
  styleUrls: ['./custom-blocks-modal-popup.component.css']
})
export class CustomBlocksModalPopupComponent implements OnInit {

  @Input() customHtmlBlockId: number;
  @Output() notifyParent: EventEmitter<any>;
  customHtmlBlock: any;
  leftHtmlBody: SafeHtml;
  rightHtmlBody: SafeHtml;
  sanitizedHtml: SafeHtml;
  popupLoader: boolean = false;
  MODAL_POPUP = "custom_html_block_modal_popup";
  customResponse: CustomResponse = new CustomResponse();
  customErrorMessage: any;
  isUpdated: boolean = false;

  constructor(private myProfileService: MyProfileService, public referenceService: ReferenceService,
    public sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) { 
      this.notifyParent = new EventEmitter();
    }

  ngOnInit() {
    this.openModalPopup();
  }

  findById(id: any) {
    this.popupLoader = true;
    this.customResponse = new CustomResponse();
    this.myProfileService.findById(id).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.customHtmlBlock = response.data;
          if (this.customHtmlBlock.htmlBody) {
            this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
          } else {
            this.updateSanitizedHtml(this.customHtmlBlock.leftHtmlBody, 'left');
            this.updateSanitizedHtml(this.customHtmlBlock.rightHtmlBody, 'right');
          }
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
        this.popupLoader = false;
      }, error => {
        this.popupLoader = false;
        let message = this.referenceService.showHttpErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', message, true);
      });
  }

  updateSanitizedHtml(htmlbody: string, side: string) {
    if (side === 'left') {
      this.customHtmlBlock.leftHtmlBody = htmlbody;
      this.leftHtmlBody = this.sanitizer.bypassSecurityTrustHtml(htmlbody);
    } else if (side === 'right') {
      this.customHtmlBlock.rightHtmlBody = htmlbody
      this.rightHtmlBody = this.sanitizer.bypassSecurityTrustHtml(htmlbody);
    } else {
      this.customHtmlBlock.htmlBody = htmlbody
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(htmlbody);
    }
    this.cdr.detectChanges();
  }

  updateCustomblock() {
    this.popupLoader = true;
    this.updateHtmlBody();
    this.customResponse = new CustomResponse();
    this.myProfileService.updateCustomHtmlBlock(this.customHtmlBlock).subscribe(
      response => {
        this.popupLoader = false;
        if (response.statusCode === 200) {
          this.isUpdated = true;
          this.customResponse = new CustomResponse('SUCCESS', response.message, true);
        } else if (response.statusCode === 413) {
          this.customErrorMessage = response.message;
        } else {
          this.customResponse = new CustomResponse('ERROR', response.message, true);
        }
      }, error => {
        this.popupLoader = false;
        let message = this.referenceService.showHttpErrorMessage(error);
        this.customResponse = new CustomResponse('ERROR', message, true);
      }
    );
  }

  updateHtmlBody() {
    if (this.customHtmlBlock.layoutSize === 'SINGLE_COLUMN_LAYOUT') {
      this.customHtmlBlock.rightHtmlBody = '';
      this.customHtmlBlock.leftHtmlBody = '';
    } else if (this.customHtmlBlock.layoutSize === 'TWO_COLUMN_LAYOUT') {
      this.customHtmlBlock.htmlBody = '';
    }
  }

  updateDropDownHtmlBody(text: any) {
    if (text === 'SINGLE_COLUMN_LAYOUT') {
      if (this.customHtmlBlock.htmlBody) {
        this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
      } else if (this.customHtmlBlock.leftHtmlBody) {
        this.customHtmlBlock.htmlBody = this.customHtmlBlock.leftHtmlBody;
        this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
      } else if (this.customHtmlBlock.rightHtmlBody) {
        this.customHtmlBlock.htmlBody = this.customHtmlBlock.rightHtmlBody;
        this.updateSanitizedHtml(this.customHtmlBlock.htmlBody, 'full');
      }
    } else if (text === 'TWO_COLUMN_LAYOUT') {
      if (this.customHtmlBlock.leftHtmlBody) {
        this.updateSanitizedHtml(this.customHtmlBlock.leftHtmlBody, 'left');
      } else if (this.customHtmlBlock.htmlBody) {
        this.customHtmlBlock.leftHtmlBody = this.customHtmlBlock.htmlBody;
        this.updateSanitizedHtml(this.customHtmlBlock.leftHtmlBody, 'left');
      }
    }
  }

  onFileSelected(event: any, side: string) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    $('[data-toggle="tooltip"]').tooltip('hide');
    if (file) {
      const reader = new FileReader();
      if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        reader.onload = (e: any) => {
          const html = e.target.result;
          this.updateSanitizedHtml(html, side);
          fileInput.value = '';
        };
        reader.readAsText(file);
      } else {
        console.error('Unsupported file type. Please upload an HTML/HTM file.');
        fileInput.value = '';
      }
    } else {
      console.error('No file selected.');
    }
  }

  openModalPopup() {
    this.referenceService.openModalPopup(this.MODAL_POPUP);
    this.findById(this.customHtmlBlockId);
  }

  closeModalPopup() {
    this.referenceService.closeModalPopup(this.MODAL_POPUP);
    this.notifyParent.emit(this.isUpdated);
  }

  isValid(): boolean {
    if (this.customHtmlBlock.layoutSize === 'TWO_COLUMN_LAYOUT') {
      if (this.customHtmlBlock.leftHtmlBody || this.customHtmlBlock.rightHtmlBody) {
        return !this.customHtmlBlock.title.trim();
      } else if (this.customHtmlBlock.title) {
        if (this.customHtmlBlock.leftHtmlBody || this.customHtmlBlock.rightHtmlBody) {
          return !this.customHtmlBlock.title.trim();
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return (!this.customHtmlBlock.title.trim() || !this.customHtmlBlock.htmlBody.trim());
    }
  }

  customUiSwitchEventReceiver(event: any) {
    this.customHtmlBlock.selected = event;
  }

  titleUiSwitchEventReceiver(event: any) {
    this.customHtmlBlock.titleVisible = event;
  }
  ngOnDestroy(){
    $('#custom_html_block_modal_popup').modal('hide');
  }
}

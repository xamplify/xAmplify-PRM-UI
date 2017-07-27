import { Directive, ElementRef, Input } from '@angular/core';
declare var CKEDITOR:any;
@Directive({ selector: 'textarea' })
export class CkEditor {
    constructor(_elm: ElementRef) {
        CKEDITOR.replace(_elm.nativeElement);
      }
}
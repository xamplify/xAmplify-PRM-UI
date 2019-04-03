import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component( {
    selector: 'app-preview-video',
    templateUrl: './preview-video.component.html',
    styleUrls: ['./preview-video.component.css','../../../assets/css/video-css/video-js.custom.css']
} )
export class PreviewVideoComponent implements OnInit, OnDestroy {
    @Input() welcomeVideoFile:any;
    @Input() videoFile: any;
    @Output() notifyParent: EventEmitter<any>;

    constructor() { this.notifyParent = new EventEmitter();}

    destroyPreviewModal() {
      console.log( '360 video closed' );
      this.notifyParent.emit("modal closed");
    }
    ngOnInit() {
       $( "#show_preview" ).modal('show');
    }
    ngOnDestroy(){
      $('#show_preview').modal('hide');
    }
}

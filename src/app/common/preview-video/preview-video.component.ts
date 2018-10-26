import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { ReferenceService } from '../../core/services/reference.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { AuthenticationService } from '../../core/services/authentication.service';

import { SaveVideoFile } from '../../videos/models/save-video-file';

declare var videojs, $: any;

@Component( {
    selector: 'app-preview-video',
    templateUrl: './preview-video.component.html',
    styleUrls: ['./preview-video.component.css','../../../assets/css/video-css/video-js.custom.css']
} )
export class PreviewVideoComponent implements OnInit, OnDestroy {
    @Input() welcomeVideoFile:any;
    @Input() videoFile: any;
    @Output() notifyParent: EventEmitter<any>;
    videoJSplayer: any;
    videotitle: string;
    videoId: number;
    constructor( public referenceService: ReferenceService,public authenticationService: AuthenticationService,
                 public videoUtilService: VideoUtilService ) {
                 this.notifyParent = new EventEmitter();
         }

    showPreview() {
        $( "#show_preview" ).modal('show');
        this.appendVideoData( this.videoFile, "main_video", "modal-title" );
    }
    destroyPreviewModal() {
        if ( this.videoJSplayer ) {
            this.videoJSplayer.dispose();
            $( "#main_video" ).empty();
            this.notifyParent.emit("modal closed");
        } else {
            console.log( '360 video closed' );
            this.notifyParent.emit("modal closed");
        }
    }
    videoControllColors( videoFile: SaveVideoFile ) {
        this.videoUtilService.videoColorControlls( videoFile );
        const rgba = this.videoUtilService.transparancyControllBarColor( videoFile.controllerColor, videoFile.transparency );
        $( '.video-js .vjs-control-bar' ).css( 'cssText', 'background-color:' + rgba + '!important' );
    }
    appendVideoData( videoFile: SaveVideoFile, divId: string, titleId: string ) {
        $( '.h-video' ).remove();
        $( '.p-video' ).remove();
        console.log( videoFile );
        const videoSelf = this;
        if ( videoFile.viewBy === 'DRAFT' ) {
            console.log( this.referenceService.defaultPlayerSettings );
            videoFile.playerColor = this.referenceService.defaultPlayerSettings.playerColor;
            videoFile.controllerColor = this.referenceService.defaultPlayerSettings.controllerColor;
        }
        var alias = videoFile.alias;
        var fullImagePath = videoFile.imagePath;
        this.videotitle = videoFile.title;
        var videoPath = videoFile.videoPath;
        var is360 = videoFile.is360video;
        $( "#" + divId ).empty();
        $( "#" + titleId ).empty();
        $( 'head' ).append( '<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="v-video" rel="stylesheet">' );
        if ( is360 ) {
            console.log( "Loaded 360 Video" );
            $( '.h-video' ).remove();
            this.videoUtilService.player360VideoJsFiles();
            this.videoUtilService.video360withm3u8();
            const str = '<video id=videoId poster=' + fullImagePath + '  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $( "#" + divId ).append( str );
            console.log( "360 video path" + videoPath );
            let videoUrl = videoPath;
            videoUrl = videoUrl.substring(0, videoUrl.lastIndexOf('.'));
            videoUrl = videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
            $( "#" + divId + " video").append('<source src=' + videoUrl + ' type="application/x-mpegURL">');
            var player = videojs( 'videoId' );
            player.panorama( {
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                callback: function() {
                    player.ready(function () { this.play();});
                    videoSelf.videoControllColors( videoFile );
                }
            } );
            $( "#videoId" ).css( "width", "550px" );
            $( "#videoId" ).css( "height", "310px" );
            $( "#videoId" ).css( "max-width", "100%" );
            $( "#videoId" ).css( "margin", "0 auto" );
        } else {
            console.log( "Loaded Normal Video" );
            $( '.p-video' ).remove();
            this.videoUtilService.normalVideoJsFiles();
            var str = '<video id=videoId  poster=' + fullImagePath + ' preload="none"  class="video-js vjs-default-skin" controls></video>';
            $( "#" + divId ).append( str );
            console.log( "Video Path:::" + videoPath );
            videoPath = videoPath.substring( 0, videoPath.lastIndexOf( '.' ) );
            videoPath = videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
            $( "#" + divId + " video" ).append( '<source src=' + videoPath + ' type="application/x-mpegURL">' );
            $( "#videoId" ).css( "width", "550px" );
            $( "#videoId" ).css( "height", "310px" );
            $( "#videoId" ).css( "max-width", "100%" );
            $( "#videoId" ).css( "margin", "0 auto" );
            var document: any = window.document;
            const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
            this.videoJSplayer = videojs( "videoId", {
              "controls": true,
              "autoplay": true,
                html5: {
                    hls: {
                        overrideNative: overrideNativeValue
                    },
                    nativeVideoTracks: !overrideNativeValue,
                    nativeAudioTracks: !overrideNativeValue,
                    nativeTextTracks: !overrideNativeValue
                }
            } );
             this.videoControllColors( videoFile );
            console.log( player );
            if ( this.videoJSplayer ) {
                this.videoJSplayer.on( 'fullscreenchange', function() {
                    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    var event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if ( event === "FullscreenOn" ) {
                        $( ".vjs-tech" ).css( "width", "100%" );
                        $( ".vjs-tech" ).css( "height", "100%" );
                    } else if ( event === "FullscreenOff" ) {
                        $( "#videoId" ).css( "width", "550px" );
                    }
                } );
            }
        }
        $( "video" ).bind( "contextmenu", function() {
            return false;
        } );
    }
    ngOnInit() {
       this.showPreview();
    }
    ngOnDestroy(){
      $('#show_preview').modal('hide');
    }

}

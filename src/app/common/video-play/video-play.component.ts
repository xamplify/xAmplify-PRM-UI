import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $, videojs:any;

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.css']
})
export class VideoPlayComponent implements OnInit, OnDestroy {
 @Input() videoFile: SaveVideoFile;
 @Input() videoHeight:string;
 @Input() videoWidth:string;
 @Output() notifyVideoParent: EventEmitter<any>;
 videoJSplayer:any;
 constructor(public videoUtilService:VideoUtilService , public referenceService: ReferenceService, public authenticationService:AuthenticationService) { }

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
    const fullImagePath = videoFile.imagePath;
    let videoPath = videoFile.videoPath;
    const is360 = videoFile.is360video;
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
        let player = videojs( 'videoId' );
        player.panorama( {
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function() {
                player.ready(function () { this.play();});
                videoSelf.videoControllColors( videoFile );
            }
        } );
        $( "#videoId" ).css( "width", this.videoWidth ); // expected 550px
        $( "#videoId" ).css( "height", this.videoHeight );   // expected 310px
        $( "#videoId" ).css( "max-width", "100%" );
        $( "#videoId" ).css( "margin", "0 auto" );
    } else {
        console.log( "Loaded Normal Video" );
        $( '.p-video' ).remove();
        this.videoUtilService.normalVideoJsFiles();
        let str = '<video id=videoId  poster=' + fullImagePath + ' preload="none"  class="video-js vjs-default-skin" controls></video>';
        $( "#" + divId ).append( str );
        console.log( "Video Path:::" + videoPath );
        videoPath = videoPath.substring( 0, videoPath.lastIndexOf( '.' ) );
        videoPath = videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $( "#" + divId + " video" ).append( '<source src=' + videoPath + ' type="application/x-mpegURL">' );
        $( "#videoId" ).css( "width", this.videoWidth ); // expected 550px
        $( "#videoId" ).css( "height", this.videoHeight );   // expected 310px
        $( "#videoId" ).css( "max-width", "100%" );
        $( "#videoId" ).css( "margin", "0 auto" );
        const document: any = window.document;
        const width = this.videoWidth;
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
        if ( this.videoJSplayer ) {
            this.videoJSplayer.on( 'fullscreenchange', function() {
                const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                const event = state ? 'FullscreenOn' : 'FullscreenOff';
                if ( event === "FullscreenOn" ) {
                    $( ".vjs-tech" ).css( "width", "100%" );
                    $( ".vjs-tech" ).css( "height", "100%" );
                } else if ( event === "FullscreenOff" ) {
                  $( "#videoId" ).css( "width", width); // expected 550px
                }
            } );
        }
    }
    $( "video" ).bind( "contextmenu", function() {
        return false;
    } );
  }
  ngOnInit() {
    this.videoHeight = '380px';
    this.videoWidth = '650px';
    this.appendVideoData( this.videoFile, "main_video", "modal-title" );
  }
  ngOnDestroy(): void {
    if ( this.videoJSplayer ) {
      this.videoJSplayer.dispose();
      $( "#main_video" ).empty();
      // this.notifyVideoParent.emit("modal closed");
    } else {
      console.log( '360 video closed' );
      // this.notifyVideoParent.emit("modal closed");
   }
  }

}

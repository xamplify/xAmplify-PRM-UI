import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { VideoUtilService } from 'app/videos/services/video-util.service';
import { SaveVideoFile } from 'app/videos/models/save-video-file';
import { ReferenceService } from 'app/core/services/reference.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
declare var $, videojs:any;

@Component({
  selector: 'app-video-play',
  templateUrl: './video-play.component.html',
  styleUrls: ['./video-play.component.css', '../../../assets/css/video-css/video-js.custom.css']
})
export class VideoPlayComponent implements OnInit, OnDestroy {
 @Input() videoFile: SaveVideoFile;
 @Input() videoHeight:string;
 @Input() videoWidth:string;
 @Input() isPreview: boolean;
 @Output() notifyVideoParent: EventEmitter<any>;
 videoJSplayer:any;
 fullScreenMode = false;
 brandLogoUrl: any;
 logoDescriptionUrl: any;
 @Input() isVideoBaseReport: boolean;
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
    if (videoFile && videoFile.viewBy === 'DRAFT' ) {
        console.log( this.referenceService.defaultPlayerSettings );
        videoFile.playerColor = this.referenceService.defaultPlayerSettings.playerColor;
        videoFile.controllerColor = this.referenceService.defaultPlayerSettings.controllerColor;
    }
    const fullImagePath = videoFile.imagePath;
    let videoPath = videoFile.videoPath;
    const is360 = videoFile.is360video;
    this.brandLogoUrl = videoFile.brandingLogoUri;
    this.logoDescriptionUrl = videoFile.brandingLogoDescUri;
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
        let player = videojs( 'videoId', { playbackRates: [0.5, 1, 1.5, 2] } );
        let isPreview = this.isPreview;
        const newValue = this;
        player.panorama( {
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function() {
              const document: any = window.document;
                player.ready(function () {
                  $('#overLayImage').append($('#overlay-logo').show());
                 if(isPreview) { $('.vjs-big-play-button').css('display', 'block');}
                 else { this.play(); }
                });
                player.on('fullscreenchange', function () {
                  const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                  const event = state ? 'FullscreenOn' : 'FullscreenOff';
                  if (event === 'FullscreenOn') {
                      $('.vjs-tech').css('width', '100%');
                      $('.vjs-tech').css('height', '100%');
                      newValue.fullScreenMode = true;
                      $('#videoId').append($('#overlay-logo').show());
                  } else if (event === 'FullscreenOff') {
                      $('#videoId').css('width', 'auto');
                      $('#videoId').css('height', '315px');
                      newValue.fullScreenMode = false;
                   }
               });
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
        let isPreview = this.isPreview;
        const self = this;
        const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
        this.videoJSplayer = videojs( "videoId", {
          "controls": true,
          "autoplay": !isPreview,
           playbackRates: [0.5, 1, 1.5, 2],
          
            html5: {
                hls: {
                    overrideNative: overrideNativeValue
                },
                nativeVideoTracks: !overrideNativeValue,
                nativeAudioTracks: !overrideNativeValue,
                nativeTextTracks: !overrideNativeValue
            },
            function () {
              this.ready(function () {
                $('#overLayImage').append($('#overlay-logo').show());
                // if(this.isPreview) { $('.vjs-big-play-button').css('display', 'block');}
                // else { this.play(); }
              } )}
        } );
         this.videoControllColors( videoFile );
        if ( this.videoJSplayer ) {
            this.videoJSplayer.on( 'fullscreenchange', function() {
                const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                const event = state ? 'FullscreenOn' : 'FullscreenOff';
                if ( event === "FullscreenOn" ) {
                    $( ".vjs-tech" ).css( "width", "100%" );
                    $( ".vjs-tech" ).css( "height", "100%" );
                    self.fullScreenMode = true;
                    $('#videoId').append($('#overlay-logo').show());
                } else if ( event === "FullscreenOff" ) {
                  $( "#videoId" ).css( "width", width); // expected 550px
                  self.fullScreenMode = false;
                }
            } );
        }
    }
    $( "video" ).bind( "contextmenu", function() {
        return false;
    } );
  }
  ngOnInit() {
    if(this.videoFile) { this.appendVideoData( this.videoFile, "main_video", "modal-title" ); }
  }
  ngOnDestroy(): void {
    if ( this.videoJSplayer ) {
      this.videoJSplayer.dispose();
      $( "#main_video" ).empty();
    } else {
      console.log( '360 video closed' );
   }
  }

}

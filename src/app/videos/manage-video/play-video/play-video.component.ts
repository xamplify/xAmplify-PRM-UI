import {Component, ElementRef, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import {SaveVideoFile} from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../core/models/user';
import {VideoFileService} from '../../services/video-file.service';
declare var Metronic, Layout, Demo, $, videojs: any;

@Component({
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.css', '../../../../assets/css/video-css/video-js.custom.css',
        '../../../../assets/css/video-css/videojs-overlay.css', '../../../../assets/css/about-us.css',
        '../../../../assets/css/todo.css']
})
export class PlayVideoComponent implements OnInit, AfterViewInit {

    @Input() videos: Array<SaveVideoFile>;
    @Input() selectedVideo: SaveVideoFile;
    selectedPosition: number;
    public videoUrl: string;
    private _elementRef: ElementRef;
    private videoJSplayer: any;
    public setValueForSrc: boolean;
    public posterImg: string;
    public likes: boolean;
    public comments: boolean;
    public shareVideo: boolean;
    public embedVideo :boolean;
    public isPlayButton: boolean;
    public isSkipChecked: boolean;
    public user: User = new User();
    model: any = {};
    public upperTextValue: string;
    public lowerTextValue: string;
    public isOverlay: boolean;
    public videoOverlaySubmit: string;
    public isPlay: boolean;
    public email_id: string;
    public firstName: string;
    public lastName: string;
    public overLayValue: boolean;
    public isFistNameChecked: boolean;
    public videoStartTime: number;
    public durationTime: number;
    public startOfthevideo: boolean;  // need to remove and replace with this.saveVideoFile.startOfthevideo
    public endOfthevideo: boolean;
    public checkCalltoAction : boolean = false; // need to get the value from server and set the call to action value

    public videoId = false;

    constructor(elementRef: ElementRef, private authenticationService: AuthenticationService,
    private videoFileService: VideoFileService,private userService: UserService) {
        this._elementRef = elementRef;
    }

    videoPlayListSource(videoUrl: string){
        this.videoUrl = videoUrl;
        const self = this;
       this.videoJSplayer.playlist([{ sources: [{  src: self.videoUrl, type: 'application/x-mpegURL' }]}]);
        
       
    }

    playVideoInfo(selectedVideo: SaveVideoFile) {
        this.posterImg = this.selectedVideo.imagePath;
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl =  this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
       // call to action values
        this.lowerTextValue = this.selectedVideo.lowerText;   // need  the value from server
        this.upperTextValue = this.selectedVideo.upperText;   // need  the value from server 
        this.isFistNameChecked = this.selectedVideo.name; // need  the value from server 
        this.isPlayButton = this.selectedVideo.name;  // need to get the value from server
        this.isSkipChecked = this.selectedVideo.skip; // need to get the value from server
        this.startOfthevideo =  this.selectedVideo.startOfVideo;
        this.endOfthevideo  = this.selectedVideo.endOfVideo;
       // this.checkCalltoAction = this.selectedVideo.callACtion;
       // video controlls
        this.likes = this.selectedVideo.allowLikes;
        this.comments = this.selectedVideo.allowComments;
        this.shareVideo = this.selectedVideo.allowSharing;
        this.embedVideo = this.selectedVideo.allowEmbed;
        console.log(this.selectedVideo);
    }

    showVideo(videoFile: SaveVideoFile, position: number) {
       console.log('videoComponent showVideo() ' + position);
       this.videoFileService.getVideo(videoFile.alias, videoFile.viewBy)
         .subscribe((saveVideoFile: SaveVideoFile) => {
           this.selectedVideo = saveVideoFile;
           console.log(this.selectedVideo);
           if (this.selectedVideo) {
             console.log('videoComponent showVideo() re adding the existing video' + this.selectedPosition);
             this.videos.splice(this.selectedPosition, 0, this.selectedVideo);
          }
        this.videos.splice(position, 1);
        this.selectedPosition = position;
        this.playVideoInfo(this.selectedVideo);
        this.posterImg =  this.selectedVideo.imagePath;
      // change the video src dynamically
       if (this.setValueForSrc === true) {
              this.videoPlayListSource(this.videoUrl);
              this.setValueForSrc = false;
       }
        else {
             this.videoPlayListSource(this.videoUrl);
             this.videoPlayListSource(this.videoUrl);
          }
    // to check the call to action overlay is there or not
       if ( this.selectedVideo.startOfVideo==true) {   // need to get the value from server
            $('#overlay-modal').show();
            $('.vjs-big-play-button').css('display', 'none');
             this.videoJSplayer.pause();
        }
        else {
            $('#overlay-modal').hide();
            $('.vjs-big-play-button').css('display', 'block');
             this.videoJSplayer.pause();
        }
       
      });
    }

   validateEmail(email: string) {
        var validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validation.test(email);
    }

    checkingCallToActionValues() {
        if (this.isFistNameChecked == true && this.validateEmail(this.model.email_id) && this.firstName.length != 0 && this.lastName.length != 0) {
        this.isOverlay = false;
            console.log(this.model.email_id + 'mail ' + this.firstName + ' and last name ' + this.lastName);
        }
        else if (this.isFistNameChecked == false && this.validateEmail(this.model.email_id)) { this.isOverlay = false; }
        else { this.isOverlay = true; }
    }

    trimCurrentTime(currentTime) {
        return Math.round(currentTime * 100) / 100;
    }

    saveCallToActionUserForm() {
        console.log(this.model.email_id);
        if (this.userService.loggedInUserData.emailId === this.model.email_id) {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.userService.loggedInUserData.firstName;
            this.user.lastName = this.userService.loggedInUserData.lastName;
        }
        else {
            this.user.emailId = this.model.email_id;
            this.user.firstName = this.firstName;
            this.user.lastName = this.lastName;
        }
        console.log(this.user);
        this.videoFileService.saveCalltoActionUser(this.user)
            .subscribe(
            (result: any) => {
                console.log('Save user Form call to acton is successfull');
                console.log(result);
            });
    }

    ngOnInit() {
    	//this.playNormalVideo();
    	this.setValueForSrc = true;

        this.model.email_id = this.userService.loggedInUserData.emailId;
        this.firstName = this.userService.loggedInUserData.firstName;
        this.lastName = this.userService.loggedInUserData.lastName;

        if (this.validateEmail(this.model.email_id)) { this.isOverlay = false; }
        else {this.isOverlay = true; }

        this.playVideoInfo(this.selectedVideo);

       if (this.startOfthevideo === true) {    // need the value from server and add the checkCalltoAction to the condition 
            this.videoOverlaySubmit = 'PLAY';
            this.isPlay = true;
            this.overLayValue = true;
            localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); /// setted the value true here in localstorge
        }
        else {
            this.isPlay = false;
            this.overLayValue = false;
            this.videoOverlaySubmit = 'SUBMIT';
            localStorage.setItem('isOverlayValue', JSON.stringify(this.overLayValue)); /// setted the value false here in localstorge
        }

    }

    play360Video(){
        $('.h-video').remove();
        $('head').append('<script src="https://yanwsh.github.io/videojs-panorama/videojs/v5/video.min.js"  class="p-video"  />');
        var player = videojs('example_video_11');
        console.log(player);
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
              player.ready();
            }
          });
    }
    playNormalVideo(){
        $('.p-video').remove();
        $('head').append('<script src="assets/js/indexjscss/video.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"  class="h-video"  />');
        $('head').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.5.0/videojs-contrib-hls.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/RecordRTC.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs.record.js"  class="h-video"  />'); 
      //  var player = videojs('example_video_11');
      //  player.ready();
     
    }
    
    ngAfterViewInit() {
        
    	//this.playNormalVideo();
    
    	this.videoJSplayer = videojs('example_video_11', {}, function() {
            let player = this;
           // var id = player.id();
           // this.play();
            const aspectRatio = 320/640;
            const isValid = JSON.parse(localStorage.getItem("isOverlayValue")); // gettting local storage value here isValid value is true
           // console.log(player.isValidated); // isValidated is undefined ..value setted in constructor
           this.ready(function() {
                if (isValid === true) {
                    $('.vjs-big-play-button').css('display', 'none');
                    $('#example_video_11').append(
                        $('#overlay-modal').show()
                    );
                    $('#replay-video').click(function() {
                        $('#overlay-modal').hide();
                        player.play();
                    });
                    $('#skipOverlay').click(function() {
                        $('#overlay-modal').hide();
                        player.play();
                    });
                }
                else {
                    $('#overlay-modal').hide();
                    player.play();
                }
            }); 

            this.on('seeking', function() {
                // Mobinar.logging.logAction(data.id,'videoPlayer_slideSlider',startDuration,trimCurrentTime(player.currentTime()));
            });

           /*  resizeVideoJS(){
                var width = document.getElementById(id).parentElement.offsetWidth;
                player.width(width).height( width * aspectRatio );
              }
            resizeVideoJS();
            window.onresize = resizeVideoJS; */
            this.on('timeupdate', function() {
                // var  startDuration = player.trimCurrentTime(player.currentTime());
                // var  startDuration = player.currentTime();
                // console.log(this.currentTime());
            });
            this.on('play', function() {
                $('.vjs-big-play-button').css('display', 'none');
                //   console.log('play:'+player.duration());
                // Mobinar.logging.logAction(data.id,'playVideo',trimCurrentTime(player.currentTime()),trimCurrentTime(player.currentTime()));

            });
            this.on('pause', function() {
                //      $('.vjs-big-play-button').css('display', 'block');
                //  console.log("video paused at "+player.currentTime());
                //  Mobinar.logging.logAction(data.id,'pauseVideo',trimCurrentTime(player.currentTime()),trimCurrentTime(player.currentTime()));
            });

            this.on('ended', function() {
                var whereYouAt = player.currentTime();
                console.log(whereYouAt);
                if (isValid == false) {
                    $('#example_video_11').append(
                        $('#overlay-modal').show()
                    );

                    $('#replay-video').click(function() {
                        $('#overlay-modal').hide();
                        player.play();
                    });
                    $('#replay-video1').click(function() {
                        $('#overlay-modal').hide();
                        player.play();
                        $('.vjs-big-play-button').css('display', 'none');
                    });
                    $('#skipOverlay').click(function() {
                        $('#overlay-modal').hide();
                        // player.play();
                    });
                }  // ended if condition
                else {
                    $('#overlay-modal').hide();
                    // player.play();
                    $('.vjs-big-play-button').css('display', 'none');
                }
            });
            this.on('contextmenu', function(e) {
                e.preventDefault();
            });
            this.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableMute: true,
                enableFullscreen: true,
                enableNumbers: false,
                enableVolumeScroll: true,
                fullscreenKey: function(event: any, player: any) {
                    return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                },
                customKeys: {
                    simpleKey: {
                        key: function(e: any) {
                            return (e.which === 83);
                        },
                        handler: function(player: any, options: any, e: any) {
                            if (player.paused()) {
                                player.play();
                            } else {
                                player.pause();
                            }
                        }
                    },
                    complexKey: {
                        key: function(e: any) {
                            return (e.ctrlKey && e.which === 68);
                        },
                        handler: function(player: any, options: any, event: any) {
                            if (options.enableMute) {
                                player.muted(!player.muted());
                            }
                        }
                    },
                    numbersKey: {
                        key: function(event: any) {
                            return ((event.which > 47 && event.which < 59) || (event.which > 95 && event.which < 106));
                        },
                        handler: function(player: any, options: any, event: any) {
                            if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                var sub = 48;
                                if (event.which > 95) {
                                    sub = 96;
                                }
                                var number = event.which - sub;
                                player.currentTime(player.duration() * number * 0.1);
                            }
                        }
                    },
                    emptyHotkey: {
                    },
                    withoutKey: {
                        handler: function(player: any, options: any, event: any) {
                            console.log('withoutKey handler');
                        }
                    },
                    withoutHandler: {
                        key: function(e: any) {
                            return true;
                        }
                    },
                    malformedKey: {
                        key: function() {
                            console.log('I have a malformed customKey. The Key function must return a boolean.');
                        },
                        handler: function(player: any, options: any, event: any) {
                        },
                    }
                }
            });
        });
    //	  this.videoPlayListSource(this.videoUrl);
    	
    } 
    ngOnDestroy() {
        console.log('Deinit - Destroyed Component');
        this.videoJSplayer.dispose();
        localStorage.removeItem('isOverlayValue');
    }
} 

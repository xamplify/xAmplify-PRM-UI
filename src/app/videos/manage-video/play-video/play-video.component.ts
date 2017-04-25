import {Component, ElementRef, OnInit, OnDestroy, Input,AfterViewInit } from '@angular/core';
import {SaveVideoFile} from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import {UserService} from '../../../core/services/user.service';
import {User} from '../../../core/models/user';
import {VideoFileService} from '../../services/video-file.service';
declare var Metronic, Layout, Demo, $, videojs: any;

@Component({
  selector: 'app-play-video',
  templateUrl: './play-video.component.html',
  styleUrls : ['./play-video.component.css', '../../../../assets/css/video-css/video-js.custom.css' ,
   '../../../../assets/css/video-css/videojs-overlay.css',  '../../../../assets/css/about-us.css',
    '../../../../assets/css/todo.css'] 
 })
export class PlayVideoComponent implements OnInit,AfterViewInit  {

    @Input() videos: Array<SaveVideoFile>;
    @Input() selectedVideo: SaveVideoFile;
    selectedPosition: number;
    public videoUrl: string;
    private _elementRef: ElementRef;
    private videoJSplayer: any;
    public likes: boolean;
    public comments: boolean;
    public isPlayButton: boolean;
    public isSkipChecked: boolean;
    public user: User= new User();
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
    public startOfthevideo:boolean  = true;  // need to remove and replace with this.saveVideoFile.startOfthevideo
    constructor(elementRef: ElementRef,private authenticationService: AuthenticationService, private videoFileService :VideoFileService,
            private userService :UserService) 
       {
        this._elementRef = elementRef
        }

    showVideo(videoFile: SaveVideoFile, position : number) {
        console.log("videoComponent showVideo() "+position);
        if(this.selectedVideo){
            console.log("videoComponent showVideo() re adding the existing video "+this.selectedPosition);
            this.videos.splice(this.selectedPosition, 0, this.selectedVideo);
           }
        this.videos.splice(position, 1);
        this.selectedVideo = videoFile;
        this.selectedPosition = position;
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf("."));
        this.videoUrl = this.videoUrl +".mp4?access_token="+this.authenticationService.access_token;
        console.log('Init - Component initialized')
        this.likes  = this.selectedVideo.allowLikes;
        this.comments = this.selectedVideo.allowComments;
    }
    
    saveCallToActionUserForm(){
        console.log(this.model.email_id);  
       
      if(this.userService.loggedInUserData.emailId == this.model.email_id) 
        {
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
                console.log("Save user Form call to acton is successfull");
                console.log(result);
           });
      }
   
    validateEmail(email:string) {
        var validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validation.test(email);
      }
    
    checkingCallToActionValues(){
        // console.log(this.model.email_id);
         if(this.isFistNameChecked==true&& this.validateEmail(this.model.email_id) && this.firstName.length!=0 &&  this.lastName.length!=0)    
            {   this.isOverlay=false;
             console.log(this.model.email_id +'mail '+this.firstName +' and last name '+this.lastName); }
         else if(this.isFistNameChecked==false && this.validateEmail(this.model.email_id)){  this.isOverlay=false; }
         else {this.isOverlay = true;}
    } 
    
    trimCurrentTime(currentTime){
        return Math.round(currentTime * 100) / 100;
    }
    
    ngOnInit(){
    	 this.likes  = this.selectedVideo.allowLikes;
         this.comments = this.selectedVideo.allowComments;
         
         this.videoUrl = this.selectedVideo.videoPath;
         this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf("."));
         this.videoUrl = this.videoUrl +".mp4?access_token="+this.authenticationService.access_token;
         console.log('Init - Component initialized')
       
         this.isPlayButton = true;  // need to the value from server
         this.isSkipChecked = true; // need to the value from server
          
         this.lowerTextValue = "thanks you";   // need to the value from server
         this.upperTextValue = "welcome to xtremand videos";   // need to the value from server 
         
         this.isFistNameChecked  = true // need to the value from server 
         
         this.model.email_id = this.userService.loggedInUserData.emailId;
         this.firstName = this.userService.loggedInUserData.firstName;
         this.lastName = this.userService.loggedInUserData.lastName;
         
         if(this.validateEmail(this.model.email_id))
             this.isOverlay = false;
         else this.isOverlay= true;
         
         
         if(this.startOfthevideo == true){    // need to the value from server
             this.videoOverlaySubmit = 'PLAY';
             this.isPlay = true;
             this.overLayValue = true;
             localStorage.setItem("isOverlayValue", JSON.stringify(this.overLayValue)); /// setted the value true here in localstorge
          }
         else {
              this.isPlay = false;
              this.overLayValue = false;
              this.videoOverlaySubmit = 'SUBMIT';
              localStorage.setItem("isOverlayValue", JSON.stringify(this.overLayValue)); /// setted the value false here in localstorge
         } 
         
         console.log(this.videos);
         console.log(this.selectedVideo);
       //  Metronic.init();
       //  Layout.init();
       //  Demo.init();
    }
    
    ngAfterViewInit() {
        
       

        this.videoJSplayer = videojs(document.getElementById('example_video_11'), {}, function() {
            // This is functionally the same as the previous example.
               // this.play();
        	
        
            let player = this;
            var isValid = JSON.parse(localStorage.getItem("isOverlayValue")); // gettting local storage value here isValid value is true
            console.log(player.isValidated); // isValidated is undefined ..value setted in constructor
            this.ready(function() {
                this.bigPlayButton.hide();
                if(isValid==true){
                $('#example_video_11').append(
                        $('#overlay-modal').show()
                        );
                $('#replay-video').click(function() {
                    $('#overlay-modal').hide();
                    player.play();
                   });
                $('#skipOverlay').click(function(){
                    $('#overlay-modal').hide();
                    player.play();
                });
                }
                else{
                    $('#overlay-modal').hide();
                    player.play();
                }
            });

            this.on('seeking', function(){
               
            	
            	//Mobinar.logging.logAction(data.id,'videoPlayer_slideSlider',startDuration,trimCurrentTime(player.currentTime()));
            });

            this.on('timeupdate', function(){
              //var  startDuration = player.trimCurrentTime(player.currentTime());
            	var  startDuration = player.currentTime();
              console.log(startDuration);
            });
            
            this.on('play', function () {
                console.log('play:'+player.duration());
                // Mobinar.logging.logAction(data.id,'playVideo',trimCurrentTime(player.currentTime()),trimCurrentTime(player.currentTime()));
                
            });
            this.on('pause', function () {
                console.log("video paused at "+player.currentTime());
               // Mobinar.logging.logAction(data.id,'pauseVideo',trimCurrentTime(player.currentTime()),trimCurrentTime(player.currentTime()));
            });
            
           this.on('ended', function() {
                if(isValid==false){
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
                  });
               $('#skipOverlay').click(function() {
                   $('#overlay-modal').hide();
                   //player.play();
                  });
               }  // ended if condition
                else {
                    $('#overlay-modal').hide();
                    //player.play();
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
                fullscreenKey: function(event:any, player:any) {
                    return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                  },
                customKeys: {
                simpleKey: {
                  key: function(e:any) {
                    return (e.which === 83);
                  },
                  handler: function(player:any, options:any, e:any ){
                    if (player.paused()) {
                      player.play();
                    } else {
                      player.pause();
                    }
                  }
                },
                complexKey: {
                  key: function(e:any) {
                    return (e.ctrlKey && e.which === 68);
                  },
                  handler: function(player:any, options:any, event:any) {
                    if (options.enableMute) {
                      player.muted(!player.muted());
                    }
                  }
                },
                numbersKey: {
                  key: function(event:any) {
                    return ((event.which > 47 && event.which < 59) || (event.which > 95 && event.which < 106));
                  },
                  handler: function(player:any, options:any, event:any) {
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
                    handler: function(player:any, options:any, event:any) {
                        console.log('withoutKey handler');
                    }
                  },
                  withoutHandler: {
                    key: function(e:any) {
                        return true;
                    }
                  },
                  malformedKey: {
                      key: function() {
                        console.log('I have a malformed customKey. The Key function must return a boolean.');
                      },
                      handler: function(player:any, options:any, event:any) {
                      },
                    }
                }
             });
        });
        
        
    }

    ngOnDestroy() {
        console.log('Deinit - Destroyed Component')
        this.videoJSplayer.dispose();
        localStorage.removeItem("isOverlayValue");
    }


}

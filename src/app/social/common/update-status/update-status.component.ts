import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { SaveVideoFile } from "../.././../videos/models/save-video-file";
import { SocialStatus } from "../../models/social-status";
import { SocialStatusContent } from "../../models/social-status-content";
import { SocialStatusProvider } from "../../models/social-status-provider";

import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { SocialService } from "../../services/social.service";
import { TwitterService } from "../../services/twitter.service";
import { FacebookService } from "../../services/facebook.service";
import { VideoFileService } from "../.././../videos/services/video-file.service";

import { Pagination } from '../../../core/models/pagination';

declare var swal, $, flatpickr, videojs: any;
@Component( {
    selector: 'app-update-status',
    templateUrl: './update-status.component.html',
    styleUrls: ['./update-status.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
    providers: [PagerService, Pagination]
})
export class UpdateStatusComponent implements OnInit {
    errorMessage: string;
    successMessage: string;
    errorDetails: Array<string> = [];
    videos: Array<SaveVideoFile> = [];
    totalRecords: number;
    pager: any = {};

    videoUrl: string;
    posterImage: string;
    videoJSplayer: any;
    selectedVideo: SaveVideoFile;

    socialStatusList: Array<SocialStatus> = new Array<SocialStatus>();
    socialStatus: SocialStatus = new SocialStatus();

    MEDIA_URL = this.authenticationService.MEDIA_URL;
    accessToken = this.authenticationService.access_token;
    profileImage: string;
    userId: number;

    constructor( private socialService: SocialService, private twitterService: TwitterService, private facebookService: FacebookService,
        private videoFileService: VideoFileService, private authenticationService: AuthenticationService,
        private pagerService: PagerService, private pagination: Pagination, private router: Router ) {
    }

    previewVideo( videoFile: SaveVideoFile ) {
        this.selectedVideo = videoFile;
        this.posterImage = this.selectedVideo.imagePath;
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring( 0, this.videoUrl.lastIndexOf( "." ) );
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;

        this.videoJSplayer.play();
        
        $('tr').click(function() {
                $('input[type=radio]',this).attr('checked','checked');
            }
        );
    }

    addVideo() {
        console.log( this.socialStatus );
        this.errorMessage = "";
        if ( this.socialStatus.socialStatusContents.length > 0 && ( Array.from( this.socialStatus.socialStatusContents )[0].fileType != "video" ) ) {
            this.errorMessage = "You can include up to 4 photos or 1 video in a Tweet.";
        } else {
            this.socialStatus.statusMessage = this.selectedVideo.title;
            let socialStatusContent: SocialStatusContent = new SocialStatusContent();
            socialStatusContent.id = this.selectedVideo.id;
            socialStatusContent.fileName = this.selectedVideo.title;
            socialStatusContent.fileType = "video";
            socialStatusContent.filePath = this.videoUrl;
            this.socialStatus.socialStatusContents.push( socialStatusContent );
        }
        $( '#listVideosModal' ).modal( 'hide' );
    }

    removeItem( i: number, socialStatusContent: SocialStatusContent ) {
        console.log( socialStatusContent + "" + i );
        this.socialService.removeMedia( socialStatusContent.fileName )
            .subscribe(
            data => {
                $( "#preview-" + i ).remove( 'slow' );
                this.socialStatus.socialStatusContents.splice( i );
                this.errorMessage = "";
            },
            error => console.log( error ),
            () => console.log( "Finished" )
            );
    }
    validateImageUpload( files: any ) {
        this.errorMessage = "";
        this.errorDetails = [];
        var uploadedFilesCount = files.length;
        var existingFilesCount = this.socialStatus.socialStatusContents.length;
        if ( ( uploadedFilesCount + existingFilesCount ) > 4 ) {
            this.errorMessage = "You can upload maximum 4 images.";
            return false;
        } else if ( ( this.socialStatus.socialStatusContents.length == 1 ) && ( Array.from( this.socialStatus.socialStatusContents )[0].fileType == "video" ) ) {
            this.errorMessage = "You can include up to 4 photos or 1 video in a Tweet.";
            return false;
        }
        else {
            for ( let file of files ) {
                if ( file.size > 3145728 ) {
                    // File size should not be more than 3 MB
                    this.errorMessage = "Accepted Image Size <= 3MB";
                    this.errorDetails.push( "The Uploaded Image: " + file.name + " size is " + Math.round( file.size / 1024 / 1024 * 100 ) / 100 + " MB" );
                    return false;
                }
                console.log( file.name + ": " + file.size );
            }
            return true;
        }
    }
    fileChange( event: any ) {
        let files = event.target.files;
        if ( this.validateImageUpload( files ) ) {
            if ( files.length > 0 ) {
                let formData: FormData = new FormData();
                for ( let file of files ) {
                    formData.append( 'files', file, file.name );
                }

                this.socialService.uploadMedia( formData )
                    .subscribe(
                    data => {
                        for ( var i in data ) {
                            const socialStatusContent = data[i];
                            this.socialStatus.socialStatusContents.push( socialStatusContent );
                        }
                        console.log( this.socialStatus );
                    },
                    error => console.log( error ),
                    () => console.log( "Finished" )
                    );
            }
        }

    }

    updateAgain( socialStatus: SocialStatus ) {
        this.initializeSocialStatus();
        this.socialStatus.statusMessage = socialStatus.statusMessage;
        this.socialStatus.shareNow = true;

        this.updateStatus();
    }

    updateStatus() {
        let socialStatusProviders = this.socialStatus.socialStatusProviders;
        socialStatusProviders = socialStatusProviders.filter( function( obj ) {
            return obj.selected === true;
        });
        this.socialStatus.socialStatusProviders = socialStatusProviders;
        console.log( this.socialStatus );
        swal( { title: 'Updating Status', text: "Please Wait...", showConfirmButton: false, imageUrl: "http://rewardian.com/images/load-page.gif" });
        this.socialService.updateStatus( this.userId, this.socialStatus )
            .subscribe(
            data => {
                this.initializeSocialStatus();
                $( '#full-calendar' ).fullCalendar( 'removeEvents' );
                this.listEvents();
                swal( "Status posted Successfully", "", "success" );
            },
            error => {
                console.log( error );
                swal( "Error while posting the update.", "", "error" );
            },
            () => console.log( "Finished" )
            );
    }

    schedule() {
        this.socialStatus.shareNow = false;
        this.updateStatus();
    }

    deleteStatus( socialStatus: SocialStatus ) {
        console.log( this.socialStatus );
        this.socialService.deleteStatus( socialStatus )
            .subscribe(
            data => {
                $( '#full-calendar' ).fullCalendar( 'removeEvents' );
                this.listEvents();
            },
            error => console.log( error ),
            () => console.log( "Finished" )
            );
    }

    constructCalendar() {
        let self = this;
        $( '#full-calendar' ).fullCalendar( {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            views: {
                listDay: { buttonText: 'list day' },
                listWeek: { buttonText: 'list week' }
            },
            defaultView: 'month',
            timeFormat: 'h:mm',
            eventRender: function( event: any, element: any ) {
                element.find( ".fc-time" ).addClass( 'fc-time-title' );
                element.find( ".fc-title" ).addClass( 'fc-time-title' );
                element.find( '.fc-time-title' ).wrapAll( '<div class="fc-right-block col-xs-9" style="padding: 0;float: right;"></div>' );
                element.find( ".fc-time" ).css( { "display": "block" });
                element.find( ".fc-right-block" )
                    .after( $( "<div class='fc-left-block col-xs-3' style='padding: 0;'></div>" ).html( "<img alt='Twitter @manassahoo9173' src='https://instagram.fhyd2-1.fna.fbcdn.net/t51.2885-19/s150x150/13397667_966003090179916_1274276788_a.jpg' style='width:20px;display:block;'>" +
                        "<img src='https://cdn3.iconfinder.com/data/icons/inficons/128/twitter.png' style='width:20px;display:block;'>" +
                        "<span style='background-color: #55acee;width: 20px;display: block;color: #FFF;'><i class='fa fa-check' style='margin-left:2px;' aria-hidden='true'></i></span>" ) );

            },
            eventClick: function( event: any, element: any ) {
                $( '#full-calendar-modal-event-' + event.id ).modal( 'show' );
            },
        });
    }



    initializeSocialStatus() {
        this.socialStatus.socialStatusContents = new Array<SocialStatusContent>();
        this.socialStatus.id = null;
        this.socialStatus.statusMessage = "";
        this.socialStatus.shareNow = true;

        this.listSocialStatusProviders();
    }

    listSocialStatusProviders() {
        const socialConnections = this.socialService.socialConnections;
        this.socialStatus.socialStatusProviders = new Array<SocialStatusProvider>();
        for ( const i in socialConnections ) {
            let socialStatusProvider = new SocialStatusProvider();

            socialStatusProvider.providerId = socialConnections[i].profileId;
            socialStatusProvider.providerName = socialConnections[i].source;
            socialStatusProvider.profileImagePath = socialConnections[i].profileImage;
            socialStatusProvider.profileName = socialConnections[i].profileName;

            if ( ( 'TWITTER' === socialConnections[i].source ) ) {
                socialStatusProvider.oAuthTokenValue = socialConnections[i].oAuthTokenValue;
                socialStatusProvider.oAuthTokenSecret = socialConnections[i].oAuthTokenSecret;
            } else {
                socialStatusProvider.accessToken = socialConnections[i].accessToken;
            }
            this.socialStatus.socialStatusProviders.push( socialStatusProvider );
        }
    }
    openListVideosModal() {
        $( '#listVideosModal' ).modal( 'show' );
        if ( this.videos.length == 0 ) {
            $( "#preview-section" ).hide();
            this.listVideos( this.pagination );
        }
    }
    listVideos( pagination: Pagination ) {
        this.videoFileService.loadVideoFiles( pagination )
            .subscribe(( result: any ) => {
                if ( result.totalRecords > 0 ) {
                    $( "#preview-section" ).show();
                    this.videos = result.listOfMobinars;
                    this.totalRecords = result.totalRecords;
                    pagination.totalRecords = this.totalRecords;
                    pagination = this.pagerService.getPagedItems( pagination, this.videos );
                    
                    
                    $('head').append('<script src=" assets/js/indexjscss/webcam-capture/video.min.js"" type="text/javascript"  class="profile-video"/>');
                    this.videoJSplayer = videojs( "videojs-video" );
                    this.previewVideo( this.videos[0] );
                }
            }),
            () => console.log( "load videos completed:" + this.videos );
    }

    setPage( page: number ) {
        if (page !== this.pagination.pageIndex) {
            this.pagination.pageIndex = page;
            this.listVideos(this.pagination);
        }
    }

    hmsToSecondsOnly( hms: any ) {
        var a = hms.split( ':' );
        var seconds = ( +a[0] ) * 60 * 60 + ( +a[1] ) * 60 + ( +a[2] );
        return seconds;
    }

    setvideoLengthInSeconds() {/*
        for ( var i = 0; i < this.videos.length; i++ ) {
            this.videos[i].videoLengthInSeconds = this.hmsToSecondsOnly( this.videos[i].videoLength );
        }
    */}


    listEvents() {
        let self = this;
        this.socialService.listEvents( this.userId )
            .subscribe(
            data => {
                this.socialStatusList = data;
                for ( var i in this.socialStatusList ) {

                    var event = {
                        title: this.socialStatusList[i].statusMessage,
                        start: this.socialStatusList[i].scheduledTimeUser,
                        id: this.socialStatusList[i].id,
                        data: this.socialStatusList[i],
                    };
                    $( '#full-calendar' ).fullCalendar( 'renderEvent', event, true );
                }
            },
            error => console.log( error ),
            () => {
                flatpickr( '.flatpickr', {
                    enableTime: true,
                    minDate: new Date()
                });
                console.log( "listEvents() finished" )
            }
            );
    }
    editSocialStatus( socialStatus: SocialStatus ) {
        $( '#full-calendar-modal-event-' + socialStatus.id ).modal( 'hide' );
        $( 'html,body' ).animate( { scrollTop: 0 }, 'slow' );
        //this.initializeSocialStatus();
        this.socialStatus = socialStatus;
        this.listSocialStatusProviders();

    }
    showScheduleOption( divId: string ) { $( '#' + divId ).removeClass( 'hidden' ); }
    hideScheduleOption( divId: string ) { $( '#' + divId ).addClass( 'hidden' ); }

    /*    getFacebookAccounts() {
            this.facebookService.listAccounts( localStorage.getItem( 'facebook' ) )
                .subscribe(
                data => {
                    for ( var i in data ) {
                        this.socialStatus.socialStatusProviders.push(data[i]);
                    }
                },
                error => console.log( error ),
                () => console.log( 'getAccounts() Finished.' )
                );
    
        }*/

    getUserProfileImage( userId: string ) {
        this.facebookService.getUserProfileImage( userId )
            .subscribe(
            data => this.profileImage = data,
            error => console.log( error ),
            () => console.log( 'getUserProfileImage() Finished.' )
            );

    }

    videoPlayListSource( videoUrl: string ) {
        this.videoUrl = videoUrl;
        const self = this;
        this.videoJSplayer.playlist( [{ sources: [{ src: self.videoUrl, type: 'application/x-mpegURL' }] }] );
    }

    ngOnInit() {
        this.userId = this.authenticationService.getUserId();
        this.listEvents();
        this.constructCalendar();
        this.initializeSocialStatus();
        $( "#schedule-later-div" ).hide();
    }

    ngOnDestroy() {
        if ( this.videoJSplayer != undefined )
            this.videoJSplayer.dispose();
        $('.profile-video').remove();
    }
}

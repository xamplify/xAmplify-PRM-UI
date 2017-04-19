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
import { VideoFileService } from "../.././../videos/services/video-file.service";

import { Pagination } from '../../../core/models/pagination';

declare var swal, $, flatpickr, videojs: any;
@Component( {
    selector: 'app-update-status',
    templateUrl: './update-status.component.html',
    styleUrls: ['./update-status.component.css'],
    providers: [PagerService, Pagination]
})
export class UpdateStatusComponent implements OnInit {
    errorMessage: string;
    successMessage: string;
    errorDetails: Array<String> = [];
    videos: Array<SaveVideoFile> = [];
    totalRecords: number;
    pager: any = {};
    pagedItems: any[];

    videoUrl: string;
    videoJSplayer: any;
    selectedVideo: SaveVideoFile;

    maxlength = 140;
    characterleft = this.maxlength;

    socialStatusList: Array<SocialStatus> = new Array<SocialStatus>();
    socialStatus: SocialStatus = new SocialStatus();

    REST_URL = this.authenticationService.REST_URL;
    accessToken = this.authenticationService.access_token;


    constructor( private socialService: SocialService, private twitterService: TwitterService,
        private videoFileService: VideoFileService, private authenticationService: AuthenticationService,
        private pagerService: PagerService, private pagination: Pagination ) {
        console.log( "constructor called" );
    }
    count( statusMessage: string ) {
        if ( this.maxlength > statusMessage.length ) {
            this.characterleft = ( this.maxlength ) - ( statusMessage.length );
        }
        else {
            this.socialStatus.statusMessage = statusMessage.substr( 0, statusMessage.length - 1 );
        }
    }
    previewVideo( videoFile: SaveVideoFile ) {
        this.selectedVideo = videoFile;
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring( 0, this.videoUrl.lastIndexOf( "." ) );
        this.videoUrl = this.videoUrl + ".mp4";
        this.videoJSplayer.play();
    }

    addVideo() {
        console.log( this.socialStatus );
        this.errorMessage = "";
        if ( this.socialStatus.socialStatusContents.size > 0 && this.socialStatus.socialStatusContents[0].fileType != "video" ) {
            this.errorMessage = "You can include up to 4 photos or 1 video in a Tweet.";
        } else {
            this.socialStatus.statusMessage = this.selectedVideo.title + " " + this.videoUrl;
            let socialStatusContent: SocialStatusContent = new SocialStatusContent();
            socialStatusContent.id = this.selectedVideo.id;
            socialStatusContent.fileName = this.selectedVideo.title;
            socialStatusContent.fileType = "video";
            socialStatusContent.filePath = this.videoUrl;
            this.socialStatus.socialStatusContents.add( socialStatusContent );
        }
        $( '#listVideosModal' ).modal( 'hide' );
    }

    removeItem( i: number, socialStatusContent: SocialStatusContent ) {
        console.log( socialStatusContent + "" + i );
        this.socialService.removeMedia( socialStatusContent.fileName )
            .subscribe(
            data => {
                $( "#preview-" + i ).remove( 'slow' );
                this.socialStatus.socialStatusContents.delete( socialStatusContent )
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
        var existingFilesCount = this.socialStatus.socialStatusContents.size;
        if ( ( uploadedFilesCount + existingFilesCount ) > 4 ) {
            this.errorMessage = "You can upload maximum 4 images.";
            return false;
        } else if ( ( this.socialStatus.socialStatusContents.size == 1 ) && ( this.socialStatus.socialStatusContents[0].fileType == "video" ) ) {
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
                            let socialStatusContent = data[i];
                            //socialStatusContent.filePath = this.REST_URL+data[i].filePath+"?access_token="+this.accessToken+"&timestamp=" + new Date().getTime();
                            this.socialStatus.socialStatusContents.add( socialStatusContent );
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
        console.log( this.socialStatus );
        swal( { title: 'Updating Status', text: "Please Wait...", showConfirmButton: false, imageUrl: "http://rewardian.com/images/load-page.gif" });
        this.socialService.updateStatus( this.socialStatus )
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
        this.socialStatus.socialStatusContents = new Set<SocialStatusContent>();
        this.socialStatus.id = null;
        this.socialStatus.statusMessage = "";
        this.socialStatus.shareNow = true;

        //this.socialStatus.socialStatusProviders = new Set<SocialStatusProvider>();
        this.socialStatus.socialStatusProviders = this.listSocialStatusProviders();
    }

    listSocialStatusProviders() {
        let socialStatusProviders: Set<SocialStatusProvider> = new Set<SocialStatusProvider>();
        let socialStatusProvider1: SocialStatusProvider = new SocialStatusProvider();
        socialStatusProvider1.id = 1;
        socialStatusProvider1.providerName = "twitter";
        socialStatusProvider1.providerImagePath = "https://cdn0.iconfinder.com/data/icons/social-media-2098/512/twitter-32.png";
        socialStatusProvider1.profileImagePath = "https://instagram.fhyd2-1.fna.fbcdn.net/t51.2885-19/s150x150/13397667_966003090179916_1274276788_a.jpg";
        socialStatusProvider1.profileName = "@manassahoo9173";

        let socialStatusProvider2: SocialStatusProvider = new SocialStatusProvider();
        socialStatusProvider2.id = 2;
        socialStatusProvider2.providerName = "linkedin";
        socialStatusProvider2.providerImagePath = "https://cdn0.iconfinder.com/data/icons/social-media-2098/512/linkedin-32.png";
        socialStatusProvider2.profileImagePath = "https://pbs.twimg.com/profile_images/822508786975932418/INWa9whk.jpg";
        socialStatusProvider2.profileName = "@manas9173";

        socialStatusProviders.add( socialStatusProvider1 );
        socialStatusProviders.add( socialStatusProvider2 );

        return socialStatusProviders;
    }
    toggleScheduleDiv() {
        if ( this.socialStatus.shareNow )
            $( "#schedule-later-div" ).hide();
        else
            $( "#schedule-later-div" ).show();
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
                swal.close();
                this.videos = result.listOfMobinars;
                this.totalRecords = result.totalRecords;
                pagination.totalRecords = this.totalRecords;
                console.log( this.videos );
                pagination = this.pagerService.getPagedItems( pagination, this.videos );
            }),
            () => console.log( "load videos completed:" + this.videos );
    }

    setPage( page: number ) {
        if ( page < 1 || page > this.pager.totalPages ) {
            return;
        }
        this.listVideos( this.pagination );
    }

    setPagination( page: number ) {
        this.pager = this.pagerService.getPager( this.totalRecords, page, 10 );
        this.pagedItems = this.videos.slice( this.pager.startIndex, this.pager.endIndex + 1 );
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
        this.socialService.listEvents()
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
                flatpickr( '.flatpickr' );
                console.log( "listEvents() finished" )
            }
            );
    }
    editSocialStatus( socialStatus: SocialStatus ) {
        $( '#full-calendar-modal-event-' + socialStatus.id ).modal( 'hide' );
        $( 'html,body' ).animate( { scrollTop: 0 }, 'slow' );
        //this.initializeSocialStatus();
        this.socialStatus = socialStatus;
        this.socialStatus.socialStatusProviders = this.listSocialStatusProviders();

    }
    showScheduleOption( divId: string ) { $( '#' + divId ).removeClass( 'hidden' ); }
    hideScheduleOption( divId: string ) { $( '#' + divId ).addClass( 'hidden' ); }
    ngOnInit() {
        this.listEvents();
        this.constructCalendar();
        this.initializeSocialStatus();
        $( "#schedule-later-div" ).hide();

        $( document ).ready( function() {
            console.log( "ready!" );
        });


    }

    ngOnDestroy() {
        if ( this.videoJSplayer != undefined )
            this.videoJSplayer.dispose();
    }
}

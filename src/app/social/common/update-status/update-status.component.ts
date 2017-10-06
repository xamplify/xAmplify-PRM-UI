import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Logger } from 'angular2-logger/core';

import { SaveVideoFile } from "../../../videos/models/save-video-file";
import { SocialStatus } from "../../models/social-status";
import { SocialStatusContent } from "../../models/social-status-content";
import { SocialStatusProvider } from "../../models/social-status-provider";
import { ContactList } from '../../../contacts/models/contact-list';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { SocialService } from "../../services/social.service";
import { TwitterService } from "../../services/twitter.service";
import { FacebookService } from "../../services/facebook.service";
import { VideoFileService } from "../.././../videos/services/video-file.service";
import { ContactService } from "../.././../contacts/services/contact.service";

import { Pagination } from '../../../core/models/pagination';

declare var swal, $, flatpickr, videojs: any;
@Component({
    selector: 'app-update-status',
    templateUrl: './update-status.component.html',
    styleUrls: ['./update-status.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
    providers: [PagerService, Pagination]
})
export class UpdateStatusComponent implements OnInit {
    @Input('isSocialCampaign') isSocialCampaign: boolean = false;

    errorMessage: string;
    successMessage: string;
    errorDetails: Array<string> = [];

    pager: any = {};

    videoUrl: string;
    posterImage: string;
    videoJSplayer: any;
    selectedVideo: SaveVideoFile;

    socialStatus: SocialStatus = new SocialStatus();

    MEDIA_URL = this.authenticationService.MEDIA_URL;
    accessToken = this.authenticationService.access_token;
    profileImage: string;
    userId: number;

    contactListsPagination: Pagination = new Pagination();
    videosPagination: Pagination = new Pagination();

    constructor(private socialService: SocialService, private twitterService: TwitterService, private facebookService: FacebookService,
        private videoFileService: VideoFileService, private authenticationService: AuthenticationService,
        private contactService: ContactService,
        private pagerService: PagerService, private router: Router, private logger: Logger) {
    }

    previewVideo(videoFile: SaveVideoFile) {
        this.selectedVideo = videoFile;
        this.posterImage = this.selectedVideo.imagePath;
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf("."));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;

        this.videoJSplayer.play();
        $('tr').click(function () {
            $('input[type=radio]', this).attr('checked', 'checked');
        }
        );
    }

    addVideo() {
        console.log(this.socialStatus);
        this.errorMessage = "";
        if (this.socialStatus.socialStatusContents.length > 0 && (Array.from(this.socialStatus.socialStatusContents)[0].fileType != "video")) {
            this.errorMessage = "You can include up to 4 photos or 1 video in a Tweet.";
        } else {
            this.socialStatus.statusMessage = this.selectedVideo.title;
            let socialStatusContent: SocialStatusContent = new SocialStatusContent();
            socialStatusContent.id = this.selectedVideo.id;
            socialStatusContent.fileName = this.selectedVideo.title;
            socialStatusContent.fileType = "video";
            socialStatusContent.filePath = this.videoUrl;
            this.socialStatus.socialStatusContents.push(socialStatusContent);
        }
        $('#listVideosModal').modal('hide');
    }

    removeItem(i: number, socialStatusContent: SocialStatusContent) {
        console.log(socialStatusContent + "" + i);
        this.socialService.removeMedia(socialStatusContent.fileName)
            .subscribe(
            data => {
                $("#preview-" + i).remove('slow');
                this.socialStatus.socialStatusContents.splice(i);
                this.errorMessage = '';
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }
    validateImageUpload(files: any) {
        this.errorMessage = '';
        this.errorDetails = [];
        const uploadedFilesCount = files.length;
        const existingFilesCount = this.socialStatus.socialStatusContents.length;
        if ((uploadedFilesCount + existingFilesCount) > 4) {
            this.errorMessage = 'You can upload maximum 4 images.';
            return false;
        } else if ((this.socialStatus.socialStatusContents.length === 1) && 
                    (Array.from(this.socialStatus.socialStatusContents)[0].fileType === 'video')) {
            this.errorMessage = 'You can include up to 4 photos or 1 video in a Tweet.';
            return false;
        } else {
            for (let file of files) {
                if (file.size > 3145728) {
                    // File size should not be more than 3 MB
                    this.errorMessage = 'Accepted Image Size <= 3MB';
                    this.errorDetails.push("The Uploaded Image: " + file.name + " size is " + Math.round(file.size / 1024 / 1024 * 100) / 100 + " MB");
                    return false;
                }
                console.log(file.name + ': ' + file.size);
            }
            return true;
        }
    }
    fileChange(event: any) {
        const files = event.target.files;
        if (this.validateImageUpload(files)) {
            if (files.length > 0) {
                const formData: FormData = new FormData();
                for (let file of files) {
                    formData.append('files', file, file.name);
                }

                this.socialService.uploadMedia(formData)
                    .subscribe(
                    data => {
                        for (let i in data) {
                            const socialStatusContent = data[i];
                            this.socialStatus.socialStatusContents.push(socialStatusContent);
                        }
                        console.log(this.socialStatus);
                    },
                    error => console.log(error),
                    () => console.log('Finished')
                    );
            }
        }

    }

    updateAgain(socialStatus: SocialStatus) {
        this.initializeSocialStatus();
        this.socialStatus.statusMessage = socialStatus.statusMessage;
        this.socialStatus.shareNow = true;

        this.updateStatus();
    }

    updateStatus() {
        let socialStatusProviders = this.socialStatus.socialStatusProviders;
        socialStatusProviders = socialStatusProviders.filter(function (obj) {
            return obj.selected === true;
        });
        this.socialStatus.socialStatusProviders = socialStatusProviders;
        console.log(this.socialStatus);
        swal({ title: 'Updating Status', text: "Please Wait...", showConfirmButton: false, imageUrl: "http://rewardian.com/images/load-page.gif" });
        this.socialService.updateStatus(this.userId, this.socialStatus)
            .subscribe(
            data => {
                this.initializeSocialStatus();
                $('#full-calendar').fullCalendar('removeEvents');
                // this.listEvents();
                swal("Status posted Successfully", "", "success");
            },
            error => {
                console.log(error);
                swal("Error while posting the update.", "", "error");
            },
            () => console.log('Finished')
            );
    }

    schedule() {
        this.socialStatus.shareNow = false;
        this.updateStatus();
    }

    deleteStatus(socialStatus: SocialStatus) {
        console.log(this.socialStatus);
        this.socialService.deleteStatus(socialStatus)
            .subscribe(
            data => {
                $('#full-calendar').fullCalendar('removeEvents');
                // this.listEvents();
            },
            error => console.log(error),
            () => console.log('Finished')
            );
    }

    initializeSocialStatus() {
        this.socialStatus.socialStatusContents = new Array<SocialStatusContent>();
        this.socialStatus.id = null;
        this.socialStatus.statusMessage = '';
        this.socialStatus.shareNow = true;

        this.listSocialStatusProviders();
    }

    listSocialConnections() {
        this.socialService.listAccounts(this.userId, 'ALL', 'ALL')
            .subscribe(
            result => {
                this.socialService.socialConnections = result;
            },
            error => console.log(error),
            () => {
                this.initializeSocialStatus();
            });
    }

    listSocialStatusProviders() {
        const socialConnections = this.socialService.socialConnections;
        this.socialStatus.socialStatusProviders = new Array<SocialStatusProvider>();
        for (const i in socialConnections) {
            if (socialConnections[i].active) {
                const socialStatusProvider = new SocialStatusProvider();
                socialStatusProvider.socialConnection = socialConnections[i];
                this.socialStatus.socialStatusProviders.push(socialStatusProvider);
            }
        }
    }
    openListVideosModal() {
        $('#listVideosModal').modal('show');
        if (this.videosPagination.pagedItems.length == 0) {
            $("#preview-section").hide();
            this.listVideos(this.videosPagination);
        }
    }
    listVideos(videosPagination: Pagination) {
        this.videoFileService.loadVideoFiles(videosPagination)
            .subscribe((result: any) => {
                if (result.totalRecords > 0) {
                    $("#preview-section").show();
                    videosPagination.totalRecords = result.totalRecords;
                    videosPagination = this.pagerService.getPagedItems(videosPagination, result.listOfMobinars);


                    $('head').append('<script src=" assets/js/indexjscss/webcam-capture/video.min.js"" type="text/javascript"  class="profile-video"/>');
                    this.videoJSplayer = videojs("videojs-video");
                    this.previewVideo(videosPagination.pagedItems[0]);
                }
            }),
            () => console.log('listVideos() completed:');
    }

    setPageVideos(page: number) {
        if (page !== this.videosPagination.pageIndex) {
            this.videosPagination.pageIndex = page;
            this.listVideos(this.videosPagination);
        }
    }
    
    setPageContacts(page: number){
        if (page !== this.contactListsPagination.pageIndex) {
            this.contactListsPagination.pageIndex = page;
            this.loadContactLists(this.contactListsPagination);
        }
    }

    editSocialStatus(socialStatus: SocialStatus) {
        $('#full-calendar-modal-event-' + socialStatus.id).modal('hide');
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        //this.initializeSocialStatus();
        this.socialStatus = socialStatus;
        this.listSocialStatusProviders();

    }

    showScheduleOption(divId: string) { $('#' + divId).removeClass('hidden'); }
    hideScheduleOption(divId: string) { $('#' + divId).addClass('hidden'); }

    videoPlayListSource(videoUrl: string) {
        this.videoUrl = videoUrl;
        const self = this;
        this.videoJSplayer.playlist([{ sources: [{ src: self.videoUrl, type: 'application/x-mpegURL' }] }]);
    }

    loadContactLists(contactListsPagination: Pagination) {
        this.contactService.loadContactLists(contactListsPagination)
            .subscribe(
                (data: any) => {
                    contactListsPagination.totalRecords = data.totalRecords;
                    contactListsPagination = this.pagerService.getPagedItems(contactListsPagination, data.listOfUserLists);
                },
                (error: any) => {
                    this.logger.error(error);
                },
                () => this.logger.info("MangeContactsComponent loadContactLists() finished")
            )
    }

    ngOnInit() {
        this.userId = this.authenticationService.getUserId();
        this.listSocialConnections();

        $("#schedule-later-div").hide();

        if (this.isSocialCampaign)
            this.loadContactLists(this.contactListsPagination);
    }

    ngOnDestroy() {
        if (this.videoJSplayer != undefined)
            this.videoJSplayer.dispose();
        $('.profile-video').remove();
    }
}

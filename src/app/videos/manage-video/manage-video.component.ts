import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveVideoFile } from '.././models/save-video-file';
import { Category } from '.././models/category';
import { Pagination } from '../../core/models/pagination';
import { VideoFileService } from '.././services/video-file.service';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { VideoUtilService } from '../services/video-util.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { HomeComponent } from '../../core/home/home.component';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var swal, QuickSidebar, Metronic, Demo, Layout, Index, $: any;

@Component({
    selector: 'app-manage-video',
    templateUrl: './manage-video.component.html',
    styleUrls: ['./manage-video.component.css'],
    providers: [Pagination, HttpRequestLoader, HomeComponent]
})
export class ManageVideoComponent implements OnInit, OnDestroy {
    manageVideos = true;
    editVideo = false;
    playVideo = false;
    campaignReport = false;
    selectedVideo: SaveVideoFile;
    categories: Category[];
    showUpdatevalue = false;
    showMessage = false;
    showVideoFileName: string;
    categoryNum: number;
    checkTotalRecords: boolean;
    allRecords: number;
    deletedVideo = false;
    campaignVideo = false;
    campaignVideoMesg: string;
    disableDropDowns: boolean;
    hasVideoRole = false;
    hasStatsRole = false;
    hasCampaignRole = false;
    loggedInUserId = 0;
    loggedUserName: string;
    hasAllAccess = false;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    sortVideos: any;
    videoSort: any;
    videoType: any;
    isListView = false;
    isPartner = false;
    videoTypes = [{ 'name': 'My Videos', 'value': 'myVideos' }, { 'name': 'Partner Videos', 'value': 'partnerVideos' }];

    constructor(public videoFileService: VideoFileService, public referenceService: ReferenceService,
        public authenticationService: AuthenticationService, public videoUtilService: VideoUtilService,
        public pagerService: PagerService, public pagination: Pagination, public router: Router,
        public xtremandLogger: XtremandLogger, public homeComponent: HomeComponent) {
        console.log('MangeVideosComponent : constructor ');
        this.loggedInUserId = this.authenticationService.getUserId();
        this.loggedUserName = this.authenticationService.user.emailId;
        this.isPartner = this.authenticationService.isOnlyPartner();
        this.defaultBannerMessageValues();
        this.sortVideos = this.videoUtilService.sortVideos;
        this.videoSort = this.sortVideos[0];
        this.categoryNum = this.videoFileService.categoryNumber = 0;
        this.videoType = this.videoTypes[0];
        this.videoFileService.videoType = this.videoTypes[0].value;
        if(this.isPartner){ this.videoFileService.videoType = 'partnerVideos'; }
    }
    defaultBannerMessageValues() {
        this.showMessage = this.showUpdatevalue = false;
    }
    getVideoTypes() {
        this.pagination.pageIndex = 1;
        this.videoFileService.categoryNumber = this.categoryNum = 0;
        this.pagination.searchKey = null;
        this.videoSort = this.sortVideos[0];
        console.log(this.videoType);
        this.videoFileService.videoType = this.videoType.value;
        this.loadVideos(this.pagination);
    }
    ngOnInit() {
        this.isListView = this.referenceService.isListView;
        QuickSidebar.init();
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roles.statsRole);
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.hasAllAccess = this.referenceService.hasAllAccess();
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        Metronic.init();
        Layout.init();
        Demo.init();
        Index.init();
        if (this.referenceService.homeMethodsCalled === false) {
            this.homeComponent.getVideoTitles();
            this.homeComponent.getCategorisService();
            this.referenceService.homeMethodsCalled = true;
        }
        this.xtremandLogger.log(this.referenceService.videoTitles);
        this.xtremandLogger.log('MangeVideosComponent ngOnInit()');
        try {
            if (this.videoFileService.actionValue === 'Save') {
                this.referenceService.loading(this.httpRequestLoader, true);
                this.showVideosPage(false, true, false, false);
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showMessage = this.videoFileService.showSave; // true
                this.showUpdatevalue = this.videoFileService.showUpadte; // false
            }
            if (this.videoFileService.actionValue !== 'Save' || this.videoFileService.actionValue === undefined) {
                this.showVideosPage(true, false, false, false);
                this.defaultBannerMessageValues();
            }
            this.checkTotalRecords = true;
            this.loadVideosCount(this.authenticationService.user.id);
            this.loadVideos(this.pagination);
            if (this.videoUtilService.selectedVideo) {
                this.showCampaignVideoReport(this.videoUtilService.selectedVideo);
            }
        } catch (error) {
            this.xtremandLogger.error('error in ng oninit :' + error);
        }
    }
    loadVideosCount(userId: number) {
        try {
            this.videoFileService.loadVideosCount(userId)
                .subscribe((result: any) => {
                    if (result.videos_count === 0) {
                        this.disableDropDowns = true;
                    } else { this.disableDropDowns = false; }
                },
                (error: any) => {
                    this.xtremandLogger.error(' manage Videos Component : Loading Videos count method():' + error);
                    this.xtremandLogger.errorPage(error);
                },
                () => console.log('load videos completed:')
                );
        } catch (error) {
            this.xtremandLogger.error('erro in load videos :' + error);
        }
    }
    loadVideos(pagination: Pagination) {
        this.pagination.maxResults = 12;
        try {
            this.referenceService.loading(this.httpRequestLoader, true);
            this.videoFileService.loadVideoFiles(pagination)
                .subscribe((result: any) => {
                    pagination.totalRecords = result.totalRecords;
                    if (this.checkTotalRecords) {
                        this.allRecords = result.totalRecords;
                        this.checkTotalRecords = false;
                    }
                    this.categories = result.categories;
                    console.log(this.categories);
                    this.categories.sort(function (a: any, b: any) { return (a.id) - (b.id); });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    pagination = this.pagerService.getPagedItems(pagination, result.listOfMobinars);
                },
                (error: any) => {
                    this.xtremandLogger.error('Manage-videos component:  Loading Videos():' + error);
                    this.xtremandLogger.errorPage(error);
                },
                () => console.log('load videos completed:')
                );
        } catch (error) {
            this.xtremandLogger.error('erro in load videos :' + error);
        }
    };
    titleCheckLength(title: string) {
        if (title.length > 22) { title = title.substring(0, 21) + '...'; }
        return title;
    }
    setPage(event: any) {
        console.log(event.page, event.type);
        this.pagination.pageIndex = event.page;
        this.loadVideos(this.pagination);
        this.defaultBannerMessageValues();
    }
    getCategoryNumber() {
        this.defaultBannerMessageValues();
        console.log(this.categoryNum);
        this.videoFileService.categoryNumber = this.categoryNum;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    searchVideoTitelName() {
        this.defaultBannerMessageValues();
        this.xtremandLogger.info(this.pagination.searchKey);
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    selectedSortByValue(event: any) {
        this.defaultBannerMessageValues();
        this.videoSort = event;
        const sortedValue = this.videoSort.value;
        let sortcolumn, sortingOrder: any;
        if (sortedValue !== '') {
            const options: string[] = sortedValue.split('-');
            sortcolumn = options[0];
            sortingOrder = options[1];
        } else {
            sortcolumn = sortingOrder = null;
        }
        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = sortcolumn;
        this.pagination.sortingOrder = sortingOrder;
        this.loadVideos(this.pagination);
    }
    showEditVideo(video: SaveVideoFile) {
        this.referenceService.loading(this.httpRequestLoader, true);
        console.log('show edit video method in mange videos ' + JSON.stringify(video));
        this.closeBannerPopup();
        this.videoFileService.videoViewBy = video.viewBy;
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((editVideoFile: SaveVideoFile) => {
                console.log('enter the show edit vidoe method');
                this.referenceService.loading(this.httpRequestLoader, false);
                if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                    editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                }
                this.videoFileService.saveVideoFile = editVideoFile;
                console.log('show edit vidoe object :');
                console.log(this.videoFileService.saveVideoFile);
                this.videoFileService.actionValue = 'Update';
                this.showVideosPage(false, true, false, false);
            },
            (error: any) => {
                this.xtremandLogger.error('Error In: show edit videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    showPlayVideo(video: SaveVideoFile) {
        this.closeBannerPopup();
        this.referenceService.loading(this.httpRequestLoader, true);
        this.videoFileService.videoViewBy = video.viewBy;
        console.log('MangeVideoComponent playVideo:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((playVideoFile: SaveVideoFile) => {
                console.log(playVideoFile);
                this.selectedVideo = playVideoFile;
                this.selectedVideo.uploadedUserId = video.uploadedUserId;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showVideosPage(false, false, true, false);
            },
            (error: any) => {
                this.xtremandLogger.error('Error In: show play videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    showCampaignVideoReport(video: SaveVideoFile) {
        this.closeBannerPopup();
        this.referenceService.loading(this.httpRequestLoader, true);
        console.log('ManageVideoComponent campaign report:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((campaignVideoFile: SaveVideoFile) => {
                console.log(video);
                this.selectedVideo = campaignVideoFile;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showVideosPage(false, false, false, true);
                this.videoUtilService.selectedVideo = null;
            },
            (error: any) => {
                this.xtremandLogger.error(' Error In :show video campaign videos ():' + error);
                this.xtremandLogger.errorPage(error);
            });
    }
    campaignRouter(video: SaveVideoFile) {
        console.log('ManageVideoComponent campaign router:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((videoFile: SaveVideoFile) => {
                console.log(video);
                this.referenceService.campaignVideoFile = videoFile;
                this.referenceService.selectedCampaignType = 'video';
                this.referenceService.isCampaignFromVideoRouter = true;
                this.router.navigateByUrl('/home/campaigns/create');
            },
            (error: string) => {
                this.xtremandLogger.error('Error In: show campaign videos ():' + error);
                this.xtremandLogger.errorPage(error);
            });
    }
    videoTitleLength(title: string) {
        if (title.length > 50) { title = title.substring(0, 50) + '.....'; }
        return title;
    }
    deleteVideoFile(alias: string, position: number, videoName: string) {
        console.log('MangeVideoComponent deleteVideoFile alias # ' + alias + ', position # ' + position);
        this.videoFileService.deleteVideoFile(alias)
            .subscribe(
            data => {
                console.log(data);
                console.log('MangeVideoComponent deleteVideoFile success : ' + data);
                this.pagination.pagedItems.splice(position, 1);
                this.defaultBannerMessageValues();
                this.deletedVideo = true;
                this.showVideoFileName = this.videoTitleLength(videoName);
                this.loadVideosCount(this.authenticationService.user.id);
                $('html,body').animate({ scrollTop: 0 }, 'slow');
                this.loadVideos(this.pagination);
                if (this.pagination.pagedItems.length === 0) {
                    this.pagination.pageIndex = 1;
                    this.loadVideos(this.pagination);
                }
                setTimeout(function () {
                    $('#deleteMesg').slideUp(500);
                }, 5000);
            },
            (error: any) => {
                if (error.search('mobinar is being used in one or more campaigns. Please delete those campaigns') === -1) {
                    this.xtremandLogger.error('Error In : delete videos ():' + error);
                    this.referenceService.showServerError(this.httpRequestLoader);
                    this.httpRequestLoader.statusCode = error.status;
                } else if (error.search('mobinar is being used in one or more campaigns. Please delete those campaigns') !== -1) {
                    const message = error.replace('mobinar', 'video');
                    this.campaignVideoMesg = message;
                    this.defaultBannerMessageValues();
                    this.campaignVideo = true;
                    $('html,body').animate({ scrollTop: 0 }, 'slow');
                    setTimeout(function () {
                        $('#campaignVideo').slideUp(500);
                    }, 5000);
                } else {
                    this.xtremandLogger.error('Error In: delete videos ():' + error);
                    this.xtremandLogger.errorPage(error);
                }
                console.log(error);
            },
            () => console.log('deleted functionality done')
            );
        this.closeBannerPopup();
    }
    deleteVideoAlert(alias: string, position: number, videoName: string) {
        console.log('videoId in sweetAlert()');
        const self = this;
        swal({
            title: 'Are you sure?',
            text: 'You wont be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (myData: any) {
            console.log('ManageVidoes showAlert then()' + myData);
            self.deleteVideoFile(alias, position, videoName);
        });
    }
    closeBannerPopup() {
        this.campaignVideo = this.deletedVideo = false;
    }
    getVideoType() {
        this.videoType = this.videoFileService.videoType;
        if (this.videoType === this.videoTypes[0].value) {
        this.videoType = this.videoTypes[0];
        } else { this.videoType = this.videoTypes[1]; }
    }
    update(videoFile: SaveVideoFile) {
        this.videoType = this.videoFileService.videoType;
        this.getVideoType();
        this.deletedVideo = this.campaignVideo = false;
        if (videoFile != null) { this.homeComponent.getVideoTitles(); }
        this.pagination.pageIndex = 1;
        this.videoSort = this.sortVideos[0];
        this.pagination.sortcolumn = null;
        this.pagination.sortingOrder = null;
        this.categoryNum = this.videoFileService.categoryNumber = 0;
        this.pagination.searchKey = null;
        this.loadVideos(this.pagination);
        this.showVideosPage(true, false, false, false);
        this.showMessage = this.videoFileService.showSave; // boolean
        this.showUpdatevalue = this.videoFileService.showUpadte; // boolean
        const timevalue = this;
        setTimeout(function () {
            if (timevalue.showUpdatevalue === true) {
                $('#showUpdatevalue').slideUp(500);
            } else { $('#message').slideUp(500); };
        }, 5000);
        if (videoFile == null) {
            this.showVideoFileName = '';
        } else { this.showVideoFileName = this.videoTitleLength(videoFile.title); }
        this.xtremandLogger.info('update method called ' + this.showVideoFileName);
    }
    showVideosPage(manageVideos: boolean, editVideo: boolean, playVideo: boolean, campaignReport: boolean) {
        this.manageVideos = manageVideos;
        this.editVideo = editVideo;
        this.playVideo = playVideo;
        this.campaignReport = campaignReport;
    }
    backToManageVideos() {
        this.videoType = this.videoFileService.videoType;
        this.getVideoType();
        console.log('come to goto manage videos :');
        this.videoUtilService.selectedVideo = null;
        if (!this.manageVideos) { this.loadVideos(this.pagination); }
        this.showVideosPage(true, false, false, false);
        this.defaultBannerMessageValues();
        this.deletedVideo = this.campaignVideo = false;
        this.videoFileService.actionValue = '';
    }
    gotoHome() {
        this.videoUtilService.selectedVideo = null;
        this.router.navigate(['./home/dashboard']);
    }
    ngOnDestroy() {
        swal.close();
        this.videoFileService.actionValue = this.videoFileService.videoViewBy = '';
        this.deletedVideo = false;
    }
}

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
    deviceInfo = null;
    manageVideos = true;
    editVideo = false;
    playVideo = false;
    campaignReport = false;
    videos: Array<SaveVideoFile>;
    cancel = false;
    editDetails: SaveVideoFile;
    selectedVideo: SaveVideoFile;
    dropdownTogglevalue = false;
    categories: Category[];
    filteredCatergories: Array<Category>;
    showUpdatevalue = false;
    showMessage = false;
    imagepath: string;
    pagedItems: any[];
    isvideosLength: boolean;
    selectedVideoFile: SaveVideoFile;
    pageBar: boolean;
    showVideoName: string;
    public totalRecords: number;
    categoryNum: number;
    public isCategoryUpdated: boolean;
    categoryAnother = 'All Categories';
    public searchKey: string;
    sortingName: string = null;
    sortcolumn: string = null;
    sortingOrder: string = null;
    isvideoThere: boolean;
    public isCategoryThere: boolean;
    public checkTotalRecords: boolean;
    public allRecords: number;
    public searchDisable = true;
    public deletedVideo = false;
    public deleteVideoName: string;
    public campaignVideo = false;
    public campaignVideoMesg: string;
    public locationJson: any;
    public allVideosCount: any;
    public disableDropDowns: boolean;
    hasVideoRole = false;
    hasStatsRole = false;
    hasCampaignRole = false;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    public errorPrepender: 'Error In:';
    sortVideos = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Title(A-Z)', 'value': 'title-ASC' },
        { 'name': 'Title(Z-A)', 'value': 'title-DESC' },
        { 'name': 'Created Time(ASC)', 'value': 'createdTime-ASC' },
        { 'name': 'Created Time(DESC)', 'value': 'createdTime-DESC' },
        { 'name': 'ViewBy(ASC)', 'value': 'viewBy-ASC' },
        { 'name': 'ViewBy(DESC)', 'value': 'viewBy-DESC' },
    ];
    public videoSort: any = this.sortVideos[0];
    constructor(public videoFileService: VideoFileService, public referenceService: ReferenceService,
        public authenticationService: AuthenticationService, public videoUtilService: VideoUtilService,
        public pagerService: PagerService, public pagination: Pagination,
        public router: Router, public xtremandLogger: XtremandLogger, public homeComponent: HomeComponent) {
        console.log('MangeVideosComponent : constructor ');
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.isvideosLength = false;
        this.pageBar = false;
        this.isvideoThere = false;
        this.categoryNum = this.videoFileService.categoryNumber = 0;
        this.isCategoryThere = false;
        this.searchKey = null;
    }
    ngOnInit() {
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roleName.videRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roleName.statsRole);
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roleName.campaignRole);
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        Metronic.init();
        Layout.init();
        Demo.init();
        Index.init();
        QuickSidebar.init();
        if (this.referenceService.homeMethodsCalled === false) {
            this.homeComponent.getVideoTitles();
            this.homeComponent.getCategorisService();
            this.referenceService.homeMethodsCalled = true;
        }
        console.log(this.referenceService.videoTitles);
        console.log('MangeVideosComponent ngOnInit()');
        this.xtremandLogger.log('This is a priority level 5 log message...');
        try {
            if (this.videoFileService.actionValue === 'Save') {
                this.referenceService.loading(this.httpRequestLoader, true);
                console.log('MangeVideosComponent : ngonit ');
                this.editVideo = true;
                this.manageVideos = false;
                this.playVideo = false;
                this.campaignReport = false;
                console.log('opening edit video');
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showMessage = this.videoFileService.showSave; // true
                this.showUpdatevalue = this.videoFileService.showUpadte; // false
            }
            console.log('manage videos js started');
            if (this.videoFileService.actionValue !== 'Save' || this.videoFileService.actionValue === undefined) {
                this.manageVideos = true;
                this.editVideo = false;
                this.playVideo = false;
                this.campaignReport = false;
                this.showMessage = false;
                this.showUpdatevalue = false;
            }
            this.checkTotalRecords = true;
            this.loadVideosCount(this.authenticationService.user.id);
            this.loadVideos(this.pagination);
            console.log('manage videos ngOnInit completed');
        } catch (error) {
            this.xtremandLogger.error('erro in ng oninit :' + error);
        }
    }
    loadVideosCount(userId: number) {
        try {
            this.videoFileService.loadVideosCount(userId)
                .subscribe((result: any) => {
                    this.allVideosCount = result.videos_count;
                    if (this.allVideosCount === 0) {
                        this.disableDropDowns = true;
                    } else { this.disableDropDowns = false; }
                },
                (error: any) => {
                    this.xtremandLogger.error(' manage Videos Component : Loading Videos method():' + error);
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
                    this.videos = result.listOfMobinars;
                    this.totalRecords = result.totalRecords;
                    pagination.totalRecords = this.totalRecords;
                    if (this.checkTotalRecords === true) {
                        this.allRecords = this.totalRecords;
                        this.checkTotalRecords = false;
                    }
                    if (this.isCategoryThere === false || this.isCategoryUpdated === true) {
                        this.categories = result.categories;
                        this.categories.sort(function (a: any, b: any) { return (a.id) - (b.id); });
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                    console.log(this.categories);
                    console.log(this.videos);
                    if (this.videos.length !== 0) {
                        this.isvideoThere = false;
                    } else {
                        this.isvideoThere = true;
                        this.pagedItems = null;
                    }
                    if (this.videos.length === 0) {
                        this.isvideosLength = true;
                    } else {
                        this.isvideosLength = false;
                    }
                    for (let i = 0; i < this.videos.length; i++) {
                        this.imagepath = this.videos[i].imagePath + '?access_token=' + this.authenticationService.access_token;
                        this.videos[i].imagePath = this.imagepath;
                    }
                    this.isCategoryThere = true;
                    this.isCategoryUpdated = false;
                    pagination = this.pagerService.getPagedItems(pagination, this.videos);
                    this.referenceService.loading(this.httpRequestLoader, false);
                },
                (error: any) => {
                    this.xtremandLogger.error('Manage-videos component:  Loading Videos():' + error);
                    this.xtremandLogger.errorPage(error);
                },
                () => console.log('load videos completed:' + this.videos)
                );
        } catch (error) {
            this.xtremandLogger.error('erro in load videos :' + error);
        }
    };
    titleCheckLength(title: string) {
        if (title.length > 25) { title = title.substring(0, 24) + '...'; }
        return title;
    }
    setPage(page: number) {
        if (page !== this.pagination.pageIndex) {
            this.pagination.pageIndex = page;
            this.loadVideos(this.pagination);
            this.showUpdatevalue = false;
            this.showMessage = false;
        }
    }
    getCategoryNumber() {
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.isvideoThere = false;
        console.log(this.categoryNum);
        this.videoFileService.categoryNumber = this.categoryNum;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    searchKeyValue() {
        this.pagination.searchKey = this.searchKey;
    }
    searchVideoTitelName() {
        this.showMessage = false;
        this.showUpdatevalue = false;
        console.log(this.searchKey);
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    selectedSortByValue(event: any) {
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.videoSort = event;
        const sortedValue = this.videoSort.value;
        if (sortedValue !== '') {
            const options: string[] = sortedValue.split('-');
            this.sortcolumn = options[0];
            this.sortingOrder = options[1];
        } else {
            this.sortcolumn = null;
            this.sortingOrder = null;
        }
        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = this.sortcolumn;
        this.pagination.sortingOrder = this.sortingOrder;
        this.loadVideos(this.pagination);
    }
    showEditVideo(video: SaveVideoFile) {
        this.referenceService.loading(this.httpRequestLoader, true);
        console.log('show edit video method in mange videos ' + JSON.stringify(video));
        console.log(video.alias);
        this.deletedVideo = false;
        this.selectedVideoFile = video;
        this.videoFileService.videoViewBy = video.viewBy;
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((editVideoFile: SaveVideoFile) => {
                console.log('enter the show edit vidoe method');
                this.editDetails = editVideoFile;
                this.referenceService.loading(this.httpRequestLoader, false);
                if (editVideoFile.imageFiles == null) {
                    editVideoFile.imageFiles = [];
                }
                if (editVideoFile.gifFiles == null) { editVideoFile.gifFiles = []; }
                this.videoFileService.saveVideoFile = this.editDetails;
                console.log('show edit vidoe object :');
                console.log(this.videoFileService.saveVideoFile);
                this.videoFileService.actionValue = 'Update';
                this.editVideo = true;
                this.manageVideos = false;
                this.playVideo = false;
                this.campaignReport = false;
            },
            (error: any) => {
                this.xtremandLogger.error(this.errorPrepender + 'show edit videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    showPlayVideo(video: SaveVideoFile) {
        this.referenceService.loading(this.httpRequestLoader, true);
        this.videoFileService.videoViewBy = video.viewBy;
        console.log('MangeVideoComponent playVideo:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((playVideoFile: SaveVideoFile) => {
                console.log(playVideoFile);
                this.selectedVideo = playVideoFile;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.manageVideos = false;
                this.editVideo = false;
                this.playVideo = true;
                this.campaignReport = false;
                this.pageBar = true;
                this.deletedVideo = false;
            },
            (error: any) => {
                this.xtremandLogger.error(this.errorPrepender + ' show play videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    showCampaignVideoReport(video: SaveVideoFile) {
        this.referenceService.loading(this.httpRequestLoader, true);
        console.log('ManageVideoComponent campaign report:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((campaignVideoFile: SaveVideoFile) => {
                console.log(video);
                this.selectedVideo = campaignVideoFile;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.campaignReport = true;
                this.manageVideos = false;
                this.editVideo = false;
                this.playVideo = false;
                this.pageBar = true;
                this.deletedVideo = false;
            },
            (error: any) => {
                this.xtremandLogger.error(this.errorPrepender + ' show video campaign videos ():' + error);
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
                this.router.navigateByUrl('/home/campaigns/create-campaign');
            },
            (error: string) => {
                this.xtremandLogger.error(this.errorPrepender + ' show campaign videos ():' + error);
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
                this.deletedVideo = true;
                this.deleteVideoName = this.videoTitleLength(videoName);
                this.loadVideosCount(this.authenticationService.user.id);
                this.loadVideos(this.pagination);
                if (this.pagination.pagedItems.length === 0) {
                    this.isvideoThere = true;
                    this.pagination.pageIndex = 1;
                    this.loadVideos(this.pagination);
                }
                setTimeout(function () {
                    $('#deleteMesg').slideUp(500);
                }, 5000);
            },
            (error: any) => {
                if (error.search('mobinar is being used in one or more campaigns. Please delete those campaigns') === -1) {
                    this.xtremandLogger.error(this.errorPrepender + ' delete videos ():' + error);
                    this.referenceService.showServerError(this.httpRequestLoader);
                    this.httpRequestLoader.statusCode = error.status;
                } else if (error.search('mobinar is being used in one or more campaigns. Please delete those campaigns') !== -1) {
                    const message = error.replace('mobinar', 'video');
                    this.campaignVideoMesg = message;
                    this.campaignVideo = true;
                    setTimeout(function () {
                        $('#campaignVideo').slideUp(500);
                    }, 5000);
                } else {
                    this.xtremandLogger.error(this.errorPrepender + ' delete videos ():' + error);
                    this.xtremandLogger.errorPage(error);
                }
                console.log(error);
            },
            () => console.log('deleted functionality done')
            );
        this.deletedVideo = false;
        this.campaignVideo = false;
    }
    deleteAlert(alias: string, position: number, videoName: string) {
        console.log('videoId in sweetAlert()');
        const self = this;
        swal({
            title: 'Are you sure?',
            text: 'You wont be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (myData: any) {
            console.log('ManageVidoes showAlert then()' + myData);
            self.deleteVideoFile(alias, position, videoName);
        });
    }
    closeBannerPopup() {
        this.campaignVideo = false;
    }
    update(videoFile: SaveVideoFile) {
        this.isCategoryUpdated = true;
        this.campaignVideo = false;
        if (videoFile != null) { this.homeComponent.getVideoTitles(); }
        this.pagination.pageIndex = 1;
        this.pagination.sortcolumn = null;
        this.pagination.sortingOrder = null;
        this.videoFileService.categoryNumber = 0;
        this.searchKey = null;
        this.loadVideos(this.pagination);
        this.manageVideos = true;
        this.editVideo = false;
        this.campaignReport = false;
        this.playVideo = false;
        this.showMessage = this.videoFileService.showSave; // boolean
        this.showUpdatevalue = this.videoFileService.showUpadte; // boolean
        const timevalue = this;
        setTimeout(function () {
            if (timevalue.showUpdatevalue === true) {
                $('#showUpdatevalue').slideUp(500);
            } else { $('#message').slideUp(500); };
        }, 5000);

        if (videoFile == null) {
            this.showVideoName = '';
        } else {
            this.showVideoName = this.videoTitleLength(videoFile.title);
        }
        this.xtremandLogger.info('update method called ' + this.showVideoName);
    }
    backToManageVideos() {
        console.log('come to goto manage videos :');
        if (!this.manageVideos) { this.loadVideos(this.pagination); }
        this.manageVideos = true;
        this.editVideo = false;
        this.campaignReport = false;
        this.playVideo = false;
        this.pageBar = false;
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.deletedVideo = false;
        this.campaignVideo = false;
        this.videoFileService.actionValue = '';
    }
    ngOnDestroy() {
        this.videoFileService.actionValue = '';
        this.isvideoThere = false;
        this.deletedVideo = false;
        this.videoFileService.videoViewBy = '';
        swal.close();
    }

}

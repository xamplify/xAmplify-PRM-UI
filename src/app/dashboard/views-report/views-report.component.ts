import { Component, OnInit, OnDestroy } from '@angular/core';

import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { PagerService } from '../../core/services/pager.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { DashboardService } from '../dashboard.service';
import { ContactService } from '../../contacts/services/contact.service';

import { SaveVideoFile } from '../../videos/models/save-video-file';
import { Category } from '../../videos/models/category';
import { ContactList } from '../../contacts/models/contact-list';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

declare var Metronic, Layout, Demo, Index, QuickSidebar, videojs, $, Tasks: any;

@Component({
    selector: 'app-views-report',
    templateUrl: './views-report.component.html',
    styleUrls: ['./views-report.component.css'],
    providers: [Pagination, HttpRequestLoader, DashboardService]
})
export class ViewsReportComponent implements OnInit, OnDestroy {
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    public totalRecords: number;
    videos: Array<SaveVideoFile>;
    imagepath: string;
    public errorPrepender: 'Error In:';
    public videoJSplayer: any;
    categories: Category[];
    isvideoThere: boolean;
    showDatailedData: boolean;
    showVideoData: boolean;
    pagedItems: any[];
    public searchKey: string;
    sortingName: string = null;
    sortcolumn: string = null;
    sortingOrder: string = null;
    categoryNum: number;
    public currentPageType: string = null;
    public isCategoryThere: boolean;
    public isCategoryUpdated: boolean;
    emptyViewsRecord: boolean;
    public totalViewsForThisVideo: Array<ContactList>;

    launchVideoPreview: SaveVideoFile = new SaveVideoFile();
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

    sortContactUsers = [
        { 'name': 'Sort By', 'value': '' },
        { 'name': 'Email(A-Z)', 'value': 'emailId-ASC' },
        { 'name': 'Email(Z-A)', 'value': 'emailId-DESC' },
        { 'name': 'First Name(ASC)', 'value': 'firstName-ASC' },
        { 'name': 'First Name(DESC)', 'value': 'firstName-DESC' },
        { 'name': 'Last Name(ASC)', 'value': 'lastName-ASC' },
        { 'name': 'Last Name(DESC)', 'value': 'lastName-DESC' },
    ];
    public contactsUsersSort: any = this.sortContactUsers[0];


    constructor(public videoFileService: VideoFileService, public referenceService: ReferenceService,
        public dashboardService: DashboardService, public pagerService: PagerService, public contactService: ContactService,
        public logger: XtremandLogger, public pagination: Pagination, public authenticationService: AuthenticationService,
        public videoUtilService: VideoUtilService) {
        this.categoryNum = 0;
        this.isCategoryThere = false;
    }

    viewsSparklineData() {
        const myvalues = [2, 6, 12, 13, 12, 13, 7, 14, 13, 11, 11, 12, 17, 11, 11, 12, 15, 10];
        $('#sparkline_bar2').sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    minutesSparklineData() {
        const myvalues = [2, 11, 12, 13, 18, 13, 10, 4, 1, 11, 11, 12, 11, 4, 10, 12, 11, 8];
        $('#sparkline_bar2').sparkline(myvalues, {
            type: 'bar',
            width: '120',
            barWidth: 6,
            height: '111',
            barColor: '#f4f91b',
            negBarColor: '#e02222'
        });
    }

    averageSparklineData(videoFile: number) {
        const myvalues = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
        $('#sparkline_line_' + videoFile).sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }
    loadVideos(pagination: Pagination) {
        this.pagination.maxResults = 5;
        try {
            this.referenceService.loading(this.httpRequestLoader, true);
            this.videoFileService.loadVideoForViewsReport(pagination)
                .subscribe((result: any) => {
                    this.videos = result.listOfMobinars;
                    this.totalRecords = result.totalRecords;
                    pagination.totalRecords = this.totalRecords;
                    if (this.isCategoryThere === false || this.isCategoryUpdated === true) {
                        this.categories = result.categories;
                        this.categories.sort(function (a: any, b: any) { return (a.id) - (b.id); });
                    }
                    this.referenceService.loading(this.httpRequestLoader, false);
                    if (this.videos.length !== 0) {
                        this.isvideoThere = false;
                    } else {
                        this.isvideoThere = true;
                        this.pagedItems = null;
                    }
                    for (let i = 0; i < this.videos.length; i++) {
                        this.imagepath = this.videos[i].imagePath + '?access_token=' + this.authenticationService.access_token;
                        this.videos[i].imagePath = this.imagepath;
                    }
                    this.isCategoryThere = true;
                    this.isCategoryUpdated = false;
                    pagination = this.pagerService.getPagedItems(pagination, this.videos);
                },
                (error: string) => {
                    this.logger.error('error in videos: views report page' + error);
                    this.logger.errorPage(error);
                },
                () => console.log('load videos completed:' + this.videos),
            );
        } catch (error) {
            this.logger.error('erro in load videos :' + error);
        }
    };
    setPage(page: number) {
        this.pagination.pageIndex = page;
        if (this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
            this.loadVideos(this.pagination);
        } else if (this.currentPageType == "views_page" || (this.currentPageType == "views_page" && this.searchKey == "")) {
        }
    }
    getCategoryNumber() {
        this.isvideoThere = false;
        console.log(this.categoryNum);
        this.videoFileService.viewsCategoryNumber = this.categoryNum;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    searchVideoTitelName() {
        console.log(this.searchKey);
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
        if (this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
            this.loadVideos(this.pagination);
        } else if (this.currentPageType == "views_page" || (this.currentPageType == "views_page" && this.searchKey == "")) {
        }
    }
    selectedSortByValue(event: any) {
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
        if (this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
            this.loadVideos(this.pagination);
        } else if (this.currentPageType == "all_contacts" || (this.currentPageType == "all_contacts" && this.searchKey == "")) {
        }
    }
    userSelectedSortByValue(event: any) {
        this.contactsUsersSort = event;
        const sortedValue = this.contactsUsersSort.value;
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
    }

    showPreview(videoFile: SaveVideoFile) {
        this.appendVideoData(videoFile, "main_video", "modal-title");
        $("#show_preview").modal({ backdrop: 'static', keyboard: false });
    }
    destroyPreview() {
        var player = videojs("videoId");
        if (player) {
            console.log(player.currentType_);
            let videoType = player.currentType_;
            if (videoType == "application/x-mpegURL") {
                console.log("Clearing Normal Video");
                player.dispose();
                $("#main_video").empty();
            } else {
                console.log("Clearing 360 video");
                player.panorama({
                    autoMobileOrientation: true,
                    clickAndDrag: true,
                    clickToToggle: true,
                    callback: function () {
                        player.pause();
                        $("#main_video").empty();
                    }
                });
            }
        }
    }
    playVideo() {
        $('#main_video_src').empty();
        this.appendVideoData(this.launchVideoPreview, "main_video_src", "title");
    }
    appendVideoData(videoFile: SaveVideoFile, divId: string, titleId: string) {
        console.log(videoFile);
        var alias = videoFile.alias;
        var fullImagePath = videoFile.imagePath;
        var title = videoFile.title;
        var videoPath = videoFile.videoPath;
        var is360 = videoFile.is360video;
        $("#" + divId).empty();
        $("#" + titleId).empty();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" rel="stylesheet">');
        if (is360) {
            console.log("Loaded 360 Video");
            $('.h-video').remove();
            $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
            $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
            $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
            $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
            var str = '<video id=videoId poster=' + fullImagePath + '  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#" + titleId).append(title);
            $("#" + divId).append(str);
            console.log("360 video path" + videoPath);
            videoPath = videoPath.replace(".m3u8", ".mp4");
            console.log("Updated 360 video path" + videoPath);
            $("#" + divId + " video").append('<source src="' + videoPath + '" type="video/mp4">');
            var player = videojs('videoId');
            player.panorama({
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                callback: function () { player.ready(); }
            });
            $("#videoId").css("width", "550px");
            $("#videoId").css("height", "310px");
            $("#videoId").css("max-width", "100%");

        } else {
            console.log("Loaded Normal Video");
            $('.p-video').remove();
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video" />');
            var str = '<video id=videoId  poster=' + fullImagePath + ' preload="none"  class="video-js vjs-default-skin" controls></video>';
            $("#" + titleId).append(title);
            $("#" + divId).append(str);
            console.log("Video Path:::" + videoPath);
            videoPath = videoPath.substring(0, videoPath.lastIndexOf('.'));
            videoPath = videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
            console.log("Normal Video Updated Path:::" + videoPath);
            $("#" + divId + " video").append('<source src=' + videoPath + ' type="application/x-mpegURL">');
            $("#videoId").css("width", "550px");
            $("#videoId").css("height", "310px");
            $("#videoId").css("max-width", "100%");
            var document: any = window.document;
            var player = videojs("videoId");
            console.log(player);
            if (player) {
                player.on('fullscreenchange', function () {
                    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    var event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === "FullscreenOn") {
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    } else if (event === "FullscreenOff") {
                        $("#videoId").css("width", "550px");
                    }
                });
            }
        }
        $("video").bind("contextmenu", function () {
            return false;
        });
    }
    backToReport() {
        this.showDatailedData = false;
        this.showVideoData = true;
        this.pagination.sortcolumn = null;
        this.pagination.sortingOrder = null;
        this.loadVideos(this.pagination);
        this.currentPageType = null;
    }
    showViewsData() {
        this.showDatailedData = true;
        this.showVideoData = false;
        this.pagination.sortcolumn = null;
        this.pagination.sortingOrder = null;
        this.currentPageType = "views_page";
    }
    ngOnInit() {
        try {
            this.loadVideos(this.pagination);
            this.showVideoData = true;
            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            // Index.init();
            // Index.initDashboardDaterange();
            // Index.initCharts();
            // Index.initChat();
            // Index.initMiniCharts();
            // Tasks.initDashboardWidget();
            //  this.viewsSparklineData();
            this.minutesSparklineData();
            // this.averageSparklineData(videoFile);
        } catch (err) { }
    }
    ngOnDestroy() {
        $('#show_preview').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }

}

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
    imagepath: string;
    errorPrepender: 'Error In:';
    videoJSplayer: any;
    categories: Category[];
    showDatailedData: boolean;
    showVideoData: boolean;
    searchKey: string;
    sortingName: string = null;
    sortcolumn: string = null;
    sortingOrder: string = null;
    categoryNum: number;
    currentPageType: string = null;
    isCategoryThere: boolean;
    emptyViewsRecord: boolean;
    totalViewsForThisVideo: Array<ContactList>;
    launchVideoPreview: SaveVideoFile = new SaveVideoFile();
    sortVideos: any;
    videoSort: any;
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
        this.sortVideos = this.videoUtilService.sortVideos;
        this.videoSort = this.sortVideos[0];
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

    averageSparklineData(videos: any) {
        const myvalues = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
        for (let i = 0; i < videos.length; i++) {
            $('#' + videos.id).sparkline(myvalues, {
                type: 'bar',
                width: '100',
                barWidth: 5,
                height: '55',
                barColor: '#35aa47',
                negBarColor: '#e02222'
            });
        }
    }
    loadVideos(pagination: Pagination) {
        this.pagination.maxResults = 5;
        try {
            this.referenceService.loading(this.httpRequestLoader, true);
            this.videoFileService.loadVideoForViewsReport(pagination)
                .subscribe((result: any) => {
                    pagination.totalRecords = result.totalRecords;
                    this.referenceService.loading(this.httpRequestLoader, false);
                    if (!this.isCategoryThere) {
                        this.categories = result.categories;
                        this.categories.sort(function (a: any, b: any) { return (a.id) - (b.id); });
                        this.isCategoryThere = true;
                    }
                    pagination = this.pagerService.getPagedItems(pagination, result.listOfMobinars);
                },
                (error: string) => {
                    this.logger.error('error in videos: views report page' + error);
                    this.logger.errorPage(error);
                },
                () => console.log('load videos completed:'),
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
        console.log(this.categoryNum);
        this.videoFileService.viewsCategoryNumber = this.categoryNum;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    searchKeyValue() {
        this.pagination.searchKey = this.searchKey;
    }
    searchVideoTitelName() {
        this.pagination.pageIndex = 1;
        if (this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
            this.loadVideos(this.pagination);
        } else if (this.currentPageType == "views_page" || (this.currentPageType == "views_page" && this.searchKey == "")) {
        }
    }
    selectedSortByValue(event: any) {
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
        if (this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
            this.loadVideos(this.pagination);
        } else if (this.currentPageType == "all_contacts" || (this.currentPageType == "all_contacts" && this.searchKey == "")) {
        }
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
            this.videoUtilService.player360VideoJsFiles();
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
            this.videoUtilService.normalVideoJsFiles();
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

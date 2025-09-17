import { Component, OnInit, OnDestroy } from '@angular/core';

import { ReferenceService } from '../../core/services/reference.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { UtilService } from '../../core/services/util.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { PagerService } from '../../core/services/pager.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VideoBaseReportService } from '../../videos/services/video-base-report.service';

import { SaveVideoFile } from '../../videos/models/save-video-file';
import { Category } from '../../videos/models/category';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

declare var Metronic, Layout, Demo, QuickSidebar, videojs, $: any;

@Component({
    selector: 'app-views-report',
    templateUrl: './views-report.component.html',
    styleUrls: ['./views-report.component.css','../../../assets/css/video-css/video-js.custom.css'],
    providers: [Pagination, HttpRequestLoader, VideoBaseReportService]
})
export class ViewsReportComponent implements OnInit, OnDestroy {
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    videoJSplayer: any;
    categories: Category[];
    searchKey: string;
    categoryNum: number;
    sortVideos: any;
    videoSort: any;
    videotitle: string;
    noVideos = false;
    videoId: number;
    watchedFullyDetailReportData: any;
    watchedFullyTotalList: any;
    downloadDataList = [];
    watchedPagination = new Pagination();
    reportPagination = new Pagination();
    constructor(public videoFileService: VideoFileService, public referenceService: ReferenceService,
        public pagerService: PagerService, public logger: XtremandLogger, public pagination: Pagination,
        public authenticationService: AuthenticationService, public videoUtilService: VideoUtilService,
        public videoBaseReportService: VideoBaseReportService, public utilService: UtilService) {
        this.sortVideos = this.videoUtilService.sortVideos;
        this.videoSort = this.sortVideos[0];
        this.categoryNum = 0;
    }
    showAverageDuration(id: number, pagination: Pagination) {  // need to modify with dynamic api values
        this.videoFileService.loadVideoForViewsReport(pagination)
            .subscribe(
                data => {
                    const values = [3, 10, 9, 10, 10, 11, 12, 10, 10, 11, 11, 12, 11, 10, 12, 11, 10, 12];
                    //  const dates = [];
                    // const values = [];
                    // for (const i of Object.keys(data)) {
                    //     dates.push(i);
                    //     values.push(data[i]);
                    // }

                    $('#sparkline_bar' + id).sparkline(values, {
                        type: 'bar',
                        padding: '5px',
                        barSpacing: '3',
                        width: '100',
                        barWidth: 6,
                        height: '55',
                        barColor: '#7cb5ec',
                        negBarColor: '#e02222',
                        tooltipFormat: '<span>average:{{offset:offset}}</span>',
                        tooltipValueLookups: { 'offset': values }

                    });
                },
                error => console.log(error),
                () => console.log('getWeeklyTweets() method invoke started finished.')
            );
    }
    watchedFullyDetailReport(videoId: number) {
        this.videoId = videoId;
        this.videoBaseReportService.watchedFullyReport(videoId, this.watchedPagination).subscribe(
            (result: any) => {
                console.log(result);
                this.watchedFullyDetailReportData = result.data;
                this.watchedPagination.totalRecords = result.totalRecords;
                this.watchedPagination = this.pagerService.getPagedItems(this.watchedPagination, result.data);
                $('#watchedFullyModelPopup').modal('show');
                this.watchedFullyAllDataReport(videoId, this.watchedPagination.totalRecords);
            },
            (err: any) => { console.log(err); })
    }
    clearPaginationValues() {
        this.watchedPagination = new Pagination();
        this.watchedPagination.pageIndex = 1;
    }
    loadVideos(pagination: Pagination) {
        this.pagination.maxResults = 5;
        try {
            this.referenceService.loading(this.httpRequestLoader, true);
            this.videoFileService.loadVideoForViewsReport(pagination)
                .subscribe((result: any) => {
                    pagination.totalRecords = result.totalRecords;
                    this.noVideos = result.listOfMobinars.length === 0 ? true : false;
                    this.referenceService.loading(this.httpRequestLoader, false);
                    this.categories = result.categories;
                    this.categories.sort(function (a: any, b: any) { return (a.id) - (b.id); });
                    pagination = this.pagerService.getPagedItems(pagination, result.listOfMobinars);
                },
                    (error: string) => {
                        this.logger.error('error in videos: views report page' + error);
                        this.logger.errorPage(error);
                    },
                    () => {
                        console.log(pagination.pagedItems)
                        for (let i = 0; i < pagination.pagedItems.length; i++) {
                            this.showAverageDuration(pagination.pagedItems[i].id, pagination)
                        }
                    }
                );
        } catch (error) {
            this.logger.error('erro in load videos :' + error);
        }
    };
    setPage(event: any) {
        const page = event.page;
        const type = event.type;
        if (type === 'viewsReport') {
            this.pagination.pageIndex = page;
            this.loadVideos(this.pagination);
        } else if (type === 'watchedFully') {
            this.watchedPagination.pageIndex = page;
            this.watchedFullyDetailReport(this.videoId);
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
        this.loadVideos(this.pagination);
    }
    selectedSortByValue(event: any) {
        this.videoSort = event;
        this.pagination = this.utilService.sortOptionValues(this.videoSort, this.pagination);
        this.loadVideos(this.pagination);
    }
    showPreview(videoFile: SaveVideoFile) {
        this.appendVideoData(videoFile, "main_video", "modal-title");
        $("#show_preview").modal({ backdrop: 'static', keyboard: false });
    }
    destroyPreview() {
        if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
            $("#main_video").empty();
        } else {
            console.log('360 video closed');
        }
    }
    videoControllColors(videoFile: SaveVideoFile) {
        this.videoUtilService.videoColorControlls(videoFile);
        const rgba = this.videoUtilService.transparancyControllBarColor(videoFile.controllerColor, videoFile.transparency);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    appendVideoData(videoFile: SaveVideoFile, divId: string, titleId: string) {
        $('.h-video').remove();
        $('.p-video').remove();
        console.log(videoFile);
        const videoSelf = this;
        if (videoFile.viewBy === 'DRAFT') {
            console.log(this.referenceService.defaultPlayerSettings);
            videoFile.playerColor = this.referenceService.defaultPlayerSettings.playerColor;
            videoFile.controllerColor = this.referenceService.defaultPlayerSettings.controllerColor;
        }
        var alias = videoFile.alias;
        var fullImagePath = videoFile.imagePath;
        this.videotitle = videoFile.title;
        var videoPath = videoFile.videoPath;
        var is360 = videoFile.is360video;
        $("#" + divId).empty();
        $("#" + titleId).empty();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="v-video" rel="stylesheet">');
        if (is360) {
            console.log("Loaded 360 Video");
            $('.h-video').remove();
            this.videoUtilService.player360VideoJsFiles();
            var str = '<video id=videoId poster=' + fullImagePath + '  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#" + divId).append(str);
            console.log("360 video path" + videoPath);
            videoPath = videoPath.replace(".m3u8", ".mp4");
            console.log("Updated 360 video path" + videoPath);
            $("#" + divId + " video").append('<source src="' + videoPath + '" type="video/mp4">');
            var player = videojs('videoId',{ playbackRates: [0.5, 1, 1.5, 2]});
            player.panorama({
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                callback: function () {
                    player.ready();
                    videoSelf.videoControllColors(videoFile);
                }
            });
            $("#videoId").css("width", "550px");
            $("#videoId").css("height", "310px");
            $("#videoId").css("max-width", "100%");
        } else {
            console.log("Loaded Normal Video");
            $('.p-video').remove();
            this.videoUtilService.normalVideoJsFiles();
            var str = '<video id=videoId  poster=' + fullImagePath + ' preload="none"  class="video-js vjs-default-skin" controls></video>';
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
            const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
            this.videoJSplayer = videojs("videoId", {
             playbackRates: [0.5, 1, 1.5, 2],
                html5: {
                    hls: {
                        overrideNative: overrideNativeValue
                    },
                    nativeVideoTracks: !overrideNativeValue,
                    nativeAudioTracks: !overrideNativeValue,
                    nativeTextTracks: !overrideNativeValue
                }
            });
            this.videoControllColors(videoFile);
            console.log(player);
            if (this.videoJSplayer) {
                this.videoJSplayer.on('fullscreenchange', function () {
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

    watchedFullyAllDataReport(videoId: number, totalRecords: number) {
        this.reportPagination.maxResults = totalRecords;
        this.videoBaseReportService.watchedFullyReport(videoId, this.reportPagination).subscribe(
            (result: any) => {
                console.log(result);
                this.watchedFullyTotalList = result.data;
            },
            (err: any) => { console.log(err); })
    }

    downloadLogs(){
        for (let i = 0; i < this.watchedFullyTotalList.length; i++) {
            let date = new Date(this.watchedFullyTotalList[i].time);
            var object = {
                "First Name": this.watchedFullyTotalList[i].firstName,
                "Last Name": this.watchedFullyTotalList[i].lastName,
                "EmailId": this.watchedFullyTotalList[i].emailId,
                "Campaign Name": this.watchedFullyTotalList[i].campaignName,
                "Date and Time": date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                "Device": this.watchedFullyTotalList[i].deviceType,
                "Location": this.watchedFullyTotalList[i].location
            }

            this.downloadDataList.push(object);
        }
        var csvData = this.referenceService.convertToCSV(this.downloadDataList);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'Watched Fully Report.csv';
        a.click();
        return 'success';
    }


    ngOnInit() {
        try {
            this.loadVideos(this.pagination);
        } catch (err) { }
    }
    ngOnDestroy() {
        $('.p-video').remove();
        $('.h-video').remove();
        $('.v-video').remove();
        $('#show_preview').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
}

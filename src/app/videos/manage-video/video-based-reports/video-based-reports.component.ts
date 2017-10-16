import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { SaveVideoFile } from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../services/video-util.service';
import { VideoBaseReportService } from '../../services/video-base-report.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { ChartModule } from 'angular2-highcharts';
declare var videojs, Metronic, Layout, $, Demo, QuickSidebar, Index, Tasks, Highcharts: any;

@Component({
    selector: 'app-video-based-report',
    templateUrl: './video-based-reports.component.html',
    styleUrls: ['./video-based-reports.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
    styles: [`
      chart { 
        display: block;
      }
      table {
         border: 1px solid black;
         height: 10%;
         width: 35%;
        }
    `],
})
export class VideoBasedReportsComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() selectedVideo: SaveVideoFile;
    public videoJSplayer: any;
    public videoUrl: string;
    public is360Value: boolean;
    public overLayValue: string;
    public posterImagePath: string;
    public isFistNameChecked: boolean;
    public firstName: string;
    public lastName: string;
    public isOverlay: boolean;
    public videoOverlaySubmit: string;
    public isSkipChecked: boolean;
    public isPlay: boolean;
    public categories: any;
    public watchedFully: number;
    chartsData = [57, [2, 11, 12, 13, 18, 13, 10, 4, 1, 11, 11, 12, 11, 4, 10, 12, 11, 8], 67];
    campaignViews: any;
    constructor(public authenticationService: AuthenticationService, public videoBaseReportService: VideoBaseReportService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger) { }
    areaCharts() {
        Highcharts.chart('area-chart', {
            chart: {
                type: 'area',
                plotBorderWidth: 1
            },
            credits: false,
            xAxis: {
                categories: this.categories,
                min: 0.5,
                max: this.categories.length - 1.5,
                startOnTick: false,
                endOnTick: false,
                tickLength: 0,  // lines for x-axis
                type: 'datetime',
                dateTimeLabelFormats: {
                }
            },
            yAxis: {
                startOnTick: false,
                endOnTick: false,
                min: 0,
                title: {
                    text: ''
                },
                labels: {
                    formatter: function () {
                        return Math.round(this.value);
                    }
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                formatter: function () {
                    return this.y + 'visits';
                },
                backgroundColor: '#e0e0e0',
                borderWidth: 0
            },
            series: [{
                color: 'pink',
                showInLegend: false,
                data: this.campaignViews
            }]
        });
    }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.selectedVideo.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        if (this.selectedVideo.allowFullscreen === false) {
            $('.video-js .vjs-fullscreen-control').hide();
        } else {
            $('.video-js .vjs-fullscreen-control').show();
        }
    }
    defaultVideoControllers() {
        if (this.selectedVideo.enableVideoController === false) {
            $('.video-js .vjs-control-bar').hide();
        } else { $('.video-js .vjs-control-bar').show(); }
    }
    transperancyControllBar(value: any) {
        const rgba = this.videoUtilService.convertHexToRgba(this.selectedVideo.controllerColor, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    renderMap(countryWiseData: any) {
        const data = countryWiseData;
        Highcharts.mapChart('world-map', {
            chart: {
                map: 'custom/world'
            },
            title: {
                text: 'The people who have watched the video'
            },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                min: 0
            },
            credits: {
                enabled: false
            },
            series: [{
                data: data,
                name: 'Views',
                states: {
                    hover: {
                        color: '#BADA55'
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                }
            }]
        });

    }
    minutesSparklineData() {
        const myvalues = this.chartsData[1];
        $('#sparkline_bar2').sparkline(myvalues, {
            type: 'bar',
            width: '120',
            barWidth: 6,
            height: '111',
            barColor: '#f4f91b',
            negBarColor: '#e02222'
        });
    }
    getCampaignVideoCountriesAndViews(alias: any) {
        try {
            this.videoBaseReportService.getCampaignVideoCountriesAndViews(alias)
                .subscribe((result: any) => {
                    const viewsData = result.video_views_count_data;
                    this.categories = result.video_views_count_data.months;
                    this.campaignViews = result.video_views_count_data.monthlyViews;
                    console.log(result);
                    this.areaCharts();
                    this.renderMap(result.video_views_count_data.countrywiseViews);
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                });
        } catch (error) { console.log(error); }
    }
    getWatchedCountInfo(alias: any) {
        try {
            this.videoBaseReportService.getWatchedFullyData(alias)
                .subscribe((result: any) => {
                    console.log(result);
                    this.watchedFully = result.video_views_count_data.watchedfullypercentage;
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                });
        } catch (error) { console.log(error); }
    }
    ngOnInit() {
        this.getWatchedCountInfo(this.selectedVideo.alias);
        this.getCampaignVideoCountriesAndViews(this.selectedVideo.alias);
        this.minutesSparklineData();
        this.posterImagePath = this.selectedVideo.imagePath;
        QuickSidebar.init();
    }
    ngAfterViewInit() {
        this.xtremandLogger.log('called ng after view init');
        $('#newPlayerVideo').empty();
        if (this.selectedVideo.is360video !== true) {
            this.is360Value = false;
            this.playNormalVideo();
        } else {
            this.play360Video();
        }
        this.defaultVideoSettings();
        this.transperancyControllBar(this.selectedVideo.transparency);
        if (this.selectedVideo.enableVideoController === false) {
            this.defaultVideoControllers();
        }
    } // ng After view closed
    playNormalVideo() {
        $('.p-video').remove();
        this.videoUtilService.normalVideoJsFiles();
        this.is360Value = false;
        const str = '<video id="videoId" poster=' + this.posterImagePath + '  preload="none"  class="video-js vjs-default-skin" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        $('#videoId').css('height', '300px');
        $('#videoId').css('width', 'auto');
        $('.video-js .vjs-tech').css('width', '100%');
        $('.video-js .vjs-tech').css('height', '100%');
        const self = this;
        this.videoJSplayer = videojs('videoId', {}, function () {
            const player = this;
            const document: any = window.document;
            const isValid = self.overLayValue;
            this.ready(function () {
                $('.video-js .vjs-tech').css('width', '100%');
                $('.video-js .vjs-tech').css('height', '100%');
                player.play();
            });
            this.on('ended', function () {
                console.log('video done');
            });
            this.on('contextmenu', function (e) {
                e.preventDefault();
            });
            this.hotkeys({
                volumeStep: 0.1, seekStep: 5, enableMute: true,
                enableFullscreen: false, enableNumbers: false,
                enableVolumeScroll: true,
                fullscreenKey: function (event: any, player: any) {
                    return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                },
                customKeys: {
                    simpleKey: {
                        key: function (e: any) { return (e.which === 83); },
                        handler: function (player: any, options: any, e: any) {
                            if (player.paused()) { player.play(); } else { player.pause(); }
                        }
                    },
                    complexKey: {
                        key: function (e: any) { return (e.ctrlKey && e.which === 68); },
                        handler: function (player: any, options: any, event: any) {
                            if (options.enableMute) { player.muted(!player.muted()); }
                        }
                    },
                    numbersKey: {
                        key: function (event: any) {
                            return ((event.which > 47 && event.which < 59) ||
                                (event.which > 95 && event.which < 106));
                        },
                        handler: function (player: any, options: any, event: any) {
                            if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                let sub = 48;
                                if (event.which > 95) { sub = 96; }
                                const number = event.which - sub;
                                player.currentTime(player.duration() * number * 0.1);
                            }
                        }
                    },
                    emptyHotkey: {},
                    withoutKey: { handler: function (player: any, options: any, event: any) { console.log('withoutKey handler'); } },
                    withoutHandler: { key: function (e: any) { return true; } },
                    malformedKey: {
                        key: function () { console.log(' The Key function must return a boolean.'); },
                        handler: function (player: any, options: any, event: any) { }
                    }
                }
            });
        });
    }
    play360Video() {
        this.is360Value = true;
        this.xtremandLogger.log('Loaded 360 Video');
        $('.h-video').remove();
        this.videoUtilService.player360VideoJsFiles();
        const str = '<video id=videoId poster=' + this.posterImagePath + '  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $('#videoId').css('height', '300px');
        $('#videoId').css('width', 'auto');
        const newValue = this;
        const player = videojs('videoId').ready(function () {
            this.hotkeys({
                volumeStep: 0.1, seekStep: 5, enableMute: true,
                enableFullscreen: false, enableNumbers: false,
                enableVolumeScroll: true,
                fullscreenKey: function (event: any, player: any) {
                    return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                },
                customKeys: {
                    simpleKey: {
                        key: function (e: any) { return (e.which === 83); },
                        handler: function (player: any, options: any, e: any) {
                            if (player.paused()) { player.play(); } else { player.pause(); }
                        }
                    },
                    complexKey: {
                        key: function (e: any) { return (e.ctrlKey && e.which === 68); },
                        handler: function (player: any, options: any, event: any) {
                            if (options.enableMute) { player.muted(!player.muted()); }
                        }
                    },
                    numbersKey: {
                        key: function (event: any) {
                            return ((event.which > 47 && event.which < 59) ||
                                (event.which > 95 && event.which < 106));
                        },
                        handler: function (player: any, options: any, event: any) {
                            if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                let sub = 48;
                                if (event.which > 95) { sub = 96; }
                                const number = event.which - sub;
                                player.currentTime(player.duration() * number * 0.1);
                            }
                        }
                    },
                    emptyHotkey: {},
                    withoutKey: { handler: function (player: any, options: any, event: any) { console.log('withoutKey handler'); } },
                    withoutHandler: { key: function (e: any) { return true; } },
                    malformedKey: {
                        key: function () { console.log(' The Key function must return a boolean.'); },
                        handler: function (player: any, options: any, event: any) { }
                    }
                }
            });
        });
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
                const isValid = newValue.overLayValue;
                const document: any = window.document;
                player.ready(function () {
                    player.play();
                });
                player.on('fullscreenchange', function () {
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === 'FullscreenOn') {
                        $('.vjs-tech').css('width', '100%');
                        $('.vjs-tech').css('height', '100%');
                    } else if (event === 'FullscreenOff') {
                        $('#videoId').css('width', 'auto');
                        $('#videoId').css('height', '300px');
                    }
                });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '300px');
    }
    ngOnDestroy() {
        this.xtremandLogger.log('Deinit - Destroyed Component');
        if (this.is360Value !== true) {
            this.videoJSplayer.dispose();
        } else if (this.videoJSplayer) {
            this.videoJSplayer.dispose();
        } else { }
        $('.h-video').remove();
        $('.p-video').remove();
    }
}

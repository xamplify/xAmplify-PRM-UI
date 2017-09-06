import { Component, OnInit, Input, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { SaveVideoFile } from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../services/video-util.service';
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
    public _elementRef: ElementRef;
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
    public countryWiseVideoViews: any;
    constructor(elementRef: ElementRef, public authenticationService: AuthenticationService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger) {
        this._elementRef = elementRef; 
       }
      areaCharts(){
         Highcharts.chart( 'area-chart', {
          chart: {
                type: 'area',
                plotBorderWidth: 1
            },
            credits: false,
            xAxis: {
              categories: ['01/2017', '02/2017', '03/2017', '04/2017', '05/2017', '06/2017', '07/2017', '08/2017', '09/2017', '10/2017', '11/2017', '12/2017'],
                labels: {
                    align: 'right'
                },
             	startOnTick: false,
	          	endOnTick: false,
                min: 1,
               type: 'datetime',
                dateTimeLabelFormats: {
                 //  month: '%Y' 
                }
               // gridLineWidth: 0.1
            },
            yAxis: {
                startOnTick: false,
                endOnTick: false,
                min: 0 , 
                title: {
                    text: ''
                },
                labels: {
                    align: 'right',
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            title: {
                text: ''
            },
            tooltip: {
                formatter: function() {
                    return this.y + 'visits';
                    //  return  '<span style="color:red"> +this.y+</span>' + 'M$';
                },
                backgroundColor: '#e0e0e0',
                borderWidth: 0
            },
            series: [{
                color: 'pink',
                showInLegend: false,
                data: [1500, 2500, 1700, 800, 1500, 2350, 1500, 1300, 4600, 6000, 7600, 4300]
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
    //    $('.video-js .vjs-control-bar').css('background-color', rgba);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:'+rgba+'!important');
    }
     renderMap() {
        const countryData = this.countryWiseVideoViews;
        const data = [["in", 1], ["us", 2]];
        
        // Create the chart
        Highcharts.mapChart( 'world-map', {
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
        const myvalues = [2, 11, 12, 13, 18, 13, 10, 4, 1, 11, 11, 12, 11, 4, 10, 12, 11, 8];
        $('#sparkline_bar2').sparkline(myvalues, {
            type: 'bar',
            width: '80',
            barWidth: 6,
            height: '91',
            barColor: '#f4f91b',
            negBarColor: '#e02222'
        });
    }
    ngOnInit() {
        this.renderMap();
        this.minutesSparklineData();
        this.posterImagePath = this.selectedVideo.imagePath;
        QuickSidebar.init();
        Index.init();
        Index.initDashboardDaterange();
        Index.initJQVMAP();
        Index.initCalendar();
        Index.initCharts();
        Index.initChat();
      //  Index.initMiniCharts();
        Tasks.initDashboardWidget();
    }
    ngAfterViewInit() {
       this.areaCharts();
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
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" class="h-video" rel="stylesheet">');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video"/>');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js" type="text/javascript"  class="h-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="h-video" />');
        this.is360Value = false;
        const str = '<video id="videoId" poster=' + this.posterImagePath + '  preload="none"  class="video-js vjs-default-skin" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        $('#videoId').css('height', '258px');
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
        $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript" class="p-video"/>');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript" class="p-video" />');
        $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet" class="p-video">');
        $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript" class="p-video" />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"" type="text/javascript"  class="p-video" />');
        const str = '<video id=videoId poster=' + this.posterImagePath + '  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        // this.videoUrl = 'https://yanwsh.github.io/videojs-panorama/assets/shark.mp4'; // need to commet
        $('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
        $('#videoId').css('height', '258px');
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
                        $('#videoId').css('height', '258px');
                    }
                });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '258px');
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

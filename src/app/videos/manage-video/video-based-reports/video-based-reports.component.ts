import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { SaveVideoFile } from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../services/video-util.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VideoBaseReportService } from '../../services/video-base-report.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { ChartModule } from 'angular2-highcharts';
declare var videojs, Metronic, Layout, $, Demo, QuickSidebar, Index, Tasks, Highcharts: any;

@Component({
    selector: 'app-video-based-report',
    templateUrl: './video-based-reports.component.html',
    styleUrls: ['./video-based-reports.component.css', '../../../../assets/css/video-css/video-js.custom.css']
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
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService) { }
    areaCharts() {
        Highcharts.chart('area-chart', {
            chart: {
                type: 'column',
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
                },
                 visible: false,
            },
            title: {
                text: ''
            },
            exporting: { enabled: false },
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
    monthlyViewsBarCharts(){
        Highcharts.chart('area-chart', {
            chart: {
                type: 'column'
            },
            title: {
                text: ' '
            },
            credits: false,
            exporting: { enabled: false },
            xAxis: {
                type: 'category',
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Population (millions)'
                },
                visible: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
            },
            series: [{
                name: 'Population',
                data: [
                    ['Shanghai', 23.7],
                    ['Lagos', 16.1],
                    ['Istanbul', 14.2],
                    ['Karachi', 14.0],
                    ['Mumbai', 12.5]
                
                ],
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    format: '{point.y:.1f}', // one decimal
                    y: 10, // 10 pixels down from the top
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
    });
    }
    chartsDayStates(){
          const charts = [],
            $containers = $('#trellis td'),
            datasets = [
                {
                     name: ' ',
                    data: [1052, 954, 4250, 740, 38],
                    
                }
              
            ];
        $.each(datasets, function (i, dataset) {
            charts.push(new Highcharts.Chart({
                chart: {
                    renderTo: $containers[i],
                    type: 'bar',
                    marginLeft: i === 0 ? 100 : 10
                },

                title: {
                    text: dataset.name,
                    align: 'left',
                    x: i === 0 ? 90 : 0,
                    style: {
                        color: '#696666',
                        fontWeight: 'normal',
                        fontSize: '13px'
                    }
                },
                  plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce'],
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: ['Africa', 'America', 'Asia', 'Europe','india'],
                    labels: {
                        enabled: i === 0
                    },
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    minorTickLength: 0,
                    tickLength: 0
                },
                exporting: { enabled: false },
                yAxis: {
                    allowDecimals: false,
                    visible: false,
                    title: {
                        text: null
                    },
                    min: 0
                   // max: 100
                },
                legend: {
                    enabled: false
                },
                labels: {
                    style: {
                        color: 'white',
                        fontSize: '25px'
                    }
                },
                series: [dataset]
            }));
        });
    }
    minutesWatchedBarcharts(){
        var categories = [
                '0-4', '5-9', '10-14', '15-19',
                '20-24', '25-29', '30-34', '35-39', '40-44',
                '45-49', '50-54', '55-59', '60-64', '65-69',
                '70-74', '75-79', '80-84', '85-89', '90-94',
                '95-99', '100 + '
            ];
     Highcharts.chart('minutesWatchedStockedChart', {
            chart: {
                type: 'bar'
            },
            title: {
                text: ' '
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function () {
                            return Math.abs(this.value) + '%';
                        }
                    }
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },
            series: [{
                name: 'Male',
                data: [-2.2, -2.2, -2.3, -2.5, -2.7, -3.1, -3.2,
                    -3.0, -3.2, -4.3, -4.4, -3.6, -3.1, -2.4,
                    -2.5, -2.3, -1.2, -0.6, -0.2, -0.0, -0.0]
            }, {
                name: 'Female',
                data: [2.1, 2.0, 2.2, 2.4, 2.6, 3.0, 3.1, 2.9,
                    3.1, 4.1, 4.3, 3.6, 3.4, 2.6, 2.9, 2.9,
                    1.8, 1.2, 0.6, 0.1, 0.0]
            }]
        });
    }
    defaultVideoSettings() {
        console.log('default settings called');
        $('.video-js').css('color', this.selectedVideo.playerColor);
        $('.video-js .vjs-play-progress').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-volume-level').css('background-color', this.selectedVideo.playerColor);
        $('.video-js .vjs-control-bar').css('background-color', this.selectedVideo.controllerColor);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + this.selectedVideo.controllerColor + '!important');
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
        const color: any = this.selectedVideo.controllerColor;
        const rgba = this.videoUtilService.transparancyControllBarColor(color, value);
        $('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
    }
    renderWorldMap(countryWiseData: any) {
        const data = countryWiseData;
        Highcharts.mapChart('world-map', {
            chart: {
                map: 'custom/world'
            },
            title: {
                text: 'The people who have watched the video',
                     style: {
                        color: '#696666',
                        fontWeight: 'normal',
                        fontSize: '14px'
                    }
            }, 
            exporting: { enabled: false },
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
    getCampaignVideoCountriesAndViews(alias: any) {
        try {
            this.videoBaseReportService.getCampaignVideoCountriesAndViews(alias)
                .subscribe((result: any) => {
                    const viewsData = result.video_views_count_data;
                    this.categories = result.video_views_count_data.months;
                    this.campaignViews = result.video_views_count_data.monthlyViews;
                    console.log(result);
                    //this.areaCharts();
                    this.monthlyViewsBarCharts();
                    this.renderWorldMap(result.video_views_count_data.countrywiseViews);
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
       // this.dayStatesBarcharts();
        this.chartsDayStates();
      //  this.minutesWatchedBarcharts();
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
        const overrideNativeValue = this.referenceService.getBrowserInfoForNativeSet();
        console.log(overrideNativeValue);
        this.videoJSplayer = videojs('videoId', {
        html5: {
          hls: {
            overrideNative: overrideNativeValue
          },
          nativeVideoTracks: !overrideNativeValue,
          nativeAudioTracks: !overrideNativeValue,
          nativeTextTracks: !overrideNativeValue
        } }, function () {
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
                    $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + newValue.selectedVideo.playerColor + '!important');
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

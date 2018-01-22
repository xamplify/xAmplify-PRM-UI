import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { SaveVideoFile } from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../services/video-util.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VideoBaseReportService } from '../../services/video-base-report.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { Pagination } from '../../../core/models/pagination';
import { PagerService } from '../../../core/services/pager.service';
import { ChartModule } from 'angular2-highcharts';
declare var videojs, Metronic, Layout, $, Demo, QuickSidebar, Index, Tasks, Highcharts: any;

@Component({
    selector: 'app-video-based-report',
    templateUrl: './video-based-reports.component.html',
    styleUrls: ['./video-based-reports.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
    providers: [Pagination]
})
export class VideoBasedReportsComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() selectedVideo: SaveVideoFile;
    videoJSplayer: any;
    videoUrl: string;
    is360Value: boolean;
    overLayValue: string;
    posterImagePath: string;
    isFistNameChecked: boolean;
    firstName: string;
    lastName: string;
    isOverlay: boolean;
    videoOverlaySubmit: string;
    isSkipChecked: boolean;
    isPlay: boolean;
    categories: any;
    watchedFully: number;
    minutesWatchedUsers: number;
    dropdownValue: any;
    sortMintuesDates = [{ 'name': 'today views', 'value': 'today' }, { 'name': 'monthly', 'value': 'month' }, { 'name': 'Quarterly', 'value': 'quarter' }, { 'name': 'yearly', 'value': 'year' }];
    viewsMinutesData: any = [];
    daySort: any;
    minutesSort: any;
    campaignViews: any;
    sortInnerDates = [];
    minutesinnerSort: any;
    maxValueViews: any;
    viewsMaxValues: any;
    userMinutesWatched: any;
    userId: number;
    constructor(public authenticationService: AuthenticationService, public videoBaseReportService: VideoBaseReportService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
        public pagination: Pagination, public pagerService: PagerService) {
        this.daySort = this.videoUtilService.sortMonthDates[3];
        this.minutesSort = this.sortMintuesDates[3];
    }
    monthlyViewsBarCharts(dates, views) {
        Highcharts.chart('monthly-views-bar', {
            chart: {
                type: 'column'
            },
            title: {
                text: ' '
            },
            credits: false,
            exporting: { enabled: false },
            xAxis: {
                categories: dates
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: ' '
                },
                visible: false
            },
            legend: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y;
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },

            series: [{
                name: 'views',
                data: views
                // stack: 'male'
            }]
        });
    }
    watchedByTenUserschartsDayStates(minutesWatched: any, names: any) {
       const maxValue = Math.max.apply(null, minutesWatched);
        const charts = [],
            $containers = $('#trellis td'),
            datasets = [
                {
                    name: ' ',
                    data: minutesWatched,

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
                        },
                        minPointLength: 3
                    }
                },
                colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce'],
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: names,
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
                    min: 0,
                    max: maxValue  // findout maxmum,it is important
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
    minutesWatchedBarcharts() {
        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            title: {
                text: ' '
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis: {
                min: 0,
                visible: false
            },
            legend: {
                reversed: false,
                enabled: false
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'views',
                data: [5, 3, 4, 7, 2]
            }, {
                name: 'minutes watched',
                data: [2, 2, 3, 2, 1],
                color: '#98dc71'
            }]
        });
    }
    videoPlayedandSkippedDuration(){
      Highcharts.chart('video-skipped', {
            chart: {
                type: 'area'
            },
            title: {
                text: ' '
            },
            exporting : { enabled: false},
            xAxis: {
               // categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis : { 
                title : '',
            },
            credits: {
                enabled: false
            },
            series: [
              {
                name: 'Jane',
                showInLegend: false,
                color: 'lightgreen',
                data: [2, -2, -3, 2, 1]
              }, {
                name: 'Joe',
                showInLegend: false,
                data: [3, 4, 4, -2, 5]
            }]
        });
    }
    selectedSortByValue(dateValue) {
        this.dropdownValue = dateValue;
        if (dateValue === 'today') {
            this.sortInnerDates.length = 0;
            this.getViewsMinutesWatchedChart(dateValue, this.selectedVideo.id, null);
        }
        else {
            this.selectedInnerDropdown(dateValue);
        }
    }

    selectedInnerDropdown(dateValue) {
        if (dateValue !== undefined) {
            this.videoBaseReportService.timePeriodSelctedDropdown(dateValue)
                .subscribe((result: any) => {
                    console.log(result);
                    this.sortInnerDates = result;
                    this.minutesinnerSort = this.sortInnerDates[0];
                    console.log(this.minutesinnerSort);
                    this.getViewsMinutesWatchedChart(this.dropdownValue, this.selectedVideo.id, this.minutesinnerSort);
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    //  this.xtremandLogger.errorPage(error);
                });
        }
    }
    selectedDropdown(dateInnerSortValue) {
        this.minutesinnerSort = dateInnerSortValue;
        this.videoBaseReportService.timePeriodSelctedDropdown(dateInnerSortValue)
            .subscribe((result: any) => {
                console.log(result);
                this.getViewsMinutesWatchedChart(this.dropdownValue, this.selectedVideo.id, dateInnerSortValue);
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            });
    }

    getViewsMinutesWatchedChart(dateValue, videoId, timeValue) {
        if (dateValue==='quarter' &&  timeValue.includes('Q')) {
            timeValue = timeValue.substring(1, timeValue.length);
        }
        this.videoBaseReportService.getViewsMinutesWatchedChart(dateValue, videoId, timeValue)
            .subscribe((result: any) => {
                console.log(result);
                this.viewsMinutesData = result;
                const maxValue = [];
                const viewsMax = [];
                if(this.viewsMinutesData.length>0){
                for(let i=0;i< this.viewsMinutesData.length; i++){
                    let hexColor = this.videoUtilService.convertRgbToHex(this.viewsMinutesData[i].viewsColor);
                    let hexminutesColor = this.videoUtilService.convertRgbToHex(this.viewsMinutesData[i].minutesWatchedColor);
                    console.log(hexColor+'and '+hexminutesColor);
                    this.viewsMinutesData[i].viewsColor = hexColor;
                    this.viewsMinutesData[i].minutesWatchedColor = hexminutesColor;
                    maxValue.push(this.viewsMinutesData[i].minutesWatched);
                    viewsMax.push(this.viewsMinutesData[i].views)
                    hexColor = hexminutesColor = null;
                 }
                 console.log(this.viewsMinutesData);   
                 this.maxValueViews = Math.max.apply(null, maxValue)
                 this.viewsMaxValues = Math.max.apply(null,viewsMax);
                console.log(this.maxValueViews);
                }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                //    this.xtremandLogger.errorPage(error);
            });
    }
    selectedCampaignWatchedUsers(timePeriod) {
        this.videoBaseReportService.getCampaignUserWatchedViews(timePeriod, this.selectedVideo.id)
            .subscribe((result: any) => {
                console.log(result);
                this.monthlyViewsBarCharts(result.dates, result.views);
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
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
                text: ' ',
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
             plotOptions: {
                series: {
                    events: {
                    click: function (e) { 
                        alert(e.point.name+', views:'+e.point.value);
                    }
                   }
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
                    this.minutesWatchedUsers = result.video_views_count_data.minutesWatched.length;
                    this.watchedByTenUserschartsDayStates(result.video_views_count_data.minutesWatched, result.video_views_count_data.names);
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                });
        } catch (error) { console.log(error); }
    }

    clickedMinutesWatched(userId: any){
     console.log(this.dropdownValue+'and inner data'+this.minutesinnerSort);
     this.userId = userId;
     this.videoBaseReportService.getUsersMinutesWatchedInfo(this.dropdownValue,this.selectedVideo.id,this.minutesinnerSort,userId,this.pagination).
      subscribe(
         data=>{
            console.log(data);
            this.userMinutesWatched = data.data;
            this.pagination.totalRecords = data.totalRecords;
            this.pagination = this.pagerService.getPagedItems(this.pagination, this.userMinutesWatched);
            console.log(this.pagination);
            $('#usersMinutesModelPopup').modal('show'); 
         },
         error => { 
             this.xtremandLogger.error(error);
             this.xtremandLogger.errorPage(error);
         }
        );
    }
    setPage(page: number, type: string) {
      if (page !== this.pagination.pageIndex) {
        this.pagination.pageIndex = page;
        this.clickedMinutesWatched(this.userId);
      }
    }
    clearPaginationValues(){
        this.pagination = new Pagination();
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 8;
    }
    ngOnInit() {
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 8;
        this.getWatchedCountInfo(this.selectedVideo.alias);
        this.getCampaignVideoCountriesAndViews(this.selectedVideo.alias);
        this.selectedCampaignWatchedUsers(this.videoUtilService.sortMonthDates[3].value);
        this.selectedSortByValue(this.minutesSort.value);
        this.posterImagePath = this.selectedVideo.imagePath;
        QuickSidebar.init();
        this.videoPlayedandSkippedDuration();
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
            }
        }, function () {
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

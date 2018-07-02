import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../services/video-util.service';
import { ReferenceService } from '../../../core/services/reference.service';
import { VideoBaseReportService } from '../../services/video-base-report.service';
import { PagerService } from '../../../core/services/pager.service';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';

import { Pagination } from '../../../core/models/pagination';
import { SaveVideoFile } from '../../models/save-video-file';

declare var videojs, $, QuickSidebar, Highcharts: any;

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
    sortMintuesDates = [{ 'name': 'Today', 'value': 'today' }, { 'name': 'By Month', 'value': 'month' }, { 'name': 'By Quarter', 'value': 'quarter' }, { 'name': 'By Year', 'value': 'year' }];
    viewsMinutesData: any = [];
    daySort: any;
    minutesSort: any;
    campaignViews: any;
    sortInnerDates = [];
    minutesinnerSort: any;
    maxValueViews: any;
    viewsMaxValues: any;
    userMinutesWatched: any;
    userMinutesWatchedTotalList: any;
    userId: number;
    watchedFullyReportData: any;
    watchedFullyTotalReportList: any;
    totalUsersWatched: any;
    videoSkippedDuration: any;
    videoPlayedDuration: any;
    videoSkippedDurationTotalList: any;
    videoPlayedDurationTotalList: any;
    nonApplicableUsersMinutes: any;
    nonApplicableUsersViews: any;
    videoPlayedPagination: Pagination = new Pagination();
    reportsPagination: Pagination = new Pagination();
    countryCode: string;
    downloadTypeName = '';
    downloadCsvList: any;
    downloadDataList = [];
    worldMapCampaignUsersInfo: any;
    worldMapCampaignUsersTotalData: any;
    worldMapdataReport: any;
    viewsBarData: any;
    trellisBarChartData: any;
    logoDescriptionUrl: any;
    brandLogoUrl:any;
    fullScreenMode: boolean;
    paginationType:string;
    videoPlayedSkipedInfo:any;
    logListName = "";

    constructor(public authenticationService: AuthenticationService, public videoBaseReportService: VideoBaseReportService,
        public videoUtilService: VideoUtilService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
        public pagination: Pagination, public pagerService: PagerService, public router: Router) {
        this.daySort = this.videoUtilService.sortMonthDates[3];
        this.minutesSort = this.sortMintuesDates[3];
    }
    selectedCategoryValue(category: any) {
        this.videoUtilService.selectedVideo = this.selectedVideo;
        if (category.includes('Q')) { category = category.substring(1, category.length); }
        this.videoUtilService.timePeriodValue = category;
        this.router.navigate(['./home/videos/manage/reports']);
    }

    watchedByTenUserschartsDayStates(minutesWatched: any, names: any) {
        const maxValue = Math.max.apply(null, minutesWatched);
        const self = this;
        const charts = [],
            $containers = $('#trellis td'),
            datasets = [{ name: ' ', data: minutesWatched, }];
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
                        minPointLength: 3,
                    },
                    series: {
                        cursor: 'pointer',
                        colorByPoint: true,
                        point: {
                            events: {
                                click: function () {
                                    // alert('campaign: ' + this.category + ', value: ' + this.y);
                                    self.totalMinutesWatchedByMostUsers();
                                }
                            }
                        }
                    }
                },
                colors: ['#2e37d8', '#c42dd8', '#d82d2d', '#d8d52d', '#2dd838', '#2dd8be', '#3D96AE', '#b5ca92', '#2e37d8', '#c42dd8'],
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
                    max:10
                  //  max: maxValue  // findout maxmum,it is important
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
    videoPlayedandSkippedDuration(views, skipped) {
        let xAxis = ' ';
        let yAxis = ' ';
        if(skipped.length>0 || views.length>0) {
          xAxis = 'X-Axis';
          yAxis='Y-Axis'
        }
        const self = this;
        Highcharts.chart('video-skipped', {
            chart: {
                type: 'area'
            },
            title: {
                text: ' '
            },
            exporting: { enabled: false },
            xAxis:[{
              title: {
                  text: xAxis,
              }
          }],
            yAxis: [{
              title: {
                  text: yAxis,
              }
          }],
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            self.pagination.maxResults = 12;
                            self.videoPlayedPagination.maxResults = 12;
                            self.videoSkippedDurationInfo();
                            self.videoPlayedDurationInfo();
                            $('#videoSkippedPlayed').modal('show');
                        }
                    }
                }
            },
            series: [
                {
                    name: 'played',
                    showInLegend: false,
                    color: 'lightgreen',
                    data: views
                }, {
                    name: 'skipped',
                    showInLegend: false,
                    data: skipped
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
        if (dateValue === 'quarter' && timeValue.includes('Q')) {
            timeValue = timeValue.substring(1, timeValue.length);
        }
        this.videoBaseReportService.getViewsMinutesWatchedChart(dateValue, videoId, timeValue)
            .subscribe((result: any) => {
                console.log(result);
                this.viewsMinutesData = result;
                const maxValue = [];
                const viewsMax = [];
                if (this.viewsMinutesData.length > 0) {
                    for (let i = 0; i < this.viewsMinutesData.length; i++) {
                        let hexColor = this.videoUtilService.convertRgbToHex(this.viewsMinutesData[i].viewsColor);
                        let hexminutesColor = this.videoUtilService.convertRgbToHex(this.viewsMinutesData[i].minutesWatchedColor);
                        console.log(hexColor + 'and ' + hexminutesColor);
                        this.viewsMinutesData[i].viewsColor = hexColor;
                        this.viewsMinutesData[i].minutesWatchedColor = hexminutesColor;
                        maxValue.push(this.viewsMinutesData[i].minutesWatched);
                        viewsMax.push(this.viewsMinutesData[i].views)
                        hexColor = hexminutesColor = null;
                    }
                    console.log(this.viewsMinutesData);
                    this.maxValueViews = Math.max.apply(null, maxValue)
                    this.viewsMaxValues = Math.max.apply(null, viewsMax);
                    console.log(this.maxValueViews);
                }
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                //    this.xtremandLogger.errorPage(error);
            });
    }
    selectedCampaignWatchedUsers(timePeriod) {
        this.viewsBarData = undefined;
        if (timePeriod !== undefined) {
            this.videoUtilService.timePeriod = timePeriod;
            this.videoBaseReportService.getCampaignUserWatchedViews(timePeriod, this.selectedVideo.id)
                .subscribe((result: any) => {
                    console.log(result);
                    this.videoUtilService.videoViewsData = result;
                    this.viewsBarData = result;
                    // this.monthlyViewsBarCharts(result.dates, result.views);
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                });
        }
    }
    watchedFullyDetailReport() {
        this.paginationType = 'watchedFully';
        this.videoBaseReportService.watchedFullyReport(this.selectedVideo.id, this.pagination).subscribe(
            (result: any) => {
                console.log(result);
                this.watchedFullyReportData = result.data;
                this.pagination.totalRecords = result.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, result.data);
                // if (this.watchedFullyReportData.length > 0) {
                $('#watchedFullyModelPopup').modal('show');
                this.watchedFullyTotalReport(this.pagination.totalRecords);
                // }
            },
            (err: any) => { console.log(err); })
    }
    totalMinutesWatchedByMostUsers() {
        this.videoBaseReportService.totlaMinutesWatchedByMostUsers(this.selectedVideo.id).subscribe(
            (result: any) => {
                console.log(result);
                this.totalUsersWatched = result;
                this.downloadTypeName = 'minetesWatched'
                if (this.totalUsersWatched.length > 0) {
                    $('#totalwatchedUsersModelPopup').modal('show');
                }
            },
            (err: any) => { console.log(err); })
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
    getCampaignVideoCountriesAndViews(alias: any) {
        try {
            this.videoBaseReportService.getCampaignVideoCountriesAndViews(alias)
                .subscribe((result: any) => {
                    const viewsData = result.video_views_count_data;
                    this.categories = result.video_views_count_data.months;
                    this.campaignViews = result.video_views_count_data.monthlyViews;
                    console.log(result);
                    this.worldMapdataReport = result.video_views_count_data.countrywiseViews;
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                });
        } catch (error) { console.log(error); }
    }
    clickWorldMapReports(event) {
        this.getCampaignCoutryViewsDetailsReport(event);
    }
    getWatchedCountInfo(alias: any) {
        try {
            this.trellisBarChartData = undefined;
            this.videoBaseReportService.getWatchedFullyData(alias)
                .subscribe((result: any) => {
                    console.log(result);
                    this.watchedFully = result.video_views_count_data.watchedfullypercentage;
                    this.minutesWatchedUsers = result.video_views_count_data.minutesWatched.length;
                     const maxValue = Math.max.apply(null, result.video_views_count_data.minutesWatched);
                     const obj = { 'result': result, 'type': 'videobasedreport','maxValue': maxValue };
                     this.trellisBarChartData = obj;
                    this.watchedByTenUserschartsDayStates(result.video_views_count_data.minutesWatched, result.video_views_count_data.names);
                },
                (error: any) => {
                    this.xtremandLogger.error(error);
                    this.xtremandLogger.errorPage(error);
                });
        } catch (error) { console.log(error); }
    }

    clickedMinutesWatched(userId: any) {
        this.paginationType = 'userMinutesWatched';
        console.log(this.dropdownValue + 'and inner data' + this.minutesinnerSort);
        this.userId = userId;
        this.videoBaseReportService.getUsersMinutesWatchedDetailReports(this.dropdownValue, this.selectedVideo.id, this.minutesinnerSort, userId, this.pagination).
            subscribe(
            data => {
                console.log(data);
                this.userMinutesWatched = data.data;
                this.pagination.totalRecords = data.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.userMinutesWatched);
                console.log(this.pagination);
                $('#usersMinutesModelPopup').modal('show');
                this.clickedMinutesWatchedTotalList(userId, this.pagination.totalRecords);
            },
            error => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }
    setPage(event: any) {
        this.paginationType = event.type;
        if(this.paginationType === 'videoPlayed'){ this.videoPlayedPagination.pageIndex = event.page; }
        else { this.pagination.pageIndex = event.page; }
        this.callPaginationMethods();
    }
    paginationDropdown(pagination:Pagination){
        if(this.paginationType === 'videoPlayed'){this.videoPlayedPagination = pagination; }
        else { this.pagination = pagination; }
        this.callPaginationMethods();
    }
    callPaginationMethods(){
        if (this.paginationType === 'userMinutesWatched') {
            this.clickedMinutesWatched(this.userId);
        }
        else if (this.paginationType === 'watchedFully') {
            this.watchedFullyDetailReport();
        }
        else if (this.paginationType === 'videoPlayed') {
            this.videoPlayedDurationInfo();
        }
        else if (this.paginationType === 'videoSkipped') {
            this.videoSkippedDurationInfo();
        }
        else if (this.paginationType === 'coutrywiseUsers') {
            this.getCampaignCoutryViewsDetailsReport(this.countryCode);
        }
    }
    clearPaginationValues() {
        this.pagination = new Pagination();
        this.videoPlayedPagination = new Pagination();
        this.videoPlayedPagination.pageIndex = 1;
        this.videoPlayedPagination.maxResults = 12;
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 12;
    }
    getVideoPlayedSkippedInfo() {
        this.videoBaseReportService.getVideoPlayedSkippedInfo(this.selectedVideo.id).subscribe(
            (result: any) => {
                console.log(result);
                this.videoPlayedSkipedInfo = result;
                this.videoPlayedandSkippedDuration(result.views, result.skipped);
            },
            error => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            }
        );
    }
    videoSkippedDurationInfo() {
        this.paginationType = 'videoSkipped';
        this.videoBaseReportService.videoSkippedDurationInfo(this.selectedVideo.id, this.pagination).subscribe(
            (result: any) => {
                console.log(result);
                this.videoSkippedDuration = result.data;
                this.pagination.totalRecords = result.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, this.videoSkippedDuration);
                this.videoSkippedDurationTotalInfo(this.pagination.totalRecords);
            },
            error => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            }
        );
    }
    videoPlayedDurationInfo() {
        this.paginationType = 'videoPlayed';
        this.videoBaseReportService.videoPlayedDurationInfo(this.selectedVideo.id, this.videoPlayedPagination).subscribe(
            (result: any) => {
                console.log(result);
                this.videoPlayedDuration = result.data;
                this.videoPlayedPagination.totalRecords = result.totalRecords;
                this.videoPlayedPagination = this.pagerService.getPagedItems(this.videoPlayedPagination, this.videoPlayedDuration);
                this.videoPlayedDurationTotalInfo(this.videoPlayedPagination.totalRecords);
            },
            error => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            }
        );
    }

    nonApplicableUsersMinutesWatched() {
        this.videoBaseReportService.nonApplicableUsersMinutes(this.selectedVideo.id).subscribe(
            (result: any) => {
                console.log(result);
                this.nonApplicableUsersMinutes = result.minutesWatched;
                this.nonApplicableUsersViews = result.views;
            },
            error => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            }
        );
    }
    getCampaignCoutryViewsDetailsReport(countryCode: string) {
        this.paginationType = 'coutrywiseUsers';
        this.countryCode = countryCode.toUpperCase();
        this.downloadTypeName = 'worldMapData';
        this.videoBaseReportService.getCampaignCoutryViewsDetailsReport(this.selectedVideo.id, this.countryCode, this.pagination).
            subscribe(
            (result: any) => {
                console.log(result);
                this.worldMapCampaignUsersInfo = result.data;
                this.pagination.totalRecords = result.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, result.data);
                if (this.worldMapCampaignUsersInfo.length > 0) {
                    $('#worldMapModal').modal('show');
                }
                this.getCampaignCoutryViewsDetailsTotalReport(countryCode, this.pagination.totalRecords);
            },
            error => {
                this.xtremandLogger.error(error);
            }
            );
    }

    getCampaignCoutryViewsDetailsTotalReport(countryCode: string, totalRecords: number) {
        this.countryCode = countryCode.toUpperCase();
        this.reportsPagination.maxResults = totalRecords;
        this.downloadTypeName = 'worldMapData';
        this.videoBaseReportService.getCampaignCoutryViewsDetailsReport(this.selectedVideo.id, this.countryCode, this.reportsPagination).
            subscribe(
            (result: any) => {
                console.log(result);
                this.worldMapCampaignUsersTotalData = result.data;
            },
            error => {
                this.xtremandLogger.error(error);
            }
            );
    }

    watchedFullyTotalReport(totalRecords: number) {
        this.reportsPagination.maxResults = totalRecords;
        this.downloadTypeName = 'watchedFully';
        this.videoBaseReportService.watchedFullyReport(this.selectedVideo.id, this.reportsPagination).subscribe(
            (result: any) => {
                console.log(result);
                this.watchedFullyTotalReportList = result.data;
            },
            (err: any) => { console.log(err); })
    }

    clickedMinutesWatchedTotalList(userId: any, totalRecord: number) {
        this.reportsPagination.maxResults = totalRecord;
        this.downloadTypeName = 'clickedMenetsWatched';
        this.userId = userId;
        this.videoBaseReportService.getUsersMinutesWatchedDetailReports(this.dropdownValue, this.selectedVideo.id, this.minutesinnerSort, userId, this.reportsPagination).
            subscribe(
            data => {
                console.log(data);
                this.userMinutesWatchedTotalList = data.data;
            },
            error => {
                this.xtremandLogger.errorPage(error);
            }
            );
    }

    videoSkippedDurationTotalInfo(totalRecords: number) {
        this.reportsPagination.maxResults = totalRecords;
        // this.downloadTypeName = 'skippedDuration';
        this.videoBaseReportService.videoSkippedDurationInfo(this.selectedVideo.id, this.reportsPagination).subscribe(
            (result: any) => {
                console.log(result);
                this.videoSkippedDurationTotalList = result.data;
            },
            error => {
                this.xtremandLogger.error(error);
            }
        );
    }
    videoPlayedDurationTotalInfo(totalRecords: number) {
        this.reportsPagination.maxResults = totalRecords;
        //this.downloadTypeName = 'playedDuration';
        this.videoBaseReportService.videoPlayedDurationInfo(this.selectedVideo.id, this.reportsPagination).subscribe(
            (result: any) => {
                console.log(result);
                this.videoPlayedDurationTotalList = result.data;
            },
            error => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            }
        );
    }

    downloadLogs() {
        if (this.downloadTypeName === 'minetesWatched') {
            this.logListName = 'Minetes_Views_Logs.csv';
            this.downloadCsvList = this.totalUsersWatched;
        } else if (this.downloadTypeName === 'watchedFully') {
            this.logListName = 'Fully_Watched_Logs.csv';
            this.downloadCsvList = this.watchedFullyTotalReportList;
        } else if (this.downloadTypeName === 'worldMapData') {
            this.logListName = 'country_Wise_Logs.csv';
            this.downloadCsvList = this.worldMapCampaignUsersTotalData;
        } else if (this.downloadTypeName === 'clickedMenetsWatched') {
            this.logListName = 'Clicked_Menetes_logs.csv';
            this.downloadCsvList = this.userMinutesWatchedTotalList;
        }
        else if (this.downloadTypeName === 'playedDuration') {
            this.logListName = 'Played_Duration_logs.csv';
            this.downloadCsvList = this.videoPlayedDurationTotalList;
        }
        else if (this.downloadTypeName === 'skippedDuration') {
            this.logListName = 'Skipped_Duration_logs.csv';
            this.downloadCsvList = this.videoSkippedDurationTotalList;
        }

        this.downloadDataList.length = 0;
        for (let i = 0; i < this.downloadCsvList.length; i++) {
            let date = new Date(this.downloadCsvList[i].date);
            let time = new Date(this.downloadCsvList[i].time);
            let endTime = new Date(this.downloadCsvList[i].endTime);

            var object = {
                "First Name": this.downloadCsvList[i].firstName,
                "Last Name": this.downloadCsvList[i].lastName,
            }

            if (this.downloadTypeName === 'minetesWatched') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                object["Device"] = this.downloadCsvList[i].device;
                object["Location"] = this.downloadCsvList[i].location;
            }
            else if (this.downloadTypeName === 'watchedFully') {
                object["Email Id"] = this.downloadCsvList[i].name;
                object["Campaign Name"] = this.downloadCsvList[i].campaignName;
                object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                object["Device"] = this.downloadCsvList[i].device;
                object["Location"] = this.downloadCsvList[i].location;
            }
            else if (this.downloadTypeName === 'worldMapData') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                object["Campaign Name"] = this.downloadCsvList[i].campaignName;
                object["Date and Time"] = time.toDateString() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
                object["Device"] = this.downloadCsvList[i].os;
                object["City"] = this.downloadCsvList[i].city;
                object["Country"] = this.downloadCsvList[i].country;
            }
            else if (this.downloadTypeName === 'clickedMenetsWatched') {
                object["Name"] = this.downloadCsvList[i].name;
                object["Video Title"] = this.downloadCsvList[i].videoTitle;
                object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                object["Minets Watched"] = this.downloadCsvList[i].minutesWatched;
                object["Device"] = this.downloadCsvList[i].device;
                object["Location"] = this.downloadCsvList[i].location;
            }
            else if (this.downloadTypeName === 'playedDuration') {
                object["Email Id"] = this.downloadCsvList[i].name;
                object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                object["Device"] = this.downloadCsvList[i].device;
            }
            else if (this.downloadTypeName === 'skippedDuration') {
                object["Email Id"] = this.downloadCsvList[i].name;
                object["Date and Time"] = date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                object["Device"] = this.downloadCsvList[i].device;
            }
            this.downloadDataList.push(object);
        }
        this.referenceService.isDownloadCsvFile = true;
    }
    clickedTrellisChart(){
       this.totalMinutesWatchedByMostUsers();
    }
    ngOnInit() {
        this.logoDescriptionUrl = this.selectedVideo.brandingLogoDescUri;
        this.brandLogoUrl = this.selectedVideo.brandingLogoUri;
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 12;
        this.getWatchedCountInfo(this.selectedVideo.alias);
        this.getCampaignVideoCountriesAndViews(this.selectedVideo.alias);
        this.selectedCampaignWatchedUsers(this.videoUtilService.sortMonthDates[3].value);
        this.selectedSortByValue(this.minutesSort.value);
        this.posterImagePath = this.selectedVideo.imagePath;
        QuickSidebar.init();
        this.getVideoPlayedSkippedInfo();
        this.videoUtilService.selectedVideoId = this.selectedVideo.id;
        this.nonApplicableUsersMinutesWatched();
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
        $('#videoId').css('height', '315px');
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
                $('#overLayImage').append($('#overlay-logo').show());
                $('.video-js .vjs-tech').css('width', '100%');
                $('.video-js .vjs-tech').css('height', '100%');
                player.pause();
            });
            this.on('ended', function () {
                console.log('video done');
            });
            player.on('fullscreenchange', function () {
                const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                const event = state ? 'FullscreenOn' : 'FullscreenOff';
                if (event === 'FullscreenOn') {
                    $('.vjs-tech').css('width', '100%');
                    $('.vjs-tech').css('height', '100%');
                    self.fullScreenMode = true;
                    $('#videoId').append($('#overlay-logo').show());
                } else if (event === 'FullscreenOff') {
                    $('#videoId').css('width', 'auto');
                    $('#videoId').css('height', '315px');
                    self.fullScreenMode = false;
                }
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
        this.videoUtilService.video360withm3u8();
        const str = '<video id=videoId poster=' + this.posterImagePath + '  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
        $('#newPlayerVideo').append(str);
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
        this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
        $('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
        $('#videoId').css('height', '315px');
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
                    $('#overLayImage').append($('#overlay-logo').show());
                    player.pause();
                    $('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + newValue.selectedVideo.playerColor + '!important');
                });
                player.on('fullscreenchange', function () {
                    const state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    const event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if (event === 'FullscreenOn') {
                        $('.vjs-tech').css('width', '100%');
                        $('.vjs-tech').css('height', '100%');
                        newValue.fullScreenMode = true;
                        $('#videoId').append($('#overlay-logo').show());
                    } else if (event === 'FullscreenOff') {
                        $('#videoId').css('width', 'auto');
                        $('#videoId').css('height', '315px');
                        newValue.fullScreenMode = false;
                    }
                });
            }
        });
        $('#videoId').css('width', 'auto');
        $('#videoId').css('height', '315px');
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
        $('#watchedFullyModelPopup').modal('hide');
        $('#totalwatchedUsersModelPopup').modal('hide');
        $('#usersMinutesModelPopup').modal('hide');
        $('#videoSkippedPlayed').modal('hide');
        $('#worldMapModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
}

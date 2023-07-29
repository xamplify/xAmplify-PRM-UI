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

declare var  $, QuickSidebar, Highcharts: any;

@Component({
    selector: 'app-video-based-report',
    templateUrl: './video-based-reports.component.html',
    styleUrls: ['./video-based-reports.component.css', ],
    providers: [Pagination]
})
export class VideoBasedReportsComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() selectedVideo: SaveVideoFile;
    @Input() damId : number;
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

    videoLeadsDetails: any;
    videoLeadsTotalListDetails: any;
    videoLeadsDetailsPagination: Pagination = new Pagination();
    countryCode: string;
    downloadTypeName = '';
    downloadCsvList: any;
    downloadDataList = [];
    worldMapCampaignUsersInfo: any;
    worldMapCampaignUsersTotalData: any;
    worldMapdataReport: any;
    viewsBarData: any;
    trellisBarChartData: any;
    paginationType:string;
    videoPlayedSkipedInfo:any;
    logListName = "";
    videoTotalViews: number;
    isLoadingDownloadList = false;
    isVideoPlayedDurationDownload = false;

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
        this.videoUtilService.damId = this.damId;
        this.router.navigate(['./home/content/videos/reports']);
    }

    watchedByTenUserschartsDayStates(minutesWatched: any, names: any) {
        let maxValue = Math.max.apply(null, minutesWatched);
        if(maxValue<10){maxValue = 9}
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
                            enabled: true,
                            style:{
                                color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",
                            }
                        },
                        minPointLength: 3,
                    },
                    series: {
                        cursor: 'pointer',
                        dataLabels:{
                            style:{
                                backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
                            }
                        },
                        colorByPoint: true,
                        point: {
                            events: {
                                click: function () {
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
                        enabled: i === 0,
                        formatter: function () {
                          const text = this.value,
                            formatted = text.length > 10 ? text.substring(0, 10) + '...' : text;
                              return formatted ;
                        }
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
                   // max:10
                    max: maxValue+1  // findout maxmum,it is important
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
        charts[0].xAxis[0].labelGroup.element.childNodes.forEach(function(label)
        {
            label.style.cursor = "pointer";
            label.onclick = function(){ self.totalMinutesWatchedByMostUsers();}
        });
    }
    videoPlayedandSkippedDuration(views, skipped) {
        let xAxis = ' ';
        let yAxis = ' ';
        if(skipped.length>0 || views.length>0) {
          xAxis = 'Seconds';
          yAxis='Views'
        }
        const self = this;
        Highcharts.chart('video-skipped', {
            chart: {
                type: 'area',
                backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
            },
            title: {
                text: ' '
            },
            exporting: { enabled: false },
            xAxis:[{
              title: {
                  text: xAxis,
                  style: {
                    color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",},
              },
              labels:{
                style:{
                    color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666"
                }
              }
          }],
            yAxis: [{
              allowDecimals: false,
              title: {
                  text: yAxis,
                  style: {
                    color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}
              },
              labels: {
                  style: {
                    color: this.authenticationService.isDarkForCharts ? "#fff" : "#696666",}    
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
            },
            (error: any) => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            });
        }
    }
    watchedFullyDetailReport() {
        this.paginationType = 'watchedFully';
        this.downloadTypeName = 'watchedFully';
        this.videoBaseReportService.watchedFullyReport(this.selectedVideo.id, this.pagination).subscribe(
            (result: any) => {
            	if(result.access){
                console.log(result);
                result.data.forEach((element, index) => {
                  if(element.time){ element.time = new Date(element.utcTimeString);}
                });
                this.watchedFullyReportData = result.data;
                this.pagination.totalRecords = result.totalRecords;
                this.pagination = this.pagerService.getPagedItems(this.pagination, result.data);
                // if (this.watchedFullyReportData.length > 0) {
                $('#watchedFullyModelPopup').modal('show');
                //this.watchedFullyTotalReport(this.pagination.totalRecords);
                // }
            }else{
            	this.authenticationService.forceToLogout();
            }
            },
            (err: any) => { console.log(err); })
    }
    totalMinutesWatchedByMostUsers() {
        this.downloadTypeName = 'minetesWatched';
        this.videoBaseReportService.totlaMinutesWatchedByMostUsers(this.selectedVideo.id).subscribe(
            (response: any) => {
                if (response.access) {
                	let result =response.data;
                    console.log(result);
                    result.forEach((element, index) => { if (element.date) { element.date = new Date(element.utcTimeString); } });
                    this.totalUsersWatched = result;
                    if (this.totalUsersWatched.length > 0) {
                        $('#totalwatchedUsersModelPopup').modal('show');
                    }
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            (err: any) => { console.log(err); })
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
                    this.videoTotalViews = result.video_views_count_data.totalViewsCount;
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
        this.downloadTypeName = 'clickedMenetsWatched';
        console.log(this.dropdownValue + 'and inner data' + this.minutesinnerSort);
        this.userId = userId;
        this.videoBaseReportService.getUsersMinutesWatchedDetailReports(this.dropdownValue, this.selectedVideo.id, this.minutesinnerSort, userId, this.pagination).
            subscribe(
            data => {
                if (data.access) {
                    console.log(data);
                    data.data.forEach((element) => { if (element.date) { element.date = new Date(element.utcTimeString); } });
                    this.userMinutesWatched = data.data;
                    this.pagination.totalRecords = data.totalRecords;
                    this.pagination = this.pagerService.getPagedItems(this.pagination, this.userMinutesWatched);
                    console.log(this.pagination);
                    $('#usersMinutesModelPopup').modal('show');
                    // this.clickedMinutesWatchedTotalList(userId, this.pagination.totalRecords);
                } else {
                    this.authenticationService.forceToLogout();
            }
            },
            error => {
                this.xtremandLogger.error(error);
                this.xtremandLogger.errorPage(error);
            }
            );
    }

    videoLeadsList() {
        this.paginationType = 'videoLeads';
        this.downloadTypeName = 'videoLeads';
        this.videoBaseReportService.videoLeadsList(this.selectedVideo.id, this.videoLeadsDetailsPagination).
            subscribe(
            data => {
                if (data.access) {
                    console.log(data);
                    data.data.forEach((element) => { if (element.time) { element.time = new Date(element.utcTimeString); } });
                    this.videoLeadsDetails = data.data;
                    this.videoLeadsDetailsPagination.totalRecords = data.totalRecords;
                    this.videoLeadsDetailsPagination = this.pagerService.getPagedItems(this.videoLeadsDetailsPagination, this.videoLeadsDetails);
                    console.log(this.videoLeadsDetailsPagination);
                    //this.videoLeadsTotalList();
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.xtremandLogger.error(error);
                //this.xtremandLogger.errorPage(error);
            }
            );
    }

    videoLeadsTotalList() {
        this.videoLeadsDetailsPagination.maxResults = this.videoLeadsDetailsPagination.totalRecords;
        this.videoBaseReportService.videoLeadsList(this.selectedVideo.id, this.videoLeadsDetailsPagination).
            subscribe(
            data => {
                if (data.access) {
                    data.data.forEach((element) => { if (element.time) { element.time = new Date(element.utcTimeString); } });
                    this.videoLeadsTotalListDetails = data.data;
                    this.downloadLogs();
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.xtremandLogger.error(error);
            }
            );
    }

    setPage(event: any) {
        this.paginationType = event.type;
        if(this.paginationType === 'videoPlayed'){ this.videoPlayedPagination.pageIndex = event.page; }
        else if(this.paginationType === 'videoLeads'){ this.videoLeadsDetailsPagination.pageIndex = event.page; }
        else { this.pagination.pageIndex = event.page; }
        this.callPaginationMethods();
    }
    paginationDropdown(pagination:Pagination){
        if(this.paginationType === 'videoPlayed'){this.videoPlayedPagination = pagination; }
        else if(this.paginationType === 'videoLeads'){ this.videoLeadsDetailsPagination = pagination; }
        else { this.pagination = pagination; }
        this.callPaginationMethods();
    }
    callPaginationMethods(){
        if (this.paginationType === 'userMinutesWatched') {
            this.clickedMinutesWatched(this.userId);
        }
        else if (this.paginationType === 'videoLeads') {
            this.videoLeadsList();
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
        this.downloadTypeName = 'videoLeads';
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
        this.downloadTypeName = 'skippedDuration';
        this.videoBaseReportService.videoSkippedDurationInfo(this.selectedVideo.id, this.pagination).subscribe(
            (result: any) => {
                if (result.access) {
                    console.log(result);
                    result.data.forEach((element) => {
                        if (element.date) { element.date = new Date(element.date); }
                        if (element.endTime) { element.endTime = new Date(element.endTime); }
                    });
                    this.videoSkippedDuration = result.data;
                    this.pagination.totalRecords = result.totalRecords;
                    this.pagination = this.pagerService.getPagedItems(this.pagination, this.videoSkippedDuration);
                    //this.videoSkippedDurationTotalInfo(this.pagination.totalRecords);
                } else {
                	this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.xtremandLogger.error(error);
                //  this.xtremandLogger.errorPage(error);
            }
        );
    }
    videoPlayedDurationInfo() {
        this.paginationType = 'videoPlayed';
        this.downloadTypeName = 'playedDuration';
        this.videoBaseReportService.videoPlayedDurationInfo(this.selectedVideo.id, this.videoPlayedPagination).subscribe(
            (result: any) => {
                if (result.access) {
                    console.log(result);
                    result.data.forEach((element) => {
                        if (element.date) { element.date = new Date(element.date); }
                        if (element.endTime) { element.endTime = new Date(element.endTime); }
                    });
                    this.videoPlayedDuration = result.data;
                    this.videoPlayedPagination.totalRecords = result.totalRecords;
                    this.videoPlayedPagination = this.pagerService.getPagedItems(this.videoPlayedPagination, this.videoPlayedDuration);
                    //this.videoPlayedDurationTotalInfo(this.videoPlayedPagination.totalRecords);
                } else {
                	this.authenticationService.forceToLogout();
                }
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
                if (result.access) {
                    console.log(result);
                    result.data.forEach((element) => { if (element.time) { element.time = new Date(element.utcTimeString); } });
                    this.worldMapCampaignUsersInfo = result.data;
                    this.pagination.totalRecords = result.totalRecords;
                    this.pagination = this.pagerService.getPagedItems(this.pagination, result.data);
                    if (this.worldMapCampaignUsersInfo.length > 0) {
                        $('#worldMapModal').modal('show');
                    }
                    //this.getCampaignCoutryViewsDetailsTotalReport(countryCode, this.pagination.totalRecords);
                } else {
                	this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.xtremandLogger.error(error);
            }
            );
    }

    getCampaignCoutryViewsDetailsTotalReport(countryCode: string, totalRecords: number) {
        this.countryCode = countryCode.toUpperCase();
        this.reportsPagination.maxResults = totalRecords;
        this.videoBaseReportService.getCampaignCoutryViewsDetailsReport(this.selectedVideo.id, this.countryCode, this.reportsPagination).
            subscribe(
            (result: any) => {
                if (result.access) {
                    console.log(result);
                    this.worldMapCampaignUsersTotalData = result.data;
                    this.downloadLogs();
                } else {
                    this.authenticationService.forceToLogout();
                }
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
                if (result.access) {
                    console.log(result);
                    result.data.forEach((element, index) => {
                        if(element.time){ element.time = new Date(element.utcTimeString);}
                      });
                    this.watchedFullyTotalReportList = result.data;
                    this.downloadLogs();
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            (err: any) => { console.log(err); })
    }
    
    totalMinutesWatchedByTopRecipients() {
        this.downloadTypeName = 'minetesWatched';
        this.videoBaseReportService.totlaMinutesWatchedByMostUsers(this.selectedVideo.id).subscribe(
            (result: any) => {
                if (result.access) {
                    console.log(result);
                    result.data.forEach((element, index) => { if (element.date) { element.date = new Date(element.utcTimeString); } });
                    this.totalUsersWatched = result.data;
                    this.downloadLogs();
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            (err: any) => { console.log(err); })
    }

    clickedMinutesWatchedTotalList(userId: any, totalRecord: number) {
        this.reportsPagination.maxResults = totalRecord;
        this.userId = userId;
        this.videoBaseReportService.getUsersMinutesWatchedDetailReports(this.dropdownValue, this.selectedVideo.id, this.minutesinnerSort, userId, this.reportsPagination).
            subscribe(
            data => {
                if (data.access) {
                    console.log(data);
                    data.data.forEach((element) => { if (element.date) { element.date = new Date(element.utcTimeString); } });
                    this.userMinutesWatchedTotalList = data.data;
                    this.downloadLogs();
                } else {
                    this.authenticationService.forceToLogout();
            }
            },
            error => {
                this.xtremandLogger.errorPage(error);
            }
            );
    }

    videoSkippedDurationTotalInfo(totalRecords: number) {
        this.reportsPagination.maxResults = totalRecords;
        this.videoBaseReportService.videoSkippedDurationInfo(this.selectedVideo.id, this.reportsPagination).subscribe(
            (result: any) => {
                if (result.access) {
                    console.log(result);
                    this.videoSkippedDurationTotalList = result.data;
                    this.downloadLogs();
                } else {
                	this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.xtremandLogger.error(error);
            }
        );
    }
    videoPlayedDurationTotalInfo(totalRecords: number) {
        this.reportsPagination.maxResults = totalRecords;
        this.videoBaseReportService.videoPlayedDurationInfo(this.selectedVideo.id, this.reportsPagination).subscribe(
            (result: any) => {
                if (result.access) {
                    console.log(result);
                    this.videoPlayedDurationTotalList = result.data;
                    this.downloadLogs();
                } else {
                    this.authenticationService.forceToLogout();
                }
            },
            error => {
                this.xtremandLogger.error(error);
            }
        );
    }

    downloadFunctionality(){
        this.isLoadingDownloadList = true;
        if (this.downloadTypeName === 'minetesWatched') {
        	this.totalMinutesWatchedByTopRecipients();
           // this.downloadLogs();
        } else if (this.downloadTypeName === 'watchedFully') {
            this.watchedFullyTotalReport(this.pagination.totalRecords);
        } else if (this.downloadTypeName === 'worldMapData') {
            this.getCampaignCoutryViewsDetailsTotalReport(this.countryCode, this.pagination.totalRecords);
        } else if (this.downloadTypeName === 'clickedMenetsWatched') {
            this.clickedMinutesWatchedTotalList(this.userId, this.pagination.totalRecords);
        }
        else if (this.downloadTypeName === 'playedDuration') {
            this.isVideoPlayedDurationDownload = true;
            this.videoPlayedDurationTotalInfo(this.videoPlayedPagination.totalRecords);
        }
        else if (this.downloadTypeName === 'skippedDuration') {
            this.videoSkippedDurationTotalInfo(this.pagination.totalRecords);
        }else if (this.downloadTypeName === 'videoLeads') {
            this.videoLeadsTotalList();
        }

    }

    downloadLogs() {
        if (this.downloadTypeName === 'minetesWatched') {
            this.logListName = 'Minutes_Views_Logs.csv';
            this.downloadCsvList = this.totalUsersWatched;
        } else if (this.downloadTypeName === 'watchedFully') {
            this.logListName = 'Fully_Watched_Logs.csv';
            this.downloadCsvList = this.watchedFullyTotalReportList;
        } else if (this.downloadTypeName === 'worldMapData') {
            this.logListName = 'Country_Wise_Logs.csv';
            this.downloadCsvList = this.worldMapCampaignUsersTotalData;
        } else if (this.downloadTypeName === 'clickedMenetsWatched') {
            this.logListName = 'Clicked_Minutes_logs.csv';
            this.downloadCsvList = this.userMinutesWatchedTotalList;
        }
        else if (this.downloadTypeName === 'playedDuration') {
            this.logListName = 'Played_Duration_logs.csv';
            this.downloadCsvList = this.videoPlayedDurationTotalList;
        }
        else if (this.downloadTypeName === 'skippedDuration') {
            this.logListName = 'Skipped_Duration_logs.csv';
            this.downloadCsvList = this.videoSkippedDurationTotalList;
        }else if (this.downloadTypeName === 'videoLeads') {
            this.logListName = 'Video_leads_logs.csv';
            this.downloadCsvList = this.videoLeadsTotalListDetails;
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
                let hours = this.referenceService.formatAMPM(date);
                object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                object["Minutes watched"] = this.downloadCsvList[i].minutesWatched;
                object["Device"] = this.downloadCsvList[i].device;
                object["Location"] = this.downloadCsvList[i].city + ' ' + this.downloadCsvList[i].state + ' ' + this.downloadCsvList[i].country;
            }
            else if (this.downloadTypeName === 'watchedFully') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                object["Campaign Name"] = this.downloadCsvList[i].campaignName;
                let hours = this.referenceService.formatAMPM(time);
                object["Date and Time"] = time.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                object["Device"] = this.downloadCsvList[i].deviceType;
                object["Location"] = this.downloadCsvList[i].city + ' ' + this.downloadCsvList[i].state + ' ' + this.downloadCsvList[i].country;
            }
            else if (this.downloadTypeName === 'worldMapData') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                object["Campaign Name"] = this.downloadCsvList[i].campaignName;
                let hours = this.referenceService.formatAMPM(time);
                object["Date and Time"] = time.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                object["Device"] = this.downloadCsvList[i].os;
                object["City"] = this.downloadCsvList[i].city;
                object["Country"] = this.downloadCsvList[i].country;
            }
            else if (this.downloadTypeName === 'clickedMenetsWatched') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                object["Campaign Name"] = this.downloadCsvList[i].campaignName;
                object["Video Title"] = this.downloadCsvList[i].videoTitle;
                let hours = this.referenceService.formatAMPM(date);
                object["Date and Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                object["Minutes Watched"] = this.downloadCsvList[i].minutesWatched;
                object["Device"] = this.downloadCsvList[i].device;
                object["Location"] = this.downloadCsvList[i].city + ' ' + this.downloadCsvList[i].state + ' ' + this.downloadCsvList[i].country;
            }
            else if (this.downloadTypeName === 'playedDuration') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                let hours = this.referenceService.formatAMPM(date);
                object["Start Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                let endHours = this.referenceService.formatAMPM(endTime);
                object["End Time"] = endTime.toDateString().split(' ').slice(1).join(' ') + ' ' + endHours;
                object["Device"] = this.downloadCsvList[i].device;
            }
            else if (this.downloadTypeName === 'skippedDuration') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                let hours = this.referenceService.formatAMPM(date);
                object["Start Time"] = date.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                let endHours = this.referenceService.formatAMPM(endTime);
                object["End Time"] = endTime.toDateString().split(' ').slice(1).join(' ') + ' ' + endHours;
                object["Device"] = this.downloadCsvList[i].device;
            }
            else if (this.downloadTypeName === 'videoLeads') {
                object["Email Id"] = this.downloadCsvList[i].emailId;
                let hours = this.referenceService.formatAMPM(time);
                object["Date & Time"] = time.toDateString().split(' ').slice(1).join(' ') + ' ' + hours;
                object["City"] = this.downloadCsvList[i].city;
                object["State"] = this.downloadCsvList[i].state;
                object["Country"] = this.downloadCsvList[i].country;
                object["Device"] = this.downloadCsvList[i].os;
            }
            this.downloadDataList.push(object);
        }
        this.referenceService.isDownloadCsvFile = true;
        this.isLoadingDownloadList = false;
        this.isVideoPlayedDurationDownload = false;
    }
    clickedTrellisChart(){
       this.totalMinutesWatchedByMostUsers();
    }
    ngOnInit() {
        this.pagination.pageIndex = 1;
        this.pagination.maxResults = 12;
        this.getWatchedCountInfo(this.selectedVideo.alias);
        this.getCampaignVideoCountriesAndViews(this.selectedVideo.alias);
        this.selectedCampaignWatchedUsers(this.videoUtilService.sortMonthDates[3].value);
        this.selectedSortByValue(this.minutesSort.value);
        this.getVideoPlayedSkippedInfo();
        this.videoUtilService.selectedVideoId = this.selectedVideo.id;
        this.nonApplicableUsersMinutesWatched();
        this.videoLeadsList();
    }
    ngAfterViewInit() {
        this.xtremandLogger.log('called ng after view init');
    } // ng After view closed
    ngOnDestroy() {
        this.xtremandLogger.log('Deinit - Destroyed Component');
        $('#watchedFullyModelPopup').modal('hide');
        $('#totalwatchedUsersModelPopup').modal('hide');
        $('#usersMinutesModelPopup').modal('hide');
        $('#videoSkippedPlayed').modal('hide');
        $('#worldMapModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop fade in').remove();
    }
}

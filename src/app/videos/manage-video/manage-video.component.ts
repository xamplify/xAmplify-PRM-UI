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
import { UtilService } from '../../core/services/util.service';
import { CustomResponse } from '../../common/models/custom-response';

declare var swal, QuickSidebar, $: any;

@Component({
    selector: 'app-manage-video',
    templateUrl: './manage-video.component.html',
    styleUrls: ['./manage-video.component.css'],
    providers: [Pagination, HttpRequestLoader, HomeComponent]
})
export class ManageVideoComponent implements OnInit, OnDestroy {
    manageVideos = true;
    editVideo = false;
    playVideo = false;
    campaignReport = false;
    selectedVideo: SaveVideoFile;
    categories: Category[];
    showUpdatevalue = false;
    showMessage = false;
    showVideoFileName: string;
    categoryNum: number;
    checkTotalRecords: boolean;
    allRecords: number;
    disableDropDowns: boolean;
    hasVideoRole = false;
    hasStatsRole = false;
    hasCampaignRole = false;
    loggedInUserId = 0;
    loggedUserName: string;
    hasAllAccess = false;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    customResponse: CustomResponse = new CustomResponse();
    sortVideos: any;
    videoSort: any;
    videoType: any;
    isListView = false;
    videoTypes = [{ 'name': 'My Videos', 'value': 'myVideos' }, { 'name': 'Partner Videos', 'value': 'partnerVideos' }];

    constructor(public videoFileService: VideoFileService, public referenceService: ReferenceService,
        public authenticationService: AuthenticationService, public videoUtilService: VideoUtilService,
        public pagerService: PagerService, public pagination: Pagination, public router: Router,
        public xtremandLogger: XtremandLogger, public homeComponent: HomeComponent, public utilService:UtilService) {
        this.xtremandLogger.log('MangeVideosComponent : constructor ');
        this.loggedInUserId = this.authenticationService.getUserId();
        this.loggedUserName = this.authenticationService.user.emailId;
        this.defaultBannerMessageValues();
        this.sortVideos = this.videoUtilService.sortVideos;
        if(this.authenticationService.isOnlyPartner()){
          this.sortVideos = this.sortVideos.concat([{ 'name': 'Company Name(ASC)', 'value': 'companyName-ASC' }]);
          this.sortVideos = this.sortVideos.concat([{ 'name': 'Company Name(DESC)', 'value': 'companyName-DESC'}]);
        }
        this.videoSort = this.sortVideos[0];
        this.categoryNum = this.videoFileService.categoryNumber = 0;
        this.videoType = this.videoTypes[0];
        this.videoFileService.videoType = this.videoTypes[0].value;
        if(this.authenticationService.isOnlyPartner()){ this.videoFileService.videoType = 'partnerVideos'; }
    }
    defaultBannerMessageValues() {
        this.showMessage = this.showUpdatevalue = false;
    }
    getVideoTypes(videoType) {
        this.pagination.pageIndex = 1;
        this.videoFileService.categoryNumber = this.categoryNum = 0;
        this.pagination.searchKey = null;
        this.pagination.maxResults = 12;
        this.videoSort = this.sortVideos[0];
        console.log(this.videoType);
        this.videoFileService.videoType = videoType.value;
        this.loadVideos(this.pagination);
    }
    ngOnInit() {
      try {
        this.pagination.maxResults = 12;
        this.isListView = ! this.referenceService.isGridView;
        QuickSidebar.init();
        this.hasVideoRole = this.referenceService.hasRole(this.referenceService.roles.videRole);
        this.hasStatsRole = this.referenceService.hasRole(this.referenceService.roles.statsRole);
        this.hasCampaignRole = this.referenceService.hasRole(this.referenceService.roles.campaignRole);
        this.hasAllAccess = this.referenceService.hasAllAccess();
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        if (this.referenceService.homeMethodsCalled === false) {
            this.homeComponent.getVideoTitles();
            this.homeComponent.getCategorisService();
            this.referenceService.homeMethodsCalled = true;
        }
        this.xtremandLogger.log(this.referenceService.videoTitles);
        this.xtremandLogger.log('MangeVideosComponent ngOnInit()');
            if (this.videoFileService.actionValue === 'Save') {
                this.referenceService.loading(this.httpRequestLoader, true);
                this.showVideosPage(false, true, false, false);
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showMessage = this.videoFileService.showSave; // true
                this.showUpdatevalue = this.videoFileService.showUpadte; // false
            }
            if (this.videoFileService.actionValue !== 'Save' || this.videoFileService.actionValue === undefined) {
                this.showVideosPage(true, false, false, false);
                this.defaultBannerMessageValues();
            }
            this.checkTotalRecords = true;
            this.loadVideos(this.pagination);
            if (this.videoUtilService.selectedVideo) {
                this.showCampaignVideoReport(this.videoUtilService.selectedVideo);
            }
        } catch (error) {
            this.xtremandLogger.error('error in ng oninit :' + error);
        }
    }
    loadVideos(pagination: Pagination) {
        try {
            this.referenceService.loading(this.httpRequestLoader, true);
            this.videoFileService.loadVideoFiles(pagination)
                .subscribe((result: any) => {
                    pagination.totalRecords = result.totalRecords;
                    if (this.checkTotalRecords) {
                        this.allRecords = result.totalRecords;
                        this.checkTotalRecords = false;
                    }
                    this.categories = result.categories;
                    console.log(this.categories);
                    this.categories.sort(function (a: any, b: any) { return (a.id) - (b.id); });
                    this.referenceService.loading(this.httpRequestLoader, false);
                    pagination = this.pagerService.getPagedItems(pagination, result.listOfMobinars);
                },
                (error: any) => {
                    this.xtremandLogger.error('Manage-videos component:  Loading Videos():' + error);
                    this.xtremandLogger.errorPage(error);
                },
                () => this.xtremandLogger.log('load videos completed:')
                );
        } catch (error) {
            this.xtremandLogger.error('erro in load videos :' + error);
        }
    };
    setPage(event: any) {
        this.xtremandLogger.log(event.page, event.type);
        this.pagination.pageIndex = event.page;
        this.loadVideos(this.pagination);
        this.defaultBannerMessageValues();
    }
    getCategoryNumber() {
        this.defaultBannerMessageValues();
        this.xtremandLogger.log(this.categoryNum);
        this.videoFileService.categoryNumber = this.categoryNum;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    searchVideoTitelName() {
        this.defaultBannerMessageValues();
        this.xtremandLogger.info(this.pagination.searchKey);
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    eventHandler(keyCode: any) {  if (keyCode === 13) {  this.searchVideoTitelName(); } }
    selectedSortByValue(event: any) {
        this.defaultBannerMessageValues();
        this.videoSort = event;
        this.pagination =  this.utilService.sortOptionValues(this.videoSort, this.pagination);
        this.loadVideos(this.pagination);
    }
    showEditVideo(video: SaveVideoFile) {
        try{
        this.referenceService.loading(this.httpRequestLoader, true);
        this.xtremandLogger.log('show edit video method in mange videos ' + JSON.stringify(video));
        this.videoFileService.videoViewBy = video.viewBy;
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((editVideoFile: SaveVideoFile) => {
                this.xtremandLogger.log('enter the show edit vidoe method');
                this.referenceService.loading(this.httpRequestLoader, false);
                if (editVideoFile.imageFiles == null || editVideoFile.gifFiles == null) {
                    editVideoFile.gifFiles = []; editVideoFile.imageFiles = [];
                }
                this.videoFileService.saveVideoFile = editVideoFile;
                this.xtremandLogger.log('show edit vidoe object :');
                this.xtremandLogger.log(this.videoFileService.saveVideoFile);
                this.videoFileService.actionValue = 'Update';
                this.showVideosPage(false, true, false, false);
            },
            (error: any) => {
                this.xtremandLogger.error('Error In: show edit videos ():' + error);
                this.xtremandLogger.errorPage(error);
            }
            );
          }catch(error){
            this.xtremandLogger.error('error'+error);
          }
    }
    showPlayVideo(video: SaveVideoFile) {
        try{
        this.referenceService.isPlayVideoLoading(true);
        this.videoFileService.videoViewBy = video.viewBy;
        this.xtremandLogger.log('MangeVideoComponent playVideo:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((playVideoFile: SaveVideoFile) => {
               this.xtremandLogger.log(playVideoFile);
                this.selectedVideo = playVideoFile;
                this.selectedVideo.uploadedUserId = video.uploadedUserId;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showVideosPage(false, false, true, false);
            },
            (error: any) => {
                this.xtremandLogger.error('Error In: show play videos ():' + error);
                this.xtremandLogger.errorPage(error);
                this.referenceService.isPlayVideoLoading(false);
            });
          }catch(error){this.xtremandLogger.error('error'+error); }
    }
    showCampaignVideoReport(video: SaveVideoFile) {
        try{
        this.referenceService.loading(this.httpRequestLoader, true);
        this.xtremandLogger.log('ManageVideoComponent campaign report:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((campaignVideoFile: SaveVideoFile) => {
                this.xtremandLogger.log(video);
                this.selectedVideo = campaignVideoFile;
                this.referenceService.loading(this.httpRequestLoader, false);
                this.showVideosPage(false, false, false, true);
                this.videoUtilService.selectedVideo = null;
            },
            (error: any) => {
                this.xtremandLogger.error(' Error In :show video campaign videos ():' + error);
                this.xtremandLogger.errorPage(error);
            });
          }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    campaignRouter(video: SaveVideoFile) {
       try{
        this.xtremandLogger.log('ManageVideoComponent campaign router:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((videoFile: SaveVideoFile) => {
                console.log(video);
                this.referenceService.campaignVideoFile = videoFile;
                this.referenceService.selectedCampaignType = 'video';
                this.referenceService.isCampaignFromVideoRouter = true;
                this.referenceService.videoType =  this.videoFileService.videoType;
                this.router.navigateByUrl('/home/campaigns/create');
            },
            (error: string) => {
                this.xtremandLogger.error('Error In: show campaign videos ():' + error);
                this.xtremandLogger.errorPage(error);
            });
          }catch(error){ this.xtremandLogger.error('error'+error);}
    }
    deleteVideoFile(alias: string, position: number, videoName: string) {
        this.xtremandLogger.log('MangeVideoComponent deleteVideoFile alias # ' + alias + ', position # ' + position);
        this.videoFileService.deleteVideoFile(alias)
            .subscribe(
            data => {
                this.xtremandLogger.log(data);
                this.xtremandLogger.log('MangeVideoComponent deleteVideoFile success : ' + data);
                this.pagination.pagedItems.splice(position, 1);
                this.defaultBannerMessageValues();
                this.showVideoFileName = videoName;
                this.showVideoFileName = '"'+this.showVideoFileName+'" video deleted successfully';
                this.customResponse = new CustomResponse( 'SUCCESS', this.showVideoFileName, true );
                $('html,body').animate({ scrollTop: 0 }, 'slow');
                if (this.pagination.pagedItems.length === 0) {
                    this.pagination.pageIndex = 1;
                    this.loadVideos(this.pagination);
                }
            },
            (error: any) => {
                try{
                if (error._body.search('video is being used in one or more campaigns. Please delete those campaigns') === -1) {
                    this.xtremandLogger.error('Error In : delete videos ():' + error);
                    this.referenceService.showServerError(this.httpRequestLoader);
                    this.httpRequestLoader.statusCode = error.status;
                } else if (error._body.search('video is being used in one or more campaigns. Please delete those campaigns') !== -1) {
                    let message = error._body.replace('Heads up!','Heads up! " ');
                     message = message.replace('video','" video');
                     message = message.replace('"','');
                     message = message.replace('."','.');
                     message = message.replace('{message":','');
                     message = message.replace('}','')
                     message = message.replace('more campaigns','more campaigns or might be used by vendor activity');
                     const errorMesge = message;
                    this.defaultBannerMessageValues();
                     $('html,body').animate({ scrollTop: 0 }, 'slow');
                    this.customResponse = new CustomResponse( 'ERROR', errorMesge, true );
                } else {
                    this.xtremandLogger.error('Error In: delete videos ():' + error);
                    this.xtremandLogger.errorPage(error);
                }
              }catch(error){
                this.xtremandLogger.log(error);
              }
                this.xtremandLogger.log(error);
            },
            () => this.xtremandLogger.log('deleted functionality done')
            );
    }
    deleteVideoAlert(alias: string, position: number, videoName: string) {
        this.xtremandLogger.log('videoId in sweetAlert()');
        const self = this;
        swal({
            title: 'Are you sure?',
            text: 'You won’t be able to undo this action!',
            type: 'warning',
            showCancelButton: true,
            swalConfirmButtonColor: '#54a7e9',
            swalCancelButtonColor: '#999',
            confirmButtonText: 'Yes, delete it!'
        }).then(function (myData: any) {
            console.log('ManageVidoes showAlert then()' + myData);
            self.deleteVideoFile(alias, position, videoName);
        }, function(dismiss:any) {
            console.log('you clicked on option'+dismiss);
        });
    }
    getVideoType() {
        this.videoType = this.videoFileService.videoType;
        if (this.videoType === this.videoTypes[0].value) {
        this.videoType = this.videoTypes[0];
        } else { this.videoType = this.videoTypes[1]; }
    }
    update(videoFile: SaveVideoFile) {
        this.videoType = this.videoFileService.videoType;
        this.getVideoType();
        if (videoFile != null) { this.homeComponent.getVideoTitles(); }
        this.pagination.pageIndex = 1;
        this.videoSort = this.sortVideos[0];
        this.pagination.sortcolumn = null;
        this.pagination.sortingOrder = null;
        this.categoryNum = this.videoFileService.categoryNumber = 0;
        this.pagination.searchKey = null;
        this.loadVideos(this.pagination);
        this.showVideosPage(true, false, false, false);
        this.showMessage = this.videoFileService.showSave; // boolean
        this.showUpdatevalue = this.videoFileService.showUpadte; // boolean
        if (videoFile == null) {
            this.showVideoFileName = '';
            this.customResponse = new CustomResponse();
        } else {
            this.showVideoFileName = videoFile.title;
        }
        if(this.showMessage){
            this.showVideoFileName = '"'+this.showVideoFileName+'" video saved successfully';
            this.customResponse = new CustomResponse( 'SUCCESS', this.showVideoFileName, true );

         } else if(this.showUpdatevalue){
            this.showVideoFileName = '"'+this.showVideoFileName+'" video settings updated successfully';
            this.customResponse = new CustomResponse( 'SUCCESS', this.showVideoFileName, true );
         }
        this.xtremandLogger.info('update method called ' + this.showVideoFileName);
    }
    showVideosPage(manageVideos: boolean, editVideo: boolean, playVideo: boolean, campaignReport: boolean) {
        this.manageVideos = manageVideos;
        this.editVideo = editVideo;
        this.playVideo = playVideo;
        this.campaignReport = campaignReport;
    }
    backToManageVideos() {
        this.videoType = this.videoFileService.videoType;
        this.getVideoType();
        this.xtremandLogger.log('come to goto manage videos :');
        this.videoUtilService.selectedVideo = null;
        if (!this.manageVideos) { this.loadVideos(this.pagination); }
        this.showVideosPage(true, false, false, false);
        this.defaultBannerMessageValues();
        this.videoFileService.actionValue = '';
        this.customResponse = new CustomResponse();
    }
    gotoHome() {
        this.videoUtilService.selectedVideo = null;
        this.router.navigate(['./home/dashboard/default']);
    }
    ngOnDestroy() {
        swal.close();
        this.videoFileService.actionValue = this.videoFileService.videoViewBy = '';
    }
}

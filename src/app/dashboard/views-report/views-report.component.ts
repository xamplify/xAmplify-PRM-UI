import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { ReferenceService } from '../../core/services/reference.service';
import { Logger } from 'angular2-logger/core';
import { PagerService } from '../../core/services/pager.service';
import { VideoFileService} from '../../videos/services/video-file.service';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Category } from '../../videos/models/category';
import { DashboardService } from '../dashboard.service';
import { ContactList } from '../../contacts/models/contact-list';
import { ContactService } from '../../contacts/services/contact.service';

declare var Metronic, Layout, Demo, Index, QuickSidebar,videojs, $, Tasks: any;

@Component( {
    selector: 'app-views-report',
    templateUrl: './views-report.component.html',
    styleUrls: ['./views-report.component.css'],
providers: [ Pagination, HttpRequestLoader, DashboardService]
})
export class ViewsReportComponent implements OnInit {
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
public totalRecords: number;
videos: Array<SaveVideoFile>;
imagepath: string;
public errorPrepender: 'Error In:';
private videoJSplayer: any;
categories: Category[];
isvideoThere: boolean;
showDatailedData : boolean;
showVideoData : boolean;
pagedItems: any[];
public searchKey: string ;
sortingName: string = null;
sortcolumn: string = null;
sortingOrder: string = null;
categoryNum: number ;
public currentPageType: string = null;
public isCategoryThere: boolean;
public isCategoryUpdated: boolean;
emptyViewsRecord : boolean;
public totalViewsForThisVideo: Array<ContactList>;

launchVideoPreview:SaveVideoFile = new SaveVideoFile();
sortVideos  = [
               {'name': 'Sort By', 'value': ''},
               {'name': 'Title(A-Z)', 'value': 'title-ASC'},
               {'name': 'Title(Z-A)', 'value': 'title-DESC'},
               {'name': 'Created Time(ASC)', 'value': 'createdTime-ASC'},
               {'name': 'Created Time(DESC)', 'value': 'createdTime-DESC'},
               {'name': 'ViewBy(ASC)', 'value': 'viewBy-ASC'},
               {'name': 'ViewBy(DESC)', 'value': 'viewBy-DESC'},
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


    constructor(private videoFileService: VideoFileService,private referenceService: ReferenceService,private dashboardService: DashboardService,
            private pagerService: PagerService,private contactService: ContactService, private logger: Logger, public pagination: Pagination,private authenticationService: AuthenticationService) {
        this.categoryNum = 0;
        this.isCategoryThere = false;
        //this.categories = this.referenceService.refcategories;
    }

    viewsSparklineData(videoFile : number) {
        const myvalues = [2, 6, 12, 13, 12, 13, 7, 14, 13, 11, 11, 12, 17, 11, 11, 12, 15, 10];
        $('#sparkline_bar_' + videoFile).sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    minutesSparklineData(videoFile : number) {
        const myvalues = [2, 11, 12, 13, 12, 13, 10, 14, 13, 11, 11, 12, 11, 11, 10, 12, 11, 10];
        $('#sparkline_bar2_' + videoFile).sparkline(myvalues, {
            type: 'bar',
            width: '100',
            barWidth: 5,
            height: '55',
            barColor: '#35aa47',
            negBarColor: '#e02222'
        });
    }

    averageSparklineData(videoFile : number) {
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
    
    /*defaultGifPaths() {
        if (this.saveVideoFile.gifImagePath === this.saveVideoFile.gifFiles[0]) {
             this.gifBoolean1 = true; this.gifBoolean2 = this.gifBoolean3 = false;
        } else if (this.saveVideoFile.gifImagePath === this.saveVideoFile.gifFiles[1]) {
             this.gifBoolean2 = true; this.gifBoolean1 = this.gifBoolean3 = false;
        } else if ( this.saveVideoFile.gifImagePath = this.saveVideoFile.gifFiles[2]) {
            this.gifBoolean3 = true; this.gifBoolean1 = this.gifBoolean2 = false;
        } else { this.gifBoolean1 = this.gifBoolean2 = this.gifBoolean3 = false; }
    }*/
    
    loadVideos(pagination: Pagination) {
        this.pagination.maxResults = 12;
        try {
           this.referenceService.loading(this.httpRequestLoader, true);
           this.videoFileService.loadVideoForViewsReport(pagination)
             .subscribe((result: any) => {
                 this.videos = result.listOfMobinars;
                 this.totalRecords = result.totalRecords;
                 pagination.totalRecords = this.totalRecords;
                 /*if (this.checkTotalRecords === true) {
                      this.allRecords = this.totalRecords;
                      this.checkTotalRecords = false;
                  }*/
                 if (this.isCategoryThere === false || this.isCategoryUpdated === true) {
                      this.categories = result.categories;
                      this.categories.sort(function(a: any, b: any) { return (a.id) - (b.id); });
                 }
                 this.referenceService.loading(this.httpRequestLoader, false);
                 //console.log(this.categories);
                 //console.log(this.videos);
                 if (this.videos.length !== 0) {
                     this.isvideoThere = false;
                  } else {
                      this.isvideoThere = true;
                      this.pagedItems = null ;
                  }
                 /*if (this.videos.length === 0) {
                      this.isvideosLength = true;
                  } else {
                      this.isvideosLength = false;
                       }*/
                 for (let i = 0; i < this.videos.length; i++) {
                     this.imagepath = this.videos[i].imagePath + '?access_token=' + this.authenticationService.access_token;
                     this.videos[i].imagePath = this.imagepath;
                 }
                 this.isCategoryThere = true;
                 this.isCategoryUpdated = false;
                 pagination = this.pagerService.getPagedItems(pagination, this.videos);
             },
             (error: string) => {
               this.logger.error(this.errorPrepender + ' Loading Videos():' + error);
               this.referenceService.showServerError(this.httpRequestLoader);
             },
             () => console.log('load videos completed:' + this.videos ),
             );
         } catch (error) {
             this.logger.error('erro in load videos :' + error);
         }
     };
     setPage(page: number) {
     // if (page !== this.pagination.pageIndex) {
         this.pagination.pageIndex = page;
         if ( this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
             this.loadVideos(this.pagination);
         }
         else if ( this.currentPageType == "views_page" || (this.currentPageType == "views_page" && this.searchKey == "" )) {
             this.totalViewsForVideo(this.pagination);
         }
         //this.loadVideos(this.pagination);
         //this.showUpdatevalue = false;
         //this.showMessage = false;
      //}
     }
     getCategoryNumber() {
         //this.showMessage = false;
         //this.showUpdatevalue = false;
         this.isvideoThere = false;
         console.log(this.categoryNum);
         this.pagination.filterBy = this.categoryNum;
         this.pagination.pageIndex = 1;
         this.loadVideos(this.pagination);
     }
     /*searchDisableValue() {
         console.log(this.searchKey);
         if (this.searchKey !== null || this.searchKey.length !== 0) {
         this.searchDisable = false; }
         if (this.searchKey.length === 0 || this.searchKey === '') {
             this.searchDisable = true; }
     } */
     searchVideoTitelName() {
      // if ( this.searchKey !== null && this.searchDisable === false ){
         //this.showMessage = false;
         //this.showUpdatevalue = false;
         console.log(this.searchKey);
         this.pagination.searchKey = this.searchKey;
         this.pagination.pageIndex = 1;
         if ( this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
             this.loadVideos(this.pagination);
         }
         else if ( this.currentPageType == "views_page" || (this.currentPageType == "views_page" && this.searchKey == "" )) {
             this.totalViewsForVideo( this.pagination );
         }
      // }
     }
     selectedSortByValue( event: any ) {
         //this.showMessage = false;
         //this.showUpdatevalue = false;
         this.videoSort = event;
          const sortedValue = this.videoSort.value;
          if ( sortedValue !== '') {
              const options: string[] = sortedValue.split('-');
              this.sortcolumn = options[0];
              this.sortingOrder = options[1];
          }else {
              this.sortcolumn = null;
              this.sortingOrder = null;
          }
         this.pagination.pageIndex = 1;
         this.pagination.sortcolumn = this.sortcolumn ;
         this.pagination.sortingOrder = this.sortingOrder ;
         if ( this.currentPageType == null || (this.currentPageType == null && this.searchKey == "")) {
             this.loadVideos(this.pagination);
         }
         else if ( this.currentPageType == "all_contacts" || (this.currentPageType == "all_contacts" && this.searchKey == "" )) {
             //this.all_Contacts( this.pagination );
         }
     }
   
     userSelectedSortByValue( event: any ) {
         this.contactsUsersSort = event;
         const sortedValue = this.contactsUsersSort.value;
         if ( sortedValue !== '' ) {
             const options: string[] = sortedValue.split( '-' );
             this.sortcolumn = options[0];
             this.sortingOrder = options[1];
         } else {
             this.sortcolumn = null;
             this.sortingOrder = null;
         }
         this.pagination.pageIndex = 1;
         this.pagination.sortcolumn = this.sortcolumn;
         this.pagination.sortingOrder = this.sortingOrder;
         this.totalViewsForVideo( this.pagination);
         
         /*if ( this.currentContactType == null ) {
             this.loadContactLists( this.pagination );
         }
         else if ( this.currentContactType == "all_contacts" ) {
             this.all_Contacts( this.pagination );
         } else if ( this.currentContactType == "active_contacts" ) {
             this.active_Contacts( this.pagination );
         } else if ( this.currentContactType == "invalid_contacts" ) {
             this.invalid_Contacts( this.pagination );
         } else if ( this.currentContactType == "unSubscribed_contacts" ) {
             this.unSubscribed_Contacts( this.pagination );
         } else if ( this.currentContactType == "nonActive_contacts" ) {
             this.nonActive_Contacts( this.pagination );
         }*/
     }
     
     showPreview(videoFile:SaveVideoFile){
         this.appendVideoData(videoFile, "main_video", "modal-title");
         $("#show_preview").modal({backdrop: 'static', keyboard: false});
     }
     destroyPreview(){
         var player = videojs("videoId");
         if(player){
             console.log(player.currentType_);
             let videoType = player.currentType_;
             if(videoType=="application/x-mpegURL"){
                 console.log("Clearing Normal Video");
                 player.dispose();
                 $("#main_video").empty();
             }else{
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
     playVideo(){
         $('#main_video_src').empty();
         this.appendVideoData(this.launchVideoPreview, "main_video_src", "title");
     }
     
     
     appendVideoData(videoFile:SaveVideoFile,divId:string,titleId:string){
         console.log(videoFile);
          var alias = videoFile.alias;
          var fullImagePath = videoFile.imagePath;
          var title = videoFile.title;
          var videoPath = videoFile.videoPath;
          var is360 = videoFile.is360video;
          $("#"+divId).empty();
          $("#"+titleId).empty();
          $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" rel="stylesheet">');
          if(is360){
              console.log("Loaded 360 Video");
              $('.h-video').remove();
              $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
              $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
              $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
              $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
              var str = '<video id=videoId poster='+fullImagePath+'  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
              $("#"+titleId).append(title);
              $("#"+divId).append(str);
              console.log("360 video path"+videoPath);
              videoPath = videoPath.replace(".m3u8",".mp4");
              console.log("Updated 360 video path"+videoPath);
            //  videoPath = videoPath.replace(".mp4","_mobinar.m3u8");//Replacing .mp4 to .m3u8
              $("#"+divId+" video").append('<source src="'+videoPath+'" type="video/mp4">');
              var player = videojs('videoId');
              player.panorama({
                  autoMobileOrientation: true,
                  clickAndDrag: true,
                  clickToToggle: true,
                  callback: function () {
                    player.ready();
                  }
                });
              $("#videoId").css("width", "550px");
              $("#videoId").css("height", "310px");
              $("#videoId").css("max-width", "100%");
              
          }else{
              console.log("Loaded Normal Video");
              $('.p-video').remove();
              $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
              $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video" />');
              var str = '<video id=videoId  poster='+fullImagePath+' preload="none"  class="video-js vjs-default-skin" controls></video>';
              $("#"+titleId).append(title);
              $("#"+divId).append(str);
             // videoPath = videoPath.replace(".mp4","_mobinar.m3u8");//Replacing .mp4 to .m3u8
              console.log("Video Path:::"+videoPath);
              videoPath = videoPath.substring(0,videoPath.lastIndexOf('.'));
              videoPath =  videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
              console.log("Normal Video Updated Path:::"+videoPath);
             $("#"+divId+" video").append('<source src='+videoPath+' type="application/x-mpegURL">');
              $("#videoId").css("width", "550px");
              $("#videoId").css("height", "310px");
              $("#videoId").css("max-width", "100%");
              var document:any = window.document;
              var player = videojs("videoId");
              console.log(player);
              if(player){
                  player.on('fullscreenchange', function () {
                      var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                      var event = state ? 'FullscreenOn' : 'FullscreenOff';
                      if(event==="FullscreenOn"){
                          $(".vjs-tech").css("width", "100%");
                          $(".vjs-tech").css("height", "100%");
                      }else if(event==="FullscreenOff"){
                          $("#videoId").css("width", "550px");
                  
                      }
                       
                  });
              }
          }
          $("video").bind("contextmenu",function(){
              return false;
              });
          
      }
     
     backToReport(){
         this.showDatailedData = false;
         this.showVideoData = true;
         this.pagination.sortcolumn = null;
         this.pagination.sortingOrder = null;
         this.loadVideos(this.pagination);
         this.currentPageType = null;
        
         //this.selectedSortByValue( event );
     }
     
     showViewsData(){
         this.showDatailedData = true;
         this.showVideoData = false;
         this.pagination.sortcolumn = null;
         this.pagination.sortingOrder = null;
         this.totalViewsForVideo( this.pagination);
         this.currentPageType = "views_page";
        
     }
    
     totalViewsForVideo( pagination: Pagination ) {
         //this.pagination.maxResults = 12;
         this.logger.log( pagination );
         this.contactService.loadAllContacts( pagination )
             .subscribe(
             ( data: any ) => {
                 this.totalViewsForThisVideo = data.listOfUsers;
                 this.totalRecords = data.totalRecords;
                 if ( data.totalRecords.length == 0 ) {
                     this.emptyViewsRecord = true;
                 } else {
                     pagination.totalRecords = this.totalRecords;
                     this.logger.info( this.totalViewsForThisVideo );
                     pagination = this.pagerService.getPagedItems( pagination, this.totalViewsForThisVideo );
                     this.logger.log( data );
                 }
                 /*if (this.allFollowers.length == 0) {
                     this.emptyContactsUsers = true;
                     this.hidingContactUsers = false;
                  }
                  else {
                      this.emptyContactsUsers = false;
                      this.hidingContactUsers = true;
                      this.pagedItems = null ;
                  }*/
             },
             error => console.log( error ),
             () => console.log( "finished" )
             );
     }
     
    ngOnInit() {
        try {
            this.loadVideos(this.pagination);
            this.showVideoData = true;
            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            Index.init();
            Index.initDashboardDaterange();
            Index.initJQVMAP();
            Index.initCalendar();
            Index.initCharts();
            Index.initChat();
            Index.initMiniCharts();
            Tasks.initDashboardWidget();
            this.viewsSparklineData(videoFile);
            this.minutesSparklineData(videoFile);
            this.averageSparklineData(videoFile);
            var videoFile : any;
            this.videoJSplayer = videojs(document.getElementById('edit_video_player_' + videoFile), {}, function() {
                const player = this;
            });
        }
        catch ( err ) {}
    }

}

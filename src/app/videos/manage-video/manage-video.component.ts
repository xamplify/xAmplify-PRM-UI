import { Component, OnInit, OnDestroy, Input , AfterViewInit} from '@angular/core';
import { Router} from '@angular/router';
import { SaveVideoFile } from '.././models/save-video-file';
import { Category } from '.././models/category';
import { Pagination } from '../../core/models/pagination';
import { VideoFileService} from '.././services/video-file.service';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ReferenceService } from '../../core/services/reference.service';
import { HomeComponent } from '../../core/home/home.component';
import { Logger } from 'angular2-logger/core';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
declare var swal , require, $: any;

@Component({
  selector: 'app-manage-video',
  templateUrl: './manage-video.component.html',
  styleUrls: ['./manage-video.component.css'],
  providers: [ Pagination, HttpRequestLoader, HomeComponent ]
  })
export class ManageVideoComponent implements OnInit , OnDestroy {
    deviceInfo = null;
    manageVideos = true;
    editVideo = false;
    playVideo = false;
    campaignReport = false;
    videos: Array<SaveVideoFile>;
    cancel = false;
    editDetails: SaveVideoFile;
    selectedVideo: SaveVideoFile;
    dropdownTogglevalue = false;
    categories: Category[];
    filteredCatergories: Array<Category>;
    showUpdatevalue = false;
    showMessage = false;
    imagepath: string;
    pagedItems: any[];
    isvideosLength: boolean;
    selectedVideoFile: SaveVideoFile;
    pageBar: boolean;
    showVideoName: string;
    public totalRecords: number;
    categoryNum: number ;
    public isCategoryUpdated: boolean;
    categoryAnother = 'All Categories';
    public searchKey: string ;
    sortingName: string = null;
    sortcolumn: string = null;
    sortingOrder: string = null;
    isvideoThere: boolean;
    public isCategoryThere: boolean;
    public checkTotalRecords: boolean;
    public allRecords: number;
    public searchDisable = true;
    public deletedVideo = false;
    public deleteVideoName: string;
    public campaignVideo: boolean;
    public campaignVideoMesg: string;
    public locationJson: any;
    httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
    public errorPrepender: 'Error In:';
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
   constructor(private videoFileService: VideoFileService, private referenceService: ReferenceService,
    private authenticationService: AuthenticationService,
        private pagerService: PagerService, private logger: Logger, private pagination: Pagination, private router: Router,
        private homeComponent: HomeComponent) {
        console.log('MangeVideosComponent : constructor ');
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.isvideosLength = false;
        this.pageBar = false;
        this.isvideoThere = false;
        this.categoryNum = 0;
        this.isCategoryThere = false;
        this.searchKey = null;
    }
   truncateHourZeros(length){
    const val = length.split(":");
    if (val.length == 3 && val[0] == "00") {
        length = val[1]+":"+val[2];
    }
    return length;
   }
    ngOnInit() {
        console.log(this.referenceService.videoTitles);
        console.log('MangeVideosComponent ngOnInit()');
        this.logger.log('This is a priority level 5 log message...');
        try {
           if (this.videoFileService.actionValue === 'Save') {
                console.log('MangeVideosComponent : ngonit ');
                this.editVideo = true;
                this.manageVideos = false;
                this.playVideo = false;
                this.campaignReport = false;
                console.log('opening edit video');
                this.showMessage = this.videoFileService.showSave; // true
                this.showUpdatevalue = this.videoFileService.showUpadte; // false
            }
            console.log('manage videos js started');
            if (this.videoFileService.actionValue !== 'Save' || this.videoFileService.actionValue === undefined) {
                this.manageVideos = true;
                this.editVideo = false;
                this.playVideo = false;
                this.campaignReport = false;
                this.showMessage = false;
                this.showUpdatevalue = false;
            }
         this.checkTotalRecords = true;
          this.loadVideos(this.pagination);
          console.log('manage videos ngOnInit completed');
        } catch (error) {
            this.logger.error('erro in ng oninit :' + error);
        }
    }
      loadVideos(pagination: Pagination) {
       this.pagination.maxResults = 12;
       try {
          this.referenceService.loading(this.httpRequestLoader, true);
          this.videoFileService.loadVideoFiles(pagination)
            .subscribe((result: any) => {
                this.videos = result.listOfMobinars;
                this.totalRecords = result.totalRecords;
                pagination.totalRecords = this.totalRecords;
                if (this.checkTotalRecords === true) {
                     this.allRecords = this.totalRecords;
                     this.checkTotalRecords = false;
                 }
                if (this.isCategoryThere === false || this.isCategoryUpdated === true) {
                     this.categories = result.categories;
                     this.categories.sort(function(a: any, b: any) { return (a.id) - (b.id); });
                }
                this.referenceService.loading(this.httpRequestLoader, false);
                console.log(this.categories);
                console.log(this.videos);
                if (this.videos.length !== 0) {
                    this.isvideoThere = false;
                 } else {
                     this.isvideoThere = true;
                     this.pagedItems = null ;
                 }
                if (this.videos.length === 0) {
                     this.isvideosLength = true;
                 } else {
                     this.isvideosLength = false;
                      }
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
     if (page !== this.pagination.pageIndex) {
        this.pagination.pageIndex = page;
        this.loadVideos(this.pagination);
        this.showUpdatevalue = false;
        this.showMessage = false;
     }
    }
    getCategoryNumber() {
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.isvideoThere = false;
        console.log(this.categoryNum);
        this.pagination.filterBy = this.categoryNum;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
    }
    searchDisableValue() {
        console.log(this.searchKey);
        if (this.searchKey !== null || this.searchKey.length !== 0) {
        this.searchDisable = false; }
        if (this.searchKey.length === 0 || this.searchKey === '') {
            this.searchDisable = true; }
    }
    searchVideoTitelName() {
     // if ( this.searchKey !== null && this.searchDisable === false ){
        this.showMessage = false;
        this.showUpdatevalue = false;
        console.log(this.searchKey);
        this.pagination.searchKey = this.searchKey;
        this.pagination.pageIndex = 1;
        this.loadVideos(this.pagination);
     // }
    }
    selectedSortByValue( event: any ) {
        this.showMessage = false;
        this.showUpdatevalue = false;
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
        this.loadVideos(this.pagination);
    }
    showEditVideo(video: SaveVideoFile) {
        console.log('show edit video method in mange videos ' + JSON.stringify(video));
        console.log(video.alias);
        this.deletedVideo = false;
        this.selectedVideoFile = video;
        this.videoFileService.getVideo(video.alias, video.viewBy)
            .subscribe((editVideoFile: SaveVideoFile) => {
                console.log('enter the show edit vidoe method');
                this.editDetails = editVideoFile;
                if (editVideoFile.imageFiles == null) {
                    editVideoFile.imageFiles = []; }
                if ( editVideoFile.gifFiles == null ) {  editVideoFile.gifFiles = []; }
                this.videoFileService.saveVideoFile = this.editDetails;
                console.log('show edit vidoe object :');
                console.log(this.videoFileService.saveVideoFile);
                this.videoFileService.actionValue = 'Update';
                this.editVideo = true;
                this.manageVideos = false;
                this.playVideo = false;
                this.campaignReport = false;
            },
            (error: string) => {
            this.logger.error(this.errorPrepender + 'show edit videos ():' + error);
            this.referenceService.showServerError(this.httpRequestLoader);
            }
         );
    }

    showPlayVideo(video: SaveVideoFile) {
        console.log('MangeVideoComponent playVideo:');
      this.videoFileService.getVideo(video.alias, video.viewBy)
        .subscribe((playVideoFile: SaveVideoFile) => {
        console.log(playVideoFile);
        this.selectedVideo = playVideoFile;
        this.manageVideos = false;
        this.editVideo = false;
        this.playVideo = true;
        this.campaignReport = false;
        this.pageBar = true;
        this.deletedVideo = false;
      },
      (error: string) => {
          this.logger.error(this.errorPrepender + ' show play videos ():' + error);
          this.referenceService.showServerError(this.httpRequestLoader);
       }
      );
    }
    showCampaignVideoReport(video: SaveVideoFile) {
        console.log('ManageVideoComponent campaign report:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
        .subscribe((campaignVideoFile: SaveVideoFile) => {
        console.log(video);
        this.selectedVideo = campaignVideoFile;
        this.campaignReport = true;
        this.manageVideos = false;
        this.editVideo = false;
        this.playVideo = false;
        this.pageBar = true;
        this.deletedVideo = false;
        },
        (error: string) => {
            this.logger.error(this.errorPrepender + ' show campaign videos ():' + error);
            this.referenceService.showServerError(this.httpRequestLoader);
         });
     }
    campaignRouter(video: SaveVideoFile) {
        console.log('ManageVideoComponent campaign router:');
        this.videoFileService.getVideo(video.alias, video.viewBy)
        .subscribe((videoFile: SaveVideoFile) => {
        console.log(video);
        this.referenceService.campaignVideoFile = videoFile;
        console.log(this.referenceService.campaignVideoFile);
        this.router.navigateByUrl('/home/campaigns');
        },
        (error: string) => {
            this.logger.error(this.errorPrepender + ' show campaign videos ():' + error);
            this.referenceService.showServerError(this.httpRequestLoader);
         });
     }

    deleteVideoFile(alias: string, position: number, videoName: string) {
        console.log('MangeVideoComponent deleteVideoFile alias # ' + alias + ', position # ' + position);
        this.videoFileService.deleteVideoFile(alias)
        .subscribe(
        data => {
          console.log(data);
            console.log( 'MangeVideoComponent deleteVideoFile success : ' + data );
            this.pagination.pagedItems.splice(position, 1);
            this.deletedVideo = true;
            this.deleteVideoName = videoName;
            this.loadVideos(this.pagination);
            if (this.pagination.pagedItems.length === 0) {
              this.isvideoThere = true;
              this.pagination.pageIndex  = 1;
              this.loadVideos(this.pagination);
             }
             setTimeout(function() {
                  $('#deleteMesg').slideUp(500);
             }, 5000);
        },
        (error: any) => {
           if (error.search('mobinar is being used in one or more campaigns. Please delete those campaigns') !== -1) {
                   //  swal( 'Campaign Video!', error, 'error' );
                     this.campaignVideoMesg = error;
           } else {
              this.logger.error(this.errorPrepender + ' delete videos ():' + error);
              this.referenceService.showServerError(this.httpRequestLoader);
           }
              console.log(error);
           },
        () => console.log( 'deleted functionality done')
        );
       this.deletedVideo = false;
    }

    deleteAlert(alias: string, position: number, videoName: string) {
        console.log('videoId in sweetAlert()');
        const self = this;
        swal({
            title: 'Are you sure?',
            text: 'You wont be able to revert this!',
            type : 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function(myData: any) {
            console.log('ManageVidoes showAlert then()' + myData);
            self.deleteVideoFile(alias, position , videoName);
        });
    }
    update(videoFile: SaveVideoFile) {
        this.isCategoryUpdated = true;
        this.homeComponent.getVideoTitles();
        if (videoFile != null) {
            this.pagination.pageIndex = 1;
            this.pagination.filterBy = 0;
            this.pagination.sortcolumn = null;
            this.pagination.sortingOrder = null;
            this.searchKey  = null;
            this.loadVideos(this.pagination);
        }
        this.manageVideos = true;
        this.editVideo = false;
        this.campaignReport = false;
        this.playVideo = false;
        // this.videoFileService.actionValue = '';
        this.showMessage = this.videoFileService.showSave; // boolean
        this.showUpdatevalue = this.videoFileService.showUpadte; // boolean
        const timevalue = this;
        setTimeout(function() {
        if ( timevalue.showUpdatevalue === true) {
              $('#showUpdatevalue').slideUp(500);
            } else { $('#message').slideUp(500); };
          }, 5000);

        if ( videoFile == null ) {
            this.showVideoName = '';
         } else { this.showVideoName = videoFile.title ;  }
        console.log('update method called ' + this.showVideoName);
    }
    goToManageVideos() {
        console.log('come to goto manage videos :');
        this.manageVideos = true;
        this.editVideo = false;
        this.campaignReport = false;
        this.playVideo = false;
        this.pageBar = false;
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.deletedVideo  = false;
        this.videoFileService.actionValue = '';
    }
      ngOnDestroy() {
         this.videoFileService.actionValue = '';
         this.isvideoThere = false;
         this.deletedVideo = false;
    }

}

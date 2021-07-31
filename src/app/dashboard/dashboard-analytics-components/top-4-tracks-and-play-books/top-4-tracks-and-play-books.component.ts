import { Component, OnInit,Input } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from 'app/common/models/properties';
import { Pagination } from 'app/core/models/pagination';
import { PagerService } from 'app/core/services/pager.service';
import {TracksPlayBookUtilService} from 'app/tracks-play-book-util/services/tracks-play-book-util.service';
import { TracksPlayBookType } from 'app/tracks-play-book-util/models/tracks-play-book-type.enum'
declare var $:any;
@Component({
  selector: 'app-top-4-tracks-and-play-books',
  templateUrl: './top-4-tracks-and-play-books.component.html',
  styleUrls: ['./top-4-tracks-and-play-books.component.css'],
  providers: [Properties,TracksPlayBookUtilService]
})
export class Top4TracksAndPlayBooksComponent implements OnInit {

  pagination:Pagination = new Pagination();
  headerTitle = "";
  loader = false;
  @Input()isPartnerView = false;
  @Input() tracks = false;
  @Input() hideRowClass = false;
  loggedInUserId:number = 0;
  contents:Array<any> = new Array<any>();

  constructor(public referenceService: ReferenceService,  public tracksPlayBookUtilService:TracksPlayBookUtilService, public authenticationService: AuthenticationService,public xtremandLogger:XtremandLogger,public pagerService:PagerService) {
    this.loggedInUserId = this.authenticationService.getUserId();
    this.pagination.userId = this.loggedInUserId;
    this.pagination.maxResults =4;
   }

  ngOnInit() {
    this.loader = true;
    if(this.tracks){
      this.headerTitle = this.isPartnerView ? 'Shared Tracks':'Tracks';
    }else{
      this.headerTitle = this.isPartnerView ? 'Shared Play Books':'Play Books';
    }
    this.listLearningTracks(this.pagination);
  }

  
  listLearningTracks(pagination: Pagination) {
    this.loader = true;
    if(this.tracks){
      pagination.lmsType = TracksPlayBookType[TracksPlayBookType.TRACK];
    }else{
      pagination.lmsType = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
    }
    /**********Vanity Url Filter**************** */
    if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
      this.pagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
      this.pagination.vanityUrlFilter = true;
    }
    this.tracksPlayBookUtilService.list(pagination, this.isPartnerView).subscribe(
      (response: any) => {
        const data = response.data;
        if (response.statusCode == 200) {
          pagination.totalRecords = data.totalRecords;
          this.contents = data.data;
          $.each(this.contents, function (_index:number, learningTrack:any) {
            learningTrack.createdDateString = new Date(learningTrack.createdTime);
          });
          pagination = this.pagerService.getPagedItems(pagination, this.contents);
        }
        this.loader = false;
      },
      (error: any) => {
        this.loader = false;
      });
  }

  refresh(){
    this.listLearningTracks(this.pagination);
  }

  openSettingsPopup(){
    this.referenceService.showSweetAlertInfoMessage();
  }

  goToAnalytics(track:any){
    let router = "";
    if(this.isPartnerView){
      if(this.tracks){
        router = "/home/tracks/tb/" + track.createdByCompanyId + "/" + track.slug;
      }else{
        router = "/home/playbook/pb/" + track.createdByCompanyId + "/" + track.slug;
      }
    }else{
      if(this.tracks){
        router = "/home/tracks/analytics/" + track.id;
      }else{
        router = "/home/playbook/analytics/" + track.id;
      }
    }
    this.referenceService.goToRouter(router);
  }

  goToManage(){
    let router = "";
    if(this.isPartnerView){
      if(this.tracks){
        router = "home/tracks/shared";
      }else{
        router = "home/playbook/shared";
      }
    }else{
      if(this.tracks){
        router = "home/tracks/manage";
      }else{
        router = "home/playbook/manage";
      }
    }
    this.referenceService.goToRouter(router);
  }

}

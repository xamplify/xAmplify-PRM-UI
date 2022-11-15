import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lms-analytics',
  templateUrl: './lms-analytics.component.html',
  styleUrls: ['./lms-analytics.component.css'],

})
export class LmsAnalyticsComponent implements OnInit {

  type:string = TracksPlayBookType[TracksPlayBookType.TRACK];
  viewType: string;
  categoryId: number;
  folderViewType: string;
  constructor(public referenceService:ReferenceService,private route:ActivatedRoute) { 
    /****XNFR-170****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
   }


  ngOnInit() {
  }

  goToManageTracks(){
    this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

}

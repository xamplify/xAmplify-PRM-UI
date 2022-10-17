import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
@Component({
  selector: 'app-play-book-analytics',
  templateUrl: './play-book-analytics.component.html',
  styleUrls: ['./play-book-analytics.component.css']
})
export class PlayBookAnalyticsComponent implements OnInit {

  type:string = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
  viewType: string;
  categoryId: number;
  folderViewType: string;
  constructor(public referenceService:ReferenceService,public route:ActivatedRoute) {
    /****XNFR-171****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
    }

  ngOnInit() {
  }
  goToManagePlayBooks(){
    this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

}

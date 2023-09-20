import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { Router } from '@angular/router';
import { AddTracksPlayBookComponent } from 'app/tracks-play-book-util/add-tracks-play-book/add-tracks-play-book.component';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-lms',
  templateUrl: './add-lms.component.html',
  styleUrls: ['./add-lms.component.css']
})
export class AddLmsComponent implements OnInit {

  @ViewChild('addTracksPlayBookComponent') addTracksPlayBookComponent: AddTracksPlayBookComponent;
  isAdd: boolean = true;
  type: string = TracksPlayBookType[TracksPlayBookType.TRACK];
  viewType: string;
  categoryId: number;
  folderViewType: string;
  mergeTagForGuide:any;
  constructor(public referenceService: ReferenceService, private router: Router,private route: ActivatedRoute) {
    /****XNFR-170****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
   }

  ngOnInit() {
    if (this.router.url.indexOf('/edit') > -1) {
      this.isAdd = false;
    } else {
      this.isAdd = true;
    }
    this.mergeTagForGuide = 'creating_and_publishing_learning_tracks';
  }
  goToManageTracks(){
    this.referenceService.navigateToManageTracksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  openCreateFolderPopup() {
    this.addTracksPlayBookComponent.openCreateFolderPopup();
  }

}
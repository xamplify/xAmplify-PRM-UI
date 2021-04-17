import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { Router } from '@angular/router';
import { AddTracksPlayBookComponent } from 'app/tracks-play-book-util/add-tracks-play-book/add-tracks-play-book.component';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'

@Component({
  selector: 'app-add-lms',
  templateUrl: './add-lms.component.html',
  styleUrls: ['./add-lms.component.css']
})
export class AddLmsComponent implements OnInit {

  @ViewChild('addTracksPlayBookComponent') addTracksPlayBookComponent: AddTracksPlayBookComponent;
  isAdd: boolean = true;
  type: string = TracksPlayBookType[TracksPlayBookType.TRACK];

  constructor(public referenceService: ReferenceService, private router: Router) { }

  ngOnInit() {
    if (this.router.url.indexOf('/edit') > -1) {
      this.isAdd = false;
    } else {
      this.isAdd = true;
    }
  }

  openCreateFolderPopup() {
    this.addTracksPlayBookComponent.openCreateFolderPopup();
  }

}
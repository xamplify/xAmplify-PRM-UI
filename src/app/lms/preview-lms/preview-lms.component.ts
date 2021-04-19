import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'

@Component({
  selector: 'app-preview-lms',
  templateUrl: './preview-lms.component.html',
  styleUrls: ['./preview-lms.component.css']
})
export class PreviewLmsComponent implements OnInit {

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  showTracksPlayBook: boolean = true;
  showAsset: boolean = false;
  isCreatedUser: boolean = false;
  type:string = TracksPlayBookType[TracksPlayBookType.TRACK];

  constructor(public referenceService: ReferenceService) {
  }

  ngOnInit() {
  }

  changeShowTracksPlayBook(showTracksPlayBook: any){
    this.showTracksPlayBook = showTracksPlayBook;
  }

  changeShowAsset(showAsset: any){
    this.showAsset = showAsset;
  }

  changeIsCreatedUser(isCreatedUser: any){
    this.isCreatedUser = isCreatedUser;
  }
}

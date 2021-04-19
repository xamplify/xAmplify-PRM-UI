import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'

@Component({
  selector: 'app-lms-analytics',
  templateUrl: './lms-analytics.component.html',
  styleUrls: ['./lms-analytics.component.css'],

})
export class LmsAnalyticsComponent implements OnInit {

  type:string = TracksPlayBookType[TracksPlayBookType.TRACK];

  constructor(public referenceService:ReferenceService) {  }


  ngOnInit() {
  }

}

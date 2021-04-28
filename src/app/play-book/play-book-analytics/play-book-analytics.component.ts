import { Component, OnInit } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'

@Component({
  selector: 'app-play-book-analytics',
  templateUrl: './play-book-analytics.component.html',
  styleUrls: ['./play-book-analytics.component.css']
})
export class PlayBookAnalyticsComponent implements OnInit {

  type:string = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];

  constructor(public referenceService:ReferenceService) {  }

  ngOnInit() {
  }

}

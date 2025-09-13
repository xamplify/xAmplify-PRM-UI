import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'

@Component({
  selector: 'app-manage-lms',
  templateUrl: './manage-lms.component.html',
  styleUrls: ['./manage-lms.component.css']
})
export class ManageLmsComponent implements OnInit {

  isPartnerView: boolean = false;
  type:string = TracksPlayBookType[TracksPlayBookType.TRACK];
  mergeTagForGuide:any;
  constructor(public referenceService: ReferenceService, private router: Router) {
    if (this.router.url.indexOf('/manage') > -1) {
      this.isPartnerView = false;
    } else {
      this.isPartnerView = true;
    }
  }

  ngOnInit() {
    if(!this.isPartnerView || this.router.url.indexOf('/manage') > -1) {
      this.mergeTagForGuide = "manage_tracks";
    } else {
      this.mergeTagForGuide = "access_shared_tracks";
    }   
  }

}

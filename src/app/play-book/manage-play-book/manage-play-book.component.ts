import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenceService } from '../../core/services/reference.service';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
 
@Component({
  selector: 'app-manage-play-book',
  templateUrl: './manage-play-book.component.html',
  styleUrls: ['./manage-play-book.component.css']
})
export class ManagePlayBookComponent implements OnInit {

  isPartnerView: boolean = false;
  type:string = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
  mergeTagForGuide:any;
  constructor(public referenceService:ReferenceService, private router: Router ) { 
    if (this.router.url.indexOf('/manage') > -1) {
      this.isPartnerView = false;
    } else {
      this.isPartnerView = true;
    }
  }

  ngOnInit() {
    if(!this.isPartnerView) {
      this.mergeTagForGuide = "manage_playbooks";
    } else {
      this.mergeTagForGuide = "access_shared_playbooks";
    }
  }
  
}

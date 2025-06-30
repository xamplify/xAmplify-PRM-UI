import { Component, OnInit, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AddTracksPlayBookComponent } from 'app/tracks-play-book-util/add-tracks-play-book/add-tracks-play-book.component';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum'
import { RouterUrlConstants } from 'app/constants/router-url.contstants';

@Component({
  selector: 'app-add-play-book',
  templateUrl: './add-play-book.component.html',
  styleUrls: ['./add-play-book.component.css']
})
export class AddPlayBookComponent implements OnInit {

  @ViewChild('addTracksPlayBookComponent') addTracksPlayBookComponent: AddTracksPlayBookComponent;
  isAdd: boolean = true;
  fromManage: boolean = false;
  type: string = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
  viewType: string;
  categoryId: number;
  folderViewType: string;
  mergeTagForGuide:any;
  isFromApprovalModule: boolean = false;
  constructor(public referenceService: ReferenceService, private router: Router,public route:ActivatedRoute) {
    /****XNFR-171****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
   }

  ngOnInit() {
    this.isFromApprovalModule = this.router.url.indexOf(RouterUrlConstants.approval) > -1;
    this.fromManage = this.route.snapshot.queryParamMap.get('from') === 'manage';
    if (this.router.url.indexOf('/edit') > -1) {
      this.isAdd = false;
    } else {
      this.isAdd = true;
    }
    this.mergeTagForGuide = 'creating_and_publishing_play_books';
  }

  goToManagePlayBooks(){
    this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  openCreateFolderPopup() {
    this.addTracksPlayBookComponent.openCreateFolderPopup();
  }

}

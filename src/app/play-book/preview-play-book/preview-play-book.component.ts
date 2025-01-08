import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { TracksPlayBookType } from '../../tracks-play-book-util/models/tracks-play-book-type.enum';
import { ActivatedRoute,Router } from '@angular/router';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
@Component({
  selector: 'app-preview-play-book',
  templateUrl: './preview-play-book.component.html',
  styleUrls: ['./preview-play-book.component.css']
})
export class PreviewPlayBookComponent implements OnInit {

  httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
  showTracksPlayBook: boolean = true;
  showAsset: boolean = false;
  isCreatedUser: boolean = false;
  type:string = TracksPlayBookType[TracksPlayBookType.PLAYBOOK];
  viewType: string;
  categoryId: number;
  folderViewType: string;
  isFromApprovalModule: boolean = false;
  constructor(public referenceService: ReferenceService,public route:ActivatedRoute,private router : Router) {
    /****XNFR-171****/
    this.viewType = this.route.snapshot.params["viewType"];
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.folderViewType = this.route.snapshot.params["folderViewType"];
  }

  ngOnInit() {
    this.isFromApprovalModule = this.router.url.indexOf(RouterUrlConstants.approval) > -1;
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

  goToManagePlayBooks(){
    this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,false);
  }

  goToManageSharedPlayBooks(){
    this.referenceService.navigateToPlayBooksByViewType(this.folderViewType,this.viewType,this.categoryId,true);
  }
  
}

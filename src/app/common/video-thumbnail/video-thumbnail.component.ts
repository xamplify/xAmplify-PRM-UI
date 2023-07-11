import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-thumbnail',
  templateUrl: './video-thumbnail.component.html',
  styleUrls: ['./video-thumbnail.component.css']
})
export class VideoThumbnailComponent implements OnInit {
  @Input() videoFile: SaveVideoFile;
  @Input() published: boolean ;
  @Input() processing:boolean;
  @Input() damId : number;
  @Output() notifyParent: EventEmitter<any>;
  @Input() categoryName:string;
  @Input() asset:any;
  @Input() assetStatus:any;
   isCreate: boolean;
  constructor(public videoUtilService:VideoUtilService, public videoFileService:VideoFileService,public authenticationService:AuthenticationService, public router:Router) {
    this.notifyParent = new EventEmitter<any>();
    this.isCreate = (this.router.url.includes('/home/campaigns/create') || this.router.url.includes('/home/campaigns/edit')) ? true: false;
  }

  showPlayVideo(videoFile){
     if(!this.authenticationService.isSuperAdmin() && videoFile.processed && !this.isCreate){
     this.router.navigate(["/home/dam/previewVideo/"+videoFile.id+"/"+this.damId]);
     }else if(this.isCreate){
      this.notifyParent.emit(videoFile);
     }
  }

  titleClickVideo(videoFile){
    if(!this.authenticationService.isSuperAdmin() && videoFile.processed && !this.isCreate){
      this.router.navigate(["/home/dam/previewVideo/"+videoFile.id+"/"+this.damId]);
     }else if(this.isCreate){
      this.notifyParent.emit(videoFile);
     }
  }
  // mouseEnter(event){ event.target.src = this.videoFile.gifImagePath;}
  // mouseLeave(event){ event.target.src = this.videoFile.imagePath;}
  mouseEnterVideo(videoFile){
    if(videoFile.processed){
    (<HTMLInputElement>document.getElementById('imagePath'+this.videoFile.id)).src =  this.videoFile.gifImagePath; }
  }
  mouseLeaveVideo(videoFile){
    if(videoFile.processed){
    (<HTMLInputElement>document.getElementById('imagePath'+this.videoFile.id)).src =  this.videoFile.imagePath;}
  }
  ngOnInit() {
  }

}

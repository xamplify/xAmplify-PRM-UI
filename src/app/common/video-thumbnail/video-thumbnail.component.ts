import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SaveVideoFile } from '../../videos/models/save-video-file';

@Component({
  selector: 'app-video-thumbnail',
  templateUrl: './video-thumbnail.component.html',
  styleUrls: ['./video-thumbnail.component.css']
})
export class VideoThumbnailComponent implements OnInit {
  @Input() videoFile: SaveVideoFile;
  @Output() notifyParent: EventEmitter<any>;
  isProcessing= true;
  constructor(public videoUtilService:VideoUtilService, public videoFileService:VideoFileService,public authenticationService:AuthenticationService) {
    this.notifyParent = new EventEmitter<any>();
    this.isProcessing = true;
  }

  showPlayVideo(videoFile){
     if(!this.authenticationService.isSuperAdmin() && this.isProcessing){
      this.notifyParent.emit(videoFile);
     }
  }
  mouseEnter(event){ event.target.src = this.videoFile.gifImagePath;}
  mouseLeave(event){ event.target.src = this.videoFile.imagePath;}
  mouseEnterVideo(){
    (<HTMLInputElement>document.getElementById('imagePath'+this.videoFile.id)).src =  this.videoFile.gifImagePath;
  }
  mouseLeaveVideo(){
    (<HTMLInputElement>document.getElementById('imagePath'+this.videoFile.id)).src =  this.videoFile.imagePath;
  }
  ngOnInit() {}

}

import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { VideoUtilService } from '../../videos/services/video-util.service';
import { VideoFileService } from '../../videos/services/video-file.service';
declare var $: any;

@Component({
  selector: 'app-embed-modal',
  templateUrl: './embed-modal.component.html',
  styleUrls: ['./embed-modal.component.css']
})
export class EmbedModalComponent implements OnInit, OnDestroy {
  @Input() video: any;
  @Output() notifyParent: EventEmitter<any>;
  clipboardName: string;
  embedSrcPath: string;
  embedWidth = '640';
  embedHeight = '360';
  videoSizes = ['1280 × 720', '853 × 480', '640 × 360', '560 × 315'];
  videosize = '640 × 360';
  embedFullScreen = 'allowfullscreen';
  isFullscreen: boolean;
  embedVideoSrcPath:string;

  constructor(public videoUtilService: VideoUtilService, public videoFileService: VideoFileService,
    public authenticationService: AuthenticationService) {
    this.clipboardName = 'Copy to ClipBoard';
    this.isFullscreen = true;
    this.notifyParent = new EventEmitter();
  }
  embedCode() {
    this.clipboardName = 'Copied !';
    (<HTMLInputElement>document.getElementById('embed_code')).select();
    document.execCommand('copy');
  }
  embedFulScreenValue() {
    this.embedFullScreen = this.isFullscreen ? 'allowfullscreen' : '';
  }
  embedVideoSizes() {
    if (this.videosize === this.videoSizes[0]) {
      this.setEmbedwidthHeight('1280', '720');
    } else if (this.videosize === this.videoSizes[1]) {
      this.setEmbedwidthHeight('853', '480');
    } else if (this.videosize === this.videoSizes[2]) {
      this.setEmbedwidthHeight('640', '360');
    } else { this.setEmbedwidthHeight('560', '315'); }
  }
  setEmbedwidthHeight(width: string, height: string) {
    this.embedWidth = width;
    this.embedHeight = height;
  }
  closeEmbedModal() {
    this.clipboardName = 'Copy to Clipboard';
    this.closeEmbed();
    this.notifyParent.emit("successfully closed model");
  }
  closeEmbed() {
    $('#myModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop fade in').remove();
  }
  shareMetaTags(shareShortUrl: string) {
    this.videoFileService.shareMetaTags(shareShortUrl).subscribe((result: any) => { },
      (error: any) => { console.log(error); });
  }
  shareClick(video:any, type:string) {
    this.videoFileService.getShortnerUrlAlias(video.viewBy, video.alias)
      .subscribe((result: any) => {        
        if(this.authenticationService.vanityURLEnabled && this.authenticationService.vanityURLink){
          this.embedSrcPath = this.authenticationService.vanityURLink + 'embed/' + result.alias;
          this.embedVideoSrcPath = this.authenticationService.vanityURLink + 'embed/' + result.alias;
        }else
        {
          this.embedSrcPath = this.authenticationService.SERVER_URL + 'embed/' + result.alias;
          this.embedVideoSrcPath = this.authenticationService.APP_URL + 'embed/' + result.alias;
        }
        this.shareMetaTags(this.embedSrcPath);
        if(type ==='modal'){
        if (this.embedSrcPath) { $('#myModal').show();} }
        else {
          this.videoUtilService.modalWindowPopUp(this.embedSrcPath, 670, 500);
        }
      });
  }
  ngOnInit() {
    this.shareClick(this.video, 'modal');
  }
  ngOnDestroy() {
    this.closeEmbed();
  }

}

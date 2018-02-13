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
  ClipboardName: string;
  embedSrcPath: string;
  embedWidth = '640';
  embedHeight = '360';
  videoSizes: string[];
  videosize = '640 × 360';
  embedFullScreen = 'allowfullscreen';
  isFullscreen: boolean;

  constructor(public videoUtilService: VideoUtilService, public videoFileService: VideoFileService,
    public authenticationService: AuthenticationService) {
    this.ClipboardName = 'Copy to ClipBoard';
    this.videoSizes = this.videoUtilService.videoSizes;
    this.isFullscreen = true;
    this.notifyParent = new EventEmitter();
  }
  embedCode() {
    this.ClipboardName = 'Copied !';
    (<HTMLInputElement>document.getElementById('embed_code')).select();
    document.execCommand('copy');
  }
  embedFulScreenValue() {
     this.embedFullScreen = this.isFullscreen ? 'allowfullscreen' : '';
  }
  embedVideoSizes() {
    if (this.videosize === this.videoSizes[0]) {
      this.embedWidth = '1280'; this.embedHeight = '720';
    } else if (this.videosize === this.videoSizes[1]) {
      this.embedWidth = '853'; this.embedHeight = '480';
    } else if (this.videosize === this.videoSizes[2]) {
      this.embedWidth = '640'; this.embedHeight = '360';
    } else { this.embedWidth = '560'; this.embedHeight = '315'; }
   }
  closeEmbedModal() {
    this.ClipboardName = 'Copy to Clipboard';
    this.closeEmbed();
    this.notifyParent.emit("successfully closed model");
  }
  closeEmbed(){
    $('#myModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop fade in').remove();
  }
  shareMetaTags(shareShortUrl: string) {
    this.videoFileService.shareMetaTags(shareShortUrl).subscribe((result: any) => { },
      (error: any) => { console.log(error); });
  }
  embedModal() {
    this.videoFileService.getShortnerUrlAlias(this.video.viewBy, this.video.alias)
      .subscribe((result: any) => {
        this.embedSrcPath = this.authenticationService.SERVER_URL + 'embed/' + result.alias;
        this.shareMetaTags(this.embedSrcPath);
        if (this.embedSrcPath) {
          $('#myModal').show();
        }
      });
  }
  ngOnInit() {
    this.embedModal();
  }
  ngOnDestroy(){
    this.closeEmbed();
  }

}

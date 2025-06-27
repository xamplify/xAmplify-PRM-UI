import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;
// export interface MediaLayoutItem {
//   media: MediaItem;
//   colClass: string;
//   height: string;
// }
// export interface MediaItem {
//   filePath: string;
//   fileType: 'image' | 'video';
//   width?: number;
//   height?: number;
//   loaded?: boolean;
//   aspectRatio?: number;
// }

// export interface MediaLayout {
//   type: 'single' | 'double' | 'triple' | 'quad';
//   rows: MediaRow[];
// }

// export interface MediaRow {
//   items: MediaLayoutItem[];
//   height: string;
// }

// export interface MediaLayoutItem {
//   media: MediaItem;
//   colClass: string;
//   height: string;
// }
@Component({
  selector: 'app-feed-preview-modal',
  templateUrl: './feed-preview-modal.component.html',
  styleUrls: ['./feed-preview-modal.component.css']
})
export class FeedPreviewModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Output() closed = new EventEmitter();

  mediaItems: any[] = [];
  layout:'single' | 'double' | 'triple' | 'quad' | null = null;
  layoutReady = false;
  formattedText: string = '';
  constructor(public authenticationService: AuthenticationService,
    public videoUtilService: VideoUtilService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    $('#feedPreviewModal').modal('show');
    $('#feedPreviewModal').on('hidden.bs.modal', () => {
      this.closed.emit();
    });
    this.loadMedia();
    if (this.feed.statusMessage) {
      this.formattedText = this.feed.statusMessage.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br>');
    }
  }

  ngOnDestroy() {
    $('#feedPreviewModal').modal('hide');
    $('#feedPreviewModal').off('hidden.bs.modal');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  loadMedia(): void {
    if (!this.feed.socialStatusContents.length) return;

    this.mediaItems = this.feed.socialStatusContents.map(item => ({
      filePath: item.filePath,
      fileType: item.fileType,
      width: 0,
      height: 0,
      loaded: false,
      aspectRatio: 1
    }));

    let loadedCount = 0;
    const totalCount = this.mediaItems.length;

    this.mediaItems.forEach((mediaItem, index) => {
      if (mediaItem.fileType === 'video') {
        this.handleVideoLoad(index, ++loadedCount, totalCount);
      } else {
        const img = new Image();
        img.onload = () => this.handleImageLoad(index, img.naturalWidth, img.naturalHeight, ++loadedCount, totalCount);
        img.onerror = () => this.handleImageLoad(index, 400, 300, ++loadedCount, totalCount);
        img.src = this.getMediaSource(mediaItem);
      }
    });
  }

  handleImageLoad(index: number, width: number, height: number, loadedCount: number, totalCount: number): void {
    this.mediaItems[index].width = width;
    this.mediaItems[index].height = height;
    this.mediaItems[index].aspectRatio = width / height;
    this.mediaItems[index].loaded = true;

    if (loadedCount === totalCount) {
      this.calculateLayout();
    }
  }

  handleVideoLoad(index: number, loadedCount: number, totalCount: number): void {
    this.mediaItems[index].width = 640;
    this.mediaItems[index].height = 360;
    this.mediaItems[index].aspectRatio = 16 / 9;
    this.mediaItems[index].loaded = true;
    if (loadedCount === totalCount) {
      this.calculateLayout();
    }
  }

  calculateLayout(): void {
    const count = this.mediaItems.length;
    switch (count) {
      case 1:
        this.layout = this.createSingleLayout();
        break;
      case 2:
        this.layout = this.createDoubleLayout();
        break;
      case 3:
        this.layout = this.createTripleLayout();
        break;
      case 4:
        this.layout = this.createQuadLayout();
        break;
      default:
        this.layout = null;
    }
    this.layoutReady = true;
  }

   createSingleLayout(): any {
    const media = this.mediaItems[0];
    const height = media.aspectRatio > 1.5 ? '300px' : '400px';
    return {
      type: 'single',
      rows: [{
        items: [{
          media: media,
          colClass: 'col-xs-12',
          height: height
        }],
        height: height
      }]
    };
  }

  createDoubleLayout(): any {
    const [media1, media2] = this.mediaItems;
    const hasVideo = media1.fileType === 'video' || media2.fileType === 'video';
    if (hasVideo) {
      return {
        type: 'double',
        rows: [{
          items: [
            { media: media1, colClass: 'col-xs-6', height: '250px' },
            { media: media2, colClass: 'col-xs-6', height: '250px' }
          ],
          height: '250px'
        }]
      };
    }
    const ratio1 = media1.aspectRatio;
    const ratio2 = media2.aspectRatio;
    const isLandscape1 = ratio1 > 1.2;
    const isPortrait1 = ratio1 < 0.8;
    const isLandscape2 = ratio2 > 1.2;
    const isPortrait2 = ratio2 < 0.8;
    if ((isLandscape1 && isPortrait2) || (isPortrait1 && isLandscape2)) {
      const widerMedia = ratio1 > ratio2 ? media1 : media2;
      const tallerMedia = ratio1 > ratio2 ? media2 : media1;

      return {
        type: 'double',
        rows: [{
          items: [
            { media: widerMedia, colClass: 'col-xs-9', height: '200px' },
            { media: tallerMedia, colClass: 'col-xs-3', height: '200px' }
          ],
          height: '200px'
        }]
      };
    }
    return {
      type: 'double',
      rows: [{
        items: [
          { media: media1, colClass: 'col-xs-6', height: '200px' },
          { media: media2, colClass: 'col-xs-6', height: '200px' }
        ],
        height: '200px'
      }]
    };
  }

  private createTripleLayout(): any {
    const sortedByWidth = [...this.mediaItems].sort((a, b) => b.aspectRatio - a.aspectRatio);
    const widestMedia = sortedByWidth[0];
    const remainingMedia = this.mediaItems.filter(m => m !== widestMedia);
    if (widestMedia.aspectRatio > 2.0) {
      return {
        type: 'triple',
        rows: [
          {
            items: [{ media: widestMedia, colClass: 'col-xs-12', height: '200px' }],
            height: '200px'
          },
          {
            items: [
              { media: remainingMedia[0], colClass: 'col-xs-6', height: '150px' },
              { media: remainingMedia[1], colClass: 'col-xs-6', height: '150px' }
            ],
            height: '150px'
          }
        ]
      };
    }
    const tallestMedia = [...this.mediaItems].sort((a, b) => a.aspectRatio - b.aspectRatio)[0];
    if (tallestMedia.aspectRatio < 0.7) {
      const otherMedia = this.mediaItems.filter(m => m !== tallestMedia);

      return {
        type: 'triple',
        rows: [{
          items: [
            { media: tallestMedia, colClass: 'col-xs-6', height: '300px' },
            {
              media: { ...otherMedia[0], isStacked: true } as any,
              colClass: 'col-xs-6 stacked-container',
              height: '300px'
            }
          ],
          height: '300px'
        }]
      };
    }
    return {
      type: 'triple',
      rows: [
        {
          items: [{ media: this.mediaItems[0], colClass: 'col-xs-12', height: '200px' }],
          height: '200px'
        },
        {
          items: [
            { media: this.mediaItems[1], colClass: 'col-xs-6', height: '150px' },
            { media: this.mediaItems[2], colClass: 'col-xs-6', height: '150px' }
          ],
          height: '150px'
        }
      ]
    };
  }

  private createQuadLayout(): any {
    const sortedByWidth = [...this.mediaItems].sort((a, b) => b.aspectRatio - a.aspectRatio);
    const widestMedia = sortedByWidth[0];
    const remainingMedia = this.mediaItems.filter(m => m !== widestMedia);
    if (widestMedia.aspectRatio > 2.2) {
      return {
        type: 'quad',
        rows: [
          {
            items: [{ media: widestMedia, colClass: 'col-xs-12', height: '180px' }],
            height: '180px'
          },
          {
            items: [
              { media: remainingMedia[0], colClass: 'col-xs-4', height: '120px' },
              { media: remainingMedia[1], colClass: 'col-xs-4', height: '120px' },
              { media: remainingMedia[2], colClass: 'col-xs-4', height: '120px' }
            ],
            height: '120px'
          }
        ]
      };
    }
    const tallestMedia = [...this.mediaItems].sort((a, b) => a.aspectRatio - b.aspectRatio)[0];
    if (tallestMedia.aspectRatio < 0.6) {
      const otherMedia = this.mediaItems.filter(m => m !== tallestMedia);

      return {
        type: 'quad',
        rows: [{
          items: [
            { media: tallestMedia, colClass: 'col-xs-6', height: '300px' },
            {
              media: { ...otherMedia[0], isStacked: true, stackedMedia: otherMedia } as any,
              colClass: 'col-xs-6 stacked-container',
              height: '300px'
            }
          ],
          height: '300px'
        }]
      };
    }
    return {
      type: 'quad',
      rows: [
        {
          items: [
            { media: this.mediaItems[0], colClass: 'col-xs-6', height: '150px' },
            { media: this.mediaItems[1], colClass: 'col-xs-6', height: '150px' }
          ],
          height: '150px'
        },
        {
          items: [
            { media: this.mediaItems[2], colClass: 'col-xs-6', height: '150px' },
            { media: this.mediaItems[3], colClass: 'col-xs-6', height: '150px' }
          ],
          height: '150px'
        }
      ]
    };
  }

  getMediaSource(item: any): string {
    return item.fileType === 'video'
      ? item.filePath
      : `${this.authenticationService.MEDIA_URL}${item.filePath}`;
  }

  isVideo(item: any): boolean {
    return item.fileType === 'video';
  }

  getStackedHeight(stackCount: number): string {
    const baseHeight = 300;
    const gapHeight = (stackCount - 1) * 2;
    const itemHeight = (baseHeight - gapHeight) / stackCount;
    return `${itemHeight}px`;
  }
}

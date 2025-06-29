import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-feed-preview-modal',
  templateUrl: './feed-preview-modal.component.html',
  styleUrls: ['./feed-preview-modal.component.css']
})
export class FeedPreviewModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Output() closed = new EventEmitter();

  mediaItems: any[] = [];
  layout: any | null = null;
  layoutReady = false;
  formattedText: string = '';
  containerWidth = 630; // Standard container width
  maxContainerHeight = 600; // Maximum height for the layout

  constructor(
    public authenticationService: AuthenticationService,
    public videoUtilService: VideoUtilService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    $('#feedPreviewModal').modal('show');
    $('#feedPreviewModal').on('hidden.bs.modal', () => {
      this.closed.emit();
    });
    this.loadMedia();
    if (this.feed.statusMessage) {
      this.formattedText = this.feed.statusMessage.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
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
      aspectRatio: 1,
      isLandscape: false,
      isPortrait: false,
      isSquare: false,
      naturalWidth: 0,
      naturalHeight: 0
    }));

    let loadedCount = 0;
    const totalCount = this.mediaItems.length;

    this.mediaItems.forEach((mediaItem, index) => {
      if (mediaItem.fileType === 'video') {
        this.handleVideoLoad(index, ++loadedCount, totalCount);
      } else {
        const img = new Image();
        img.onload = () => {
          this.handleImageLoad(index, img.naturalWidth, img.naturalHeight, ++loadedCount, totalCount);
        };
        img.onerror = () => {
          this.handleImageLoad(index, 800, 600, ++loadedCount, totalCount);
        };
        img.src = this.getMediaSource(mediaItem);
      }
    });
  }

  handleImageLoad(index: number, naturalWidth: number, naturalHeight: number, loadedCount: number, totalCount: number): void {
    const aspectRatio = naturalWidth / naturalHeight;

    this.mediaItems[index].naturalWidth = naturalWidth;
    this.mediaItems[index].naturalHeight = naturalHeight;
    this.mediaItems[index].width = naturalWidth;
    this.mediaItems[index].height = naturalHeight;
    this.mediaItems[index].aspectRatio = aspectRatio;
    this.mediaItems[index].isLandscape = aspectRatio > 1.2;
    this.mediaItems[index].isPortrait = aspectRatio < 0.8;
    this.mediaItems[index].isSquare = aspectRatio >= 0.8 && aspectRatio <= 1.2;
    this.mediaItems[index].loaded = true;

    if (loadedCount === totalCount) {
      this.calculateOptimalLayout();
    }
  }

  handleVideoLoad(index: number, loadedCount: number, totalCount: number): void {
    this.mediaItems[index].naturalWidth = 1920;
    this.mediaItems[index].naturalHeight = 1080;
    this.mediaItems[index].width = 1920;
    this.mediaItems[index].height = 1080;
    this.mediaItems[index].aspectRatio = 16 / 9;
    this.mediaItems[index].isLandscape = true;
    this.mediaItems[index].isPortrait = false;
    this.mediaItems[index].isSquare = false;
    this.mediaItems[index].loaded = true;

    if (loadedCount === totalCount) {
      this.calculateOptimalLayout();
    }
  }

  calculateOptimalLayout(): void {
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
        this.layout = this.createGridLayout(count);
    }

    this.layoutReady = true;
  }

  createSingleLayout(): any {
    const media = this.mediaItems[0];
    const optimalHeight = this.calculateOptimalHeight(media, this.containerWidth);
    const finalHeight = Math.min(optimalHeight, this.maxContainerHeight);

    return {
      type: 'single',
      containerHeight: `${finalHeight}px`,
      rows: [{
        items: [{
          media: media,
          colClass: 'col-xs-12',
          height: `${finalHeight}px`,
          objectFit: this.getObjectFit(media, this.containerWidth, finalHeight)
        }],
        height: `${finalHeight}px`
      }]
    };
  }

  createDoubleLayout(): any {
    const [media1, media2] = this.mediaItems;
    const hasVideo = media1.fileType === 'video' || media2.fileType === 'video';
    const aspectRatioSimilar = Math.abs(media1.aspectRatio - media2.aspectRatio) < 0.3;
    const bothLandscape = media1.isLandscape && media2.isLandscape;

    if (bothLandscape && aspectRatioSimilar && !hasVideo) {
      const itemHeight = 200;
      return {
        type: 'double',
        containerHeight: '410px',
        rows: [
          {
            items: [{
              media: media1,
              colClass: 'col-xs-12',
              height: `${itemHeight}px`,
              objectFit: 'cover'
            }],
            height: `${itemHeight}px`
          },
          {
            items: [{
              media: media2,
              colClass: 'col-xs-12',
              height: `${itemHeight}px`,
              objectFit: 'cover'
            }],
            height: `${itemHeight}px`
          }
        ]
      };
    } else {
      // Side by side layout
      const itemWidth = this.containerWidth / 2 - 5;
      const itemHeight = hasVideo ? 280 : this.calculateOptimalHeight(media1, itemWidth, media2);

      return {
        type: 'double',
        containerHeight: `${itemHeight}px`,
        rows: [{
          items: [
            {
              media: media1,
              colClass: 'col-xs-6',
              height: `${itemHeight}px`,
              objectFit: 'cover'
            },
            {
              media: media2,
              colClass: 'col-xs-6',
              height: `${itemHeight}px`,
              objectFit: 'cover'
            }
          ],
          height: `${itemHeight}px`
        }]
      };
    }
  }

  createTripleLayout(): any {
    const hasVideo = this.mediaItems.some(item => item.fileType === 'video');

    if (hasVideo) {
      // Equal grid for videos
      const itemHeight = 210;
      return {
        type: 'triple',
        containerHeight: `${itemHeight}px`,
        rows: [{
          items: this.mediaItems.map(media => ({
            media: media,
            colClass: 'col-xs-4',
            height: `${itemHeight}px`,
            objectFit: 'cover'
          })),
          height: `${itemHeight}px`
        }]
      };
    }

    const landscapeCount = this.mediaItems.filter(item => item.isLandscape).length;

    if (landscapeCount >= 2) {
      const mainImage = this.getBestMainImage();
      const otherImages = this.mediaItems.filter(item => item !== mainImage);
      const mainHeight = 320;
      const bottomHeight = 210;

      return {
        type: 'triple',
        containerHeight: `${mainHeight + bottomHeight + 5}px`,
        rows: [
          {
            items: [{
              media: mainImage,
              colClass: 'col-xs-12',
              height: `${mainHeight}px`,
              objectFit: 'cover'
            }],
            height: `${mainHeight}px`
          },
          {
            items: [
              {
                media: otherImages[0],
                colClass: 'col-xs-6',
                height: `${bottomHeight}px`,
                objectFit: 'cover'
              },
              {
                media: otherImages[1],
                colClass: 'col-xs-6',
                height: `${bottomHeight}px`,
                objectFit: 'cover'
              }
            ],
            height: `${bottomHeight}px`
          }
        ]
      };
    } else {
      // Main image with stacked side images
      const mainImage = this.getBestMainImage();
      const sideImages = this.mediaItems.filter(item => item !== mainImage);
      const layoutHeight = 320;

      return {
        type: 'triple',
        containerHeight: `${layoutHeight}px`,
        rows: [{
          items: [
            {
              media: mainImage,
              colClass: 'col-xs-8',
              height: `${layoutHeight}px`,
              objectFit: 'cover'
            },
            {
              media: {
                ...sideImages[0],
                isStacked: true,
                stackedMedia: sideImages
              } as any,
              colClass: 'col-xs-4 stacked-container',
              height: `${layoutHeight}px`,
              objectFit: 'cover'
            }
          ],
          height: `${layoutHeight}px`
        }]
      };
    }
  }

  createQuadLayout(): any {
    const hasVideo = this.mediaItems.some(item => item.fileType === 'video');
    const landscapeCount = this.mediaItems.filter(item => item.isLandscape).length;
    if (hasVideo || landscapeCount < 3) {
      const itemHeight = 170;
      return {
        type: 'quad',
        containerHeight: `${itemHeight * 2 + 5}px`,
        rows: [
          {
            items: [
              {
                media: this.mediaItems[0],
                colClass: 'col-xs-6',
                height: `${itemHeight}px`,
                objectFit: 'cover'
              },
              {
                media: this.mediaItems[1],
                colClass: 'col-xs-6',
                height: `${itemHeight}px`,
                objectFit: 'cover'
              }
            ],
            height: `${itemHeight}px`
          },
          {
            items: [
              {
                media: this.mediaItems[2],
                colClass: 'col-xs-6',
                height: `${itemHeight}px`,
                objectFit: 'cover'
              },
              {
                media: this.mediaItems[3],
                colClass: 'col-xs-6',
                height: `${itemHeight}px`,
                objectFit: 'cover'
              }
            ],
            height: `${itemHeight}px`
          }
        ]
      };
    } else {
      const mainImage = this.getBestMainImage();
      const otherImages = this.mediaItems.filter(item => item !== mainImage);
      const mainHeight = 300;
      const bottomHeight = 130;
      return {
        type: 'quad',
        containerHeight: `${mainHeight + bottomHeight + 5}px`,
        rows: [
          {
            items: [{
              media: mainImage,
              colClass: 'col-xs-12',
              height: `${mainHeight}px`,
              objectFit: 'cover'
            }],
            height: `${mainHeight}px`
          },
          {
            items: otherImages.map(media => ({
              media: media,
              colClass: 'col-xs-4',
              height: `${bottomHeight}px`,
              objectFit: 'cover'
            })),
            height: `${bottomHeight}px`
          }
        ]
      };
    }
  }

  createGridLayout(count: number): any {
    const itemsPerRow = Math.ceil(Math.sqrt(count));
    const itemHeight = 150;
    const rows: any[] = [];
    for (let i = 0; i < count; i += itemsPerRow) {
      const rowItems = this.mediaItems.slice(i, i + itemsPerRow);
      const colClass = `col-xs-${12 / rowItems.length}`;
      rows.push({
        items: rowItems.map(media => ({
          media: media,
          colClass: colClass,
          height: `${itemHeight}px`,
          objectFit: 'cover'
        })),
        height: `${itemHeight}px`
      });
    }

    return {
      type: 'quad',
      containerHeight: `${rows.length * itemHeight + (rows.length - 1) * 5}px`,
      rows: rows
    };
  }

  calculateOptimalHeight(media: any, targetWidth: number, secondMedia?: any): number {
    let avgAspectRatio = media.aspectRatio;
    if (secondMedia) {
      avgAspectRatio = (media.aspectRatio + secondMedia.aspectRatio) / 2;
    }
    const calculatedHeight = targetWidth / avgAspectRatio;
    return Math.max(150, Math.min(calculatedHeight, 400));
  }

  getObjectFit(media: any, targetWidth: number, targetHeight: number): string {
    const targetAspectRatio = targetWidth / targetHeight;
    const mediaAspectRatio = media.aspectRatio;
    if (Math.abs(targetAspectRatio - mediaAspectRatio) > 0.5) {
      return 'cover';
    }

    return 'contain';
  }

  private getBestMainImage(): any {
    let bestImage = this.mediaItems[0];
    let bestScore = this.getImageScore(bestImage);
    for (let i = 1; i < this.mediaItems.length; i++) {
      const score = this.getImageScore(this.mediaItems[i]);
      if (score > bestScore) {
        bestScore = score;
        bestImage = this.mediaItems[i];
      }
    }

    return bestImage;
  }

  private getImageScore(media: any): number {
    let score = 0;
    const ratio = media.aspectRatio;
    if (ratio >= 1.2 && ratio <= 2.0) {
      score += 15;
    } else if (ratio >= 0.8 && ratio <= 1.2) {
      score += 10;
    } else {
      score += 5;
    }
    if (media.naturalWidth && media.naturalWidth > 1200) score += 5;
    if (media.naturalHeight && media.naturalHeight > 800) score += 3;

    // Slight preference for first images (natural order)
    const index = this.mediaItems.indexOf(media);
    score += Math.max(0, 3 - index);

    return score;
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
    const baseHeight = 320;
    const gapHeight = (stackCount - 1) * 3;
    const itemHeight = (baseHeight - gapHeight) / stackCount;
    return `${Math.floor(itemHeight)}px`;
  }

  // Helper method to get responsive image sizing
  getImageStyles(item: any): any {
    return {
      'height': item.height,
      'object-fit': item.objectFit || 'cover',
      'object-position': 'center center'
    };
  }

  getContainerStyles(): any {
    return {
      'max-width': `${this.containerWidth}px`,
      'height': this.layout.containerHeight || 'auto'
    };
  }
}
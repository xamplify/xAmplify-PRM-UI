import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
declare var $: any;

@Component({
  selector: 'app-feed-preview-modal',
  templateUrl: './feed-preview-modal.component.html',
  styleUrls: ['./feed-preview-modal.component.css']
})
export class FeedPreviewModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Output() closed: EventEmitter<void> = new EventEmitter();
  constructor(public authenticationService: AuthenticationService,
              public videoUtilService: VideoUtilService) { }

  ngOnInit() {
    $('#feedPreviewModal').modal('show');
    $('#feedPreviewModal').on('hidden.bs.modal', () => {
      this.closed.emit();
    });
  }

  ngOnDestroy() {
    $('#feedPreviewModal').modal('hide');
    $('#feedPreviewModal').off('hidden.bs.modal');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}

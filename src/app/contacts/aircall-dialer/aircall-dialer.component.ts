import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';

@Component({
  selector: 'app-aircall-dialer',
  templateUrl: './aircall-dialer.component.html',
  styleUrls: ['./aircall-dialer.component.css']
})
export class AircallDialerComponent implements OnInit {

  @Input() isReloadTab: boolean;

  @Output() notifyClose = new EventEmitter();

  constructor(private referenceService: ReferenceService) { }

  ngOnInit() {
    this.referenceService.openModalPopup('addCallModalPopup');
  }

  closeCallModal() {
    this.referenceService.closeModalPopup('addCallModalPopup');
    this.notifyClose.emit(!this.isReloadTab);
  }

}

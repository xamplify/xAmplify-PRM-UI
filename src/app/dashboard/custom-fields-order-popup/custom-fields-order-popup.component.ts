import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomFieldsDto } from '../models/custom-fields-dto';
import { DragulaService } from 'ng2-dragula';
declare var $;
@Component({
  selector: 'app-custom-fields-order-popup',
  templateUrl: './custom-fields-order-popup.component.html',
  styleUrls: ['./custom-fields-order-popup.component.css']
})
export class CustomFieldsOrderPopupComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  @Input() customFieldsList: any;
  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('customFieldsDragula', {})
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
  }
  private onDropModel(args) {
  }
  ngOnInit() {
    $("#integrationSettingsForm").modal('show');
  }

  ngOnDestroy() {
    this.dragulaService.destroy('customFieldsDragula');
  }

  hideIntegrationSettingForm() {
    $("#integrationSettingsForm").modal('hide');
    this.closeEvent.emit("0");
  }

}

import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-ui-switch',
  templateUrl: './custom-ui-switch.component.html',
  styleUrls: ['./custom-ui-switch.component.css'],
})
export class CustomUiSwitchComponent implements OnInit {
 @Input() customSwitch = false;
 @Input() isSwitchOptionDisabled = false;
 @Output() customUiSwitchEventEmitter = new EventEmitter();
 @Input() tooltipMessage = "";
  constructor() { }

  ngOnInit() {
    if(this.customSwitch==undefined){
      this.customSwitch =false;
    }
    if(this.isSwitchOptionDisabled==undefined){
      this.isSwitchOptionDisabled = false;
    }

  }

  ngOnChanges(){
    if(this.isSwitchOptionDisabled==undefined){
      this.isSwitchOptionDisabled = false;
    }
  }

  getSwitchValue(event:any){
    this.customUiSwitchEventEmitter.emit(event);
  }

}

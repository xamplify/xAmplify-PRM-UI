import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-ui-switch',
  templateUrl: './custom-ui-switch.component.html',
  styleUrls: ['./custom-ui-switch.component.css']
})
export class CustomUiSwitchComponent implements OnInit {
 @Input() customSwitch = false;
 @Output() customUiSwitchEventEmitter = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if(this.customSwitch==undefined){
      this.customSwitch =false;
    }
  }

  getSwitchValue(event:any){
    this.customUiSwitchEventEmitter.emit(event);
  }

}

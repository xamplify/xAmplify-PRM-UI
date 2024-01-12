import { Component, OnInit, Input } from '@angular/core';
import { CustomAnimation } from 'app/core/models/custom-animation';

declare var $:any;
@Component({
  selector: 'app-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.css'],
  animations: [CustomAnimation]
})
export class ResponseMessageComponent implements OnInit {
    @Input() customResponse: any;
    @Input() showCloseIcon:boolean = true;
  constructor() { }
  ngOnInit() {
    if(this.customResponse.responseType=="INFO" && $.trim(this.customResponse.responseMessage.length)==0){
      this.customResponse.responseMessage = "No data found";
    }
  }

}

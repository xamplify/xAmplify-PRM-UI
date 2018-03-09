import { Component, OnInit, Input } from '@angular/core';
import { CustomeResponse } from '../models/response';

@Component({
  selector: 'app-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.css']
})
export class ResponseMessageComponent implements OnInit {
    @Input() responseMessageDetails: any;
    
    response: CustomeResponse = new CustomeResponse();
  constructor() { }
  ngOnInit() {
 //alert(this.responseMessageDetails);
          this.response.responseType = this.responseMessageDetails[0];
          this.response.responseMessage = this.responseMessageDetails[1];
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { CustomResponse } from '../models/custom-response';

@Component({
  selector: 'app-response-message',
  templateUrl: './response-message.component.html',
  styleUrls: ['./response-message.component.css']
})
export class ResponseMessageComponent implements OnInit {
    @Input() customResponse: any;
  constructor() { }
  ngOnInit() {
  }

}

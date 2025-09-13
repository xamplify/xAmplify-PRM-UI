import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-display-error-message',
  templateUrl: './display-error-message.component.html',
  styleUrls: ['./display-error-message.component.css']
})
export class DisplayErrorMessageComponent implements OnInit {

  @Input() text:string;
  constructor() { }

  ngOnInit() {
    if(this.text==undefined){
      this.text = "data";
    }
  }

}

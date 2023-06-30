import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-send-test-email',
  templateUrl: './send-test-email.component.html',
  styleUrls: ['./send-test-email.component.css']
})
export class SendTestEmailComponent implements OnInit {

  @Input() id:number = 0;
  @Output() sendTestEmailComponentEventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  callEventEmitter(){
    this.sendTestEmailComponentEventEmitter.emit();
  }

}

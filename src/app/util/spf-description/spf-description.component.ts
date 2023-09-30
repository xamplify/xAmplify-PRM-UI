import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-spf-description',
  templateUrl: './spf-description.component.html',
  styleUrls: ['./spf-description.component.css']
})
export class SpfDescriptionComponent implements OnInit {
 @Input() showGoDaddyConfiguration = false;
  constructor() { }

  ngOnInit() {
    if(this.showGoDaddyConfiguration==undefined){
      this.showGoDaddyConfiguration = false;
    }
  }

}

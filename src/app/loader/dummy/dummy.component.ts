import { Component, OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit, OnDestroy {
public dummyPage: string;
interval;
  now = new Date();

  constructor() {
    this.interval = setInterval(() => {
      this.now = new Date() ;
    });
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  ngOnInit() {
  }

}

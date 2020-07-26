import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-custom-feeds',
  templateUrl: './add-custom-feeds.component.html',
  styleUrls: ['./add-custom-feeds.component.css']
})
export class AddCustomFeedsComponent implements OnInit {
  loading = false;
  constructor() { }

  ngOnInit() {
    alert("i am here");
  }

}

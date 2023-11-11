import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-assets',
  templateUrl: './share-assets.component.html',
  styleUrls: ['./share-assets.component.css']
})
export class ShareAssetsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    alert("Share Assets");
  }

}

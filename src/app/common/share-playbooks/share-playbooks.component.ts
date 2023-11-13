import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-playbooks',
  templateUrl: './share-playbooks.component.html',
  styleUrls: ['./share-playbooks.component.css']
})
export class SharePlaybooksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    alert("PlayBooks Component");
  }

}

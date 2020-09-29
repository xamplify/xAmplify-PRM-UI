import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-dam',
  templateUrl: './add-dam.component.html',
  styleUrls: ['./add-dam.component.css']
})
export class AddDamComponent implements OnInit {

  constructor() { }

  ngOnInit() {
	alert("Create");
  }

}

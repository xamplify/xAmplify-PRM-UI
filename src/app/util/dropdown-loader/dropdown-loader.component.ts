import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-loader',
  templateUrl: './dropdown-loader.component.html',
  styleUrls: ['./dropdown-loader.component.css']
})
export class DropdownLoaderComponent implements OnInit {

  @Input() text:string;
  constructor() { }

  ngOnInit() {
    if(this.text==undefined){
      this.text="";
    }
  }

}

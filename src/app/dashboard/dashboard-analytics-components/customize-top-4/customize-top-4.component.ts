import { Component, OnInit,Input,EventEmitter } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-customize-top-4',
  templateUrl: './customize-top-4.component.html',
  styleUrls: ['./customize-top-4.component.css']
})
export class CustomizeTop4Component implements OnInit {
  headerTitle = "";
  assetTitle = "YOUR ASSETS";
  options = [];
  selectedOption:string = "CUSTOM";
  assets:Array<any> = new Array<any>();
  constructor() {
    this.options.push('RECENT');
    this.options.push('TRENDING');
    this.options.push('CUSTOM');
   }

  ngOnInit() {
    $('#customizeTopFourModal').modal('show');
  }

  selectOption(option){
  }

save(){
	
}

}

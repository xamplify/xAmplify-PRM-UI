import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-modal-popup-loader',
  templateUrl: './modal-popup-loader.component.html',
  styleUrls: ['./modal-popup-loader.component.css']
})
export class ModalPopupLoaderComponent implements OnInit {

@Input() height;
updatedHeight:string=""
  constructor() { }

  ngOnInit() {
	if(this.height!=undefined){
		this.updatedHeight = "220px";
	}else{
		this.updatedHeight = "370px";
	}
	
  }

}

import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-modal-popup-loader',
  templateUrl: './modal-popup-loader.component.html',
  styleUrls: ['./modal-popup-loader.component.css']
})
export class ModalPopupLoaderComponent implements OnInit {

@Input() height:any;
updatedHeight:string="";
@Input() showCircle:boolean;
  constructor() { }

  ngOnInit() {
	if(this.height!=undefined){
		if(this.height=="460"){
			this.updatedHeight = "460px";
		}else if(this.height=="408"){
			this.updatedHeight = "408px";
		}else if(this.height=="75"){
			this.updatedHeight = "75px";
		}else if(this.height=="180"){
			this.updatedHeight = "180px";
		}else if(this.height=="150"){
			this.updatedHeight = "150px";
		}else if(this.height=="935"){
			this.updatedHeight = "935px";
		}else{
			this.updatedHeight = "220px";
		}
	}else{
		this.updatedHeight = "370px";
	}
	
  }

}

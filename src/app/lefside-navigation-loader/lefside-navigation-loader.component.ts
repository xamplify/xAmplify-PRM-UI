import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-lefside-navigation-loader',
  templateUrl: './lefside-navigation-loader.component.html',
  styleUrls: ['./lefside-navigation-loader.component.css']
})
export class LefsideNavigationLoaderComponent implements OnInit {
	className = "col-xs-12";
	items: number[] = [];
	@Input() topNavbarLoader = false;
	constructor() { }

	ngOnInit() {
		if(this.topNavbarLoader){
			this.items.push(1);
		}else{
			for(let i=0;i<=6;i++){
				this.items.push(i);
			}
		}
		
	}

}

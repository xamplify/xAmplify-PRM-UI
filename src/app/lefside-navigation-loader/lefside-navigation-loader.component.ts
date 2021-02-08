import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lefside-navigation-loader',
  templateUrl: './lefside-navigation-loader.component.html',
  styleUrls: ['./lefside-navigation-loader.component.css']
})
export class LefsideNavigationLoaderComponent implements OnInit {
	className = "col-xs-12";
	items: number[] = [];

	constructor() { }

	ngOnInit() {
		for(let i=0;i<=6;i++){
			this.items.push(i);
		}
	}

}

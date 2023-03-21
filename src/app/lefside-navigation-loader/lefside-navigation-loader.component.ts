import { Component, OnInit,Input } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-lefside-navigation-loader',
  templateUrl: './lefside-navigation-loader.component.html',
  styleUrls: ['./lefside-navigation-loader.component.css']
})
export class LefsideNavigationLoaderComponent implements OnInit {
	className = "col-xs-12";
	items: number[] = [];
	@Input() loadDefaultCss = false;
	constructor() { }

	ngOnInit() {
		if(this.loadDefaultCss){
			$(".timeline-item").css({'background': '#fff','border-color':'#e5e6e9 #dfe0e4 #d0d1d5'});
			$(".animated-background").css({'background': 'linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)'});
			this.items.push(1);
		}else{
			$(".animated-background").css({'background': 'linear-gradient(to right, #00000008 8%, #172d44 18%, #172d44  33%)'});
			for(let i=0;i<=6;i++){
				this.items.push(i);
			}
		}
	}

}

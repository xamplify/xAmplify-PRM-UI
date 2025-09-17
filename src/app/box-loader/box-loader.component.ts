import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-box-loader',
	templateUrl: './box-loader.component.html',
	styleUrls: ['./box-loader.component.css']
})
export class BoxLoaderComponent implements OnInit {

	@Input() countLoader: number;
	@Input() mdfModule: boolean;
	className = "col-xs-16 col-sm-8 col-md-3";
	items: number[] = [];
	constructor() { }

	ngOnInit() {
		if (this.mdfModule != undefined) {
			if(this.countLoader==3){
				this.className = "col-xs-16 col-sm-8 col-md-4";
			}else if(this.countLoader==4){
				this.className = "col-sm-3 col-xs-6 col-lg-3 col-md-3";
			}
		}

		if(this.mdfModule== undefined && this.countLoader==3){
			this.className = "col-sm-4 col-xs-8 col-lg-4 col-md-4";
		}
		if (this.countLoader != undefined) {
			if(this.countLoader==5){
				this.className = "col-xs-6 col-sm-4 col-md-2";
				this.items.push(1);
			}
			
			else{
				if(this.countLoader==1){
					this.className = "col-xs-16 col-sm-8 col-md-6";
				}else if(this.countLoader==2){
					this.className = "col-xs-12 col-sm-6 col-md-6";
				}
				else if(this.countLoader == 8){
					this.className = "col-sm-6 col-xs-12 col-lg-6 col-md-6";

				}
				
				for (let i = 0; i < this.countLoader; i++) {
					this.items.push(i);
				}
			}
		} else {
			this.items.push(1);
		}
	}

}

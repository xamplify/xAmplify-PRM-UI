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
			this.className = "col-xs-16 col-sm-8 col-md-4";
		}

		if (this.countLoader != undefined) {
			for (let i = 0; i < this.countLoader; i++) {
				this.items.push(i);
			}
		} else {
			this.items.push(1);
		}
	}

}

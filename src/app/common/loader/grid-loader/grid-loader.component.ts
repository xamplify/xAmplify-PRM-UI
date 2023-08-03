import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-grid-loader',
	templateUrl: './grid-loader.component.html',
	styleUrls: ['./grid-loader.component.css']
})
export class GridLoaderComponent implements OnInit {

	@Input() count = 0;
	rowsCount = [];

	constructor() { }

	ngOnInit() {
		if (this.count == 4) {
			this.rowsCount = [0, 1, 2, 3];
		} else {
			this.rowsCount = [0, 1, 2, 3];
		}
	}

}

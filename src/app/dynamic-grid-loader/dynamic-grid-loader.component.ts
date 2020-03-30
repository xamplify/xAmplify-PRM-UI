import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-dynamic-grid-loader',
	templateUrl: './dynamic-grid-loader.component.html',
	styleUrls: ['./dynamic-grid-loader.component.css']
})
export class DynamicGridLoaderComponent implements OnInit {
	@Input() gridCount: number;
	items: number[] = [];
	constructor() { }

	ngOnInit() {
		if (this.gridCount != undefined) {
			for (let i = 0; i < this.gridCount; i++) {
				this.items.push(i);
			}
		} else {
			this.items.push(1);
		}

	}
}

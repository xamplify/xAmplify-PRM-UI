import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-image-loader',
	templateUrl: './image-loader.component.html',
	styleUrls: ['./image-loader.component.css']
})
export class ImageLoaderComponent implements OnInit {

	@Input() image: string;
	@Input() loading: boolean;
	@Input() moduleName: string;
	className = "image-preview";
	loaderClassName ="center-image";
	constructor() {

	}

	hideLoader() {
		this.loading = false;
	}

	ngOnInit() {
		this.loading = true;
		if (this.moduleName == "top-4-assets") {
			this.className = "img-class mxv";
			this.loaderClassName = this.className;
		}
	}


}

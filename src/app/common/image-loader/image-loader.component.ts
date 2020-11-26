import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.css']
})
export class ImageLoaderComponent implements OnInit {

  @Input() image:string;
@Input() loading:boolean;	
  constructor() { 
   
  }

  hideLoader(){
    this.loading=false;
  }

  ngOnInit() {
	 this.loading=true;
  }


}

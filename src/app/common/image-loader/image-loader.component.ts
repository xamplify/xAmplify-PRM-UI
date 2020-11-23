import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.css']
})
export class ImageLoaderComponent implements OnInit {

  @Input() image:string;

  isLoading:boolean;
  constructor() { 
    this.isLoading=true;
  }

  hideLoader(){
    this.isLoading=false;
  }

  ngOnInit() {
  }

}

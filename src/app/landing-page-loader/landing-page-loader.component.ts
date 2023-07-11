import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-landing-page-loader',
  templateUrl: './landing-page-loader.component.html',
  styleUrls: ['./landing-page-loader.component.css']
})
export class LandingPageLoaderComponent implements OnInit {

  @Input() maxBoxLength:number;

  constructor() { }

  ngOnInit() {
    if(this.maxBoxLength==undefined){
      this.maxBoxLength = 4;
    }
    
  }

}

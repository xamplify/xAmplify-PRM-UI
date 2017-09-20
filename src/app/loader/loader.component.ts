import { Component, OnInit,Input,OnChanges } from '@angular/core';
import { HttpRequestLoader } from '../core/models/http-request-loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  providers:[HttpRequestLoader],
})
export class LoaderComponent implements OnInit  {

    @Input() model:boolean;
    //items:number[] = [];
   constructor() {
  }
  ngOnInit() {
  }

  
/*  ngOnChanges(changes: any){
      for(var i=1;i<=this.model.listCount;i++){
          console.log(this.model.listCount)
          this.items.push(i);
      }
     }*/
  
  
}

import { Component, OnInit,Input } from '@angular/core';
import { HttpRequestLoader } from '../core/models/http-request-loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  providers:[HttpRequestLoader],
})
export class LoaderComponent implements OnInit {

    @Input() model:boolean;
    
   constructor() {
  }
  ngOnInit() {
  }

}

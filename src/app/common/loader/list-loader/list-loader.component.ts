import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-loader',
  templateUrl: './list-loader.component.html',
  styleUrls: ['./list-loader.component.css']
})
export class ListLoaderComponent implements OnInit {
    @Input() rowsCount: any;
    
    icons: any;
    
  constructor() { }

  ngOnInit() {
      if ( this.rowsCount === 3 ) {
          this.rowsCount = [0, 1, 2];
          this.icons = [0];
      } else {
          this.rowsCount = [0, 1, 2, 3, 4, 5];
          this.icons = [0,1,2];
      }

  }

}

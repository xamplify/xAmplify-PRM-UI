import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-bottomnavbar',
  templateUrl: './bottomnavbar.component.html',
  styleUrls: ['./bottomnavbar.component.css']
})
export class BottomnavbarComponent implements OnInit {

  constructor() { }
  scrollTop() {
      $( 'html,body' ).animate( { scrollTop: 0 }, 'slow' );
  }
  ngOnInit() {
  }

}

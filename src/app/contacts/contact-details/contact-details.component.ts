import { Component, Input, OnInit } from '@angular/core';
declare var $: any, swal: any;
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  @Input() public selectedContact:any;

  constructor() { }

  ngOnInit() {
  }
// plus& minus icon
toggleClass(id: string) {
  $("i#" + id).toggleClass("fa-minus fa-plus");
}
}

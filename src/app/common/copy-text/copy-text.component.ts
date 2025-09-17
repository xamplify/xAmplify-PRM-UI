import { Component, OnInit,Input } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-copy-text',
  templateUrl: './copy-text.component.html',
  styleUrls: ['./copy-text.component.css']
})
export class CopyTextComponent implements OnInit {

  @Input() id:any;
  @Input() copyTextId:any;
  @Input() index:number;
  isLoading = true;
  constructor() { }

  ngOnInit() {
    this.id = this.id+"-"+this.index;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    
  }

  copyApprovedUserEmailAddress(){
		$(".success").hide();
		$('#'+this.id).hide();
		this.copyTextId.select();
    document.execCommand('copy');
    this.copyTextId.setSelectionRange(0, 0);
		$('#'+this.id).show(600);
	}

}

import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
@Input() userInfo: any;
backgroudColor:any;
  constructor() { }

  ngOnInit() {
      if(this.userInfo.emailId){
          let first = this.userInfo.emailId.charAt(0);
          if(first == 'a' || first == 'b' || first == 'c' || first == 'd' || first == 'e' ){
              this.backgroudColor = "#512da8";
          }
          else if(first == 'f' || first == 'g' || first == 'h' || first == 'i' || first == 'j' ){
              this.backgroudColor = "#5d4037";
          }
          else if(first == 'k' || first == 'l' || first == 'm' || first == 'n' || first == 'o' ){
              this.backgroudColor = "#ef6c00";
          }
          else if(first == 'p' || first == 'q' || first == 'r' || first == 's' || first == 't' ){
              this.backgroudColor = "#01579b";
          }
          else if(first == 'u' || first == 'v' || first == 'w' || first == 'x' || first == 'y' || first == 'z'){
              this.backgroudColor = "#26a69a";
          }
       }
  }

}

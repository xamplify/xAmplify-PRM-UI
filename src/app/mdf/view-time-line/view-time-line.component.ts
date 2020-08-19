import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-time-line',
  templateUrl: './view-time-line.component.html',
  styleUrls: ['./view-time-line.component.css','../html-sample/html-sample.component.css']
})
export class ViewTimeLineComponent implements OnInit {

  mdfId:number = 0;
  type:string = "";
  message = "";
  constructor(private router:Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.mdfId = parseInt(this.route.snapshot.params['mdfId']);
    this.type = this.route.snapshot.params['type'];
    if("v"==this.type){
      this.message = "Download Documents For Reimbursement";
    }else{
      this.message = "Upload Documents For Reimbursement";
    }
  }

  goToManageMdfRequests(){
    if("v"==this.type){
      this.router.navigate(["/home/mdf/change-request/"+this.mdfId]);
    }else{
      this.router.navigate(["/home/mdf/requests/p"]);
      
    }
   
    
  }

 
}

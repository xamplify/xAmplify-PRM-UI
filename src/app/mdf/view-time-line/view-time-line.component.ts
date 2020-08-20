import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { MdfService } from '../services/mdf.service';
import { MdfRequest } from '../models/mdf.request';


@Component({
  selector: 'app-view-time-line',
  templateUrl: './view-time-line.component.html',
  styleUrls: ['./view-time-line.component.css','../html-sample/html-sample.component.css']
})
export class ViewTimeLineComponent implements OnInit {

  mdfId:number = 0;
  type:string = "";
  message = "";
  loading = false;
  mdfDetails:any;
  constructor(private mdfService: MdfService,private router:Router,private route: ActivatedRoute,public xtremandLogger: XtremandLogger) { }

  ngOnInit() {
    this.loading =  true;
    this.mdfId = parseInt(this.route.snapshot.params['mdfId']);
    this.type = this.route.snapshot.params['type'];
    if("v"==this.type){
      this.message = "Download Documents For Reimbursement";
    }else{
      this.message = "Upload Documents For Reimbursement";
    }
    this.getMdfData();
  }

  goToManageMdfRequests(){
    if("v"==this.type){
      this.router.navigate(["/home/mdf/change-request/"+this.mdfId]);
    }else{
      this.router.navigate(["/home/mdf/requests/p"]);
      
    }
    
  }
  getMdfData(){
    this.mdfService.getMdfById(this.mdfId).
    subscribe((result: any) => {
        this.mdfDetails = result.data.mdfDetails;
        console.log(this.mdfDetails);
        this.loading = false;
    }, error => {
      this.loading = false;
      this.xtremandLogger.log(error);
      this.xtremandLogger.errorPage(error);
    },
    () => {
    }
    );
  }   


 
}

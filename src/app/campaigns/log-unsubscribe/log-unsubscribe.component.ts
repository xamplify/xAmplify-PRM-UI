import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from '../../core/services/log.service';
import { Processor } from '../../core/models/processor';
declare var $:any;

@Component({
  selector: 'app-log-unsubscribe',
  templateUrl: './log-unsubscribe.component.html',
  styleUrls: ['./log-unsubscribe.component.css'],
  providers:[Processor]
})
export class LogUnsubscribeComponent implements OnInit {
	 public userAlias: string;
     public companyId: number;
     public message : string;


  constructor(private activatedRoute: ActivatedRoute, private router: Router, private logService: LogService,
  public processor:Processor) { }

  logunsubscribedUser(){
	    this.logService.logunsubscribedUser(this.userAlias, this.companyId)
        .subscribe(
        (result: any) => {
           $('html').css('background-color','white');​​​​​​​​​​​​​​​​​​​​​
            this.processor.remove(this.processor);
            console.log(result['_body']);
            var body = result['_body'];
            var resp = JSON.parse(body);
            this.message = resp.message;
            console.log(resp);
        }, (error:any)=> {
           this.processor.remove(this.processor);
           $('html').css('background-color','white');​​​​​​​​​​​​​​​​​​​​​
        })
   }

  ngOnInit() {
    this.processor.set(this.processor);
      this.activatedRoute.queryParams.subscribe(
              (param: any) => {
                  this.userAlias = param['userAlias'];
                  this.companyId = param['companyId'];
              });
          //this.getGeoLocation();
          this.logunsubscribedUser();
          }

}

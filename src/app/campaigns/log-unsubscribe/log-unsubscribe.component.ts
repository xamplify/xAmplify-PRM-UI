import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-log-unsubscribe',
  templateUrl: './log-unsubscribe.component.html',
  styleUrls: ['./log-unsubscribe.component.css']
})
export class LogUnsubscribeComponent implements OnInit {
	 public userAlias: string;
     public companyId: number;
	

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private logService: LogService) { }
  
  logunsubscribedUser(){
	    this.logService.logunsubscribedUser(this.userAlias, this.companyId)
        .subscribe(
        (result: any) => {
            console.log(result['_body']);
            var body = result['_body'];
            var resp = JSON.parse(body);
            console.log(resp);
        })
  }

  ngOnInit() {
      this.activatedRoute.queryParams.subscribe(
              (param: any) => {
                  this.userAlias = param['userAlias'];
                  this.companyId = param['companyId'];
              });
          //this.getGeoLocation();
          this.logunsubscribedUser();
          }

}

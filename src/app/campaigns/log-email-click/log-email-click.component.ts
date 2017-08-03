import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from '../../core/services/log.service';

@Component({
  selector: 'app-log-email-click',
  templateUrl: './log-email-click.component.html',
  styleUrls: ['./log-email-click.component.css']
})
export class LogEmailClickComponent implements OnInit {
	   public campaignAlias: string;
       public userAlias: string;
       public url: string;

  constructor(private activatedRoute: ActivatedRoute, private router : Router, private logService:LogService) { }
  
  logEmailUrlClicks() {
      this.logService.logEmailUrlClicks(this.campaignAlias, this.userAlias, this.url)
          .subscribe(
          (result: any) => {
              console.log(result['_body']);
              var body = result['_body'];
              var resp = JSON.parse( body );
              console.log(resp.url);
              window.location.href = resp.url;
          })
  }

  ngOnInit() {
	  this.activatedRoute.queryParams.subscribe(
	            (param: any) => {
	                this.campaignAlias = param['campaignAlias'];
	                this.userAlias = param['userAlias'];
	                this.url = param['url'];
	            });
	        this.logEmailUrlClicks();
	        
  }

}

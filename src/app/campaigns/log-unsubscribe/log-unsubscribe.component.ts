import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LogService } from "../../core/services/log.service";
import { Processor } from "../../core/models/processor";
declare var $: any;

@Component({
  selector: "app-log-unsubscribe",
  templateUrl: "./log-unsubscribe.component.html",
  styleUrls: [
    "./log-unsubscribe.component.css",
    "../../../assets/css/loader.css"
  ],
  providers: [Processor]
})
export class LogUnsubscribeComponent implements OnInit {
  public userAlias: string;
  public companyId: number;
  public message: string;
  companyName: any;
  isUnsubscribed: boolean;
  userId: any;
  reason = '';
  isOtherReason = false;
  isShowSuccessMessage = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private logService: LogService,
    public processor: Processor
  ) {}

  logunsubscribedUser() {
    this.logService
      .logunsubscribedUser(this.userAlias, this.companyId)
      .subscribe(
        (result: any) => {
          $("html").css("background-color", "white");
          this.processor.remove(this.processor);
          console.log(result["_body"]);
          var body = result["_body"];
          var resp = JSON.parse(body);
          this.message = resp.message;
          console.log(resp);
          this.isUnsubscribed = resp.isUnsubscribed;
          this.companyName = resp.companyName;
          this.userId = resp.userId;
          
        },
        (error: any) => {
          this.processor.remove(this.processor);
          $("html").css("background-color", "white");
        }
      );
  }
  setOtherOption(){
      this.isOtherReason = false;
  }
  
  unSubscribeUser(){
      
    if(this.isUnsubscribed){
      var object = {
             "userId": this.userId,
             "companyId": this.companyId,
             "companyName":this.companyName,
             "reason":this.reason,
             "type":"reSubscribed"
     }
    }else{
        var object = {
                "userId": this.userId,
                "companyId": this.companyId,
                "companyName":this.companyName,
                "reason":this.reason,
                "type":"unsubscribed"
        }
    }
      
      this.logService.unSubscribeUser(object)
      .subscribe(
        (result: any) => {
          console.log(result);
          this.message = result["_body"].message;
          this.isShowSuccessMessage = true
        },
        (error: any) => {
        console.log(error);
        }
      );
  }

  ngOnInit() {
    this.processor.set(this.processor);
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.userAlias = param["userAlias"];
      this.companyId = param["companyId"];
    });
    this.logunsubscribedUser();
  }
}

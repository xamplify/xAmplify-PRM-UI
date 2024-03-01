import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LogService } from "../../core/services/log.service";
import { Processor } from "../../core/models/processor";
import { Properties } from "app/common/models/properties";

declare var $: any;

@Component({
  selector: "app-log-unsubscribe",
  templateUrl: "./log-unsubscribe.component.html",
  styleUrls: [
    "./log-unsubscribe.component.css",
    "../../../assets/css/loader.css"
  ],
  providers: [Processor,Properties]
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
  characterleft = 250;
  unsubscribeReasons:Array<any>;
  invalidReason = true;
  unsubscribePageContent:any = {};
  loading = false;
  companyLogoPath = "";
  constructor(
    private activatedRoute: ActivatedRoute,
    private logService: LogService,
    public processor: Processor,
    public properties:Properties
  ) {}

  logunsubscribedUser() {
    this.logService
      .logunsubscribedUser(this.userAlias, this.companyId)
      .subscribe(
        (result: any) => {
          $("html").css("background-color", "white");
          var body = result["_body"];
          var resp = JSON.parse(body);
          this.message = resp.message;
          this.isUnsubscribed = resp.isUnsubscribed;
          this.companyName = resp.companyName;
          this.userId = resp.userId;
          this.companyLogoPath = resp.companyLogoPath;
        },
        (error: any) => {
          this.processor.remove(this.processor);
          $("html").css("background-color", "white");
        },()=>{
          if(!this.isUnsubscribed){
            this.findUnsubscribeReasons();
          }else{
            this.invalidReason = true;
            this.processor.remove(this.processor);
          }
        }
      );
  }

  findUnsubscribeReasons(){
    this.unsubscribeReasons = [];
    this.unsubscribePageContent = {};
    this.processor.set(this.processor);
    this.logService.findUnsubscribePageContent(this.companyId).subscribe(
      response=>{
        var body = response["_body"];
        var resp = JSON.parse(body);
        let map = resp.data;
        this.unsubscribeReasons = map['unsubscribeReasons'];
        this.unsubscribePageContent = map;
      },error=>{
        this.processor.remove(this.processor);
        $("html").css("background-color", "white");
      },()=>{
        this.isOtherReason = this.unsubscribeReasons.length==0;
        this.processor.remove(this.processor);
      }
    );
  }

  setOtherOption(){
      this.isOtherReason = false;
  }
  
  unSubscribeUser(){
    this.loading = true;
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
          var body = result["_body"];
          var resp = JSON.parse(body);
          this.message = resp.message;
          this.isShowSuccessMessage = true;
          this.loading = false;
        },
        (error: any) => {
        console.log(error);
        this.loading = false;
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

  addReason(unsubscribeReason:any){
    this.isOtherReason = unsubscribeReason.customReason;
    if(this.isOtherReason){
      this.reason = "";
      this.invalidReason = true;
    }else{
      this.invalidReason = false;
      this.reason = unsubscribeReason.reason;
    }
  }    

 characterSize(){
      let reasonLength = $.trim(this.reason).length;
      if(reasonLength>0){
        this.invalidReason = false;
        this.characterleft = 250 - reasonLength;
      }else{
        this.invalidReason = true;
      }
    }  

}

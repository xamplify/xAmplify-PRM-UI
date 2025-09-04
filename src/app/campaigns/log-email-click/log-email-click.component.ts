import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LogService } from "../../core/services/log.service";
import { UtilService } from "../../core/services/util.service";
import { Ng2DeviceService } from "ng2-device-detector";
import { Processor } from '../../core/models/processor';
@Component({
  selector: "app-log-email-click",
  templateUrl: "./log-email-click.component.html",
  styleUrls: [
    "./log-email-click.component.css",
    "../../../assets/css/loader.css"
  ],
  providers: [Processor]
})
export class LogEmailClickComponent implements OnInit {
  public campaignAlias: string = null;
  public userAlias: string = null;
  public url: string = null;
  public alias: string;
  public emailLog: any;
  public deviceInfo: any;
  errorHtml:any;
  customCampaignError :any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private logService: LogService,
    private utilService: UtilService,
    private deviceService: Ng2DeviceService,
    public processor:Processor
  ) {}
  
  errorMessage(){
      this.errorHtml =  '<div class="page-content"><div class="portlet light" style="border: navajowhite;">' +
        ' <div class="portlet-body clearfix">' +
        '<h3 style="color: blue;text-align: center;margin-top:150px;margin-bottom:100%;font-weight: bold;" >'+this.customCampaignError+'</h3></div></div></div>';

}

  logEmailUrlClicks() {
	  this.processor.set(this.processor);
    this.utilService.getJSONLocation().subscribe(
      (data: any) => {
        console.log("data :" + data);

        this.deviceInfo = this.deviceService.getDeviceInfo();
        if (this.deviceInfo.device === "unknown") {
          this.deviceInfo.device = "computer";
        }

        this.emailLog = {
          userAlias: this.userAlias,
          campaignAlias: this.campaignAlias,
          url: this.url,
          time: new Date(),
          deviceType: this.deviceInfo.device,
          os: this.deviceInfo.os,
          city: data.city,
          country: data.country,
          isp: data.isp,
          ipAddress: data.query,
          state: data.regionName,
          zip: data.zip,
          latitude: data.lat,
          longitude: data.lon,
          countryCode: data.countryCode,
          videoId: 0,
          actionId: 15,
          alias: this.alias
        };
        console.log("emailLog" + this.emailLog);
        this.logService
          .logEmailUrlClicks(this.emailLog)
          .subscribe(
        		  (result: any) => {
        	this.processor.remove(this.processor);
            console.log(result["_body"]);
            var body = result["_body"];
            var resp = JSON.parse(body);
            let url = resp.url;
            if(url && url.startsWith("mailto:")){
              window.location.assign(url);
              setTimeout (() => {
                window.close();
             }, 3000);
              
            }else if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
              window.location.href = url;
            } else if (url && !(url.startsWith("Sorry!")) && !(url.startsWith("http://") || url.startsWith("https://"))) {
              url = 'http://'+ url;
              window.location.href = url;
            }else if(url.startsWith("Sorry!")){
            	this.customCampaignError = url;
                this.errorMessage();
                document.getElementById('para').innerHTML = this.errorHtml;
            }
            else{ 
              this.router.navigate(['home/notfound']);
            }
          },
          (error: any) => {
             
          }
          );
      },
      error => console.log(error)
    );
  }

  ngOnInit() {
    this.alias = this.activatedRoute.snapshot.params["alias"];
    this.logEmailUrlClicks();
  }
}

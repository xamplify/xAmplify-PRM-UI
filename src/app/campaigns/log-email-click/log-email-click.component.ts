import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { LogService } from "../../core/services/log.service";
import { UtilService } from "../../core/services/util.service";
import { Ng2DeviceService } from "ng2-device-detector";
@Component({
  selector: "app-log-email-click",
  templateUrl: "./log-email-click.component.html",
  styleUrls: [
    "./log-email-click.component.css",
    "../../../assets/css/loader.css"
  ]
})
export class LogEmailClickComponent implements OnInit {
  public campaignAlias: string = null;
  public userAlias: string = null;
  public url: string = null;
  public alias: string;
  public emailLog: any;
  public deviceInfo: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private logService: LogService,
    private utilService: UtilService,
    private deviceService: Ng2DeviceService,
  ) {}

  logEmailUrlClicks() {
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
          .subscribe((result: any) => {
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
            } else if (url && !(url.startsWith("http://") || url.startsWith("https://"))) {
              url = 'http://'+ url;
              window.location.href = url;
            }
            else{ 
              this.router.navigate(['home/notfound']);
            }
          });
      },
      error => console.log(error)
    );
  }

  ngOnInit() {
    this.alias = this.activatedRoute.snapshot.params["alias"];
    this.logEmailUrlClicks();
  }
}

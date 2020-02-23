import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Processor } from '../../core/models/processor';
import { UtilService } from 'app/core/services/util.service';
import { Ng2DeviceService } from 'ng2-device-detector';
import { LogService } from 'app/core/services/log.service';
declare var $: any;

@Component({
  selector: 'app-log-regular-campaign-sms',
  templateUrl: './log-regular-campaign-sms.component.html',
  styleUrls: ['./log-regular-campaign-sms.component.css', '../../../assets/css/loader.css'],
  providers:[Processor]
})
export class LogRegularCampaignComponentSMS implements OnInit {

  campaignAlias: string;
  userAlias: string;
  templateId: number;
  templatehtml: string;
  alias: string;
  public smsLog: any;
  public url: string = null;

  public deviceInfo: any;

    errorHtml =  '<div class="page-content"><div class="portlet light" style="border: navajowhite;">' +
    ' <div class="portlet-body clearfix">' +
    '<h3 style="color: blue;text-align: center;margin-top: 150px;font-weight: bold;" >Sorry !This campaign has been removed</h3></div></div></div>';
  constructor(public xtremandLogger: XtremandLogger, public activatedRoute: ActivatedRoute,
          public videoFileService: VideoFileService,public referenceService:ReferenceService,public processor:Processor,
          private utilService: UtilService,
    private deviceService: Ng2DeviceService,private logService: LogService) {
    this.xtremandLogger.log('Ui regular campaign called');
  }

  ngOnInit() {
    this.processor.set(this.processor);
    this.alias = this.activatedRoute.snapshot.params['alias'];
    this.getRegularTemplateHtml();
  }


  logSMS_Opened() {
    this.utilService.getJSONLocation().subscribe(
      (data: any) => {
        console.log("data :" + data);

        this.deviceInfo = this.deviceService.getDeviceInfo();
        if (this.deviceInfo.device === "unknown") {
          this.deviceInfo.device = "computer";
        }

        this.smsLog = {
         
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
          actionId: 13,
          alias: this.alias
        };
        console.log("smsLog" + this.smsLog);
        this.logService
          .logSMSUrlOpened(this.smsLog)
          .subscribe((result: any) => {
            console.log(result["_body"]);
            var body = result["_body"];
            var resp = JSON.parse(body);
            let url = resp.url;
            if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
              //window.location.href = url;
            } else if (url && !(url.startsWith("http://") || url.startsWith("https://"))) {
              url = 'http://'+ url;
              //window.location.href = url;
            }
           

          });
      },
      error => console.log(error)
    );
  }

  getRegularTemplateHtml() {
    try {
      this.videoFileService.showCampaignSMS(this.alias)
        .subscribe((result: any) => {
          console.log(result)
          if(!result.isExternalWebLink){
              this.templatehtml = result.templatehtml;
              this.xtremandLogger.log(this.templatehtml);
              let updatedBody = this.templatehtml;
              updatedBody = updatedBody.replace("view in browser", '');
              updatedBody = updatedBody.replace("SocialUbuntuURL", '');
              updatedBody = updatedBody.replace("Loading socialubuntu URL...", '');
              updatedBody = updatedBody.replace("<SocialUbuntuImgURL>", '');
              updatedBody = updatedBody.replace("&lt;SocialUbuntuURL&gt;", "javascript:void(0)");
              updatedBody = updatedBody.replace("<SocialUbuntuURL>", "javascript:void(0)");
              updatedBody = updatedBody.replace("&lt;SocialUbuntuImgURL&gt;", '');
              updatedBody = updatedBody.replace("<emailOpenImgURL>", '');
              updatedBody = updatedBody.replace("<Company_name>", '');
              updatedBody = updatedBody.replace("<company_name></company_name>", "");
              updatedBody = updatedBody.replace("<Company_Logo>", '');
              updatedBody = updatedBody.replace("<Title_here>", '');
              updatedBody = updatedBody.replace("<unsubscribeURL>","");
              updatedBody = updatedBody.replace('click here','');
              updatedBody = updatedBody.replace("If you'd like to unsubscribe and stop receiving these emails click here"," ");
              updatedBody = updatedBody.replace("If you'd like to unsubscribe and stop receiving these emails","");
              this.templatehtml = updatedBody;
              document.getElementById('regular-campaign').innerHTML = this.templatehtml;
              this.processor.remove(this.processor);
              this.logSMS_Opened(); 
          }else{
            this.logSMS_Opened(); 
            window.location.href = result.templatehtml;
          }
              
        }, (error: any) => {
           console.log(error);
            this.xtremandLogger.error('log regular campaign component: regular campaign():' + error);
            document.getElementById('regular-campaign').innerHTML = this.errorHtml;
           this.processor.remove(this.processor);
          // this.xtremandLogger.errorPage(error);
        },
        () => console.log('getRegularTemplateHtml method completed:')
        );
    } catch (error) {
      this.xtremandLogger.error('error in showCampaign method :' + error);
      document.getElementById('regular-campaign').innerHTML = this.errorHtml;
      this.processor.remove(this.processor);
    }
  }
}

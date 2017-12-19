import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { VideoFileService } from '../../videos/services/video-file.service';
declare var $: any;

@Component({
  selector: 'app-log-regular-campaign',
  templateUrl: './log-regular-campaign.component.html',
  styleUrls: ['./log-regular-campaign.component.css']
})
export class LogRegularCampaignComponent implements OnInit {

  campaignAlias: string;
  userAlias: string;
  templateId: number;
  templatehtml: string;
  alias: string;
  errorHtml = '<div class="portlet light" style="padding:5px 5px 190px 17px">' +
  '<h3 style="color:blue;text-align: center;margin-top:204px;" >Sorry!!!. This regular email template campaign has been removed</h3></div>';

  constructor(public xtremandLogger: XtremandLogger, public activatedRoute: ActivatedRoute, public videoFileService: VideoFileService) {
    this.xtremandLogger.log('Ui regular campaign called');
  }

  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe((param: any) => {
    //   this.alias = param['alias'];
    //   this.userAlias = param['userAlias'];
    //   this.templateId = param['templateId'];
    // }, (error: any) => {
    //   this.xtremandLogger.error(error);
    // });
    this.alias = this.activatedRoute.snapshot.params['alias'];
    this.getRegularTemplateHtml();
  }

  getRegularTemplateHtml() {
    try {
      this.videoFileService.showCampaignEmail(this.alias)
        .subscribe((result: any) => {
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
              this.templatehtml = updatedBody;
              document.getElementById('regular-campaign').innerHTML = this.templatehtml;
        }, (error: any) => {
          this.xtremandLogger.error('log regular campaign component: regular campaign():' + error);
           document.getElementById('regular-campaign').innerHTML = this.errorHtml;
          // this.xtremandLogger.errorPage(error);
        },
        () => console.log('getRegularTemplateHtml method completed:')
        );
    } catch (error) {
      this.xtremandLogger.error('error in showCampaign method :' + error);
      document.getElementById('regular-campaign').innerHTML = this.errorHtml;
    }
  }
}
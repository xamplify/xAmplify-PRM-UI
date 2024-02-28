import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { VideoFileService } from '../../videos/services/video-file.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Processor } from '../../core/models/processor';
declare var $: any;

@Component({
  selector: 'app-log-regular-campaign',
  templateUrl: './log-regular-campaign.component.html',
  styleUrls: ['./log-regular-campaign.component.css', '../../../assets/css/loader.css'],
  providers:[Processor]
})
export class LogRegularCampaignComponent implements OnInit {

  campaignAlias: string;
  userAlias: string;
  templateId: number;
  templatehtml: string;
  alias: string;
  customCampaignError = 'Sorry !This campaign has been removed.'
    errorHtml =  '<div class="page-content"><div class="portlet light" style="border: navajowhite;">' +
    ' <div class="portlet-body clearfix">' +
    '<h3 style="color: blue;text-align: center;margin-top: 150px;font-weight: bold;" >Sorry !This campaign has been removed</h3></div></div></div>';
  constructor(public xtremandLogger: XtremandLogger, public activatedRoute: ActivatedRoute,
          public videoFileService: VideoFileService,public referenceService:ReferenceService,public processor:Processor) {
    this.xtremandLogger.log('Ui regular campaign called');
  }

  ngOnInit() {
    this.processor.set(this.processor);
    this.alias = this.activatedRoute.snapshot.params['alias'];
    this.getRegularTemplateHtml();
    //this.referenceService.removeCssStyles();
    //this.referenceService.removeElementById();
  }
  
  errorMessage(){
      this.errorHtml =  '<div class="page-content"><div class="portlet light" style="border: navajowhite;">' +
        ' <div class="portlet-body clearfix">' +
        '<h3 style="color: blue;text-align: center;margin-top: 150px;font-weight: bold;" >'+this.customCampaignError+'</h3></div></div></div>';

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
              //updatedBody = updatedBody.replace("<unsubscribeURL>","");
              //updatedBody = updatedBody.replace('click here','');
              //updatedBody = updatedBody.replace("If you'd like to unsubscribe and stop receiving these emails click here"," ");
              //updatedBody = updatedBody.replace("If you'd like to unsubscribe and stop receiving these emails","");
              this.templatehtml = updatedBody;
              document.getElementById('regular-campaign').innerHTML = this.templatehtml;
              this.processor.remove(this.processor);
              this.updateBackGroundColor();
        }, (error: any) => {
            this.processor.remove(this.processor);
            this.xtremandLogger.error('log regular campaign component: regular campaign():' + error);
            this.xtremandLogger.error(error);
            this.customCampaignError = JSON.parse(error._body).message;
            this.errorMessage();
            document.getElementById('regular-campaign').innerHTML = this.errorHtml;
            this.updateBackGroundColor();
        },
        () => console.log('getRegularTemplateHtml method completed:')
        );
    } catch (error) {
      this.xtremandLogger.error('error in showCampaign method :' + error);
      document.getElementById('regular-campaign').innerHTML = this.errorHtml;
      this.processor.remove(this.processor);
      this.updateBackGroundColor();
    }
  }

  updateBackGroundColor(){
    $("body"). css("background-color","#fff");
  }
}

import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../services/landing-page.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { LandingPage } from '../models/landing-page';
import { AuthenticationService } from '../../core/services/authentication.service';
declare var swal, $: any;

@Component({
  selector: 'app-preview-landing-page',
  templateUrl: './preview-landing-page.component.html',
  styleUrls: ['./preview-landing-page.component.css'],
  providers: [HttpRequestLoader],

})
export class PreviewLandingPageComponent implements OnInit {
  constructor(public landingPageService: LandingPageService,public authenticationService: AuthenticationService) { }
  loading = false;
  ngOnInit() {
  }
  
  
  showPreview(landingPage:LandingPage,data:any){
      this.loading = true;
      let htmlContent = "#landingPage-html-content";
      $(htmlContent).empty();
      let title = "#landing-page-preview-title";
      $(title).empty();
      $("#landing-page-preview-modal").modal('show');
      this.landingPageService.getHtmlContent(landingPage.id).subscribe(
              ( response: any ) => {
                  if(response.statusCode==200){
                      $(title).append(landingPage.name);
                      $(title).prop('title',landingPage.name);
                      let body  = response.message;
                      if(data!=""){
                          if(!data.enableCoBrandingLogo){
                              body = body.replace("<a href=\"https://dummycobrandingurl.com\"","<a href=\"https://dummycobrandingurl.com\" style=\"display:none\"");
                              body = body.replace("https://xamp.io/vod/images/co-branding.png","");

                          }
                          let userProfile = this.authenticationService.userProfile;
                          if(userProfile!=undefined && data!=undefined){
                              let partnerLogo = userProfile.companyLogo;
                              let partnerCompanyUrl = userProfile.websiteUrl;
                              if(data.nurtureCampaign ||userProfile.id!=data.userId){
                                  body = this.replacePartnerLogo(body,partnerLogo,partnerCompanyUrl,data);
                               }
                          }
                      }
                      $(htmlContent).append(body);
                      this.loading = false;
                  }else{
                      swal("Please Contact Admin!", "No Landing Page Found", "error");
                      $("#landing-page-preview-modal").modal('hide');
                  }
              },
              ( error: any ) => { swal("Please Contact Admin!", "Unable to load landing page", "error");this.loading = false;
              $("#landing-page-preview-modal").modal('hide'); } );
  }
  
  replacePartnerLogo(updatedBody:string,partnerLogo:string,partnerCompanyUrl:string,campaign:any){
      if(campaign.partnerCompanyLogo!=undefined){
          partnerLogo = campaign.partnerCompanyLogo;
      }else{
          partnerLogo = partnerLogo.replace("http://localhost:8080","https://xamp.io");
      }
      updatedBody = updatedBody.replace("https://xamp.io/vod/images/co-branding.png",partnerLogo);
      return updatedBody = this.replaceCoBrandingDummyUrl(updatedBody,partnerCompanyUrl);
  }

  replaceCoBrandingDummyUrl(updatedBody:string,partnerCompanyUrl:string){
      return updatedBody = updatedBody.replace("https://dummycobrandingurl.com",partnerCompanyUrl);
  }
  

}

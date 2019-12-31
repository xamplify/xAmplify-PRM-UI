import { Component, OnInit,ViewChild } from '@angular/core';
import { LandingPageService } from '../services/landing-page.service';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { LandingPage } from '../models/landing-page';
import { LandingPageGetDto } from '../models/landing-page-get-dto';
import { AuthenticationService } from '../../core/services/authentication.service';
import {ReferenceService} from '../../core/services/reference.service';
import { SaveGeoLocationAnalyticsComponent } from '../../util/save-geo-location-analytics/save-geo-location-analytics.component';
import { GeoLocationAnalytics } from '../../util/geo-location-analytics';
import { GeoLocationAnalyticsType } from '../../util/geo-location-analytics-type.enum';
declare var swal, $: any;

@Component({
  selector: 'app-preview-landing-page',
  templateUrl: './preview-landing-page.component.html',
  styleUrls: ['./preview-landing-page.component.css'],
  providers: [HttpRequestLoader],

})
export class PreviewLandingPageComponent implements OnInit {
    currentUrl: string = "";
    @ViewChild('saveGeoLocationAnalyticsComponent') saveGeoLocationAnalyticsComponent: SaveGeoLocationAnalyticsComponent;
    constructor( public landingPageService: LandingPageService, public authenticationService: AuthenticationService, public referenceService: ReferenceService ) { }
    loading = false;
    ngOnInit() {
    }


    showPreview( landingPage: LandingPage ) {
        this.loading = true;
        this.currentUrl = this.referenceService.getCurrentRouteUrl();
        let landingPageDto = new LandingPageGetDto();
        landingPageDto.landingPageId = landingPage.id;
        landingPageDto.showPartnerCompanyLogo = landingPage.showPartnerCompanyLogo;
        landingPageDto.partnerId = landingPage.partnerId;
        landingPageDto.showYourPartnersLogo = landingPage.showYourPartnersLogo;
        landingPageDto.partnerLandingPage = landingPage.partnerLandingPage;
        landingPageDto.landingPageAlias = landingPage.alias;
        let htmlContent = "#landingPage-html-content";
        $( htmlContent ).empty();
        let title = "#landing-page-preview-title";
        $( title ).empty();
        $( "#landing-page-preview-modal" ).modal( 'show' );
        this.landingPageService.getHtmlContent( landingPageDto ).subscribe(
            ( response: any ) => {
                if ( response.statusCode == 200 ) {
                    $( title ).append( landingPage.name );
                    $( title ).prop( 'title', landingPage.name );
                    $( htmlContent ).append( response.message );
                    /*********Save Geo Location Analytics*****************/
                    let landingPageAnalytics = new GeoLocationAnalytics();
                    landingPageAnalytics.landingPageAlias = landingPage.alias;
                    if(landingPage.partnerLandingPage){
                        landingPageAnalytics.analyticsType = GeoLocationAnalyticsType.PARTNER_LANDING_PAGE;
                        landingPageAnalytics.analyticsTypeString = 'PARTNER_LANDING_PAGE';
                        landingPageAnalytics.partnerLandingPageAlias = landingPage.alias;
                        this.saveGeoLocationAnalyticsComponent.getLocationDetails(landingPageAnalytics);
                    }
                    this.loading = false;
                } else {
                    swal( "Please Contact Admin!", "No Page Found", "error" );
                    $( "#landing-page-preview-modal" ).modal( 'hide' );
                }
            },
            ( error: any ) => {
                swal( "Please Contact Admin!", "Unable to load  page", "error" ); this.loading = false;
                $( "#landing-page-preview-modal" ).modal( 'hide' );
            } );
    }

}

import { Component, OnInit } from '@angular/core';
import { VanityURLService } from 'app/vanity-url/services/vanity.url.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DashboardButton } from 'app/vanity-url/models/dashboard.button';

declare var $, slick: any;

@Component({
  selector: 'app-dashboard-buttons-carousel',
  templateUrl: './dashboard-buttons-carousel.component.html',
  styleUrls: ['./dashboard-buttons-carousel.component.css']
})
export class DashboardButtonsCarouselComponent implements OnInit {

  dashboardButtonList: Array<DashboardButton> = new Array<DashboardButton>();
  sliderImages = [
    "https://www.maggiesadler.com/wp-content/uploads/2015/10/10004088_1491055334449687_1187165020_n.jpg",
    "https://www.maggiesadler.com/wp-content/uploads/2015/10/1515054_1379051609022475_1394148610_n.jpg",
    "https://www.maggiesadler.com/wp-content/uploads/2015/10/10004088_1491055334449687_1187165020_n.jpg",
    "https://www.maggiesadler.com/wp-content/uploads/2015/10/11189836_754178218029431_2102772742_n.jpg",
    "https://www.maggiesadler.com/wp-content/uploads/2015/10/10004088_1491055334449687_1187165020_n.jpg",
    "https://www.maggiesadler.com/wp-content/uploads/2015/10/10919749_326992714172441_299394464_n.jpg"
  ]

  constructor(private vanityURLService: VanityURLService,private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if(this.authenticationService.vanityURLEnabled){
      this.vanityURLService.getDashboardButtonsForCarousel(this.authenticationService.companyProfileName).subscribe(result =>{
        const data = result.data;
        if (result.statusCode === 200) {
          this.dashboardButtonList = data.dbButtons;         
        }        
      });
    }
    
  }

  ngAfterViewInit(){
    $(".slider").slick({
     dots: true,
     infinite: true,
     speed: 1500,
     fade: true,
     cssEase: 'linear',
     autoplay:true,
     autoplaySpeed:1500,
     arrows:true,
     prevArrow:'<button type="button" class="slick-prev"></button>',
     nextArrow:'<button type="button" class="slick-next"></button>',
    });
  }

  afterChange(e) {
    console.log('afterChange');
  }
}

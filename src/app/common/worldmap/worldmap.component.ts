import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
declare var Highcharts: any;

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})
export class WorldmapComponent implements OnInit {
  @Input() worldMapData: any;
  @Output() notifyParent: EventEmitter<any>;
  @Input() partnerModuleName = "";
  worldmapMessage: string;
  titleName = 'Views';

  constructor(public router:Router) {
    this.notifyParent = new EventEmitter<any>();
  }
  renderWorldMap(data: any, message) {
    const self = this;
    Highcharts.mapChart('world-map', {
      chart: {
        map: 'custom/world'
      },
      exporting: { enabled: false },
      title: {
        text: message,
        style: {
          color: '#696666',
          fontWeight: 'normal',
          fontSize: '14px'
        }
      },

      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: false,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      colorAxis: {
        min: 0
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          events: {
            click: function (e) {
              console.log(e);
              self.clickWorldMapReports(e.point['hc-key']);
            }
          }
        }
      },
      series: [{
        data: data,
        name: self.titleName,
        states: {
          hover: {
            color: '#BADA55'
          }
        },
        dataLabels: {
          enabled: false,
          format: '{point.name}'
        }
      }]
    });

  }
  clickWorldMapReports(countryCode: any) {
    this.notifyParent.emit(countryCode);
  }

  ngOnInit() {
    if(this.router.url.includes('home/partners/analytics')){
     this.worldmapMessage = 'Check out where your '+this.partnerModuleName+' are located';
     this.titleName = this.partnerModuleName;
    } else if(this.router.url.includes('home/content/videos')){
      this.worldmapMessage = 'Check out where your videos are being watched';
    }else if(this.router.url.includes('home/pages')){
        this.worldmapMessage = 'Check out where your pages are viewed';
        this.titleName = 'Viewers';
    }
    else {
      this.worldmapMessage = 'Check out where your videos are being watched';
    }
    this.renderWorldMap(this.worldMapData,this.worldmapMessage);
    console.log(this.worldMapData);
  }

}

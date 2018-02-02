import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var Highcharts: any;

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.css']
})
export class WorldmapComponent implements OnInit {
  @Input() worldMapData: any;
  @Output() notifyParent: EventEmitter<any>;
  constructor() { 
    this.notifyParent = new EventEmitter<any>();
  }
  renderWorldMap(data: any) {
    const self = this;
    Highcharts.mapChart('world-map', {
      chart: {
        map: 'custom/world'
      },
      exporting: { enabled: false },
      title: {
        text: 'The people who have watched the video',
        style: {
          color: '#696666',
          fontWeight: 'normal',
          fontSize: '14px'
        }
      },

      mapNavigation: {
        enabled: true,
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
        name: 'Views',
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
    this.renderWorldMap(this.worldMapData);
    console.log(this.worldMapData);
  }

}

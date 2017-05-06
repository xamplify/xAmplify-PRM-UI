import { Component, OnInit } from '@angular/core';

declare var Metronic, Layout, Demo, Index, QuickSidebar, Tasks: any;

@Component( {
    selector: 'app-views-report',
    templateUrl: './views-report.component.html',
    styleUrls: ['./views-report.component.css']
})
export class ViewsReportComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        try {
            Metronic.init();
            Layout.init();
            Demo.init();
            QuickSidebar.init();
            Index.init();
            Index.initDashboardDaterange();
            Index.initJQVMAP();
            Index.initCalendar();
            Index.initCharts();
            Index.initChat();
            Index.initMiniCharts();
            Tasks.initDashboardWidget();
        }
        catch ( err ) {}
    }

}

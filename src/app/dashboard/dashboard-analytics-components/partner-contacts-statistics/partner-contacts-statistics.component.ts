import { Component, OnInit,Input } from '@angular/core';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { Router } from '@angular/router';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { UtilService } from 'app/core/services/util.service';
import { Properties } from 'app/common/models/properties';
import {AuthenticationService} from 'app/core/services/authentication.service';
declare var Highcharts: any;

@Component({
	selector: 'app-partner-contacts-statistics',
	templateUrl: './partner-contacts-statistics.component.html',
	styleUrls: ['./partner-contacts-statistics.component.css'],
	providers: [HttpRequestLoader, Properties]
})
export class PartnerContactsStatisticsComponent implements OnInit {
	treeMapData: any;
	loading = false;
	isFullscreenToggle = false;
	treeMapLoader: HttpRequestLoader = new HttpRequestLoader();
	partnerContactsAnalyticsCount: any;
	partnerContactsAnalyticsCountLoader = false;
	partnerContactsAnalyticsCountStatusCode = 200;
	@Input()applyFilter = false;
	constructor(public authenticationService:AuthenticationService,public properties: Properties, public dashboardService: DashboardService, public xtremandLogger: XtremandLogger, public router: Router, public referenceService: ReferenceService, public utilService: UtilService) {
	}
	ngOnInit() {
		this.getPartnerContactsCount();
		this.getContactsStatistics();
	}

	getPartnerContactsCount() {
		this.partnerContactsAnalyticsCountLoader = true;
		this.dashboardService.getPartnerContactsCount(this.applyFilter).
			subscribe(
				data => {
					this.partnerContactsAnalyticsCount = data;
					this.partnerContactsAnalyticsCountLoader = false;
					this.partnerContactsAnalyticsCountStatusCode = 200;
				}, _error => {
					this.partnerContactsAnalyticsCountLoader = false;
					this.partnerContactsAnalyticsCountStatusCode = 0;
				}
			);
	}

	getContactsStatistics() {
		this.referenceService.loading(this.treeMapLoader, true);
		this.dashboardService.getContactsStatistics(this.applyFilter).
			subscribe((response) => {
				this.treeMapData = response;
				this.showTreeMap(this.treeMapData, "minimized-contacts-treemap")
			}, (error: any) => {
				this.xtremandLogger.error(error);
			});

	}

	showTreeMap(treeMapData, treeMapId) {
		this.referenceService.loading(this.treeMapLoader, true);
		const self = this;
		if (true) {
			const data = treeMapData;
			Highcharts.chart(treeMapId, {
				colorAxis: {
					//minColor: '#FFFFFF',
					backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
					maxColor: Highcharts.getOptions().colors[0]
				},
				credits: {
					enabled: false
				},
				exporting: { enabled: false },
				tooltip: {
					formatter: function() {
						return 'Company Name: <b>' + this.point.name + '</b><br>Contacts: <b>' + this.point.value + '</b>';
					}
				},
				plotOptions: {
					series: {
						dataLabels: {
							enabled: true,
							style: {
								fontWeight: 'normal',
								fontSize: '13px',
								color: 'block',
							}
						},
						events: {
							click: function(event) {

							}
						}
					}
				},
				series: [{
					type: 'treemap',
					layoutAlgorithm: 'squarified',
					showInLegend: false,
					data: data
				}],
				title: {
					text: ' '
				},
				legend: {
					enabled: false
				}
			}
			);
			self.referenceService.loading(this.treeMapLoader, false);
		}
	}

}

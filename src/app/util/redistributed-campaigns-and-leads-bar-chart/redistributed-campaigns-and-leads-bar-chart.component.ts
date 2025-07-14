import { Component, OnInit, Input } from '@angular/core';
import { ParterService } from 'app/partners/services/parter.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PartnerJourneyRequest } from '../../partners/models/partner-journey-request';
import { TeamMemberAnalyticsRequest } from 'app/team/models/team-member-analytics-request';
declare var Highcharts, $: any;

@Component({
    selector: 'app-redistributed-campaigns-and-leads-bar-chart',
    templateUrl: './redistributed-campaigns-and-leads-bar-chart.component.html',
    styleUrls: ['./redistributed-campaigns-and-leads-bar-chart.component.css'],
    providers: [Properties]
})
export class RedistributedCampaignsAndLeadsBarChartComponent implements OnInit {
    chartLoader = false;
    statusCode = 200;
    @Input() chartId: any;
    @Input() applyTeamMemberFilter: boolean;

    //XNFR-316
    @Input() partnerCompanyId: any;
    @Input() teamMemberId: any;
    @Input() isTeamMemberAnalytics: boolean = false;
    @Input() selectedVendorCompanyIds: any[] = [];
    @Input() selectedTeamMemberIds: any[] = [];
    @Input() vanityUrlFilter: boolean = false;
    @Input() vendorCompanyProfileName: string = '';
    @Input() fromDateFilter: string = '';
    @Input() toDateFilter: string = '';
    @Input() fromActivePartnersDiv: boolean = false;
    @Input() fromDeactivatedPartnersDiv: boolean = false;
    @Input() fromAllPartnersDiv: boolean = false;


    hasLeadsAndDealsAccess = false;
    headerText = "";
    filterValue = 'r';
    hideLeadsAndDealsChart = false;
    partnershipStatus: string;
    constructor(public authenticationService: AuthenticationService, public partnerService: ParterService, public xtremandLogger: XtremandLogger, public properties: Properties) { }
    ngOnInit() {
    }

    ngOnChanges() {
    if(this.fromActivePartnersDiv){
    this.partnershipStatus = 'approved';
    } else if (this.fromDeactivatedPartnersDiv) {
    this.partnershipStatus = 'deactivated';
    } else if (this.fromAllPartnersDiv) {
    this.partnershipStatus = 'approved,deactivated';
    }
        this.refreshChart();
    }
    refreshChart() {
        this.chartLoader = true;
        if (this.chartId != 'top10LeadsAndDealsBarChart') {
            this.filterValue = 'r';
        } else if (this.chartId == 'top10LeadsAndDealsBarChart') {
            this.filterValue = 'l';
        }
        this.getModuleDetails();
    }
    getModuleDetails() {
        this.authenticationService.getModuleAccessByLoggedInUserId().subscribe(
            response => {
                this.hasLeadsAndDealsAccess = response.enableLeads;
                if (this.chartId == 'redistributeCampaignsAndLeadsCountBarChart' || this.chartId == 'allRedistributeCampaignsAndLeadsCountBarChart') {
                    this.headerText = this.hasLeadsAndDealsAccess || this.isTeamMemberAnalytics ? 'Redistributed Campaigns & Leads' : 'Redistributed Campaigns';
                } else if (this.chartId == 'redistributeCampaignsAndLeadsCountBarChartQuarterly') {
                    this.headerText = this.hasLeadsAndDealsAccess ? 'Redistributed Campaigns & Previous Quarter Leads' : 'Redistributed Campaigns For Previous Quarter';
                }
                //XNFR-316
                else if (this.chartId == 'top10LeadsAndDealsBarChart' || this.chartId == 'partnerJourneyLeadsAndDealsBarChart' || this.chartId == 'allLeadsAndDealsBarChart'
                    || this.chartId === 'partnerJourneyredistributeCampaignsAndLeadsBarChart') {
                    if (this.hasLeadsAndDealsAccess || this.isTeamMemberAnalytics) {
                        this.hideLeadsAndDealsChart = false;
                    } else {
                        this.hideLeadsAndDealsChart = true;
                    }
                    if (!(this.chartId === 'partnerJourneyredistributeCampaignsAndLeadsBarChart')) {
                        this.headerText = "Leads & Deals";
                    } else {
                        this.headerText = "Campaigns to Leads Conversion";
                    }
                }
            }, error => {
                this.setErrorResponse(error);
            }, () => {
                //XNFR-316
                if (this.chartId == 'top10LeadsAndDealsBarChart' || this.chartId == 'partnerJourneyLeadsAndDealsBarChart' || this.chartId == 'allLeadsAndDealsBarChart'
                    || this.chartId == 'partnerJourneyredistributeCampaignsAndLeadsBarChart') {
                    if (this.hasLeadsAndDealsAccess || this.isTeamMemberAnalytics) {
                        this.getDataForBarChart();
                    }
                } else {
                    this.getDataForBarChart();
                }

            }
        );
    }

    getDataForBarChart() {
        if (this.chartId == 'partnerJourneyLeadsAndDealsBarChart' || this.chartId == 'partnerJourneyredistributeCampaignsAndLeadsBarChart') {
            let partnerJourneyRequest = new PartnerJourneyRequest();
            partnerJourneyRequest.loggedInUserId = this.authenticationService.getUserId();
            partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
            partnerJourneyRequest.teamMemberUserId = this.teamMemberId;
            partnerJourneyRequest.fromDateFilterInString = this.fromDateFilter
            partnerJourneyRequest.toDateFilterInString = this.toDateFilter;
            partnerJourneyRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            partnerJourneyRequest.partnershipStatus = this.partnershipStatus;
            this.partnerService.getPartnerJourneyLeadDealCounts(this.chartId, partnerJourneyRequest).subscribe(
                response => {
                    this.processResponse(response);
                }, error => {
                    this.setErrorResponse(error);
                }
            );

        } else {
            if (!this.isTeamMemberAnalytics) {
                let partnerJourneyRequest = new PartnerJourneyRequest();
                partnerJourneyRequest.loggedInUserId = this.authenticationService.getUserId();
                partnerJourneyRequest.partnerCompanyId = this.partnerCompanyId;
                partnerJourneyRequest.teamMemberUserId = this.teamMemberId;
                partnerJourneyRequest.fromDateFilterInString = this.fromDateFilter
                partnerJourneyRequest.toDateFilterInString = this.toDateFilter;
                partnerJourneyRequest.partnerTeamMemberGroupFilter = this.applyTeamMemberFilter;
                partnerJourneyRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                partnerJourneyRequest.filterType = this.filterValue;
                partnerJourneyRequest.partnershipStatus = this.partnershipStatus;
                this.partnerService.getRedistributedCampaignsAndLeadsCountOrLeadsAndDeals(partnerJourneyRequest,this.chartId).subscribe(
                    response => {
                        this.processResponse(response);
                    }, error => {
                        this.setErrorResponse(error);
                    }
                );
            } else {
                let teamMemberAnalyticsRequest = new TeamMemberAnalyticsRequest();
                teamMemberAnalyticsRequest.loggedInUserId = this.partnerCompanyId;
                teamMemberAnalyticsRequest.selectedVendorCompanyIds = this.selectedVendorCompanyIds;
                teamMemberAnalyticsRequest.selectedTeamMemberIds = this.selectedTeamMemberIds;
                teamMemberAnalyticsRequest.vanityUrlFilter = this.vanityUrlFilter;
                teamMemberAnalyticsRequest.vendorCompanyProfileName = this.vendorCompanyProfileName;
                teamMemberAnalyticsRequest.fromDateFilterInString = this.fromDateFilter
                teamMemberAnalyticsRequest.toDateFilterInString = this.toDateFilter;
                teamMemberAnalyticsRequest.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                this.partnerService.getRedistributedCampaignsAndLeadsCountOrLeadsAndDealsForTeamMember(teamMemberAnalyticsRequest, this.chartId, this.filterValue).subscribe(
                    response => {
                        this.processResponse(response);
                    }, error => {
                        this.setErrorResponse(error);
                    }
                );
            }
        }
    }

    processResponse(response: any) {
        let data = response.data;
        this.statusCode = response.statusCode;
        if (this.statusCode == 200) {
            let xAxis = data.xaxis;
            let yAxis1 = data.yaxis1;
            let yAxis2 = data.yaxis2;
            this.renderChart(xAxis, yAxis1, yAxis2);
        } else {
            this.chartLoader = false;
            $('#' + this.chartId).html('');
        }
    }

    setErrorResponse(error: any) {
        this.chartLoader = false;
        this.statusCode = 500;
        this.xtremandLogger.error(error);
    }
    renderChart(xAxis: any, yAxis1: any, yAxis2: any) {
        let chartId = this.chartId;
        let primayAxisColor = "";
        let secondaryAxisColor = "";
        let primaryYAxisText = "";
        let secondaryYAxisText = "";
        if (chartId == "redistributeCampaignsAndLeadsCountBarChart" || chartId == "allRedistributeCampaignsAndLeadsCountBarChart") {
            primayAxisColor = Highcharts.getOptions().colors[0];
            secondaryAxisColor = Highcharts.getOptions().colors[1];
            primaryYAxisText = "Leads";
            secondaryYAxisText = "Redistributed Campaigns";
        } else if (chartId == "redistributeCampaignsAndLeadsCountBarChartQuarterly") {
            primayAxisColor = Highcharts.getOptions().colors[7];
            secondaryAxisColor = Highcharts.getOptions().colors[9];
            primaryYAxisText = "Leads";
            secondaryYAxisText = "Redistributed Campaigns";
        }
        //XNFR-316
        else if (chartId == "top10LeadsAndDealsBarChart" || chartId == "partnerJourneyLeadsAndDealsBarChart" || chartId == "allLeadsAndDealsBarChart") {
            primayAxisColor = Highcharts.getOptions().colors[0];
            secondaryAxisColor = Highcharts.getOptions().colors[2];
            primaryYAxisText = "Leads";
            secondaryYAxisText = "Deals";
        } else if (chartId == "partnerJourneyredistributeCampaignsAndLeadsBarChart") {
            primayAxisColor = Highcharts.getOptions().colors[0];
            secondaryAxisColor = Highcharts.getOptions().colors[2];
            primaryYAxisText = "Contacts";
            secondaryYAxisText = "Leads";
        } else {
            primayAxisColor = Highcharts.getOptions().colors[0];
            secondaryAxisColor = Highcharts.getOptions().colors[2];
            primaryYAxisText = "Leads";
            secondaryYAxisText = "Deals";
        }
        let series = [];
        if (this.hasLeadsAndDealsAccess || this.isTeamMemberAnalytics) {
            series.push(this.setRedistributedCampaignsSeries(yAxis1, primayAxisColor, secondaryYAxisText));
            series.push(this.setLeadsSeries(yAxis2, secondaryAxisColor, primaryYAxisText));
        } else {
            series.push(this.setRedistributedCampaignsSeries(yAxis1, primayAxisColor, secondaryYAxisText));
        }
        Highcharts.chart(chartId, {
            credits: {
                enabled: false
            },
            chart: {
                zoomType: 'xy',
                backgroundColor: this.authenticationService.isDarkForCharts ? "#2b3c46" : "#fff",
            },
            title: {
                text: ''
            },
            xAxis: [{
                categories: xAxis,
                crosshair: true,
                labels: {
                    style: {
                        color: this.authenticationService.isDarkForCharts ? "#fff" : "#666666"
                    }
                }
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}',
                    style: {
                        color: this.authenticationService.isDarkForCharts ? "#fff" : Highcharts.getOptions().colors[1]
                    }
                },
                allowDecimals: false,
                minrange: 1,
                title: {
                    text: primaryYAxisText,
                    style: {
                        color: this.authenticationService.isDarkForCharts ? "#fff" : secondaryAxisColor
                    }
                }
            },
            { // Secondary yAxis
                title: {
                    text: secondaryYAxisText,
                    style: {
                        color: primayAxisColor
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: primayAxisColor
                    }
                },
                allowDecimals: false,
                minrange: 1,
                opposite: true
            }],
            tooltip: {
                shared: true,
                backgroundColor: 'black',
                style: {
                    color: '#fff'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor ||
                    'rgba(255,255,255,0.25)'
            },
            series: series
        });
        this.chartLoader = false;
    }

    setRedistributedCampaignsSeries(yAxis1: any, primaryAxisColor: any, name: string) {
        let data: any;
        data = {
            name: name,
            type: 'column',
            yAxis: 1,
            data: yAxis1,
            color: primaryAxisColor
        }
        return data;
    }

    setLeadsSeries(yAxis2: any, secondaryAxisColor: any, name: string) {
        let data: any;
        data = {
            name: name,
            data: yAxis2,
            color: secondaryAxisColor
        }
        return data;
    }

    filterRedistributeCampaignsAndLeadsCountBarChart() {
        this.filterChart('redistributeCampaignsAndLeadsCountBarChartDropDown');
    }

    filterRedistributeCampaignsAndLeadsCountBarChartQuarterly() {
        this.filterChart('redistributeCampaignsAndLeadsCountBarChartQuarterlyDropDown');

    }

    filterTop10LeadsAndDealsBarChartDropDown() {
        this.filterChart('top10LeadsAndDealsBarChartDropDown');
    }
    filterAllLeadsAndDealsBarChartDropDown() {
        this.filterChart('allLeadsAndDealsBarChartDropDown')
    }

    filterChart(dropDownId: string) {
        this.chartLoader = true;
        this.filterValue = $('#' + dropDownId + ' option:selected').val();
        this.getDataForBarChart();
    }


}
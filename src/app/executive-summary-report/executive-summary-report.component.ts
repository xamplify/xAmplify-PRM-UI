import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ReportData } from 'app/common/models/oliver-report-dto';

// Declare Chart.js globally if it's included via script tag or angular-cli.json
declare var Chart: any;

// Data Interfaces (simplified and embedded for self-containment)


@Component({
  selector: 'app-executive-summary-report',
  templateUrl: './executive-summary-report.component.html',
  styleUrls: ['./executive-summary-report.component.css']
})
export class ExecutiveSummaryReportComponent implements OnInit, AfterViewInit {

  @ViewChild('leadPipelineChartCanvas') leadPipelineChartRef: ElementRef;
  @ViewChild('dealAmountBarChartCanvas') dealAmountBarChartRef: ElementRef;
  @ViewChild('campaignTypePieChartCanvas') campaignTypePieChartRef: ElementRef;
  
  @Input() reportData: ReportData;
  
  public currentYear: number = new Date().getFullYear();

  private chartColors: string[] = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', 
    '#6f42c1', '#fd7e14', '#20c997', '#6610f2', '#e83e8c'
  ]; // A distinct color palette


  constructor() { }

  ngOnInit(): void {
    // Data is already initialized
  }

  ngAfterViewInit(): void {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded. Please ensure it is included globally in your Angular project (e.g., in angular-cli.json scripts or index.html).');
      return;
    }
    // A small delay can sometimes help if elements are not immediately ready, though usually not needed with AfterViewInit
    setTimeout(() => {
        this.createLeadPipelineChart();
        this.createDealAmountBarChart();
        this.createCampaignTypePieChart();
    }, 0);
  }

  formatDisplayCurrency(amount: number): string {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  formatDisplayDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { 
        return dateString; 
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString; 
    }
  }

  private createLeadPipelineChart(): void {
    if (!this.leadPipelineChartRef || !this.leadPipelineChartRef.nativeElement || !this.reportData || !this.reportData.leads.lead_records.length) {
        console.warn('Lead pipeline chart: Not enough data or canvas not found.');
        return;
    }

    const stageCounts: { [key: string]: number } = {};
    this.reportData.leads.lead_records.forEach(lead => {
      stageCounts[lead.pipeline_stage] = (stageCounts[lead.pipeline_stage] || 0) + 1;
    });

    const labels = Object.keys(stageCounts);
    const dataValues = Object.keys(stageCounts).map(key => stageCounts[key]);


    new Chart(this.leadPipelineChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: labels.map((_, i) => this.chartColors[i % this.chartColors.length]),
          hoverOffset: 8,
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { 
            position: 'bottom', 
            labels: {
                padding: 15,
                boxWidth: 12,
                fontFamily: 'Arial', 
            }
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, dt: any) => {
                    const dataset = dt.datasets[tooltipItem.datasetIndex];
                    const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                    const currentValue = dataset.data[tooltipItem.index];
                    const percentage = Math.floor(((currentValue / total) * 100) + 0.5);         
                    return `${dt.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
                }
            }
        },
        title: {
            display: false // Using custom title in HTML
        }
      }
    });
  }

  private createDealAmountBarChart(): void {
    if (!this.dealAmountBarChartRef || !this.dealAmountBarChartRef.nativeElement || !this.reportData || !this.reportData.deals.deal_records.length) {
        console.warn('Deal amount chart: Not enough data or canvas not found.');
        return;
    }

    const dealData = this.reportData.deals.deal_records
        .filter(deal => deal.amount > 0) // Optionally filter out zero-amount deals for better visualization
        .map(deal => ({
      name: deal.title.length > 15 ? `${deal.title.substring(0,15)}...` : deal.title,
      amount: deal.amount,
    }));
    
    if (dealData.length === 0) {
        console.warn('Deal amount chart: No deals with amount > 0 found to display.');
        if(this.dealAmountBarChartRef.nativeElement.getContext('2d')) {
            const ctx = this.dealAmountBarChartRef.nativeElement.getContext('2d');
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.fillText("No deal amounts to display.", this.dealAmountBarChartRef.nativeElement.width / 2, this.dealAmountBarChartRef.nativeElement.height / 2);
        }
        return;
    }


    const labels = dealData.map(d => d.name);
    const dataValues = dealData.map(d => d.amount);
    
    const formatCurrencyForAxis = (value: number) => {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
        return value.toString();
    };

    new Chart(this.dealAmountBarChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Deal Amount (USD)',
          data: dataValues,
          backgroundColor: this.chartColors[0],
          borderColor: this.chartColors[0],
          borderWidth: 1,
          // hoverBackgroundColor: Chart.helpers.color(this.chartColors[0]).alpha(0.7).rgbString()
          hoverBackgroundColor: 'rgba(0, 123, 255, 0.7)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false }, // Label is in dataset, legend can be off
        scales: {
          xAxes: [{
            ticks: { 
                autoSkip: false,
                maxRotation: 45,
                minRotation: 30, // Adjusted for readability
                fontFamily: 'Arial',
                fontSize: 10,
            },
            gridLines: { display: false }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontFamily: 'Arial',
              fontSize: 10,
              callback: (value: number) => formatCurrencyForAxis(value)
            },
            gridLines: { 
                color: "rgba(200, 200, 200, 0.3)",
            }
          }]
        },
        tooltips: {
            callbacks: {
                label: (tooltipItem: any, dt: any) => {
                    const amount = dt.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return `Amount: ${this.formatDisplayCurrency(Number(amount))}`;
                }
            }
        },
        title: {
            display: false
        }
      }
    });
  }

  private createCampaignTypePieChart(): void {
    if (!this.campaignTypePieChartRef || !this.campaignTypePieChartRef.nativeElement || !this.reportData || !this.reportData.campaigns.campaign_records.length) {
        console.warn('Campaign type chart: Not enough data or canvas not found.');
        return;
    }

    const typeCounts: { [key: string]: number } = {};
    this.reportData.campaigns.campaign_records.forEach(campaign => {
      typeCounts[campaign.campaign_type] = (typeCounts[campaign.campaign_type] || 0) + 1;
    });

    const labels = Object.keys(typeCounts);
    const dataValues = Object.keys(typeCounts).map(key => typeCounts[key]);


    new Chart(this.campaignTypePieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: labels.map((_, i) => this.chartColors[(i + 2) % this.chartColors.length]), // Offset colors
          hoverOffset: 8,
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { 
            position: 'bottom',
            labels: {
                padding: 15,
                boxWidth: 12,
                fontFamily: 'Arial', 
            }
        },
         tooltips: {
            callbacks: {
                label: (tooltipItem: any, dt: any) => {
                    const dataset = dt.datasets[tooltipItem.datasetIndex];
                    const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
                    const currentValue = dataset.data[tooltipItem.index];
                    const percentage = Math.floor(((currentValue / total) * 100) + 0.5);         
                    return `${dt.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
                }
            }
        },
        title: {
            display: false
        }
      }
    });
  }
  // downloadReport(): void {
  //   const element = document.getElementById('reportContent');

  //   html2canvas(element).then((canvas: any) => {
  //     const imgData = canvas.toDataURL('image/png');

  //     const pdf = new jsPDF('p', 'mm', 'a4');
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     pdf.save('report.pdf');
  //   });
  // }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// Declare Chart.js globally if it's included via script tag or angular-cli.json
declare var Chart: any;

// Data Interfaces (simplified and embedded for self-containment)
interface ContactDetails {
  name: string;
  email: string;
  phone_numbers: string[];
  company: string;
  address: string;
  additional_info: string;
}

interface LeadRecord {
  id: string;
  first_name?: string;
  last_name: string;
  company: string;
  email: string;
  phone?: string;
  address?: string;
  campaign: string;
  created_time?: string;
  pipeline_stage: string;
}

interface Leads {
  summary: string;
  lead_records: LeadRecord[];
}

interface DealRecord {
  title: string;
  amount: number;
  close_date: string;
  associated_lead_id?: string;
  campaign: string;
  created_by?: string;
  pipeline: string;
  stage: string;
}

interface Deals {
  summary: string;
  deal_records: DealRecord[];
}

interface CampaignRecord {
  name: string;
  campaign_type: string;
  launch_time: string;
  associated_with: string;
  details: string;
}

interface Campaigns {
  summary: string;
  campaign_records: CampaignRecord[];
}

interface ReportData {
  contact_details: ContactDetails;
  leads: Leads;
  deals: Deals;
  campaigns: Campaigns;
  key_takeaways: string[];
  strategic_recommendations: string[];
}

@Component({
  selector: 'app-executive-summary-report',
  templateUrl: './executive-summary-report.component.html',
  styleUrls: ['./executive-summary-report.component.css']
})
export class ExecutiveSummaryReportComponent implements OnInit, AfterViewInit {

  @ViewChild('leadPipelineChartCanvas') leadPipelineChartRef: ElementRef;
  @ViewChild('dealAmountBarChartCanvas') dealAmountBarChartRef: ElementRef;
  @ViewChild('campaignTypePieChartCanvas') campaignTypePieChartRef: ElementRef;

  public reportData: ReportData = {
    "contact_details": {
      "name": "Gayatri Alla",
      "email": "agayatri@stratapps.com",
      "phone_numbers": ["09490925989", "+919490920589", "8967645645"],
      "company": "Irtayag Solutions",
      "address": "2-156, Chagallu, Andhra Pradesh, India (multiple address fragments observed)",
      "additional_info": "Alternate emails include gayatrialla11@gmail.com and secondary contact via LG/XAmplify details"
    },
    "leads": {
      "summary": "Multiple lead records were created in the Default Lead Salesforce Pipeline with the stage “Open - Not Contacted”.",
      "lead_records": [
        {"id": "5200", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "campaign": "eml-to-org-co-20", "created_time": "2020-07-20 11:44:30.193", "pipeline_stage": "Open - Not Contacted"},
        {"id": "4297", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "phone": "09490925989", "address": "2-156, chagallu, AP, India", "campaign": "eml-cam-auto-chck", "created_time": "2020-08-27 15:04:00.48", "pipeline_stage": "Open - Not Contacted"},
        {"id": "2941", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "phone": "09490925989", "address": "2-156, chagallu", "campaign": "eml-298-chck-amt", "created_time": "2020-08-27 15:31:06.841", "pipeline_stage": "Open - Not Contacted"},
        {"id": "5427", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "campaign": "eml-to-org-co-20", "created_time": "2020-07-20 11:34:18.82", "pipeline_stage": "Open - Not Contacted"},
        {"id": "5439", "first_name": "gayatri", "last_name": "alla", "company": "stratapps", "email": "gayatrialla11@gmail.com", "phone": "+919490920589", "campaign": "500032", "address": "street no 3, gachibowli, hyderabad, telegana, India", "pipeline_stage": "Open - Not Contacted"},
        {"id": "5441", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "campaign": "vd-salesforce check_copy-TO", "created_time": "2021-03-10 10:26:56.908", "pipeline_stage": "Open - Not Contacted"},
        {"id": "5444", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "phone": "8967645645", "campaign": "event-to-private-org", "address": "rtr, re, aes, Bahamas, PostalCode: 554234", "pipeline_stage": "Open - Not Contacted"},
        {"id": "2276", "first_name": "", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "campaign": "check-again_copy", "pipeline_stage": "Open - Not Contacted"},
        {"id": "4640", "first_name": "g", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "phone": "985675634", "campaign": "vde-org-to-co-20_copy-thr", "address": "add, h, ap, Barbados, PostalCode: 534342", "pipeline_stage": "Open - Not Contacted"},
        {"id": "2391", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "phone": "9868799898", "campaign": "vde-org-to-co-20", "address": "leaddres, lhyd, lap, Afghanistan, PostalCode: 534342", "pipeline_stage": "Open - Not Contacted"},
        {"id": "5195", "first_name": "Gayatri", "last_name": "Alla", "company": "irtayag solutions", "email": "agayatri@stratapps.com", "campaign": "eml-to-org-co-20", "pipeline_stage": "Open - Not Contacted", "created_time": "2020-07-20 11:29:11.789"}
      ]
    },
    "deals": {
      "summary": "Several deals have been captured in the Standard Deal Pipeline (Zoho) with varying amounts, reflecting early qualification stage opportunities.",
      "deal_records": [
        {"title": "eml-298-chck-amt", "amount": 0.0, "close_date": "2020-08-29", "associated_lead_id": "2941", "campaign": "eml-298-chck-amt", "created_by": "w ", "pipeline": "Standard Deal Pipeline (Zoho)", "stage": "Qualification"},
        {"title": "eml-cam-auto-chck_copy", "amount": 0.0, "close_date": "2020-08-28", "associated_lead_id": "5439", "campaign": "eml-cam-auto-chck_copy", "pipeline": "Standard Deal Pipeline (Zoho)", "stage": "Qualification"},
        {"title": "t1", "amount": 986752.43, "close_date": "2020-07-30", "associated_lead_id": "3818", "campaign": "eml-trigger-org", "created_by": "gayatri LastName", "pipeline": "Standard Deal Pipeline (Zoho)", "stage": "Qualification"},
        {"title": "t424", "amount": 120.0, "close_date": "2020-08-27", "associated_lead_id": "4297", "campaign": "eml-cam-auto-chck", "pipeline": "Standard Deal Pipeline (Zoho)", "stage": "Qualification"},
        {"title": "t12", "amount": 97832.32, "close_date": "2020-07-30", "associated_lead_id": "4640", "campaign": "vde-org-to-co-20_copy-thr", "pipeline": "Standard Deal Pipeline (Zoho)", "stage": "Qualification"}
      ]
    },
    "campaigns": {
      "summary": "The contact is associated with a broad range of campaigns including regular, event, video, survey, and landing page types.",
      "campaign_records": [
        {"name": "eml-to-org-co-20", "campaign_type": "REGULAR", "launch_time": "2020-07-20", "associated_with": "Lead ID 5200, 5427, 5195", "details": "Focused on converting leads to organized opportunities."},
        {"name": "eml-cam-auto-chck", "campaign_type": "REGULAR", "launch_time": "2020-08-27", "associated_with": "Lead ID 4297", "details": "Structured for auto follow-up actions."},
        {"name": "vde-org-to-co-20", "campaign_type": "VIDEO", "launch_time": "2020-07-20", "associated_with": "Lead ID 2391", "details": "Video campaign aimed at demonstrating product value."},
        {"name": "event-to-private-org", "campaign_type": "EVENT", "launch_time": "2020-07-20", "associated_with": "Lead ID 5444", "details": "Event-based campaign for targeted engagement."},
        {"name": "500032", "campaign_type": "REGULAR", "launch_time": "2020-08-27", "associated_with": "Lead ID 5439", "details": "Campaign aimed at potential conversion via follow-up emails."},
        {"name": "vd-salesforce check_copy-TO", "campaign_type": "REGULAR", "launch_time": "2021-03-10", "associated_with": "Lead ID 5441", "details": "Campaign testing Salesforce integrations."},
        {"name": "to-vde-org&partner", "campaign_type": "REGULAR", "launch_time": "2021-02-16", "associated_with": "Lead ID 5956", "details": "Campaign to engage potential partners."},
        {"name": "check-again_copy", "campaign_type": "REGULAR", "launch_time": "2021-03-04", "associated_with": "Lead ID 2276", "details": "Re-engagement campaign for stalled leads."},
        {"name": "vde-org-to-co-20_copy-thr", "campaign_type": "REGULAR", "launch_time": "2020-07-20", "associated_with": "Lead ID 4640", "details": "Focused on leveraging video demonstration for deal closure."},
        {"name": "eml-cam-check-10/2022", "campaign_type": "REGULAR", "launch_time": "2022-01-10", "associated_with": "Deals record from 2022", "details": "Campaign from early 2022 aimed at conversion tracking"}
      ]
    },
    "key_takeaways": [
      "Gayatri Alla is an actively engaged contact with multichannel outreach spanning regular, event, video, survey, and landing page campaigns.",
      "All lead records are in the early 'Open - Not Contacted' stage, representing an opportunity for further engagement.",
      "The deal pipeline, although in the qualification stage, indicates significant revenue potential (e.g., deal 't1' at approximately USD 986K).",
      "Campaign initiatives are diverse and span a wide timeline, which suggests ongoing efforts to engage and convert the contact."
    ],
    "strategic_recommendations": [
      "Implement proactive follow-up measures to convert open leads into active opportunities.",
      "Utilize targeted multi-channel engagement strategies and consolidate campaign messaging for clarity.",
      "Prioritize deals with higher revenue potential by accelerating pipeline movement from qualification to closure.",
      "Re-assess campaign engagement metrics periodically to refine outreach and re-engagement strategies."
    ]
  };

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

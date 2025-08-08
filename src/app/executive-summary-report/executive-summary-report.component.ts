import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ExecutiveReport } from 'app/common/models/oliver-report-dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as Mustache from 'mustache';
import { ChatGptSettingsService } from 'app/dashboard/chat-gpt-settings.service';

declare var Chart: any;
@Component({
  selector: 'app-executive-summary-report',
  templateUrl: './executive-summary-report.component.html',
  styleUrls: ['./executive-summary-report.component.css']
})
export class ExecutiveSummaryReportComponent implements OnInit, AfterViewInit {

  // @ViewChild('leadPipelineChartCanvas') leadPipelineChartRef: ElementRef;
  // @ViewChild('dealAmountBarChartCanvas') dealAmountBarChartRef: ElementRef;
  // @ViewChild('campaignTypePieChartCanvas') campaignTypePieChartRef: ElementRef;
  @ViewChild('chartFrame') iframeRef: ElementRef;

  @Input() reportData: ExecutiveReport;
  @Input() reportType: any;
  @Input() activeTab: string;
  @Input() intent: string;
  @Input() isFromGroupOfPartners: boolean = false;

  public currentYear: number = new Date().getFullYear();

  safeUrl: SafeResourceUrl;

    theme: any = {};
    DEFAULT_THEME: { [key: string]: string } = {
        backgroundColor: '#f1f5f9',
        buttonColor: '#0060df',
        textColor: '#0f172a',
        headerColor: '#1e3a8a',
        lightHeaderColor: '#1e3a8a',
        darkHeaderColor: '#0f172a',
        footerColor: '#f0fdf4',
        footerColorTwo: '#f0f9ff',
        gradientFrom: '#1e3a8a',
        gradientTo: '#3b82f6',
        logoColor1: '#1e3a8a',
        logoColor2: '#3b82f6',
        logoColor3: '#60a5fa',
        footertextColor: '#334155',
        headertextColor: '#cbd5e1',
        headerHeadingTextColor:    '#FFFFFF',
        headerSubHeadingTextColor: '#FFFFFFBF'
    };

  private chartColors: string[] = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
    '#6f42c1', '#fd7e14', '#20c997', '#6610f2', '#e83e8c'
  ];

  iframeContent: any = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ report?.meta?.report_title }}</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
    <!-- Funnel module -->
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* ------------- ORIGINAL CSS — UNCHANGED ------------- */
    * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: {{theme.backgroundColor}}
        }

        .main-wrapper {
         width:100%
         margin: auto;
        }

        .header-card {
            background: linear-gradient(to bottom right,{{theme.darkHeaderColor}},{{theme.lightHeaderColor}});
            padding: 40px;
            color: white;
            margin-bottom: 30px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 30px;
        }

        .header-left h1 {
            font-size: 30px;
            font-weight: 800;
            margin-bottom: 8px;
        }

        .header-left h2 {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .header-left p {
            color: {{theme.headertextColor}};  /* #bfdbfe;  */
            font-size: 14px;
            margin-bottom: 4px;
        }

        .header-left span {
            font-size: 14px;
            color: {{theme.headertextColor}};  /*  #cbd5e1;  */
        }

        .header-left h1,
        .header-left h2 {
            color: {{theme.headertextColor}};
        }

        .header-right {
            text-align: right;
            font-size: 14px;
        }

        .header-right span {
            display: block;
            color: {{theme.headertextColor}};    /* #cbd5e1;  */
        }

        .header-right h3 {
            font-size: 22px;
            font-weight: 700;
            color:  {{theme.headertextColor}};    /* white; */
            margin-top: 2px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .owner-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .owner-summary:not(:has(li)) {
            display: none;
        }

        .summary-item {
            text-align: center;
        }

        .summary-item h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .summary-item p {
            font-size: 16px;
            color: {{theme.headertextColor}};       /* #cbd5e1;  */
            margin-bottom: 4px;
        }

        .summary-item span {
            font-size: 13px;
            color: {{theme.headertextColor}};      /* #94a3b8; */
        }

        .green {
            color: {{theme.headerHeadingTextColor}}            /* #34d399; */
        }

        .yellow {
            color: #facc15;
        }

        .blue {
            color: #60a5fa;
        }

        .white-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            margin-right: 30px;
            margin-left: 30px;
        }

        .white-card h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #0f172a;
        }

        .white-card p {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            text-align: left;
            padding: 14px 12px;
            vertical-align: top;
        }

        th {
            font-size: 14px;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
        }

        td {
            font-size: 14px;
            color: #0f172a;
            border-bottom: 1px solid #f1f5f9;
        }

        td b {
            font-weight: 600;
            color: #0f172a;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
            margin-right: 30px;
            margin-left: 30px;
        }

        .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .card:hover,
        .white-card:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .card h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .card p {
            font-size: 15px;
            color: rgb(71 85 105);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 10px;
        }

        .status-label {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
            color: #10b981;
        }

        .status-label::before {
            /* content: '↗'; */
            font-size: 15px;
            margin-right: 4px;
        }

        .card-value {
            font-size: 21px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .card-subtext {
            font-size: 13px;
            color: #64748b;
        }

        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-right: 30px;
            margin-left: 30px
        }

        .chart-img {
            width: 100%;
            border-radius: 8px;
            margin: 10px 0;
        }

        .bottom-metrics {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #374151;
            margin-top: 10px;
        }

        .bottom-metrics b {
            display: block;
            font-weight: 600;
        }

        /* --- Funnel Step Styles --- */
        .funnel-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .funnel-left {
            display: flex;
            align-items: flex-start;
            flex: 1;
            min-width: 0;
        }

        .funnel-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 6px;
            flex-shrink: 0;
        }

        .funnel-info {
            flex: 1;
        }

        .funnel-title {
            font-weight: 600;
            font-size: 14px;
            color: #1f2937;
            display: block;
        }

        .funnel-sub {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
            display: block;
        }

        .funnel-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            margin-top: 6px;
            position: relative;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            border-radius: 4px;
        }

        .status {
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 10px;
            white-space: nowrap;
            margin-left: auto; /* Push to the right */
            margin-top: 4px;
            flex-shrink: 0;
        }

        .status.complete {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status.progress {
            background-color: #dbeafe;
            color: #1d4ed8;
        }

        .status.pending {
            background-color: #f3f4f6;
            color: #6b7280;
        }

        .progress-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-weight: bold;
            font-size: 14px;
        }

        .progress-footer .blue {
            color: #3b82f6;
        }

        .progress-footer .green {
            color: #10b981;
        }

        .analysis-section {
            margin: 40px 0;
            padding: 30px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
   margin-right: 30px;
            margin-left: 30px
        }

        .analysis-section:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .analysis-section h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .analysis-section p {
            color: rgb(71 85 105);
        }

        .insights-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }

        .insight-card {
            padding: 20px;
            border-radius: 12px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .insight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            color: #1e293b;
        }

        .badge {
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 999px;
            font-weight: 600;
        }

        .badge.green {
            background: #d1fae5;
            color: #047857;
        }

        .badge.blue {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .badge.teal {
            background: #ccfbf1;
            color: #0f766e;
        }

        .badge.yellow {
            background: #fef3c7;
            color: #b45309;
        }

        .action-label {
            font-size: 12px;
            font-weight: bold;
            color: #6b7280;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .action {
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            background: rgba(0, 0, 0, 0.03);
            border-left: 4px solid #94a3b8;
            padding: 10px 12px;
            border-radius: 6px;
        }

        .action strong {
            display: block;
            margin-top: 4px;
            color: #0f172a;
            font-weight: 600;
        }

        .insight-card p {
            font-size: 14px;
            color: #334155;
            margin-bottom: 14px;
        }

        .insight-card.green {
            background: rgb(240 253 244);
            border: 1px solid rgb(187 247 208);
        }

        .insight-card.blue {
            background: rgb(239 246 255);
            border: 1px solid rgb(191 219 254);
        }

        .insight-card.teal {
            background: rgb(240 253 244);
            border: 1px solid rgb(187 247 208);
        }

        .insight-card.yellow {
            background: rgb(254 252 232);
            border: 1px solid rgb(254 240 138);
        }

        .next-steps-wrapper h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .next-steps-wrapper p {
            font-size: 15px;
            color: #64748b;
            margin-bottom: 24px;
        }

        .step-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            margin-bottom: 24px;
        }

        .step-card:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .step-top {
            display: flex;
            gap: 16px;
            align-items: flex-start;
        }

        .step-icon {
            background-color: #f1f5ff;
            color: #3b82f6;
            font-size: 22px;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .step-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }

        .step-title h3 {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }

        .priority-tag {
            font-size: 12px;
            font-weight: 500;
            background-color: #fee2e2;
            color: #b91c1c;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .insight-type-tag {
            font-size: 12px;
            font-weight: 500;
            background-color: #e8c5ee;
            color: #7967eb;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .step-description {
            font-size: 14px;
            color: #475569;
            line-height: 1.5;
        }

        .step-details {
            display: flex;
            justify-content: space-between;
            background-color: #f8fafc;
            padding: 16px 20px;
            border-radius: 10px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .step-details .label {
            font-size: 11px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            display: block;
            margin-bottom: 4px;
        }

        .step-details .value {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .step-details .green {
            color: #16a34a;
        }

        .bottom-line-card {
            background: linear-gradient(to right, {{theme.footerColor}},{{theme.footerColorTwo}});
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 30px 20px;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .bottom-line-inner {
            max-width: 1000px;
            margin: auto;
        }

        .bottom-line-inner h3 {
            font-size: 18px;
            font-weight: 700;
            color: {{theme.footertextColor}};         /*   #0f172a */
            margin-bottom: 12px;
        }

        .bottom-line-inner p {
            font-size: 15px;
            color: {{theme.footertextColor}};      /*   #334155  */
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .bottom-line-stats {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 40px;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .bottom-line-stats .green {
            color: #22c55e;
            font-weight: 600;
        }

        /* Tablet (768px to 1024px) */
        @media (max-width: 1024px) {
            .header-card {
                padding: 30px;
            }

            .header {
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 20px;
            }

            .header-right {
                text-align: left;
                margin-top: 20px;
            }

            .summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 2fr));
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .owner-summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 2fr));
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .white-card {
                padding: 20px;
            }

            table {
                display: block;
            }

            th,
            td {
                padding: 10px 8px;
            }

            .cards-grid {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }

            .dashboard {
                grid-template-columns: 1fr;
            }

            .insights-grid {
                grid-template-columns: 1fr;
            }

            .analysis-section {
                padding: 20px;
            }

            .step-card {
                padding: 20px;
            }

            .step-details {
                flex-direction: column;
            }

            .bottom-line-card {
                padding: 20px;
            }

            .bottom-line-stats {
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }

            /* Tablet-specific Funnel adjustments */
            .funnel-step {
                flex-direction: row;
                align-items: flex-start;
                justify-content: space-between;
            }

            .funnel-left {
                flex: 1;
                flex-basis: auto;
                justify-content: flex-start;
            }

            .funnel-info {
                flex: 1;
                padding-right: 10px;
            }

            .status {
                margin-left: auto;
                margin-top: 4px;
                align-self: flex-start;
            }
        }

        /* Mobile (up to 767px) */
        @media (max-width: 767px) {
            .header-card {
                padding: 20px;
            }

            .header-left h1 {
                font-size: 24px;
            }

            .header-left h2 {
                font-size: 16px;
            }

            .header-right h3 {
                font-size: 18px;
            }

            .summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                flex-direction: column;
                padding: 15px;
                gap: 15px;
            }

            .owner-summary  {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                flex-direction: column;
                padding: 15px;
                gap: 15px;
            }

            .summary-item {
                flex-basis: 100%;
            }

            .summary-item h1 {
                font-size: 24px;
            }

            .summary-item p {
                font-size: 14px;
            }

            .white-card {
                padding: 15px;
            }

            th,
            td {
                font-size: 12px;
                padding: 8px 6px;
            }

            .cards-grid {
                grid-template-columns: 1fr;
            }

            .card {
                padding: 15px 20px;
            }

            .card h2 {
                font-size: 18px;
            }

            .card-value {
                font-size: 18px;
            }

            .bottom-metrics {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }

            .funnel-step {
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
            }

            .funnel-left {
                width: 100%;
                flex-wrap: wrap;
                margin-bottom: 10px;
            }

            .funnel-dot {
                margin-right: 10px;
                margin-bottom: 0;
            }

            .funnel-info {
                flex: 1;
                min-width: 150px;
            }

            .status {
                margin-left: 0;
                margin-top: 10px;
                align-self: flex-start;
                width: auto;
            }

            .progress-footer {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }

            .analysis-section {
                padding: 15px;
            }

            .insights-grid {
                grid-template-columns: 1fr;
            }

            .insight-card {
                padding: 15px;
            }

            .insight-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }

            .action {
                font-size: 12px;
                padding: 8px 10px;
            }

            .step-card {
                padding: 15px;
            }

            .step-top {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .step-icon {
                margin-bottom: 10px;
            }

            .step-title {
                flex-direction: column;
                text-align: center;
                gap: 5px;
            }

            .priority-tag {
                margin-top: 5px;
            }

            .step-details {
                flex-direction: column;
                padding: 10px 15px;
            }

            .bottom-line-inner h3 {
                font-size: 16px;
            }

            .bottom-line-inner p {
                font-size: 14px;
            }

            .bottom-line-stats {
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            /* ── Contact-Journey Timeline ─────────────────────────────── */
            .timeline-card .timeline-wrapper {
             /*max-height: 260px; */
             /*overflow-y: auto; */
            margin: 20px 0;
            padding-right: 6px;             /* room for scrollbar */
            }

            .timeline-card-duplicate {
                margin-left: 0px !important; 
                margin-right: 0px !important; 
                margin-bottom: 10px !important; 
            }

            .timeline-card .timeline-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 16px;
            }

            .timeline-card .timeline-head {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 14px;
            color: #0f172a;
            }

            .timeline-card .timeline-head .date {
            min-width: 65px;
            color: #475569;
            }

            .timeline-card .timeline-body {
            font-size: 15px;
            color: #1e293b;
            }

            .timeline-card .badge.purple  { background:#ede9fe; color:#6d28d9; }
            .timeline-card .badge.dark    { background:#1e293b; color:#f8fafc; }

            .timeline-card .timeline-footer {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #e2e8f0;
            padding-top: 18px;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            }

            .timeline-card .timeline-footer span {
            display: flex;
            gap: 4px;
            align-items: baseline;
            }
            .timeline-card .timeline-footer .blue  { color:#3b82f6; }
            .timeline-card .timeline-footer .green { color:#16a34a; }
            .timeline-card .timeline-footer .orange{ color:#ea580c; }
        }
        .timeline-card .timeline-item{
            background:#f8fafc;   /* ← the soft grey */
            border-radius:12px;
            padding:16px 20px;
            margin-bottom:16px;
        }

        .timeline-card .badge.purple  { background:#ede9fe; color:#6d28d9; }
        .timeline-card .badge.dark    { background:#1e293b; color:#f8fafc; }


        .stats-row {
            display: flex;
            justify-content: space-around;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            flex-wrap: wrap;
            gap: 15px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
        }

        .stat-value.blue { color: #3b82f6; }
        .stat-value.green { color: #10b981; }
        .stat-value.orange { color: #f59e0b; }

        .stat-label {
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 0.125rem;
        }

        .timeline-card-duplicate {
                margin-left: 0px !important; 
                margin-right: 0px !important; 
        }

    .owner-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px 40px;
      padding: 0;
    }

    .owner-list .full {
      grid-column: 1 / -1;
    }

    .owner-list .label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: {{theme.headerSubHeadingTextColor}};
      text-transform: uppercase;
      letter-spacing: .4px;
      margin-bottom: 2px;
    }

    .owner-list .value {
      font-size: 15px;
      font-weight: 600;
      color: {{theme.headertextColor}};
      line-height: 1.4;
      word-break: break-word;
    }

    </style> 

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.owner-summary').forEach(function (block) {
                if (!block.querySelector('li')) {
                    block.style.display = 'none';
                }
            });
        });
    </script>
</head>

<body>
  <div class="main-wrapper">

    <!-- Header Section -->
    <div class="header-card">
      <div class="header">
        <div class="header-left">
          <h1>{{ report.report_title }}</h1>
          <h2>{{ report.subtitle }}</h2>
           <!-- <span *ngIf="report.meta.date_range">Data range: {{ report.date_range }}</span> -->
        </div>
        <div class="header-right">
        {{#report.report_recipient}}
          <span>Prepared for</span>
          {{/report.report_recipient}}
          <h3>{{ report.report_recipient }}</h3>
          <span>{{ report.report_owner }}</span>
        </div>
      </div>

        {{#report}}
            {{#owner_details}}
                <div class="owner-summary" style="margin-bottom: 15px;">
                <ul class="owner-list">
                {{#owner_full_name}}      <li><span class="label">Name</span>            <span class="value">{{.}}</span></li>{{/owner_full_name}}
                {{#owner_job_title}}      <li><span class="label">Job&nbsp;Title</span>   <span class="value">{{.}}</span></li>{{/owner_job_title}}
                {{#owner_contact_company}}<li><span class="label">Company</span>          <span class="value">{{.}}</span></li>{{/owner_contact_company}}
                {{#owner_email_id}}       <li><span class="label">Email</span>            <span class="value">{{.}}</span></li>{{/owner_email_id}}
                {{#owner_mobile_number}}  <li><span class="label">Mobile</span>           <span class="value">{{.}}</span></li>{{/owner_mobile_number}}
                {{#owner_address}}        <li class="full"><span class="label">Address</span>  <span class="value">{{.}}</span></li>{{/owner_address}}
                {{#owner_city}}           <li><span class="label">City</span>             <span class="value">{{.}}</span></li>{{/owner_city}}
                {{#owner_state}}          <li><span class="label">State</span>            <span class="value">{{.}}</span></li>{{/owner_state}}
                {{#owner_zip}}            <li><span class="label">ZIP</span>              <span class="value">{{.}}</span></li>{{/owner_zip}}
                {{#owner_country}}       <li><span class="label">Country</span>          <span class="value">{{.}}</span></li>{{/owner_country}}
                {{#owner_region}}         <li><span class="label">Region</span>           <span class="value">{{.}}</span></li>{{/owner_region}}
                {{#owner_vertical}}       <li><span class="label">Vertical</span>         <span class="value">{{.}}</span></li>{{/owner_vertical}}
                {{#owner_company_domain}} <li><span class="label">Domain</span>           <span class="value">{{.}}</span></li>{{/owner_company_domain}}
                {{#owner_website}}       <li><span class="label">Website</span>          <span class="value">{{.}}</span></li>{{/owner_website}}
                {{#owner_country_code}}   <li><span class="label">Country&nbsp;Code</span><span class="value">{{.}}</span></li>{{/owner_country_code}}
                </ul>
            </div>
        {{/owner_details}}
        {{/report}}
      <div class="summary" *ngIf="report.kpi_overview">
      {{#report.kpi_overview.items}}
        <div class="summary-item">
          <h1 class="green">{{ value }}</h1>
          <p>{{name}}</p>
          <span>{{notes}}</span>
        </div>
        {{/report.kpi_overview.items}}
      </div>
    </div>

    <!-- KPI Table -->
    <div class="white-card" *ngIf="report.summary_overview?.length">
      <h2>{{report.summary_overview.title}}</h2>
      <p>{{report.summary_overview.description}}</p>
      <table>
        <thead>
          <tr>
            <th>KPI</th>
            <th>Volume</th>
            <th>Trend / Comment</th>
          </tr>
        </thead>
        <tbody>
          {{#report.summary_overview.items}}
      <tr>
        {{#name}}
        <td>{{name}}</td>
        {{/name}}
        {{#value}}
        <td>{{value}}</td>
        {{/value}}
        {{#notes}}
        <td>{{notes}}</td>
        {{/notes}}
      </tr>
    {{/report.summary_overview.items}}
        </tbody>
      </table>
    </div>

    <!-- Metric Cards -->
    <div class="cards-grid" *ngIf="report.performance_indicators">
     {{#report.performance_indicators.items}}
      <div class="card">
        <div class="card-header">
          {{name}}
          <div class="status-label" style="color:{{color}}">{{symbol}} {{rating}}</div>
        </div>
        <div class="card-value">{{ value }}</div>
        <div class="card-subtext">{{notes}}</div>
      </div>
       {{/report.performance_indicators.items}}
    </div>
   

  <div class="dashboard">
    <!-- Contact Journey Timeline -->
    {{#report.contact_journey_timeline.title}}
    <div class="white-card timeline-card timeline-card-duplicate"  *ngIf="report.contact_journey_timeline">
        <h2>{{report.contact_journey_timeline.title}}</h2>
        <p>{{report.contact_journey_timeline.description}}</p>

        <div class="timeline-wrapper">
            {{#report.contact_journey_timeline.items}}
                <div class="timeline-item">
                <div class="timeline-head">
                    <span class="date">{{date}}</span>
                    <span class="badge purple">{{status}}</span>
                </div>
                <div class="timeline-body">
                    {{interaction}}
                </div>
                </div>
            {{/report.contact_journey_timeline.items}}
        </div>
        </div>
    {{/report.contact_journey_timeline.title}}


    {{#report.lead_progression_funnel.title}}
    <div class="white-card timeline-card-duplicate" *ngIf="report.lead_progression_funnel">
        <h2>{{report.lead_progression_funnel.title}}</h2>
        <p>{{report.lead_progression_funnel.description}}</p>
        
        {{#report.lead_progression_funnel.items}}
        <div class="funnel-step">
          
            <div class="funnel-left">
                
              <div class="funnel-dot" style="background:#10b981;"></div>
              <div class="funnel-info">
                <span class="funnel-title">{{name}} ({{count}})</span>
                <div class="funnel-bar">
                  <div class="bar-fill" style="width:{{count}}%;background:#10b981;"></div>
                </div>
                <div class="funnel-sub">{{notes}}</div>
              </div>
              
            </div>
          
        </div>
        {{/report.lead_progression_funnel.items}}
      </div>
    </div>
    {{/report.lead_progression_funnel.title}}
  </div>
    
    

       
    <!-- Bar-chat -->
    {{#report.dealPipelinePrograssion.title}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="bar-chart"></div>
        <div class="stats-row">
            <div class="stat-item">
                {{#report.dealPipelinePrograssion.average_deal_value}}
                    <div class="stat-value blue">{{report.dealPipelinePrograssion.average_deal_value}}</div>
                    <div class="stat-label">Average deal value</div>
                {{/report.dealPipelinePrograssion.average_deal_value}}
            </div>
            <div class="stat-item">
                {{#report.dealPipelinePrograssion.highest_deal_value}}
                    <div class="stat-value orange">{{report.dealPipelinePrograssion.highest_deal_value}}</div>
                    <div class="stat-label">Highest deal value</div>
                {{/report.dealPipelinePrograssion.highest_deal_value}}
            </div>
        </div>
    </div>
    {{/report.dealPipelinePrograssion.title}}

    <!-- Pie-chat -->
    {{#report.campaignPerformanceAnalysis.title}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="pie-chart"></div>
    </div>
    {{/report.campaignPerformanceAnalysis.title}}


    <!-- Strategic Insights & Analysis -->
    {{#report.strategic_insights.title}}
    <div class="analysis-section" *ngIf="report.strategic_insights?.length">
      <h2>{{report.strategic_insights.title}}</h2>
      <p>{{report.strategic_insights.description}}</p>

      <div class="insights-grid">
      {{#report.strategic_insights.items}}
        <div class="insight-card blue">
          <div class="insight-header">
            <span>{{ title }}</span>
            <div class="insight-type-tag">{{ insight_type }}</div>
          </div>
          <p>{{ analysis }}</p>
          <div class="action">IMMEDIATE ACTION<br><strong>{{ recommended_action }}</strong></div>
        </div>
        {{/report.strategic_insights.items}}
      </div>
    </div>
    {{/report.strategic_insights.title}}

    <!-- Next Steps -->
    {{#report.recommended_next_steps.title}}
    <div class="white-card" *ngIf="report.recommended_next_steps?.length">
      <div class="next-steps-wrapper">
        <h2>{{report.recommended_next_steps.title}}</h2>
        <p>{{report.recommended_next_steps.description}}</p>
        {{#report.recommended_next_steps.items}}
        <div class="step-card">
          <div class="step-top">
            <div class="step-icon">🎯</div>
            <div class="step-content">
              <div class="step-title">
                <h3>{{ title }}</h3>
                <span class="priority-tag">{{priority}}</span>
              </div>
              <p class="step-description">{{ action }}</p>
              <div class="step-details">
                <div>
                  <span class="label">OWNER</span>
                  <p class="value">{{ owner }}</p>
                </div>
                <div>
                  <span class="label">TIMELINE</span>
                  <p class="value">{{ timeline }}</p>
                </div>
                <div>
                  <span class="label">EXPECTED IMPACT</span>
                  <p class="value green">{{ expected_impact }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {{/report.recommended_next_steps.items}}
      </div>
      {{/report.recommended_next_steps.title}}

      <!-- Bottom Line -->
      {{#report.conclusion.title}}
      <div class="bottom-line-card" *ngIf="report.conclusion">
        <div class="bottom-line-inner">
          <h3>{{report.conclusion.title}}</h3>
          <p>{{ report.conclusion.description }}</p>
        </div>
      </div>
      {{/report.conclusion.title}}
    </div>

  </div>

    <script>
        Highcharts.chart('bar-chart', {
            chart: { type: 'column' },
            credits:{ enabled: false },
            title: { text: '{{report.dealPipelinePrograssion.title}}' },
            xAxis: { categories: {{{report.dealPipelinePrograssion.categoriesString}}} },
            yAxis: { title: { text: '{{report.dealPipelinePrograssion.revenue}}' } },
            series: {{{report.dealPipelinePrograssion.seriesString}}}
        });

        Highcharts.chart('pie-chart', {
            chart: { type: 'pie' },
            credits:{ enabled: false },
            title: { text: '{{report.campaignPerformanceAnalysis.title}}' },
            plotOptions: {
              pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: { enabled: true, format: '{point.name}' }
                  }
            },
            series: {{{report.campaignPerformanceAnalysis.seriesString}}}
        });
    </script>




</body>

</html>`;

 iframePartnerContent: any = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ report?.meta?.report_title }}</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
    <!-- Funnel module -->
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* ------------- ORIGINAL CSS — UNCHANGED ------------- */
    * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: {{theme.backgroundColor}}
        }

        .main-wrapper {
         width:100%
         margin: auto;
        }

        .header-card {
            background: linear-gradient(to bottom right,{{theme.darkHeaderColor}},{{theme.lightHeaderColor}});
            padding: 40px;
            color: white;
            margin-bottom: 30px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 30px;
        }

        .header-left h1 {
            font-size: 30px;
            font-weight: 800;
            margin-bottom: 8px;
        }

        .header-left h2 {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .header-left p {
            color: {{theme.headertextColor}};  /* #bfdbfe;  */
            font-size: 14px;
            margin-bottom: 4px;
        }

        .header-left span {
            font-size: 14px;
            color: {{theme.headertextColor}};  /*  #cbd5e1;  */
        }

        .header-left h1,
        .header-left h2 {
            color: {{theme.headertextColor}};
        }

        .header-right {
            text-align: right;
            font-size: 14px;
        }

        .header-right span {
            display: block;
            color: {{theme.headertextColor}};    /* #cbd5e1;  */
        }

        .header-right h3 {
            font-size: 22px;
            font-weight: 700;
            color:  {{theme.headertextColor}};    /* white; */
            margin-top: 2px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .owner-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .owner-summary:not(:has(li)) {
            display: none;
        }

        .summary-item {
            text-align: center;
        }

        .summary-item h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .summary-item p {
            font-size: 16px;
            color: {{theme.headertextColor}};       /* #cbd5e1;  */
            margin-bottom: 4px;
        }

        .summary-item span {
            font-size: 13px;
            color: {{theme.headertextColor}};      /* #94a3b8; */
        }

        .green {
            color: {{theme.headerHeadingTextColor}}            /* #34d399; */
        }

        .yellow {
            color: #facc15;
        }

        .blue {
            color: #60a5fa;
        }

        .white-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            margin-right: 30px;
            margin-left: 30px;
        }

        .white-card h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #0f172a;
        }

        .white-card p {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            text-align: left;
            padding: 14px 12px;
            vertical-align: top;
        }

        th {
            font-size: 14px;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
        }

        td {
            font-size: 14px;
            color: #0f172a;
            border-bottom: 1px solid #f1f5f9;
        }

        td b {
            font-weight: 600;
            color: #0f172a;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
            margin-right: 30px;
            margin-left: 30px;
        }

        .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .card:hover,
        .white-card:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .card h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .card p {
            font-size: 15px;
            color: rgb(71 85 105);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 10px;
        }

        .status-label {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
            color: #10b981;
        }

        .status-label::before {
            /* content: '↗'; */
            font-size: 15px;
            margin-right: 4px;
        }

        .card-value {
            font-size: 21px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .card-subtext {
            font-size: 13px;
            color: #64748b;
        }

        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-right: 30px;
            margin-left: 30px
        }

        .chart-img {
            width: 100%;
            border-radius: 8px;
            margin: 10px 0;
        }

        .bottom-metrics {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #374151;
            margin-top: 10px;
        }

        .bottom-metrics b {
            display: block;
            font-weight: 600;
        }

        /* --- Funnel Step Styles --- */
        .funnel-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .funnel-left {
            display: flex;
            align-items: flex-start;
            flex: 1;
            min-width: 0;
        }

        .funnel-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 6px;
            flex-shrink: 0;
        }

        .funnel-info {
            flex: 1;
        }

        .funnel-title {
            font-weight: 600;
            font-size: 14px;
            color: #1f2937;
            display: block;
        }

        .funnel-sub {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
            display: block;
        }

        .funnel-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            margin-top: 6px;
            position: relative;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            border-radius: 4px;
        }

        .status {
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 10px;
            white-space: nowrap;
            margin-left: auto; /* Push to the right */
            margin-top: 4px;
            flex-shrink: 0;
        }

        .status.complete {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status.progress {
            background-color: #dbeafe;
            color: #1d4ed8;
        }

        .status.pending {
            background-color: #f3f4f6;
            color: #6b7280;
        }

        .progress-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-weight: bold;
            font-size: 14px;
        }

        .progress-footer .blue {
            color: #3b82f6;
        }

        .progress-footer .green {
            color: #10b981;
        }

        .analysis-section {
            margin: 40px 0;
            padding: 30px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
   margin-right: 30px;
            margin-left: 30px
        }

        .analysis-section:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .analysis-section h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .analysis-section p {
            color: rgb(71 85 105);
        }

        .insights-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }

        .insight-card {
            padding: 20px;
            border-radius: 12px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .insight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            color: #1e293b;
        }

        .badge {
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 999px;
            font-weight: 600;
        }

        .badge.green {
            background: #d1fae5;
            color: #047857;
        }

        .badge.blue {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .badge.teal {
            background: #ccfbf1;
            color: #0f766e;
        }

        .badge.yellow {
            background: #fef3c7;
            color: #b45309;
        }

        .action-label {
            font-size: 12px;
            font-weight: bold;
            color: #6b7280;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .action {
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            background: rgba(0, 0, 0, 0.03);
            border-left: 4px solid #94a3b8;
            padding: 10px 12px;
            border-radius: 6px;
        }

        .action strong {
            display: block;
            margin-top: 4px;
            color: #0f172a;
            font-weight: 600;
        }

        .insight-card p {
            font-size: 14px;
            color: #334155;
            margin-bottom: 14px;
        }

        .insight-card.green {
            background: rgb(240 253 244);
            border: 1px solid rgb(187 247 208);
        }

        .insight-card.blue {
            background: rgb(239 246 255);
            border: 1px solid rgb(191 219 254);
        }

        .insight-card.teal {
            background: rgb(240 253 244);
            border: 1px solid rgb(187 247 208);
        }

        .insight-card.yellow {
            background: rgb(254 252 232);
            border: 1px solid rgb(254 240 138);
        }

        .next-steps-wrapper h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .next-steps-wrapper p {
            font-size: 15px;
            color: #64748b;
            margin-bottom: 24px;
        }

        .step-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            margin-bottom: 24px;
        }

        .step-card:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .step-top {
            display: flex;
            gap: 16px;
            align-items: flex-start;
        }

        .step-icon {
            background-color: #f1f5ff;
            color: #3b82f6;
            font-size: 22px;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .step-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }

        .step-title h3 {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }

        .priority-tag {
            font-size: 12px;
            font-weight: 500;
            background-color: #fee2e2;
            color: #b91c1c;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .insight-type-tag {
            font-size: 12px;
            font-weight: 500;
            background-color: #e8c5ee;
            color: #7967eb;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .step-description {
            font-size: 14px;
            color: #475569;
            line-height: 1.5;
        }

        .step-details {
            display: flex;
            justify-content: space-between;
            background-color: #f8fafc;
            padding: 16px 20px;
            border-radius: 10px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .step-details .label {
            font-size: 11px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            display: block;
            margin-bottom: 4px;
        }

        .step-details .value {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .step-details .green {
            color: #16a34a;
        }

        .bottom-line-card {
            background: linear-gradient(to right, {{theme.footerColor}},{{theme.footerColorTwo}});
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 30px 20px;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .bottom-line-inner {
            max-width: 1000px;
            margin: auto;
        }

        .bottom-line-inner h3 {
            font-size: 18px;
            font-weight: 700;
            color: {{theme.footertextColor}};         /*   #0f172a */
            margin-bottom: 12px;
        }

        .bottom-line-inner p {
            font-size: 15px;
            color: {{theme.footertextColor}};      /*   #334155  */
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .bottom-line-stats {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 40px;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .bottom-line-stats .green {
            color: #22c55e;
            font-weight: 600;
        }

        /* Tablet (768px to 1024px) */
        @media (max-width: 1024px) {
            .header-card {
                padding: 30px;
            }

            .header {
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 20px;
            }

            .header-right {
                text-align: left;
                margin-top: 20px;
            }

            .summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 2fr));
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .owner-summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 2fr));
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .white-card {
                padding: 20px;
            }

            table {
                display: block;
            }

            th,
            td {
                padding: 10px 8px;
            }

            .cards-grid {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }

            .dashboard {
                grid-template-columns: 1fr;
            }

            .insights-grid {
                grid-template-columns: 1fr;
            }

            .analysis-section {
                padding: 20px;
            }

            .step-card {
                padding: 20px;
            }

            .step-details {
                flex-direction: column;
            }

            .bottom-line-card {
                padding: 20px;
            }

            .bottom-line-stats {
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }

            /* Tablet-specific Funnel adjustments */
            .funnel-step {
                flex-direction: row;
                align-items: flex-start;
                justify-content: space-between;
            }

            .funnel-left {
                flex: 1;
                flex-basis: auto;
                justify-content: flex-start;
            }

            .funnel-info {
                flex: 1;
                padding-right: 10px;
            }

            .status {
                margin-left: auto;
                margin-top: 4px;
                align-self: flex-start;
            }
        }

        /* Mobile (up to 767px) */
        @media (max-width: 767px) {
            .header-card {
                padding: 20px;
            }

            .header-left h1 {
                font-size: 24px;
            }

            .header-left h2 {
                font-size: 16px;
            }

            .header-right h3 {
                font-size: 18px;
            }

            .summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                flex-direction: column;
                padding: 15px;
                gap: 15px;
            }

            .owner-summary  {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                flex-direction: column;
                padding: 15px;
                gap: 15px;
            }

            .summary-item {
                flex-basis: 100%;
            }

            .summary-item h1 {
                font-size: 24px;
            }

            .summary-item p {
                font-size: 14px;
            }

            .white-card {
                padding: 15px;
            }

            th,
            td {
                font-size: 12px;
                padding: 8px 6px;
            }

            .cards-grid {
                grid-template-columns: 1fr;
            }

            .card {
                padding: 15px 20px;
            }

            .card h2 {
                font-size: 18px;
            }

            .card-value {
                font-size: 18px;
            }

            .bottom-metrics {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }

            .funnel-step {
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
            }

            .funnel-left {
                width: 100%;
                flex-wrap: wrap;
                margin-bottom: 10px;
            }

            .funnel-dot {
                margin-right: 10px;
                margin-bottom: 0;
            }

            .funnel-info {
                flex: 1;
                min-width: 150px;
            }

            .status {
                margin-left: 0;
                margin-top: 10px;
                align-self: flex-start;
                width: auto;
            }

            .progress-footer {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }

            .analysis-section {
                padding: 15px;
            }

            .insights-grid {
                grid-template-columns: 1fr;
            }

            .insight-card {
                padding: 15px;
            }

            .insight-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }

            .action {
                font-size: 12px;
                padding: 8px 10px;
            }

            .step-card {
                padding: 15px;
            }

            .step-top {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .step-icon {
                margin-bottom: 10px;
            }

            .step-title {
                flex-direction: column;
                text-align: center;
                gap: 5px;
            }

            .priority-tag {
                margin-top: 5px;
            }

            .step-details {
                flex-direction: column;
                padding: 10px 15px;
            }

            .bottom-line-inner h3 {
                font-size: 16px;
            }

            .bottom-line-inner p {
                font-size: 14px;
            }

            .bottom-line-stats {
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            /* ── Contact-Journey Timeline ─────────────────────────────── */
            .timeline-card .timeline-wrapper {
             /*max-height: 260px; */
             /*overflow-y: auto; */
            margin: 20px 0;
            padding-right: 6px;             /* room for scrollbar */
            }

            .timeline-card-duplicate {
                margin-left: 0px !important; 
                margin-right: 0px !important; 
                margin-bottom: 10px !important; 
            }

            .timeline-card .timeline-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 16px;
            }

            .timeline-card .timeline-head {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 14px;
            color: #0f172a;
            }

            .timeline-card .timeline-head .date {
            min-width: 65px;
            color: #475569;
            }

            .timeline-card .timeline-body {
            font-size: 15px;
            color: #1e293b;
            }

            .timeline-card .badge.purple  { background:#ede9fe; color:#6d28d9; }
            .timeline-card .badge.dark    { background:#1e293b; color:#f8fafc; }

            .timeline-card .timeline-footer {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #e2e8f0;
            padding-top: 18px;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            }

            .timeline-card .timeline-footer span {
            display: flex;
            gap: 4px;
            align-items: baseline;
            }
            .timeline-card .timeline-footer .blue  { color:#3b82f6; }
            .timeline-card .timeline-footer .green { color:#16a34a; }
            .timeline-card .timeline-footer .orange{ color:#ea580c; }
        }
        .timeline-card .timeline-item{
            background:#f8fafc;   /* ← the soft grey */
            border-radius:12px;
            padding:16px 20px;
            margin-bottom:16px;
        }

        .timeline-card .badge.purple  { background:#ede9fe; color:#6d28d9; }
        .timeline-card .badge.dark    { background:#1e293b; color:#f8fafc; }


        .stats-row {
            display: flex;
            justify-content: space-around;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            flex-wrap: wrap;
            gap: 15px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
        }

        .stat-value.blue { color: #3b82f6; }
        .stat-value.green { color: #10b981; }
        .stat-value.orange { color: #f59e0b; }

        .stat-label {
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 0.125rem;
        }

        .timeline-card-duplicate {
                margin-left: 0px !important; 
                margin-right: 0px !important; 
        }

    .owner-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px 40px;
      padding: 0;
    }

    .owner-list .full {
      grid-column: 1 / -1;
    }

    .owner-list .label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: {{theme.headerSubHeadingTextColor}};
      text-transform: uppercase;
      letter-spacing: .4px;
      margin-bottom: 2px;
    }

    .owner-list .value {
      font-size: 15px;
      font-weight: 600;
      color: {{theme.headertextColor}};
      line-height: 1.4;
      word-break: break-word;
    }
    
     .card-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .track-card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 0 1px #e1e8f0;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .track-header {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .track-header.green {
      color: #16a34a;
    }

    .track-header.red {
      color: #dc2626;
    }

    .track-title {
      font-size: 18px;
      font-weight: 700;
      color: #000;
      margin-bottom: 10px;
    }

    .track-subtitle {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 20px;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }

    .stat-box {
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .opens {
      background-color: #e8f0fe;
      color: #2563eb;
    }

    .views {
      background-color: #e6f8ec;
      color: #16a34a;
    }

    .downloads {
      background-color:  #fffbea;
      color: #ca8a04;
    }

    .assets {
      background-color: #f5f3ff;
      color: #9333ea;
    }

    .stat-number {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
    }

    .progress-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      width:fit-content;
    }

    .progress-green {
      background-color: #d1fae5;
      color: #16a34a;
    }

    .progress-red {
      background-color: #fee2e2;
      color: #dc2626;
    }

    /* ✅ Responsive Layout */
    @media (max-width: 768px) {
      .card-container {
        grid-template-columns: 1fr;
        padding: 6px;
      }
    }

    @media (max-width: 480px) {
      .track-card {
        padding: 20px;
      }

      .stat-box {
        padding: 16px;
      }

      .track-title {
        font-size: 16px;
      }

      .stat-number {
        font-size: 18px;
      }
    }
 
    .asset-summary-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-top: 35px;
    }

    .asset-card {
      background-color: #e8f5e833;
      border-radius: 12px;
      padding: 15px 20px;
      box-shadow: 0 0 0 1px #ecf4e8;
    }

    .asset-value {
      font-size: 28px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 7px;
    }

    .asset-label {
      font-size: 15px;
      color: #475569;
      margin-bottom: 4px;
    }

    .asset-subtext {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }

    @media (max-width: 480px) {
      .asset-value {
        font-size: 24px;
      }
      .asset-label {
        font-size: 14px;
      }
      .asset-subtext {
        font-size: 12px;
      }
    }

    </style> 

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.owner-summary').forEach(function (block) {
                if (!block.querySelector('li')) {
                    block.style.display = 'none';
                }
            });
        });
    </script>
</head>

<body>
  <div class="main-wrapper">

    <!-- Header Section -->
    <div class="header-card">
      <div class="header">
        <div class="header-left">
          <h1>{{ report.report_title }}</h1>
          <h2>{{ report.subtitle }}</h2>
           <!-- <span *ngIf="report.meta.date_range">Data range: {{ report.date_range }}</span> -->
        </div>
        <div class="header-right">
        {{#report.report_recipient}}
          <span>Prepared for</span>
          {{/report.report_recipient}}
          <h3>{{ report.report_recipient }}</h3>
          <span>{{ report.report_owner }}</span>
        </div>
      </div>

        {{#report}}
            {{#owner_details}}
                <div class="owner-summary" style="margin-bottom: 15px;">
                <ul class="owner-list">
                {{#owner_full_name}}      <li><span class="label">Name</span>            <span class="value">{{.}}</span></li>{{/owner_full_name}}
                {{#owner_job_title}}      <li><span class="label">Job&nbsp;Title</span>   <span class="value">{{.}}</span></li>{{/owner_job_title}}
                {{#owner_contact_company}}<li><span class="label">Company</span>          <span class="value">{{.}}</span></li>{{/owner_contact_company}}
                {{#owner_email_id}}       <li><span class="label">Email</span>            <span class="value">{{.}}</span></li>{{/owner_email_id}}
                {{#owner_mobile_number}}  <li><span class="label">Mobile</span>           <span class="value">{{.}}</span></li>{{/owner_mobile_number}}
                {{#owner_address}}        <li class="full"><span class="label">Address</span>  <span class="value">{{.}}</span></li>{{/owner_address}}
                {{#owner_city}}           <li><span class="label">City</span>             <span class="value">{{.}}</span></li>{{/owner_city}}
                {{#owner_state}}          <li><span class="label">State</span>            <span class="value">{{.}}</span></li>{{/owner_state}}
                {{#owner_zip}}            <li><span class="label">ZIP</span>              <span class="value">{{.}}</span></li>{{/owner_zip}}
                {{#owner_country}}       <li><span class="label">Country</span>          <span class="value">{{.}}</span></li>{{/owner_country}}
                {{#owner_region}}         <li><span class="label">Region</span>           <span class="value">{{.}}</span></li>{{/owner_region}}
                {{#owner_vertical}}       <li><span class="label">Vertical</span>         <span class="value">{{.}}</span></li>{{/owner_vertical}}
                {{#owner_company_domain}} <li><span class="label">Domain</span>           <span class="value">{{.}}</span></li>{{/owner_company_domain}}
                {{#owner_website}}       <li><span class="label">Website</span>          <span class="value">{{.}}</span></li>{{/owner_website}}
                {{#owner_country_code}}   <li><span class="label">Country&nbsp;Code</span><span class="value">{{.}}</span></li>{{/owner_country_code}}
                </ul>
            </div>
        {{/owner_details}}
        {{/report}}
      <div class="summary" *ngIf="report.kpi_overview">
      {{#report.kpi_overview.items}}
        <div class="summary-item">
          <h1 class="green">{{ value }}</h1>
          <p>{{name}}</p>
          <span>{{notes}}</span>
        </div>
        {{/report.kpi_overview.items}}
      </div>
    </div>

    <!-- KPI Table -->
    <div class="white-card" *ngIf="report.summary_overview?.length">
      <h2>{{report.summary_overview.title}}</h2>
      <p>{{report.summary_overview.description}}</p>
      <table>
        <thead>
          <tr>
            <th>KPI</th>
            <th>Volume</th>
            <th>Trend / Comment</th>
          </tr>
        </thead>
        <tbody>
          {{#report.summary_overview.items}}
      <tr>
        {{#name}}
        <td>{{name}}</td>
        {{/name}}
        {{#value}}
        <td>{{value}}</td>
        {{/value}}
        {{#notes}}
        <td>{{notes}}</td>
        {{/notes}}
      </tr>
    {{/report.summary_overview.items}}
        </tbody>
      </table>
    </div>

    <!-- Metric Cards -->
    <div class="cards-grid" *ngIf="report.performance_indicators">
     {{#report.performance_indicators.items}}
      <div class="card">
        <div class="card-header">
          {{name}}
          <div class="status-label" style="color:{{color}}">{{symbol}} {{rating}}</div>
        </div>
        <div class="card-value">{{ value }}</div>
        <div class="card-subtext">{{notes}}</div>
      </div>
       {{/report.performance_indicators.items}}
    </div>
   

  <div class="dashboard">
    <!-- Contact Journey Timeline -->
    {{#report.contact_journey_timeline.title}}
    <div class="white-card timeline-card timeline-card-duplicate"  *ngIf="report.contact_journey_timeline">
        <h2>{{report.contact_journey_timeline.title}}</h2>
        <p>{{report.contact_journey_timeline.description}}</p>

        <div class="timeline-wrapper">
            {{#report.contact_journey_timeline.items}}
                <div class="timeline-item">
                <div class="timeline-head">
                    <span class="date">{{date}}</span>
                    <span class="badge purple">{{status}}</span>
                </div>
                <div class="timeline-body">
                    {{interaction}}
                </div>
                </div>
            {{/report.contact_journey_timeline.items}}
        </div>
        </div>
    {{/report.contact_journey_timeline.title}}


    {{#report.lead_progression_funnel.title}}
    <div class="white-card timeline-card-duplicate" *ngIf="report.lead_progression_funnel">
        <h2>{{report.lead_progression_funnel.title}}</h2>
        <p>{{report.lead_progression_funnel.description}}</p>
        
        {{#report.lead_progression_funnel.items}}
        <div class="funnel-step">
          
            <div class="funnel-left">
                
              <div class="funnel-dot" style="background:#10b981;"></div>
              <div class="funnel-info">
                <span class="funnel-title">{{name}} ({{count}})</span>
                <div class="funnel-bar">
                  <div class="bar-fill" style="width:{{count}}%;background:#10b981;"></div>
                </div>
                <div class="funnel-sub">{{notes}}</div>
              </div>
              
            </div>
          
        </div>
        {{/report.lead_progression_funnel.items}}
      </div>
    </div>
    {{/report.lead_progression_funnel.title}}
  </div>
    
    

       
    <!-- Bar-chat -->
    {{#report.dealPipelinePrograssion.title}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="dealPipelinePrograssion-bar-chart"></div>
        <div class="stats-row">
            <div class="stat-item">
                {{#report.dealPipelinePrograssion.average_deal_value}}
                    <div class="stat-value blue">{{report.dealPipelinePrograssion.average_deal_value}}</div>
                    <div class="stat-label">Average deal value</div>
                {{/report.dealPipelinePrograssion.average_deal_value}}
            </div>
            <div class="stat-item">
                {{#report.dealPipelinePrograssion.highest_deal_value}}
                    <div class="stat-value orange">{{report.dealPipelinePrograssion.highest_deal_value}}</div>
                    <div class="stat-label">Highest deal value</div>
                {{/report.dealPipelinePrograssion.highest_deal_value}}
            </div>
        </div>
    </div>
    {{/report.dealPipelinePrograssion.title}}

    <!-- Pie-chat -->
    {{#report.campaignPerformanceAnalysis.title}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="pie-chart"></div>
    </div>
    {{/report.campaignPerformanceAnalysis.title}}
    
      <!-- Bar-chat -->
    {{#report.trackContentEngagement.title}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="track-bar-chart"></div>
    </div>
    {{/report.trackContentEngagement.title}}
    
    {{#report.trackEngagementAnalysis.title}}
 <div class="analysis-section">
  <h2>{{report.trackEngagementAnalysis.title}}</h2>
  <div class="track-subtitle">  </div>
  <p>{{report.trackEngagementAnalysis.description}}</p>
 <div class="card-container">
      {{#report.trackEngagementAnalysis.items}}
    <!-- Engagement Card -->
    <div class="track-card">
      <div class="track-header" style="color:{{engagementColor}}">{{engagement_level}} Engagement Track</div>
      <div class="track-title">{{name}}</div>
      <div class="stat-grid">
        <div class="stat-box opens">
          <div class="stat-number">{{opens}}</div>
          <div class="stat-label">Opens</div>
        </div>
        <div class="stat-box views">
          <div class="stat-number">{{views}}</div>
          <div class="stat-label">Views</div>
        </div>
        <div class="stat-box downloads">
          <div class="stat-number">{{downloads}}</div>
          <div class="stat-label">Downloads</div>
        </div>
        <div class="stat-box assets">
          <div class="stat-number">{{assets}}</div>
          <div class="stat-label">Assets</div>
        </div>
      </div>
      <div class="progress-pill">{{progress_rate}} Progress Rate</div>
    </div>
     {{/report.trackEngagementAnalysis.items}}
  </div>
  {{/report.trackEngagementAnalysis.title}}
</div>

 <!-- PlayBook Bar-chat -->
    {{#report.playbookContentEngagementOverview.title}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="playbook-bar-chart"></div>
    </div>
    {{/report.playbookContentEngagementOverview.title}}
    
  <!-- Assets Bar-chat -->  
  {{#report.assetEngagementOverview.title}}
<div class="analysis-section">
 <h2>{{report.assetEngagementOverview.title}}</h2>
 <p>{{report.assetEngagementOverview.description}}</p>
     <div style="height: 99%; overflow: hidden;" id="asset-bar-chart" data-highcharts-chart="0">
      </div>
  <div class="asset-summary-container">
    <!-- Card 1 -->
    <div class="asset-card">
      <div class="asset-value">{{report.assetEngagementOverview.openCountForMostViewedAsset}}</div>
      <div class="asset-label">Most Opened Asset</div>
      <div class="asset-subtext">{{report.assetEngagementOverview.mostOpenedAsset}}</div>
    </div>

    <!-- Card 2 -->
    <div class="asset-card">
      <div class="asset-value">{{report.assetEngagementOverview.totalAssetsOpenCount}}</div>
      <div class="asset-label">Total Asset Opens</div>
      <div class="asset-subtext">Across all Company Members</div>
    </div>

    <!-- Card 3 -->
    <div class="asset-card">
      <div class="asset-value">{{report.assetEngagementOverview.avgEngagementRate}}</div>
      <div class="asset-label">Avg Engagement Rate</div>
      <div class="asset-subtext">Opens to downloads ratio</div>
    </div>
  </div>
  {{/report.assetEngagementOverview.title}}
 </div>

    <!-- Strategic Insights & Analysis -->
    {{#report.strategic_insights.title}}
    <div class="analysis-section" *ngIf="report.strategic_insights?.length">
      <h2>{{report.strategic_insights.title}}</h2>
      <p>{{report.strategic_insights.description}}</p>

      <div class="insights-grid">
      {{#report.strategic_insights.items}}
        <div class="insight-card blue">
          <div class="insight-header">
            <span>{{ title }}</span>
            <div class="insight-type-tag">{{ insight_type }}</div>
          </div>
          <p>{{ analysis }}</p>
          <div class="action">IMMEDIATE ACTION<br><strong>{{ recommended_action }}</strong></div>
        </div>
        {{/report.strategic_insights.items}}
      </div>
    </div>
    {{/report.strategic_insights.title}}

    <!-- Next Steps -->
    {{#report.recommended_next_steps.title}}
    <div class="white-card" *ngIf="report.recommended_next_steps?.length">
      <div class="next-steps-wrapper">
        <h2>{{report.recommended_next_steps.title}}</h2>
        <p>{{report.recommended_next_steps.description}}</p>
        {{#report.recommended_next_steps.items}}
        <div class="step-card">
          <div class="step-top">
            <div class="step-icon">🎯</div>
            <div class="step-content">
              <div class="step-title">
                <h3>{{ title }}</h3>
                <span class="priority-tag">{{priority}}</span>
              </div>
              <p class="step-description">{{ action }}</p>
              <div class="step-details">
                <div>
                  <span class="label">OWNER</span>
                  <p class="value">{{ owner }}</p>
                </div>
                <div>
                  <span class="label">TIMELINE</span>
                  <p class="value">{{ timeline }}</p>
                </div>
                <div>
                  <span class="label">EXPECTED IMPACT</span>
                  <p class="value green">{{ expected_impact }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {{/report.recommended_next_steps.items}}
      </div>
      {{/report.recommended_next_steps.title}}

      <!-- Bottom Line -->
      {{#report.conclusion.title}}
      <div class="bottom-line-card" *ngIf="report.conclusion">
        <div class="bottom-line-inner">
          <h3>{{report.conclusion.title}}</h3>
          <p>{{ report.conclusion.description }}</p>
        </div>
      </div>
      {{/report.conclusion.title}}
    </div>


   <script>
  window.onload = function () {

      setTimeout(() => {
      Highcharts.chart('pie-chart', {
        chart: { type: 'pie' },
        credits: { enabled: false },
        title: { text: '{{report.campaignPerformanceAnalysis.title}}' },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: { enabled: true, format: '{point.name}' }
          }
        },
        series: {{{report.campaignPerformanceAnalysis.seriesString}}}
      });
    }, 0);
  };

    setTimeout(() => {
      Highcharts.chart('track-bar-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '{{report.trackContentEngagement.title}}' },
        xAxis: { categories: {{{report.trackContentEngagement.categoriesString}}} },
        series: {{{report.trackContentEngagement.seriesString}}}
      });
    }, 40);

    setTimeout(() => {
      Highcharts.chart('playbook-bar-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '{{report.playbookContentEngagementOverview.title}}' },
        xAxis: { categories: {{{report.playbookContentEngagementOverview.categoriesString}}} },
        series: {{{report.playbookContentEngagementOverview.seriesString}}}
      });
    }, 30);

    setTimeout(() => {
      Highcharts.chart('asset-bar-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '  ' },
        xAxis: { categories: {{{report.assetEngagementOverview.categoriesString}}} },
        series: {{{report.assetEngagementOverview.seriesString}}}
      });
    }, 0);

    setTimeout(() => {
      Highcharts.chart('dealPipelinePrograssion-bar-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '{{report.dealPipelinePrograssion.title}}' },
        xAxis: { categories: {{{report.dealPipelinePrograssion.categoriesString}}} },
        yAxis: { title: { text: '{{report.dealPipelinePrograssion.revenue}}' } },
        series: {{{report.dealPipelinePrograssion.seriesString}}}
      });
    }, 200);

</script>
</body>
</html>`;

 iframeCampaignContent: any = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ report?.meta?.report_title }}</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
    <!-- Funnel module -->
    <script src="https://code.highcharts.com/modules/funnel.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    /* ------------- ORIGINAL CSS — UNCHANGED ------------- */
    * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: {{theme.backgroundColor}}
        }

        .main-wrapper {
         width:100%
         margin: auto;
        }

        .header-card {
            background: linear-gradient(to bottom right,{{theme.darkHeaderColor}},{{theme.lightHeaderColor}});
            padding: 40px;
            color: white;
            margin-bottom: 30px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 30px;
        }

        .header-left h1 {
            font-size: 30px;
            font-weight: 800;
            margin-bottom: 8px;
        }

        .header-left h2 {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 6px;
        }

        .header-left p {
            color: {{theme.headertextColor}};  /* #bfdbfe;  */
            font-size: 14px;
            margin-bottom: 4px;
        }

        .header-left span {
            font-size: 14px;
            color: {{theme.headertextColor}};  /*  #cbd5e1;  */
        }

        .header-left h1,
        .header-left h2 {
            color: {{theme.headertextColor}};
        }

        .header-right {
            text-align: right;
            font-size: 14px;
        }

        .header-right span {
            display: block;
            color: {{theme.headertextColor}};    /* #cbd5e1;  */
        }

        .header-right h3 {
            font-size: 22px;
            font-weight: 700;
            color:  {{theme.headertextColor}};    /* white; */
            margin-top: 2px;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .owner-summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .owner-summary:not(:has(li)) {
            display: none;
        }

        .summary-item {
            text-align: center;
        }

        .summary-item h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .summary-item p {
            font-size: 16px;
            color: {{theme.headertextColor}};       /* #cbd5e1;  */
            margin-bottom: 4px;
        }

        .summary-item span {
            font-size: 13px;
            color: {{theme.headertextColor}};      /* #94a3b8; */
        }

        .green {
            color: {{theme.headerHeadingTextColor}}            /* #34d399; */
        }

        .yellow {
            color: #facc15;
        }

        .blue {
            color: #60a5fa;
        }

        .white-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
            margin-right: 30px;
            margin-left: 30px;
        }

        .white-card h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #0f172a;
        }

        .white-card p {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            text-align: left;
            padding: 14px 12px;
            vertical-align: top;
        }

        th {
            font-size: 14px;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
        }

        td {
            font-size: 14px;
            color: #0f172a;
            border-bottom: 1px solid #f1f5f9;
        }

        td b {
            font-weight: 600;
            color: #0f172a;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
            margin-right: 30px;
            margin-left: 30px;
        }

        .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .card:hover,
        .white-card:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .card h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .card p {
            font-size: 15px;
            color: rgb(71 85 105);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 10px;
        }

        .status-label {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
            color: #10b981;
        }

        .status-label::before {
            /* content: '↗'; */
            font-size: 15px;
            margin-right: 4px;
        }

        .card-value {
            font-size: 21px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .card-subtext {
            font-size: 13px;
            color: #64748b;
        }

        .dashboard {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-right: 30px;
            margin-left: 30px
        }

        .chart-img {
            width: 100%;
            border-radius: 8px;
            margin: 10px 0;
        }

        .bottom-metrics {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #374151;
            margin-top: 10px;
        }

        .bottom-metrics b {
            display: block;
            font-weight: 600;
        }

        /* --- Funnel Step Styles --- */
        .funnel-step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .funnel-left {
            display: flex;
            align-items: flex-start;
            flex: 1;
            min-width: 0;
        }

        .funnel-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 6px;
            flex-shrink: 0;
        }

        .funnel-info {
            flex: 1;
        }

        .funnel-title {
            font-weight: 600;
            font-size: 14px;
            color: #1f2937;
            display: block;
        }

        .funnel-sub {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
            display: block;
        }

        .funnel-bar {
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            margin-top: 6px;
            position: relative;
            overflow: hidden;
        }

        .bar-fill {
            height: 100%;
            border-radius: 4px;
        }

        .status {
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 10px;
            white-space: nowrap;
            margin-left: auto; /* Push to the right */
            margin-top: 4px;
            flex-shrink: 0;
        }

        .status.complete {
            background-color: #d1fae5;
            color: #065f46;
        }

        .status.progress {
            background-color: #dbeafe;
            color: #1d4ed8;
        }

        .status.pending {
            background-color: #f3f4f6;
            color: #6b7280;
        }

        .progress-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-weight: bold;
            font-size: 14px;
        }

        .progress-footer .blue {
            color: #3b82f6;
        }

        .progress-footer .green {
            color: #10b981;
        }

        .analysis-section {
            margin: 40px 0;
            padding: 30px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
   margin-right: 30px;
            margin-left: 30px
        }

        .analysis-section:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .analysis-section h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        .analysis-section p {
            color: rgb(71 85 105);
        }

        .insights-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }

        .insight-card {
            padding: 20px;
            border-radius: 12px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .insight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 16px;
            color: #1e293b;
        }

        .badge {
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 999px;
            font-weight: 600;
        }

        .badge.green {
            background: #d1fae5;
            color: #047857;
        }

        .badge.blue {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .badge.teal {
            background: #ccfbf1;
            color: #0f766e;
        }

        .badge.yellow {
            background: #fef3c7;
            color: #b45309;
        }

        .action-label {
            font-size: 12px;
            font-weight: bold;
            color: #6b7280;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .action {
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            background: rgba(0, 0, 0, 0.03);
            border-left: 4px solid #94a3b8;
            padding: 10px 12px;
            border-radius: 6px;
        }

        .action strong {
            display: block;
            margin-top: 4px;
            color: #0f172a;
            font-weight: 600;
        }

        .insight-card p {
            font-size: 14px;
            color: #334155;
            margin-bottom: 14px;
        }

        .insight-card.green {
            background: rgb(240 253 244);
            border: 1px solid rgb(187 247 208);
        }

        .insight-card.blue {
            background: rgb(239 246 255);
            border: 1px solid rgb(191 219 254);
        }

        .insight-card.teal {
            background: rgb(240 253 244);
            border: 1px solid rgb(187 247 208);
        }

        .insight-card.yellow {
            background: rgb(254 252 232);
            border: 1px solid rgb(254 240 138);
        }

        .next-steps-wrapper h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .next-steps-wrapper p {
            font-size: 15px;
            color: #64748b;
            margin-bottom: 24px;
        }

        .step-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            margin-bottom: 24px;
        }

        .step-card:hover {
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
        }

        .step-top {
            display: flex;
            gap: 16px;
            align-items: flex-start;
        }

        .step-icon {
            background-color: #f1f5ff;
            color: #3b82f6;
            font-size: 22px;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .step-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
        }

        .step-title h3 {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
        }

        .priority-tag {
            font-size: 12px;
            font-weight: 500;
            background-color: #fee2e2;
            color: #b91c1c;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .insight-type-tag {
            font-size: 12px;
            font-weight: 500;
            background-color: #e8c5ee;
            color: #7967eb;
            padding: 4px 10px;
            border-radius: 999px;
        }

        .step-description {
            font-size: 14px;
            color: #475569;
            line-height: 1.5;
        }

        .step-details {
            display: flex;
            justify-content: space-between;
            background-color: #f8fafc;
            padding: 16px 20px;
            border-radius: 10px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .step-details .label {
            font-size: 11px;
            font-weight: 500;
            color: #64748b;
            text-transform: uppercase;
            display: block;
            margin-bottom: 4px;
        }

        .step-details .value {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .step-details .green {
            color: #16a34a;
        }

        .bottom-line-card {
            background: linear-gradient(to right, {{theme.footerColor}},{{theme.footerColorTwo}});
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 30px 20px;
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .bottom-line-inner {
            max-width: 1000px;
            margin: auto;
        }

        .bottom-line-inner h3 {
            font-size: 18px;
            font-weight: 700;
            color: {{theme.footertextColor}};         /*   #0f172a */
            margin-bottom: 12px;
        }

        .bottom-line-inner p {
            font-size: 15px;
            color: {{theme.footertextColor}};      /*   #334155  */
            line-height: 1.6;
            margin-bottom: 24px;
        }

        .bottom-line-stats {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 40px;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .bottom-line-stats .green {
            color: #22c55e;
            font-weight: 600;
        }

        /* Tablet (768px to 1024px) */
        @media (max-width: 1024px) {
            .header-card {
                padding: 30px;
            }

            .header {
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 20px;
            }

            .header-right {
                text-align: left;
                margin-top: 20px;
            }

            .summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 2fr));
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .owner-summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 2fr));
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .white-card {
                padding: 20px;
            }

            th,
            td {
                padding: 10px 8px;
            }

            .cards-grid {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            }

            .dashboard {
                grid-template-columns: 1fr;
            }

            .insights-grid {
                grid-template-columns: 1fr;
            }

            .analysis-section {
                padding: 20px;
            }

            .step-card {
                padding: 20px;
            }

            .step-details {
                flex-direction: column;
            }

            .bottom-line-card {
                padding: 20px;
            }

            .bottom-line-stats {
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }

            /* Tablet-specific Funnel adjustments */
            .funnel-step {
                flex-direction: row;
                align-items: flex-start;
                justify-content: space-between;
            }

            .funnel-left {
                flex: 1;
                flex-basis: auto;
                justify-content: flex-start;
            }

            .funnel-info {
                flex: 1;
                padding-right: 10px;
            }

            .status {
                margin-left: auto;
                margin-top: 4px;
                align-self: flex-start;
            }
        }

        /* Mobile (up to 767px) */
        @media (max-width: 767px) {
            .header-card {
                padding: 20px;
            }

            .header-left h1 {
                font-size: 24px;
            }

            .header-left h2 {
                font-size: 16px;
            }

            .header-right h3 {
                font-size: 18px;
            }

            .summary {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                flex-direction: column;
                padding: 15px;
                gap: 15px;
            }

            .owner-summary  {
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                flex-direction: column;
                padding: 15px;
                gap: 15px;
            }

            .summary-item {
                flex-basis: 100%;
            }

            .summary-item h1 {
                font-size: 24px;
            }

            .summary-item p {
                font-size: 14px;
            }

            .white-card {
                padding: 15px;
            }

            th,
            td {
                font-size: 12px;
                padding: 8px 6px;
            }

            .cards-grid {
                grid-template-columns: 1fr;
            }

            .card {
                padding: 15px 20px;
            }

            .card h2 {
                font-size: 18px;
            }

            .card-value {
                font-size: 18px;
            }

            .bottom-metrics {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }

            .funnel-step {
                flex-direction: column;
                align-items: flex-start;
                text-align: left;
            }

            .funnel-left {
                width: 100%;
                flex-wrap: wrap;
                margin-bottom: 10px;
            }

            .funnel-dot {
                margin-right: 10px;
                margin-bottom: 0;
            }

            .funnel-info {
                flex: 1;
                min-width: 150px;
            }

            .status {
                margin-left: 0;
                margin-top: 10px;
                align-self: flex-start;
                width: auto;
            }

            .progress-footer {
                flex-direction: column;
                gap: 15px;
                text-align: center;
            }

            .analysis-section {
                padding: 15px;
            }

            .insights-grid {
                grid-template-columns: 1fr;
            }

            .insight-card {
                padding: 15px;
            }

            .insight-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;
            }

            .action {
                font-size: 12px;
                padding: 8px 10px;
            }

            .step-card {
                padding: 15px;
            }

            .step-top {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .step-icon {
                margin-bottom: 10px;
            }

            .step-title {
                flex-direction: column;
                text-align: center;
                gap: 5px;
            }

            .priority-tag {
                margin-top: 5px;
            }

            .step-details {
                flex-direction: column;
                padding: 10px 15px;
            }

            .bottom-line-inner h3 {
                font-size: 16px;
            }

            .bottom-line-inner p {
                font-size: 14px;
            }

            .bottom-line-stats {
                flex-direction: column;
                align-items: center;
                gap: 15px;
            }

            /* ── Contact-Journey Timeline ─────────────────────────────── */
            .timeline-card .timeline-wrapper {
             /*max-height: 260px; */
             /*overflow-y: auto; */
            margin: 20px 0;
            padding-right: 6px;             /* room for scrollbar */
            }

            .timeline-card-duplicate {
                margin-left: 0px !important; 
                margin-right: 0px !important; 
                margin-bottom: 10px !important; 
            }

            .timeline-card .timeline-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 16px;
            }

            .timeline-card .timeline-head {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 14px;
            color: #0f172a;
            }

            .timeline-card .timeline-head .date {
            min-width: 65px;
            color: #475569;
            }

            .timeline-card .timeline-body {
            font-size: 15px;
            color: #1e293b;
            }

            .timeline-card .badge.purple  { background:#ede9fe; color:#6d28d9; }
            .timeline-card .badge.dark    { background:#1e293b; color:#f8fafc; }

            .timeline-card .timeline-footer {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #e2e8f0;
            padding-top: 18px;
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            }

            .timeline-card .timeline-footer span {
            display: flex;
            gap: 4px;
            align-items: baseline;
            }
            .timeline-card .timeline-footer .blue  { color:#3b82f6; }
            .timeline-card .timeline-footer .green { color:#16a34a; }
            .timeline-card .timeline-footer .orange{ color:#ea580c; }
        }
        .timeline-card .timeline-item{
            background:#f8fafc;   /* ← the soft grey */
            border-radius:12px;
            padding:16px 20px;
            margin-bottom:16px;
        }

        .timeline-card .badge.purple  { background:#ede9fe; color:#6d28d9; }
        .timeline-card .badge.dark    { background:#1e293b; color:#f8fafc; }


        .stats-row {
            display: flex;
            justify-content: space-around;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            flex-wrap: wrap;
            gap: 15px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
        }

        .stat-value.blue { color: #3b82f6; }
        .stat-value.green { color: #10b981; }
        .stat-value.orange { color: #f59e0b; }

        .stat-label {
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 0.125rem;
        }

        .timeline-card-duplicate {
                margin-left: 0px !important; 
                margin-right: 0px !important; 
        }

    .owner-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px 40px;
      padding: 0;
    }

    .owner-list .full {
      grid-column: 1 / -1;
    }

    .owner-list .label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: {{theme.headerSubHeadingTextColor}};
      text-transform: uppercase;
      letter-spacing: .4px;
      margin-bottom: 2px;
    }

    .owner-list .value {
      font-size: 15px;
      font-weight: 600;
      color: {{theme.headertextColor}};
      line-height: 1.4;
      word-break: break-word;
    }
    
     .card-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .track-card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 0 1px #e1e8f0;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }

    .track-header {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .track-header.green {
      color: #16a34a;
    }

    .track-header.red {
      color: #dc2626;
    }

    .track-title {
      font-size: 18px;
      font-weight: 700;
      color: #000;
      margin-bottom: 10px;
    }

    .track-subtitle {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 20px;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 16px;
    }

    .stat-box {
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .opens {
      background-color: #e8f0fe;
      color: #2563eb;
    }

    .views {
      background-color: #e6f8ec;
      color: #16a34a;
    }

    .downloads {
      background-color:  #fffbea;
      color: #ca8a04;
    }

    .assets {
      background-color: #f5f3ff;
      color: #9333ea;
    }

    .stat-number {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
    }

    .progress-pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      width:fit-content;
    }

    .progress-green {
      background-color: #d1fae5;
      color: #16a34a;
    }

    .progress-red {
      background-color: #fee2e2;
      color: #dc2626;
    }

    /* ✅ Responsive Layout */
    @media (max-width: 768px) {
      .card-container {
        grid-template-columns: 1fr;
        padding: 6px;
      }
    }

    @media (max-width: 480px) {
      .track-card {
        padding: 20px;
      }

      .stat-box {
        padding: 16px;
      }

      .track-title {
        font-size: 16px;
      }

      .stat-number {
        font-size: 18px;
      }
    }
 
    .asset-summary-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-top: 35px;
    }

    .asset-card {
      background-color: #e8f5e833;
      border-radius: 12px;
      padding: 15px 20px;
      box-shadow: 0 0 0 1px #ecf4e8;
    }

    .asset-value {
      font-size: 28px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 7px;
    }

    .asset-label {
      font-size: 15px;
      color: #475569;
      margin-bottom: 4px;
    }

    .asset-subtext {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }

    @media (max-width: 480px) {
      .asset-value {
        font-size: 24px;
      }
      .asset-label {
        font-size: 14px;
      }
      .asset-subtext {
        font-size: 12px;
      }
    }
	
	 .kpi-container {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 30px;
      margin: 0 auto;
      margin-top: 40px;

    }

    .kpi-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 25px 35px;
      text-align: center;
    }

    .kpi-card h3 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
      color: #facc15;
    }

    .kpi-card p {
      margin-top: 8px;
      margin-bottom: 0px;
      font-size: 14px;
      color: #e0e0e0;
    }

     @media (max-width: 1024px) {
      .kpi-container {
        margin-top: 30px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .table-card {
      background: #ffffff;
      border-radius: 10px;
      padding: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      border: 1px solid #e5e7eb;
    }

    .table-card .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .table-card .card-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: #6b7280;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody td {
      padding: 16px 0;
      font-size: 15px;
      color: #111827;
      vertical-align: middle;
      border-bottom: 1px solid #f1f1f1;
    }

    .type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      color: white;
    }

    .type-badge.high {
      background-color: #8bc34a;
    }

    .type-badge.low {
      background-color: #ef5555;
    }

    .type-badge.medium {
      background-color: #1e90ff;
    }
   .text_center{
   text-align:center;}

     .asset-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .asset-item {
            display: flex;
            align-items: center;
            background-color: #f8fafc;
            /* Light background for each item */
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            border: 1px solid #eef2ff;
        }

        .asset-rank {
            background-color: #8bc34a;
            color: #ffffff;
            font-weight: 600;
            font-size: 14px;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .asset-name {
            flex-grow: 1;
            font-size: 16px;
            color: #1e293b;
            font-weight: 500;
            display:flex;
            align-items: center;
        }

        .asset-stats {
            display: flex;
            gap: 15px;
            font-size: 14px;
            font-weight: 600;
            white-space: nowrap;
        }

        .asset-opens {
            color: #3b82f6;
        }

        .asset-downloads {
            color: #3b82f6;
        }
    @media (max-width: 768px) {
            .asset-item {
                flex-direction: column;
                align-items: flex-start;
                padding: 12px 15px;
            }

            .asset-rank {
              margin-right: 10px;
            }

            .asset-name {
                margin-bottom: 10px;
            }

            .asset-stats {
                width: 100%;
                justify-content: space-between;
            }
        }

        @media (max-width: 480px) {
            .asset-rank {
                width: 24px;
                height: 24px;
                font-size: 12px;
            }

            .asset-name {
                font-size: 14px;
            }

            .asset-stats {
                font-size: 12px;
                gap: 10px;
            }
        }

    </style> 

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('.owner-summary').forEach(function (block) {
                if (!block.querySelector('li')) {
                    block.style.display = 'none';
                }
            });
        });
    </script>
</head>

<body>
  <div class="main-wrapper">

    <!-- Header Section -->
    <div class="header-card">
      <div class="header">
        <div class="header-left">
          <h1>{{ report.report_title }}</h1>
          <h2>{{ report.subtitle }}</h2>
           <!-- <span *ngIf="report.meta.date_range">Data range: {{ report.date_range }}</span> -->
        </div>
        <div class="header-right">
          <h3></h3>
        </div>
      </div>

        {{#report}}
                <div class="owner-summary" style="margin-bottom: 15px;">
                <ul class="owner-list">
                {{#report.campaign_name}}      <li><span class="label">Name</span>            <span class="value">{{report.campaign_name}}</span></li>{{/report.campaign_name}}
                {{#report.campaign_organized}}      <li><span class="label">Organized By</span>   <span class="value">{{report.campaign_organized}}</span></li>{{/report.campaign_organized}}
                {{#report.campaign_launch_date}}<li><span class="label">Launched Date</span>          <span class="value">{{report.campaign_launch_date}}</span></li>{{/report.campaign_launch_date}}
                {{#report.campaign_type}}       <li><span class="label">Campaign Type</span>            <span class="value">{{report.campaign_type}}</span></li>{{/report.campaign_type}}
                </ul>
            </div>
		<section class="qbr-banner">
          <div class="kpi-container">
            <div class="kpi-card">
              <h3>{{report.total_recipients}}</h3>
              <p>Total Recipients</p>
            </div>
            <div class="kpi-card">
              <h3>{{report.email_sent}}</h3>
              <p>Emails Sent</p>
            </div>
            <div class="kpi-card">
              <h3>{{report.click_through_rate}}</h3>
              <p>Click-through Rate</p>
            </div>
            <div class="kpi-card">
              <h3>{{report.deliverability_rate}}</h3>
              <p>Deliverability Rate</p>
            </div>
          </div>
        </section>
		 {{/report}}
    </div>

    {{#report.campaign_funnel_analysis.title}}
    <!-- Campaign Funnel -->
    <div class="white-card" *ngIf="report.summary_overview?.length">
     <h2>{{report.campaign_funnel_analysis.title}}</h2>
        <p>{{report.campaign_funnel_analysis.description}}</p>
        
        {{#report.campaign_funnel_analysis.items}}
        <div class="funnel-step">
          
            <div class="funnel-left">
                
              <div class="funnel-dot" style="background:#10b981;"></div>
              <div class="funnel-info">
                <span class="funnel-title">{{name}} ({{value}})</span>
                <div class="funnel-bar">
                  <div class="bar-fill" style="width:{{value}}%;background:#10b981;"></div>
                </div>
                <div class="funnel-sub">{{notes}}</div>
              </div>
            </div>
        </div>
		{{/report.campaign_funnel_analysis.items}}
    </div>
	{{/report.campaign_funnel_analysis.title}}
	

    <!-- Metric Cards -->
    <div class="cards-grid" *ngIf="report.performance_indicators">
     {{#report.performance_indicators.items}}
      <div class="card">
        <div class="card-header">
          {{name}}
          <div class="status-label" style="color:{{color}}">{{symbol}} {{rating}}</div>
        </div>
        <div class="card-value">{{ value }}</div>
        <div class="card-subtext">{{notes}}</div>
      </div>
       {{/report.performance_indicators.items}}
    </div>
  </div>
    
    

       
    <!-- Deliveray Status Bar-chat -->
    {{#report.deliveryStatusOverview}}
    <div class="white-card">
      <div style="widht:100%;height:99%" id="deliveryStatusOverview-bar-chart"></div>
     <div class="asset-summary-container">
    <!-- Card 1 -->
    <div class="asset-card">
      <div class="asset-value">{{report.deliveryStatusOverview.totalSent}}</div>
      <div class="asset-label">Total Sent</div>
    </div>

    <!-- Card 2 -->
    <div class="asset-card">
      <div class="asset-value">{{report.deliveryStatusOverview.deliveryRate}}</div>
      <div class="asset-label">Delivery Rate</div>
    </div>
  </div>
    </div>
    {{/report.deliveryStatusOverview}}

    <!-- Pie-chat -->
    {{#report.detailedRecipientAnalysis}}
    <div class="analysis-section">
      <h2>{{report.detailedRecipientAnalysis.title}}</h2>
      <table>
        <thead>
          <tr>
            <th>Recipient</th>
            <th class="text_center">Opens</th>
            <th class="text_center">Clicks</th>
			<th class="text_center">Engagement</th>
          </tr>
        </thead>
        <tbody>
          {{#report.detailedRecipientAnalysis.items}}
      <tr>
        {{#recipient}}
        <td>{{recipient}}</td>
        {{/recipient}}
        <td class="text_center">{{opens}}</td>
        <td class="text_center">{{clicks}}</td>
        <td class="text_center"><span class="{{engagementClass}}">{{engagement_level}}</span></td>
      </tr>
    {{/report.detailedRecipientAnalysis.items}}
        </tbody>
      </table>
     </div>
    {{/report.detailedRecipientAnalysis}}
    
      <!-- Bar-chat -->
    {{#report.topPerformingRecipients.title}}
    <div class="analysis-section">
      <div style="widht:100%;height:99%" id="leads-deals-chart"></div>
    </div>
    {{/report.topPerformingRecipients.title}}

    <!-- Strategic Insights & Analysis -->
    {{#report.strategic_insights.title}}
    <div class="analysis-section" *ngIf="report.strategic_insights?.length">
      <h2>{{report.strategic_insights.title}}</h2>
      <p>{{report.strategic_insights.description}}</p>

      <div class="insights-grid">
      {{#report.strategic_insights.items}}
        <div class="insight-card blue">
          <div class="insight-header">
            <span>{{ title }}</span>
            <div class="insight-type-tag">{{ insight_type }}</div>
          </div>
          <p>{{ analysis }}</p>
          <div class="action">IMMEDIATE ACTION<br><strong>{{ recommended_action }}</strong></div>
        </div>
        {{/report.strategic_insights.items}}
      </div>
    </div>
    {{/report.strategic_insights.title}}

    <!-- Next Steps -->
    {{#report.recommended_next_steps.title}}
    <div class="white-card" *ngIf="report.recommended_next_steps?.length">
      <div class="next-steps-wrapper">
        <h2>{{report.recommended_next_steps.title}}</h2>
        <p>{{report.recommended_next_steps.description}}</p>
        {{#report.recommended_next_steps.items}}
        <div class="step-card">
          <div class="step-top">
            <div class="step-icon">🎯</div>
            <div class="step-content">
              <div class="step-title">
                <h3>{{ title }}</h3>
                <span class="priority-tag">{{priority}}</span>
              </div>
              <p class="step-description">{{ action }}</p>
              <div class="step-details">
                <div>
                  <span class="label">OWNER</span>
                  <p class="value">{{ owner }}</p>
                </div>
                <div>
                  <span class="label">TIMELINE</span>
                  <p class="value">{{ timeline }}</p>
                </div>
                <div>
                  <span class="label">EXPECTED IMPACT</span>
                  <p class="value green">{{ expected_impact }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {{/report.recommended_next_steps.items}}
      </div>
      {{/report.recommended_next_steps.title}}

      <!-- Bottom Line -->
      {{#report.conclusion.title}}
      <div class="bottom-line-card" *ngIf="report.conclusion">
        <div class="bottom-line-inner">
          <h3>{{report.conclusion.title}}</h3>
          <p>{{ report.conclusion.description }}</p>
        </div>
      </div>
      {{/report.conclusion.title}}
    </div>

  <script>
  window.onload = function () {

      Highcharts.chart('deliveryStatusOverview-bar-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '{{report.deliveryStatusOverview.title}}' },
        xAxis: { categories: {{{report.deliveryStatusOverview.categoriesString}}} },
        yAxis: { title: { text: '' } },
        series: {{{report.deliveryStatusOverview.seriesString}}}
      });

    setTimeout(() => {
      Highcharts.chart('leads-deals-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '{{report.topPerformingRecipients.title}}' },
        xAxis: { categories: {{{report.topPerformingRecipients.categoriesString}}} },
        yAxis: { title: { text: '' } },
        series: {{{report.topPerformingRecipients.seriesString}}}
      });
    }, 200);

};
</script>
</body>
</html>`;



iframePartnerGroupContent: any = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QBR Dashboard & Strategic Recommendations</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      background-color: #f8f9fc;
      color: #333;
    }

    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
    }

    .logo-title {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logo {
      height: 50px;
    }

    .logo-title h1 {
      font-size: 20px;
      margin: 0;
      color: #333;
    }

    .logo-title p {
      margin: 4px 0 0;
      font-size: 14px;
      color: #555;
    }

    .report-info {
      text-align: right;
      font-size: 14px;
      color: #444;
    }

    .qbr-banner {
      background: linear-gradient(to right, #4b4e52, #0f92f5);
      color: #fff;
      text-align: center;
      padding: 50px 55px 40px;
    }

    .qbr-banner h2 {
      font-size: 28px;
      margin: 0 0 10px;
    }

    .qbr-banner p.banner-para {
      font-size: 16px;
      font-weight: 300;
      margin: 0 0 40px;
    }

    .kpi-container {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 30px;
      margin: 0 auto;
    }

    .kpi-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 25px 35px;
      text-align: center;
    }

    .kpi-card h3 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }

    .kpi-card p {
      margin-top: 8px;
      margin-bottom: 0px;
      font-size: 14px;
      color: #e0e0e0;
    }

    .section-padding {
      padding: 20px 55px 15px 55px;
      background-color: #f8f9fc;
    }

    .section-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .section-header p {
      font-size: 14px;
      color: #666;
      margin-top: 5px;
      margin-bottom: 30px;
    }

    .flex-container {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
    }

    .content-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
      flex: 1;
      min-width: 300px;
    }

    .chart-img {
      width: 100%;
      margin-top: 10px;
    }

    .content-card h4 {
      margin-bottom: 15px;
      margin-top: 0px;
    }

    .content-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .content-card li {
      margin-bottom: 10px;
      font-size: 14px;
    }

    .dot {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }

    .green-dot {
      background-color: #2ecc71;
    }

    .blue-dot {
      background-color: #3498db;
    }

    .gray-dot {
      background-color: #7f8c8d;
    }

    .grid-2-cols {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }

    .progress-group {
      margin-bottom: 22px;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #374151;
      margin-bottom: 6px;
    }

    .progress-bar {
      background-color: #e5e7eb;
      border-radius: 20px;
      height: 14px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 20px;
    }

    .bar-new {
      background-color: #10b981;
    }

    .bar-contacted {
      background-color: #3b82f6;
    }

    .bar-sql {
      background-color: #6366f1;
    }

    .bar-opps {
      background-color: #f59e0b;
    }

    .bar-wins {
      background-color: #ef4444;
    }

    .percentage-text {
      font-size: 12px;
      color: #6b7280;
      text-align: right;
      margin-top: 3px;
    }

    .analysis-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 20px;
    }

    .insight-block {
      border-left: 4px solid #10b981;
      background: #f9fafb;
      padding: 10px 12px;
      margin-bottom: 15px;
    }

    .insight-block.yellow-border {
      border-color: #fbbf24;
    }

    .insight-block.blue-border {
      border-color: #3b82f6;
    }

    .insight-title {
      font-weight: 600;
      color: #111827;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .insight-text {
      font-size: 13px;
      color: #4b5563;
    }

    .main-container {
      padding: 20px 55px 15px 55px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: #2d2d2d;
      margin-bottom: 8px;
    }

    .page-subtitle {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 24px;
    }

    .table-card {
      background: #ffffff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
      border: 1px solid #e5e7eb;
    }

    .table-card .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .table-card .card-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: #6b7280;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    tbody td {
      padding: 16px 0;
      font-size: 15px;
      color: #111827;
      vertical-align: middle;
      border-bottom: 1px solid #f1f1f1;
    }

    .type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      color: white;
    }

    .type-badge.strategic {
      background-color: #4b4b4b;
    }

    .type-badge.enterprise {
      background-color: #8bc34a;
    }

    .type-badge.growth {
      background-color: #1e90ff;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .recommendation-card {
      padding: 20px 24px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      background: #ffffff;
      border: 1px solid #e5e7eb;
    }

    .recommendation-card .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }

    .card-icon {
      width: 36px;
      height: 36px;
      background-color: #eff6ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-size: 18px;
      color: #2196f3;
    }

    .card-title-group {
      flex-grow: 1;
    }

    .recommendation-card .card-title {
      font-weight: 600;
      font-size: 16px;
      margin: 0;
      color: #1f2937;
    }

    .card-badges {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 600;
    }

    .status-badge.high {
      background-color: #f87171;
      color: #fff;
    }

    .status-badge.medium {
      background-color: #facc15;
      color: #111827;
    }

    .timestamp {
      color: #6b7280;
      font-weight: 500;
    }

    .card-description {
      font-size: 14px;
      color: #4b5563;
      margin-bottom: 12px;
    }

    .action-required {
      display: flex;
      align-items: flex-start;
      border-left: 4px solid #10b981;
      padding-left: 12px;
      margin-top: 8px;
    }

    .action-required span {
      display: block;
      font-weight: 600;
      color: #10b981;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .action-required p {
      margin: 0;
      font-size: 14px;
      color: #374151;
    }

    .footer {
      background: #4b5563;
      color: white;
      padding: 30px 20px;
      margin-top: 40px;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .footer-section {
      margin-bottom: 20px;
      min-width: 200px;
    }

    .footer-title {
      font-weight: 600;
      margin-bottom: 6px;
    }

    .footer-text {
      font-size: 14px;
      color: #e5e7eb;
    }

    .note-text {
        font-size: 14px;
        color: #666;
        margin-top: 5px;
    }

    @media (max-width: 1024px) {
      .kpi-container {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 900px) {

      .grid-2-cols,
      .flex-container {
        grid-template-columns: 1fr !important;
        display: grid;
      }
    }

    @media (max-width: 768px) {
      .card-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .kpi-container {
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }

      .top-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      .report-info {
        text-align: left;
      }

      .section-padding,
      .main-container {
        padding: 20px 25px 15px 25px;
      }
    }
  </style>
</head>

<body>
  <div class="top-header">
    <div class="logo-title">
      <div>
        <h1>{{ report.report_title }}</h1>
        <p>{{ report.subtitle }}</p>
      </div>
    </div>
    <div class="report-info">
      <div class="report-info">
          <span>Prepared for</span>
          <h3>{{ report.report_recipient }}</h3>
          <span>{{ report.report_owner }}</span>
      </div>
      
    </div>
  </div>
  
  <section class="qbr-banner" *ngIf="report.kpi_overview.items.length > 0">
    <h2>{{report.report_main_title}}</h2>
    <p class="banner-para">{{report.report_sub_heading}}</p>
    <div class="kpi-container">
        {{#report.kpi_overview.items}}
          <div class="kpi-card">
            <h3 class="green">{{ value }}</h3>
            <span>{{name}}</span>
            <p>{{notes}}</p>
          </div>
        {{/report.kpi_overview.items}}
    </div>
  </section>

  <section class="section-padding" *ngIf="report.deal_interactions_and_revenue_impact">
    <div class="section-header">
      <h3>{{ report.deal_interactions_and_revenue_impact.title }}</h3>
      <p>{{ report.deal_interactions_and_revenue_impact.description }}</p>
    </div>
    <div class="flex-container">

      <div class="content-card" *ngIf="report.deal_interactions_and_revenue_impact.top_partners_by_deal_value">
        <h4>{{ report.deal_interactions_and_revenue_impact.top_partners_by_deal_value.title }}</h4>
        <p>{{ report.deal_interactions_and_revenue_impact.top_partners_by_deal_value.description }}</p>
         
              
        <div>
         
            <div class="white-card">
              <h5>{{ report.deal_interactions_and_revenue_impact.top_partners_by_deal_value.title }}</h5>
              <p>{{ report.deal_interactions_and_revenue_impact.top_partners_by_deal_value.description }}</p>
        
              <div style="width:100%;height:99%" id="top_partners_by_deal_value-bar-chart"></div>
                
            </div>
          
        </div>
        
      </div>



    <div class="content-card" *ngIf="report.deal_interactions_and_revenue_impact.key_insights.items.length > 0">
        <h4>{{ report.deal_interactions_and_revenue_impact.key_insights.title }}</h4>
        <p>{{ report.deal_interactions_and_revenue_impact.key_insights.description }}</p>
        <div>
          {{#report.deal_interactions_and_revenue_impact.key_insights.items}}
            <div>
                <span class="dot blue-dot"></span>
                <span class="note-text">{{name}}</span> - <span class="note-text">{{notes}}</span>
            </div>
            </br>
          {{/report.deal_interactions_and_revenue_impact.key_insights.items}}
        </div>
      </div>
    </div>
  </section>

  <section class="section-padding" *ngIf="report.lead_lifecycle_and_qualification_funnel.lead_progression_funnel.lead_progression_funnel.items.length > 0">
    <div class="section-header">
      <h3>{{ report.lead_lifecycle_and_qualification_funnel.title }}</h3>
      <p>{{ report.lead_lifecycle_and_qualification_funnel.description }}</p>
    </div>
   
    <div class="grid-2-cols">
      <div class="content-card" *ngIf="report.lead_lifecycle_and_qualification_funnel.lead_progression_funnel">
        <h4>{{ report.lead_lifecycle_and_qualification_funnel.lead_progression_funnel.title }}</h4>
        <p>{{ report.lead_lifecycle_and_qualification_funnel.lead_progression_funnel.description }}</p>
       
        <div class="progress-group">
          {{#report.lead_lifecycle_and_qualification_funnel.lead_progression_funnel.items}}
            <div class="progress-header"><span>{{name}}</span> 
                <span> total of {{count}} leads
                <span class="percentage-text">({{conversion_rate}}%)</span></span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill bar-contacted" style="width: {{conversion_rate}}"></div>
            </div>
            <span class="note-text"> {{notes}} </span>
          {{/report.lead_lifecycle_and_qualification_funnel.lead_progression_funnel.items}}
        </div>
      </div>

      <div class="content-card" *ngIf="report.lead_lifecycle_and_qualification_funnel.funnel_analysis.items.length > 0">
        <div class="analysis-title">{{ report.lead_lifecycle_and_qualification_funnel.funnel_analysis.title }}</div>
        <p>{{ report.lead_lifecycle_and_qualification_funnel.funnel_analysis.description }}</p>
            
        <div>
          {{#report.lead_lifecycle_and_qualification_funnel.funnel_analysis.items}}
            <div class="insight-block blue-border">
                <div class="insight-title">{{name}}</div>
                <div class="insight-text">{{notes}}</div>
            </div>
            </br>
          {{/report.lead_lifecycle_and_qualification_funnel.funnel_analysis.items}}
        </div>
      </div>
    </div>
  </section>
 

  <div class="main-container" *ngIf="report.partner_analytics_strategic_revenue_drivers.items.length > 0">
    <div class="page-title">{{ report.partner_analytics_strategic_revenue_drivers.title }}</div>
    <div class="page-subtitle">{{ report.partner_analytics_strategic_revenue_drivers.description }}</div>
    <div class="table-card" *ngIf="report.partner_analytics_strategic_revenue_drivers.items"> 
      <div class="card-title">Strategic Partner Performance Matrix</div>
      <div class="card-subtitle">Revenue contribution and deal metrics by partner tier</div>
      <table>
        <thead>
          <tr>
            <th>Partner Company</th>
            <th>Total Deals</th>
            <th>Deal Value</th>
            <th>Avg Deal Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {{#report.partner_analytics_strategic_revenue_drivers.items}}
                <td>{{partner_company}}</td>
                <td>{{total_deals}}</td>
                <td>{{deal_value}}</td>
                <td>{{avg_deal_size}}</td>
            {{/report.partner_analytics_strategic_revenue_drivers.items}}
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="main-container" *ngIf="report.c_suite_strategic_recommendations.items.length > 0">
    <div class="page-title">{{ report.c_suite_strategic_recommendations.title }}</div>
    <div class="page-subtitle">{{ report.c_suite_strategic_recommendations.description }}</div>

    <div class="card-grid" *ngIf="report.c_suite_strategic_recommendations.items">
      <div class="recommendation-card">
        {{#report.c_suite_strategic_recommendations.items}}
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-users h-5 w-5 sm:h-6 sm:w-6 text-versa-blue">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="card-title-group">
            <div class="card-title">{{title}}</div>
            <div class="card-badges">
              <span class="status-badge high">{{priority}}</span>
              <span class="timestamp">{{timeline}}</span>
            </div>
          </div>
        </div>
        <div class="card-description">
          {{summary}}
        </div>
        <div class="action-required">
          <div>
            <span>Action Required:</span>
            <p>{{action_required}}</p>
          </div>
        </div>
        {{/report.c_suite_strategic_recommendations.items}}
      </div>

      
    </div>
  </div>

  <div class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-title">Strategic Contact</div>
        <div class="footer-text">
          {{report.report_recipient}}<br>
          {{report.report_owner}}
        </div>
      </div>
      
      <div class="footer-section">
        <div class="footer-title">Data Sources</div>
        <div class="footer-text">
          <br>
          Partner Portal Analytics
        </div>
      </div>
    </div>
  </div>




  <script>
      Highcharts.chart('bar-chart', {
          chart: { type: 'column' },
          credits:{ enabled: false },
          title: { text: '{{report.top_partners_by_deal_value.title}}' },
          xAxis: { categories: {{{report.top_partners_by_deal_value.categoriesString}}} },
          yAxis: { title: { text: '{{report.top_partners_by_deal_value.revenue}}' } },
          series: {{{report.top_partners_by_deal_value.seriesString}}}
      });

      setTimeout(() => {
        Highcharts.chart('top_partners_by_deal_value-bar-chart', {
        chart: { type: 'column' },
        credits: { enabled: false },
        title: { text: '{{reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.title}}' },
        xAxis: { categories: {{{reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.categoriesString}}} },
        yAxis: { title: { text: '{{reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.revenue}}' } },
        series: {{{reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.seriesString}}}
        });
      }, 200);

      Highcharts.chart('pie-chart', {
          chart: { type: 'pie' },
          credits:{ enabled: false },
          title: { text: '{{report.campaignPerformanceAnalysis.title}}' },
          plotOptions: {
            pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: { enabled: true, format: '{point.name}' }
                }
          },
          series: {{{report.campaignPerformanceAnalysis.seriesString}}}
      });
  </script>
</body>
</html>`;



    constructor(private sanitizer: DomSanitizer, public chatGptSettingsService: ChatGptSettingsService) { }

    ngOnInit(): void {
        this.loadColorConfiguration();
    }

    loadColorConfiguration(): void {
        this.chatGptSettingsService.getOliverReportColors()
        .subscribe(
            (res: any) => {
                const apiTheme = (res && res.statusCode === 200 && res.data) ? res.data : {};
                this.theme = {
                    backgroundColor: this.safe(apiTheme.backgroundColor, this.DEFAULT_THEME.backgroundColor),
                    buttonColor: this.safe(apiTheme.buttonColor, this.DEFAULT_THEME.buttonColor),
                    footerColor: this.safe(apiTheme.footerColor, this.DEFAULT_THEME.footerColor),
                    footerColorTwo: this.safe(apiTheme.footerColor, this.DEFAULT_THEME.footerColorTwo),
                    textColor: this.safe(apiTheme.textColor, this.DEFAULT_THEME.textColor),
                    headerColor: this.safe(apiTheme.headerColor, this.DEFAULT_THEME.headerColor),
                    lightHeaderColor: this.safe(apiTheme.lightHeaderColor, this.DEFAULT_THEME.lightHeaderColor),
                    darkHeaderColor: this.safe(apiTheme.darkHeaderColor, this.DEFAULT_THEME.darkHeaderColor),
                    gradientFrom: this.safe(apiTheme.gradientFrom, this.DEFAULT_THEME.gradientFrom),
                    gradientTo: this.safe(apiTheme.gradientTo, this.DEFAULT_THEME.gradientTo),
                    logocolor1: this.safe(apiTheme.logoColor1, this.DEFAULT_THEME.logoColor1),
                    logocolor2: this.safe(apiTheme.logoColor2, this.DEFAULT_THEME.logoColor2),
                    logocolor3: this.safe(apiTheme.logoColor3, this.DEFAULT_THEME.logoColor3),
                    footertextColor: this.safe(apiTheme.footertextColor, this.DEFAULT_THEME.footertextColor),
                    headertextColor: this.safe(apiTheme.headertextColor, this.DEFAULT_THEME.headertextColor),
                    headerHeadingTextColor: this.safe(apiTheme.headerHeadingTextColor, this.DEFAULT_THEME.headerHeadingTextColor),
                    headerSubHeadingTextColor: this.safe(apiTheme.headerSubHeadingTextColor, this.DEFAULT_THEME.headerSubHeadingTextColor)
                };
                this.buildIframe();
            },
            (err: any) => this.handleError('Error fetching colour data', err)
        );
    }

    handleError(message: string, error: any): void {
        console.error(message, error);
        this.theme = Object.assign({}, this.DEFAULT_THEME);
        if (this.reportData) { this.buildIframe(); }
    }

    buildIframe(): void {
        if (!this.reportData || !this.theme.lightHeaderColor) { return; }
        let iframeContentData =  this.iframeContent;
        if (this.activeTab === 'partneragent' && !this.isFromGroupOfPartners || this.intent == 'partner') {
            iframeContentData = this.iframePartnerContent;
        } else if (this.activeTab === 'partneragent' && this.isFromGroupOfPartners) {
            iframeContentData = this.iframePartnerGroupContent;
        } else  if (this.activeTab === 'campaignagent' || this.intent == 'campaign') {
            iframeContentData = this.iframeCampaignContent;
        } else {
            iframeContentData = this.iframeContent;
        }
        const merged = Mustache.render(iframeContentData, {
            report: this.reportData,
            theme: this.theme
        });

        if (this.safeUrl) {
            URL.revokeObjectURL(
                (this.safeUrl as any).changingThisBreaksApplicationSecurity
            );
        }
        const url = URL.createObjectURL(new Blob([merged], { type: 'text/html' }));
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

  downloadIframeAsHTML() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    const htmlContent = doc.documentElement.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadIframeAsDOC() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (!doc) return;

    const content = doc.body.innerHTML;
    const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'></head><body>`;
    const footer = "</body></html>";
    const source = header + content + footer;
    const blob = new Blob([source], { type: 'application/msword' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.doc';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ✅ Download as PDF using print-to-PDF
  downloadIframeAsPDF() {
    const iframe = this.iframeRef.nativeElement as HTMLIFrameElement;
    const iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
      iframeWindow.focus();
      iframeWindow.print(); // Triggers browser "Save as PDF"
    }
  }

    ngAfterViewInit(): void {

        const ratingColors = {
            Poor: '#ef4444',       // red
            Low: '#ef4444',
            Medium: '#f97316',     // orange
            Average: '#f97316',
            Moderate: '#f97316',
            Excellent: '#10b981',   // green
            High: '#10b981'
        };

        const ratingSymbols = {
            Poor: '↘',
            Low: '↘', 
            Medium: '→',
            Average: '→', 
            Moderate: '→',
            Excellent: '↗',
            High: '↗'
        };

        const engagementColors = {
            Lowest: '#ef4444',       // red
            Highest: '#10b981'
        };

      if (this.isFromGroupOfPartners) {
        this.reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.categoriesString =
          JSON.stringify(this.reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.categories);
        this.reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.seriesString =
          JSON.stringify(this.reportData.deal_interactions_and_revenue_impact.top_partners_by_deal_value.series);
      } else {
        const engagementClasses = {
            Low: 'type-badge low',       // red
            High: 'type-badge high',
            Medium: 'type-badge medium',     // orange
        };

        this.reportData.performance_indicators.items = this.reportData.performance_indicators.items.map(item => {
          return {
            ...item,
            color: ratingColors[item.rating] || '#6b7280',
            symbol: ratingSymbols[item.rating] || '•'
          };
        });

        this.reportData.trackEngagementAnalysis.items = this.reportData.trackEngagementAnalysis.items.map(item => {
          return {
            ...item,
            engagementColor: engagementColors[item.engagement_level] || '#6b7280'
          };
        });

        this.reportData.detailedRecipientAnalysis.items = this.reportData.detailedRecipientAnalysis.items.map(item => {
            return {
                ...item,
                engagementClass: engagementClasses[item.engagement_level] || ''
            };
        });

        this.reportData.playbookContentEngagementOverview.categoriesString =
          JSON.stringify(this.reportData.playbookContentEngagementOverview.categories);
        this.reportData.playbookContentEngagementOverview.seriesString =
            JSON.stringify(this.reportData.playbookContentEngagementOverview.series);
        this.reportData.dealPipelinePrograssion.categoriesString =
            JSON.stringify(this.reportData.dealPipelinePrograssion.categories);
        this.reportData.dealPipelinePrograssion.seriesString =
            JSON.stringify(this.reportData.dealPipelinePrograssion.series);
        this.reportData.campaignPerformanceAnalysis.seriesString =
            JSON.stringify(this.reportData.campaignPerformanceAnalysis.series);
        this.reportData.trackContentEngagement.categoriesString =
            JSON.stringify(this.reportData.trackContentEngagement.categories);
        this.reportData.trackContentEngagement.seriesString =
            JSON.stringify(this.reportData.trackContentEngagement.series);
        this.reportData.assetEngagementOverview.categoriesString =
            JSON.stringify(this.reportData.assetEngagementOverview.categories);
        this.reportData.assetEngagementOverview.seriesString =
            JSON.stringify(this.reportData.assetEngagementOverview.series);
        this.reportData.deliveryStatusOverview.categoriesString =
            JSON.stringify(this.reportData.deliveryStatusOverview.categories);
        this.reportData.deliveryStatusOverview.seriesString =
            JSON.stringify(this.reportData.deliveryStatusOverview.series);
        this.reportData.topPerformingRecipients.categoriesString =
            JSON.stringify(this.reportData.topPerformingRecipients.categories);
        this.reportData.topPerformingRecipients.seriesString =
            JSON.stringify(this.reportData.topPerformingRecipients.series);
        }
        this.buildIframe();
    }

    safe<T>(value: T, fallback: T): T {
        if (value === null || value === undefined) { return fallback; }
        if (typeof value === 'string' && value.trim() === '') { return fallback; }
        return value;
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

  // private createLeadPipelineChart(): void {
  //   if (!this.leadPipelineChartRef || !this.leadPipelineChartRef.nativeElement || !this.reportData || !this.reportData.leads.lead_records.length) {
  //     console.warn('Lead pipeline chart: Not enough data or canvas not found.');
  //     return;
  //   }

  //   const stageCounts: { [key: string]: number } = {};
  //   this.reportData.leads.lead_records.forEach(lead => {
  //     stageCounts[lead.pipeline_stage] = (stageCounts[lead.pipeline_stage] || 0) + 1;
  //   });

  //   const labels = Object.keys(stageCounts);
  //   const dataValues = Object.keys(stageCounts).map(key => stageCounts[key]);


  //   new Chart(this.leadPipelineChartRef.nativeElement, {
  //     type: 'pie',
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         data: dataValues,
  //         backgroundColor: labels.map((_, i) => this.chartColors[i % this.chartColors.length]),
  //         hoverOffset: 8,
  //         borderColor: '#fff',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       legend: {
  //         position: 'bottom',
  //         labels: {
  //           padding: 15,
  //           boxWidth: 12,
  //           fontFamily: 'Arial',
  //         }
  //       },
  //       tooltips: {
  //         callbacks: {
  //           label: (tooltipItem: any, dt: any) => {
  //             const dataset = dt.datasets[tooltipItem.datasetIndex];
  //             const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
  //             const currentValue = dataset.data[tooltipItem.index];
  //             const percentage = Math.floor(((currentValue / total) * 100) + 0.5);
  //             return `${dt.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
  //           }
  //         }
  //       },
  //       title: {
  //         display: false
  //       }
  //     }
  //   });
  // }

  // private createDealAmountBarChart(): void {
  //   if (!this.dealAmountBarChartRef || !this.dealAmountBarChartRef.nativeElement || !this.reportData || !this.reportData.deals.deal_records.length) {
  //     console.warn('Deal amount chart: Not enough data or canvas not found.');
  //     return;
  //   }

  //   const dealData = this.reportData.deals.deal_records
  //     .filter(deal => deal.amount > 0)
  //     .map(deal => ({
  //       name: deal.title.length > 15 ? `${deal.title.substring(0, 15)}...` : deal.title,
  //       amount: deal.amount,
  //     }));

  //   if (dealData.length === 0) {
  //     console.warn('Deal amount chart: No deals with amount > 0 found to display.');
  //     if (this.dealAmountBarChartRef.nativeElement.getContext('2d')) {
  //       const ctx = this.dealAmountBarChartRef.nativeElement.getContext('2d');
  //       ctx.font = "14px Arial";
  //       ctx.textAlign = "center";
  //       ctx.fillText("No deal amounts to display.", this.dealAmountBarChartRef.nativeElement.width / 2, this.dealAmountBarChartRef.nativeElement.height / 2);
  //     }
  //     return;
  //   }


  //   const labels = dealData.map(d => d.name);
  //   const dataValues = dealData.map(d => d.amount);

  //   const formatCurrencyForAxis = (value: number) => {
  //     if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  //     if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  //     return value.toString();
  //   };

  //   new Chart(this.dealAmountBarChartRef.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         label: 'Deal Amount (USD)',
  //         data: dataValues,
  //         backgroundColor: this.chartColors[0],
  //         borderColor: this.chartColors[0],
  //         borderWidth: 1,
  //         hoverBackgroundColor: 'rgba(0, 123, 255, 0.7)'
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       legend: { display: false },
  //       scales: {
  //         xAxes: [{
  //           ticks: {
  //             autoSkip: false,
  //             maxRotation: 45,
  //             minRotation: 30,
  //             fontFamily: 'Arial',
  //             fontSize: 10,
  //           },
  //           gridLines: { display: false }
  //         }],
  //         yAxes: [{
  //           ticks: {
  //             beginAtZero: true,
  //             fontFamily: 'Arial',
  //             fontSize: 10,
  //             callback: (value: number) => formatCurrencyForAxis(value)
  //           },
  //           gridLines: {
  //             color: "rgba(200, 200, 200, 0.3)",
  //           }
  //         }]
  //       },
  //       tooltips: {
  //         callbacks: {
  //           label: (tooltipItem: any, dt: any) => {
  //             const amount = dt.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
  //             return `Amount: ${this.formatDisplayCurrency(Number(amount))}`;
  //           }
  //         }
  //       },
  //       title: {
  //         display: false
  //       }
  //     }
  //   });
  // }

  // private createCampaignTypePieChart(): void {
  //   if (!this.campaignTypePieChartRef || !this.campaignTypePieChartRef.nativeElement || !this.reportData || !this.reportData.campaigns.campaign_records.length) {
  //     console.warn('Campaign type chart: Not enough data or canvas not found.');
  //     return;
  //   }

  //   const typeCounts: { [key: string]: number } = {};
  //   this.reportData.campaigns.campaign_records.forEach(campaign => {
  //     typeCounts[campaign.campaign_type] = (typeCounts[campaign.campaign_type] || 0) + 1;
  //   });

  //   const labels = Object.keys(typeCounts);
  //   const dataValues = Object.keys(typeCounts).map(key => typeCounts[key]);


  //   new Chart(this.campaignTypePieChartRef.nativeElement, {
  //     type: 'pie',
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         data: dataValues,
  //         backgroundColor: labels.map((_, i) => this.chartColors[(i + 2) % this.chartColors.length]), // Offset colors
  //         hoverOffset: 8,
  //         borderColor: '#fff',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       legend: {
  //         position: 'bottom',
  //         labels: {
  //           padding: 15,
  //           boxWidth: 12,
  //           fontFamily: 'Arial',
  //         }
  //       },
  //       tooltips: {
  //         callbacks: {
  //           label: (tooltipItem: any, dt: any) => {
  //             const dataset = dt.datasets[tooltipItem.datasetIndex];
  //             const total = dataset.data.reduce((acc: number, val: number) => acc + val, 0);
  //             const currentValue = dataset.data[tooltipItem.index];
  //             const percentage = Math.floor(((currentValue / total) * 100) + 0.5);
  //             return `${dt.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
  //           }
  //         }
  //       },
  //       title: {
  //         display: false
  //       }
  //     }
  //   });
  // }

}

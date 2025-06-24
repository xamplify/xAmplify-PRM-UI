import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { ExecutiveReport } from 'app/common/models/oliver-report-dto';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as Mustache from 'mustache';

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

  public currentYear: number = new Date().getFullYear();

  safeUrl: SafeResourceUrl;

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
            background: #f1f5f9;
        }

        .main-wrapper {
         width:100%
         margin: auto;
        }

        .header-card {
            background: linear-gradient(to right, #0f172a, #1e3a8a);
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
            color: #bfdbfe;
            font-size: 14px;
            margin-bottom: 4px;
        }

        .header-left span {
            font-size: 14px;
            color: #cbd5e1;
        }

        .header-right {
            text-align: right;
            font-size: 14px;
        }

        .header-right span {
            display: block;
            color: #cbd5e1;
        }

        .header-right h3 {
            font-size: 22px;
            font-weight: 700;
            color: white;
            margin-top: 2px;
        }

        .summary {
            display: flex;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 24px 0 rgba(30, 41, 59, 0.08);
            backdrop-filter: blur(4px);
            border-radius: 16px;
            padding: 25px 20px;
        }

        .summary-item {
            text-align: center;
            flex: 1;
        }

        .summary-item h1 {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .summary-item p {
            font-size: 16px;
            color: #cbd5e1;
            margin-bottom: 4px;
        }

        .summary-item span {
            font-size: 13px;
            color: #94a3b8;
        }

        .green {
            color: #34d399;
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
           margin-left: 30px
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
            content: '↗';
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
            background: linear-gradient(to right, #f0fdf4, #f0f9ff);
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
            color: #0f172a;
            margin-bottom: 12px;
        }

        .bottom-line-inner p {
            font-size: 15px;
            color: #334155;
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
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }

            .summary-item {
                flex-basis: 48%;
                /* Two items per row */
            }

            .white-card {
                padding: 20px;
            }

            table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
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
        }
  </style>
</head>

<body>
  <div class="main-wrapper">

    <!-- Header Section -->
    <div class="header-card">
      <div class="header">
        <div class="header-left">
          <h1>{{ report.report_title }}</h1>
          <h2>{{ report.subtitle }}</h2>
          <span *ngIf="report.meta.date_range">Data range: {{ report.date_range }}</span>
        </div>
        <div class="header-right">
          <span>Prepared for</span>
          <h3>{{ report.report_recipient }}</h3>
          <span>{{ report.report_owner }}</span>
        </div>
      </div>
      <div class="summary" *ngIf="report.kpi_overview">
      {{#report.kpi_overview.items}}
        <div class="summary-item">
          <h1 class="green">{{ name }}</h1>
          <p>{{value}}</p>
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
          <div class="status-label">{{rating}}</div>
        </div>
        <div class="card-value">{{ value }}</div>
        <div class="card-subtext">{{notes}}</div>
      </div>
      {{/report.performance_indicators.items}}
    </div>

    <!-- Strategic Insights & Analysis -->
    <div class="analysis-section" *ngIf="report.strategic_insights?.length">
      <h2>{{report.strategic_insights.title}}</h2>
      <p>{{report.strategic_insights.description}}</p>

      <div class="insights-grid">
      {{#report.strategic_insights.items}}
        <div class="insight-card" [ngClass]="{
              'green': insight_type === 'High Conversion',
              'blue': insight_type === 'Revenue Opportunity' || insight_type === 'Positive Trend',
              'teal': insight_type === 'Proven Strategy',
              'yellow': insight_type === 'Opportunity for Growth' }">
          <div class="insight-header">
            <span>{{ title }}</span>
            <div class="badge" [ngClass]="{
                  'green': insight_type === 'High Conversion',
                  'blue': insight_type === 'Revenue Opportunity' || insight_type === 'Positive Trend',
                  'teal': insight_type === 'Proven Strategy',
                  'yellow': insight_type === 'Opportunity for Growth' }">{{ insight_type }}</div>
          </div>
          <p>{{ analysis }}</p>
          <div class="action">IMMEDIATE ACTION<br><strong>{{ recommended_action }}</strong></div>
        </div>
        {{/report.strategic_insights.items}}
      </div>
    </div>

    <!-- Next Steps -->
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

      <!-- Bottom Line -->
      <div class="bottom-line-card" *ngIf="report.conclusion">
        <div class="bottom-line-inner">
          <h3>{{report.conclusion.title}}</h3>
          <p>{{ report.conclusion.description }}</p>
        </div>
      </div>
    </div>

  </div>
</body>

</html>`;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
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
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not loaded. Please ensure it is included globally in your Angular project (e.g., in angular-cli.json scripts or index.html).');
      return;
    }
    setTimeout(() => {
      // this.createLeadPipelineChart();
      // this.createDealAmountBarChart();
      // this.createCampaignTypePieChart();
    }, 0);
    const mergedContent = Mustache.render(this.iframeContent, { report: this.reportData });
    const blob = new Blob([mergedContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

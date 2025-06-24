export interface ExecutiveReport {
  meta?: {
    report_title?: string;
    subtitle?: string;
    date_range?: string;
    report_owner?: string;
    report_recipient?: string;
  };
  kpi_overview?: {
    total_pipeline_value?: string;
    number_of_leads_generated?: number;
    number_of_campaigns_launched?: number;
    number_of_deals_logged?: number;
    total_deal_value?: string;
  };
  executive_summary_table?: Array<{ KPI: string; Volume: any; Trend: string }>;
  performance_indicators?: { [key: string]: any };
  campaign_performance_analysis?: { [key: string]: any };
  lead_progression_funnel?: { [key: string]: any };
  pipeline_progression?: { [key: string]: any };
  contact_journey_timeline?: Array<{ [key: string]: any }>;
  strategic_insights?: Array<{ [key: string]: any }>;
  recommended_next_steps?: Array<{ [key: string]: any }>;
  executive_bottom_line?: string;

}
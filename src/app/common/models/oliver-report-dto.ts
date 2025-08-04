export interface ExecutiveReport {
  /* -------- top-level meta -------- */
  report_title:      string;
  subtitle:          string;
  date_range:        string;
  report_owner:      string;
  report_recipient:  string;
  campaign_name : string;
  campaign_organized: string;
  campaign_launch_date: string;
  campaign_type: string;
  total_recipients: string;
  email_sent : string;
  click_through_rate: string;
  deliverability_rate: string;

  owner_details: OwnerDetails;

  /* -------- sections -------- */
  kpi_overview:            OverviewSection<KPIItem>;
  summary_overview:        OverviewSection<KPIItem>;
  performance_indicators:  OverviewSection<PerformanceIndicatorItem>;

  campaign_performance_analysis: CampaignPerformanceAnalysis;

  lead_progression_funnel: OverviewSection<KPIItem>;
  campaign_funnel_analysis : OverviewSection<KPIItem>;
  pipeline_progression:    PipelineProgression;

  contact_journey_timeline: OverviewSection<ContactJourney>;

  strategic_insights:       OverviewSection<StrategicInsightItem>;
  recommended_next_steps:   OverviewSection<RecommendedNextStepItem>;

  conclusion: Conclusion;

  dealPipelinePrograssion: DealPipelineProgression;
  campaignPerformanceAnalysis: CampaignPerformanceAnalysisData;
  trackContentEngagement  : TrackContentEngagement;
  trackEngagementAnalysis : TrackEngagementAnalysis<TrackEngagementAnalysisItem>;
  playbookContentEngagementOverview : PlayBookContentEngagementOverview;
  assetEngagementOverview : AssetEnagementOverview;
  deliveryStatusOverview : DeliveryStatusOverview;
  detailedRecipientAnalysis : DetailedRecipientAnalysis<DetailedRecipientAnalysisItem>;
  topPerformingRecipients : TopPerformingRecipients<TopPerformingRecipientsItems>;

}

/* ----------  Re-usable building blocks ---------- */

/** Generic “title / description / items” wrapper used by many sections */
export interface OverviewSection<TItem> {
  title: string;
  description: string;
  items: TItem[];
}

/* ----------  Simple item types  ---------- */

export interface KPIItem {
  name: string;
  value: string | number;
  notes: string;
}

export interface PerformanceIndicatorItem extends KPIItem {
  rating: string;
}

export interface StrategicInsightItem {
  title: string;
  insight_type: string;
  analysis: string;
  recommended_action: string;
}

export interface RecommendedNextStepItem {
  title: string;
  priority: string;          // e.g. “P1 Priority”
  action: string;
  owner: string;
  timeline: string;
  expected_impact: string;
}

/* ----------  Complex nested blocks  ---------- */

export interface CampaignPerformanceAnalysis {
  top_performing_campaign_type: string;
  campaign_engagement_state: {
    connected: number;
    idle: number;
    other: number;
  };
  notes: string;
}

export interface LeadProgressionFunnel<TItem> {
  title: string;
  description: string;
  items: TItem[];
  // stages: {
  //   [stageName: string]: {
  //     count: number;
  //     /** Only the first stage has response_rate – keep both optional */
  //     response_rate?: string;
  //     conversion_rate?: string;
  //   };
  // };
  // notes: string;
}

export interface PipelineProgression {
  deal_stages: {
    [stageName: string]: {
      count: number;
      value: string;
    };
  };
  highest_deal_value: string;
  average_deal_value: string;
  notes: string;
}

export interface ContactJourney {
  date: string;         // ISO date string
  interaction: string;
  status: string;
}

export interface Conclusion {
  title: string;
  description: string;
}

export interface DealPipelineProgression {
  title: string;
  categories: string[];
  revenue: string;
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
  average_deal_value: string;
  highest_deal_value: string
}
export interface OverviewSection<TItem> {
  title:       string;
  description: string;
  items:       TItem[];
}
export interface ExecutiveReport {
 
  contact_journey_timeline: OverviewSection<ContactJourney>;

}

export interface ContactJourney {
  date:        string;
  interaction: string;
  status:      string;
  notes:       string; 
}

export interface CampaignPerformanceAnalysisData {
  title: string;
  series: {
    name: string;
    colorByPoint: boolean,
    data: {
      name: string;
      y: string;
    }[];
  }[];
  seriesString: string;
}
export interface OwnerDetails {
  owner_full_name: string;
  owner_country: string;
  owner_city: string;
  owner_address: string;
  owner_contact_company: string;
  owner_job_title: string;
  owner_email_id: string;
  owner_mobile_number: string;
  owner_state: string;
  owner_zip: string;
  owner_vertical: string;
  owner_region: string;
  owner_company_domain: string;
  owner_website: string;
  owner_country_code: string;
};

export interface TrackContentEngagement {
  title: string;
  description: string;
  categories: string[];
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
}

export interface AssetEnagementOverview {
  title: string;
  description: string;
  categories: string[];
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
  mostOpenedAsset: string | number;
  openCountForMostViewedAsset: string | number;
  totalAssetsOpenCount: string | number;
  avgEngagementRate: string | number;
}

export interface PlayBookContentEngagementOverview {
  title: string;
  description: string;
  categories: string[];
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
}

export interface TrackEngagementAnalysis<TItem> {
  title: string;
  description: string;
  items: TItem[];
}

export interface TrackEngagementAnalysisItem {
  name: string;
  opens: string | number;
  views: string | number;
  downloads: string | number;
  assets: string | number;
  progress_rate: string | number;
  engagement_level: string;
  notes: string;
}

export interface DeliveryStatusOverview {
  title : string;
  totalSent: string;
  deliveryRate: string;
  categories: string[];
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
}

export interface DetailedRecipientAnalysis<TItem> {
  title: string;
  description: string;
  items: TItem[];
}

export interface DetailedRecipientAnalysisItem {
  recipient: string;
  opens: string | number;
  clicks: string | number;
  engagement_level: string;
}

export interface TopPerformingRecipients<TItem>{
  title: string;
  categories: string[];
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
  items: TItem[];
}

export interface TopPerformingRecipientsItems {
  recipient: string;
  leadsCount: string | number;
  dealsCount: string | number;
  rank: string;
}


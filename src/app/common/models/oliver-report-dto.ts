export interface ExecutiveReport {
  /* -------- top-level meta -------- */
  report_title:      string;
  subtitle:          string;
  date_range:        string;
  report_owner:      string;
  report_recipient:  string;

  /* -------- sections -------- */
  kpi_overview:            OverviewSection<KPIItem>;
  summary_overview:        OverviewSection<KPIItem>;
  performance_indicators:  OverviewSection<PerformanceIndicatorItem>;

  campaign_performance_analysis: CampaignPerformanceAnalysis;

  lead_progression_funnel: LeadProgressionFunnel;
  pipeline_progression:    PipelineProgression;

  contact_journey_timeline: OverviewSection<ContactJourney>;

  strategic_insights:       OverviewSection<StrategicInsightItem>;
  recommended_next_steps:   OverviewSection<RecommendedNextStepItem>;

  conclusion: Conclusion;

  dealPipelinePrograssion: DealPipelineProgression
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

export interface LeadProgressionFunnel {
  stages: {
    [stageName: string]: {
      count: number;
      /** Only the first stage has response_rate – keep both optional */
      response_rate?: string;
      conversion_rate?: string;
    };
  };
  notes: string;
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

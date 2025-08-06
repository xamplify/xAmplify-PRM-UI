
export interface GroupOliverReportDTO {
  /* -------- top-level meta -------- */
  report_title:     string;
  subtitle:         string;
  date_range:       string;
  report_owner:     string;
  report_recipient: string;
  report_main_title:  string;
  report_sub_heading: string;

  /* -------- sections -------- */
  kpi_overview:      OverviewSection<KPIItem>;
  summary_overview:  OverviewSection<KPIItem>;

  deal_interactions_and_revenue_impact:             DealInteractionsAndRevenueImpact;
  lead_lifecycle_and_qualification_funnel:          LeadLifecycleAndQualificationFunnel;
  campaign_engagement_and_asset_utilization:        CampaignEngagementAndAssetUtilization;

  playbook_engagement_and_asset_utilization:        OverviewSection<PlaybookAssetUsageItem>;
  playbook_engagement_kpis:                         OverviewSection<KPIItem>;
  top_performing_playbook_assets:                   OverviewSection<PlaybookRankedAssetItem>;

  partner_analytics_strategic_revenue_drivers:      OverviewSection<PartnerRevenueItem>;
  partnership_performance_review:                   OverviewSection<PartnerPerformanceItem>;
  partnership_performance_summary_kpis:             OverviewSection<KPIItem>;

  c_suite_strategic_recommendations:                OverviewSection<CSuiteRecommendationItem>;

  footer_metadata: FooterMetadata;

  conclusion: Conclusion;
}

/* ----------  Generic wrapper  ---------- */
export interface OverviewSection<TItem> {
  title: string;
  description: string;
  items: TItem[];
}

/* ----------  Simple item types ---------- */
export interface KPIItem {
  name:  string;
  value: string | number;
  notes: string;
}

/* ----------  Deal Interactions & Revenue Impact ---------- */
// export interface DealInteractionsAndRevenueImpact {
 
//   description:                   string;
//   top_partners_by_deal_value:    DealPartnerItem[];
//   key_insights:                  OverviewSection<KPIItem>;

//   title: string;
//   categories: string[];
//   revenue: string;
//   series: { name: string; data: string[] }[];
//   categoriesString: string;
//   seriesString: string;
// }

export interface DealInteractionsAndRevenueImpact {
    title: any;
    description: any;
    top_partners_by_deal_value: {
        title: any;
        categories: any;
        revenue: string;
        series: any;
        categoriesString: string;
        seriesString: string;
    };
    key_insights: {
        title: any;
        description: any;
        items: any;
    };
}

/* partner rows (unchanged) */
export interface DealPartnerItem {
  title: string;
  categories: string[];
  revenue: string;
  series: { name: string; data: string[] }[];
  categoriesString: string;
  seriesString: string;
}

/* 11 ▸ Lead Lifecycle & Qualification Funnel */
export interface LeadLifecycleAndQualificationFunnel {
  title:                   string;
  description:             string;
  lead_progression_funnel: OverviewSection<LeadFunnelStageItem>;
  funnel_analysis:         OverviewSection<KPIItem>;
}

export interface LeadFunnelStageItem {
  name:            string;
  count:           number;
  conversion_rate: string;
  notes:           string;
}


/* ----------  Campaign Engagement & Asset Utilization ---------- */
export interface CampaignEngagementAndAssetUtilization extends OverviewSection<CampaignEngagementSubSection> {}
export interface CampaignEngagementSubSection extends OverviewSection<CampaignPartnerEngagementItem> {}

export interface CampaignPartnerEngagementItem {
  partner_name: string;
  views:        number;
  downloads:    number;
  notes:        string;
}

/* ----------  Playbook blocks ---------- */
export interface PlaybookAssetUsageItem {
  playbook_title: string;
  opens:          number;
  downloads:      number;
  notes:          string;
}

export interface PlaybookRankedAssetItem {
  rank:       number;
  asset_name: string;
  opens:      number;
  downloads:  number;
  notes:      string;
}

/* ----------  Partner Analytics & Reviews ---------- */
export interface PartnerRevenueItem {
  partner_company: string;
  tier:            string;
  total_deals:     number;
  deal_value:      string;
  avg_deal_size:   string;
  notes:           string;
}

export interface PartnerPerformanceItem {
  partner_company: string;
  status:          string;
  total_deals:     number;
  deal_value:      string;
  avg_deal_size:   string;
  notes:           string;
}

/* ----------  C-Suite Recommendations ---------- */
export interface CSuiteRecommendationItem {
  title:           string;
  priority:        string;
  timeline:        string;
  summary:         string;
  action_required: string;
}

/* ----------  Footer metadata ---------- */
export interface FooterMetadata {
  strategic_contact: { name: string; email: string; date: string }[];
  report_details:    { name: string; date: string }[];
  data_sources:      { name: string; platform: string }[];
}

/* ----------  Conclusion ---------- */
export interface Conclusion {
  title:       string;
  description: string;
  items:       { description: string }[];
}

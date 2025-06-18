export interface OliverReportClientDTO {
  contactDetails: ContactDetails;
  campaignEngagementPerformance: CampaignEngagementPerformance;
  leadLifecycleFunnelMetrics: LeadLifecycleFunnelMetrics;
  dealInteractionsRevenueAttribution: DealInteractionsRevenueAttribution;
  partnerJourneyBehavioralInsights: PartnerJourneyBehavioralInsights;
  keyTakeaways: string[];
  strategicRecommendations: string[];
}

export interface ContactDetails {
  email: string[];
  phone: string[];
  company: string[];
  address: string;
  city: string[];
  state: string;
  country: string;
}

export interface CampaignEngagementPerformance {
  engagedCampaigns: Campaign[];
  activeCampaigns: ActiveCampaign[];
}

export interface Campaign {
  name: string;
  type: string;
  amountGenerated: number;
}

export interface ActiveCampaign extends Campaign {
  closeDate: string;
}

export interface LeadLifecycleFunnelMetrics {
  pipelineStage: string;
  topLeadCampaigns: string[];
}

export interface DealInteractionsRevenueAttribution {
  dealsClosed: Deal[];
  recentClosedDealsDates: string[];
}

export interface Deal {
  title: string;
  amount: number;
  companyName: string;
  pipelineStage: string;
}

export interface PartnerJourneyBehavioralInsights {
  associatedCompanies: string[];
  interactionFrequency: string;
}

// Chart specific types (can be used with ngx-charts or similar)
export interface SimpleChartData { // Renamed from ChartData
  name: string;
  value: number;
}

export interface CampaignTypeChartData {
    name: string; // Campaign Type
    value: number; // Count
}










// export interface OliverReportClientDTO {
//   contactDetails: ContactDetails;
//   campaignEngagementPerformance: CampaignEngagementPerformance;
//   leadLifecycleFunnelMetrics: LeadLifecycleFunnelMetrics;
//   dealInteractionsRevenueAttribution: DealInteractionsRevenueAttribution;
//   partnerJourneyBehavioralInsights: PartnerJourneyBehavioralInsights;
//   keyTakeaways: string[];
//   strategicRecommendations: string[];
// }

// export interface ContactDetails {
//   email: string[];
//   phone: string[];
//   company: string[];
//   address: string;
//   city: string[];
//   state: string;
//   country: string;
// }

// export interface CampaignEngagementPerformance {
//   engagedCampaigns: Campaign[];
//   activeCampaigns: ActiveCampaign[];
// }

// export interface Campaign {
//   name: string;
//   type: string;
//   amountGenerated: number;
// }

// export interface ActiveCampaign extends Campaign {
//   closeDate: string;
// }

// export interface LeadLifecycleFunnelMetrics {
//   pipelineStage: string;
//   topLeadCampaigns: string[];
// }

// export interface DealInteractionsRevenueAttribution {
//   dealsClosed: Deal[];
//   recentClosedDealsDates: string[];
// }

// export interface Deal {
//   title: string;
//   amount: number;
//   companyName: string;
//   pipelineStage: string;
// }

// export interface PartnerJourneyBehavioralInsights {
//   associatedCompanies: string[];
//   interactionFrequency: string;
// }

// // Chart specific types (can be used with ngx-charts or similar)
// export interface ChartData {
//   name: string;
//   value: number;
// }

// export interface CampaignTypeChartData {
//     name: string; // Campaign Type
//     value: number; // Count
// }




// export interface OliverReportClientDTO {
//   contactDetails: ContactDetails;
//   campaignEngagementPerformance: CampaignEngagementPerformance;
//   leadLifecycleFunnelMetrics: LeadLifecycleFunnelMetrics;
//   dealInteractionsRevenueAttribution: DealInteractionsRevenueAttribution;
//   partnerJourneyBehavioralInsights: PartnerJourneyBehavioralInsights;
//   keyTakeaways: string[];
//   strategicRecommendations: string[];
// }

// export interface ContactDetails {
//   email: string[];
//   phone: string[];
//   company: string[];
//   address: string;
//   city: string[];
//   state: string;
//   country: string;
// }

// export interface CampaignEngagementPerformance {
//   engagedCampaigns: Campaign[];
//   activeCampaigns: ActiveCampaign[];
// }

// export interface Campaign {
//   name: string;
//   type: string;
//   amountGenerated: number;
// }

// export interface ActiveCampaign extends Campaign {
//   closeDate: string;
// }

// export interface LeadLifecycleFunnelMetrics {
//   pipelineStage: string;
//   topLeadCampaigns: string[];
// }

// export interface DealInteractionsRevenueAttribution {
//   dealsClosed: Deal[];
//   recentClosedDealsDates: string[];
// }

// export interface Deal {
//   title: string;
//   amount: number;
//   companyName: string;
//   pipelineStage: string;
// }

// export interface PartnerJourneyBehavioralInsights {
//   associatedCompanies: string[];
//   interactionFrequency: string;
// }

// // Chart specific types (can be used with ngx-charts or similar)
// export interface SimpleChartData { // Renamed from ChartData
//   name: string;
//   value: number;
// }

// export interface CampaignTypeChartData {
//     name: string; // Campaign Type
//     value: number; // Count
// }
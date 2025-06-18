export class ReportData {
  contact_details: ContactDetails;
  leads: Leads;
  deals: Deals;
  campaigns: Campaigns;
  key_takeaways: string[];
  strategic_recommendations: string[];
}
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
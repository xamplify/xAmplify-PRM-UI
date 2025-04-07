export class SendTestEmailDto {
  fromEmail = "";
  toEmail = "";
  subject = "";
  body = "";
  id = 0;
  fromName = "";
  channelCampaign = false;
  preHeader = "";
  emailCampaign = false;
  recipientName = "";
  campaignId = 0;
  loggedInUserId = 0;
  showAlert = true;
  ccEmailIds = [];
  bccEmailIds = [];
  toEmailIds = [];
}

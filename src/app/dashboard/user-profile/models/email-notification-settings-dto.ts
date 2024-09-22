export class EmailNotificationSettingsDto {
    notifyPartners:boolean = false;
	assetPublishedEmailNotification:boolean = false;
	assetPublishVendorEmailNotification:boolean  = false;

	trackPublishedEmailNotification:boolean = false;
	trackPublishVendorEmailNotification:boolean = false;
	
	playbookPublishedEmailNotification:boolean = false;
	playbookPublishVendorEmailNotification:boolean = false;

	dashboardButtonsEmailNotification:boolean = false;
	dashboardButtonPublishVendorEmailNotification:boolean = false;

	dashboardBannersEmailNotification:boolean = false;
	dashboardBannersEmailNotificationToVendorCompany:boolean = false;

	newsAndAnnouncementsEmailNotification:boolean = false;
	newsAndAnnouncementsEmailNotificationToVendorCompany:boolean = false;
}

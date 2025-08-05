import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageDamComponent } from './manage-dam/manage-dam.component';
import { AddDamComponent } from './add-dam/add-dam.component';
import { UploadAssetComponent } from './upload-asset/upload-asset.component';
import { DamAnalyticsComponent } from './dam-analytics/dam-analytics.component';
import { DamPublishedPartnersAnalyticsComponent } from './dam-published-partners-analytics/dam-published-partners-analytics.component';
import { SelectUploadTypeComponent } from './select-upload-type/select-upload-type.component';
import { ShowHistoryComponent } from './show-history/show-history.component';
import { ViewDamComponent } from './view-dam/view-dam.component';
import { DamPartnerCompanyAnalyticsComponent } from './dam-partner-company-analytics/dam-partner-company-analytics.component';
import { RouterUrlConstants } from 'app/constants/router-url.contstants';
import { AiChatManagerComponent } from 'app/util/ai-chat-manager/ai-chat-manager.component';
import { AddLandingPageComponent } from 'app/landing-pages/add-landing-page/add-landing-page.component';
import { LandingPagesListAndGridViewComponent } from 'app/util/landing-pages-list-and-grid-view/landing-pages-list-and-grid-view.component';

const damPartnerCompanyAnalyticsRouterUrl = RouterUrlConstants['damPartnerCompanyAnalytics'];
const damPartnerAnalyticsRouterUrl = RouterUrlConstants['damPartnerAnalytics'];
const approvalRouterUrl = RouterUrlConstants['approval'];

export const routes: Routes = [
	{ path: "manage", component: ManageDamComponent },
	{ path: "manage/:viewType", component: ManageDamComponent },
	{ path: "editVideo/:videoId/:damId", component: ManageDamComponent },
	{ path: "editVideo/:videoId/:damId/:viewType", component: ManageDamComponent },
	{ path: "editVideo/:videoId/:damId/:viewType/:categoryId/:folderViewType", component: ManageDamComponent },
	{ path: "previewVideo/:videoId/:damId", component: ManageDamComponent },
	{ path: "previewVideo/:videoId/:damId/:viewType", component: ManageDamComponent },
	{ path: "previewVideo/:videoId/:damId/:viewType/:categoryId/:folderViewType", component: ManageDamComponent },
	/************XNFR-169*********/
	{ path: "manage/:viewType/:categoryId/:folderViewType", component: ManageDamComponent },
	{ path: "shared", component: ManageDamComponent },
	{ path: "shared/:viewType", component: ManageDamComponent },
	{ path: "shared/:viewType/:categoryId/:folderViewType", component: ManageDamComponent },
	/****************************/
	{ path: "add", component: AddDamComponent },
	{ path: "upload", component: UploadAssetComponent },
	/************XNFR-169*********/
	{ path: "editDetails/:id", component: UploadAssetComponent },
	{ path: "editDetails/:id/:viewType", component: UploadAssetComponent },
	{ path: "editDetails/:id/:viewType/:categoryId/:folderViewType", component: UploadAssetComponent },
	/*******************************/
	/************XNFR-169*********/
	{ path: "edit/:id", component: AddDamComponent },
	{ path: "edit/:id/:viewType", component: AddDamComponent },
	{ path: "edit/:id/:viewType/:categoryId/:folderViewType", component: AddDamComponent },
	/*****************************/
	/************XNFR-169*********/
	{ path: "editp/:id", component: AddDamComponent },
	{ path: "editp/:id/:viewType", component: AddDamComponent },
	{ path: "editp/:id/:viewType/:categoryId/:folderViewType", component: AddDamComponent },
	/*****************************/
	/************XNFR-169*********/
	{ path: "pda/:damPartnerId", component: DamAnalyticsComponent },
	{ path: "pda/:damPartnerId/:viewType", component: DamAnalyticsComponent },
	{ path: "pda/:damPartnerId/:viewType/:categoryId/:folderViewType", component: DamAnalyticsComponent },
	/************XNFR-169*********/
	{ path: damPartnerAnalyticsRouterUrl+":damId/:damPartnerId", component: DamPublishedPartnersAnalyticsComponent },
	{ path: damPartnerAnalyticsRouterUrl+":damId/:damPartnerId/:viewType", component: DamPublishedPartnersAnalyticsComponent },
	{ path: damPartnerAnalyticsRouterUrl+":damId/:damPartnerId/:viewType/:categoryId/:folderViewType", component: DamPublishedPartnersAnalyticsComponent },
	/*****************************/
	/************XNFR-169*********/
	{ path: "vda/:damId/:damPartnerId/:partnerId", component: DamAnalyticsComponent },
	{ path: "vda/:damId/:damPartnerId/:partnerId/:viewType", component: DamAnalyticsComponent },
	{ path: "vda/:damId/:damPartnerId/:partnerId/:viewType/:categoryId/:folderViewType", component: DamAnalyticsComponent },
	/*****************************/
	{ path: "select", component: SelectUploadTypeComponent },
	{ path: "history/:assetId", component: ShowHistoryComponent },
	{ path: "history/:assetId/:viewType", component: ShowHistoryComponent },
	{ path: "history/:assetId/:viewType/:categoryId/:folderViewType", component: ShowHistoryComponent },
	/*********XNFR-169***********/
	{ path: "sharedp/view/:assetId", component: ViewDamComponent },
	{ path: "sharedp/view/:assetId/:viewType", component: ViewDamComponent },
	{ path: "sharedp/view/:assetId/:viewType/:categoryId/:folderViewType", component: ViewDamComponent },
	{ path: "vapv/view/:damCompanyId/:slug", component: ViewDamComponent },

	
	/************XNFR-543*********/
	{ path: damPartnerCompanyAnalyticsRouterUrl+":damId", component: DamPartnerCompanyAnalyticsComponent },
	{ path: damPartnerCompanyAnalyticsRouterUrl+":damId/:viewType", component: DamPartnerCompanyAnalyticsComponent },
	{ path: damPartnerCompanyAnalyticsRouterUrl+":damId/:viewType/:categoryId/:folderViewType", component: DamPartnerCompanyAnalyticsComponent },
	/************XNFR-820*********/
	{ path: approvalRouterUrl + "editDetails/:id/:viewType", component: UploadAssetComponent },
	{ path: approvalRouterUrl + "editVideo/:videoId/:damId/:viewType", component: ManageDamComponent },
	{ path: approvalRouterUrl + "previewVideo/:videoId/:damId/:viewType", component: ManageDamComponent },
	{ path: approvalRouterUrl + "previewVideo/:videoId/:damId", component: ManageDamComponent },
	{ path: approvalRouterUrl + "edit/:id/:viewType", component: AddDamComponent },
	{ path: approvalRouterUrl + damPartnerCompanyAnalyticsRouterUrl + ":damId/:viewType", component: DamPartnerCompanyAnalyticsComponent },
	{ path: approvalRouterUrl + damPartnerAnalyticsRouterUrl + ":damId/:damPartnerId/:viewType", component: DamPublishedPartnersAnalyticsComponent },
	{ path: approvalRouterUrl + "vda/:damId/:damPartnerId/:partnerId/:viewType", component: DamAnalyticsComponent },
	{ path: "askAi/view/:assetId", component: AiChatManagerComponent },
	{ path: "askAi/shared/view/:assetId", component: AiChatManagerComponent },
	{ path: "askAi/shared/view/fg/:categoryId", component: AiChatManagerComponent },
	{ path: "askAi/view/fg/:categoryId", component: AiChatManagerComponent },
	{ path: "askAi/shared/view/g/:assetId", component: AiChatManagerComponent },
	{ path: "askAi/view/fl/:categoryId", component: AiChatManagerComponent },
	{ path: "askAi/shared/view/fl/:categoryId", component: AiChatManagerComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DamRoutingModule { }

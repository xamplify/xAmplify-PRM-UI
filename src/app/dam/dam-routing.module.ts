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
	{ path: "partnerAnalytics/:damId", component: DamPublishedPartnersAnalyticsComponent },
	{ path: "partnerAnalytics/:damId/:viewType", component: DamPublishedPartnersAnalyticsComponent },
	{ path: "partnerAnalytics/:damId/:viewType/:categoryId/:folderViewType", component: DamPublishedPartnersAnalyticsComponent },
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
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DamRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ManageDamComponent } from './manage-dam/manage-dam.component';
import { AddDamComponent } from './add-dam/add-dam.component';
import { UploadAssetComponent } from './upload-asset/upload-asset.component';
import { DamAnalyticsComponent } from './dam-analytics/dam-analytics.component';
import { DamPublishedPartnersAnalyticsComponent } from './dam-published-partners-analytics/dam-published-partners-analytics.component';

export const routes: Routes = [
	{ path: "manage", component: ManageDamComponent },
	{ path: "manage/:viewType", component: ManageDamComponent },
	{ path: "shared", component: ManageDamComponent },
	{ path: "shared/:viewType", component: ManageDamComponent },
	{ path: "add", component: AddDamComponent },
	{ path: "upload", component: UploadAssetComponent },
	{ path: "editDetails/:id", component: UploadAssetComponent },
	{ path: "edit/:id", component: AddDamComponent },
	{ path: "editp/:id", component: AddDamComponent },
	{ path: "pda/:damPartnerId", component: DamAnalyticsComponent },
	{ path: "partnerAnalytics/:damId", component: DamPublishedPartnersAnalyticsComponent },
	{ path: "vda/:damId/:damPartnerId", component: DamAnalyticsComponent },



];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DamRoutingModule { }

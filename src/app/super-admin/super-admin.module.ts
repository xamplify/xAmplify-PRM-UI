import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { SuperAdminService } from './services/super-admin.service';

@NgModule({
  imports: [
    CommonModule,SharedModule
  ],
  declarations: [],
  providers:[SuperAdminService]
})
export class SuperAdminModule { }

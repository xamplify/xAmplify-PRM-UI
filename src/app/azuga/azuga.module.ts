import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AzugaService } from './service/azuga.service';
import { AzugaRoutingModule } from 'app/agency/azuga-routing/azuga-routing.module';
import { DevicesInfoComponent } from './devices-info/devices-info.component';
@NgModule({
  imports:[CommonModule,AzugaRoutingModule,SharedModule ],
  declarations: [DevicesInfoComponent],
  providers:[AzugaService]
})
export class AzugaModule { }

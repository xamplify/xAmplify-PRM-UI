import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternationalPhoneModule } from 'ng4-intl-phone';

@NgModule({
  imports: [
    CommonModule, InternationalPhoneModule
  ],
  declarations: [],
  exports: [InternationalPhoneModule]
})
export class SharedLibraryModule { }

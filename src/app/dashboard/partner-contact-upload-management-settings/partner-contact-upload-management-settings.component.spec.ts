import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContactUploadManagementSettingsComponent } from './partner-contact-upload-management-settings.component';

describe('PartnerContactUploadManagementSettingsComponent', () => {
  let component: PartnerContactUploadManagementSettingsComponent;
  let fixture: ComponentFixture<PartnerContactUploadManagementSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerContactUploadManagementSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerContactUploadManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

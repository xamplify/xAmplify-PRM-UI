import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallIntegrationSettingsComponent } from './call-integration-settings.component';

describe('CallIntegrationSettingsComponent', () => {
  let component: CallIntegrationSettingsComponent;
  let fixture: ComponentFixture<CallIntegrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallIntegrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallIntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

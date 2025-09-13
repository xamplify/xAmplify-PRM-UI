import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCustomFieldsSettingsComponent } from './lead-custom-fields-settings.component';

describe('LeadCustomFieldsSettingsComponent', () => {
  let component: LeadCustomFieldsSettingsComponent;
  let fixture: ComponentFixture<LeadCustomFieldsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadCustomFieldsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCustomFieldsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalControlManagementSettingsComponent } from './approval-control-management-settings.component';

describe('ApprovalControlManagementSettingsComponent', () => {
  let component: ApprovalControlManagementSettingsComponent;
  let fixture: ComponentFixture<ApprovalControlManagementSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalControlManagementSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalControlManagementSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDashboardSettingsComponent } from './custom-dashboard-settings.component';

describe('CustomDashboardSettingsComponent', () => {
  let component: CustomDashboardSettingsComponent;
  let fixture: ComponentFixture<CustomDashboardSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDashboardSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDashboardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

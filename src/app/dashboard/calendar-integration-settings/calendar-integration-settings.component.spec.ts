import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarIntegrationSettingsComponent } from './calendar-integration-settings.component';

describe('CalendarIntegrationSettingsComponent', () => {
  let component: CalendarIntegrationSettingsComponent;
  let fixture: ComponentFixture<CalendarIntegrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarIntegrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarIntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

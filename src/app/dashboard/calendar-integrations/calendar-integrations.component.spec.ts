import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarIntegrationsComponent } from './calendar-integrations.component';

describe('CalendarIntegrationsComponent', () => {
  let component: CalendarIntegrationsComponent;
  let fixture: ComponentFixture<CalendarIntegrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarIntegrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

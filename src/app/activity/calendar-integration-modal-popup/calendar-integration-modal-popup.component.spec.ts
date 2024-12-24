import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarIntegrationModalPopupComponent } from './calendar-integration-modal-popup.component';

describe('CalendarIntegrationModalPopupComponent', () => {
  let component: CalendarIntegrationModalPopupComponent;
  let fixture: ComponentFixture<CalendarIntegrationModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarIntegrationModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarIntegrationModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

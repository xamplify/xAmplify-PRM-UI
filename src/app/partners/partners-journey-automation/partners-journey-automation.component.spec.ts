import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersJourneyAutomationComponent } from './partners-journey-automation.component';

describe('PartnersJourneyAutomationComponent', () => {
  let component: PartnersJourneyAutomationComponent;
  let fixture: ComponentFixture<PartnersJourneyAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnersJourneyAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersJourneyAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBookJourneyInteractionDetailsComponent } from './play-book-journey-interaction-details.component';

describe('PlayBookJourneyInteractionDetailsComponent', () => {
  let component: PlayBookJourneyInteractionDetailsComponent;
  let fixture: ComponentFixture<PlayBookJourneyInteractionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayBookJourneyInteractionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBookJourneyInteractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

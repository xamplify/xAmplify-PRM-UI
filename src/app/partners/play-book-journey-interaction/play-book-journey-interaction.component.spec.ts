import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayBookJourneyInteractionComponent } from './play-book-journey-interaction.component';

describe('PlayBookJourneyInteractionComponent', () => {
  let component: PlayBookJourneyInteractionComponent;
  let fixture: ComponentFixture<PlayBookJourneyInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayBookJourneyInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBookJourneyInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

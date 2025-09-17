import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerJourneyCountTilesComponent } from './partner-journey-count-tiles.component';

describe('PartnerJourneyCountTilesComponent', () => {
  let component: PartnerJourneyCountTilesComponent;
  let fixture: ComponentFixture<PartnerJourneyCountTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerJourneyCountTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerJourneyCountTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

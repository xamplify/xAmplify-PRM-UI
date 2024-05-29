import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwiseTrackCountsComponent } from './userwise-track-counts.component';

describe('UserwiseTrackCountsComponent', () => {
  let component: UserwiseTrackCountsComponent;
  let fixture: ComponentFixture<UserwiseTrackCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserwiseTrackCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwiseTrackCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

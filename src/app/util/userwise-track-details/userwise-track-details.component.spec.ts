import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserwiseTrackDetailsComponent } from './userwise-track-details.component';

describe('UserwiseTrackDetailsComponent', () => {
  let component: UserwiseTrackDetailsComponent;
  let fixture: ComponentFixture<UserwiseTrackDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserwiseTrackDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserwiseTrackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

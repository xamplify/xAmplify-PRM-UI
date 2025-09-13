import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackAssetDetailsComponent } from './track-asset-details.component';

describe('TrackAssetDetailsComponent', () => {
  let component: TrackAssetDetailsComponent;
  let fixture: ComponentFixture<TrackAssetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackAssetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

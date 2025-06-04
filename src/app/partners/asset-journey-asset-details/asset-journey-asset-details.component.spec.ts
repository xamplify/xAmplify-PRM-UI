import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetJourneyAssetDetailsComponent } from './asset-journey-asset-details.component';

describe('AssetJourneyAssetDetailsComponent', () => {
  let component: AssetJourneyAssetDetailsComponent;
  let fixture: ComponentFixture<AssetJourneyAssetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetJourneyAssetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetJourneyAssetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

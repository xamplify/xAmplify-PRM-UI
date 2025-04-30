import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSignatureStatusAnalyticsComponent } from './asset-signature-status-analytics.component';

describe('AssetSignatureStatusAnalyticsComponent', () => {
  let component: AssetSignatureStatusAnalyticsComponent;
  let fixture: ComponentFixture<AssetSignatureStatusAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetSignatureStatusAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSignatureStatusAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

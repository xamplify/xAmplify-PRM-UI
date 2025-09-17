import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBannerImagesComponent } from './dashboard-banner-images.component';

describe('DashboardBannerImagesComponent', () => {
  let component: DashboardBannerImagesComponent;
  let fixture: ComponentFixture<DashboardBannerImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBannerImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBannerImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

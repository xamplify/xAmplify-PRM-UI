import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAssetPopupComponent } from './download-asset-popup.component';

describe('DownloadAssetPopupComponent', () => {
  let component: DownloadAssetPopupComponent;
  let fixture: ComponentFixture<DownloadAssetPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAssetPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAssetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

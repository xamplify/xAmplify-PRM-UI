import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAssetPopupComponent } from './preview-asset-popup.component';

describe('PreviewAssetPopupComponent', () => {
  let component: PreviewAssetPopupComponent;
  let fixture: ComponentFixture<PreviewAssetPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAssetPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAssetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

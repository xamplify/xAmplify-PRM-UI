import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAssetPdfComponent } from './preview-asset-pdf.component';

describe('PreviewAssetPdfComponent', () => {
  let component: PreviewAssetPdfComponent;
  let fixture: ComponentFixture<PreviewAssetPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAssetPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAssetPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

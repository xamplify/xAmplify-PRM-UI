import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAssetComponent } from './preview-asset.component';

describe('PreviewAssetComponent', () => {
  let component: PreviewAssetComponent;
  let fixture: ComponentFixture<PreviewAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

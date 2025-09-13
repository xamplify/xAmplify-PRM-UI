import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgCropprV2Component } from './img-croppr-v2.component';

describe('ImgCropprV2Component', () => {
  let component: ImgCropprV2Component;
  let fixture: ComponentFixture<ImgCropprV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgCropprV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgCropprV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

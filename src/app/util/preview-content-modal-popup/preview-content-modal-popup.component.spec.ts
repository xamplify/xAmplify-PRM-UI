import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContentModalPopupComponent } from './preview-content-modal-popup.component';

describe('PreviewContentModalPopupComponent', () => {
  let component: PreviewContentModalPopupComponent;
  let fixture: ComponentFixture<PreviewContentModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewContentModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewContentModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

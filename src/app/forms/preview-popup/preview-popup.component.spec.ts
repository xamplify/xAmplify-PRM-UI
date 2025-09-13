import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPopupComponent } from './preview-popup.component';

describe('PreviewPopupComponent', () => {
  let component: PreviewPopupComponent;
  let fixture: ComponentFixture<PreviewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

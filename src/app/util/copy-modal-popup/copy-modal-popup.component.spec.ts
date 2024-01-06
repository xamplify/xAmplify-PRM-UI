import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyModalPopupComponent } from './copy-modal-popup.component';

describe('CopyModalPopupComponent', () => {
  let component: CopyModalPopupComponent;
  let fixture: ComponentFixture<CopyModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

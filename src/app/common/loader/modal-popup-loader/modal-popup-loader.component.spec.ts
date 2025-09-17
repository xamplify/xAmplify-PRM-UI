import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPopupLoaderComponent } from './modal-popup-loader.component';

describe('ModalPopupLoaderComponent', () => {
  let component: ModalPopupLoaderComponent;
  let fixture: ComponentFixture<ModalPopupLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPopupLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPopupLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

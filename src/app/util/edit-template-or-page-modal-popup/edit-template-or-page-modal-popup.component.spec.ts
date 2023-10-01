import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTemplateOrPageModalPopupComponent } from './edit-template-or-page-modal-popup.component';

describe('EditTemplateOrPageModalPopupComponent', () => {
  let component: EditTemplateOrPageModalPopupComponent;
  let fixture: ComponentFixture<EditTemplateOrPageModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTemplateOrPageModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTemplateOrPageModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

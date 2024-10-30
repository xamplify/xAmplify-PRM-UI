import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNoteModalPopupComponent } from './add-note-modal-popup.component';

describe('AddNoteModalPopupComponent', () => {
  let component: AddNoteModalPopupComponent;
  let fixture: ComponentFixture<AddNoteModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNoteModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNoteModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFolderModalPopupComponent } from './add-folder-modal-popup.component';

describe('AddFolderModalPopupComponent', () => {
  let component: AddFolderModalPopupComponent;
  let fixture: ComponentFixture<AddFolderModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFolderModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFolderModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

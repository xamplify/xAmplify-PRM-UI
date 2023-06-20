import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyGroupUsersModalPopupComponent } from './copy-group-users-modal-popup.component';

describe('CopyGroupUsersModalPopupComponent', () => {
  let component: CopyGroupUsersModalPopupComponent;
  let fixture: ComponentFixture<CopyGroupUsersModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyGroupUsersModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyGroupUsersModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

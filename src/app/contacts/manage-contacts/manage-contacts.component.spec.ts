import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContactsComponent } from './manage-contacts.component';

describe('ManageContactsComponent', () => {
  let component: ManageContactsComponent;
  let fixture: ComponentFixture<ManageContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

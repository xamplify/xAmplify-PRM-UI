import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactsComponent } from './edit-contacts.component';

describe('EditContactsComponent', () => {
  let component: EditContactsComponent;
  let fixture: ComponentFixture<EditContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

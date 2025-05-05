import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactStatusDropDownComponent } from './contact-status-drop-down.component';

describe('ContactStatusDropDownComponent', () => {
  let component: ContactStatusDropDownComponent;
  let fixture: ComponentFixture<ContactStatusDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactStatusDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactStatusDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

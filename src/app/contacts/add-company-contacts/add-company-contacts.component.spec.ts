import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyContactsComponent } from './add-company-contacts.component';

describe('AddCompanyContactsComponent', () => {
  let component: AddCompanyContactsComponent;
  let fixture: ComponentFixture<AddCompanyContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

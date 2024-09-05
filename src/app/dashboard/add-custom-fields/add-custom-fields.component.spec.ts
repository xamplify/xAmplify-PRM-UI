import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomFieldsComponent } from './add-custom-fields.component';

describe('AddCustomFieldsComponent', () => {
  let component: AddCustomFieldsComponent;
  let fixture: ComponentFixture<AddCustomFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

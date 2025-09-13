import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmailAddressComponent } from './update-email-address.component';

describe('UpdateEmailAddressComponent', () => {
  let component: UpdateEmailAddressComponent;
  let fixture: ComponentFixture<UpdateEmailAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateEmailAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEmailAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

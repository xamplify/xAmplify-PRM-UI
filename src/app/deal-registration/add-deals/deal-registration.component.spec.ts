import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealRegistrationComponent } from './deal-registration.component';

describe('DealRegistrationComponent', () => {
  let component: DealRegistrationComponent;
  let fixture: ComponentFixture<DealRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

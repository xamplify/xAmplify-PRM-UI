import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderFieldsComponent } from './order-fields.component';

describe('OrderFieldsComponent', () => {
  let component: OrderFieldsComponent;
  let fixture: ComponentFixture<OrderFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

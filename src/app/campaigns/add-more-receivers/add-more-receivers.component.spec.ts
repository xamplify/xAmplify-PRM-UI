import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMoreReceiversComponent } from './add-more-receivers.component';

describe('AddMoreReceiversComponent', () => {
  let component: AddMoreReceiversComponent;
  let fixture: ComponentFixture<AddMoreReceiversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMoreReceiversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMoreReceiversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

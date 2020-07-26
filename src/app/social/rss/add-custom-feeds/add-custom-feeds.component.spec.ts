import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomFeedsComponent } from './add-custom-feeds.component';

describe('AddCustomFeedsComponent', () => {
  let component: AddCustomFeedsComponent;
  let fixture: ComponentFixture<AddCustomFeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomFeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

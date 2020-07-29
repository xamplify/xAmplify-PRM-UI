import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomFeedsComponent } from './manage-custom-feeds.component';

describe('ManageCustomFeedsComponent', () => {
  let component: ManageCustomFeedsComponent;
  let fixture: ComponentFixture<ManageCustomFeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCustomFeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCustomFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

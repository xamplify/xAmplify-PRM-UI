import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomManageDealsComponent } from './custom-manage-deals.component';

describe('CustomManageDealsComponent', () => {
  let component: CustomManageDealsComponent;
  let fixture: ComponentFixture<CustomManageDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomManageDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomManageDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

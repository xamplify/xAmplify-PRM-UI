import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomManageLeadsComponent } from './custom-manage-leads.component';

describe('CustomManageLeadsComponent', () => {
  let component: CustomManageLeadsComponent;
  let fixture: ComponentFixture<CustomManageLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomManageLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomManageLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

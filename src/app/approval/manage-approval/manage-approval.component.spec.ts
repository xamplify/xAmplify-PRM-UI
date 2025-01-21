import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageApprovalComponent } from './manage-approval.component';

describe('ManageAprrovalComponent', () => {
  let component: ManageApprovalComponent;
  let fixture: ComponentFixture<ManageApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

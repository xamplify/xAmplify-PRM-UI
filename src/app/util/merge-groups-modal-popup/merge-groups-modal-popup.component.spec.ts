import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeGroupsModalPopupComponent } from './merge-groups-modal-popup.component';

describe('MergeGroupsModalPopupComponent', () => {
  let component: MergeGroupsModalPopupComponent;
  let fixture: ComponentFixture<MergeGroupsModalPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeGroupsModalPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeGroupsModalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

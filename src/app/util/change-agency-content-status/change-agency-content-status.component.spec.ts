import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAgencyContentStatusComponent } from './change-agency-content-status.component';

describe('ChangeAgencyContentStatusComponent', () => {
  let component: ChangeAgencyContentStatusComponent;
  let fixture: ComponentFixture<ChangeAgencyContentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAgencyContentStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAgencyContentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerReportsComponent } from './partner-reports.component';

describe('PartnerReportsComponent', () => {
  let component: PartnerReportsComponent;
  let fixture: ComponentFixture<PartnerReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPartnerTableComponent } from './all-partner-table.component';

describe('AllPartnerTableComponent', () => {
  let component: AllPartnerTableComponent;
  let fixture: ComponentFixture<AllPartnerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPartnerTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPartnerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerContactsStatisticsComponent } from './partner-contacts-statistics.component';

describe('PartnerContactsStatisticsComponent', () => {
  let component: PartnerContactsStatisticsComponent;
  let fixture: ComponentFixture<PartnerContactsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerContactsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerContactsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

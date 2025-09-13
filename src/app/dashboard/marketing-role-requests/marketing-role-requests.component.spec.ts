import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingRoleRequestsComponent } from './marketing-role-requests.component';

describe('MarketingRoleRequestsComponent', () => {
  let component: MarketingRoleRequestsComponent;
  let fixture: ComponentFixture<MarketingRoleRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingRoleRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingRoleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

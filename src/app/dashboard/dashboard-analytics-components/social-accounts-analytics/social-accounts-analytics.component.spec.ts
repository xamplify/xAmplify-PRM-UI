import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialAccountsAnalyticsComponent } from './social-accounts-analytics.component';

describe('SocialAccountsAnalyticsComponent', () => {
  let component: SocialAccountsAnalyticsComponent;
  let fixture: ComponentFixture<SocialAccountsAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialAccountsAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialAccountsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

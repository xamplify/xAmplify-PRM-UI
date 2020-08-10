import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredAccessTokenLoginComponent } from './expired-access-token-login.component';

describe('ExpiredAccessTokenLoginComponent', () => {
  let component: ExpiredAccessTokenLoginComponent;
  let fixture: ComponentFixture<ExpiredAccessTokenLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredAccessTokenLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredAccessTokenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

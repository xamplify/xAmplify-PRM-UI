import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookAccountsComponent } from './facebook-accounts.component';

describe('FacebookAccountsComponent', () => {
  let component: FacebookAccountsComponent;
  let fixture: ComponentFixture<FacebookAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

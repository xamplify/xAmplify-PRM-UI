import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAccountUsersComponent } from './support-account-users.component';

describe('SupportAccountUsersComponent', () => {
  let component: SupportAccountUsersComponent;
  let fixture: ComponentFixture<SupportAccountUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportAccountUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportAccountUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

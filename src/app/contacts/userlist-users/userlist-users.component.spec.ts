import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserlistUsersComponent } from './userlist-users.component';

describe('UserlistUsersComponent', () => {
  let component: UserlistUsersComponent;
  let fixture: ComponentFixture<UserlistUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserlistUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserlistUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

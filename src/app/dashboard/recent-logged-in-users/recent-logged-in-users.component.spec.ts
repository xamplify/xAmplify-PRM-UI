import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentLoggedInUsersComponent } from './recent-logged-in-users.component';

describe('RecentLoggedInUsersComponent', () => {
  let component: RecentLoggedInUsersComponent;
  let fixture: ComponentFixture<RecentLoggedInUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentLoggedInUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentLoggedInUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

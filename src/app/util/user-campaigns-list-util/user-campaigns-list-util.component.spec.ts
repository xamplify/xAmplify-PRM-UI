import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCampaignsListUtilComponent } from './user-campaigns-list-util.component';

describe('UserCampaignsListUtilComponent', () => {
  let component: UserCampaignsListUtilComponent;
  let fixture: ComponentFixture<UserCampaignsListUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCampaignsListUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCampaignsListUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

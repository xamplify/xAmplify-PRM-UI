import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialManageComponent } from './social-manage.component';

describe('SocialManageComponent', () => {
  let component: SocialManageComponent;
  let fixture: ComponentFixture<SocialManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

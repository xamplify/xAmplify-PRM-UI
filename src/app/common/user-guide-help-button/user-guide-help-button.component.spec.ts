import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGuideHelpButtonComponent } from './user-guide-help-button.component';

describe('UserGuideHelpButtonComponent', () => {
  let component: UserGuideHelpButtonComponent;
  let fixture: ComponentFixture<UserGuideHelpButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGuideHelpButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGuideHelpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

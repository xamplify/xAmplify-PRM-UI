import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideLeftMenuComponent } from './guide-left-menu.component';

describe('GuideLeftMenuComponent', () => {
  let component: GuideLeftMenuComponent;
  let fixture: ComponentFixture<GuideLeftMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideLeftMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideLeftMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

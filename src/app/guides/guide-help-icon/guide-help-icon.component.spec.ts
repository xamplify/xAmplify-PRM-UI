import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideHelpIconComponent } from './guide-help-icon.component';

describe('GuideHelpIconComponent', () => {
  let component: GuideHelpIconComponent;
  let fixture: ComponentFixture<GuideHelpIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideHelpIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideHelpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

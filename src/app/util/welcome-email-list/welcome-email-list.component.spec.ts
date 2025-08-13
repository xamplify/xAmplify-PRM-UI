import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeEmailListComponent } from './welcome-email-list.component';

describe('WelcomeEmailListComponent', () => {
  let component: WelcomeEmailListComponent;
  let fixture: ComponentFixture<WelcomeEmailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeEmailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeEmailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

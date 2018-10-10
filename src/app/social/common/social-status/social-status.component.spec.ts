import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialStatusComponent } from './social-status.component';

describe('SocialStatusComponent', () => {
  let component: SocialStatusComponent;
  let fixture: ComponentFixture<SocialStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

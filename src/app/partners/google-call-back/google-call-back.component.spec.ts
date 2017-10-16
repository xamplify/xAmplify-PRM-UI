import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleCallBackComponent } from './google-call-back.component';

describe('GoogleCallBackComponent', () => {
  let component: GoogleCallBackComponent;
  let fixture: ComponentFixture<GoogleCallBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleCallBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

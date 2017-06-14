import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookReactionsComponent } from './facebook-reactions.component';

describe('FacebookReactionsComponent', () => {
  let component: FacebookReactionsComponent;
  let fixture: ComponentFixture<FacebookReactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookReactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

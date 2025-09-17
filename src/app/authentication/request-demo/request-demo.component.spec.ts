import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDemoComponent } from './request-demo.component';

describe('RequestDemoComponent', () => {
  let component: RequestDemoComponent;
  let fixture: ComponentFixture<RequestDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

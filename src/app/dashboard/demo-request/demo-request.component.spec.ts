import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoRequestComponent } from './demo-request.component';

describe('DemoRequestComponent', () => {
  let component: DemoRequestComponent;
  let fixture: ComponentFixture<DemoRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

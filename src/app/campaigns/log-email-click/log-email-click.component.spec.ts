import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogEmailClickComponent } from './log-email-click.component';

describe('LogEmailClickComponent', () => {
  let component: LogEmailClickComponent;
  let fixture: ComponentFixture<LogEmailClickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogEmailClickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogEmailClickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

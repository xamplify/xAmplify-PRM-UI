import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessAccountComponent } from './access-account.component';

describe('AccessAccountComponent', () => {
  let component: AccessAccountComponent;
  let fixture: ComponentFixture<AccessAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

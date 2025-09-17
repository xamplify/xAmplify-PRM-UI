import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessDeniedUtilComponent } from './access-denied-util.component';

describe('AccessDeniedUtilComponent', () => {
  let component: AccessDeniedUtilComponent;
  let fixture: ComponentFixture<AccessDeniedUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessDeniedUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessDeniedUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

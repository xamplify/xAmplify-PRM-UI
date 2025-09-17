import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEmailContentComponent } from './dynamic-email-content.component';

describe('DynamicEmailContentComponent', () => {
  let component: DynamicEmailContentComponent;
  let fixture: ComponentFixture<DynamicEmailContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicEmailContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicEmailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

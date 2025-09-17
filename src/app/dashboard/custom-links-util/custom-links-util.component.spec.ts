import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLinksUtilComponent } from './custom-links-util.component';

describe('CustomLinksUtilComponent', () => {
  let component: CustomLinksUtilComponent;
  let fixture: ComponentFixture<CustomLinksUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLinksUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLinksUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

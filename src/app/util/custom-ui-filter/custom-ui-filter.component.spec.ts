import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUiFilterComponent } from './custom-ui-filter.component';

describe('CustomUiFilterComponent', () => {
  let component: CustomUiFilterComponent;
  let fixture: ComponentFixture<CustomUiFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomUiFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomUiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCsvMappingComponent } from './custom-csv-mapping.component';

describe('CustomCsvMappingComponent', () => {
  let component: CustomCsvMappingComponent;
  let fixture: ComponentFixture<CustomCsvMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCsvMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCsvMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

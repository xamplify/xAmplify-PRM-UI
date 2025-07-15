import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PptDesignPickerComponent } from './ppt-design-picker.component';

describe('PptDesignPickerComponent', () => {
  let component: PptDesignPickerComponent;
  let fixture: ComponentFixture<PptDesignPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PptDesignPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PptDesignPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

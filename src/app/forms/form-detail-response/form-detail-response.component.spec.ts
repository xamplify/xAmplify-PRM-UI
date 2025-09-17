import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDetailResponseComponent } from './form-detail-response.component';

describe('FormDetailResponseComponent', () => {
  let component: FormDetailResponseComponent;
  let fixture: ComponentFixture<FormDetailResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDetailResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDetailResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

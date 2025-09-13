import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDefaultTemplateDetailsComponent } from './add-default-template-details.component';

describe('AddDefaultTemplateDetailsComponent', () => {
  let component: AddDefaultTemplateDetailsComponent;
  let fixture: ComponentFixture<AddDefaultTemplateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDefaultTemplateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefaultTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

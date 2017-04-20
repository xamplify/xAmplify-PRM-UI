import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTemplateComponent } from './update-template.component';

describe('UpdateTemplateComponent', () => {
  let component: UpdateTemplateComponent;
  let fixture: ComponentFixture<UpdateTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

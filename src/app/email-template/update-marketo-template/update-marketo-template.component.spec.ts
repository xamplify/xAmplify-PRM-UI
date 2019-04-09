import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMarketoTemplateComponent } from './update-marketo-template.component';

describe('UpdateMarketoTemplateComponent', () => {
  let component: UpdateMarketoTemplateComponent;
  let fixture: ComponentFixture<UpdateMarketoTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateMarketoTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateMarketoTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

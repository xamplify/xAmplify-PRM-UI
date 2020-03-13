import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBeeTemplateComponent } from './create-bee-template.component';

describe('CreateBeeTemplateComponent', () => {
  let component: CreateBeeTemplateComponent;
  let fixture: ComponentFixture<CreateBeeTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBeeTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBeeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

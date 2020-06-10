import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XamplifyDefaultTemplatesComponent } from './xamplify-default-templates.component';

describe('XamplifyDefaultTemplatesComponent', () => {
  let component: XamplifyDefaultTemplatesComponent;
  let fixture: ComponentFixture<XamplifyDefaultTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XamplifyDefaultTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XamplifyDefaultTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

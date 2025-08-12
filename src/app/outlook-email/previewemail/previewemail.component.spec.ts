import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewemailComponent } from './previewemail.component';

describe('PreviewemailComponent', () => {
  let component: PreviewemailComponent;
  let fixture: ComponentFixture<PreviewemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

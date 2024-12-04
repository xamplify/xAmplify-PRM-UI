import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewEmailActivityComponent } from './preview-email-activity.component';

describe('PreviewEmailActivityComponent', () => {
  let component: PreviewEmailActivityComponent;
  let fixture: ComponentFixture<PreviewEmailActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewEmailActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewEmailActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

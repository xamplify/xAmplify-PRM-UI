import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundImageUploadComponent } from './background-image-upload.component';

describe('BackgroundImageUploadComponent', () => {
  let component: BackgroundImageUploadComponent;
  let fixture: ComponentFixture<BackgroundImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

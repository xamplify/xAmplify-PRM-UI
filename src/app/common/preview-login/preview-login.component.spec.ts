import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLoginComponent } from './preview-login.component';

describe('PreviewLoginComponent', () => {
  let component: PreviewLoginComponent;
  let fixture: ComponentFixture<PreviewLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

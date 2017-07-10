import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoaderComponent } from './social-loader.component';

describe('SocialLoaderComponent', () => {
  let component: SocialLoaderComponent;
  let fixture: ComponentFixture<SocialLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

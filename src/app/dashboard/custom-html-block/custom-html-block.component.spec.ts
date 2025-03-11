import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHtmlBlockComponent } from './custom-html-block.component';

describe('CustomHtmlBlockComponent', () => {
  let component: CustomHtmlBlockComponent;
  let fixture: ComponentFixture<CustomHtmlBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomHtmlBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomHtmlBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

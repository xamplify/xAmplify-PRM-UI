import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlSampleComponent } from './html-sample.component';

describe('HtmlSampleComponent', () => {
  let component: HtmlSampleComponent;
  let fixture: ComponentFixture<HtmlSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

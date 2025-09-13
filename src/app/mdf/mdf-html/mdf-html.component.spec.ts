import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdfHtmlComponent } from './mdf-html.component';

describe('MdfHtmlComponent', () => {
  let component: MdfHtmlComponent;
  let fixture: ComponentFixture<MdfHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdfHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdfHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
